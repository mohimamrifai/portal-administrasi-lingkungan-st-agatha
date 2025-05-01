# Alur Teknis Pembuatan & Integrasi Aplikasi Portal Administrasi Lingkungan St. Agatha

Berikut adalah urutan langkah teknis yang harus dilakukan untuk membangun dan menjalankan aplikasi ini, dimulai dari persiapan database hingga aplikasi siap digunakan. Instruksi ini mengikuti praktik pengembangan modern dan implementasi yang sudah ada di project ini.

---

## 1. Persiapan Database

### 1.1. Instalasi Prisma
Jalankan perintah berikut untuk menginstall Prisma:
```bash
pnpm add prisma --save-dev
pnpm add @prisma/client
```

### 1.2. Inisialisasi Prisma
Inisialisasi Prisma di project:
```bash
npx prisma init
```
Akan terbentuk folder `prisma/` dan file `prisma/schema.prisma`.

### 1.3. Membuat Model Database
Edit file `prisma/schema.prisma` dan buat model sesuai kebutuhan aplikasi. Contoh model utama:
- `User`, `FamilyHead`, `Spouse`, `Dependent`, `KasLingkungan`, `DanaMandiriTransaction`, `IKATATransaction`, `DolingSchedule`, `DolingDetail`, `Agenda`, `Approval`, `Notification`, dsb.
- Pastikan model dan relasi sesuai dengan dokumentasi di `database.md`.

### 1.4. Migrasi Database
Jalankan migrasi untuk membuat tabel di database:
```bash
npx prisma migrate dev --name init
```
Pastikan database sudah terisi struktur tabel sesuai model.

### 1.5. Membuat Seed Data (Opsional)
Buat file `prisma/seed.ts` untuk mengisi data awal (misal: role user, data dummy kepala keluarga, dsb).
Jalankan seed:
```bash
npx prisma db seed
```

---

## 2. Integrasi Database ke Aplikasi

