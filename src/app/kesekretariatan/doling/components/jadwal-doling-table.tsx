"use client";

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { JadwalDoling } from "../types"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface JadwalDolingTableProps {
  jadwal: JadwalDoling[]
  onEdit: (jadwal: JadwalDoling) => void
  onDelete: (id: number) => void
}

export function JadwalDolingTable({ jadwal, onEdit, onDelete }: JadwalDolingTableProps) {
  return (
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
          {jadwal.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{format(item.tanggal, "dd/MM/yyyy", { locale: id })}</TableCell>
              <TableCell>{item.waktu}</TableCell>
              <TableCell>{item.tuanRumah}</TableCell>
              <TableCell>{item.alamat}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.status === 'terjadwal' ? 'bg-blue-100 text-blue-800' :
                  item.status === 'selesai' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 