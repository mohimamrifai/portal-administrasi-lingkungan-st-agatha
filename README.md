# Portal Administrasi Lingkungan St. Agatha

## Spesifikasi Umum
1. Nama tampilan: "Portal Administrasi Lingkungan St. Agatha"
2. Bahasa tampilan adalah Bahasa Indonesia

## Fitur-Fitur Utama

### 1. Laman Login
- Terdiri dari 3 Tab:
  - **LOGIN:**
    - Form Username dan Password
    - Notifikasi pop-up untuk setiap tindakan
  - **Register:**
    - Cek nama Kepala Keluarga (proses registrasi akun baru dapat dilanjutkan jika Nama Kepala Keluarga sesuai dengan database)
    - Setiap nama Kepala Keluarga hanya dapat memiliki 1 akun
    - Fungsi pengecekan untuk mencegah duplikasi Username
    - Password (kombinasi angka dan huruf)
    - Kolom passphrase (kombinasi angka dan huruf) untuk otentikasi reset password
    - Otorisasi pengguna untuk register adalah "Umat"
    - Tidak ada pengiriman konfirmasi melalui email
    - Notifikasi pop-up untuk setiap tindakan
  - **Lupa Password:**
    - Tahap 1: Verifikasi nama Kepala Keluarga
    - Tahap 2: Input passphrase
    - Tahap 3: Input Password Baru dan konfirmasi

### 2. Dashboard
- Halaman utama yang menampilkan data real time:
  - **Resume Keuangan Lingkungan**
    - Datacard (Saldo Awal, Total Pemasukan, Total Pengeluaran, Saldo Akhir)
    - Filter berdasarkan bulan dan tahun
    - Tampilan default: bulan dan tahun sesuai sistem (GMT+7)
    - Desain menarik dan sederhana
  - **Resume Keuangan IKATA**
    - Datacard (Saldo Awal, Pemasukan, Pengeluaran, Saldo Akhir)
    - Filter berdasarkan bulan dan tahun
    - Tampilan default: bulan dan tahun sesuai sistem (GMT+7)
    - Desain menarik dan sederhana
  - **Resume Kesekretariatan**
    - Datacard (Total Kepala Keluarga, Jumlah Jiwa, KK Bergabung, KK Pindah, Umat Meninggal Dunia, Tingkat Partisipasi Umat)
    - Tingkat partisipasi umat: rata-rata kehadiran dalam kegiatan doling per bulan
    - Filter berdasarkan bulan dan tahun
    - Tampilan default: bulan dan tahun sesuai sistem (GMT+7)
    - Desain menarik dan sederhana
  - List nama Kepala Keluarga yang menunggak Iuran Dana Mandiri
  - List nama Kepala Keluarga yang menunggak Iuran IKATA
  - Sidebar dengan daftar menu dan submenu sesuai role

### 3. Menu Lingkungan
- **Submenu Kas Lingkungan**
  - Datacard (Saldo Awal, Pemasukan, Pengeluaran, Saldo Akhir)
  - Data transaksi dengan filter bulan dan tahun
  - Warna berbeda untuk transaksi debit dan kredit
  - Tombol "Input Transaksi" dengan form isian dinamis
  - Integrasi dengan Kas IKATA untuk transfer dana
  - Fitur Edit dan Hapus Data
  - Notifikasi untuk semua akun terdaftar
  - Tombol Print PDF dengan kotak dialog pemilihan rentang waktu
  - Fitur Lock transaksi setelah diprint

- **Submenu Dana Mandiri (2 tab)**
  - **Tab 1:**
    - Datacard (Jumlah Iuran Terkumpul, Jumlah KK Lunas, Jumlah KK belum lunas)
    - Data transaksi per tahun
    - Form isian untuk tambah data
    - Fitur Edit dan Hapus Data
    - Fitur Setor ke Paroki dengan status update
    - Fitur check/uncheck all untuk pemilihan data
    - Fitur lock untuk data yang sudah disetor
    - Pencarian berdasarkan nama kepala keluarga
    - Notifikasi real-time untuk status setor ke paroki
    - Tombol Print PDF dengan pilihan jenis dokumen
  - **Tab 2:**
    - Monitoring penunggak Iuran Dana Mandiri
    - Tampilan berdasarkan nama Kepala Keluarga dan periode tunggakan
    - Pencarian berdasarkan nama kepala keluarga
    - Tombol set iuran Dana Mandiri
    - Fitur kirim notifikasi pengingat
    - Notifikasi pop-up untuk setiap tindakan

