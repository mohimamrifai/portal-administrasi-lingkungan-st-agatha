"use server"

import { prisma } from "@/lib/db"
import { StatusApproval } from "@prisma/client"
import { revalidatePath } from "next/cache"

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