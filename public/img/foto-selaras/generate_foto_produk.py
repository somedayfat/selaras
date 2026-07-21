"""
Generate Foto Produk Massal - Kalz Studio (v4 - Color-Accurate Marketplace Style)
===================================================================================
Perubahan dari v3:
1. MASALAH UTAMA SEBELUMNYA: prompt "Pure white background (#FFFFFF)" terlalu
   dominan, model nyampur warna background ke warna produk itu sendiri.
   Safety Shoes jadi putih casual, Helm jadi krem pucat, Bearing jadi abu-abu
   pucat. Solusinya: framing prompt diubah agar model PAHAM bahwa yang putih
   cuma background-nya, BUKAN produknya.

2. Ditambah CATEGORY_COLOR_HINT — kamus warna/material realistis per kategori.
   Sekarang model dikasih tahu "sepatu safety = hitam atau cokelat gelap",
   "bearing = baja silver mengkilap", dll. Jadi warnanya wajar di dunia nyata.

3. OVERRIDES kini sekaligus ngasih warna + disambiguasi dalam satu entry.
   Sepatu safety, helm, harness, dll yang paling parah salah warnanya sudah
   dimasukkan entry spesifik.

4. Template prompt diubah: urutan kalimat diperkuat agar model "mendahulukan"
   deskripsi produk sebelum gaya foto. Yang disebut duluan biasanya lebih
   berpengaruh ke output model.

Engine: Pollinations.ai (gratis, unlimited, no API key, no signup)
https://pollinations.ai

CARA PAKAI:
1. Install requirement:
     pip install requests --break-system-packages
   (kalau di Windows/Mac biasa, cukup: pip install requests)

2. Taruh file "produk_smu.md" satu folder sama script ini.
   (format: "### A. Nama Kategori" lalu list "* Nama Produk" di bawahnya)

3. Jalankan:
     python generate_foto_produk.py

4. Hasil foto muncul di folder "output_foto/"
   Nama file: 001_A_Safety_Shoes_v1.jpg, 001_A_Safety_Shoes_v2.jpg, dst
   (nomor urut_kategori_nama_versi).

Kalau masih ada hasil yang aneh, tinggal edit entry di OVERRIDES —
sertakan warna asli produknya dengan kalimat eksplisit (mis: 'black leather',
'yellow hard plastic'). Hapus file gambar yang mau di-regenerate, jalanin ulang.
"""

import argparse
import os
import re
import sys
import time
import unicodedata
import urllib.parse
import requests

# ============================================================
# KONFIGURASI
# ============================================================

INPUT_FILE = "produk_smu.md"
OUTPUT_DIR = "output_foto"
IMAGE_WIDTH = 1024
IMAGE_HEIGHT = 1024
# Catatan jujur: Pollinations.ai gratis versi publik saat ini hanya punya
# SATU model aktif di backend-nya, terlepas dari nilai --model yang dikirim.
# Parameter model tetap dikirim ke API, kalau suatu saat mereka aktifkan
# multi-model lagi, script ini langsung support. Sekarang bisa dicoba:
#   python generate_foto_produk.py --model flux      (default)
#   python generate_foto_produk.py --model sana
MODEL = "flux"
DELAY_BETWEEN_REQUESTS = 3
MAX_RETRIES = 3
VARIANTS_PER_PRODUCT = 2  # <- generate berapa versi per produk

# ============================================================
# KONTEKS PER KATEGORI - fallback singkat kalau produk tidak ada di OVERRIDES
# Format: "[warna/material] [deskripsi singkat]"
# Pendek dan to-the-point, karena ini cuma fallback.
# ============================================================

CATEGORY_CONTEXT = {
    "A": "industrial PPE safety equipment",
    "B": "red fire safety firefighting equipment",
    "C": "gray metal industrial hand tool",
    "D": "steel metal mechanical spare part",
    "E": "industrial electrical component",
    "F": "gray industrial instrumentation sensor device",
    "G": "silver aluminum pneumatic hydraulic component",
    "H": "gray construction building material",
    "I": "plastic or metal plumbing pipe fitting",
    "J": "HVAC mechanical equipment unit",
    "K": "black silver office electronic device",
    "L": "black dark gray IT networking hardware",
    "M": "black security system device",
    "N": "brown black office furniture",
    "O": "blue gray warehouse material handling equipment",
    "P": "industrial packaging material supply",
    "Q": "cleaning housekeeping product",
    "R": "medical first aid equipment",
    "S": "stainless steel laboratory scientific instrument",
    "T": "dark blue industrial workwear uniform garment",
    "U": "pantry hospitality product",
    "V": "dark blue black renewable energy power equipment",
    "W": "gold silver corporate promotional merchandise",
}

