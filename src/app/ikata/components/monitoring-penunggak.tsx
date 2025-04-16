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

export default function MonitoringPenunggak() {
  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <Input placeholder="Cari nama kepala keluarga..." className="w-[300px]" />
        <div className="space-x-2">
          <Button variant="outline">Kirim Pengingat</Button>
          <Button>Set Iuran</Button>
        </div>
      </div>

      {/* Monitoring Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama KK</TableHead>
              <TableHead>Periode Tunggakan</TableHead>
              <TableHead>Jumlah Tunggakan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Tidak ada data
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 