'use server';

import { prisma } from "@/lib/db";
import { JenisTransaksi, TipeTransaksiIkata } from "@prisma/client";

// Fungsi untuk mendapatkan data transaksi Kas IKATA
export async function getKasIkataTransactions(bulan?: number, tahun?: number) {
  try {
    // Filter berdasarkan bulan dan tahun jika diberikan
    const dateFilter = bulan !== undefined && tahun !== undefined 
      ? {
          gte: new Date(tahun, bulan - 1, 1),
          lt: new Date(tahun, bulan, 0, 23, 59, 59),
        }
      : undefined;

    // Query untuk mendapatkan transaksi
    const transactionQuery = {
      where: dateFilter ? { tanggal: dateFilter } : {},
      orderBy: {
        tanggal: 'desc' as const
      }
    };
    
    const transactions = await prisma.kasIkata.findMany(transactionQuery);
    
    return transactions;
  } catch (error) {
    console.error("Error fetching kas ikata transactions:", error);
    throw new Error("Gagal mengambil data transaksi kas IKATA");
  }
}

// Fungsi untuk mendapatkan ringkasan Kas IKATA
export async function getKasIkataSummary(bulan?: number, tahun?: number) {
  try {
    // Filter berdasarkan bulan dan tahun jika diberikan
    const dateStart = bulan !== undefined && tahun !== undefined 
      ? new Date(tahun, bulan - 1, 1) 
      : undefined;
    const dateEnd = bulan !== undefined && tahun !== undefined
      ? new Date(tahun, bulan, 0, 23, 59, 59)
      : undefined;

    // Query untuk saldo awal (semua transaksi sebelum periode yang dipilih)
    const saldoAwalQuery = dateStart 
      ? await prisma.kasIkata.aggregate({
          _sum: {
            debit: true,
            kredit: true,
          },
          where: {
            tanggal: {
              lt: dateStart,
            },
          },
        })
      : { _sum: { debit: 0, kredit: 0 } };

    // Query untuk transaksi pada bulan yang dipilih
    const transactionQuery = {
      where: dateStart && dateEnd
        ? {
            tanggal: {
              gte: dateStart,
              lte: dateEnd,
            },
          }
        : {},
    };

    // Mengambil total pemasukan (debit) untuk periode
    const pemasukan = await prisma.kasIkata.aggregate({
      _sum: {
        debit: true,
      },
      where: {
        ...transactionQuery.where,
        jenisTranasksi: "UANG_MASUK",
      },
    });

    // Mengambil total pengeluaran (kredit) untuk periode
    const pengeluaran = await prisma.kasIkata.aggregate({
      _sum: {
        kredit: true,
      },
      where: {
        ...transactionQuery.where,
        jenisTranasksi: "UANG_KELUAR",
      },
    });

    // Menghitung saldo awal
    const saldoAwal = 
      (saldoAwalQuery._sum.debit || 0) - (saldoAwalQuery._sum.kredit || 0);

    // Menghitung saldo akhir
    const pemasukanValue = pemasukan._sum.debit || 0;
    const pengeluaranValue = pengeluaran._sum.kredit || 0;
    const saldoAkhir = saldoAwal + pemasukanValue - pengeluaranValue;

    return {
      saldoAwal,
      pemasukan: pemasukanValue,
      pengeluaran: pengeluaranValue,
      saldoAkhir
    };
  } catch (error) {
    console.error("Error calculating kas ikata summary:", error);
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