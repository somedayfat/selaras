# 📋 Checklist Revisi Website PT Selaras Mitra Utama
> Dokumen pelacak status pengerjaan revisi berdasarkan request owner.
> File ini disimpan di direktori workspace agar Anda dapat mencentang/mengeditnya dengan mudah.

---

## ⏳ PENDING (Menunggu Aset / Keputusan Owner)
*Task di bawah ini HIDDEN (disembunyikan) dari halaman web dan baru akan dimasukkan setelah owner mengirimkan aset/gambar.*

- [ ] **Foto Background Hero** — Mengganti gambar Hero dengan foto Gudang / Material / Industri real feel (*menunggu owner mengirimkan file gambar*).
- [ ] **Foto Pendukung Tentang Kami** — Mengisi bagian visual pendukung dengan foto material (*menunggu owner mengirimkan file gambar*).
- [ ] **Portfolio Proyek (DOKUMENTASI PROYEK)** — Menyembunyikan seluruh section Portfolio dari homepage (*section ini sudah dihapus dari UI kode, akan dipasang kembali setelah owner mengirimkan file gambar & detail proyek*).
- [ ] **Update Alamat Cabang Bekasi** — Menyembunyikan card cabang Bekasi dari daftar Kontak di footer dan halaman utama (*card ini sudah disembunyikan dari UI kode, baru akan ditampilkan setelah owner mengirimkan alamat cabang yang baru karena sebelumnya tertulis "rencana akan direvisi"*).

---

## ✅ SUDAH DIKERJAKAN (Selesai 100% - Siap Review)
*Task di bawah ini telah berhasil diimplementasikan di kode, dirapikan UI-nya, dan lolos build production.*

### 1. Hero Section
- [x] **Headline Baru:** *"Solusi Pengadaan Material Industri & Proyek Secara Cepat, Tepat & Kompetitif"*
- [x] **Subheadline Baru:** *"Mendukung kebutuhan pabrik, kontraktor, dan proyek dengan jaringan supplier terpercaya"*
- [x] **3 Kalimat Kunci Wajib:**
  - [x] Didukung jaringan supplier terpercaya
  - [x] Siap support kebutuhan industri & proyek
  - [x] Pengadaan cepat, tepat, dan kompetitif
- [x] **Tombol Baru:** Tombol `Request Penawaran` (scroll otomatis ke form) dan `Chat WhatsApp` (membuka link WA).

### 2. Tentang Kami & Visi Misi
- [x] **Pembersihan Alamat:** Menghapus alamat `Graha MIR Lt. 6, Rawamangun, Jakarta Timur` dari daftar bullet point ringkas Tentang Kami agar tidak redundan.
- [x] **Visi Baru:** Mengupdate visi perusahaan sesuai dengan teks revisi.
- [x] **Misi Baru (Desain 4 Kartu):** Mengubah bullet point misi menjadi layout 4 kolom kartu dengan teks lengkap dari halaman 3 & 4 PDF:
  - [x] *Solusi & Layanan Prima*
  - [x] *Solusi Sumber Daya Manusia*
  - [x] *Kemitraan Strategis*
  - [x] *Kapasitas Internal & Keberlanjutan*

### 3. Layanan Kami (Telah Dirapikan)
- [x] **Section Mandiri:** Memindahkan "Layanan Kami" keluar dari section Tentang Kami agar menjadi section sendiri dengan warna background putih bersih dan jarak (spacing) yang lega serta profesional.

### 4. Keunggulan Kami (5 Poin Baru)
- [x] Mengubah 3 keunggulan lama menjadi 5 poin keunggulan baru dari PDF:
  1. *Mitra Bisnis yang Terpercaya*
  2. *Jaringan Pemasok yang Luas*
  3. *Solusi Pengadaan yang Efisien*
  4. *Layanan Profesional & Responsif*
  5. *Komitmen terhadap Kualitas & Ketepatan Waktu*

### 5. Struktur Urutan Halaman Baru (Telah Disederhanakan)
- [x] Mengatur urutan homepage menjadi lebih ringkas & bersih (tanpa element placeholder kosong):
  1. Hero (Headline + CTA)
  2. Tentang Kami (Singkat & Kuat + Visi Misi)
  3. Layanan Kami (Standalone section)
  4. Keunggulan Kami
  5. Area Layanan (Sektor Industri)
  6. CTA Besar (Form Inquiry & Kontak)

### 6. CTA Besar & Kontak
- [x] **Wording CTA:** Mengubah heading form kontak menjadi *"Kirim kebutuhan Anda sekarang dan dapatkan penawaran terbaik"*.
- [x] **Wording Wajib Bawah:** Menambahkan 3 kalimat pendukung di atas grid form:
  * *Didukung jaringan supplier*
  * *Partner pengadaan industry*
  * *Mendukung berbagai kebutuhan Industri, proyek*
- [x] **Informasi Kontak Baru:**
  * Office: `+62 21 2936 8919`
  * Sales Hotline: `+62 812-134-6665` & `+62 822-4948-9325`
  * WhatsApp Business Utama: `+62 819-9157-9265`
  * Jam Operasional: Senin – Jumat, 08.00 – 17.00 WIB
- [x] **Desain Box Kontak:** Memformat tampilan kontak box dengan warna background dark navy elegan agar informasinya kontras, bersih, dan lega.

### 7. Peningkatan Sistem
- [x] **Integrasi WhatsApp Dinamis:** File `Header.tsx` dan `ProductCard.tsx` kini memanggil nomor WhatsApp secara dinamis dari database `settings.json`.
- [x] **Deteksi Tipe Nomor:** Footer secara otomatis mendeteksi jika nomor adalah telepon kabel/landline (misal: 021) maka tombol link akan berupa panggilan telepon biasa (`tel:`), sedangkan nomor seluler/hotline otomatis berupa chat WhatsApp (`wa.me`).
- [x] **Penambahan Foto Produk:** Sebanyak 250 produk generic berseri "Premium" yang sebelumnya kosong (ber-placeholder "Upload Foto") telah dipetakan otomatis ke 61 gambar produk siap pakai di folder `public/img` berdasarkan jenis produk.