### 2.1. Setup Prisma Client
Import dan gunakan Prisma Client di backend (API route, server action, dsb):
```ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

---

## 3. Breakdown Task Implementasi Aplikasi (Per Halaman, Role, dan Fungsinya)

### 3.1. Autentikasi & Akses Dasar
1. Halaman Login (belum)
2. Validasi username & password (belum)
3. Notifikasi error login (belum)
4. Halaman Register (belum)
5. Validasi nama kepala keluarga saat register (belum)
6. Validasi duplikasi username saat register (belum)
7. Validasi passphrase saat register (belum)
8. Notifikasi sukses/gagal register (belum)
9. Halaman Lupa Password (belum)
10. Verifikasi nama kepala keluarga (belum)
11. Input passphrase lupa password (belum)
12. Input password baru & konfirmasi (belum)
13. Notifikasi reset password (belum)
14. Halaman Logout (belum)
15. Middleware/route guard untuk akses per role (belum)
16. Redirect user ke dashboard sesuai role (belum)

### 3.2. Dashboard (src/app/(dashboard)/dashboard)
#### SuperUser, Ketua Lingkungan, Bendahara, AdminLingkungan:
1. Menampilkan ringkasan keuangan lingkungan (belum)
2. Menampilkan ringkasan keuangan IKATA (belum)
3. Menampilkan ringkasan kesekretariatan (belum)
4. Menampilkan daftar penunggak Dana Mandiri & IKATA (belum)
5. Filter bulan/tahun dashboard (belum)
6. Sidebar menu dinamis sesuai role (belum)
7. Notifikasi real-time (belum)
8. Loading skeleton dashboard (belum)
9. Error boundary dashboard (belum)
10. Server action fetch data dashboard (belum)

#### Sekretaris, Wakil Sekretaris:
1. Menampilkan ringkasan kesekretariatan (belum)
2. Menampilkan daftar penunggak Dana Mandiri & IKATA (belum)
3. Filter bulan/tahun dashboard (belum)
4. Sidebar menu dinamis sesuai role (belum)
5. Notifikasi real-time (belum)
6. Loading skeleton dashboard (belum)
7. Error boundary dashboard (belum)
8. Server action fetch data dashboard (belum)

#### Umat:
1. Menampilkan daftar penunggak Dana Mandiri & IKATA (belum)
2. Sidebar menu dinamis sesuai role (belum)
3. Notifikasi real-time (belum)
4. Loading skeleton dashboard (belum)
5. Error boundary dashboard (belum)
6. Server action fetch data dashboard (belum)

### 3.3. Lingkungan
#### Kas Lingkungan (SuperUser, Ketua Lingkungan, Bendahara, AdminLingkungan)
1. Menampilkan datacard kas lingkungan (belum)
2. Tabel transaksi kas lingkungan (belum)
3. Input transaksi kas lingkungan (belum)
4. Edit transaksi kas lingkungan (belum)
5. Hapus transaksi kas lingkungan (belum)
6. Print PDF kas lingkungan (belum)
7. Lock transaksi setelah print (belum)
8. Transfer ke kas IKATA (belum)
9. Filter transaksi kas lingkungan (bulan/tahun) (belum)
10. Notifikasi aksi kas lingkungan (belum)
11. Loading skeleton kas lingkungan (belum)
12. Error boundary kas lingkungan (belum)
13. Server action CRUD kas lingkungan (belum)

#### Dana Mandiri (SuperUser, Ketua Lingkungan, Bendahara, AdminLingkungan)
1. Menampilkan datacard dana mandiri (belum)
2. Tabel transaksi dana mandiri (belum)
3. Input transaksi dana mandiri (belum)
4. Edit transaksi dana mandiri (belum)
5. Hapus transaksi dana mandiri (belum)
6. Setor ke paroki (belum)
7. Print PDF dana mandiri (belum)
8. Lock data setor (belum)
9. Monitoring penunggak dana mandiri (belum)
10. Set iuran dana mandiri (belum)
11. Kirim notifikasi pengingat (belum)
12. Filter transaksi dana mandiri (tahun) (belum)
13. Notifikasi aksi dana mandiri (belum)
14. Loading skeleton dana mandiri (belum)
15. Error boundary dana mandiri (belum)
16. Server action CRUD dana mandiri (belum)

### 3.4. IKATA
#### Kas IKATA (SuperUser, Ketua Lingkungan, Wakil Bendahara, AdminLingkungan)
1. Menampilkan datacard kas IKATA (belum)
2. Tabel transaksi kas IKATA (belum)
3. Input transaksi kas IKATA (belum)
4. Edit transaksi kas IKATA (belum)
5. Hapus transaksi kas IKATA (belum)
6. Print PDF kas IKATA (belum)
7. Lock transaksi setelah print (belum)
8. Notifikasi real-time pembayaran iuran (belum)
9. Filter transaksi kas IKATA (bulan/tahun) (belum)
10. Loading skeleton kas IKATA (belum)
11. Error boundary kas IKATA (belum)
12. Server action CRUD kas IKATA (belum)

#### Monitoring Penunggak (SuperUser, Ketua Lingkungan, Wakil Bendahara, AdminLingkungan)
1. Monitoring penunggak iuran IKATA (belum)
2. Set iuran IKATA (belum)
3. Kirim notifikasi pengingat (belum)
4. Filter monitoring penunggak (tahun) (belum)
5. Loading skeleton monitoring penunggak (belum)
6. Error boundary monitoring penunggak (belum)
7. Server action monitoring penunggak (belum)

### 3.5. Kesekretariatan
#### Data Umat (SuperUser, Ketua Lingkungan, Sekretaris, Wakil Sekretaris, AdminLingkungan)
1. Tabel kepala keluarga (belum)
2. Tambah kepala keluarga (belum)
3. Edit kepala keluarga (belum)
4. Hapus kepala keluarga (belum)
5. Status pindah/meninggal (belum)
6. Download template data umat (belum)
7. Impor data umat (belum)
8. Notifikasi aksi data umat (belum)
9. Filter data umat (nama, status) (belum)
10. Loading skeleton data umat (belum)
11. Error boundary data umat (belum)
12. Server action CRUD data umat (belum)

#### Doa Lingkungan (SuperUser, Ketua Lingkungan, Sekretaris, Wakil Sekretaris, AdminLingkungan)
1. Jadwal doling (belum)
2. Tambah jadwal doling (belum)
3. Edit jadwal doling (belum)
4. Hapus jadwal doling (belum)
5. Detail kegiatan doling (belum)
6. Input detail kegiatan doling (belum)
7. Edit detail kegiatan doling (belum)
8. Hapus detail kegiatan doling (belum)
9. Absensi doling (belum)
10. Input absensi doling (belum)
11. Edit absensi doling (belum)
12. Riwayat doling (belum)
13. Kaleidoskop (rekap kegiatan) (belum)
14. Notifikasi aksi doling (belum)
15. Loading skeleton doling (belum)
16. Error boundary doling (belum)
17. Server action CRUD doling (belum)

#### Agenda (Umat, Pengurus, SuperUser)
1. List permohonan agenda (belum)
2. Pengajuan agenda (umat) (belum)
3. Tindak lanjut agenda (pengurus) (belum)
4. Update status agenda (pengurus) (belum)
5. Hapus agenda (superuser/pengurus/umat) (belum)
6. Notifikasi agenda (belum)
7. Hapus otomatis agenda selesai (belum)
8. Filter agenda (status, target) (belum)
9. Loading skeleton agenda (belum)
10. Error boundary agenda (belum)
11. Server action CRUD agenda (belum)

### 3.6. Publikasi
#### Pengumuman (Semua Role)
1. List pengumuman (belum)
2. Input laporan publikasi (belum)
3. Edit laporan publikasi (belum)
4. Hapus laporan publikasi (belum)
5. Hapus otomatis pengumuman kadaluarsa (belum)
6. Unduh lampiran pengumuman (belum)
7. Filter pencarian pengumuman (belum)
8. Notifikasi aksi publikasi (belum)
9. Loading skeleton publikasi (belum)
10. Error boundary publikasi (belum)
11. Server action publikasi (belum)

#### Buat Publikasi (SuperUser, Pengurus)
1. Buat publikasi baru (belum)
2. Pilih target notifikasi (belum)
3. Upload file publikasi (belum)
4. Klasifikasi publikasi (belum)
5. Deadline publikasi (belum)
6. Integrasi notifikasi publikasi (belum)
7. Edit publikasi (belum)
8. Hapus publikasi (belum)
9. Loading skeleton buat publikasi (belum)
10. Error boundary buat publikasi (belum)
11. Server action buat publikasi (belum)

### 3.7. Pengaturan
#### Profil (Semua Role, hanya Umat bisa edit)
1. Lihat data profil (belum)
2. Edit data profil (umat) (belum)
3. Edit data pasangan (umat) (belum)
4. Edit data tanggungan (umat) (belum)
5. Upload foto profil (umat) (belum)
6. Notifikasi aksi profil (belum)
7. Loading skeleton profil (belum)
8. Error boundary profil (belum)
9. Server action profil (belum)

#### Ubah Password (Semua Role)
1. Ubah password (belum)
2. Validasi password lama (belum)
3. Input password baru & konfirmasi (belum)
4. Notifikasi ubah password (belum)
5. Loading skeleton ubah password (belum)
6. Error boundary ubah password (belum)
7. Server action ubah password (belum)

#### Wipe Data (SuperUser)
1. Wipe data aplikasi (belum)
2. Konfirmasi wipe data (belum)
3. Notifikasi wipe data (belum)
4. Loading skeleton wipe data (belum)
5. Error boundary wipe data (belum)
6. Server action wipe data (belum)

### 3.8. Approval (SuperUser, Pengurus)
1. Approval data doling ke kas lingkungan (belum)
2. Tampilan data persetujuan (belum)
3. Dialog konfirmasi approval (belum)
4. Notifikasi approval (belum)
5. Filter data approval (belum)
6. Loading skeleton approval (belum)
7. Error boundary approval (belum)
8. Server action approval (belum)

### 3.9. Histori Pembayaran
#### Umat
1. Lihat histori pembayaran sendiri (belum)
2. Filter histori pembayaran (tahun) (belum)
3. Notifikasi histori pembayaran (belum)
4. Loading skeleton histori pembayaran (belum)
5. Error boundary histori pembayaran (belum)
6. Server action histori pembayaran (belum)

#### SuperUser
1. Lihat semua histori pembayaran (belum)
2. Filter histori pembayaran (tahun, user) (belum)
3. Notifikasi histori pembayaran (belum)
4. Loading skeleton histori pembayaran (belum)
5. Error boundary histori pembayaran (belum)
6. Server action histori pembayaran (belum)

---

