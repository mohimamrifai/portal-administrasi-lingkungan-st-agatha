"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SummaryCardsProps {
  initialBalance: number;
  totalIncome: number;
  totalExpense: number;
  finalBalance: number;
}

export function SummaryCards({ 
  initialBalance, 
  totalIncome, 
  totalExpense, 
  finalBalance 
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Awal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {initialBalance.toLocaleString('id-ID')}</div>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pemasukan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Rp {totalIncome.toLocaleString('id-ID')}</div>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">Rp {totalExpense.toLocaleString('id-ID')}</div>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Akhir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {finalBalance.toLocaleString('id-ID')}</div>
        </CardContent>
      </Card>
    </div>
  );
} 