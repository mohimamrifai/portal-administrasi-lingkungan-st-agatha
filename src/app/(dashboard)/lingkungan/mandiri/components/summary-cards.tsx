"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "../utils"

interface SummaryCardsProps {
  totalCollected: number
  paidCount: number
  unpaidCount: number
}

export function SummaryCards({
  totalCollected,
  paidCount,
  unpaidCount
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jumlah Iuran Terkumpul</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalCollected)}</div>
        </CardContent>
      </Card>
      
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jumlah KK Lunas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{paidCount} KK</div>
        </CardContent>
      </Card>
      
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jumlah KK Belum Lunas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unpaidCount} KK</div>
        </CardContent>
      </Card>
    </div>
  )
} 