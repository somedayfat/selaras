import os
import re
import sys
import time
import io
import shutil
import unicodedata
import logging
import argparse

try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

try:
    import rembg
    from PIL import Image
    from icrawler.builtin import BingImageCrawler
except ImportError:
    print("❌ Library pendukung belum diinstall!")
    print("Jalankan perintah ini di terminal Anda terlebih dahulu:")
    print("pip install rembg pillow icrawler")
    sys.exit(1)

# Menonaktifkan logging bawaan icrawler yang sangat panjang agar tampilan terminal tetap rapi
logging.getLogger('icrawler').setLevel(logging.WARNING)

INPUT_FILE = "produk_smu.md"
OUTPUT_DIR = "output_foto_asli"
TEMP_DIR = "temp_raw_images"
IMAGE_SIZE = (1024, 1024)

# Mapping kata kunci presifik & terukur per produk agar pencarian gambar tidak melenceng (misal Heat Detector tidak download Miami Heat NBA)
KEYWORD_MAP = {
    # Category A: Personal Protective Equipment (PPE)
    'Safety Shoes': 'steel toe safety shoes work boots leather',
    'Safety Helmet': 'construction safety helmet hard hat',
    'Safety Vest': 'high visibility safety vest reflective',
    'Safety Glasses': 'industrial safety glasses protective eyewear',
    'Safety Goggles': 'protective safety goggles clear',
    'Face Shield': 'industrial protective face shield mask',
    'Safety Gloves': 'industrial work safety gloves leather rubber',
    'Ear Plug': 'hearing protection ear plugs cords',
    'Ear Muff': 'industrial hearing protection ear muffs',
    'Respirator': 'industrial respirator gas mask 3M',
    'Disposable Mask': 'disposable protective face mask 3ply',
    'Full Body Harness': 'fall protection full body harness industrial',
    'Lanyard': 'safety lanyard fall protection shock absorber',
    'Coverall': 'industrial protective coverall suit workwear',
    'Wearpack': 'industrial workwear wearpack uniform overall',
    'Raincoat': 'industrial safety raincoat heavy duty suit',
    'Safety Belt': 'industrial safety waist belt harness',
    'Welding Apron': 'leather welding apron protective heat resistant',
    'Chemical Suit': 'hazmat chemical protective suit yellow',
    'Life Jacket': 'marine safety life jacket vest orange',

    # Category B: Fire Safety Equipment
    'APAR': 'fire extinguisher APAR red cylinder',
    'Fire Hose': 'fire fighting hose canvas red nozzle',
    'Hydrant Box': 'fire hydrant box red indoor outdoor',
    'Hydrant Valve': 'fire hydrant landing valve brass red',
    'Hose Reel': 'fire hose reel red swinging type',
    'Fire Alarm System': 'fire alarm control panel red box',
    'Smoke Detector': 'smoke detector fire alarm ceiling sensor white',
    'Heat Detector': 'heat detector fire alarm device sensor',
    'Manual Call Point': 'manual call point fire alarm break glass red',
    'Emergency Lamp': 'emergency light twin spot fixture ceiling',
    'Exit Sign': 'emergency exit sign light green led',
    'Fire Blanket': 'fire emergency blanket fiberglass red box pouch',
    'SCBA': 'SCBA self contained breathing apparatus air tank',
    'Fire Pump': 'fire fighting pump diesel electric system red',
    'Foam System': 'fire fighting foam proportioner system tank',

    # Category C: Industrial Tools & Equipment
    'Hand Tools': 'industrial hand tools set wrench pliers screwdriver',
    'Power Tools': 'electric power tools drill angle grinder cordless',
    'Air Tools': 'pneumatic air tools impact wrench pneumatic',
    'Measuring Tools': 'industrial measuring tools vernier caliper micrometer',
    'Torque Wrench': 'click type torque wrench tool mechanical',
    'Welding Machine': 'inverter welding machine MMA TIG MIG portable',
    'Cutting Machine': 'metal cutting saw machine abrasive chop saw',
    'Compressor': 'industrial air compressor tank electric motor',
    'Generator Set': 'genset industrial diesel generator set soundproof',
    'Pressure Washer': 'high pressure washer machine industrial heavy duty',
    'Industrial Vacuum Cleaner': 'wet dry industrial vacuum cleaner stainless steel',
    'Work Bench': 'industrial heavy duty work bench table drawer',
    'Tool Cabinet': 'industrial workshop tool cabinet roller chest',

    # Category D: Mechanical & Industrial Spare Parts
    'Bearing': 'ball bearing industrial steel roller bearing',
    'Gear': 'industrial spur gear helical metal pinion',
    'Gearbox': 'industrial speed reducer gearbox motor',
    'Chain': 'industrial roller chain steel drive transmission',
    'Sprocket': 'industrial roller chain sprocket gear wheel',
    'Pulley': 'industrial V-belt pulley sheave cast iron',
    'Belt': 'industrial v-belt power transmission rubber drive',
    'Coupling': 'industrial flexible shaft coupling jaw spider',
    'Shaft': 'industrial precision steel transmission shaft bar',
    'Seal': 'industrial oil seal rotary shaft rubber TC',
    'O-Ring': 'rubber o-ring seal ring gasket black nitril',
    'Gasket': 'industrial flange gasket sheet material spiral wound',
    'Spring': 'industrial compression spring coil steel heavy duty',
    'Fastener': 'industrial bolts nuts screws fasteners assortment',
    'Bolt & Nut': 'hex bolt and nut steel industrial zinc plated',
    'Washer': 'flat lock spring washer steel industrial',
    'Anchor Bolt': 'concrete anchor bolt expansion sleeve bolt',
    'Clamp': 'industrial pipe hose clamp heavy duty stainless steel',
    'Valve': 'industrial ball valve gate valve flanged cast steel',
    'Industrial Lubricant': 'industrial gear oil grease lubricant drum pail',

    # Category E: Electrical Supplies
    'Cable': 'industrial electrical power cable wire spool copper',
    'Cable Tray': 'perforated steel cable tray trunking galvanized',
    'Cable Ladder': 'galvanized steel cable ladder electrical heavy duty',
    'Conduit': 'electrical metallic conduit pipe PVC EMT fittings',
    'Junction Box': 'electrical waterproof junction box enclosure plastic metal',
    'MCB': 'miniature circuit breaker MCB DIN rail electrical',
    'MCCB': 'molded case circuit breaker MCCB electrical 3 pole',
    'ACB': 'air circuit breaker ACB power distribution panel',
    'Contactor': 'AC magnetic contactor electrical motor starter Schneider ABB',
    'Relay': 'electrical control relay 8 pin 14 pin socket base',
    'Push Button': 'industrial control push button switch panel 22mm',
    'Panel Box': 'electrical control panel box enclosure wall mount metal',
    'Transformer': 'industrial electrical transformer step down step up',
    'Inverter': 'industrial power inverter solar VFD drive',
    'VFD': 'variable frequency drive VFD AC motor speed controller',
    'Industrial Plug': 'industrial plug socket CEE 3 phase waterproof 32A',
    'Socket Outlet': 'industrial electrical socket outlet wall mounted IP67',
    'LED Lighting': 'industrial High Bay LED light fixture floodlight warehouse',

    # Category F: Instrumentation & Automation
    'PLC': 'programmable logic controller PLC Siemens S7 Omron Mitsubishi module',
    'HMI': 'human machine interface HMI touch screen panel display industrial',
    'Sensor': 'industrial automation sensor photoelectric proximity ultrasonic',
    'Proximity Sensor': 'inductive proximity sensor switch NPN PNP M12',
    'Photoelectric Sensor': 'photoelectric sensor retro reflective diffuse Omron Sick',
    'Encoder': 'rotary optical shaft encoder incremental absolute industrial',
    'Pressure Gauge': 'industrial pressure gauge dial stainless steel bottom connection',
    'Temperature Controller': 'digital temperature controller PID sensor RKC Autonics',
    'Flow Meter': 'industrial liquid water flow meter digital electromagnetic turbine',
    'Level Sensor': 'liquid level sensor transmitter ultrasonic float switch',
    'Digital Meter': 'digital panel meter ammeter voltmeter multi meter panel',
    'Industrial Controller': 'industrial automation process controller panel mount',

    # Category G: Pneumatic & Hydraulic
    'Air Cylinder': 'pneumatic air cylinder double acting ISO standard SMC Festo',
    'Solenoid Valve': 'pneumatic solenoid valve air control 5/2 way 24V 220V',
    'FRL Unit': 'pneumatic air filter regulator lubricator FRL unit combo',
    'Pneumatic Fitting': 'pneumatic push in fitting connector elbow straight male',
    'Pneumatic Hose': 'pneumatic polyurethane PU air hose tubing roll',
    'Hydraulic Pump': 'industrial hydraulic gear vane axial piston pump',
    'Hydraulic Cylinder': 'heavy duty hydraulic cylinder ram double acting',
    'Hydraulic Hose': 'high pressure hydraulic hose assembly steel braided fittings',
    'Hydraulic Valve': 'hydraulic directional control valve spool solenoid manifold',

    # Category H: Building Materials
    'Cement': 'bag of Portland cement construction material 40kg 50kg',
    'Steel': 'structural steel beam I-beam H-beam channel steel',
    'Rebar': 'deformed steel rebar concrete reinforcement bar',
    'Hollow': 'hollow steel tube pipe square rectangular structural box',
    'Galvanized Steel': 'galvanized steel sheet coil plate GI sheet',
    'Gypsum': 'gypsum board plasterboard sheet drywall ceiling Jayaboard',
    'Ceiling': 'suspended ceiling tiles acoustic grid system PVC ceiling',
    'Ceramic': 'ceramic floor wall tile floor tiles polished porcelain',
    'Granite': 'granite tile slab polished floor tiles 60x60',
    'Vinyl Flooring': 'plank vinyl flooring sheet commercial wood pattern',
    'Roofing': 'corrugated metal roofing sheet galvalume zinc metal roof',
    'Waterproofing': 'liquid membrane waterproofing chemical drum bucket Aquaproof Sika',
    'Paint': 'industrial wall metal paint bucket container pail Dulux Nippon',
    'Insulation Material': 'rockwool glasswool thermal insulation material roll foil',

    # Category I: Plumbing & Sanitary
    'PVC Pipe': 'PVC plastic pipe fitting plumbing water supply Rucika',
    'HDPE Pipe': 'black HDPE pipe roll water supply high density polyethylene',
    'PPR Pipe': 'green PPR pipe plumbing hot cold water fusion',
    'Fittings': 'pipe fittings elbow tee coupling adapter PVC brass steel',
    'Water Pump': 'electric centrifugal water pump machine booster Shallow deep well',
    'Water Tank': 'plastic stainless steel water storage tank penguin fiberglass',
    'Faucet': 'commercial stainless steel water faucet tap sink basin',
    'Sanitary Equipment': 'bathroom toilet sanitary porcelain fixture closet sink',

    # Category J: HVAC Equipment
    'Air Conditioner': 'commercial duct split AC air conditioner outdoor unit Daikin Panasonic',
    'AHU': 'air handling unit AHU HVAC central system commercial',
    'FCU': 'fan coil unit FCU HVAC indoor ceiling concealed unit',
    'Exhaust Fan': 'industrial ventilation exhaust wall fan louver heavy duty',
    'Blower': 'industrial centrifugal air blower fan suction ventilation',
    'Ducting': 'galvanized sheet metal air ducting HVAC spiral rectangular',
    'Flexible Duct': 'insulated flexible air ducting HVAC aluminum foil hose',
    'Air Filter': 'HVAC AHU panel air filter HEPA prefilter pocket filter frame',
    'Damper': 'HVAC volume control fire damper motorized louver shutter',
    'Ventilation Accessories': 'air diffuser grille louver ventilation HVAC ceiling return',

    # Category K: Office Equipment
    'Laptop': 'modern business laptop computer workspace Dell ThinkPad HP',
    'Desktop PC': 'office desktop computer monitor tower PC set',
    'Workstation': 'tower workstation PC computer high performance graphics Dell Precision HP Z',
    'Server': 'rackmount enterprise server computer Dell PowerEdge HP ProLiant 2U',
    'Printer': 'office laser multifunction printer scanner copier Epson Canon HP',
    'Scanner': 'document scanner office high speed sheetfed flatbed Fujitsu Canon',
    'Projector': 'office video projector ceiling mount Epson BenQ Sony',
    'Interactive Display': 'interactive smart whiteboard touch display panel conference',
    'Monitor': 'desktop LCD LED computer monitor screen IPS 24 inch 27 inch',
    'UPS': 'uninterruptible power supply UPS battery backup APC Eaton 1000VA 2000VA',
    'Photocopier': 'office digital photocopier multifunction printer Xerox Fuji Kyocera',
    'Attendance Machine': 'biometric fingerprint time attendance machine access control Solution ZK',

    # Category L: IT & Networking
    'Server Rack': '42U server rack cabinet enclosure datacenter 19 inch network',
    'Network Cabinet': 'wall mount network cabinet rack enclosure 6U 9U 12U',
    'Router': 'enterprise ethernet network router Cisco MikroTik Ubiquiti Gigabit',
    'Switch': 'gigabit ethernet network switch rackmount 24 port 48 port Cisco Aruba',
    'Firewall': 'network security appliance firewall gateway Fortinet PaloAlto Sophos',
    'Wireless Access Point': 'ceiling wireless access point AP wifi Ubiquiti Aruba Cisco',
    'Patch Panel': '24 port CAT6 patch panel rackmount network cabling AMP Panduit',
    'LAN Cable': 'CAT6 UTP LAN ethernet network cable roll 305m Belden Schneider',
    'Fiber Optic': 'fiber optic cable patch cord LC SC singlemode multimode',
    'Network Accessories': 'RJ45 connectors crimping tool network cable tester kit',

    # Category M: Security System
    'CCTV': 'CCTV dome bullet security camera system Hikvision Dahua',
    'IP Camera': 'network IP camera security surveillance outdoor indoor Hikvision',
    'DVR': 'digital video recorder DVR CCTV system 8 channel 16 channel',
    'NVR': 'network video recorder NVR IP camera security 16 channel 32 channel',
    'Access Control': 'door access control RFID card keypad controller reader standalone',
    'Door Lock': 'smart electronic magnetic door lock system glass wooden door EM lock',
    'Fingerprint System': 'fingerprint door access reader biometric terminal ZKTeco',
    'Face Recognition': 'facial recognition access control terminal camera attendance',
    'Boom Gate': 'automatic barrier boom gate parking system entrance gate',
    'Metal Detector': 'walk through security metal detector gate scanner airport mall',

    # Category N: Office Furniture
    'Office Desk': 'modern wooden office executive desk table workstation',
    'Office Chair': 'ergonomic mesh office chair high back swivel adjustable armrest',
    'Executive Furniture': 'executive office desk leather armchair luxury suite setup',
    'Meeting Table': 'conference meeting room table office wooden modular',
    'Filing Cabinet': 'metal filing cabinet 4 drawers office steel locker',
    'Locker': 'metal staff locker cabinet office school 6 door 9 door steel',
    'Mobile Compactor': 'mobile compactor shelving system office storage manual mechanical',
    'Shelving System': 'metal storage shelving unit office archive rack boltless',

    # Category O: Warehouse Equipment
    'Pallet Rack': 'heavy duty warehouse pallet racking system selective rack beam frame',
    'Medium Rack': 'medium duty warehouse storage rack shelving steel panel',
    'Heavy Duty Rack': 'industrial heavy duty storage racking warehouse pallet system',
    'Hand Pallet': 'hydraulic hand pallet truck jack 2 ton 3 ton red yellow',
    'Forklift': 'industrial forklift truck warehouse diesel electric Toyota TCM',
    'Drum Trolley': 'steel drum handling trolley cart lifter 200L oil drum',
    'Plastic Pallet': 'heavy duty blue plastic pallet warehouse grid flat heavy duty',
    'Storage Bin': 'plastic stackable storage bin container warehouse parts box',
    'Wire Mesh Deck': 'wire mesh decking for pallet rack storage steel galvanized',

    # Category P: Packaging Materials
    'Stretch Film': 'clear plastic stretch film wrap roll pallet packaging hand roll',
    'Bubble Wrap': 'protective bubble wrap roll packaging air cushion clear',
    'OPP Tape': 'brown transparent OPP packing tape roll sealing box Daimaru',
    'Strapping Band': 'PP PET plastic strapping band roll packing manual machine',
    'Carton Box': 'corrugated cardboard shipping carton box brown packing box',
    'Plastic Bag': 'polybag plastic packaging bag clear transparent PE PP',
    'Label Sticker': 'thermal barcode sticker label roll adhesive direct thermal roll',
    'Packing Foam': 'EPE polyethylene packing foam sheet roll protective white',

    # Category Q: Cleaning & Housekeeping
    'Cleaning Chemical': 'industrial floor cleaning chemical gallon liquid concentrated',
    'Floor Cleaner': 'floor cleaning detergent liquid bottle gallon commercial',
    'Glass Cleaner': 'spray bottle glass cleaner blue liquid window cleaning',
    'Degreaser': 'heavy duty industrial degreaser chemical cleaner engine floor gallon',
    'Tissue': 'commercial tissue paper roll facial towel dispenser jumbo roll',
    'Soap Dispenser': 'automatic wall mounted liquid soap dispenser sensor commercial',
    'Garbage Bin': 'industrial plastic trash garbage bin wheelie 120L 240L outdoor',
    'Vacuum Cleaner': 'heavy duty commercial wet dry vacuum cleaner stainless steel 30L 60L',
    'Floor Scrubber': 'automatic floor scrubber dryer machine commercial ride on walk behind',

    # Category R: Medical & First Aid
    'First Aid Kit': 'emergency first aid kit box wall mounted red bag P3K',
    'Stretcher': 'emergency medical folding stretcher transport aluminum alloy',
    'Wheelchair': 'medical patient folding wheelchair steel chrome lightweight',
    'Oxygen Cylinder': 'medical oxygen tank cylinder green regulator flowmeter trolley',
    'Thermometer': 'medical infrared digital forehead thermometer contactless Omron',
    'Blood Pressure Monitor': 'digital blood pressure monitor cuff medical Omron upper arm',
    'Pulse Oximeter': 'fingertip pulse oximeter medical sensor oxygen saturation SpO2',
    'AED': 'automated external defibrillator AED emergency medical box HeartStart Zoll',
    'Medical Consumables': 'medical surgical gloves gauze bandage syringe consumables',

    # Category S: Laboratory Equipment
    'Digital Scale': 'precision laboratory digital analytical scale balance 0.001g Mettler',
    'pH Meter': 'digital benchtop portable pH meter laboratory electrode tester Hanna',
    'Conductivity Meter': 'laboratory conductivity meter water quality testing meter',
    'Microscope': 'laboratory biological binocular compound microscope LED Olympus',
    'Glassware': 'laboratory glassware beaker erlenmeyer flask test tube pyrex glass',
    'Laboratory Chemicals': 'reagent bottle laboratory chemicals glass bottle amber',
    'Laboratory Furniture': 'laboratory workbench fume hood island bench stainless steel',

    # Category T: Uniform & Garment
    'Office Uniform': 'formal corporate office uniform shirt suit menswear womenswear',
    'Industrial Uniform': 'industrial workwear uniform shirt pants safety uniform set',
    'Polo Shirt': 'collared cotton polo shirt uniform corporate embroidered logo',
    'T-Shirt': 'crew neck cotton t-shirt apparel promo shirt plain',
    'Jacket': 'industrial work safety jacket windbreaker bomber parka',
    'Cap': 'baseball cap hat uniform promotional custom logo embroidered',
    'Safety Boots': 'rubber PVC waterproof safety boots work knee high yellow black',

    # Category U: Pantry & Hospitality
    'Drinking Water': 'bottled gallon mineral drinking water dispenser Aqua Pristine',
    'Coffee & Tea': 'coffee beans tea bags commercial box Nescafe SariWangi',
    'Snacks': 'assorted office snacks biscuits package breakroom',
    'Refrigerator': 'commercial stainless steel double door refrigerator showcase',
    'Microwave': 'office kitchen microwave oven stainless digital Panasonic Sharp',
    'Water Dispenser': 'hot cold standing water dispenser appliance bottom loading',
    'Kitchen Equipment': 'commercial stainless steel kitchen cooking equipment stove sink',

    # Category V: Renewable Energy & Utilities
    'Solar Panel': 'photovoltaic solar panel module silicon monocrystalline tier 1',
    'Solar Street Light': 'all in one solar street light LED pole outdoor waterproof',
    'Battery System': 'lithium deep cycle solar battery system bank LiFePO4 rack',
    'Power Backup System': 'industrial power supply backup inverter cabinet cabinet',

    # Category W: Promotional & Corporate Merchandise
    'Souvenir': 'corporate souvenir gift set customized logo branded item',
    'Gift Set': 'executive promotional gift set box notebook pen powerbank USB',
    'Trophy': 'metal crystal award trophy cup achievement competition',
    'Plaque': 'wooden acrylic award recognition plaque custom engraved',
    'Calendar': 'corporate desk wall calendar custom printed spiral bound',
    'Agenda': 'leather notebook agenda planner organizer diary custom',
    'Tumbler': 'stainless steel vacuum insulated water tumbler bottle hydro flask type',
    'Mug': 'ceramic coffee mug promotional custom logo printed white mug',
    'Corporate Uniform': 'corporate executive shirt polo uniform custom embroidery',
}

