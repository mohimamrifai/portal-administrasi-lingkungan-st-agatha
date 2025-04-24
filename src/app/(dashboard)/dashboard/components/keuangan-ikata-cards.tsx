import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { KeuanganIkataSummary } from "../types"
import { formatRupiah } from "../utils"

interface KeuanganIkataCardsProps {
  data: KeuanganIkataSummary
}

export function KeuanganIkataCards({ data }: KeuanganIkataCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Saldo Awal</CardDescription>
          <CardTitle className="text-xl text-blue-600">{formatRupiah(data.saldoAwal)}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Pemasukan</CardDescription>
          <CardTitle className="text-xl text-green-600">{formatRupiah(data.pemasukan)}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Pengeluaran</CardDescription>
          <CardTitle className="text-xl text-red-600">{formatRupiah(data.pengeluaran)}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Saldo Akhir</CardDescription>
          <CardTitle className="text-xl text-purple-600">{formatRupiah(data.saldoAkhir)}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
} 