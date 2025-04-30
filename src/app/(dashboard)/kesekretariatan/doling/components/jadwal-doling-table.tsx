"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JadwalDoling } from "../types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Edit2, LucideTrash2, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MoreVertical,
  PencilIcon,
  Trash2Icon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JadwalDolingTableProps {
  jadwal: JadwalDoling[];
  onEdit: (jadwal: JadwalDoling) => void;
  onDelete: (id: number) => void;
}

export function JadwalDolingTable({ jadwal, onEdit, onDelete }: JadwalDolingTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalDoling | null>(null);
  const itemsPerPage = 5;
  
  // Hitung tanggal saat ini untuk memfilter jadwal yang segera datang
  const today = new Date();
  const upcomingDate = new Date();
  upcomingDate.setDate(today.getDate() + 14); // 2 minggu ke depan
  
  // Filter jadwal berdasarkan pencarian dan status
  const filteredJadwal = jadwal
    .filter(item => 
      (item.tuanRumah.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.alamat.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || item.status === statusFilter)
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.tanggal.getTime() - b.tanggal.getTime();
      } else {
        return b.tanggal.getTime() - a.tanggal.getTime();
      }
    });
  
  // Paginasi
  const totalPages = Math.ceil(filteredJadwal.length / itemsPerPage);
  const paginatedJadwal = filteredJadwal.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  // Mendapatkan jadwal yang akan datang dalam 2 minggu ke depan
  const upcomingJadwal = jadwal
    .filter(item => 
      item.status === "terjadwal" && 
      item.tanggal >= today && 
      item.tanggal <= upcomingDate)
    .sort((a, b) => a.tanggal.getTime() - b.tanggal.getTime());
  
  // Fungsi untuk mendapatkan variant badge berdasarkan status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "terjadwal": return "default";
      case "selesai": return "success";
      case "dibatalkan": return "destructive";
      default: return "outline";
    }
  };
  
  // Fungsi untuk mendapatkan label yang lebih user-friendly dari status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "terjadwal": return "Terjadwal";
      case "selesai": return "Selesai";
      case "dibatalkan": return "Dibatalkan";
      default: return status;
    }
  };

  // Helper functions for UI rendering
  const getStatusBadge = (status: JadwalDoling['status']) => {
    switch (status) {
      case 'terjadwal':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Terjadwal</Badge>;
      case 'selesai':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Selesai</Badge>;
      case 'dibatalkan':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Dibatalkan</Badge>;
      default:
        return null;
    }
  };
  
  // Buka dialog detail
  const openDetailDialog = (item: JadwalDoling) => {
    setSelectedJadwal(item);
    setShowDetailDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Upcoming Events Card */}
      {upcomingJadwal.length > 0 && (
        <Card className="border-primary/20 bg-primary/5 gap-2 p-2">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center text-base text-primary">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Akan Datang dalam 2 Minggu
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="grid gap-4">
              {upcomingJadwal.slice(0, 3).map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg bg-background"
                >
                  <div className="flex flex-col">
                    <div className="font-medium mb-1">{item.tuanRumah}</div>
                    <div className="text-sm text-muted-foreground">{item.alamat}</div>
                  </div>
                  <div className="flex mt-2 sm:mt-0 space-x-4 items-center">
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-medium">
                        {format(item.tanggal, "EEEE, dd MMMM yyyy", { locale: id })}
                      </div>
                      <div className="text-sm text-muted-foreground">{item.waktu} WIB</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => openDetailDialog(item)}
                    >
                      Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Dialog Detail Jadwal */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detail Jadwal Doa Lingkungan</DialogTitle>
          </DialogHeader>
          
          {selectedJadwal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Tanggal</h4>
                  <p>{format(selectedJadwal.tanggal, "dd MMMM yyyy", { locale: id })}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Waktu</h4>
                  <p>{selectedJadwal.waktu} WIB</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold">Tuan Rumah</h4>
                <p>{selectedJadwal.tuanRumah}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold">Alamat</h4>
                <p>{selectedJadwal.alamat}</p>
              </div>
              
              {selectedJadwal.noTelepon && (
                <div>
                  <h4 className="text-sm font-semibold">Nomor Telepon</h4>
                  <p>{selectedJadwal.noTelepon}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-semibold">Status</h4>
                <div className="mt-1">{getStatusBadge(selectedJadwal.status)}</div>
              </div>
              
              {selectedJadwal.catatan && (
                <div>
                  <h4 className="text-sm font-semibold">Catatan</h4>
                  <p>{selectedJadwal.catatan}</p>
                </div>
              )}
              
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetailDialog(false)}
                >
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nama/alamat..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset halaman saat pencarian berubah
            }}
          />
        </div>
        <div className="flex w-full sm:w-auto space-x-2">
          <Select 
            value={statusFilter} 
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1); // Reset halaman saat filter berubah
            }}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="terjadwal">Terjadwal</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="h-10 w-10"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Tanggal</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Tuan Rumah</TableHead>
                <TableHead className="hidden md:table-cell">Alamat</TableHead>
                <TableHead className="hidden md:table-cell">No Telepon</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right sticky right-0 bg-white shadow-[-8px_0_10px_-6px_rgba(0,0,0,0.1)] z-10">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedJadwal.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Tidak ada jadwal yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedJadwal.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {format(item.tanggal, "dd MMM yyyy", { locale: id })}
                    </TableCell>
                    <TableCell>{item.waktu} WIB</TableCell>
                    <TableCell>{item.tuanRumah}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="truncate max-w-[200px]">{item.alamat}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.noTelepon ? (
                        <span>{item.noTelepon}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right sticky right-0 bg-white shadow-[-8px_0_10px_-6px_rgba(0,0,0,0.1)] z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DropdownMenuItem onClick={() => onEdit(item)}>
                                  <span>Edit</span>
                                </DropdownMenuItem>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit jadwal ini</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <DropdownMenuSeparator />
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                                <span>Hapus</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus jadwal pada 
                                  {format(item.tanggal, " dd MMMM yyyy", { locale: id })} 
                                  di rumah {item.tuanRumah}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => onDelete(item.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredJadwal.length)} dari {filteredJadwal.length} jadwal
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Logic untuk menampilkan 5 halaman di sekitar halaman saat ini
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0",
                      currentPage === pageNum && "bg-primary"
                    )}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 