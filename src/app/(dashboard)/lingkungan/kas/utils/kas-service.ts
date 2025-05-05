import { prisma } from "@/lib/db";
import { JenisTransaksi, TipeTransaksiLingkungan, TipeTransaksiIkata } from "@prisma/client";

// Fungsi untuk mendapatkan data kas lingkungan
export async function getKasLingkungan() {
  try {
    const kasData = await prisma.kasLingkungan.findMany({
      orderBy: {
        tanggal: 'desc'
      },
      include: {
        approval: true,
        keluarga: true
      }
    });
    
    return kasData;
  } catch (error) {
    console.error("Error fetching kas lingkungan data:", error);
    throw new Error("Gagal mengambil data kas lingkungan");
  }
}

// Fungsi untuk mendapatkan data keluarga untuk dropdown
export async function getKeluargaList() {
  try {
    const keluargaData = await prisma.keluargaUmat.findMany({
      select: {
        id: true,
        namaKepalaKeluarga: true
      },
      orderBy: {
        namaKepalaKeluarga: 'asc'
      }
    });
    
    return keluargaData;
  } catch (error) {
    console.error("Error fetching keluarga data:", error);
    throw new Error("Gagal mengambil data keluarga");
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
  keluargaId?: string;
}) {
  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const kasTransaction = await tx.kasLingkungan.create({
        data: {
          ...data,
          approval: {
            create: {
              status: 'PENDING'
            }
          }
        },
        include: {
          approval: true,
          keluarga: true
        }
      });
      
      if (data.tipeTransaksi === TipeTransaksiLingkungan.TRANSFER_DANA_KE_IKATA && 
          data.jenisTranasksi === JenisTransaksi.UANG_KELUAR) {
        await tx.kasIkata.create({
          data: {
            tanggal: data.tanggal,
            jenisTranasksi: JenisTransaksi.UANG_MASUK,
            tipeTransaksi: TipeTransaksiIkata.TRANSFER_DANA_DARI_LINGKUNGAN,
            keterangan: "Transfer otomatis dari Kas Lingkungan",
            debit: data.kredit,
            kredit: 0
          }
        });
      }
      
      return kasTransaction;
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
  keluargaId?: string;
}) {
  try {
    const oldTransaction = await prisma.kasLingkungan.findUnique({
      where: { id },
      include: {
        approval: true
      }
    });
    
    if (!oldTransaction) {
      throw new Error("Transaksi tidak ditemukan");
    }
    
    const transaction = await prisma.$transaction(async (tx) => {
      // Update transaksi
      const updatedTransaction = await tx.kasLingkungan.update({
        where: { id },
        data,
        include: {
          approval: true,
          keluarga: true
        }
      });
      
      // Jika status approval adalah APPROVED, ubah menjadi PENDING 
      // karena transaksi baru saja diubah
      if (oldTransaction.approval?.status === 'APPROVED') {
        await tx.approval.update({
          where: { kasLingkunganId: id },
          data: { status: 'PENDING' }
        });
      }
      
      // Logika untuk transfer dana ke IKATA tidak berubah
      if (data.tipeTransaksi === TipeTransaksiLingkungan.TRANSFER_DANA_KE_IKATA && 
          data.jenisTranasksi === JenisTransaksi.UANG_KELUAR &&
          (oldTransaction.tipeTransaksi !== TipeTransaksiLingkungan.TRANSFER_DANA_KE_IKATA || 
           oldTransaction.jenisTranasksi !== JenisTransaksi.UANG_KELUAR)) {
        
        const existingIkataTransaction = await tx.kasIkata.findFirst({
          where: {
            keterangan: { contains: `Transfer otomatis dari transaksi ${id}` }
          }
        });
        
        if (!existingIkataTransaction) {
          await tx.kasIkata.create({
            data: {
              tanggal: data.tanggal,
              jenisTranasksi: JenisTransaksi.UANG_MASUK,
              tipeTransaksi: TipeTransaksiIkata.TRANSFER_DANA_DARI_LINGKUNGAN,
              keterangan: `Transfer otomatis dari transaksi ${id}`,
              debit: data.kredit,
              kredit: 0
            }
          });
        } else {
          await tx.kasIkata.update({
            where: { id: existingIkataTransaction.id },
            data: {
              tanggal: data.tanggal,
              debit: data.kredit
            }
          });
        }
      }
      
      return updatedTransaction;
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
    const transaction = await prisma.kasLingkungan.findUnique({
      where: { id }
    });
    
    if (!transaction) {
      throw new Error("Transaksi tidak ditemukan");
    }
    
    await prisma.$transaction(async (tx) => {
      await tx.approval.deleteMany({
        where: {
          kasLingkunganId: id
        }
      });
      
      await tx.kasLingkungan.delete({
        where: { id }
      });
      
      if (transaction.tipeTransaksi === TipeTransaksiLingkungan.TRANSFER_DANA_KE_IKATA &&
          transaction.jenisTranasksi === JenisTransaksi.UANG_KELUAR) {
        const ikataTransaction = await tx.kasIkata.findFirst({
          where: {
            keterangan: { contains: `Transfer otomatis dari transaksi ${id}` }
          }
        });
        
        if (ikataTransaction) {
          await tx.kasIkata.delete({
            where: { id: ikataTransaction.id }
          });
        }
      }
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
    // Cek jika transaksi ada
    const transaction = await prisma.kasLingkungan.findUnique({
      where: { id },
      include: { approval: true }
    });
    
    if (!transaction) {
      throw new Error("Transaksi tidak ditemukan");
    }
    
    // Update status approval
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