# ============================================================
# WARNA/MATERIAL HINT PER KATEGORI
# Ini kasih konteks ke model: warna produk di dunia nyata itu seperti apa.
# Tujuannya agar model TIDAK menyamakan warna produk dengan background putih.
# ============================================================

CATEGORY_COLOR_HINT = {
    "A": "The product has its natural real-world industrial color (safety shoes are dark black or brown leather, helmets are hard yellow/orange/white/red plastic shell, harnesses are black or orange nylon webbing).",
    "B": "The product has its natural real-world color (fire extinguisher is bright red metal, fire hose is red or orange fabric, hydrant box is red painted metal).",
    "C": "The product has its natural real-world color (metal tools are gray or chrome steel, power tools are black or yellow plastic and metal body).",
    "D": "The product has its natural real-world color (bearings and gears are shiny steel silver or dark gray metal, chains are dark metal links, belts are black rubber).",
    "E": "The product has its natural real-world color (cables are colored PVC insulation - red, black, yellow, blue; panel boxes are gray painted metal; MCB is black plastic).",
    "F": "The product has its natural real-world color (sensors and controllers are dark gray or black plastic housing, pressure gauges are stainless steel with white dial face).",
    "G": "The product has its natural real-world color (pneumatic cylinders are shiny silver aluminum, solenoid valves are black or dark gray metal and coil).",
    "H": "The product has its natural real-world color (cement is gray powder, steel is shiny silver metal, rebar is dark gray or rusty brown steel rod).",
    "I": "The product has its natural real-world color (PVC pipe is white or gray plastic, HDPE pipe is black plastic, metal fittings are brass or stainless silver).",
    "J": "The product has its natural real-world color (AC units are white plastic casing, exhaust fans are dark gray metal, ducting is silver galvanized metal).",
    "K": "The product has its natural real-world color (laptops are black or silver aluminum, monitors have black plastic bezel, printers are gray or white plastic).",
    "L": "The product has its natural real-world color (network switches are black or dark gray metal rack unit, LAN cables are colored PVC, fiber optic is orange or yellow).",
    "M": "The product has its natural real-world color (CCTV cameras are black or white plastic/metal dome, access control panels are dark gray or black plastic).",
    "N": "The product has its natural real-world color (office desk is brown wood veneer or black laminate, office chair is black mesh or fabric).",
    "O": "The product has its natural real-world color (pallet racks are gray or blue painted steel, forklifts are yellow, hand pallets are blue or red steel).",
    "P": "The product has its natural real-world color (stretch film is clear transparent plastic, carton boxes are brown cardboard, bubble wrap is clear).",
    "Q": "The product has its natural real-world color (cleaning chemicals are in colored plastic bottles, garbage bins are dark colored plastic).",
    "R": "The product has its natural real-world color (first aid kit is red box, stretcher is gray or green fabric, oxygen cylinder is green or black steel cylinder).",
    "S": "The product has its natural real-world color (digital scale is stainless steel, microscope is black metal, lab glassware is clear transparent glass).",
    "T": "The product has its natural real-world color (industrial uniforms are dark blue, orange, or khaki fabric, polo shirts have distinct color, not white fabric).",
    "U": "The product has its natural real-world color (refrigerator is silver or white appliance, water dispenser is white or gray plastic, packaged snacks are colorful).",
    "V": "The product has its natural real-world color (solar panels are dark blue/black, batteries are dark gray or black, generators are yellow or green metal).",
    "W": "The product has its natural real-world color (trophies are gold/silver metallic, plaques are dark wood or metal, tumblers are stainless silver).",
}

# ============================================================
# KAMUS DISAMBIGUASI + WARNA PER PRODUK
# Format: "[warna] [nama produk], [detail singkat]"
# PENTING: warna harus SEBELUM nama produk (token position matters!)
# Pendek dan spesifik — JANGAN tulis kalimat panjang.
# ============================================================

