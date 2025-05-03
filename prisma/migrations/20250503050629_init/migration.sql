-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara', 'umat');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "LivingStatus" AS ENUM ('ALIVE', 'DECEASED');

-- CreateEnum
CREATE TYPE "Religion" AS ENUM ('CATHOLIC', 'PROTESTANT', 'ISLAM', 'HINDU', 'BUDDHA', 'KONGHUCU');

-- CreateEnum
CREATE TYPE "DependentType" AS ENUM ('CHILD', 'RELATIVE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('debit', 'credit');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Lunas', 'Menunggu', 'BelumBayar');

-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('lunas', 'sebagian_bulan', 'belum_ada_pembayaran');

-- CreateEnum
CREATE TYPE "StatusPublikasi" AS ENUM ('aktif', 'kedaluwarsa');

-- CreateEnum
CREATE TYPE "KategoriPublikasi" AS ENUM ('Penting', 'Umum', 'Rahasia', 'Segera');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "passphrase" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "familyHeadId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyHead" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "nik" TEXT NOT NULL,
    "maritalStatus" "MaritalStatus" NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "occupation" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "religion" "Religion" NOT NULL,
    "livingStatus" "LivingStatus" NOT NULL,
    "bidukNumber" TEXT,
    "baptismDate" TIMESTAMP(3),
    "confirmationDate" TIMESTAMP(3),
    "deathDate" TIMESTAMP(3),
    "imageUrl" TEXT,
    "joinDate" TIMESTAMP(3),
    "status" TEXT,
    "scheduledDeleteDate" TIMESTAMP(3),
    "deceasedMemberName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyHead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spouse" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "nik" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "occupation" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "religion" "Religion" NOT NULL,
    "livingStatus" "LivingStatus" NOT NULL,
    "bidukNumber" TEXT,
    "baptismDate" TIMESTAMP(3),
    "confirmationDate" TIMESTAMP(3),
    "deathDate" TIMESTAMP(3),
    "imageUrl" TEXT,
    "familyHeadId" INTEGER NOT NULL,

    CONSTRAINT "Spouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dependentType" "DependentType" NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "education" TEXT NOT NULL,
    "religion" "Religion" NOT NULL,
    "maritalStatus" "MaritalStatus" NOT NULL,
    "baptismDate" TIMESTAMP(3),
    "confirmationDate" TIMESTAMP(3),
    "imageUrl" TEXT,
    "familyHeadId" INTEGER NOT NULL,

    CONSTRAINT "Dependent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "debit" INTEGER NOT NULL,
    "credit" INTEGER NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "transactionType" "TransactionType" NOT NULL,
    "transactionSubtype" TEXT,
    "familyHeadId" INTEGER,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DanaMandiriTransaction" (
    "id" SERIAL NOT NULL,
    "familyHeadId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "paymentStatus" TEXT NOT NULL,

    CONSTRAINT "DanaMandiriTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IKATATransaction" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "jenis" TEXT NOT NULL,
    "tipeTransaksi" TEXT NOT NULL,
    "debit" INTEGER,
    "kredit" INTEGER,
    "statusPembayaran" "StatusPembayaran",
    "periodeBayar" TEXT,
    "anggotaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "IKATATransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JadwalDoling" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "waktu" TEXT NOT NULL,
    "tuanRumahId" INTEGER,
    "tuanRumah" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "noTelepon" TEXT,
    "catatan" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JadwalDoling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetilDoling" (
    "id" SERIAL NOT NULL,
    "jadwalId" INTEGER,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "tuanRumah" TEXT NOT NULL,
    "jumlahHadir" INTEGER NOT NULL,
    "jenisIbadat" TEXT,
    "subIbadat" TEXT,
    "temaIbadat" TEXT,
    "kegiatan" TEXT NOT NULL,
    "biaya" INTEGER,
    "koleksi" INTEGER,
    "keterangan" TEXT,
    "status" TEXT NOT NULL,
    "sudahDiapprove" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jumlahKKHadir" INTEGER,
    "jumlahBapak" INTEGER,
    "jumlahIbu" INTEGER,
    "jumlahOMK" INTEGER,
    "jumlahBIAKecil" INTEGER,
    "jumlahBIABesar" INTEGER,
    "jumlahBIR" INTEGER,
    "jumlahPeserta" INTEGER,
    "kolekte1" INTEGER,
    "kolekte2" INTEGER,
    "ucapanSyukur" INTEGER,
    "pemimpinLiturgi" TEXT,
    "petugasRosario" TEXT,
    "pembawaRenungan" TEXT,
    "petugasLagu" TEXT,
    "petugasDoaUmat" TEXT,
    "petugasBacaan" TEXT,
    "pemimpinMisa" TEXT,
    "bacaanPertama" TEXT,
    "pemazmur" TEXT,

    CONSTRAINT "DetilDoling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbsensiDoling" (
    "id" SERIAL NOT NULL,
    "jadwalId" INTEGER NOT NULL,
    "detilDolingId" INTEGER,
    "tanggalKehadiran" TIMESTAMP(3) NOT NULL,
    "nama" TEXT NOT NULL,
    "kepalaKeluarga" BOOLEAN NOT NULL,
    "kehadiran" TEXT NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AbsensiDoling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publikasi" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "waktu" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "targetPenerima" TEXT NOT NULL,
    "status" "StatusPublikasi" NOT NULL,
    "pembuat" TEXT NOT NULL,
    "lampiran" BOOLEAN NOT NULL,
    "locked" BOOLEAN NOT NULL,
    "kategori" "KategoriPublikasi" NOT NULL,

    CONSTRAINT "Publikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laporan" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL,
    "lampiran" TEXT NOT NULL,
    "publikasiId" INTEGER NOT NULL,

    CONSTRAINT "Laporan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalItem" (
    "id" SERIAL NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "recipientId" INTEGER,
    "senderId" INTEGER,
    "relatedItemId" INTEGER,
    "relatedItemType" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "familyHeadName" TEXT,
    "year" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "amount" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_familyHeadId_key" ON "User"("familyHeadId");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyHead_nik_key" ON "FamilyHead"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "Spouse_nik_key" ON "Spouse"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "Spouse_familyHeadId_key" ON "Spouse"("familyHeadId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_familyHeadId_fkey" FOREIGN KEY ("familyHeadId") REFERENCES "FamilyHead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spouse" ADD CONSTRAINT "Spouse_familyHeadId_fkey" FOREIGN KEY ("familyHeadId") REFERENCES "FamilyHead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependent" ADD CONSTRAINT "Dependent_familyHeadId_fkey" FOREIGN KEY ("familyHeadId") REFERENCES "FamilyHead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_familyHeadId_fkey" FOREIGN KEY ("familyHeadId") REFERENCES "FamilyHead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DanaMandiriTransaction" ADD CONSTRAINT "DanaMandiriTransaction_familyHeadId_fkey" FOREIGN KEY ("familyHeadId") REFERENCES "FamilyHead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IKATATransaction" ADD CONSTRAINT "IKATATransaction_anggotaId_fkey" FOREIGN KEY ("anggotaId") REFERENCES "FamilyHead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetilDoling" ADD CONSTRAINT "DetilDoling_jadwalId_fkey" FOREIGN KEY ("jadwalId") REFERENCES "JadwalDoling"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsensiDoling" ADD CONSTRAINT "AbsensiDoling_jadwalId_fkey" FOREIGN KEY ("jadwalId") REFERENCES "JadwalDoling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsensiDoling" ADD CONSTRAINT "AbsensiDoling_detilDolingId_fkey" FOREIGN KEY ("detilDolingId") REFERENCES "DetilDoling"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laporan" ADD CONSTRAINT "Laporan_publikasiId_fkey" FOREIGN KEY ("publikasiId") REFERENCES "Publikasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
