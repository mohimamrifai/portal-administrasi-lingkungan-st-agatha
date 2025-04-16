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
import { Download } from "lucide-react"

export default function Pengumuman() {
  return (
    <div className="space-y-6">
      {/* Filter and Search */}
      <div className="flex items-center space-x-4">
        <Input placeholder="Cari pengumuman..." className="w-[300px]" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="penting">Penting</SelectItem>
            <SelectItem value="umum">Umum</SelectItem>
            <SelectItem value="rahasia">Rahasia</SelectItem>
            <SelectItem value="segera">Segera</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Announcements Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Batas Waktu</TableHead>
              <TableHead>Lampiran</TableHead>
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