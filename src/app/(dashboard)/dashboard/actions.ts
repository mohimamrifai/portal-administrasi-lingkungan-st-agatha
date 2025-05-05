"use server";

import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { KesekretariatanSummary, KeuanganIkataSummary, KeuanganLingkunganSummary } from "./types";

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

    // Query untuk saldo awal (semua transaksi sebelum periode yang dipilih)
    const saldoAwalQuery = dateStart 
      ? await prisma.kasLingkungan.aggregate({
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

    // Mengambil total pemasukan (debit) untuk periode sesuai dengan schema dan seed data
    const pemasukan = await prisma.kasLingkungan.aggregate({
      _sum: {
        debit: true,
      },
      where: {
        ...transactionQuery.where,
        jenisTranasksi: "UANG_MASUK",
      },
    });

    // Mengambil total pengeluaran (kredit) untuk periode sesuai dengan schema dan seed data
    const pengeluaran = await prisma.kasLingkungan.aggregate({
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
    const totalPemasukan = pemasukan._sum.debit || 0;
    const totalPengeluaran = pengeluaran._sum.kredit || 0;
    const saldoAkhir = saldoAwal + totalPemasukan - totalPengeluaran;

    return {
      saldoAwal,
      totalPemasukan,
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
    // Filter berdasarkan bulan dan tahun jika diberikan
    const dateStart = bulan !== undefined && tahun !== undefined 
      ? new Date(tahun, bulan, 1) 
      : undefined;
    const dateEnd = bulan !== undefined && tahun !== undefined
      ? new Date(tahun, bulan + 1, 0)
      : undefined;

    // Query untuk saldo awal (semua transaksi sebelum periode yang dipilih)
    const saldoAwalQuery = dateStart 
      ? await prisma.kasIkata.aggregate({
          _sum: {
            kredit: true,
            debit: true,
          },
          where: {
            tanggal: {
              lt: dateStart,
            },
          },
        })
      : { _sum: { kredit: 0, debit: 0 } };

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

    // Mengambil total pemasukan (debit) untuk periode sesuai dengan schema dan seed data
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
    const pemasukan_value = pemasukan._sum.debit || 0;
    const pengeluaran_value = pengeluaran._sum.kredit || 0;
    const saldoAkhir = saldoAwal + pemasukan_value - pengeluaran_value;

    return {
      saldoAwal,
      pemasukan: pemasukan_value,
      pengeluaran: pengeluaran_value,
      saldoAkhir,
    };
  } catch (error) {
    console.error("Error getting keuangan IKATA data:", error);
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
      ? new Date(tahun, bulan, 1) 
      : yearStart;
    const monthEnd = bulan !== undefined && tahun !== undefined
      ? new Date(tahun, bulan + 1, 0)
      : yearEnd;

    // Total Kepala Keluarga (aktif)
    const totalKK = await prisma.keluargaUmat.count({
      where: {
        tanggalKeluar: null,
        status: "HIDUP",
      }
    });

    // Total Jiwa (KK + Pasangan + Tanggungan)
    // 1. Total Kepala Keluarga
    const keluargaUmat = await prisma.keluargaUmat.findMany({
      where: {
        tanggalKeluar: null,
        status: "HIDUP",
      },
      include: {
        pasangan: true,
        tanggungan: true,
      }
    });
    
    // 2. Hitung jumlah anggota keluarga dari database
    let jumlahJiwa = 0;
    for (const keluarga of keluargaUmat) {
      // Tambahkan Kepala Keluarga
      jumlahJiwa += 1;
      
      // Tambahkan pasangan jika hidup
      if (keluarga.pasangan && keluarga.pasangan.status === "HIDUP") {
        jumlahJiwa += 1;
      }
      
      // Tambahkan semua tanggungan
      jumlahJiwa += keluarga.tanggungan.length;
    }

    // KK Bergabung - hanya pada periode yang dipilih
    const kkBergabung = await prisma.keluargaUmat.count({
      where: {
        tanggalBergabung: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    // KK Pindah - hanya pada periode yang dipilih
    const kkPindah = await prisma.keluargaUmat.count({
      where: {
        tanggalKeluar: {
          gte: monthStart,
          lte: monthEnd,
        },
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
      kkBergabung,
      kkPindah,
      umatMeninggalDunia,
      tingkatPartisipasiUmat,
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
        danaMandiri: {
          where: {
            tahun: currentYear,
          },
        }
      },
    });
    
    // Array untuk menyimpan data penunggak
    const penunggakList = [];
    
    // Fungsi untuk mendapatkan nama bulan dalam Bahasa Indonesia
    const getBulanIndonesia = (bulan: number) => {
      const namaBulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      return namaBulan[bulan];
    };
    
    // Proses data keluarga untuk menemukan tunggakan
    for (const keluarga of keluargaList) {
      // Data dana mandiri yang sudah dibayar
      const dibayar = keluarga.danaMandiri;
      
      // Cek bulan yang belum dibayar
      const bulanTerbayar = dibayar.map(d => d.bulan);
      const bulanTertunggak = [];
      
      // Cek apakah ada bulan yang belum dibayar (sampai bulan saat ini)
      const currentMonth = new Date().getMonth();
      for (let i = 0; i <= currentMonth; i++) {
        if (!bulanTerbayar.includes(i)) {
          bulanTertunggak.push(i);
        }
      }
      
      // Jika ada bulan yang tertunggak, tambahkan ke daftar penunggak
      if (bulanTertunggak.length > 0) {
        // Format periode tunggakan
        let periodeTunggakan = "";
        if (bulanTertunggak.length === 1) {
          periodeTunggakan = `${getBulanIndonesia(bulanTertunggak[0])} ${currentYear}`;
        } else {
          // Urutkan bulan tertunggak
          bulanTertunggak.sort((a, b) => a - b);
          
          // Kelompokkan bulan berurutan
          const groups: number[][] = [];
          let currentGroup: number[] = [bulanTertunggak[0]];
          
          for (let i = 1; i < bulanTertunggak.length; i++) {
            if (bulanTertunggak[i] === bulanTertunggak[i-1] + 1) {
              currentGroup.push(bulanTertunggak[i]);
            } else {
              groups.push([...currentGroup]);
              currentGroup = [bulanTertunggak[i]];
            }
          }
          groups.push(currentGroup);
          
          // Format periode dari kelompok bulan
          periodeTunggakan = groups.map(group => {
            if (group.length === 1) {
              return getBulanIndonesia(group[0]);
            } else {
              return `${getBulanIndonesia(group[0])}-${getBulanIndonesia(group[group.length-1])}`;
            }
          }).join(", ") + ` ${currentYear}`;
        }
        
        // Hitung jumlah tunggakan (asumsikan 50.000 per bulan)
        const jumlahTunggakan = bulanTertunggak.length * 50000;
        
        penunggakList.push({
          id: keluarga.id,
          nama: keluarga.namaKepalaKeluarga,
          periodeTunggakan,
          jumlahTunggakan,
        });
      }
    }
    
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
        iurataIkata: {
          where: {
            tahun: currentYear,
          },
        }
      },
    });
    
    // Array untuk menyimpan data penunggak
    const penunggakList = [];
    
    // Fungsi untuk mendapatkan nama bulan dalam Bahasa Indonesia
    const getBulanIndonesia = (bulan: number) => {
      const namaBulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      return namaBulan[bulan];
    };
    
    // Proses data keluarga untuk menemukan tunggakan
    for (const keluarga of keluargaList) {
      // Data iuran yang sudah dibayar
      const iuranList = keluarga.iurataIkata;
      
      // Jika tidak ada data iuran atau semua status BELUM_BAYAR, maka dianggap penunggak
      if (iuranList.length === 0 || iuranList.every(i => i.status === "BELUM_BAYAR")) {
        // Periode tunggakan adalah seluruh bulan hingga saat ini
        const currentMonth = new Date().getMonth();
        const periodeTunggakan = `${getBulanIndonesia(0)}-${getBulanIndonesia(currentMonth)} ${currentYear}`;
        
        // Hitung jumlah tunggakan (asumsikan 25.000 per bulan)
        const jumlahTunggakan = (currentMonth + 1) * 25000;
        
        penunggakList.push({
          id: keluarga.id,
          nama: keluarga.namaKepalaKeluarga,
          periodeTunggakan,
          jumlahTunggakan,
        });
      } 
      // Jika ada data iuran dengan status SEBAGIAN_BULAN
      else if (iuranList.some(i => i.status === "SEBAGIAN_BULAN")) {
        // Ambil data iuran dengan status SEBAGIAN_BULAN
        const iuranSebagian = iuranList.find(i => i.status === "SEBAGIAN_BULAN");
        
        // Jika tidak ada data bulanAwal atau bulanAkhir, skip
        if (!iuranSebagian || iuranSebagian.bulanAwal === null || iuranSebagian.bulanAkhir === null) {
          continue;
        }
        
        // Hitung bulan yang belum dibayar
        const bulanTerbayar = [];
        for (let i = iuranSebagian.bulanAwal; i <= iuranSebagian.bulanAkhir; i++) {
          bulanTerbayar.push(i);
        }
        
        // Cek bulan yang belum dibayar (sampai bulan saat ini)
        const currentMonth = new Date().getMonth();
        const bulanTertunggak = [];
        for (let i = 0; i <= currentMonth; i++) {
          if (!bulanTerbayar.includes(i)) {
            bulanTertunggak.push(i);
          }
        }
        
        // Jika ada bulan yang tertunggak, tambahkan ke daftar penunggak
        if (bulanTertunggak.length > 0) {
          // Format periode tunggakan
          let periodeTunggakan = "";
          if (bulanTertunggak.length === 1) {
            periodeTunggakan = `${getBulanIndonesia(bulanTertunggak[0])} ${currentYear}`;
          } else {
            // Urutkan bulan tertunggak
            bulanTertunggak.sort((a, b) => a - b);
            
            // Kelompokkan bulan berurutan
            const groups: number[][] = [];
            let currentGroup: number[] = [bulanTertunggak[0]];
            
            for (let i = 1; i < bulanTertunggak.length; i++) {
              if (bulanTertunggak[i] === bulanTertunggak[i-1] + 1) {
                currentGroup.push(bulanTertunggak[i]);
              } else {
                groups.push([...currentGroup]);
                currentGroup = [bulanTertunggak[i]];
              }
            }
            groups.push(currentGroup);
            
            // Format periode dari kelompok bulan
            periodeTunggakan = groups.map(group => {
              if (group.length === 1) {
                return getBulanIndonesia(group[0]);
              } else {
                return `${getBulanIndonesia(group[0])}-${getBulanIndonesia(group[group.length-1])}`;
              }
            }).join(", ") + ` ${currentYear}`;
          }
          
          // Hitung jumlah tunggakan (asumsikan 25.000 per bulan)
          const jumlahTunggakan = bulanTertunggak.length * 25000;
          
          penunggakList.push({
            id: keluarga.id,
            nama: keluarga.namaKepalaKeluarga,
            periodeTunggakan,
            jumlahTunggakan,
          });
        }
      }
    }
    
    return penunggakList;
  } catch (error) {
    console.error("Error getting penunggak Ikata data:", error);
    return [];
  }
}