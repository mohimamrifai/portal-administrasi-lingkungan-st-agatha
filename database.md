# Dokumentasi Skema Database Portal Administrasi Lingkungan St. Agatha (Versi Lengkap)

## 1. Tabel Utama & Relasi

### A. `family_heads` (Kepala Keluarga)
| Kolom             | Tipe Data   | Keterangan                        |
|-------------------|-------------|------------------------------------|
| id                | INTEGER PK  | Primary key                        |
| full_name         | VARCHAR     | Nama lengkap kepala keluarga        |
| gender            | ENUM        | Jenis kelamin                      |
| birth_place       | VARCHAR     | Tempat lahir                       |
| birth_date        | DATE        | Tanggal lahir                      |
| nik               | VARCHAR     | Nomor Induk Kependudukan           |
| marital_status    | ENUM        | Status pernikahan                  |
| address           | VARCHAR     | Alamat                             |
| city              | VARCHAR     | Kota domisili                      |
| phone_number      | VARCHAR     | Nomor telepon                      |
| email             | VARCHAR     | Email                              |
| occupation        | VARCHAR     | Pekerjaan                          |
| education         | VARCHAR     | Pendidikan terakhir                |
| religion          | ENUM        | Agama                              |
| living_status     | ENUM        | Status hidup/meninggal             |
| biduk_number      | VARCHAR     | No. Biduk (jika Katolik)           |
| baptism_date      | DATE        | Tanggal baptis (opsional)          |
| confirmation_date | DATE        | Tanggal krisma (opsional)          |
| death_date        | DATE        | Tanggal meninggal (jika meninggal) |
| image_url         | VARCHAR     | URL foto                           |
| created_at        | TIMESTAMP   | Waktu dibuat                       |
| updated_at        | TIMESTAMP   | Waktu diubah                       |
| scheduled_delete_date | DATE        | Tanggal terjadwal penghapusan data  |
| deceased_member_name | VARCHAR     | Nama anggota keluarga yang meninggal |

**Fungsi:** Menyimpan data utama kepala keluarga di lingkungan.

---

### B. `spouses` (Pasangan)
| Kolom             | Tipe Data   | Keterangan                        |
|-------------------|-------------|------------------------------------|
| id                | INTEGER PK  | Primary key                        |
| family_head_id    | INTEGER FK  | Relasi ke `family_heads`           |
| full_name         | VARCHAR     | Nama lengkap pasangan              |
| gender            | ENUM        | Jenis kelamin                      |
| birth_place       | VARCHAR     | Tempat lahir                       |
| birth_date        | DATE        | Tanggal lahir                      |
| nik               | VARCHAR     | Nomor Induk Kependudukan           |
| address           | VARCHAR     | Alamat                             |
| city              | VARCHAR     | Kota domisili                      |
| phone_number      | VARCHAR     | Nomor telepon                      |
| email             | VARCHAR     | Email                              |
| occupation        | VARCHAR     | Pekerjaan                          |
| education         | VARCHAR     | Pendidikan terakhir                |
| religion          | ENUM        | Agama                              |
| living_status     | ENUM        | Status hidup/meninggal             |
| biduk_number      | VARCHAR     | No. Biduk (jika Katolik)           |
| baptism_date      | DATE        | Tanggal baptis (opsional)          |
| confirmation_date | DATE        | Tanggal krisma (opsional)          |
| death_date        | DATE        | Tanggal meninggal (jika meninggal) |
| image_url         | VARCHAR     | URL foto                           |

**Fungsi:** Menyimpan data pasangan dari kepala keluarga.

---

### C. `dependents` (Tanggungan)
| Kolom             | Tipe Data   | Keterangan                        |
|-------------------|-------------|------------------------------------|
| id                | INTEGER PK  | Primary key                        |
| family_head_id    | INTEGER FK  | Relasi ke `family_heads`           |
| name              | VARCHAR     | Nama tanggungan                    |
| dependent_type    | ENUM        | Jenis tanggungan (anak/kerabat)    |
| gender            | ENUM        | Jenis kelamin                      |
| birth_place       | VARCHAR     | Tempat lahir                       |
| birth_date        | DATE        | Tanggal lahir                      |
| education         | VARCHAR     | Pendidikan terakhir                |
| religion          | ENUM        | Agama                              |
| marital_status    | ENUM        | Status pernikahan                  |
| baptism_date      | DATE        | Tanggal baptis (opsional)          |
| confirmation_date | DATE        | Tanggal krisma (opsional)          |
| image_url         | VARCHAR     | URL foto                           |

