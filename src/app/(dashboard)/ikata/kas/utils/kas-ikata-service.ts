'use server';

import { prisma } from "@/lib/db";
import { JenisTransaksi, TipeTransaksiIkata } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Fungsi untuk mendapatkan data transaksi Kas IKATA
export async function getKasIkataTransactions(bulan?: number, tahun?: number) {
  try {
    console.log("[getKasIkataTransactions] Called with params:", { bulan, tahun });
    
    // Gunakan bulan dan tahun saat ini jika tidak diberikan
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Januari = 1
    const currentYear = currentDate.getFullYear();
    
    // Gunakan bulan dan tahun saat ini, bukan parameter input
    const month = currentMonth;
    const year = currentYear;
    
    console.log("[getKasIkataTransactions] Using current month/year:", { month, year });
    
    // Filter berdasarkan bulan dan tahun
    const dateStart = new Date(year, month - 1, 1);
    const dateEnd = new Date(year, month, 0, 23, 59, 59);
    
    console.log("[getKasIkataTransactions] Date range:", { dateStart, dateEnd });

    // Query untuk mendapatkan transaksi
    const transactionQuery = {
      where: { 
        tanggal: {
          gte: dateStart,
          lte: dateEnd
        } 
      },
      orderBy: {
        tanggal: 'desc' as const
      }
    };
    
    console.log("[getKasIkataTransactions] Query:", JSON.stringify(transactionQuery.where));
    
    const transactions = await prisma.kasIkata.findMany(transactionQuery);
    
    console.log("[getKasIkataTransactions] Found transactions:", transactions.length);
    
    return transactions;
  } catch (error) {
    console.error("[getKasIkataTransactions] Error:", error);
    throw new Error("Gagal mengambil data transaksi kas IKATA");
  }
}

