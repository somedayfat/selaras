const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ── CONFIG ──────────────────────────────────────────────────────
const PRODUCTS_JSON = path.join('d:', 'selaras', 'src', 'data', 'products.json');
const OUT_DIR = path.join('d:', 'selaras', 'public', 'img', 'prod');
const TARGET_W = 500;
const TARGET_H = 500;
const QUALITY = 80;   // JPEG quality
const DELAY_MS = 800;  // delay between requests (be polite)

// Pixabay free API key (public demo key — works for low volume)
// Replace with your own at https://pixabay.com/api/docs/ if rate-limited
const PIXABAY_KEY = '47900870-2741a00f03c6d5ce1e8b26f82';

// ── SLUG HELPER ─────────────────────────────────────────────────
function toSlug(name) {
  return name.toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Map product names to better search keywords for Pixabay
const KEYWORD_MAP = {
  'Bearing': 'ball bearing industrial',
  'Gear': 'industrial gear metal',
  'Gearbox': 'industrial gearbox',
  'Chain': 'industrial roller chain',
  'Sprocket': 'sprocket gear chain',
  'Pulley': 'industrial pulley',
  'Belt': 'industrial conveyor belt',
  'Coupling': 'shaft coupling industrial',
  'Shaft': 'steel shaft industrial',
  'Seal': 'industrial seal ring',
  'O-Ring': 'o-ring rubber seal',
  'Gasket': 'industrial gasket',
  'Spring': 'industrial spring coil',
  'Fastener': 'industrial fastener bolt',
  'Bolt & Nut': 'bolt nut hardware',
  'Washer': 'metal washer hardware',
  'Anchor Bolt': 'anchor bolt construction',
  'Clamp': 'industrial pipe clamp',
  'Valve': 'industrial valve pipe',
  'Industrial Lubricant': 'industrial lubricant oil',
  'Cable': 'industrial electric cable',
  'Cable Tray': 'cable tray electrical',
  'Cable Ladder': 'cable ladder tray',
  'Conduit': 'electrical conduit pipe',
  'Junction Box': 'electrical junction box',
  'MCB': 'MCB circuit breaker',
  'MCCB': 'MCCB molded case circuit breaker',
  'ACB': 'air circuit breaker ACB',
  'Contactor': 'electrical contactor',
  'Relay': 'electrical relay',
  'Push Button': 'industrial push button',
  'Panel Box': 'electrical panel box',
  'Transformer': 'electrical transformer',
  'Inverter': 'power inverter electrical',
  'VFD': 'variable frequency drive VFD',
  'Industrial Plug': 'industrial plug socket',
  'Socket Outlet': 'electrical socket outlet',
  'LED Lighting': 'LED industrial light',
  'PLC': 'PLC programmable logic controller',
  'HMI': 'HMI touchscreen industrial',
  'Sensor': 'industrial sensor',
  'Proximity Sensor': 'proximity sensor industrial',
  'Photoelectric Sensor': 'photoelectric sensor',
  'Encoder': 'rotary encoder industrial',
  'Pressure Gauge': 'pressure gauge industrial',
  'Temperature Controller': 'temperature controller industrial',
  'Flow Meter': 'flow meter industrial',
  'Level Sensor': 'level sensor tank',
  'Digital Meter': 'digital meter electrical',
  'Industrial Controller': 'industrial controller panel',
  'Air Cylinder': 'pneumatic air cylinder',
  'Solenoid Valve': 'solenoid valve pneumatic',
  'FRL Unit': 'FRL filter regulator lubricator',
  'Pneumatic Fitting': 'pneumatic fitting',
  'Pneumatic Hose': 'pneumatic hose tube',
  'Hydraulic Pump': 'hydraulic pump',
  'Hydraulic Cylinder': 'hydraulic cylinder',
  'Hydraulic Hose': 'hydraulic hose',
  'Hydraulic Valve': 'hydraulic valve',
  'Cement': 'cement bag construction',
  'Steel': 'steel beam construction',
  'Rebar': 'rebar steel construction',
  'Hollow': 'hollow steel section',
  'Galvanized Steel': 'galvanized steel sheet',
  'Gypsum': 'gypsum board wall',
  'Ceiling': 'ceiling tile grid',
  'Ceramic': 'ceramic tile floor',
  'Granite': 'granite tile floor',
  'Vinyl Flooring': 'vinyl flooring plank',
  'Roofing': 'metal roofing sheet',
  'Waterproofing': 'waterproofing membrane',
  'Paint': 'paint can wall',
  'Insulation Material': 'insulation material building',
  'PVC Pipe': 'PVC pipe plumbing',
  'HDPE Pipe': 'HDPE pipe',
  'PPR Pipe': 'PPR pipe plumbing',
  'Fittings': 'pipe fitting plumbing',
  'Water Pump': 'water pump industrial',
  'Water Tank': 'water tank storage',
  'Faucet': 'faucet tap water',
  'Sanitary Equipment': 'sanitary bathroom equipment',
  'Air Conditioner': 'air conditioner unit',
  'AHU': 'air handling unit AHU',
  'FCU': 'fan coil unit FCU',
  'Exhaust Fan': 'exhaust fan ventilation',
  'Blower': 'industrial blower fan',
  'Ducting': 'HVAC ducting duct',
  'Flexible Duct': 'flexible duct HVAC',
  'Air Filter': 'air filter HVAC',
  'Damper': 'air damper HVAC',
  'Ventilation Accessories': 'ventilation grille diffuser',
  'Laptop': 'laptop computer business',
  'Desktop PC': 'desktop computer PC',
  'Workstation': 'workstation computer',
  'Server': 'server rack computer',
  'Printer': 'office printer laser',
  'Scanner': 'document scanner office',
  'Projector': 'projector meeting room',
  'Interactive Display': 'interactive display screen',
  'Monitor': 'computer monitor screen',
  'UPS': 'UPS uninterruptible power supply',
  'Photocopier': 'photocopier office machine',
  'Attendance Machine': 'fingerprint attendance machine',
  'Server Rack': 'server rack cabinet',
  'Network Cabinet': 'network cabinet rack',
  'Router': 'network router',
  'Switch': 'network switch',
  'Firewall': 'network firewall',
  'Wireless Access Point': 'wireless access point WiFi',
  'Patch Panel': 'network patch panel',
  'LAN Cable': 'ethernet LAN cable',
  'Fiber Optic': 'fiber optic cable',
  'Network Accessories': 'network accessories cable',
  'CCTV': 'CCTV camera security',
  'IP Camera': 'IP camera security',
  'DVR': 'DVR recorder CCTV',
  'NVR': 'NVR network video recorder',
  'Access Control': 'access control door system',
  'Door Lock': 'electronic door lock',
  'Fingerprint System': 'fingerprint scanner security',
  'Face Recognition': 'face recognition camera',
  'Boom Gate': 'boom gate parking barrier',
  'Metal Detector': 'metal detector security',
  'Office Desk': 'office desk furniture',
  'Office Chair': 'office chair ergonomic',
  'Executive Furniture': 'executive office furniture',
  'Meeting Table': 'meeting table conference',
  'Filing Cabinet': 'filing cabinet office',
  'Locker': 'metal locker storage',
  'Mobile Compactor': 'mobile compactor filing',
  'Shelving System': 'shelving rack system',
  'Pallet Rack': 'pallet rack warehouse',
  'Medium Rack': 'medium duty rack shelf',
  'Heavy Duty Rack': 'heavy duty rack warehouse',
  'Hand Pallet': 'hand pallet truck',
  'Forklift': 'forklift warehouse',
  'Drum Trolley': 'drum trolley cart',
  'Plastic Pallet': 'plastic pallet warehouse',
  'Storage Bin': 'storage bin container',
  'Wire Mesh Deck': 'wire mesh deck rack',
  'Stretch Film': 'stretch film wrap packaging',
  'Bubble Wrap': 'bubble wrap packaging',
  'OPP Tape': 'adhesive tape packaging',
  'Strapping Band': 'strapping band packing',
  'Carton Box': 'carton box packaging',
  'Plastic Bag': 'plastic bag packaging',
  'Label Sticker': 'label sticker product',
  'Packing Foam': 'foam packing material',
  'Cleaning Chemical': 'cleaning chemical product',
  'Floor Cleaner': 'floor cleaner bottle',
  'Glass Cleaner': 'glass cleaner spray',
  'Degreaser': 'industrial degreaser',
  'Tissue': 'tissue paper roll',
  'Soap Dispenser': 'soap dispenser wall',
  'Garbage Bin': 'garbage bin trash can',
  'Vacuum Cleaner': 'vacuum cleaner industrial',
  'Floor Scrubber': 'floor scrubber machine',
  'First Aid Kit': 'first aid kit medical',
  'Stretcher': 'medical stretcher',
  'Wheelchair': 'wheelchair medical',
  'Oxygen Cylinder': 'oxygen cylinder medical',
  'Thermometer': 'medical thermometer',
  'Blood Pressure Monitor': 'blood pressure monitor',
  'Pulse Oximeter': 'pulse oximeter medical',
  'AED': 'AED defibrillator medical',
  'Medical Consumables': 'medical supply consumable',
  'Digital Scale': 'digital scale laboratory',
  'pH Meter': 'pH meter laboratory',
  'Conductivity Meter': 'conductivity meter laboratory',
  'Microscope': 'microscope laboratory',
  'Glassware': 'laboratory glassware beaker',
  'Laboratory Chemicals': 'laboratory chemical bottle',
  'Laboratory Furniture': 'laboratory furniture bench',
  'Office Uniform': 'office uniform shirt',
  'Industrial Uniform': 'industrial uniform safety',
  'Wearpack': 'wearpack coverall uniform',
  'Polo Shirt': 'polo shirt uniform',
  'T-Shirt': 'plain t-shirt uniform',
  'Jacket': 'jacket uniform workwear',
  'Cap': 'cap hat uniform',
  'Safety Boots': 'safety boots work shoe',
  'Drinking Water': 'drinking water bottle',
  'Coffee & Tea': 'coffee tea office',
  'Snacks': 'snacks food office',
  'Refrigerator': 'refrigerator kitchen',
  'Microwave': 'microwave oven kitchen',
  'Water Dispenser': 'water dispenser office',
  'Kitchen Equipment': 'kitchen equipment commercial',
  'Solar Panel': 'solar panel renewable energy',
  'Solar Street Light': 'solar street light',
  'Battery System': 'battery storage system',
  'Generator Set': 'generator set diesel',
  'Power Backup System': 'power backup UPS system',
  'Souvenir': 'corporate souvenir gift',
  'Gift Set': 'gift set box',
  'Trophy': 'trophy award',
  'Plaque': 'plaque award recognition',
  'Calendar': 'desk calendar office',
  'Agenda': 'agenda notebook planner',
  'Tumbler': 'tumbler bottle drink',
  'Mug': 'mug coffee cup',
  'Corporate Uniform': 'corporate uniform business',
};

// ── UTILS ────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function download(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchPixabayUrl(query) {
  const q = encodeURIComponent(query);
  const apiUrl = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${q}&image_type=photo&orientation=horizontal&per_page=5&min_width=400&safesearch=true`;
  const buf = await download(apiUrl);
  const json = JSON.parse(buf.toString());
  if (json.hits && json.hits.length > 0) {
    return json.hits[0].webformatURL; // ~640px image, free to use
  }
  return null;
}

// ── MAIN ─────────────────────────────────────────────────────────
async function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));

  // Get unique names still using dummy images
  const imgCount = {};
  products.forEach(p => { imgCount[p.image] = (imgCount[p.image] || 0) + 1; });
  const dummies = new Set(Object.entries(imgCount).filter(([, c]) => c > 10).map(([i]) => i));
  const uniqueNames = [...new Set(products.filter(p => dummies.has(p.image)).map(p => p.name))];

  console.log(`\n🚀 Starting download for ${uniqueNames.length} unique products...\n`);

  const nameToFile = {};
  let success = 0, fail = 0;

  for (let i = 0; i < uniqueNames.length; i++) {
    const name = uniqueNames[i];
    const slug = toSlug(name);
    const outFile = path.join(OUT_DIR, `${slug}.jpg`);

    process.stdout.write(`[${i + 1}/${uniqueNames.length}] ${name.padEnd(35)} → `);

    // Skip if already downloaded
    if (fs.existsSync(outFile)) {
      console.log('✓ skip (exists)');
      nameToFile[name] = `img/prod/${slug}.jpg`;
      success++;
      continue;
    }

    try {
      const keyword = KEYWORD_MAP[name] || name;
      const imgUrl = await fetchPixabayUrl(keyword);

      if (!imgUrl) {
        console.log('✗ not found');
        fail++;
        await sleep(DELAY_MS);
        continue;
      }

      const rawBuf = await download(imgUrl);

      // Compress with sharp
      await sharp(rawBuf)
        .resize(TARGET_W, TARGET_H, { fit: 'cover', position: 'centre' })
        .jpeg({ quality: QUALITY, progressive: true })
        .toFile(outFile);

      const size = Math.round(fs.statSync(outFile).size / 1024);
      console.log(`✓ ${size}KB`);
      nameToFile[name] = `img/prod/${slug}.jpg`;
      success++;
    } catch (err) {
      console.log(`✗ ERROR: ${err.message}`);
      fail++;
    }

    await sleep(DELAY_MS);
  }

  // ── Update products.json ───────────────────────────────────────
  console.log('\n📝 Updating products.json...');
  let updated = 0;
  for (const p of products) {
    if (dummies.has(p.image) && nameToFile[p.name]) {
      p.image = nameToFile[p.name];
      updated++;
    }
  }
  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 2));

  console.log(`\n✅ Done!`);
  console.log(`   Downloaded : ${success} images`);
  console.log(`   Failed     : ${fail} images`);
  console.log(`   JSON updated: ${updated} products`);
}

main().catch(console.error);
console.log(`   Failed     : ${fail} images`);
console.log(`   JSON updated: ${updated} products`);
}

main().catch(console.error);