### 4. IKATA (2 tab)
- **Tab 1: Kas IKATA** ( default)
  - Datacard (Saldo Awal, Pemasukan, Pengeluaran, Saldo Akhir)
  - Data transaksi dengan filter bulan dan tahun
  - Warna berbeda untuk transaksi debit dan kredit
  - Form isian untuk tambah data dengan dropdown dinamis
  - Fitur khusus untuk Iuran Anggota dan Sumbangan Anggota
  - Notifikasi untuk semua akun terdaftar
  - Fitur Edit dan Hapus Data
  - Filter berdasarkan Bulan dan Tahun
  - Notifikasi real-time untuk pembayaran iuran
  - Tombol Print PDF dengan fitur lock transaksi

- **Tab 2: Monitoring Penunggak**
  - Tampilan berdasarkan nama Kepala Keluarga dan periode tunggakan
  - Pencarian berdasarkan nama kepala keluarga
  - Tombol set iuran IKATA
  - Fitur kirim notifikasi pengingat
  - Notifikasi pop-up untuk setiap tindakan

### 5. Kesekretariatan
- **Submenu Data Umat**
  - List daftar nama Kepala Keluarga
  - Tombol "Tambah" untuk data Kepala Keluarga
  - Tombol aksi Edit dan Hapus
  - Fitur khusus untuk status Pindah atau Meninggal
  - Tombol Download Template dan Impor Data
  - Notifikasi pop-up untuk setiap tindakan

- **Submenu Doa Lingkungan (5 tab)**
  - **Jadwal Doling:** Penjadwalan tuan rumah doa lingkungan
  - **Detil Doling:** Form data kegiatan doa lingkungan
  - **Absensi:** Form kehadiran anggota
  - **Riwayat Doling:** Rincian kegiatan dan absensi
  - **Kaleidoskop:** Mini dashboard rekapitulasi kegiatan

- **Submenu Agenda**
  - List Permohonan dari akun "umat"
  - Tombol "Pengajuan" untuk role "umat"
  - Fitur tindak lanjut untuk pengurus
  - Notifikasi untuk pemilik pengajuan
  - Fitur hapus otomatis untuk agenda yang selesai

### 6. Publikasi
- **Submenu Pengumuman**
  - Menampilkan pengumuman dari Buat Publikasi
  - Fitur input laporan
  - Hapus otomatis pengumuman kadaluarsa
  - Fitur unduh lampiran
  - Filter untuk pencarian
  - Tampilan ramah pembaca

- **Submenu Buat Publikasi**
  - Pilihan target penerima notifikasi
  - Fitur upload file (gambar, excel, pdf, word)
  - Klasifikasi Publikasi (Penting, Umum, Rahasia, Segera)
  - Fitur batas waktu (deadline)
  - Integrasi dengan notifikasi

### 7. Pengaturan
- **Submenu Profil**
  - Form data Kepala Keluarga
  - Form data Pasangan (jika menikah)
  - Form data Tanggungan (jika ada)
  - Role "Umat" dapat memperbarui data setiap saat

- **Submenu Ubah Password**
  - Validasi password lama
  - Input password baru dan konfirmasi
  - Tidak terintegrasi dengan email

-- **Submenu Ubah Password**
  - **Fitur Wipe Data** untuk SuperUser

### 8. Approval
- Integrasi data Detil Doling ke Kas Lingkungan
- Tampilan data untuk persetujuan
- Kotak dialog konfirmasi
- Notifikasi untuk pengurus setelah persetujuan

### 9. Histori Pembayaran
- Integrasi Dana Mandiri dan IKATA
- Tampilan status pembayaran untuk pemilik akun
- Filter berdasarkan tahun
- Hanya untuk role "Umat"

### 10. Fitur Tambahan
- **Tombol Log Out**
- **Notifikasi** dengan fitur hapus otomatis
- **Otorisasi** 8 jenis pengguna dengan batasan akses
- **Username dan Password Awal** untuk pengurus

## Template Dokumen
- Template Kas Lingkungan
- Template Bukti Penerimaan Dana Mandiri
- Template Slip Penyetoran Dana Mandiri
- Template Kas IKATA
- Template Jadwal Doling
- Template Riwayat Doling (2 halaman)# portal-administrasi-lingkungan-st-agatha
