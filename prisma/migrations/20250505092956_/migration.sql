/*
  Warnings:

  - You are about to drop the `AbsensiDoling` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Agenda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApprovalItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DanaMandiriTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dependent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DetilDoling` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FamilyHead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IKATATransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JadwalDoling` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Laporan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Publikasi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Spouse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AbsensiDoling" DROP CONSTRAINT "AbsensiDoling_detilDolingId_fkey";

-- DropForeignKey
ALTER TABLE "AbsensiDoling" DROP CONSTRAINT "AbsensiDoling_jadwalId_fkey";

-- DropForeignKey
ALTER TABLE "DanaMandiriTransaction" DROP CONSTRAINT "DanaMandiriTransaction_familyHeadId_fkey";

-- DropForeignKey
ALTER TABLE "Dependent" DROP CONSTRAINT "Dependent_familyHeadId_fkey";

-- DropForeignKey
ALTER TABLE "DetilDoling" DROP CONSTRAINT "DetilDoling_jadwalId_fkey";

-- DropForeignKey
ALTER TABLE "IKATATransaction" DROP CONSTRAINT "IKATATransaction_anggotaId_fkey";

-- DropForeignKey
ALTER TABLE "Laporan" DROP CONSTRAINT "Laporan_publikasiId_fkey";

-- DropForeignKey
ALTER TABLE "Spouse" DROP CONSTRAINT "Spouse_familyHeadId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_familyHeadId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_familyHeadId_fkey";

-- DropTable
DROP TABLE "AbsensiDoling";

-- DropTable
DROP TABLE "Agenda";

-- DropTable
DROP TABLE "ApprovalItem";

-- DropTable
DROP TABLE "DanaMandiriTransaction";

-- DropTable
DROP TABLE "Dependent";

-- DropTable
DROP TABLE "DetilDoling";

-- DropTable
DROP TABLE "FamilyHead";

-- DropTable
DROP TABLE "IKATATransaction";

-- DropTable
DROP TABLE "JadwalDoling";

-- DropTable
DROP TABLE "Laporan";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "PaymentHistory";

-- DropTable
DROP TABLE "Publikasi";

-- DropTable
DROP TABLE "Spouse";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "DependentType";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "KategoriPublikasi";

-- DropEnum
DROP TYPE "LivingStatus";

-- DropEnum
DROP TYPE "MaritalStatus";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "Religion";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "StatusPembayaran";

-- DropEnum
DROP TYPE "StatusPublikasi";

-- DropEnum
DROP TYPE "TransactionType";
