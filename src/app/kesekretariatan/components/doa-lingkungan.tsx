import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DoaLingkungan() {
  return (
    <Tabs defaultValue="jadwal" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="jadwal">Jadwal Doling</TabsTrigger>
        <TabsTrigger value="detil">Detil Doling</TabsTrigger>
        <TabsTrigger value="absensi">Absensi</TabsTrigger>
        <TabsTrigger value="riwayat">Riwayat Doling</TabsTrigger>
        <TabsTrigger value="kaleidoskop">Kaleidoskop</TabsTrigger>
      </TabsList>

      {/* Tab 1: Jadwal Doling */}
      <TabsContent value="jadwal">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Input type="month" className="w-[200px]" />
            <Button>Tambah Jadwal</Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tuan Rumah</TableHead>
                  <TableHead>Alamat</TableHead>
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
      </TabsContent>

      {/* Tab 2: Detil Doling */}
      <TabsContent value="detil">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input placeholder="Tanggal" type="date" />
              <Input placeholder="Tuan Rumah" />
              <Input placeholder="Alamat" />
              <Input placeholder="Tema" />
              <Input placeholder="Pemimpin Doa" />
            </div>
            <div className="space-y-4">
              <Input placeholder="Pembaca Kitab Suci" />
              <Input placeholder="Pemazmur" />
              <Input placeholder="Pemimpin Lagu" />
              <Input placeholder="Keterangan" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Simpan</Button>
          </div>
        </div>
      </TabsContent>

      {/* Tab 3: Absensi */}
      <TabsContent value="absensi">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Input type="date" className="w-[200px]" />
            <Button>Simpan Absensi</Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </TabsContent>

      {/* Tab 4: Riwayat Doling */}
      <TabsContent value="riwayat">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Input type="month" className="w-[200px]" />
            <Button variant="outline">Print PDF</Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tuan Rumah</TableHead>
                  <TableHead>Jumlah Hadir</TableHead>
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
      </TabsContent>

      {/* Tab 5: Kaleidoskop */}
      <TabsContent value="kaleidoskop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kegiatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Kehadiran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">KK Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
} 