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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export default function DataUmat() {
  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input placeholder="Cari nama kepala keluarga..." className="w-[300px]" />
          <Button variant="outline">Download Template</Button>
          <Button variant="outline">Import Data</Button>
        </div>
        <Button>Tambah Data</Button>
      </div>

      {/* Data Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama KK</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>No. Telepon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Tidak ada data
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 