"use client"

import { ApprovalItem } from "../types"
import { calculateApprovalStats } from "../utils/service"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ApprovalStatsProps {
  items: ApprovalItem[]
}

export function ApprovalStats({ items }: ApprovalStatsProps) {
  const stats = calculateApprovalStats(items)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Permohonan</CardTitle>
          <CardDescription>Jumlah keseluruhan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.pending} menunggu persetujuan
          </p>
        </CardContent>
      </Card>
      
      <Card className="gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
          <CardDescription>Butuh tindakan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((stats.pending / stats.total) * 100)}% dari total
          </p>
        </CardContent>
      </Card>
      
      <Card className="gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
          <CardDescription>Telah diintegrasikan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.thisMonthApproved} bulan ini
          </p>
        </CardContent>
      </Card>
      
      <Card className="gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Biaya</CardTitle>
          <CardDescription>Yang telah disetujui</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {stats.totalAmount.toLocaleString('id-ID')}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Rp {stats.thisMonthAmount.toLocaleString('id-ID')} bulan ini
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 