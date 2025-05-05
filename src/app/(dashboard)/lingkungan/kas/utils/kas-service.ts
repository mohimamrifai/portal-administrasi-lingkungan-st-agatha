import { prisma } from "@/lib/db";
import { JenisTransaksi, TipeTransaksiLingkungan } from "@prisma/client";

// Fungsi untuk mendapatkan data kas lingkungan
export async function getKasLingkungan() {
  try {
    const kasData = await prisma.kasLingkungan.findMany({
      orderBy: {
        tanggal: 'desc'
      },
      include: {
        approval: true
      }
    });
    
    return kasData;
  } catch (error) {
    console.error("Error fetching kas lingkungan data:", error);
    throw new Error("Gagal mengambil data kas lingkungan");
  }
}

// Fungsi untuk membuat transaksi baru
export async function createKasTransaction(data: {
  tanggal: Date;
  jenisTranasksi: JenisTransaksi;
  tipeTransaksi: TipeTransaksiLingkungan;
  keterangan?: string;
  debit: number;
  kredit: number;
}) {
  try {
    const transaction = await prisma.kasLingkungan.create({
      data: {
        ...data,
        approval: {
          create: {
            status: 'PENDING'
          }
        }
      },
      include: {
        approval: true
      }
    });
    
    return transaction;
  } catch (error) {
    console.error("Error creating kas transaction:", error);
    throw new Error("Gagal membuat transaksi kas");
  }
}

// Fungsi untuk memperbarui transaksi
export async function updateKasTransaction(id: string, data: {
  tanggal: Date;
  jenisTranasksi: JenisTransaksi;
  tipeTransaksi: TipeTransaksiLingkungan;
  keterangan?: string;
  debit: number;
  kredit: number;
}) {
  try {
    const transaction = await prisma.kasLingkungan.update({
      where: { id },
      data,
      include: {
        approval: true
      }
    });
    
    return transaction;
  } catch (error) {
    console.error("Error updating kas transaction:", error);
    throw new Error("Gagal memperbarui transaksi kas");
  }
}

// Fungsi untuk menghapus transaksi
export async function deleteKasTransaction(id: string) {
  try {
    // Hapus approval terlebih dahulu jika ada
    await prisma.approval.deleteMany({
      where: {
        kasLingkunganId: id
      }
    });
    
    // Kemudian hapus transaksi
    const transaction = await prisma.kasLingkungan.delete({
      where: { id }
    });
    
    return transaction;
  } catch (error) {
    console.error("Error deleting kas transaction:", error);
    throw new Error("Gagal menghapus transaksi kas");
  }
}

// Fungsi untuk mengubah status approval
export async function updateApprovalStatus(id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
  try {
    const approval = await prisma.approval.update({
      where: {
        kasLingkunganId: id
      },
      data: {
        status
      }
    });
    
    return approval;
  } catch (error) {
    console.error("Error updating approval status:", error);
    throw new Error("Gagal memperbarui status approval");
  }
} 