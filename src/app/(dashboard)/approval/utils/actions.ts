"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { StatusApproval } from "@prisma/client"

// Fungsi untuk mengambil semua data approval
export async function getApprovals() {
  try {
    const approvals = await prisma.approval.findMany({
      include: {
        kasLingkungan: true,
        doaLingkungan: {
          include: {
            tuanRumah: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return {
      success: true,
      data: approvals,
    }
  } catch (error) {
    console.error("Gagal mengambil data approval:", error)
    return {
      success: false,
      error: "Gagal mengambil data approval",
    }
  }
}

// Fungsi untuk menyetujui approval
export async function approveApproval(approvalId: string) {
  try {
    // Dapatkan data approval
    const approval = await prisma.approval.findUnique({
      where: { id: approvalId },
      include: {
        kasLingkungan: true,
        doaLingkungan: true,
      },
    })

    if (!approval) {
      throw new Error("Data approval tidak ditemukan")
    }

    // Update status approval menjadi APPROVED
    const updatedApproval = await prisma.approval.update({
      where: { id: approvalId },
      data: {
        status: StatusApproval.APPROVED,
      },
    })

    // Jika approval terkait dengan doa lingkungan, buat data kas lingkungan
    if (approval.doaLingkunganId) {
      const doaLingkungan = approval.doaLingkungan
      if (!doaLingkungan) {
        throw new Error("Data doa lingkungan tidak ditemukan")
      }

      // Buat entri kas lingkungan untuk Kolekte I jika nilainya > 0
      if (doaLingkungan.kolekteI > 0) {
        await prisma.kasLingkungan.create({
          data: {
            tanggal: doaLingkungan.tanggal,
            jenisTranasksi: "UANG_MASUK",
            tipeTransaksi: "KOLEKTE_I",
            keterangan: `Kolekte I Doa Lingkungan ${doaLingkungan.tanggal.toLocaleDateString()}`,
            debit: doaLingkungan.kolekteI,
            kredit: 0,
          },
        })
      }

      // Buat entri kas lingkungan untuk Kolekte II jika nilainya > 0
      if (doaLingkungan.kolekteII > 0) {
        await prisma.kasLingkungan.create({
          data: {
            tanggal: doaLingkungan.tanggal,
            jenisTranasksi: "UANG_MASUK",
            tipeTransaksi: "KOLEKTE_II",
            keterangan: `Kolekte II Doa Lingkungan ${doaLingkungan.tanggal.toLocaleDateString()}`,
            debit: doaLingkungan.kolekteII,
            kredit: 0,
          },
        })
      }

      // Buat entri kas lingkungan untuk Ucapan Syukur jika nilainya > 0
      if (doaLingkungan.ucapanSyukur > 0) {
        await prisma.kasLingkungan.create({
          data: {
            tanggal: doaLingkungan.tanggal,
            jenisTranasksi: "UANG_MASUK",
            tipeTransaksi: "SUMBANGAN_UMAT",
            keterangan: `Ucapan Syukur Doa Lingkungan ${doaLingkungan.tanggal.toLocaleDateString()}`,
            debit: doaLingkungan.ucapanSyukur,
            kredit: 0,
          },
        })
      }
    }

    revalidatePath("/approval")
    return {
      success: true,
      data: updatedApproval,
    }
  } catch (error) {
    console.error("Gagal menyetujui approval:", error)
    return {
      success: false,
      error: "Gagal menyetujui approval",
    }
  }
}

// Fungsi untuk menolak approval
export async function rejectApproval(approvalId: string, alasanPenolakan?: string) {
  try {
    const updatedApproval = await prisma.approval.update({
      where: { id: approvalId },
      data: {
        status: StatusApproval.REJECTED,
      },
    })

    revalidatePath("/approval")
    return {
      success: true,
      data: updatedApproval,
    }
  } catch (error) {
    console.error("Gagal menolak approval:", error)
    return {
      success: false,
      error: "Gagal menolak approval",
    }
  }
}

// Fungsi untuk mendapatkan statistik approval
export async function getApprovalStats() {
  try {
    const totalApproval = await prisma.approval.count()
    const pendingApproval = await prisma.approval.count({
      where: { status: StatusApproval.PENDING },
    })
    const approvedApproval = await prisma.approval.count({
      where: { status: StatusApproval.APPROVED },
    })
    const rejectedApproval = await prisma.approval.count({
      where: { status: StatusApproval.REJECTED },
    })

    // Mendapatkan total nilai dari doa lingkungan yang sudah diapprove
    const approvedDoaLingkungan = await prisma.doaLingkungan.findMany({
      where: {
        approval: {
          status: StatusApproval.APPROVED,
        },
      },
      select: {
        kolekteI: true,
        kolekteII: true,
        ucapanSyukur: true,
      },
    })

    const totalApprovedAmount = approvedDoaLingkungan.reduce(
      (sum, item) => sum + item.kolekteI + item.kolekteII + item.ucapanSyukur,
      0
    )

    // Mendapatkan data bulan ini
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const thisMonthApproved = await prisma.approval.count({
      where: {
        status: StatusApproval.APPROVED,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    })

    // Mendapatkan total nilai bulan ini
    const thisMonthDoaLingkungan = await prisma.doaLingkungan.findMany({
      where: {
        approval: {
          status: StatusApproval.APPROVED,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      },
      select: {
        kolekteI: true,
        kolekteII: true,
        ucapanSyukur: true,
      },
    })

    const thisMonthAmount = thisMonthDoaLingkungan.reduce(
      (sum, item) => sum + item.kolekteI + item.kolekteII + item.ucapanSyukur,
      0
    )

    return {
      success: true,
      data: {
        total: totalApproval,
        pending: pendingApproval,
        approved: approvedApproval,
        rejected: rejectedApproval,
        totalAmount: totalApprovedAmount,
        thisMonthApproved,
        thisMonthAmount,
      },
    }
  } catch (error) {
    console.error("Gagal mengambil statistik approval:", error)
    return {
      success: false,
      error: "Gagal mengambil statistik approval",
    }
  }
}

// Fungsi untuk mendapatkan approval berdasarkan filter bulan/tahun
export async function getFilteredApprovals(monthYear: string, status: string) {
  try {
    let whereClause: any = {}

    // Filter berdasarkan status
    if (status !== "all") {
      whereClause.status = status.toUpperCase()
    }

    // Filter berdasarkan bulan/tahun
    if (monthYear !== "all") {
      // Cek apakah berformat all-{bulan} atau {tahun}-all
      const [year, month] = monthYear.split("-")
      
      if (year !== "all" && month !== "all") {
        // Format normal: tahun-bulan
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
        const endDate = new Date(parseInt(year), parseInt(month), 0)
        
        whereClause.OR = [
          {
            doaLingkungan: {
              tanggal: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          {
            kasLingkungan: {
              tanggal: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        ]
      } else if (year !== "all" && month === "all") {
        // Filter hanya berdasarkan tahun
        const startDate = new Date(parseInt(year), 0, 1)
        const endDate = new Date(parseInt(year), 11, 31)
        
        whereClause.OR = [
          {
            doaLingkungan: {
              tanggal: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          {
            kasLingkungan: {
              tanggal: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        ]
      } else if (year === "all" && month !== "all") {
        // Filter hanya berdasarkan bulan (dari semua tahun)
        const monthInt = parseInt(month)
        
        // Definisikan tahun-tahun yang dicakup (misalnya 2020-2030)
        const tahunList = Array.from({ length: 11 }, (_, i) => (2020 + i).toString())
        
        // Daripada menggunakan raw SQL, kita gunakan pendekatan alternatif
        // Kita buat array gte-lte untuk setiap tahun dengan bulan yang sama
        const tanggalFilters = tahunList.map(tahun => {
          const tahunInt = parseInt(tahun)
          return [
            {
              gte: new Date(tahunInt, monthInt - 1, 1),
              lte: new Date(tahunInt, monthInt, 0)
            }
          ]
        }).flat()
        
        // Buat OR condition untuk setiap range tanggal
        const doaLingkunganConditions = tanggalFilters.map(filter => ({
          doaLingkungan: {
            tanggal: filter
          }
        }))
        
        const kasLingkunganConditions = tanggalFilters.map(filter => ({
          kasLingkungan: {
            tanggal: filter
          }
        }))
        
        whereClause.OR = [...doaLingkunganConditions, ...kasLingkunganConditions]
      }
    }

    const approvals = await prisma.approval.findMany({
      where: whereClause,
      include: {
        kasLingkungan: true,
        doaLingkungan: {
          include: {
            tuanRumah: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return {
      success: true,
      data: approvals,
    }
  } catch (error) {
    console.error("Gagal mengambil data approval terfilter:", error)
    return {
      success: false,
      error: "Gagal mengambil data approval terfilter",
    }
  }
}

// Fungsi untuk reset status approval kembali ke PENDING
export async function resetApproval(approvalId: string) {
  try {
    const updatedApproval = await prisma.approval.update({
      where: { id: approvalId },
      data: {
        status: StatusApproval.PENDING,
      },
    });

    revalidatePath("/approval");
    return {
      success: true,
      data: updatedApproval,
    };
  } catch (error) {
    console.error("Gagal mereset status approval:", error);
    return {
      success: false,
      error: "Gagal mereset status approval",
    };
  }
}

// Fungsi untuk mendapatkan daftar keluarga umat (untuk dropdown nama penyumbang)
export async function getKeluargaUmatList() {
  try {
    const keluarga = await prisma.keluargaUmat.findMany({
      select: {
        id: true,
        namaKepalaKeluarga: true
      },
      orderBy: {
        namaKepalaKeluarga: 'asc'
      },
      where: {
        status: 'HIDUP',
        tanggalKeluar: null,
      }
    });
    
    return {
      success: true,
      data: keluarga,
    };
  } catch (error) {
    console.error("Error fetching keluarga umat list:", error);
    return {
      success: false,
      error: "Gagal mengambil data keluarga umat",
    };
  }
} 