**Fungsi:** Menyimpan data anak dan kerabat lain dalam satu keluarga.

---

### D. `users` (Pengguna)
| Kolom         | Tipe Data   | Keterangan                        |
|---------------|-------------|------------------------------------|
| id            | INTEGER PK  | Primary key                        |
| name          | VARCHAR     | Nama pengguna                      |
| email         | VARCHAR     | Email                              |
| password_hash | VARCHAR     | Hash password                      |
| role          | ENUM        | Peran pengguna (admin, pengurus, anggota, dll) |
| created_at    | TIMESTAMP   | Waktu dibuat                       |
| updated_at    | TIMESTAMP   | Waktu diubah                       |

**Fungsi:** Menyimpan data pengguna aplikasi (untuk login, approval, dsb).

---

### E. `doling_schedules` (Jadwal Doa Lingkungan)
| Kolom         | Tipe Data   | Keterangan                        |
|---------------|-------------|------------------------------------|
| id            | INTEGER PK  | Primary key                        |
| tanggal       | DATE        | Tanggal kegiatan                   |
| waktu         | VARCHAR     | Waktu kegiatan                     |
| tuan_rumah_id | INTEGER FK  | Relasi ke `family_heads`           |
| tuan_rumah    | VARCHAR     | Nama tuan rumah                    |
| alamat        | VARCHAR     | Alamat kegiatan                    |
| no_telepon    | VARCHAR     | Nomor telepon tuan rumah           |
| catatan       | TEXT        | Catatan tambahan                   |
| status        | ENUM        | Status (terjadwal/selesai/dibatalkan) |
| created_at    | TIMESTAMP   | Waktu dibuat                       |
| updated_at    | TIMESTAMP   | Waktu diubah                       |

**Fungsi:** Menyimpan jadwal kegiatan doa lingkungan.

---

### F. `doling_details` (Detail Kegiatan Doling)
| Kolom             | Tipe Data   | Keterangan                        |
|-------------------|-------------|------------------------------------|
| id                | INTEGER PK  | Primary key                        |
| jadwal_id         | INTEGER FK  | Relasi ke `doling_schedules`       |
| tanggal           | DATE        | Tanggal kegiatan                   |
| tuan_rumah        | VARCHAR     | Nama tuan rumah                    |
| jumlah_hadir      | INTEGER     | Jumlah hadir                       |
| jenis_ibadat      | VARCHAR     | Jenis ibadat                       |
| sub_ibadat        | VARCHAR     | Sub ibadat                         |
| tema_ibadat       | VARCHAR     | Tema ibadat                        |
| kegiatan          | VARCHAR     | Nama kegiatan                      |
| biaya             | INTEGER     | Biaya kegiatan                     |
| koleksi           | INTEGER     | Koleksi                            |
| keterangan        | TEXT        | Keterangan tambahan                |
| status            | ENUM        | Status (selesai/dibatalkan)        |
| sudah_diapprove   | BOOLEAN     | Sudah di-approve                   |
| created_at        | TIMESTAMP   | Waktu dibuat                       |
| updated_at        | TIMESTAMP   | Waktu diubah                       |
| jumlah_kk_hadir   | INTEGER     | Jumlah KK hadir                    |
| jumlah_bapak      | INTEGER     | Jumlah bapak hadir                 |
| jumlah_ibu        | INTEGER     | Jumlah ibu hadir                   |
| jumlah_omk        | INTEGER     | Jumlah OMK hadir                   |
| jumlah_bia_kecil  | INTEGER     | Jumlah BIA kecil                   |
| jumlah_bia_besar  | INTEGER     | Jumlah BIA besar                   |
| jumlah_bir        | INTEGER     | Jumlah BIR hadir                   |
| jumlah_peserta    | INTEGER     | Jumlah peserta (khusus misa)       |
| kolekte1          | INTEGER     | Kolekte 1                          |
| kolekte2          | INTEGER     | Kolekte 2                          |
| ucapan_syukur     | INTEGER     | Ucapan syukur                      |
| petugas_xxx       | VARCHAR     | Kolom petugas misa/doa             |

