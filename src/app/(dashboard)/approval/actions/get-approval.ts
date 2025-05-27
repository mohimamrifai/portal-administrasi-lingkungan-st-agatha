"use server"

import { prisma } from "@/lib/db"

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