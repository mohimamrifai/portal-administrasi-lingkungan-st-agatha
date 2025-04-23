"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RiwayatDoling, RekapitulasiKegiatan } from "../types"

interface RiwayatDolingContentProps {
  riwayat: RiwayatDoling[]
  rekapitulasi: RekapitulasiKegiatan[]
}

export function RiwayatDolingContent({ riwayat, rekapitulasi }: RiwayatDolingContentProps) {
  return (
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
              {riwayat.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.totalHadir}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {item.persentase}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
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
              {rekapitulasi.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.bulan}</TableCell>
                  <TableCell>{item.jumlahKegiatan}</TableCell>
                  <TableCell>{item.rataRataHadir}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 