import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

export default function DanaMandiriPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dana Mandiri</h1>
        <Button>Setor ke Paroki</Button>
      </div>

      {/* Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Iuran Terkumpul</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 50.000.000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah KK Lunas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 KK</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah KK Belum Lunas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 KK</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tab1" className="w-full">
        <TabsList>
          <TabsTrigger value="tab1">Data Transaksi</TabsTrigger>
          <TabsTrigger value="tab2">Monitoring Penunggak</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tab1">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Input placeholder="Cari nama kepala keluarga" className="w-64" />
                <Button variant="outline">Print PDF</Button>
              </div>
              <Button>Tambah Data</Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox />
                    </TableHead>
                    <TableHead>Nama Kepala Keluarga</TableHead>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>Budi Santoso</TableCell>
                    <TableCell>2024</TableCell>
                    <TableCell>Lunas</TableCell>
                    <TableCell>Rp 1.000.000</TableCell>
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
        
        <TabsContent value="tab2">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Input placeholder="Cari nama kepala keluarga" className="w-64" />
              <Button variant="outline">Print PDF</Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox />
                    </TableHead>
                    <TableHead>Nama Kepala Keluarga</TableHead>
                    <TableHead>Periode Tunggakan</TableHead>
                    <TableHead>Jumlah Tunggakan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>Budi Santoso</TableCell>
                    <TableCell>2024</TableCell>
                    <TableCell>Rp 1.000.000</TableCell>
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
      </Tabs>
    </div>
  )
} 