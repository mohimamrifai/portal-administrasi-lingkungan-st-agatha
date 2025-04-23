"use client";

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AbsensiDoling } from "../types"

interface AbsensiDolingTableProps {
  absensi: AbsensiDoling[]
  onEdit: (absensi: AbsensiDoling) => void
}

export function AbsensiDolingTable({ absensi, onEdit }: AbsensiDolingTableProps) {
  return (
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
          {absensi.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nama}</TableCell>
              <TableCell>{item.kepalaKeluarga ? 'Ya' : 'Tidak'}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.kehadiran === 'hadir' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.kehadiran}
                </span>
              </TableCell>
              <TableCell>{item.keterangan || '-'}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 