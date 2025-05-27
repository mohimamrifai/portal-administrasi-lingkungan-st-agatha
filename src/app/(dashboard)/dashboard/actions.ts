"use server";

import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { KesekretariatanSummary, KeuanganIkataSummary, KeuanganLingkunganSummary } from "./types";
import { TipeTransaksiLingkungan, TipeTransaksiIkata } from "@prisma/client";

// Fungsi untuk mendapatkan data Keuangan Lingkungan
export async function getKeuanganLingkunganData(bulan?: number, tahun?: number): Promise<KeuanganLingkunganSummary> {
  noStore(); // Menonaktifkan caching

  try {
    // Filter berdasarkan bulan dan tahun jika diberikan
    const dateStart = bulan !== undefined && tahun !== undefined 
      ? new Date(tahun, bulan, 1) 
      : undefined;
    const dateEnd = bulan !== undefined && tahun !== undefined
      ? new Date(tahun, bulan + 1, 0)
      : undefined;

    // Cek apakah ada transaksi saldo awal
    const initialBalanceTransaction = await prisma.kasLingkungan.findFirst({
      where: {
        tipeTransaksi: TipeTransaksiLingkungan.LAIN_LAIN,
        keterangan: 'SALDO AWAL'
      },
      orderBy: {
        tanggal: 'desc'
      }
    });
    
    // Gunakan saldo awal dari transaksi jika ada
    const saldoAwal = initialBalanceTransaction ? initialBalanceTransaction.debit : 0;

    // Mengambil total pemasukan (debit) untuk periode
    const pemasukan = await prisma.kasLingkungan.aggregate({
      _sum: {
        debit: true,
      },
      where: {
        ...(dateStart && dateEnd ? { tanggal: { gte: dateStart, lte: dateEnd } } : {}),
        jenisTranasksi: "UANG_MASUK",
        NOT: {
          keterangan: 'SALDO AWAL'
        }
      },
    });

    // Mengambil total pengeluaran (kredit) untuk periode
    const pengeluaran = await prisma.kasLingkungan.aggregate({
      _sum: {
        kredit: true,
      },
      where: {
        ...(dateStart && dateEnd ? { tanggal: { gte: dateStart, lte: dateEnd } } : {}),
        jenisTranasksi: "UANG_KELUAR",
        NOT: {
          keterangan: 'SALDO AWAL'
        }
      },
    });

    // Menghitung saldo akhir (dengan null check)
    const totalPemasukan = pemasukan._sum?.debit || 0;
    const totalPengeluaran = pengeluaran._sum?.kredit || 0;
    
    // Menyesuaikan perhitungan untuk konsisten dengan halaman kas lingkungan
    const adjustedTotalPemasukan = saldoAwal + totalPemasukan;
    const saldoAkhir = saldoAwal + totalPemasukan - totalPengeluaran;

    return {
      saldoAwal,
      totalPemasukan: adjustedTotalPemasukan, // Termasuk saldo awal dalam total pemasukan
      totalPengeluaran,
      saldoAkhir,
    };
  } catch (error) {
    console.error("Error getting keuangan lingkungan data:", error);
    return {
      saldoAwal: 0,
      totalPemasukan: 0,
      totalPengeluaran: 0,
      saldoAkhir: 0,
    };
  }
}

// Fungsi untuk mendapatkan data Keuangan IKATA
export async function getKeuanganIkataData(bulan?: number, tahun?: number): Promise<KeuanganIkataSummary> {
  noStore(); // Menonaktifkan caching

  try {
    // Import fungsi getKasIkataSummary langsung
    const { getKasIkataSummary } = await import("@/app/(dashboard)/ikata/kas/utils/kas-ikata-service");
    
    // Gunakan hasil dari getKasIkataSummary langsung
    const summary = await getKasIkataSummary();
    // Kembalikan data yang persis sama
    return summary;
  } catch (error) {
    console.error("[getKeuanganIkataData] Error:", error);
    return {
      saldoAwal: 0,
      pemasukan: 0,
      pengeluaran: 0,
      saldoAkhir: 0,
    };
  }
}