def parse_product_list(filepath):
    items = []
    category_header = re.compile(r"^\s*#{2,3}\s*([A-Z])\.\s*(.+)$")
    bullet = re.compile(r"^\s*[\*\-]\s+(.+)$")
    current_letter = None
    current_name = None

    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            header_match = category_header.match(line)
            if header_match:
                current_letter = header_match.group(1).strip()
                current_name = header_match.group(2).strip()
                continue
            bullet_match = bullet.match(line)
            if bullet_match and current_letter:
                product_name = bullet_match.group(1).strip()
                items.append({
                    "category": current_letter,
                    "category_name": current_name,
                    "product": product_name,
                })
    return items

def slugify(name):
    name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    name = re.sub(r"[^\w\s-]", "", name)
    name = re.sub(r"\s+", "_", name.strip())
    return name

def is_valid_cutout(img_rgba):
    """
    Memvalidasi hasil rembg agar tidak menyimpan gambar kosong, 
    gambar bercak abu-abu/asap (noise), atau gambar yang tidak terhapus background-nya.
    """
    alpha = img_rgba.split()[3]
    bbox = alpha.getbbox()
    if not bbox:
        return False  # Hasil rembg transparan total / kosong
    
    w, h = img_rgba.size
    total_pixels = w * h
    
    bw = bbox[2] - bbox[0]
    bh = bbox[3] - bbox[1]
    bbox_area = bw * bh
    
    # Bounding box terlalu kecil (kurang dari 3% luas kanvas -> noise/asap/bintik)
    if bbox_area / total_pixels < 0.03:
        return False
        
    # Hitung jumlah piksel nontransparan (alpha > 30)
    alpha_data = alpha.get_flattened_data() if hasattr(alpha, 'get_flattened_data') else alpha.getdata()
    visible_pixels = sum(1 for p in alpha_data if p > 30)
    fill_ratio = visible_pixels / total_pixels
    
    # Rasio piksel tampak yang wajar untuk produk ber-background putih (3% s/d 88%)
    if fill_ratio < 0.03 or fill_ratio > 0.88:
        return False
        
    return True

