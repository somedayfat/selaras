export type LocationData = {
  city: string;
  slug: string;
  districts: {
    name: string;
    slug: string;
  }[];
};

export const seoLocations: LocationData[] = [
  {
    city: "Kabupaten Bekasi",
    slug: "kabupaten-bekasi",
    districts: [
      "Babelan", "Bojongmangu", "Cabangbungin", "Cibarusah", "Cibitung", 
      "Cikarang Barat", "Cikarang Pusat", "Cikarang Selatan", "Cikarang Timur", 
      "Cikarang Utara", "Karangbahagia", "Kedungwaringin", "Muara Gembong", 
      "Pebayuran", "Serang Baru", "Setu", "Sukakarya", "Sukawangi", 
      "Tambelang", "Tambun Selatan", "Tambun Utara", "Tarumajaya"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  },
  {
    city: "Kabupaten Karawang",
    slug: "kabupaten-karawang",
    districts: [
      "Banyusari", "Batujaya", "Ciampel", "Cibuaya", "Cikampek", 
      "Cilamaya Kulon", "Cilamaya Wetan", "Cilebar", "Jatisari", 
      "Jayakerta", "Karawang Barat", "Karawang Timur", "Klari", 
      "Kotabaru", "Kutawaluya", "Lemahabang", "Majalaya", "Pakisjaya", 
      "Pangkalan", "Pedes", "Purwasari", "Rawamerta", "Rengasdengklok", 
      "Tegalwaru", "Telagasari", "Telukjambe Barat", "Telukjambe Timur", 
      "Tempuran", "Tirtajaya", "Tirtamulya"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  },
  {
    city: "Kota Bekasi",
    slug: "kota-bekasi",
    districts: [
      "Bantar Gebang", "Bekasi Barat", "Bekasi Selatan", "Bekasi Timur", 
      "Bekasi Utara", "Jatiasih", "Jatisampurna", "Medan Satria", 
      "Mustika Jaya", "Pondok Gede", "Pondok Melati", "Rawalumbu"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  },
  {
    city: "Jakarta Timur",
    slug: "jakarta-timur",
    districts: [
      "Cakung", "Cipayung", "Ciracas", "Duren Sawit", "Jatinegara", 
      "Kramat Jati", "Makasar", "Matraman", "Pasar Rebo", "Pulo Gadung"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  },
  {
    city: "Jakarta Selatan",
    slug: "jakarta-selatan",
    districts: [
      "Cilandak", "Jagakarsa", "Kebayoran Baru", "Kebayoran Lama", "Mampang Prapatan", 
      "Pancoran", "Pasar Minggu", "Pesanggrahan", "Setiabudi", "Tebet"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  },
  {
    city: "Jakarta Barat",
    slug: "jakarta-barat",
    districts: [
      "Cengkareng", "Grogol Petamburan", "Kalideres", "Kebon Jeruk", 
      "Kembangan", "Palmerah", "Taman Sari", "Tambora"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  },
  {
    city: "Jakarta Utara",
    slug: "jakarta-utara",
    districts: [
      "Cilincing", "Kelapa Gading", "Koja", "Pademangan", "Penjaringan", "Tanjung Priok"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  },
  {
    city: "Jakarta Pusat",
    slug: "jakarta-pusat",
    districts: [
      "Cempaka Putih", "Gambir", "Johar Baru", "Kemayoran", "Menteng", 
      "Sawah Besar", "Senen", "Tanah Abang"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  },
  {
    city: "Kota Depok",
    slug: "depok",
    districts: [
      "Beji", "Bojongsari", "Cilodong", "Cimanggis", "Cinere", 
      "Cipayung", "Limo", "Pancoran Mas", "Sawangan", "Sukmajaya", "Tapos"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  },
  {
    city: "Kota Bogor",
    slug: "kota-bogor",
    districts: [
      "Bogor Barat", "Bogor Selatan", "Bogor Tengah", "Bogor Timur", "Bogor Utara", "Tanah Sareal"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  },
  {
    city: "Kabupaten Bogor",
    slug: "kabupaten-bogor",
    districts: [
      "Cibinong", "Cileungsi", "Citeureup", "Gunung Putri", "Babakan Madang", 
      "Bojonggede", "Ciawi", "Parung", "Jonggol", "Klapanunggal"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  },
  {
    city: "Kota Tangerang",
    slug: "kota-tangerang",
    districts: [
      "Tangerang", "Karawaci", "Cipondoh", "Ciledug", "Batuceper", 
      "Benda", "Cibodas", "Jatiuwung", "Pinang"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  },
  {
    city: "Kabupaten Tangerang",
    slug: "kabupaten-tangerang",
    districts: [
      "Tigaraksa", "Cikupa", "Balaraja", "Curug", "Kelapa Dua", 
      "Kosambi", "Pasar Kemis", "Pagedangan", "Teluknaga"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  },
  {
    city: "Tangerang Selatan",
    slug: "tangerang-selatan",
    districts: [
      "Serpong", "Ciputat", "Pamulang", "Pondok Aren", "Serpong Utara", "Setu", "Ciputat Timur"
    ].map(d => ({ name: d, slug: d.toLowerCase().replace(/\s+/g, '-') }))
  }
];
