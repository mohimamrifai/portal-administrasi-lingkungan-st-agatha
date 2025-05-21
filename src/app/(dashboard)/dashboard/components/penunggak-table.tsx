import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PenunggakDanaMandiri, PenunggakIkata } from "../types"
import { formatRupiah } from "../utils"

interface PenunggakDanaMandiriTableProps {
  data: PenunggakDanaMandiri[]
}

export function PenunggakDanaMandiriTable({ data }: PenunggakDanaMandiriTableProps) {
  return (
    <div className="border rounded-md">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Nama</TableHead>
              <TableHead className="whitespace-nowrap">Periode Tunggakan</TableHead>
              <TableHead className="text-right whitespace-nowrap">Jumlah Tunggakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium whitespace-nowrap">{item.nama}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.periodeTunggakan}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{formatRupiah(item.jumlahTunggakan)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  Tidak ada data yang belum melunasi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

interface PenunggakIkataTableProps {
  data: PenunggakIkata[]
}

export function PenunggakIkataTable({ data }: PenunggakIkataTableProps) {
  return (
    <div className="border rounded-md">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Nama</TableHead>
              <TableHead className="whitespace-nowrap">Periode Tunggakan</TableHead>
              <TableHead className="text-right whitespace-nowrap">Jumlah Tunggakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium whitespace-nowrap">{item.nama}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.periodeTunggakan}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{formatRupiah(item.jumlahTunggakan)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  Tidak ada data yang belum melunasi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 