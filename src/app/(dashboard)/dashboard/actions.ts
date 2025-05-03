"use server";

import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

// Fungsi untuk mendapatkan data Keuangan Lingkungan
export async function getKeuanganLingkunganData(bulan?: number, tahun?: number) {
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
      ? await prisma.transaction.aggregate({
          _sum: {
            credit: true,
            debit: true,
          },
          where: {
            date: {
              lt: dateStart,
            },
          },
        })
      : { _sum: { credit: 0, debit: 0 } };

    // Query untuk transaksi pada bulan yang dipilih
    const transactionQuery = {
      where: dateStart && dateEnd
        ? {
            date: {
              gte: dateStart,
              lte: dateEnd,
            },
          }
        : {},
    };

    // Mengambil total pemasukan (debit) untuk periode sesuai dengan schema dan seed data
    const pemasukan = await prisma.transaction.aggregate({
      _sum: {
        debit: true,
      },
      where: {
        ...transactionQuery.where,
        transactionType: "debit",
      },
    });

    // Mengambil total pengeluaran (credit) untuk periode sesuai dengan schema dan seed data
    const pengeluaran = await prisma.transaction.aggregate({
      _sum: {
        credit: true,
      },
      where: {
        ...transactionQuery.where,
        transactionType: "credit",
      },
    });

    // Menghitung saldo awal
    const saldoAwal = 
      (saldoAwalQuery._sum.debit || 0) - (saldoAwalQuery._sum.credit || 0);

    // Menghitung saldo akhir
    const totalPemasukan = pemasukan._sum.debit || 0;
    const totalPengeluaran = pengeluaran._sum.credit || 0;
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
export async function getKeuanganIkataData(bulan?: number, tahun?: number) {
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
      ? await prisma.iKATATransaction.aggregate({
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
    const pemasukan = await prisma.iKATATransaction.aggregate({
      _sum: {
        debit: true,
      },
      where: {
        ...transactionQuery.where,
        jenis: "uang_masuk",
      },
    });

    // Mengambil total pengeluaran (kredit) untuk periode
    const pengeluaran = await prisma.iKATATransaction.aggregate({
      _sum: {
        kredit: true,
      },
      where: {
        ...transactionQuery.where,
        jenis: "uang_keluar",
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
export async function getKesekretariatanData(bulan?: number, tahun?: number) {
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
    const totalKK = await prisma.familyHead.count({
      where: {
        status: "active",
        livingStatus: "ALIVE"
      }
    });

    // Total Jiwa (KK + Spouse + Dependents)
    const totalSpouse = await prisma.spouse.count({
      where: {
        livingStatus: "ALIVE"
      }
    });
    
    const totalDependents = await prisma.dependent.count();
    const jumlahJiwa = totalKK + totalSpouse + totalDependents;

    // KK Bergabung - tidak menggunakan filter periode jika tidak ada bulan/tahun
    const kkBergabung = await prisma.familyHead.count({
      where: {
        ...(bulan !== undefined && tahun !== undefined ? {
          joinDate: {
            gte: monthStart,
            lte: monthEnd,
          }
        } : {}),
        status: "active",
      },
    });

    // KK Pindah - tidak menggunakan filter periode jika tidak ada bulan/tahun
    const kkPindah = await prisma.familyHead.count({
      where: {
        status: "moved",
        ...(bulan !== undefined && tahun !== undefined ? {
          updatedAt: {
            gte: monthStart,
            lte: monthEnd,
          }
        } : {}),
      },
    });

    // Umat Meninggal - tidak menggunakan filter periode jika tidak ada bulan/tahun
    const umatMeninggalDunia = await prisma.familyHead.count({
      where: {
        status: "deceased",
        ...(bulan !== undefined && tahun !== undefined ? {
          deathDate: {
            gte: monthStart,
            lte: monthEnd,
          }
        } : {}),
      },
    });

    // Tingkat Partisipasi Umat (dari data absensi doling)
    // Hitung jumlah kehadiran vs total absensi
    let tingkatPartisipasiUmat = 0;
    
    // Ambil semua absensi umat dalam periode
    const totalAbsensi = await prisma.absensiDoling.count({
      where: {
        ...(bulan !== undefined && tahun !== undefined ? {
          tanggalKehadiran: {
            gte: monthStart,
            lte: monthEnd,
          }
        } : {}),
      },
    });

    if (totalAbsensi > 0) {
      const totalKehadiran = await prisma.absensiDoling.count({
        where: {
          ...(bulan !== undefined && tahun !== undefined ? {
            tanggalKehadiran: {
              gte: monthStart,
              lte: monthEnd,
            }
          } : {}),
          kehadiran: "hadir",
        },
      });

      tingkatPartisipasiUmat = (totalKehadiran / totalAbsensi) * 100;
    } else {
      // Jika tidak ada data absensi di periode yang dipilih, tampilkan data keseluruhan
      const totalKehadiranAll = await prisma.absensiDoling.count({
        where: {
          kehadiran: "hadir",
        },
      });

      const totalAbsensiAll = await prisma.absensiDoling.count();
      
      tingkatPartisipasiUmat = totalAbsensiAll > 0 
        ? (totalKehadiranAll / totalAbsensiAll) * 100 
        : 0;
    }

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

// Fungsi untuk mendapatkan data Penunggak Dana Mandiri
export async function getPenunggakDanaMandiriData() {
  noStore(); // Menonaktifkan caching

  try {
    // Mengambil data penunggak dana mandiri, tanpa filter tahun
    const penunggakData = await prisma.danaMandiriTransaction.findMany({
      where: {
        OR: [
          { paymentStatus: "BelumBayar" },
          { paymentStatus: "Belum Lunas" }
        ]
      },
      include: {
        familyHead: true,
      },
      orderBy: {
        familyHead: {
          fullName: "asc",
        },
      },
      // Memastikan kita dapat mengambil "periodeBayar" jika Prisma client sudah diupdate
      // setelah migrasi
    });

    // Fungsi untuk mendapatkan nama bulan dalam bahasa Indonesia
    const getBulanIndonesia = (bulan: number) => {
      const namaBulan = [
        'Januari', 'Februari', 'Maret', 'April', 
        'Mei', 'Juni', 'Juli', 'Agustus', 
        'September', 'Oktober', 'November', 'Desember'
      ];
      return namaBulan[bulan];
    };
    
    // Transform data untuk tampilan
    return penunggakData.map(item => {
      // Default periode tunggakan - jika tidak ada informasi bulan
      let periodeTunggakan = `${item.year}`;
      
      // Cek apakah ada properti periodeBayar
      const periodeBayar = (item as any).periodeBayar;
      
      if (periodeBayar) {
        try {
          // Format periodeBayar dapat berupa:
          // - "2025-01-04" (menunjukkan bulan Jan-Apr 2025 yang belum dibayar)
          // - "2025-02,04" (menunjukkan bulan Feb dan Apr 2025 yang belum dibayar)
          
          // Periksa apakah ada format khusus dengan koma untuk bulan tertentu
          if (periodeBayar.includes(',')) {
            // Format: "2025-02,04,05" (Feb, Apr, Mei 2025)
            const parts = periodeBayar.split('-');
            if (parts.length >= 2) {
              const tahun = parts[0];
              const bulanList = parts[1].split(',');
              
              const bulanIndonesia = bulanList.map((bulan: string) => {
                const bulanNum = parseInt(bulan);
                return !isNaN(bulanNum) && bulanNum >= 1 && bulanNum <= 12 
                  ? getBulanIndonesia(bulanNum - 1) // convert 1-based ke 0-based
                  : '';
              }).filter((bulan: string) => bulan !== '');
              
              if (bulanIndonesia.length > 0) {
                periodeTunggakan = `${bulanIndonesia.join(', ')} ${tahun}`;
              }
            }
          } else {
            // Format: "2025-01-04" (rentang Jan-Apr 2025)
            const parts = periodeBayar.split('-');
            
            if (parts.length >= 2) {
              const tahun = parseInt(parts[0]);
              const bulanAwal = parseInt(parts[1]) - 1; // Convert to 0-based
              
              // Jika ada informasi bulan akhir, gunakan
              const bulanAkhir = parts.length > 2 ? parseInt(parts[2]) - 1 : bulanAwal;
              
              if (!isNaN(tahun) && !isNaN(bulanAwal) && !isNaN(bulanAkhir) && 
                  bulanAwal >= 0 && bulanAwal < 12 && bulanAkhir >= 0 && bulanAkhir < 12) {
                
                // Jika hanya satu bulan yang belum dibayar
                if (bulanAwal === bulanAkhir) {
                  periodeTunggakan = `${getBulanIndonesia(bulanAwal)} ${tahun}`;
                } 
                // Jika ini adalah bulan saat ini, kita tunjukkan bulan-bulan secara individu
                else if (tahun === new Date().getFullYear()) {
                  // Kita asumsikan semua bulan dari awal hingga akhir belum dibayar
                  const bulanTunggak = [];
                  for (let i = bulanAwal; i <= bulanAkhir; i++) {
                    bulanTunggak.push(getBulanIndonesia(i));
                  }
                  periodeTunggakan = `${bulanTunggak.join(', ')} ${tahun}`;
                }
                // Untuk tahun-tahun sebelumnya, tetap gunakan format rentang
                else {
                  periodeTunggakan = `${getBulanIndonesia(bulanAwal)} - ${getBulanIndonesia(bulanAkhir)} ${tahun}`;
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error parsing periodeBayar: ${periodeBayar}`, error);
          periodeTunggakan = `${item.year}`;
        }
      } else if (item.year === new Date().getFullYear()) {
        // Jika tidak ada periodeBayar tapi tahunnya adalah tahun berjalan
        // dan sekarang bulan Mei 2025, maka kita asumsikan tunggakan Januari-April
        const bulanSaatIni = new Date().getMonth(); // 0-based (0-11)
        if (bulanSaatIni > 0) { // Jika bukan Januari
          const bulanTunggak = [];
          for (let i = 0; i < bulanSaatIni; i++) {
            bulanTunggak.push(getBulanIndonesia(i));
          }
          periodeTunggakan = `${bulanTunggak.join(', ')} ${item.year}`;
        } else {
          periodeTunggakan = `${item.year}`;
        }
      }

      return {
        id: item.id,
        nama: item.familyHead.fullName,
        periodeTunggakan,
        jumlahTunggakan: item.amount || 500000, // Default 500000 jika amount adalah 0
      };
    });
  } catch (error) {
    console.error("Error getting penunggak dana mandiri data:", error);
    return [];
  }
}

// Fungsi untuk mendapatkan data Penunggak IKATA
export async function getPenunggakIkataData() {
  noStore(); // Menonaktifkan caching

  try {
    // Mengambil semua data transaksi IKATA yang belum dibayar
    const penunggakData = await prisma.iKATATransaction.findMany({
      where: {
        statusPembayaran: "belum_ada_pembayaran",
      },
      include: {
        anggota: true,
      },
      orderBy: {
        tanggal: "desc",
      },
    });

    // Fungsi untuk mendapatkan nama bulan dalam bahasa Indonesia
    const getBulanIndonesia = (bulan: number) => {
      const namaBulan = [
        'Januari', 'Februari', 'Maret', 'April', 
        'Mei', 'Juni', 'Juli', 'Agustus', 
        'September', 'Oktober', 'November', 'Desember'
      ];
      return namaBulan[bulan];
    };

    // Helper function untuk mendapatkan tahun dari periodeBayar
    const getTahunDariPeriode = (periodeBayar: string): number => {
      if (!periodeBayar) return new Date().getFullYear();
      const parts = periodeBayar.split('-');
      if (parts.length >= 1) {
        const tahun = parseInt(parts[0]);
        if (!isNaN(tahun)) return tahun;
      }
      return new Date().getFullYear();
    };

    // Mengubah format data untuk tampilan
    return penunggakData
      .filter(item => item.anggota) // Hanya yang memiliki data anggota
      .map(item => {
        // Parse periode pembayaran untuk format yang lebih baik
        let periodeTunggakan = "-";
        
        if (item.periodeBayar) {
          try {
            // Format: "2025-01" (menunjukkan bulan Januari 2025)
            const parts = item.periodeBayar.split('-');
            
            if (parts.length >= 2) {
              const tahun = parseInt(parts[0]);
              const bulan = parseInt(parts[1]) - 1; // Convert to 0-based
              
              if (!isNaN(tahun) && !isNaN(bulan) && bulan >= 0 && bulan < 12) {
                // Dapatkan bulan dalam bahasa Indonesia
                // Untuk IKATA, kita tunjukkan nama bulan langsung
                periodeTunggakan = `${getBulanIndonesia(bulan)} ${tahun}`;
              }
            }
          } catch (error) {
            console.error(`Error parsing periodeBayar IKATA: ${item.periodeBayar}`, error);
            periodeTunggakan = `${getTahunDariPeriode(item.periodeBayar)}`;
          }
        } else {
          // Jika tidak ada periodeBayar, tampilkan default berdasarkan tanggal transaksi
          const tanggal = new Date(item.tanggal);
          periodeTunggakan = `${getBulanIndonesia(tanggal.getMonth())} ${tanggal.getFullYear()}`;
        }

        return {
          id: item.id,
          nama: item.anggota?.fullName || "Nama tidak tersedia",
          periodeTunggakan,
          jumlahTunggakan: item.jumlah,
        };
      });
  } catch (error) {
    console.error("Error getting penunggak IKATA data:", error);
    return [];
  }
} 