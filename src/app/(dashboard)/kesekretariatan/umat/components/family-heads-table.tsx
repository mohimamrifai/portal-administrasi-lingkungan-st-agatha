"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Download, User, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, Search } from "lucide-react";
import { FamilyHead } from "../types";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface FamilyHeadsTableProps {
  familyHeads: FamilyHead[];
  onEdit: (familyHead: FamilyHead) => void;
  onDelete: (id: number, reason: "moved" | "deceased", memberName?: string) => Promise<void>;
  onExportTemplate: () => void;
  onImportData: () => void;
  canModifyData?: boolean;
}

export function FamilyHeadsTable({
  familyHeads,
  onEdit,
  onDelete,
  onExportTemplate,
  onImportData,
  canModifyData = true,
}: FamilyHeadsTableProps) {
  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFamilyHead, setSelectedFamilyHead] = useState<FamilyHead | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const statusOptions = [
    { value: null, label: "Semua Status", key: "all" },
    { value: "active", label: "Aktif", key: "active" },
    { value: "moved", label: "Pindah", key: "moved" },
    { value: "deceased", label: "Meninggal", key: "deceased" },
  ];

  const handleDelete = async (id: number, reason: "moved" | "deceased", memberName?: string) => {
    try {
      await onDelete(id, reason, memberName);
      
      toast.success(
        reason === "moved" 
          ? "Status kepala keluarga berhasil diubah menjadi Pindah. Data akan dihapus otomatis setelah 1 tahun 1 bulan."
          : "Status kepala keluarga berhasil diubah menjadi Meninggal."
      );
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui status");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedFamilyHead(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-100 hover:bg-green-100">Aktif</Badge>;
      case "moved":
        return <Badge variant="outline" className="bg-yellow-100 hover:bg-yellow-100">Pindah</Badge>;
      case "deceased":
        return <Badge variant="outline" className="bg-gray-100 hover:bg-gray-100">Meninggal</Badge>;
      default:
        return <Badge variant="outline">Aktif</Badge>;
    }
  };
  
  // Filter data
  const filteredFamilyHeads = familyHeads.filter(familyHead => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      familyHead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      familyHead.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      familyHead.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === null || familyHead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);
  
  // Pagination calculations
  const totalItems = filteredFamilyHeads.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  // Get current page data
  const currentData = filteredFamilyHeads
    .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name
    .slice(startIndex, endIndex);
  
  // Pagination functions
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };
  
  const goToFirstPage = () => {
    setCurrentPage(1);
  };
  
  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kepala keluarga..."
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
            value={statusFilter || "all"}
            onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem 
                  key={option.key} 
                  value={option.value === null ? "all" : option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Export and Import buttons */}
          {canModifyData && (
            <>
              <Button variant="outline" size="sm" onClick={onExportTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              <Button variant="outline" size="sm" onClick={onImportData}>
                <User className="mr-2 h-4 w-4" />
                Impor Data
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Active Filters */}
      {(searchTerm || statusFilter) && (
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
          
          {statusFilter && (
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span>Status: {statusOptions.find(o => o.value === statusFilter)?.label}</span>
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
        </div>
      )}

      <div className="border rounded-lg">
        <div className="overflow-x-auto relative">
          <Table className="table-auto min-w-[800px] lg:w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] whitespace-nowrap">No</TableHead>
                <TableHead className="whitespace-nowrap min-w-[120px]">Nama KK</TableHead>
                <TableHead className="whitespace-nowrap min-w-[180px]">Alamat</TableHead>
                <TableHead className="whitespace-nowrap min-w-[110px]">No. Telepon</TableHead>
                <TableHead className="whitespace-nowrap min-w-[120px]">Tanggal Bergabung</TableHead>
                <TableHead className="whitespace-nowrap min-w-[120px]">Jumlah Anggota</TableHead>
                <TableHead className="whitespace-nowrap min-w-[80px]">Status</TableHead>
                <TableHead className="whitespace-nowrap min-w-[120px]">Tanggal Update</TableHead>
                {canModifyData && <TableHead className="sticky right-0 bg-white shadow-[-4px_0_4px_rgba(0,0,0,0.05)] w-[70px]">Aksi</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canModifyData ? 9 : 8} className="h-24 text-center">
                    Tidak ada data yang sesuai dengan filter
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((familyHead, index) => (
                  <TableRow key={familyHead.id}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell className="font-medium min-w-[120px]">
                      {familyHead.name}
                    </TableCell>
                    <TableCell className="min-w-[180px]">{familyHead.address}</TableCell>
                    <TableCell className="min-w-[110px]">{familyHead.phoneNumber}</TableCell>
                    <TableCell className="min-w-[120px]">
                      {familyHead.joinDate && !isNaN(familyHead.joinDate.getTime()) 
                        ? format(familyHead.joinDate, "dd MMM yyyy", {
                            locale: id,
                          })
                        : "Tanggal tidak valid"}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      {familyHead.familyMembersCount} orang
                      {familyHead.childrenCount > 0 && ` (${familyHead.childrenCount} anak)`}
                      {familyHead.relativesCount > 0 && ` (${familyHead.relativesCount} kerabat)`}
                    </TableCell>
                    <TableCell className="min-w-[80px]">{getStatusBadge(familyHead.status)}</TableCell>
                    <TableCell className="min-w-[120px]">
                      {familyHead.updatedAt && !isNaN(familyHead.updatedAt.getTime())
                        ? format(familyHead.updatedAt, "dd MMM yyyy", {
                            locale: id,
                          })
                        : "Tanggal tidak valid"}
                    </TableCell>
                    {canModifyData && (
                      <TableCell className="sticky right-0 bg-white shadow-[-4px_0_4px_rgba(0,0,0,0.05)] w-[70px]">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(familyHead)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedFamilyHead(familyHead);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        <div className="flex flex-col md:flex-row items-center gap-2 md:space-x-2 w-full md:w-auto text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            Menampilkan {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} dari {totalItems} data
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
              className="h-8 w-8 hidden sm:flex"
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Halaman Pertama</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToPreviousPage} 
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Halaman Sebelumnya</span>
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentPage}/{totalPages || 1}
            </span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToNextPage} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Halaman Selanjutnya</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToLastPage} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 w-8 hidden sm:flex"
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Halaman Terakhir</span>
            </Button>
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        familyHead={selectedFamilyHead}
        onConfirm={handleDelete}
      />
    </div>
  );
} 