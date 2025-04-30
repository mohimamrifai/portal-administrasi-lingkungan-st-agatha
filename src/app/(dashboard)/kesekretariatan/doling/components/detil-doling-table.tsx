"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DetilDoling } from "../types"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { 
  CheckIcon, 
  PrinterIcon, 
  SearchIcon, 
  X, 
  EditIcon, 
  TrashIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronsLeftIcon, 
  ChevronsRightIcon,
  MoreVertical,
  PencilIcon,
  Trash2Icon,
  CalendarIcon,
  UserIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DetilDolingTableProps {
  detil: DetilDoling[]
  onEdit: (detil: DetilDoling) => void
  onDelete: (id: number) => void
  onApprove?: (id: number) => void
  onPrint?: (id: number) => void
}

export function DetilDolingTable({ 
  detil, 
  onEdit, 
  onDelete,
  onApprove,
  onPrint
}: DetilDolingTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [approveFilter, setApproveFilter] = useState<string | null>(null)
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, approveFilter])
  
  // Format currency
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // Handle approve click
  const handleApproveClick = (id: number) => {
    if (onApprove) {
      onApprove(id);
    } else {
      toast.info("Fitur approval masih dalam pengembangan");
    }
  };

  // Handle print click
  const handlePrintClick = (id: number) => {
    if (onPrint) {
      onPrint(id);
    } else {
      toast.info("Fitur cetak laporan masih dalam pengembangan");
    }
  };
  
  // Filter data based on search and filters
  const filteredData = detil.filter(item => {
    const matchesSearch = 
      searchTerm === "" || 
      item.tuanRumah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.keterangan && item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === null || 
      item.status === statusFilter;
    
    const matchesApproval = 
      approveFilter === null || 
      (approveFilter === "approved" && item.sudahDiapprove) ||
      (approveFilter === "notApproved" && !item.sudahDiapprove);
    
    return matchesSearch && matchesStatus && matchesApproval;
  });
  
  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  // Current page data
  const currentData = filteredData
    .sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime()) // Newest first
    .slice(startIndex, endIndex);
  
  // Page navigation
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  
  // Change items per page
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to first page
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
    setApproveFilter(null);
  };

  // Helper untuk status badge
  const getStatusBadge = (status: DetilDoling['status']) => {
    switch (status) {
      case 'selesai':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Selesai</Badge>;
      case 'dibatalkan':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Dibatalkan</Badge>;
      default:
        return null;
    }
  };

  // Helper untuk jenis ibadat badge
  const getJenisIbadatBadge = (jenisIbadat?: string) => {
    if (!jenisIbadat) return null;

    const jenisMap: Record<string, { color: string, label: string }> = {
      'doa-lingkungan': { color: 'blue', label: 'Doa Lingkungan' },
      'misa': { color: 'purple', label: 'Misa' },
      'pertemuan': { color: 'orange', label: 'Pertemuan' },
      'bakti-sosial': { color: 'green', label: 'Bakti Sosial' },
      'kegiatan-lainnya': { color: 'gray', label: 'Lainnya' }
    };

    const { color, label } = jenisMap[jenisIbadat] || { color: 'gray', label: jenisIbadat };
    return (
      <Badge variant="outline" className={`bg-${color}-50 text-${color}-700 border-${color}-200`}>
        {label}
      </Badge>
    );
  };

  // Helper untuk approval status
  const getApprovalStatus = (sudahDiapprove?: boolean) => {
    if (sudahDiapprove) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircleIcon className="h-4 w-4" />
          <span className="text-xs">Disetujui</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1 text-amber-600">
        <XCircleIcon className="h-4 w-4" />
        <span className="text-xs">Belum Disetujui</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari data kegiatan..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-9 w-9 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <Select
            value={statusFilter === null ? "all" : statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value === "all" ? null : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="selesai">Selesai</SelectItem>
              <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Approval Filter */}
          <Select
            value={approveFilter === null ? "all" : approveFilter}
            onValueChange={(value) => {
              setApproveFilter(value === "all" ? null : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status Approval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="approved">Sudah Diapprove</SelectItem>
              <SelectItem value="notApproved">Belum Diapprove</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active Filters */}
      {(searchTerm || statusFilter !== null || approveFilter !== null) && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Filter aktif:</span>
          {searchTerm && (
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span>Pencarian: {searchTerm}</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear search</span>
              </Button>
            </Badge>
          )}
          
          {statusFilter !== null && (
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span>Status: {statusFilter === "selesai" ? "Selesai" : "Dibatalkan"}</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => setStatusFilter(null)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear status</span>
              </Button>
            </Badge>
          )}
          
          {approveFilter !== null && (
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span>Approval: {approveFilter === "approved" ? "Sudah Diapprove" : "Belum Diapprove"}</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => setApproveFilter(null)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear approval filter</span>
              </Button>
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto h-7 text-xs"
            onClick={clearAllFilters}
          >
            Reset Semua
          </Button>
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Tanggal</TableHead>
                <TableHead>Tuan Rumah</TableHead>
                <TableHead>Jenis Ibadat</TableHead>
                <TableHead>Kehadiran</TableHead>
                <TableHead className="hidden md:table-cell">Kolekte</TableHead>
                <TableHead>Status Kegiatan</TableHead>
                <TableHead>Status Approval</TableHead>
                <TableHead className="text-right sticky right-0 bg-white shadow-[-8px_0_10px_-6px_rgba(0,0,0,0.1)] z-10">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {filteredData.length === 0 ? (
                        detil.length > 0 ? (
                          <>
                            <p className="text-muted-foreground">Tidak ada data kegiatan yang sesuai dengan filter</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearAllFilters}
                            >
                              Reset Filter
                            </Button>
                          </>
                        ) : (
                          <p className="text-muted-foreground">Tidak ada data kegiatan tersedia</p>
                        )
                      ) : (
                        <p className="text-muted-foreground">Tidak ada data kegiatan pada halaman ini</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((item) => (
                  <TableRow key={item.id} className={item.sudahDiapprove ? "bg-green-50" : ""}>
                    <TableCell className="font-medium">
                      {format(item.tanggal, "dd MMM yyyy", { locale: id })}
                    </TableCell>
                    <TableCell>
                      {item.tuanRumah}
                    </TableCell>
                    <TableCell>
                      {getJenisIbadatBadge(item.jenisIbadat)}
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.subIbadat}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{item.jumlahHadir}</span>
                      <span className="text-xs text-muted-foreground ml-1">orang</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {(item.kolekte1 || item.kolekte2 || item.ucapanSyukur) ? (
                        <div className="space-y-1">
                          {item.kolekte1 ? (
                            <div className="text-xs">
                              <span className="text-muted-foreground">Kolekte 1:</span> {formatRupiah(item.kolekte1)}
                            </div>
                          ) : null}
                          {item.kolekte2 ? (
                            <div className="text-xs">
                              <span className="text-muted-foreground">Kolekte 2:</span> {formatRupiah(item.kolekte2)}
                            </div>
                          ) : null}
                          {item.ucapanSyukur ? (
                            <div className="text-xs">
                              <span className="text-muted-foreground">Ucapan Syukur:</span> {formatRupiah(item.ucapanSyukur)}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell>
                      {getApprovalStatus(item.sudahDiapprove)}
                    </TableCell>
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
                                <p>Edit detil doling ini</p>
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
                                  Apakah Anda yakin ingin menghapus detil doling pada 
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
      
      {/* Pagination Controls */}
      {detil.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
          <div className="flex flex-col md:flex-row items-center gap-2 md:space-x-2 w-full md:w-auto text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              Menampilkan {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} dari {totalItems} kegiatan
              {(searchTerm || statusFilter !== null || approveFilter !== null) && 
                ` (difilter dari ${detil.length} total)`}
            </p>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <p className="text-sm text-muted-foreground">Tampilkan</p>
              <Select 
                value={pageSize.toString()} 
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">per halaman</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-4 md:mt-0 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToFirstPage} 
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronsLeftIcon className="h-4 w-4" />
                <span className="sr-only">Halaman Pertama</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToPreviousPage} 
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Halaman Sebelumnya</span>
              </Button>
              
              <span className="text-sm mx-2 min-w-[90px] text-center">
                Halaman {currentPage} dari {totalPages}
              </span>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronRightIcon className="h-4 w-4" />
                <span className="sr-only">Halaman Berikutnya</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToLastPage} 
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronsRightIcon className="h-4 w-4" />
                <span className="sr-only">Halaman Terakhir</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 