OVERRIDES = {
    # === PPE ===
    "Safety Shoes": "black leather steel-toe safety work boots",
    "Safety Helmet": "yellow hard hat construction safety helmet",
    "Safety Vest": "orange high-visibility reflective safety vest",
    "Safety Glasses": "clear lens black frame industrial safety glasses",
    "Safety Goggles": "clear lens gray frame full-seal industrial safety goggles",
    "Full Body Harness": "black orange nylon fall protection full body harness, D-rings and buckles",
    "Lanyard": "black nylon safety lanyard with metal snap hooks",
    "Coverall": "dark blue orange industrial coverall jumpsuit",
    "Wearpack": "dark navy blue wearpack coverall with orange reflective strips",
    "Raincoat": "bright yellow waterproof raincoat jacket and pants set",
    "Safety Belt": "black nylon industrial safety positioning belt, metal buckle",
    "Welding Apron": "dark brown leather welding apron",
    "Chemical Suit": "yellow hazmat chemical protective coverall suit",
    "Life Jacket": "orange maritime life jacket personal flotation device",
    "Respirator": "gray black half-face respirator mask with filter cartridges",
    "Disposable Mask": "light blue disposable surgical dust mask",
    "Safety Gloves": "black leather industrial safety work gloves",
    "Ear Plug": "orange foam cylindrical ear plugs, pair",
    "Ear Muff": "yellow over-ear hearing protection earmuffs",
    "Face Shield": "clear transparent face shield visor on dark headband",
    "SCBA": "industrial SCBA self-contained breathing apparatus, black mask and red cylinder",

    # === Fire Safety ===
    "APAR": "bright red fire extinguisher cylinder with black handle",
    "Fire Hose": "rolled red fire hose",
    "Hydrant Box": "red painted steel fire hydrant box cabinet",
    "Hydrant Valve": "red metal fire hydrant valve",
    "Hose Reel": "red fire hose reel mounted on wall",
    "Manual Call Point": "red fire alarm manual call point break-glass button",
    "Heat Detector": "white dome ceiling-mounted fire heat detector",
    "Smoke Detector": "white dome ceiling-mounted fire smoke detector",
    "Exit Sign": "green illuminated emergency exit sign",
    "Fire Blanket": "folded fire blanket in red storage case",
    "Foam System": "red silver industrial fire suppression foam system tank with pipes",
    "Fire Pump": "red industrial fire pump unit",

    # === Mechanical spare parts ===
    "Bearing": "shiny steel silver ball bearing ring",
    "Seal": "black rubber silver metal round mechanical oil seal ring",
    "Belt": "black rubber industrial V-belt drive belt",
    "Chain": "dark steel metal roller chain for power transmission",
    "Spring": "silver steel coil spring",
    "Washer": "small flat steel metal fastener washer ring",
    "Gear": "silver steel machined gear wheel",
    "Sprocket": "dark steel toothed sprocket wheel",
    "Pulley": "dark gray cast iron industrial pulley sheave",
    "Gearbox": "dark gray black painted cast iron industrial gearbox unit",
    "Coupling": "silver steel shaft coupling connector",
    "Shaft": "shiny silver cylindrical steel industrial drive shaft",
    "O-Ring": "small black rubber O-ring seal",
    "Gasket": "flat dark rubber gray fiber gasket ring",
    "Fittings": "brass stainless steel industrial pipe fittings assorted elbows tees",
    "Valve": "silver stainless steel industrial ball valve",
    "Fastener": "assorted steel bolts nuts fasteners",
    "Bolt & Nut": "hex head steel bolt and nut fastener set",

    # === Electrical ===
    "Relay": "dark gray black plastic industrial electrical relay switch",
    "Encoder": "dark gray cylindrical industrial rotary encoder sensor",
    "MCB": "black plastic miniature circuit breaker",
    "MCCB": "black gray molded case circuit breaker",
    "Panel Box": "gray painted steel electrical panel distribution box",
    "Contactor": "blue black industrial electrical contactor",
    "VFD": "dark gray variable frequency drive inverter unit",
    "Cable Tray": "galvanized silver steel cable tray ladder",
    "LED Lighting": "white LED industrial light fixture",

    # === Instrumentation ===
    "Pressure Gauge": "stainless steel pressure gauge with white dial face",
    "Flow Meter": "stainless steel industrial flow meter",

    # === IT / Networking ===
    "Switch": "flat black dark gray network switch with ethernet ports",
    "Server": "black dark gray metal server tower or rack unit",
    "Monitor": "black bezel computer display monitor screen",
    "Server Rack": "black metal server rack cabinet",
    "Firewall": "black dark gray network firewall appliance",

    # === Security ===
    "Metal Detector": "gray plastic walk-through security metal detector gate",
    "Boom Gate": "yellow black striped automatic boom gate barrier arm",
    "CCTV": "black dome CCTV security camera",

    # === Lab ===
    "Digital Scale": "stainless steel digital weighing scale",
    "Glassware": "clear glass laboratory beakers flasks test tubes",
    "Microscope": "black metal optical microscope",

    # === Building ===
    "Hollow": "galvanized silver gray hollow structural steel tube",
    "Rebar": "dark gray steel reinforcing bar rebar rod",
    "Steel": "shiny silver structural steel bar section",

    # === Office / Furniture ===
    "Mobile Compactor": "gray steel mobile filing cabinet compactor system",
    "Office Chair": "black mesh ergonomic office chair",
    "Filing Cabinet": "gray steel office filing cabinet",

    # === Warehouse ===
    "Forklift": "yellow industrial forklift truck",
    "Hand Pallet": "blue red steel hand pallet truck",
    "Pallet Rack": "blue gray steel industrial pallet rack shelving",

    # === Misc ===
    "Cap": "navy blue corporate baseball cap hat",
    "Packing Foam": "cream gray polyurethane packing foam sheets",
    "Trophy": "gold silver corporate award trophy on dark base",
    "Plaque": "engraved corporate award plaque on dark wood backing",
    "Snacks": "assorted colorful packaged snack food products",
    "Clamp": "stainless steel industrial pipe hose clamp",
    "Anchor Bolt": "galvanized steel anchor bolt fastener",
    "Tumbler": "stainless steel insulated tumbler bottle",
    "Mug": "white ceramic coffee mug with corporate logo area",
    "Solar Panel": "dark blue photovoltaic solar panel",
    "Generator Set": "green yellow diesel generator set unit",
    "Industrial Lubricant": "yellow or blue industrial lubricant oil can or drum",
}

