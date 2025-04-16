import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DoaLingkunganPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Doa Lingkungan</h1>

      <Tabs defaultValue="jadwal" className="w-full">
        <TabsList>
          <TabsTrigger value="jadwal">Jadwal Doling</TabsTrigger>
          <TabsTrigger value="detil">Detil Doling</TabsTrigger>
          <TabsTrigger value="absensi">Absensi</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat Doling</TabsTrigger>
          <TabsTrigger value="kaleidoskop">Kaleidoskop</TabsTrigger>
        </TabsList>

        <TabsContent value="jadwal">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button>Tambah Jadwal</Button>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Tuan Rumah</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>15/04/2024</TableCell>
                    <TableCell>19:00</TableCell>
                    <TableCell>Budi Santoso</TableCell>
                    <TableCell>Jl. Merdeka No. 123</TableCell>
                    <TableCell>Terjadwal</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Hapus</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="detil">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button>Tambah Data</Button>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Tuan Rumah</TableHead>
                    <TableHead>Jumlah Hadir</TableHead>
                    <TableHead>Kegiatan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>15/04/2024</TableCell>
                    <TableCell>Budi Santoso</TableCell>
                    <TableCell>25</TableCell>
                    <TableCell>Doa Rosario</TableCell>
                    <TableCell>Selesai</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Hapus</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="absensi">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button>Tambah Absensi</Button>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kepala Keluarga</TableHead>
                    <TableHead>Kehadiran</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Budi Santoso</TableCell>
                    <TableCell>Ya</TableCell>
                    <TableCell>Hadir</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="riwayat">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Rekapitulasi Kehadiran</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Total Hadir</TableHead>
                        <TableHead>Persentase</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Budi Santoso</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>90%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Rekapitulasi Kegiatan</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bulan</TableHead>
                        <TableHead>Jumlah Kegiatan</TableHead>
                        <TableHead>Rata-rata Hadir</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>April 2024</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>25</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="kaleidoskop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Kegiatan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">48</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Rata-rata Kehadiran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">85%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total KK Aktif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">50</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 