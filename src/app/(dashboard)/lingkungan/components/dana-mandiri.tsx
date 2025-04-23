import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function DanaMandiri() {
  return (
    <Tabs defaultValue="data" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="data">Data Dana Mandiri</TabsTrigger>
        <TabsTrigger value="monitoring">Monitoring Penunggak</TabsTrigger>
      </TabsList>
      
      {/* Tab 1: Data Dana Mandiri */}
      <TabsContent value="data">
        <div className="space-y-6">
          {/* Data Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Iuran Terkumpul</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">KK Lunas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">KK Belum Lunas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Input type="year" className="w-[200px]" />
              <Button variant="outline">Print PDF</Button>
            </div>
            <div className="space-x-2">
              <Button variant="outline">Setor ke Paroki</Button>
              <Button>Tambah Data</Button>
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama KK</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead>Status</TableHead>
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
      </TabsContent>

      {/* Tab 2: Monitoring Penunggak */}
      <TabsContent value="monitoring">
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
      </TabsContent>
    </Tabs>
  )
} 