# ============================================================
# BARANG YANG DIFOTO GAYA "FLAT LAY" (digelar rata, dilihat dari atas)
# Bukan barang yang berdiri/melayang. Ini khusus untuk item yang normalnya
# "dipakai di tubuh" sehingga AI sering salah gambar kalau tanpa referensi
# badan (jadi bentuk aneh, nyambung ke tangan/kepala palsu, dll).
# Tinggal tambahin nama produk baru di sini kalau ketemu kasus serupa.
# ============================================================

FLAT_LAY_PRODUCTS = {
    "Safety Gloves",
    "Ear Plug",
    "Ear Muff",
    "Respirator",
    "Disposable Mask",
    "Full Body Harness",
    "Lanyard",
    "Coverall",
    "Wearpack",
    "Raincoat",
    "Safety Belt",
    "Welding Apron",
    "Chemical Suit",
    "Life Jacket",
    "Safety Vest",
    "Office Uniform",
    "Industrial Uniform",
    "Corporate Uniform",
    "Polo Shirt",
    "T-Shirt",
    "Jacket",
    "Cap",
}

# ============================================================
# TEMPLATE PROMPT - v5: tag-style, pendek, warna inline di depan
#
# Kenapa diubah lagi dari v4?
# Flux/diffusion model baca prompt seperti KAMUS TAG, bukan paragraf.
# Token di posisi AWAL paling berpengaruh (attention bias).
# Kalimat panjang = token terdilusi = model "lupa" detail awal.
# Solusi: prompt pendek, comma-separated, warna+produk di depan.
# ============================================================

# Boosters kualitas foto produk — ditempel di akhir semua prompt
QUALITY_TAGS = (
    "product photography, pure white background, studio lighting, "
    "sharp focus, photorealistic, commercial product photo, high resolution"
)

PROMPT_TEMPLATE_STANDARD = "{product_desc}, {quality_tags}"

PROMPT_TEMPLATE_FLAT_LAY = (
    "{product_desc}, flat lay top-down view, "
    "laid flat on white surface, {quality_tags}"
)

# ============================================================
# FUNGSI-FUNGSI
# ============================================================

def parse_product_list(filepath):
    """
    Parse file markdown format:
        ### A. Nama Kategori
        * Nama Produk
        * Nama Produk
    Mengembalikan list of dict: {"category": "A", "category_name": "...", "product": "..."}
    """
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


def build_prompt(item):
    product = item["product"]
    category = item["category"]

    # Deskripsi produk: dari OVERRIDES kalau ada (sudah inklude warna),
    # kalau tidak, gabung nama produk + konteks kategori sebagai fallback
    if product in OVERRIDES:
        product_desc = OVERRIDES[product]
    else:
        context = CATEGORY_CONTEXT.get(category, "industrial B2B supply product")
        product_desc = f"{product}, {context}"

    if product in FLAT_LAY_PRODUCTS:
        return PROMPT_TEMPLATE_FLAT_LAY.format(
            product_desc=product_desc,
            quality_tags=QUALITY_TAGS,
        )
    return PROMPT_TEMPLATE_STANDARD.format(
        product_desc=product_desc,
        quality_tags=QUALITY_TAGS,
    )


