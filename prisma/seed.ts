import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  // 1. Kepala Keluarga & User
  const kk1 = await prisma.familyHead.create({
    data: {
      fullName: 'Budi Santoso',
      gender: 'MALE',
      birthPlace: 'Jakarta',
      birthDate: new Date('1980-01-01'),
      nik: '3171010101800001',
      maritalStatus: 'MARRIED',
      address: 'Jl. Merdeka No. 123',
      city: 'Jakarta',
      phoneNumber: '081234567890',
      email: 'budi@contoh.com',
      occupation: 'Karyawan Swasta',
      education: 'S1',
      religion: 'CATHOLIC',
      livingStatus: 'ALIVE',
      joinDate: new Date('2020-01-15'),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      spouse: {
        create: {
          fullName: 'Siti Rahma',
          gender: 'FEMALE',
          birthPlace: 'Bandung',
          birthDate: new Date('1982-09-20'),
          nik: '3171092009820003',
          address: 'Jl. Merdeka No. 123',
          city: 'Jakarta',
          phoneNumber: '081234567891',
          occupation: 'Guru',
          education: 'S1',
          religion: 'CATHOLIC',
          livingStatus: 'ALIVE',
        }
      },
      dependents: {
        create: [
          {
            name: 'Agus Santoso',
            dependentType: 'CHILD',
            gender: 'MALE',
            birthPlace: 'Jakarta',
            birthDate: new Date('2005-04-10'),
            education: 'SMA',
            religion: 'CATHOLIC',
            maritalStatus: 'SINGLE',
          },
          {
            name: 'Dewi Santoso',
            dependentType: 'CHILD',
            gender: 'FEMALE',
            birthPlace: 'Jakarta',
            birthDate: new Date('2008-08-22'),
            education: 'SMP',
            religion: 'CATHOLIC',
            maritalStatus: 'SINGLE',
          }
        ]
      }
    }
  });
  const kk2 = await prisma.familyHead.create({
    data: {
      fullName: 'Ani Wijaya',
      gender: 'FEMALE',
      birthPlace: 'Surabaya',
      birthDate: new Date('1975-05-10'),
      nik: '3171010101750002',
      maritalStatus: 'WIDOWED',
      address: 'Jl. Sudirman No. 456',
      city: 'Surabaya',
      phoneNumber: '089876543210',
      occupation: 'Wiraswasta',
      education: 'SMA',
      religion: 'ISLAM',
      livingStatus: 'ALIVE',
      joinDate: new Date('2021-05-10'),
      status: 'moved',
      scheduledDeleteDate: new Date('2022-06-10'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });
  const kk3 = await prisma.familyHead.create({
    data: {
      fullName: 'Hendra Gunawan',
      gender: 'MALE',
      birthPlace: 'Bandung',
      birthDate: new Date('1965-03-20'),
      nik: '3171010101650003',
      maritalStatus: 'MARRIED',
      address: 'Jl. Anggrek No. 20',
      city: 'Bandung',
      phoneNumber: '081234567892',
      occupation: 'Pensiunan',
      education: 'SMA',
      religion: 'BUDDHA',
      livingStatus: 'DECEASED',
      joinDate: new Date('2010-03-20'),
      status: 'deceased',
      deathDate: new Date('2023-01-01'),
      deceasedMemberName: 'Hendra Gunawan',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });

  // User
  await prisma.user.createMany({
    data: [
      { username: 'admin', password: bcrypt.hashSync('admin123', 10), passphrase: bcrypt.hashSync('adminpass', 10), role: 'SuperUser', familyHeadId: kk1.id },
      { username: 'umat1', password: bcrypt.hashSync('umat123', 10), passphrase: bcrypt.hashSync('passumat', 10), role: 'umat', familyHeadId: kk2.id },
      { username: 'sekretaris', password: bcrypt.hashSync('sekretaris123', 10), passphrase: bcrypt.hashSync('sekretarispass', 10), role: 'sekretaris', familyHeadId: kk3.id },
    ]
  });

  // 2. Transaksi Kas Lingkungan
  await prisma.transaction.createMany({
    data: [
      { date: new Date('2024-06-01'), description: 'Kolekte Doa Lingkungan', debit: 350000, credit: 0, locked: false, transactionType: 'debit', transactionSubtype: 'kolekte_1', familyHeadId: kk1.id },
      { date: new Date('2024-06-05'), description: 'Pembelian Perlengkapan Ibadah', debit: 0, credit: 75000, locked: false, transactionType: 'credit', transactionSubtype: 'pembelian', familyHeadId: kk1.id },
      { date: new Date('2024-06-10'), description: 'Kolekte II', debit: 500000, credit: 0, locked: true, transactionType: 'debit', transactionSubtype: 'kolekte_2', familyHeadId: kk2.id },
      { date: new Date('2024-06-15'), description: 'Konsumsi Pertemuan Pengurus', debit: 0, credit: 250000, locked: false, transactionType: 'credit', transactionSubtype: 'kegiatan', familyHeadId: kk3.id },
    ]
  });

  // 3. Dana Mandiri
  await prisma.danaMandiriTransaction.createMany({
    data: [
      { familyHeadId: kk1.id, year: 2024, amount: 500000, status: 'paid', paymentDate: new Date('2024-03-01'), isLocked: false, notes: 'Lunas awal tahun', paymentStatus: 'Lunas' },
      { familyHeadId: kk2.id, year: 2024, amount: 0, status: 'pending', paymentDate: new Date('2024-06-01'), isLocked: false, notes: 'Belum bayar', paymentStatus: 'Belum Lunas' },
    ]
  });

  // 4. IKATA
  await prisma.iKATATransaction.createMany({
    data: [
      { tanggal: new Date('2024-04-01'), keterangan: 'Iuran Anggota Bulan April', jumlah: 500000, jenis: 'uang_masuk', tipeTransaksi: 'iuran_anggota', debit: 500000, kredit: 0, statusPembayaran: 'lunas', periodeBayar: '2024-04', anggotaId: kk1.id, createdAt: new Date(), updatedAt: new Date(), createdBy: 'sekretaris', updatedBy: 'sekretaris', locked: false },
      { tanggal: new Date('2024-04-10'), keterangan: 'Pembelian Alat Tulis', jumlah: 200000, jenis: 'uang_keluar', tipeTransaksi: 'pembelian', debit: 0, kredit: 200000, statusPembayaran: 'belum_ada_pembayaran', anggotaId: kk2.id, createdAt: new Date(), updatedAt: new Date(), createdBy: 'sekretaris', updatedBy: 'sekretaris', locked: false },
    ]
  });

  // 5. Jadwal & Detil Doling
  const jadwal1 = await prisma.jadwalDoling.create({
    data: {
      tanggal: new Date('2024-07-10'),
      waktu: '19:00',
      tuanRumahId: kk1.id,
      tuanRumah: kk1.fullName,
      alamat: kk1.address,
      noTelepon: kk1.phoneNumber,
      status: 'terjadwal',
      createdAt: new Date(),
      updatedAt: new Date(),
      detilDoling: {
        create: [
          {
            tanggal: new Date('2024-07-10'),
            tuanRumah: kk1.fullName,
            jumlahHadir: 20,
            jenisIbadat: 'doa-lingkungan',
            subIbadat: 'ibadat-sabda',
            temaIbadat: 'Syukur Kesehatan',
            kegiatan: 'doa-lingkungan - ibadat-sabda',
            koleksi: 350000,
            kolekte1: 200000,
            kolekte2: 100000,
            ucapanSyukur: 50000,
            keterangan: 'Doa berjalan lancar',
            status: 'selesai',
            sudahDiapprove: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ]
      }
    }
  });
  await prisma.jadwalDoling.create({
    data: {
      tanggal: new Date('2024-07-15'),
      waktu: '19:00',
      tuanRumahId: kk2.id,
      tuanRumah: kk2.fullName,
      alamat: kk2.address,
      noTelepon: kk2.phoneNumber,
      status: 'dibatalkan',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });

  // 6. Publikasi & Laporan
  const pub1 = await prisma.publikasi.create({
    data: {
      judul: 'Persiapan Natalan 2024',
      tanggal: new Date('2024-12-10'),
      waktu: '19:30',
      lokasi: 'Gereja St. Agatha',
      targetPenerima: 'Semua Pengguna',
      status: 'aktif',
      pembuat: 'Admin Lingkungan',
      lampiran: true,
      locked: false,
      kategori: 'Penting',
      laporan: {
        create: [
          {
            judul: 'Laporan Persiapan Dekorasi',
            jenis: 'Evaluasi',
            tanggal: new Date('2024-12-15'),
            keterangan: 'Laporan tentang persiapan dekorasi',
            lampiran: 'laporan-dekorasi.pdf',
          }
        ]
      }
    }
  });
  await prisma.publikasi.create({
    data: {
      judul: 'Jadwal Misa Paskah',
      tanggal: new Date('2024-04-05'),
      waktu: '15:00',
      lokasi: 'Gereja St. Agatha',
      targetPenerima: 'Umat',
      status: 'kedaluwarsa',
      pembuat: 'Admin Lingkungan',
      lampiran: true,
      locked: true,
      kategori: 'Umum',
    }
  });

  // 7. Approval
  await prisma.approvalItem.create({
    data: {
      itemType: 'DetilDoling',
      itemId: 1,
      status: 'approved',
      approvedBy: 'SuperUser',
      approvedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });

  // 8. Agenda
  await prisma.agenda.create({
    data: {
      title: 'Rapat Lingkungan',
      description: 'Rapat rutin bulanan lingkungan',
      date: new Date('2024-04-20'),
      location: 'Aula Paroki',
      target: 'lingkungan',
      status: 'open',
      createdBy: kk1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });

  // 9. Notifikasi
  await prisma.notification.create({
    data: {
      title: 'Notifikasi Contoh',
      message: 'Ini adalah notifikasi contoh',
      type: 'info',
      timestamp: new Date(),
      isRead: false,
      recipientId: kk1.id,
      senderId: kk2.id,
      relatedItemId: 1,
      relatedItemType: 'Publikasi',
    }
  });

  // 10. PaymentHistory
  await prisma.paymentHistory.createMany({
    data: [
      { userId: 1, familyHeadName: 'Budi Santoso', year: 2024, paymentDate: new Date('2024-03-01'), amount: 500000, status: 'Lunas', type: 'Dana Mandiri', description: 'Lunas awal tahun' },
      { userId: 2, familyHeadName: 'Ani Wijaya', year: 2024, paymentDate: null, amount: 0, status: 'BelumBayar', type: 'Dana Mandiri', description: 'Belum bayar' },
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 