**Fungsi:** Menyimpan detail pelaksanaan kegiatan doling.

---

### G. `agendas` (Agenda Kegiatan)
| Kolom           | Tipe Data   | Keterangan                        |
|-----------------|-------------|------------------------------------|
| id              | INTEGER PK  | Primary key                        |
| title           | VARCHAR     | Judul agenda                       |
| description     | TEXT        | Deskripsi agenda                   |
| date            | DATE        | Tanggal kegiatan                   |
| location        | VARCHAR     | Lokasi kegiatan                    |
| target          | ENUM        | Target (lingkungan/stasi/paroki)   |
| status          | ENUM        | Status agenda                      |
| rejection_reason| TEXT        | Alasan penolakan (jika ada)        |
| created_by_id   | INTEGER FK  | Relasi ke `users`                  |
| created_at      | TIMESTAMP   | Waktu dibuat                       |
| updated_at      | TIMESTAMP   | Waktu diubah                       |
| completed_at    | TIMESTAMP   | Waktu selesai                      |

**Fungsi:** Menyimpan agenda kegiatan lingkungan/stasi/paroki.

---

### H. `payment_histories` (Histori Pembayaran)
| Kolom           | Tipe Data   | Keterangan                        |
|-----------------|-------------|------------------------------------|
| id              | INTEGER PK  | Primary key                        |
| user_id         | INTEGER FK  | Relasi ke `users`                  |
| family_head_name| VARCHAR     | Nama kepala keluarga               |
| type            | ENUM        | Jenis pembayaran                   |
| description     | TEXT        | Keterangan pembayaran              |
| amount          | INTEGER     | Jumlah pembayaran                  |
| status          | ENUM        | Status pembayaran                  |
| year            | INTEGER     | Tahun pembayaran                   |
| payment_date    | DATE        | Tanggal pembayaran                 |

**Fungsi:** Menyimpan histori pembayaran iuran atau dana sosial.

---

## 2. Tabel Tambahan untuk Fitur Lanjutan

### I. `dana_mandiri_transactions` (Transaksi Dana Mandiri)
| Kolom           | Tipe Data   | Keterangan                        |
|-----------------|-------------|------------------------------------|
| id              | INTEGER PK  | Primary key                        |
| family_head_id  | INTEGER FK  | Relasi ke `family_heads`           |
| year            | INTEGER     | Tahun iuran                        |
| amount          | INTEGER     | Jumlah iuran                       |
| status          | ENUM        | Status (pending/paid/submitted)    |
| payment_date    | DATE        | Tanggal pembayaran                 |
| is_locked       | BOOLEAN     | Terkunci (tidak bisa diubah)       |
| notes           | TEXT        | Catatan                            |
| payment_status  | ENUM        | Lunas/Belum Lunas                  |
| created_at      | TIMESTAMP   | Waktu dibuat                       |
| updated_at      | TIMESTAMP   | Waktu diubah                       |

**Fungsi:** Mencatat transaksi iuran Dana Mandiri per kepala keluarga per tahun.

---

### J. `kas_lingkungan` (Kas Lingkungan)
| Kolom             | Tipe Data   | Keterangan                        |
|-------------------|-------------|------------------------------------|
| id                | INTEGER PK  | Primary key                        |
| date              | DATE        | Tanggal transaksi                  |
| description       | TEXT        | Keterangan                         |
| debit             | INTEGER     | Uang masuk                         |
| credit            | INTEGER     | Uang keluar                        |
| locked            | BOOLEAN     | Terkunci                           |
| transaction_type  | ENUM        | debit/credit                       |
| transaction_subtype| ENUM       | Subtipe transaksi                  |
| family_head_id    | INTEGER FK  | Relasi ke `family_heads` (opsional)|
| created_at        | TIMESTAMP   | Waktu dibuat                       |
| updated_at        | TIMESTAMP   | Waktu diubah                       |

**Fungsi:** Mencatat seluruh pemasukan dan pengeluaran kas lingkungan.

---