def remove_background_and_save(image_path, output_path):
    try:
        with open(image_path, "rb") as f:
            image_bytes = f.read()

        if len(image_bytes) < 3000:
            # File terlalu kecil / korup
            return False

        output_image_bytes = rembg.remove(image_bytes)
        img = Image.open(io.BytesIO(output_image_bytes)).convert("RGBA")
        
        # Validasi kualitas cutout AI
        if not is_valid_cutout(img):
            return False

        img.thumbnail((800, 800), Image.Resampling.LANCZOS)
        
        background = Image.new("RGBA", IMAGE_SIZE, (255, 255, 255, 255))
        bg_w, bg_h = background.size
        img_w, img_h = img.size
        offset = ((bg_w - img_w) // 2, (bg_h - img_h) // 2)
        background.paste(img, offset, img)
        
        final_image = background.convert("RGB")
        final_image.save(output_path, "JPEG", quality=92)
        return True
    except Exception as e:
        print(f"    ⚠️ Gagal memproses gambar dengan AI: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Download & Rembg foto produk presisi")
    parser.add_argument("--overwrite", action="store_true", help="Timpa file gambar yang sudah ada")
    parser.add_argument("--filter", type=str, default="", help="Proses produk tertentu saja (contoh: Heat Detector)")
    args = parser.parse_args()

    if not os.path.exists(INPUT_FILE):
        print(f"❌ File '{INPUT_FILE}' tidak ditemukan.")
        return

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    items = parse_product_list(INPUT_FILE)
    
    if args.filter:
        items = [it for it in items if args.filter.lower() in it["product"].lower()]
        print(f"🔍 Filter aktif: mencari '{args.filter}' ({len(items)} produk cocok)")

    total_products = len(items)

    print(f"\n📋 Ditemukan {total_products} produk untuk diproses.")
    print(f"📁 Hasil akhir disimpan di: ./{OUTPUT_DIR}/\n")

    success_count = 0
    fail_count = 0

    for i, item in enumerate(items, start=1):
        product_name = item["product"]
        category = item["category"]
        category_name = item["category_name"]
        
        filename = f"{i:03d}_{category}_{slugify(product_name)}_real.jpg"
        filepath = os.path.join(OUTPUT_DIR, filename)

        if os.path.exists(filepath) and not args.overwrite:
            print(f"[{i}/{total_products}] ⏭️  {product_name} - sudah ada, skip (gunakan --overwrite untuk menimpa)")
            success_count += 1
            continue

        print(f"[{i}/{total_products}] 🔍 Mencari presisi: {product_name} ({category_name})...")
        
        # Penentuan kata kunci presisi
        default_query = f"{product_name} {category_name} product equipment"
        query = KEYWORD_MAP.get(product_name, default_query)
        
        # Bersihkan folder temporary
        if os.path.exists(TEMP_DIR):
            shutil.rmtree(TEMP_DIR, ignore_errors=True)
        os.makedirs(TEMP_DIR, exist_ok=True)
        
        try:
            print(f"    📥 Query Bing: '{query}'")
            bing_crawler = BingImageCrawler(storage={'root_dir': TEMP_DIR}, downloader_threads=1)
            # Ambil hingga 5 calon gambar untuk memverifikasi kualitas rembg terlaris
            bing_crawler.crawl(keyword=query, max_num=5)
            
            downloaded_files = sorted([f for f in os.listdir(TEMP_DIR) if f.endswith(('.jpg', '.jpeg', '.png', '.webp'))])
            
            if not downloaded_files:
                print(f"    ⚠️ Tidak ada gambar yang berhasil didownload.")
                fail_count += 1
                continue
                
            success = False
            for idx, dl_file in enumerate(downloaded_files, start=1):
                raw_path = os.path.join(TEMP_DIR, dl_file)
                print(f"    ✂️  Coba kandidat #{idx} dengan AI rembg...")
                if remove_background_and_save(raw_path, filepath):
                    print(f"    ✅ Selesai: {filename}")
                    success = True
                    break
                else:
                    print(f"    ⚠️ Kandidat #{idx} tidak valid / tidak sesuai, mencoba kandidat berikutnya...")
                    
            if success:
                success_count += 1
            else:
                print(f"    ❌ Semua kandidat gambar gagal diproses untuk {product_name}.")
                fail_count += 1
                
        except Exception as e:
            print(f"    ❌ Error: {e}")
            fail_count += 1
            
        time.sleep(1)

    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR, ignore_errors=True)

    print("\n" + "=" * 50)
    print(f"SELESAI: {success_count}/{total_products} foto berhasil didownload & diproses AI.")
    print("=" * 50)

if __name__ == "__main__":
    main()
