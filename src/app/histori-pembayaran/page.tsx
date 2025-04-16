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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HistoriPembayaranPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Histori Pembayaran</h1>
      <Tabs defaultValue="dana-mandiri" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dana-mandiri">Dana Mandiri</TabsTrigger>
          <TabsTrigger value="ikata">IKATA</TabsTrigger>
        </TabsList>

        {/* Tab 1: Dana Mandiri */}
        <TabsContent value="dana-mandiri">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Input type="year" className="w-[200px]" />
              <Button variant="outline">Print PDF</Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Tanggal Bayar</TableHead>
                    <TableHead>Jumlah</TableHead>
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

        {/* Tab 2: IKATA */}
        <TabsContent value="ikata">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Input type="year" className="w-[200px]" />
              <Button variant="outline">Print PDF</Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Tanggal Bayar</TableHead>
                    <TableHead>Jumlah</TableHead>
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
      </Tabs>
    </div>
  )
} 