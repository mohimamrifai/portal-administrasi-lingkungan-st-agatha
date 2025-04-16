import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTable } from "./data-table"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {/* Resume Keuangan Lingkungan */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Resume Keuangan Lingkungan</CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Saldo Awal:</span>
              <span className="font-semibold">Rp 5.000.000</span>
            </div>
            <div className="flex justify-between">
              <span>Total Pemasukan:</span>
              <span className="font-semibold text-green-600">Rp 2.500.000</span>
            </div>
            <div className="flex justify-between">
              <span>Total Pengeluaran:</span>
              <span className="font-semibold text-red-600">Rp 1.500.000</span>
            </div>
            <div className="flex justify-between">
              <span>Saldo Akhir:</span>
              <span className="font-semibold">Rp 6.000.000</span>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Periode: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </div>
        </CardFooter>
      </Card>

      {/* Resume Keuangan IKATA */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Resume Keuangan IKATA</CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Saldo Awal:</span>
              <span className="font-semibold">Rp 3.000.000</span>
            </div>
            <div className="flex justify-between">
              <span>Pemasukan:</span>
              <span className="font-semibold text-green-600">Rp 1.500.000</span>
            </div>
            <div className="flex justify-between">
              <span>Pengeluaran:</span>
              <span className="font-semibold text-red-600">Rp 800.000</span>
            </div>
            <div className="flex justify-between">
              <span>Saldo Akhir:</span>
              <span className="font-semibold">Rp 3.700.000</span>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Periode: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </div>
        </CardFooter>
      </Card>

      {/* Resume Kesekretariatan */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Resume Kesekretariatan</CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Kepala Keluarga:</span>
              <span className="font-semibold">150 KK</span>
            </div>
            <div className="flex justify-between">
              <span>Jumlah Jiwa:</span>
              <span className="font-semibold">600 Jiwa</span>
            </div>
            <div className="flex justify-between">
              <span>KK Bergabung:</span>
              <span className="font-semibold text-green-600">5 KK</span>
            </div>
            <div className="flex justify-between">
              <span>KK Pindah:</span>
              <span className="font-semibold text-red-600">2 KK</span>
            </div>
            <div className="flex justify-between">
              <span>Umat Meninggal:</span>
              <span className="font-semibold text-red-600">1 Jiwa</span>
            </div>
            <div className="flex justify-between">
              <span>Tingkat Partisipasi:</span>
              <span className="font-semibold">75%</span>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Periode: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </div>
        </CardFooter>
      </Card>

      {/* List Tunggakan Dana Mandiri */}
      <Card className="@container/card col-span-full">
        <CardHeader>
          <CardDescription>Daftar Tunggakan Dana Mandiri</CardDescription>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Nama Kepala Keluarga</th>
                  <th className="text-left">Periode Tunggakan</th>
                  <th className="text-left">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Budi Santoso</td>
                  <td>Januari 2024</td>
                  <td className="text-red-600">Rp 50.000</td>
                </tr>
                <tr>
                  <td>Ani Wijaya</td>
                  <td>Februari 2024</td>
                  <td className="text-red-600">Rp 50.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardHeader>
      </Card>

      {/* List Tunggakan IKATA */}
      <Card className="@container/card col-span-full">
        <CardHeader>
          <CardDescription>Daftar Tunggakan IKATA</CardDescription>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Nama Kepala Keluarga</th>
                  <th className="text-left">Periode Tunggakan</th>
                  <th className="text-left">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Budi Santoso</td>
                  <td>Januari 2024</td>
                  <td className="text-red-600">Rp 25.000</td>
                </tr>
                <tr>
                  <td>Ani Wijaya</td>
                  <td>Februari 2024</td>
                  <td className="text-red-600">Rp 25.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