def generate_image(prompt, seed=None, model=None):
    if model is None:
        model = MODEL
    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}"
    params = {
        "width": IMAGE_WIDTH,
        "height": IMAGE_HEIGHT,
        "model": model,
        "nologo": "true",
    }
    if seed is not None:
        params["seed"] = seed

    response = requests.get(url, params=params, timeout=90)
    response.raise_for_status()
    return response.content


def main():
    parser = argparse.ArgumentParser(
        description="Generate foto produk massal via Pollinations.ai",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Catatan: Pollinations free tier saat ini hanya punya 1 model aktif.\n"
               "Parameter --model tetap dikirim ke API, siapa tahu nanti mereka update.\n\n"
               "Contoh:\n"
               "  python generate_foto_produk.py                 # jalankan normal\n"
               "  python generate_foto_produk.py --model sana    # coba model lain\n"
               "  python generate_foto_produk.py -o output_test  # output ke folder lain\n"
    )
    parser.add_argument(
        "--model", "-m",
        default=MODEL,
        help=f"Model image generation (default: {MODEL}). Pollinations free saat ini ignore nilai ini."
    )
    parser.add_argument(
        "--output-dir", "-o",
        default=OUTPUT_DIR,
        help=f"Folder output foto (default: {OUTPUT_DIR})"
    )
    args = parser.parse_args()

    selected_model = args.model
    output_dir = args.output_dir

    if not os.path.exists(INPUT_FILE):
        print(f"\u274c File '{INPUT_FILE}' tidak ditemukan. Taruh file itu di folder yang sama.")
        return

    os.makedirs(output_dir, exist_ok=True)

    items = parse_product_list(INPUT_FILE)
    total_products = len(items)
    total_images = total_products * VARIANTS_PER_PRODUCT
    print(f"\n\U0001f4cb Ditemukan {total_products} produk di '{INPUT_FILE}'.")
    print(f"\U0001f39e\ufe0f  {VARIANTS_PER_PRODUCT} variasi per produk = {total_images} foto total.")
    print(f"\U0001f4c1 Hasil akan disimpan di: ./{output_dir}/\n")

    success, failed = 0, []
    img_counter = 0

    for i, item in enumerate(items, start=1):
        product_name = item["product"]
        category = item["category"]
        prompt = build_prompt(item)
        style = "flat-lay" if product_name in FLAT_LAY_PRODUCTS else "standard"

        for v in range(1, VARIANTS_PER_PRODUCT + 1):
            img_counter += 1
            # Sertakan nama model di folder output agar gampang dibanding-bandingkan
            filename = f"{i:03d}_{category}_{slugify(product_name)}_v{v}.jpg"
            filepath = os.path.join(output_dir, filename)

            if os.path.exists(filepath):
                print(f"[{img_counter}/{total_images}] ⏭️  {product_name} v{v} - sudah ada, skip")
                success += 1
                continue

            # seed berbeda tiap variasi biar hasilnya gak identik
            seed = i * 100 + v

            for attempt in range(1, MAX_RETRIES + 1):
                try:
                    print(f"[{img_counter}/{total_images}] 🎨 Generating ({style}, {selected_model}): [{category}] {product_name} v{v} (percobaan {attempt})...")
                    image_data = generate_image(prompt, seed=seed, model=selected_model)
                    with open(filepath, "wb") as f:
                        f.write(image_data)
                    print(f"[{img_counter}/{total_images}] ✅ Selesai: {filename}")
                    success += 1
                    break
                except Exception as e:
                    print(f"[{img_counter}/{total_images}] ⚠️  Gagal (percobaan {attempt}): {e}")
                    if attempt == MAX_RETRIES:
                        failed.append(f"{product_name} v{v}")
                    time.sleep(5)

            time.sleep(DELAY_BETWEEN_REQUESTS)

    print("\n" + "=" * 50)
    print(f"SELESAI: {success}/{total_images} foto berhasil dibuat.")
    if failed:
        print(f"❌ Gagal ({len(failed)}): {', '.join(failed)}")
        print("   Tinggal jalankan ulang script-nya, yang udah sukses bakal di-skip otomatis.")
    print("=" * 50)
    print("\n💡 Tips: buat tiap produk, bandingin _v1 dan _v2, pilih yang paling")
    print("   bagus, hapus yang jelek. Kalau dua-duanya masih salah warna, coba")
    print("   edit entry di OVERRIDES — sertakan warna asli produknya dengan")
    print("   kalimat eksplisit (mis: 'black leather', 'yellow hard plastic').")
    print("   Hapus file gambar yang mau di-regenerate, jalanin ulang script.")


if __name__ == "__main__":
    main()