### K. `approvals` (Approval Kegiatan/Transaksi)
| Kolom         | Tipe Data   | Keterangan                        |
|---------------|-------------|------------------------------------|
| id            | INTEGER PK  | Primary key                        |
| item_type     | ENUM        | Jenis item (agenda, doling, kas, dll)|
| item_id       | INTEGER     | ID item yang di-approve            |
| status        | ENUM        | Status (pending/approved/rejected) |
| reason        | TEXT        | Alasan penolakan                   |
| message       | TEXT        | Pesan tambahan                     |
| approved_by   | INTEGER FK  | Relasi ke `users`                  |
| created_at    | TIMESTAMP   | Waktu dibuat                       |
| updated_at    | TIMESTAMP   | Waktu diubah                       |

**Fungsi:** Mencatat proses approval untuk berbagai item (agenda, kas, dll).

---

### L. `approval_history` (Riwayat Approval)
| Kolom         | Tipe Data   | Keterangan                        |
|---------------|-------------|------------------------------------|
| id            | INTEGER PK  | Primary key                        |
| approval_id   | INTEGER FK  | Relasi ke `approvals`              |
| approval_date | TIMESTAMP   | Tanggal approval                   |
| approved_by   | INTEGER FK  | Relasi ke `users`                  |
| status        | ENUM        | Status (approved/rejected)         |
| reason        | TEXT        | Alasan                             |

**Fungsi:** Mencatat riwayat proses approval.

---

### M. `publications` (Publikasi/Pengumuman)
| Kolom           | Tipe Data   | Keterangan                        |
|-----------------|-------------|------------------------------------|
| id              | INTEGER PK  | Primary key                        |
| title           | VARCHAR     | Judul publikasi                    |
| date            | DATE        | Tanggal publikasi                  |
| time            | VARCHAR     | Waktu                              |
| location        | VARCHAR     | Lokasi                             |
| target          | ENUM        | Target penerima                    |
| status          | ENUM        | Status (aktif/kedaluwarsa)         |
| created_by      | INTEGER FK  | Relasi ke `users`                  |
| attachment      | BOOLEAN     | Ada lampiran atau tidak            |
| category        | ENUM        | Kategori (Penting/Umum/Rahasia)    |
| locked          | BOOLEAN     | Terkunci                           |
| created_at      | TIMESTAMP   | Waktu dibuat                       |
| updated_at      | TIMESTAMP   | Waktu diubah                       |

**Fungsi:** Menyimpan pengumuman/publikasi ke seluruh atau sebagian pengguna.

---

### N. `publication_reports` (Laporan Publikasi)
| Kolom           | Tipe Data   | Keterangan                        |
|-----------------|-------------|------------------------------------|
| id              | INTEGER PK  | Primary key                        |
| publication_id  | INTEGER FK  | Relasi ke `publications`           |
| title           | VARCHAR     | Judul laporan                      |
| type            | VARCHAR     | Jenis laporan                      |
| date            | DATE        | Tanggal laporan                    |
| description     | TEXT        | Keterangan                         |
| attachment      | VARCHAR     | File lampiran                      |

**Fungsi:** Menyimpan laporan yang terkait dengan publikasi.

---

### O. `ikata_transactions` (Kas IKATA)
| Kolom             | Tipe Data   | Keterangan                        |
|-------------------|-------------|------------------------------------|
| id                | INTEGER PK  | Primary key                        |
| date              | DATE        | Tanggal transaksi                  |
| description       | TEXT        | Keterangan                         |
| amount            | INTEGER     | Jumlah uang                        |
| type              | ENUM        | uang_masuk/uang_keluar             |
| subtype           | ENUM        | Tipe transaksi                     |
| debit             | INTEGER     | Uang masuk                         |
| credit            | INTEGER     | Uang keluar                        |
| status_pembayaran | ENUM        | Status pembayaran                  |
| periode_bayar     | VARCHAR     | Periode pembayaran                 |
| anggota_id        | INTEGER FK  | Relasi ke anggota IKATA            |
| created_by        | INTEGER FK  | Relasi ke `users`                  |
| updated_by        | INTEGER FK  | Relasi ke `users`                  |
| locked            | BOOLEAN     | Terkunci                           |
| created_at        | TIMESTAMP   | Waktu dibuat                       |
| updated_at        | TIMESTAMP   | Waktu diubah                       |

