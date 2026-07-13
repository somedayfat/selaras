import { Metadata } from 'next';
import Link from 'next/link';
import { seoLocations } from '@/data/seoLocations';
import { CATEGORIES } from '@/data/categories';
import settings from '@/data/settings.json';
import { 
  Shield, Flame, Wrench, Settings, Zap, Cpu, Wind, 
  Droplets, Fan, Monitor, Network, Eye, Package, 
  Box, Trash2, HeartPulse, TestTube, Shirt, Coffee, 
  Sun, Gift, CheckCircle2 
} from 'lucide-react';

const iconMap: Record<string, any> = {
  a: Shield,
  b: Flame,
  c: Wrench,
  d: Settings,
  e: Zap,
  f: Cpu,
  g: Wind,
  h: Box,
  i: Droplets,
  j: Fan,
  k: Monitor,
  l: Network,
  m: Eye,
  n: Monitor,
  o: Package,
  p: Box,
  q: Trash2,
  r: HeartPulse,
  s: TestTube,
  t: Shirt,
  u: Coffee,
  v: Sun,
  w: Gift,
};

type Props = {
  params: Promise<{
    city: string;
    district: string;
  }>;
};

export async function generateStaticParams() {
  const paths: { city: string; district: string }[] = [];
  
  seoLocations.forEach((city) => {
    city.districts.forEach((district) => {
      paths.push({
        city: city.slug,
        district: district.slug,
      });
    });
  });
  
  return paths;
}

async function getNames(citySlug: string, districtSlug: string) {
  const city = seoLocations.find(c => c.slug === citySlug);
  const district = city?.districts.find(d => d.slug === districtSlug);
  return {
    cityName: city?.city || citySlug,
    districtName: district?.name || districtSlug
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, district } = await params;
  const { cityName, districtName } = await getNames(city, district);
  const title = `Supplier Alat K3, Safety Shoes & Alat Teknik di ${districtName}, ${cityName} - PT. Selaras Mitra Utama`;
  const description = `Pusat pengadaan K3, Safety Shoes, Tools & Equipment, Mechanical & Electrical Spare Parts terpercaya untuk pabrik & proyek di ${districtName}, ${cityName}. Penawaran cepat dan pengiriman aman dari PT. Selaras Mitra Utama.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    }
  };
}

export default async function LocalSeoPage({ params }: Props) {
  const { city, district } = await params;
  const { cityName, districtName } = await getNames(city, district);

  const waMessage = `Halo PT Selaras Mitra Utama, kami tertarik untuk mengajukan penawaran harga (RFQ) pengadaan kebutuhan industri K3/alat teknik untuk perusahaan kami yang berlokasi di ${districtName}, ${cityName}.`;
  const waLink = `https://wa.me/${settings.primaryWhatsapp}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#02376C] to-[#012E5A] text-white pt-24 pb-16 px-6 relative overflow-hidden">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--navy-deeper) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block bg-[#D4870A]/20 border border-[#D4870A]/30 text-[#FCD34D] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            B2B Industrial Supplier & General Trading
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Supplier Alat K3 & Alat Teknik Industri di <span className="text-[#FCD34D]">{districtName}</span>, {cityName}
          </h1>
          <p className="text-base md:text-lg text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            PT Selaras Mitra Utama menyediakan suplai logistik terintegrasi untuk kebutuhan K3, Safety Shoes, Perkakas Industri, Spare Parts, Elektrikal, dan Mechanical pabrik atau proyek Anda di kawasan {districtName}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="bg-[#D4870A] hover:bg-[#b06f08] text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all hover:-translate-y-0.5"
            >
              Lihat Katalog Produk
            </Link>
            <a 
              href={waLink}
              target="_blank" 
              rel="noopener noreferrer"
              suppressHydrationWarning
              className="bg-white text-[#02376C] hover:bg-slate-55 px-8 py-3 rounded-full font-bold shadow-lg transition-all hover:-translate-y-0.5"
            >
              Ajukan RFQ via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-16 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#02376C] mb-6">
              Mitra Pengadaan Industri Terpercaya di {districtName}
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Memelihara kelancaran operasional manufaktur, perbaikan mesin, dan keselamatan proyek konstruksi memerlukan pasokan logistik yang konsisten dan tepat waktu. PT Selaras Mitra Utama memahami kebutuhan operasional di area industri <strong>{districtName}, {cityName}</strong> sangat dinamis.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Kami siap melayani kebutuhan pengadaan instansi, kontraktor, dan pabrik Anda. Sebagai distributor berpengalaman, kami menawarkan produk bersertifikasi resmi (termasuk SNI untuk sepatu safety, helm, dan peralatan K3) dengan kualitas yang terjamin keandalannya.
            </p>
          </div>
          <div className="md:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Mengapa Memilih Kami?</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm"><strong>Produk SNI & Original:</strong> Jaminan kualitas dan pemenuhan standar regulasi keselamatan kerja K3 nasional.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm"><strong>Harga Kompetitif B2B:</strong> Penawaran harga grosir khusus pembelian volume korporat.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm"><strong>Pengiriman Fleksibel:</strong> Distribusi logistik yang andal langsung ke lokasi pabrik atau site proyek Anda di {districtName}.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Categories Grid */}
        <h2 className="text-3xl font-extrabold text-[#02376C] text-center mb-4">Layanan Pengadaan Kami</h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12">
          Kami menyediakan solusi suplai multi-kategori terlengkap untuk memenuhi seluruh kebutuhan operasional industri dan kantor di area {districtName}.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => {
            const IconComponent = iconMap[category.id] || Box;
            return (
              <Link 
                key={category.slug} 
                href={`/categories/${category.slug}`}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#02376C]/30 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-50 text-[#02376C] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#02376C] group-hover:text-white transition-all">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2 group-hover:text-[#02376C] transition-colors">{category.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{category.description}</p>
              </Link>
            )
          })}
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="bg-[#011E3D] text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--navy) 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Butuh Penawaran Resmi (Quotation) dalam Waktu Cepat?</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Silakan kirim daftar permintaan penawaran barang (Inquiry list) instansi atau pabrik Anda di {districtName} kepada tim sales support kami.
          </p>
          <a 
            href={waLink} 
            target="_blank"
            rel="noopener noreferrer"
            suppressHydrationWarning
            className="inline-block bg-[#D4870A] hover:bg-[#b06f08] text-white px-10 py-4 rounded-full font-bold shadow-lg transition-all hover:-translate-y-0.5"
          >
            Hubungi Sales & Support via WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
