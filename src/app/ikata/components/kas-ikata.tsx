import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function KasIkata() {
  return (
    <div className="space-y-6">
      {/* Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Awal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pemasukan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Akhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 0</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input type="month" className="w-[200px]" />
          <Button variant="outline">Print PDF</Button>
        </div>
        <Button>Input Transaksi</Button>
      </div>

      {/* Transaction Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Kredit</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Tidak ada data
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 