**Fungsi:** Mencatat seluruh transaksi kas IKATA (masuk dan keluar).

---

## 3. Penjelasan Umum
- **family_heads, spouses, dependents**: Data umat dan keluarga.
- **users**: Data pengguna aplikasi.
- **doling_schedules, doling_details**: Jadwal dan detail kegiatan doa lingkungan.
- **agendas**: Manajemen agenda kegiatan.
- **payment_histories**: Pencatatan pembayaran iuran/donasi.
- **dana_mandiri_transactions**: Transaksi iuran Dana Mandiri.
- **kas_lingkungan**: Kas keuangan lingkungan.
- **approvals, approval_history**: Proses dan riwayat approval.
- **publications, publication_reports**: Pengumuman dan laporan publikasi.
- **ikata_transactions**: Kas keuangan IKATA.

---

**Catatan:**
- Skema di atas sudah mencakup seluruh kebutuhan fitur utama dan lanjutan aplikasi.
- Relasi antar tabel sudah disesuaikan dengan kebutuhan aplikasi berbasis komunitas/lingkungan gereja.
- Jika ada fitur baru, skema dapat dikembangkan lebih lanjut.

## 4. Daftar ENUM yang Digunakan

### ENUM pada Tabel `family_heads`, `spouses`, `dependents`
- **gender**: 
  - 'laki_laki', 'perempuan'
- **marital_status**: 
  - 'belum_menikah', 'menikah', 'cerai_hidup', 'cerai_mati'
- **living_status**: 
  - 'hidup', 'meninggal'
- **religion**: 
  - 'katolik', 'protestan', 'islam', 'hindu', 'buddha', 'konghucu'
- **dependent_type** (khusus dependents):
  - 'anak', 'kerabat_lain'
- **status** (khusus family_heads):
  - 'active', 'moved', 'deceased'

### ENUM pada Tabel `users`
- **role**:
  - 'super_user'
  - 'ketua_lingkungan'
  - 'wakil_ketua'
  - 'sekretaris'
  - 'wakil_sekretaris'
  - 'bendahara'
  - 'wakil_bendahara'
  - 'umat'

### ENUM pada Tabel `doling_schedules`, `doling_details`
- **status**:
  - 'terjadwal', 'selesai', 'dibatalkan' (jadwal)
  - 'selesai', 'dibatalkan' (detail)
- **jenis_ibadat** (opsional, doling_details):
  - 'doa_lingkungan', 'misa', 'pertemuan', 'bakti_sosial', 'kegiatan_lainnya'

### ENUM pada Tabel `agendas`
- **target**:
  - 'lingkungan', 'stasi', 'paroki'
- **status**:
  - 'open', 'processing_lingkungan', 'processing_stasi', 'processing_paroki', 'forwarded_to_paroki', 'rejected', 'completed'

### ENUM pada Tabel `payment_histories`, `dana_mandiri_transactions`
- **type**:
  - 'dana_mandiri', 'ikata'
- **status**:
  - 'lunas', 'menunggu', 'belum_bayar', 'pending', 'paid', 'submitted'
- **payment_status**:
  - 'lunas', 'belum_lunas', 'sebagian_bulan', 'belum_ada_pembayaran'

### ENUM pada Tabel `kas_lingkungan`, `ikata_transactions`
- **transaction_type** / **type**:
  - 'debit', 'credit', 'uang_masuk', 'uang_keluar'
- **transaction_subtype** / **subtype**:
  - 'kolekte_1', 'kolekte_2', 'sumbangan_umat', 'penerimaan_lain', 'operasional', 'kegiatan', 'pembelian', 'sosial_duka', 'lain_lain', 'iuran_anggota', 'transfer_dana_lingkungan', 'sumbangan_anggota', 'penerimaan_lain', 'uang_duka', 'kunjungan_kasih', 'cinderamata_kelahiran', 'cinderamata_pernikahan', 'uang_akomodasi', 'pengeluaran_operasional', 'pengeluaran_inventaris', 'pengeluaran_konsumsi', 'pengeluaran_transport', 'pengeluaran_sumbangan'
- **status_pembayaran**:
  - 'lunas', 'sebagian_bulan', 'belum_ada_pembayaran'