// Fungsi untuk mendapatkan data Kesekretariatan
export async function getKesekretariatanData(bulan?: number, tahun?: number): Promise<KesekretariatanSummary> {
  noStore(); // Menonaktifkan caching

  try {
    const yearStart = new Date(tahun || new Date().getFullYear(), 0, 1);
    const yearEnd = new Date(tahun || new Date().getFullYear(), 11, 31);
    const monthStart = bulan !== undefined && tahun !== undefined 
      ? new Date(tahun, bulan - 1, 1) 
      : yearStart;
    const monthEnd = bulan !== undefined && tahun !== undefined
      ? new Date(tahun, bulan, 0, 23, 59, 59)
      : yearEnd;
    

    // Impor fungsi utilitas untuk perhitungan keluarga
    const { hitungJumlahKepalaKeluarga, hitungTotalJiwa } = await import('./utils/family-utils');

    // Total Kepala Keluarga (aktif)
    const totalKK = await hitungJumlahKepalaKeluarga();

    // Total Jiwa (KK + Pasangan + Tanggungan)
    const jumlahJiwa = await hitungTotalJiwa();

    // KK Bergabung - hanya pada periode yang dipilih
    const kkBergabungCount = await prisma.keluargaUmat.count({
      where: {
        tanggalBergabung: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    // Detail KK Bergabung
    const detailKKBergabung = await prisma.keluargaUmat.findMany({
      where: {
        tanggalBergabung: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: {
        id: true,
        namaKepalaKeluarga: true,
        tanggalBergabung: true,
      },
      orderBy: {
        tanggalBergabung: 'desc',
      },
    });

    // KK Pindah - hanya pada periode yang dipilih
    const kkPindahCount = await prisma.keluargaUmat.count({
      where: {
        tanggalKeluar: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    // Detail KK Pindah
    const detailKKPindah = await prisma.keluargaUmat.findMany({
      where: {
        tanggalKeluar: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: {
        id: true,
        namaKepalaKeluarga: true,
        tanggalKeluar: true,
      },
      orderBy: {
        tanggalKeluar: 'desc',
      },
    });

    // Umat Meninggal - total KK dan pasangan yang meninggal pada periode yang dipilih
    // 1. KK yang meninggal pada periode tersebut
    const kkMeninggal = await prisma.keluargaUmat.count({
      where: {
        status: "MENINGGAL",
        tanggalMeninggal: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });
    
    // 2. Pasangan yang meninggal pada periode tersebut
    const pasanganMeninggal = await prisma.pasangan.count({
      where: {
        status: "MENINGGAL",
        tanggalMeninggal: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });
    
    const umatMeninggalDunia = kkMeninggal + pasanganMeninggal;

    // Detail KK Meninggal
    const detailKKMeninggal = await prisma.keluargaUmat.findMany({
      where: {
        status: "MENINGGAL",
        tanggalMeninggal: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: {
        id: true,
        namaKepalaKeluarga: true,
        tanggalMeninggal: true,
      },
      orderBy: {
        tanggalMeninggal: 'desc',
      },
    });

    // Detail Pasangan Meninggal
    const detailPasanganMeninggal = await prisma.pasangan.findMany({
      where: {
        status: "MENINGGAL",
        tanggalMeninggal: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: {
        id: true,
        nama: true,
        tanggalMeninggal: true,
      },
      orderBy: {
        tanggalMeninggal: 'desc',
      },
    });

    // Gabungkan detail umat meninggal
    const detailUmatMeninggal = [
      ...detailKKMeninggal.map(kk => ({
        id: kk.id,
        nama: kk.namaKepalaKeluarga,
        tanggal: kk.tanggalMeninggal!,
        statusKeluarga: "Kepala Keluarga"
      })),
      ...detailPasanganMeninggal.map(p => ({
        id: p.id,
        nama: p.nama,
        tanggal: p.tanggalMeninggal!,
        statusKeluarga: "Pasangan"
      }))
    ].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

    // Tingkat Partisipasi Umat
    // Dapatkan data doa lingkungan pada periode
    const doaLingkunganList = await prisma.doaLingkungan.findMany({
      where: {
        tanggal: {
          gte: monthStart,
          lte: monthEnd,
        },
        jenisIbadat: "DOA_LINGKUNGAN",
      },
      include: {
        absensi: true
      }
    });
    
    // Hitung tingkat partisipasi
    let totalAbsensi = 0;
    let totalHadir = 0;
    
    for (const doling of doaLingkunganList) {
      totalAbsensi += doling.absensi.length;
      totalHadir += doling.absensi.filter(a => a.hadir).length;
    }
    
    const tingkatPartisipasiUmat = totalAbsensi > 0 
      ? (totalHadir / totalAbsensi) * 100 
      : 0;

    return {
      totalKepalaKeluarga: totalKK,
      jumlahJiwa,
      kkBergabung: kkBergabungCount,
      kkPindah: kkPindahCount,
      umatMeninggalDunia,
      tingkatPartisipasiUmat,
      detailKKBergabung: detailKKBergabung.map(kk => ({
        id: kk.id,
        nama: kk.namaKepalaKeluarga,
        tanggal: kk.tanggalBergabung!,
      })),
      detailKKPindah: detailKKPindah.map(kk => ({
        id: kk.id,
        nama: kk.namaKepalaKeluarga,
        tanggal: kk.tanggalKeluar!,
      })),
      detailUmatMeninggal,
    };
  } catch (error) {
    console.error("Error getting kesekretariatan data:", error);
    return {
      totalKepalaKeluarga: 0,
      jumlahJiwa: 0,
      kkBergabung: 0,
      kkPindah: 0,
      umatMeninggalDunia: 0,
      tingkatPartisipasiUmat: 0,
      detailKKBergabung: [],
      detailKKPindah: [],
      detailUmatMeninggal: [],
    };
  }
}

// Fungsi untuk mendapatkan data penunggak Dana Mandiri
export async function getPenunggakDanaMandiriData() {
  noStore();

  try {
    // Dapatkan tahun saat ini
    const currentYear = new Date().getFullYear();
    
    // Ambil data keluarga umat yang masih aktif (belum keluar dan hidup)
    const keluargaList = await prisma.keluargaUmat.findMany({
      where: {
        tanggalKeluar: null,
        status: "HIDUP",
      },
      select: {
        id: true,
        namaKepalaKeluarga: true,
        alamat: true,
        nomorTelepon: true,
        danaMandiri: {
          where: {
            tahun: currentYear
          }
        }
      },
    });
    
    // Filter keluarga yang belum bayar untuk tahun ini
    const penunggakList = keluargaList
      .filter(k => k.danaMandiri.length === 0)
      .map(k => {
        // Hitung jumlah tunggakan (asumsikan 50.000 per bulan)
        const currentMonth = new Date().getMonth();
        const jumlahTunggakan = (currentMonth + 1) * 50000;
        
        // Format periode tunggakan
        const getBulanIndonesia = (bulan: number) => {
          const namaBulan = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
          ];
          return namaBulan[bulan];
        };
        
        const periodeTunggakan = `${getBulanIndonesia(0)}-${getBulanIndonesia(currentMonth)} ${currentYear}`;
        
        return {
          id: k.id,
          nama: k.namaKepalaKeluarga,
          periodeTunggakan,
          jumlahTunggakan,
        };
      });
    
    return penunggakList;
  } catch (error) {
    console.error("Error getting penunggak dana mandiri data:", error);
    return [];
  }
}

// Fungsi untuk mendapatkan data penunggak Ikata
export async function getPenunggakIkataData() {
  noStore();

  try {
    // Dapatkan tahun saat ini
    const currentYear = new Date().getFullYear();
    
    // Ambil data keluarga umat yang masih aktif (belum keluar dan hidup)
    const keluargaList = await prisma.keluargaUmat.findMany({
      where: {
        tanggalKeluar: null,
        status: "HIDUP",
      },
      select: {
        id: true,
        namaKepalaKeluarga: true,
        alamat: true,
        nomorTelepon: true,
        iurataIkata: {
          where: {
            tahun: currentYear,
          },
        }
      },
    });
    
    // Filter keluarga yang belum bayar untuk tahun ini
    const penunggakList = keluargaList
      .filter(k => k.iurataIkata.length === 0 || k.iurataIkata.every(i => i.status === "BELUM_BAYAR"))
      .map(k => {
        // Hitung jumlah tunggakan (asumsikan 10.000 per bulan)
        const currentMonth = new Date().getMonth();
        const jumlahTunggakan = (currentMonth + 1) * 10000;
        
        // Format periode tunggakan
        const getBulanIndonesia = (bulan: number) => {
          const namaBulan = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
          ];
          return namaBulan[bulan];
        };
        
        const periodeTunggakan = `${getBulanIndonesia(0)}-${getBulanIndonesia(currentMonth)} ${currentYear}`;
        
        return {
          id: k.id,
          nama: k.namaKepalaKeluarga,
          periodeTunggakan,
          jumlahTunggakan,
        };
      });
    
    return penunggakList;
  } catch (error) {
    console.error("Error getting penunggak IKATA data:", error);
    return [];
  }
}

// Fungsi khusus untuk debugging transaksi IKATA
export async function debugIkataTransactions(bulan?: number, tahun?: number) {
  noStore();
  
  try {
    // Gunakan bulan dan tahun saat ini, bukan parameter input
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // Januari = 1
    const year = currentDate.getFullYear();
    
    // Dapatkan semua transaksi saldo awal
    const saldoAwalTransactions = await prisma.kasIkata.findMany({
      where: {
        tipeTransaksi: TipeTransaksiIkata.LAIN_LAIN,
        keterangan: "SALDO AWAL"
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    // Filter berdasarkan bulan dan tahun saat ini
    const dateStart = new Date(year, month - 1, 1);
    const dateEnd = new Date(year, month, 0, 23, 59, 59);
    
    // Ambil semua transaksi pemasukan
    const incomeTransactions = await prisma.kasIkata.findMany({
      where: {
        tanggal: {
          gte: dateStart,
          lte: dateEnd,
        },
        jenisTranasksi: "UANG_MASUK",
        keterangan: {
          not: "SALDO AWAL"
        }
      }
    });
    
    // Ambil semua transaksi pengeluaran
    const expenseTransactions = await prisma.kasIkata.findMany({
      where: {
        tanggal: {
          gte: dateStart,
          lte: dateEnd,
        },
        jenisTranasksi: "UANG_KELUAR"
      }
    });
    
    
    // Hitung total
    const totalIncome = incomeTransactions.reduce((sum, tx) => sum + tx.debit, 0);
    const totalExpense = expenseTransactions.reduce((sum, tx) => sum + tx.kredit, 0);
    
    return {
      saldoAwalTransactions,
      incomeTransactions,
      expenseTransactions,
      totals: {
        totalIncome,
        totalExpense
      }
    };
  } catch (error) {
    return null;
  }
}