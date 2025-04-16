import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DataUmatPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Data Umat</h1>
        <div className="flex gap-2">
          <Button variant="outline">Download Template</Button>
          <Button variant="outline">Impor Data</Button>
          <Button>Tambah Data</Button>
        </div>
      </div>

      <div className="flex justify-between">
        <Input placeholder="Cari nama kepala keluarga" className="w-64" />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama Kepala Keluarga</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>No. Telepon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Budi Santoso</TableCell>
              <TableCell>Jl. Merdeka No. 123</TableCell>
              <TableCell>081234567890</TableCell>
              <TableCell>Aktif</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">Hapus</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Ani Wijaya</TableCell>
              <TableCell>Jl. Sudirman No. 456</TableCell>
              <TableCell>089876543210</TableCell>
              <TableCell>Pindah</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">Hapus</Button>
              </TableCell>
            </TableRow>
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 