### ENUM pada Tabel `approvals`, `approval_history`
- **item_type**:
  - 'agenda', 'doling', 'kas', 'publikasi'
- **status**:
  - 'pending', 'approved', 'rejected'

### ENUM pada Tabel `publications`, `publication_reports`
- **status**:
  - 'aktif', 'kedaluwarsa'
- **category**:
  - 'penting', 'umum', 'rahasia', 'segera'
- **target**:
  - 'semua_pengguna', 'umat', 'ketua_lingkungan', 'sekretaris', 'bendahara', 'admin_lingkungan', 'pengurus', 'super_user', 'kepala_keluarga', 'anggota_ikata', 'peserta_doa_lingkungan'

---

**Catatan:**
- Semua value enum sudah distandarisasi menggunakan lowercase dan snake_case agar konsisten dengan implementasi aplikasi dan mudah di-query.
- Jika ada enum baru, tambahkan sesuai kebutuhan dan pastikan konsisten di backend & frontend.

## 5. Penyempurnaan Skema (Kolom & Tabel Opsional untuk Masa Depan)

### Penambahan Kolom pada `family_heads`
Tambahkan kolom berikut pada tabel `family_heads`:
- **scheduled_delete_date** (DATE, nullable):
  - Tanggal terjadwal penghapusan data (misal, jika status pindah).
- **deceased_member_name** (VARCHAR, nullable):
  - Nama anggota keluarga yang meninggal (jika status meninggal).

**Fungsi:**
- Memudahkan pengelolaan data keluarga yang statusnya pindah/meninggal sesuai kebutuhan aplikasi.

---

### Tabel `doling_attendance` (Absensi Detail Kegiatan Doling)
| Kolom             | Tipe Data   | Keterangan                        |
|-------------------|-------------|------------------------------------|
| id                | INTEGER PK  | Primary key                        |
| doling_detail_id  | INTEGER FK  | Relasi ke `doling_details`         |
| family_head_id    | INTEGER FK  | Relasi ke `family_heads`           |
| dependent_id      | INTEGER FK  | Relasi ke `dependents` (opsional)  |
| hadir             | BOOLEAN     | Status kehadiran                   |
| keterangan        | TEXT        | Keterangan tambahan (opsional)     |

**Fungsi:**
- Mencatat kehadiran detail setiap anggota keluarga pada kegiatan doling.

---

### Tabel `audit_logs` (Audit Trail/Aktivitas Perubahan Data)
| Kolom             | Tipe Data   | Keterangan                        |
|-------------------|-------------|------------------------------------|
| id                | INTEGER PK  | Primary key                        |
| user_id           | INTEGER FK  | Relasi ke `users`                  |
| action            | VARCHAR     | Jenis aksi (insert, update, delete)|
| table_name        | VARCHAR     | Nama tabel yang diubah             |
| record_id         | INTEGER     | ID record yang diubah              |
| old_data          | JSON        | Data lama (sebelum perubahan)      |
| new_data          | JSON        | Data baru (setelah perubahan)      |
| created_at        | TIMESTAMP   | Waktu aksi                         |

**Fungsi:**
- Melacak seluruh perubahan data penting di aplikasi (untuk keamanan dan audit).

---

### Tabel `notifications` (Notifikasi/Pemberitahuan)
| Kolom             | Tipe Data   | Keterangan                        |
|-------------------|-------------|------------------------------------|
| id                | INTEGER PK  | Primary key                        |
| user_id           | INTEGER FK  | Relasi ke `users` (penerima)       |
| title             | VARCHAR     | Judul notifikasi                   |
| message           | TEXT        | Isi pesan notifikasi               |
| type              | ENUM        | Jenis notifikasi (info, warning, reminder, dsb) |
| is_read           | BOOLEAN     | Status sudah dibaca                |
| created_at        | TIMESTAMP   | Waktu dibuat                       |

**Fungsi:**
- Menyimpan dan mengelola notifikasi untuk pengguna aplikasi.

---

**Catatan:**
- Kolom dan tabel tambahan ini bersifat opsional, namun sangat direkomendasikan untuk aplikasi yang ingin berkembang dan profesional.
- Penambahan ini membuat database lebih siap untuk fitur lanjutan tanpa perlu migrasi besar di masa depan.
