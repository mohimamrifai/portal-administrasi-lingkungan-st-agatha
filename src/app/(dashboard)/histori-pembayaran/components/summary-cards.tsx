"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRupiah } from "../utils/index"
import { CreditCard, DollarSign, Receipt } from "lucide-react"

interface SummaryCardsProps {
  danaMandiriTotal: number
  danaMandiriCount: number
  ikataTotal: number
  ikataCount: number
}

export function SummaryCards({
  danaMandiriTotal,
  danaMandiriCount,
  ikataTotal,
  ikataCount
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Dana Mandiri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatRupiah(danaMandiriTotal)}</div>
        </CardContent>
      </Card>
      
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jumlah Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{danaMandiriCount}</div>
        </CardContent>
      </Card>
      
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total IKATA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatRupiah(ikataTotal)}</div>
        </CardContent>
      </Card>
      
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jumlah Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ikataCount}</div>
        </CardContent>
      </Card>
    </div>
  )
} 