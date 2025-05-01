"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EditIcon, SearchIcon, X, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, PlusIcon } from "lucide-react";
import { AbsensiDoling } from "../types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { JadwalDoling } from "../types";

interface AbsensiDolingTableProps {
  absensi: AbsensiDoling[];
  onEdit: (absensi: AbsensiDoling) => void;
  onAdd?: () => void;
  jadwalDoling?: JadwalDoling[];
}

export function AbsensiDolingTable({ absensi, onEdit, onAdd, jadwalDoling = [] }: AbsensiDolingTableProps) {
  // Get user role for authorized actions
  const { userRole } = useAuth();
  const canAddAbsensi = ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris'].includes(userRole);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  
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

  // Filter data based on search
  const filteredData = absensi.filter(item => 
    searchTerm === "" || 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.keterangan && item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  // Current page data
  const currentData = filteredData.slice(startIndex, endIndex);
  
  // Page navigation functions
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  
  // Change items per page
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to first page
  };

  // Fungsi untuk mendapatkan nama tuanRumah dari jadwalId
  const getJadwalInfo = (jadwalId: number) => {
    const jadwal = jadwalDoling.find(j => j.id === jadwalId);
    if (!jadwal) return { tuanRumah: "Tidak tersedia", tanggal: "-" };
    
    return { 
      tuanRumah: jadwal.tuanRumah,
      tanggal: jadwal.tanggal && jadwal.tanggal instanceof Date && !isNaN(jadwal.tanggal.getTime())
        ? format(jadwal.tanggal, "dd MMM yyyy", { locale: id })
        : "Tanggal tidak valid"
    };
  };

  return (
    <div className="space-y-4">     
      {/* Search Filter */}
      <div className="relative w-full md:w-64">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama atau keterangan..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset halaman saat pencarian berubah
          }}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            className="absolute right-0 top-0 h-9 w-9 p-0"
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Hapus pencarian</span>
          </Button>
        )}
      </div>
      
      {/* Table */}
      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jadwal Doling</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kepala Keluarga</TableHead>
                <TableHead>Kehadiran</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="sticky right-0 bg-white shadow-[-8px_0_10px_-6px_rgba(0,0,0,0.1)] z-10">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => {
                  const jadwalInfo = getJadwalInfo(item.jadwalId);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{startIndex + index + 1}</TableCell>
                      <TableCell>
                        {item.tanggalKehadiran && item.tanggalKehadiran instanceof Date && !isNaN(item.tanggalKehadiran.getTime())
                          ? format(item.tanggalKehadiran, "dd MMM yyyy", { locale: id })
                          : "Tanggal tidak valid"}
                      </TableCell>
                      <TableCell>{jadwalInfo.tuanRumah}</TableCell>
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
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    {absensi.length === 0 ? "Belum ada data absensi" : "Tidak ada data yang ditemukan"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 pt-2">
          {/* Tombol Navigasi */}
          <div className="flex items-center justify-center w-full gap-1 border rounded-md p-1.5 bg-gray-50">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
            >
              <ChevronsLeftIcon className="h-3.5 w-3.5" />
              <span className="sr-only">Halaman pertama</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-3.5 w-3.5" />
              <span className="sr-only">Halaman sebelumnya</span>
            </Button>
            <div className="text-xs px-3 py-1 bg-white rounded border min-w-[60px] text-center">
              {currentPage}/{totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-3.5 w-3.5" />
              <span className="sr-only">Halaman berikutnya</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
            >
              <ChevronsRightIcon className="h-3.5 w-3.5" />
              <span className="sr-only">Halaman terakhir</span>
            </Button>
          </div>
          
          {/* Info Pages */}
          <div className="flex items-center justify-center text-xs text-muted-foreground w-full">
            <div className="flex items-center gap-1.5">
              <span className="whitespace-nowrap">
                {filteredData.length === 0 ? 0 : startIndex + 1}-{endIndex} dari {totalItems} data
              </span>
              <span className="mx-1">•</span>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-6 w-[54px] text-xs border-dashed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()} className="text-xs">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="whitespace-nowrap">per halaman</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 