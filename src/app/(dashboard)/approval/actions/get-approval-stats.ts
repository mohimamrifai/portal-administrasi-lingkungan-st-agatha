"use server"

import { prisma } from "@/lib/db"
import { StatusApproval } from "@prisma/client"

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