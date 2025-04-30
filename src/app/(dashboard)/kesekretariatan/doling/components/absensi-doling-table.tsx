"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EditIcon, MoreVertical } from "lucide-react";
import { AbsensiDoling } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AbsensiDolingTableProps {
  absensi: AbsensiDoling[];
  onEdit: (absensi: AbsensiDoling) => void;
}

export function AbsensiDolingTable({ absensi, onEdit }: AbsensiDolingTableProps) {
  // Get kehadiran badge
  const getKehadiranBadge = (kehadiran: string) => {
    switch (kehadiran) {
      case "hadir":
        return <Badge variant="success">Hadir</Badge>;
      case "tidak-hadir":
        return <Badge variant="destructive">Tidak Hadir</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Kepala Keluarga</TableHead>
              <TableHead>Kehadiran</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="sticky right-0 bg-white shadow-[-8px_0_10px_-6px_rgba(0,0,0,0.1)] z-10">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {absensi.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.kepalaKeluarga ? "Ya" : "Tidak"}</TableCell>
                <TableCell>{getKehadiranBadge(item.kehadiran)}</TableCell>
                <TableCell>{item.keterangan || "-"}</TableCell>
                <TableCell className="sticky right-0 bg-white shadow-[-8px_0_10px_-6px_rgba(0,0,0,0.1)] z-10">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {absensi.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Belum ada data absensi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 