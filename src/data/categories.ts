export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export const CATEGORIES: Category[] = [
  {
    id: 'a',
    name: 'Personal Protective Equipment (PPE)',
    slug: 'personal-protective-equipment-ppe',
    description: 'Peralatan keselamatan K3 berstandar SNI/EN ISO meliputi sepatu safety, helm proyek, rompi reflektif, kacamata pelindung, respirator, safety gloves, dan body harness.'
  },
  {
    id: 'b',
    name: 'Fire Safety Equipment',
    slug: 'fire-safety-equipment',
    description: 'Peralatan proteksi dan pemadam kebakaran handal seperti APAR dry powder/CO2, box hydrant, valve, selang pemadam (fire hose), alarm, detector asap, dan fire blanket.'
  },
  {
    id: 'c',
    name: 'Industrial Tools & Equipment',
    slug: 'industrial-tools-equipment',
    description: 'Perkakas tangan (hand tools), power tools, tools pneumatic, torque wrench, alat ukur presisi, mesin las, mesin potong, compressor, dan tool cabinet.'
  },
  {
    id: 'd',
    name: 'Mechanical & Industrial Spare Parts',
    slug: 'mechanical-industrial-spare-parts',
    description: 'Komponen mekanikal premium untuk perbaikan mesin seperti bearing, gear, gearbox, rantai industri, sprocket, pulley, coupling, industrial seals, o-ring, gasket, dan bolts/fasteners.'
  },
  {
    id: 'e',
    name: 'Electrical Supplies',
    slug: 'electrical-supplies',
    description: 'Kabel listrik tegangan rendah & menengah, cable tray/ladder, junction box, panel switchgear (MCB, MCCB, ACB), contactor, relay, inverter/VFD, transformer, dan lampu LED industri.'
  },
  {
    id: 'f',
    name: 'Instrumentation & Automation',
    slug: 'instrumentation-automation',
    description: 'Perangkat otomatisasi industri presisi tinggi seperti PLC, modul HMI, sensor jarak (proximity), encoder, pressure gauge, flow meter, temperature controller, dan digital meter.'
  },
  {
    id: 'g',
    name: 'Pneumatic & Hydraulic',
    slug: 'pneumatic-hydraulic',
    description: 'Sistem penggerak fluid power handal: silinder udara pneumatic, solenoid valve, filter regulator lubricator (FRL), fitting pneumatic, hydraulic pump, dan hydraulic hose.'
  },
  {
    id: 'h',
    name: 'Building Materials',
    slug: 'building-materials',
    description: 'Bahan bangunan industri berkualitas: besi hollow, galvanized steel, rebar, gypsum, granite/ceramic tiles, material waterproofing, cat dinding industri, dan insulasi.'
  },
  {
    id: 'i',
    name: 'Plumbing & Sanitary',
    slug: 'plumbing-sanitary',
    description: 'Sistem pemipaan industri: pipa PVC, pipa HDPE, pipa PPR beserta fitting, water pump booster, katup industri (gate, ball, check valve), dan perlengkapan saniter.'
  },
  {
    id: 'j',
    name: 'HVAC Equipment',
    slug: 'hvac-equipment',
    description: 'Pendingin & tata udara industri: AC cassette/duct, Air Handling Unit (AHU), blower, exhaust fan, flexible ducting, damper, dan filter udara pre-filter/HEPA.'
  },
  {
    id: 'k',
    name: 'Office Equipment',
    slug: 'office-equipment',
    description: 'Perangkat kerja kantor modern: komputer desktop/workstation, laptop bisnis, server rack, printer multifungsi, flatbed scanner, projector, UPS backup, dan mesin absensi.'
  },
  {
    id: 'l',
    name: 'IT & Networking',
    slug: 'it-networking',
    description: 'Infrastruktur jaringan handal: kabel LAN Cat6, fiber optic, router bisnis, switch managed, firewall security, patch panel, wireless access point, dan server rack cabinets.'
  },
  {
    id: 'm',
    name: 'Security System',
    slug: 'security-system',
    description: 'Sistem keamanan terintegrasi: CCTV IP camera, NVR recorder, access control pintu, turnstile barrier gate, fingerprint/face recognition scanner, dan metal detector.'
  },
  {
    id: 'n',
    name: 'Office Furniture',
    slug: 'office-furniture',
    description: 'Furnitur ruang kerja ergonomis: meja kerja staff, kursi kantor hidrolik, meja rapat, filing cabinet besi, loker penyimpanan barang, dan mobile compactor system.'
  },
  {
    id: 'o',
    name: 'Warehouse Equipment',
    slug: 'warehouse-equipment',
    description: 'Perlengkapan pergudangan: heavy duty pallet rack, medium racking system, hand pallet jack, drum lifter trolley, plastic pallet, stacking storage bins, dan wire mesh deck.'
  },
  {
    id: 'p',
    name: 'Packaging Materials',
    slug: 'packaging-materials',
    description: 'Material pengemasan kiriman: stretch film roll, bubble wrap, lakban OPP, strapping band plastik, karton box bergelombang, pe foam, dan label sticker pengiriman.'
  },
  {
    id: 'q',
    name: 'Cleaning & Housekeeping',
    slug: 'cleaning-housekeeping',
    description: 'Pembersih higienis industri: chemical pembersih lantai, degreaser oli, tissue dispenser, hand soap dispenser, tempat sampah roda, vacuum cleaner, dan industrial floor scrubber.'
  },
  {
    id: 'r',
    name: 'Medical & First Aid',
    slug: 'medical-first-aid',
    description: 'Peralatan pertolongan pertama K3: kotak P3K lengkap (Kit A/B/C), tandu lipat, kursi roda, tabung oksigen portable, tensimeter, termometer gun, dan defribilator AED.'
  },
  {
    id: 's',
    name: 'Laboratory Equipment',
    slug: 'laboratory-equipment',
    description: 'Peralatan analisis laboratorium: timbangan digital presisi, pH meter, hotplate stirrer, mikroskop biologi, glassware pyrex, reagen kimia analisis, dan furniture lab.'
  },
  {
    id: 't',
    name: 'Uniform & Garment',
    slug: 'uniform-garment',
    description: 'Pakaian kerja dinas resmi & lapangan: kemeja seragam kantor, wearpack balap/coverall safety katun, kaos polo bordir, topi proyek, dan safety shoes/boots lapangan.'
  },
  {
    id: 'u',
    name: 'Pantry & Hospitality',
    slug: 'pantry-hospitality',
    description: 'Perlengkapan dapur & pantry kantor: galon air minum, kopi/teh instan, snack box, kulkas mini, microwave dispenser air panas/dingin, dan catering equipments.'
  },
  {
    id: 'v',
    name: 'Renewable Energy & Utilities',
    slug: 'renewable-energy-utilities',
    description: 'Sistem energi ramah lingkungan: panel surya photovoltaics, solar street light, battery backup system, UPS industri, dan generator set (genset) silent tipe solar.'
  },
  {
    id: 'w',
    name: 'Promotional & Corporate Merchandise',
    slug: 'promotional-corporate-merchandise',
    description: 'Barang promosi & souvenir eksklusif perusahaan: gift set premium, tumbler custom logo, pulpen promosi, kalender tahunan, buku agenda kulit, dan plakat kayu/akrilik.'
  }
];
