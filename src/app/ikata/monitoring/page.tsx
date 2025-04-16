import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MonitoringPenunggakPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Monitoring Penunggak</h1>
        <Button>Kirim Notifikasi</Button>
      </div>

      <div className="flex justify-between">
        <Input placeholder="Cari nama kepala keluarga" className="w-64" />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kepala Keluarga</TableHead>
              <TableHead>Periode Tunggakan</TableHead>
              <TableHead>Jumlah Tunggakan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Budi Santoso</TableCell>
              <TableCell>Januari 2024 - Maret 2024</TableCell>
              <TableCell>Rp 150.000</TableCell>
              <TableCell>Belum Lunas</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">Set Iuran</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ani Wijaya</TableCell>
              <TableCell>Februari 2024 - Maret 2024</TableCell>
              <TableCell>Rp 100.000</TableCell>
              <TableCell>Belum Lunas</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">Set Iuran</Button>
              </TableCell>
            </TableRow>
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 