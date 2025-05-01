"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRupiah } from "../utils/index"
import { PiggyBank, CheckCircle, Coins, ClipboardList } from "lucide-react"

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
      {/* Card Total Dana Mandiri */}
      <Card className="gap-2 bg-blue-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-blue-500" />
            Total Dana Mandiri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{formatRupiah(danaMandiriTotal)}</div>
        </CardContent>
      </Card>
      
      {/* Card Jumlah Pembayaran Dana Mandiri */}
      <Card className="gap-2 bg-green-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Jumlah Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{danaMandiriCount}</div>
        </CardContent>
      </Card>
      
      {/* Card Total IKATA */}
      <Card className="gap-2 bg-yellow-50 border-yellow-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-yellow-900 flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            Total IKATA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-900">{formatRupiah(ikataTotal)}</div>
        </CardContent>
      </Card>
      
      {/* Card Jumlah Pembayaran IKATA */}
      <Card className="gap-2 bg-purple-50 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-purple-500" />
            Jumlah Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{ikataCount}</div>
        </CardContent>
      </Card>
    </div>
  )
} 