// Fungsi untuk mendapatkan ringkasan Kas IKATA
export async function getKasIkataSummary(bulan?: number, tahun?: number) {
  try {
    console.log("[getKasIkataSummary] Called with params:", { bulan, tahun });
    
    // Gunakan bulan dan tahun saat ini jika tidak diberikan
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Januari = 1
    const currentYear = currentDate.getFullYear();
    
    // Gunakan bulan dan tahun saat ini, bukan parameter input
    const month = currentMonth;
    const year = currentYear;
    
    console.log("[getKasIkataSummary] Using current month/year:", { month, year });
    
    // Filter berdasarkan bulan dan tahun
    const dateStart = new Date(year, month - 1, 1);
    const dateEnd = new Date(year, month, 0, 23, 59, 59);
    
    console.log("[getKasIkataSummary] Date range:", { dateStart, dateEnd });

    // Dapatkan saldo awal dari transaksi SALDO AWAL
    const saldoAwalTransaction = await prisma.kasIkata.findFirst({
      where: {
        tipeTransaksi: TipeTransaksiIkata.LAIN_LAIN,
        keterangan: "SALDO AWAL"
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    const saldoAwal = saldoAwalTransaction ? saldoAwalTransaction.debit : 0;
    console.log("[getKasIkataSummary] Saldo awal:", saldoAwal, saldoAwalTransaction?.id);
    
    // Query untuk transaksi pada bulan yang dipilih
    const transactionQuery = {
      where: {
        tanggal: {
          gte: dateStart,
          lte: dateEnd,
        },
        keterangan: {
          not: "SALDO AWAL" // Jangan hitung transaksi saldo awal
        }
      }
    };
    
    // Dapatkan semua transaksi untuk bulan ini
    const transactions = await prisma.kasIkata.findMany({
      where: transactionQuery.where,
      select: {
        id: true,
        tanggal: true,
        jenisTranasksi: true,
        debit: true,
        kredit: true
      }
    });
    
    console.log("[getKasIkataSummary] Found transactions:", transactions.length);
    
    // Hitung pemasukan dan pengeluaran
    const pemasukanTxs = transactions.filter(tx => tx.jenisTranasksi === "UANG_MASUK");
    const pengeluaranTxs = transactions.filter(tx => tx.jenisTranasksi === "UANG_KELUAR");
    
    const pemasukan = pemasukanTxs.reduce((sum, tx) => sum + tx.debit, 0);
    const pengeluaran = pengeluaranTxs.reduce((sum, tx) => sum + tx.kredit, 0);
    
    // Hitung saldo akhir
    const saldoAkhir = saldoAwal + pemasukan - pengeluaran;
    
    const result = {
      saldoAwal,
      pemasukan,
      pengeluaran,
      saldoAkhir
    };
    
    console.log("[getKasIkataSummary] Result:", result);
    
    return result;
  } catch (error) {
    console.error("[getKasIkataSummary] Error:", error);
    throw new Error("Gagal menghitung ringkasan kas IKATA");
  }
}

// Fungsi untuk mendapatkan data keluarga umat (untuk dropdown)
export async function getKeluargaUmatList() {
  try {
    const keluarga = await prisma.keluargaUmat.findMany({
      select: {
        id: true,
        namaKepalaKeluarga: true
      },
      orderBy: {
        namaKepalaKeluarga: 'asc'
      }
    });
    
    return keluarga;
  } catch (error) {
    console.error("Error fetching keluarga umat list:", error);
    throw new Error("Gagal mengambil data keluarga umat");
  }
}

// Fungsi untuk membuat transaksi Kas IKATA baru
export async function createKasIkataTransaction(data: {
  tanggal: Date;
  jenisTranasksi: JenisTransaksi;
  tipeTransaksi: TipeTransaksiIkata;
  keterangan?: string;
  debit: number;
  kredit: number;
  keluargaId?: string;
}) {
  try {
    const transaction = await prisma.kasIkata.create({
      data: {
        ...data
      }
    });
    
    // Jika transaksinya adalah iuran anggota, perbarui atau buat record IuranIkata
    if (data.tipeTransaksi === TipeTransaksiIkata.IURAN_ANGGOTA && 
        data.jenisTranasksi === JenisTransaksi.UANG_MASUK && 
        data.keluargaId) {
      
      const tahun = data.tanggal.getFullYear();
      const bulan = data.tanggal.getMonth() + 1;
      
      // Update atau buat record IuranIkata
      await prisma.iuranIkata.upsert({
        where: {
          id: await getIuranIkataId(data.keluargaId, tahun)
        },
        update: {
          status: "LUNAS",
          jumlahDibayar: data.debit
        },
        create: {
          keluargaId: data.keluargaId,
          status: "LUNAS",
          tahun: tahun,
          jumlahDibayar: data.debit
        }
      });
    }
    
    return transaction;
  } catch (error) {
    console.error("Error creating kas ikata transaction:", error);
    throw new Error("Gagal membuat transaksi kas IKATA");
  }
}

// Fungsi untuk memperbarui transaksi Kas IKATA
export async function updateKasIkataTransaction(id: string, data: {
  tanggal: Date;
  jenisTranasksi: JenisTransaksi;
  tipeTransaksi: TipeTransaksiIkata;
  keterangan?: string;
  debit: number;
  kredit: number;
  keluargaId?: string;
}) {
  try {
    const transaction = await prisma.kasIkata.update({
      where: { id },
      data: {
        ...data
      }
    });
    
    // Jika transaksinya adalah iuran anggota, update record IuranIkata
    if (data.tipeTransaksi === TipeTransaksiIkata.IURAN_ANGGOTA && 
        data.jenisTranasksi === JenisTransaksi.UANG_MASUK && 
        data.keluargaId) {
      
      const tahun = data.tanggal.getFullYear();
      
      // Update record IuranIkata
      await prisma.iuranIkata.updateMany({
        where: {
          keluargaId: data.keluargaId,
          tahun: tahun
        },
        data: {
          status: "LUNAS",
          jumlahDibayar: data.debit
        }
      });
    }
    
    return transaction;
  } catch (error) {
    console.error("Error updating kas ikata transaction:", error);
    throw new Error("Gagal memperbarui transaksi kas IKATA");
  }
}

// Fungsi untuk menghapus transaksi Kas IKATA
export async function deleteKasIkataTransaction(id: string) {
  try {
    const transaction = await prisma.kasIkata.delete({
      where: { id }
    });
    
    return transaction;
  } catch (error) {
    console.error("Error deleting kas ikata transaction:", error);
    throw new Error("Gagal menghapus transaksi kas IKATA");
  }
}

// Fungsi helper untuk mendapatkan id IuranIkata berdasarkan keluargaId dan tahun
async function getIuranIkataId(keluargaId: string, tahun: number): Promise<string> {
  const iuran = await prisma.iuranIkata.findFirst({
    where: {
      keluargaId,
      tahun
    },
    select: {
      id: true
    }
  });
  
  return iuran?.id || '';
}

// Fungsi untuk mengunci transaksi (set locked = true)
export async function lockKasIkataTransactions(transactionIds: string[]) {
  try {
    const result = await prisma.$transaction(
      transactionIds.map(id => 
        prisma.kasIkata.update({
          where: { id },
          data: { locked: true }
        })
      )
    );

    return { count: result.length };
  } catch (error) {
    console.error("Error locking transactions:", error);
    throw new Error("Gagal mengunci transaksi");
  }
}

// Fungsi untuk mengambil saldo awal untuk periode tertentu
export async function getSaldoAwalIkata(bulan: number, tahun: number) {
  try {
    const saldoAwal = await prisma.saldoAwalIkata.findFirst({
      where: {
        tahun,
        bulan
      }
    });
    
    return saldoAwal;
  } catch (error) {
    console.error("Error fetching saldo awal IKATA:", error);
    throw new Error("Gagal mengambil data saldo awal IKATA");
  }
}

// Fungsi untuk menyimpan saldo awal IKATA
export async function setSaldoAwalIkata(saldoAwal: number) {
  try {
    console.log("Setting saldo awal IKATA to:", saldoAwal);
    
    // Cari konfigurasi saldo awal jika sudah ada
    const existingConfig = await prisma.kasIkata.findFirst({
      where: {
        tipeTransaksi: TipeTransaksiIkata.LAIN_LAIN,
        keterangan: "SALDO AWAL"
      }
    });

    let result;
    
    // Jika sudah ada, update nilai
    if (existingConfig) {
      console.log("Found existing saldo awal record, updating:", existingConfig.id);
      result = await prisma.kasIkata.update({
        where: { id: existingConfig.id },
        data: {
          debit: saldoAwal,
          kredit: 0,
          tanggal: new Date(),
          updatedAt: new Date()
        }
      });
      console.log("Update result:", result);
    } else {
      // Jika belum ada, buat baru
      console.log("No existing saldo awal record, creating new");
      result = await prisma.kasIkata.create({
        data: {
          tanggal: new Date(),
          jenisTranasksi: JenisTransaksi.UANG_MASUK,
          tipeTransaksi: TipeTransaksiIkata.LAIN_LAIN,
          keterangan: "SALDO AWAL",
          debit: saldoAwal,
          kredit: 0,
          locked: true
        }
      });
      console.log("Create result:", result);
    }
    
    // Hapus data dari tabel saldoAwalIkata jika ada (untuk bersihkan data lama)
    try {
      await prisma.saldoAwalIkata.deleteMany({});
      console.log("Cleaned up old saldoAwalIkata records");
    } catch (cleanupError) {
      console.log("Note: Could not clean up saldoAwalIkata table, but this is not critical");
    }
    
    // Revalidasi path agar data diperbarui
    console.log("Revalidating paths");
    revalidatePath('/ikata/kas');
    revalidatePath('/dashboard');
    
    return { 
      success: true, 
      message: "Saldo awal berhasil disimpan",
      data: {
        saldoAwal,
        id: result.id
      }
    };
  } catch (error) {
    console.error("Error setting saldo awal IKATA:", error);
    return { 
      success: false, 
      error: "Gagal menyimpan saldo awal IKATA",
      message: "Terjadi kesalahan saat menyimpan saldo awal"
    };
  }
} 