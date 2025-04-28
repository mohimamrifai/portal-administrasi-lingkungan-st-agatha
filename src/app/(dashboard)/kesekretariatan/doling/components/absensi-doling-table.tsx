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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Kepala Keluarga</TableHead>
            <TableHead>Kehadiran</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Aksi</TableHead>
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
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      <EditIcon className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
  );
} 