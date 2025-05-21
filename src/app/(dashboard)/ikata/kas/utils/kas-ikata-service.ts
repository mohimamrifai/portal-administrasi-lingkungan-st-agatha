'use server';

import { prisma } from "@/lib/db";
import { JenisTransaksi, TipeTransaksiIkata } from "@prisma/client";
import { revalidatePath } from "next/cache";

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

    // Cek saldo awal
    let saldoAwal = 0;
    
    // Mencoba mendapatkan saldo awal dari transaksi khusus "SALDO AWAL"
    const saldoAwalTransaction = await prisma.kasIkata.findFirst({
      where: {
        tipeTransaksi: TipeTransaksiIkata.LAIN_LAIN,
        keterangan: "SALDO AWAL"
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    if (saldoAwalTransaction) {
      // Jika ditemukan, gunakan nilai debit sebagai saldo awal
      saldoAwal = saldoAwalTransaction.debit;
      console.log("Saldo awal dari transaksi:", saldoAwal);
    } else {
      // Jika tidak ditemukan, coba cari di tabel saldoAwalIkata (kompatibilitas dengan kode lama)
      if (bulan !== undefined && tahun !== undefined) {
        const saldoAwalSetting = await prisma.saldoAwalIkata.findFirst({
          where: {
            tahun: tahun,
            bulan: bulan
          }
        });
        
        if (saldoAwalSetting) {
          // Jika ada setting saldo awal, gunakan nilai dari setting
          saldoAwal = saldoAwalSetting.saldoAwal;
          console.log("Saldo awal dari tabel saldoAwalIkata:", saldoAwal);
        } else {
          // Jika tidak ada setting, hitung saldo awal dari transaksi sebelumnya
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
                  keterangan: {
                    not: "SALDO AWAL" // Jangan hitung transaksi saldo awal
                  }
                },
              })
            : { _sum: { debit: 0, kredit: 0 } };
          
          saldoAwal = (saldoAwalQuery._sum.debit || 0) - (saldoAwalQuery._sum.kredit || 0);
          console.log("Saldo awal dari perhitungan transaksi:", saldoAwal);
        }
      } else {
        // Jika bulan dan tahun tidak ditentukan, gunakan semua transaksi
        saldoAwal = 0; // Saldo awal 0 jika menampilkan semua data
        console.log("Saldo awal default (0) karena tidak ada bulan/tahun yang ditentukan");
      }
    }

    // Query untuk transaksi pada bulan yang dipilih
    const transactionQuery = {
      where: dateStart && dateEnd
        ? {
            tanggal: {
              gte: dateStart,
              lte: dateEnd,
            },
            keterangan: {
              not: "SALDO AWAL" // Jangan hitung transaksi saldo awal
            }
          }
        : {
            keterangan: {
              not: "SALDO AWAL" // Jangan hitung transaksi saldo awal
            }
          },
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

    // Menghitung saldo akhir
    const pemasukanValue = pemasukan._sum.debit || 0;
    const pengeluaranValue = pengeluaran._sum.kredit || 0;
    const saldoAkhir = saldoAwal + pemasukanValue - pengeluaranValue;

    console.log("Summary:", { saldoAwal, pemasukan: pemasukanValue, pengeluaran: pengeluaranValue, saldoAkhir });

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