'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IKATASummary } from '../types';
import { formatCurrency } from '@/lib/utils';

interface SummaryCardsProps {
  summary: IKATASummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <>
      <Card className="gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Saldo Awal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl sm:text-2xl font-bold">{formatCurrency(summary.saldoAwal)}</p>
        </CardContent>
      </Card>
      <Card className="gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pemasukan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(summary.pemasukan)}</p>
        </CardContent>
      </Card>
      <Card className="gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl sm:text-2xl font-bold text-red-600">{formatCurrency(summary.pengeluaran)}</p>
        </CardContent>
      </Card>
      <Card className="gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Saldo Akhir</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl sm:text-2xl font-bold">{formatCurrency(summary.saldoAkhir)}</p>
        </CardContent>
      </Card>
    </>
  );
} 