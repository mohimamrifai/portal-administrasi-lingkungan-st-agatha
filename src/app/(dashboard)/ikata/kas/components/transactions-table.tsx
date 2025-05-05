'use client';

import { useState, useEffect, useCallback } from "react";
import { format, isWithinInterval } from "date-fns";
import { DateRange } from "react-day-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
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
} from '@/components/ui/alert-dialog';
import { 
  PencilIcon, 
  Trash2Icon, 
  LockIcon, 
  UnlockIcon,
  MoreVertical,
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
  X,
  CalendarIcon
} from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { IKATATransaction, PeriodFilter as PeriodFilterType } from '../types';
import { formatCurrency, cn } from '@/lib/utils';

interface TransactionsTableProps {
  transactions: IKATATransaction[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  canModifyData?: boolean;
}

export function TransactionsTable({ 
  transactions, 
  onEdit, 
  onDelete,
  onToggleLock,
  canModifyData = true
}: TransactionsTableProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Type filter options
  const typeOptions = [
    { value: null, label: "Semua Jenis", key: "all" },
    { value: "uang_masuk", label: "Uang Masuk", key: "uang_masuk" },
    { value: "uang_keluar", label: "Uang Keluar", key: "uang_keluar" }
  ];
  
  // Calculate pagination values for filtered data
  const filteredTransactions = transactions.filter(tx => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      tx.keterangan.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === null || 
      tx.jenis === typeFilter;
    
    // Date range filter
    const matchesDateRange = !dateRange?.from || !dateRange?.to || 
      isWithinInterval(new Date(tx.tanggal), {
        start: dateRange.from,
        end: dateRange.to || dateRange.from
      });
    
    return matchesSearch && matchesType && matchesDateRange;
  });
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, dateRange]);
  
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  // Get current page data
  const currentTransactions = filteredTransactions
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()) // Sort newest first
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

  // Format tipe transaksi untuk ditampilkan
  const formatTipeTransaksi = (tipe: string) => {
    const tipeMap: Record<string, string> = {
      // Tipe Uang Masuk
      'iuran_anggota': 'Iuran Anggota',
      'transfer_dana_lingkungan': 'Transfer Dana dari Lingkungan',
      'sumbangan_anggota': 'Sumbangan Anggota',
      'penerimaan_lain': 'Penerimaan Lain-Lain',
      
      // Tipe Uang Keluar
      'uang_duka': 'Uang Duka / Papan Bunga',
      'kunjungan_kasih': 'Kunjungan Kasih',
      'cinderamata_kelahiran': 'Cinderamata Kelahiran',
      'cinderamata_pernikahan': 'Cinderamata Pernikahan',
      'uang_akomodasi': 'Uang Akomodasi',
      'pembelian': 'Pembelian',
      'lain_lain': 'Lain-Lain',
    };
    
    return tipeMap[tipe] || tipe;
  };

  // Mendapatkan warna untuk badge jenis transaksi
  const getJenisTransaksiBadgeStyle = (jenis: string) => {
    if (jenis === 'uang_masuk') {
      return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200";
    } else {
      return "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200";
    }
  };

  // Mendapatkan warna untuk badge tipe transaksi
  const getTipeTransaksiBadgeStyle = (tipe: string) => {
    // Tipe Uang Masuk
    if (tipe === 'iuran_anggota') {
      return "bg-blue-100 text-blue-800 border-blue-200";
    } else if (tipe === 'transfer_dana_lingkungan') {
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    } else if (tipe === 'sumbangan_anggota') {
      return "bg-purple-100 text-purple-800 border-purple-200";
    } else if (tipe === 'penerimaan_lain') {
      return "bg-teal-100 text-teal-800 border-teal-200";
    }
    // Tipe Uang Keluar
    else if (tipe === 'uang_duka') {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (tipe === 'kunjungan_kasih') {
      return "bg-orange-100 text-orange-800 border-orange-200";
    } else if (tipe === 'cinderamata_kelahiran' || tipe === 'cinderamata_pernikahan') {
      return "bg-amber-100 text-amber-800 border-amber-200";
    } else if (tipe === 'uang_akomodasi') {
      return "bg-pink-100 text-pink-800 border-pink-200";
    } else if (tipe === 'pembelian') {
      return "bg-slate-100 text-slate-800 border-slate-200";
    } else {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format status pembayaran iuran
  const formatStatusPembayaran = (status?: string) => {
    if (!status) return "";
    
    const statusMap: Record<string, string> = {
      'lunas': 'Lunas',
      'sebagian_bulan': 'Sebagian Bulan',
      'belum_ada_pembayaran': 'Belum Dibayar'
    };
    
    return statusMap[status] || status;
  };

  // Format periode bayar
  const formatPeriodeBayar = (periode?: string[]) => {
    if (!periode || periode.length === 0) return "";
    
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    return periode.map(p => {
      const [year, month] = p.split('-');
      const monthIndex = parseInt(month, 10) - 1;
      return `${months[monthIndex]} ${year}`;
    }).join(", ");
  };

  // Handler untuk mengelola callback secara aman
  const handleEdit = useCallback((id: string) => {
    if (onEdit) onEdit(id);
  }, [onEdit]);
  
  const handleDelete = useCallback((id: string) => {
    if (onDelete) onDelete(id);
  }, [onDelete]);
  
  const handleToggleLock = useCallback((id: string) => {
    if (onToggleLock) onToggleLock(id);
  }, [onToggleLock]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari transaksi..."
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
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          {/* Type Filter */}
          <Select
            value={typeFilter || "all"}
            onValueChange={(value) => setTypeFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Tipe Transaksi" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem 
                  key={option.key} 
                  value={option.value === null ? "all" : option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Pilih Rentang Tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                className="sm:block hidden"
              />
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="hidden lg:block"
              />
              <div className="flex items-center justify-between px-3 pb-2">
                <Button
                  variant="ghost"
                  onClick={() => setDateRange(undefined)}
                  disabled={!dateRange}
                  className="text-xs"
                >
                  Reset
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Active Filters Summary */}
      {(searchTerm || typeFilter || dateRange) && (
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
          
          {typeFilter && (
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span>Tipe: {typeOptions.find(t => t.value === typeFilter)?.label}</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => setTypeFilter(null)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear type</span>
              </Button>
            </Badge>
          )}
          
          {dateRange?.from && (
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span>
                Tanggal: {format(dateRange.from, "dd/MM/yyyy")}
                {dateRange.to && dateRange.to !== dateRange.from && 
                  ` - ${format(dateRange.to, "dd/MM/yyyy")}`}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => setDateRange(undefined)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear date range</span>
              </Button>
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto h-7 text-xs"
            onClick={() => {
              setSearchTerm("");
              setTypeFilter(null);
              setDateRange(undefined);
            }}
          >
            Reset Semua
          </Button>
        </div>
      )}
      
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="relative w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Tanggal</TableHead>
                <TableHead className="w-[110px]">Jenis Transaksi</TableHead>
                <TableHead className="w-[150px]">Tipe Transaksi</TableHead>
                <TableHead className="min-w-[250px]">Keterangan</TableHead>
                <TableHead className="text-right w-[120px]">Debit</TableHead>
                <TableHead className="text-right w-[120px]">Kredit</TableHead>
                <TableHead className="text-center w-[90px]">Status</TableHead>
                {canModifyData && <TableHead className="sticky right-0 bg-white shadow-md w-[50px] text-center">Aksi</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {filteredTransactions.length === 0 && transactions.length > 0 ? (
                        <>
                          <p className="text-muted-foreground">Tidak ada data transaksi yang sesuai dengan filter</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearchTerm("");
                              setTypeFilter(null);
                              setDateRange(undefined);
                            }}
                          >
                            Reset Filter
                          </Button>
                        </>
                      ) : (
                        <p className="text-muted-foreground">Tidak ada data transaksi pada bulan ini</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentTransactions.map((tx) => (
                  <TableRow key={tx.id} className="group">
                    <TableCell>{format(new Date(tx.tanggal), "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn("font-normal text-xs whitespace-nowrap", getJenisTransaksiBadgeStyle(tx.jenis))}
                      >
                        {tx.jenis === 'uang_masuk' ? 'Uang Masuk' : 'Uang Keluar'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn("font-normal text-xs whitespace-nowrap", getTipeTransaksiBadgeStyle(tx.tipeTransaksi))}
                      >
                        {formatTipeTransaksi(tx.tipeTransaksi)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[250px]">
                      <div className="line-clamp-2">{tx.keterangan}</div>
                      
                      {/* Tambahan informasi untuk Iuran Anggota */}
                      {tx.tipeTransaksi === 'iuran_anggota' && tx.statusPembayaran && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          <span className="font-semibold">Status:</span> {formatStatusPembayaran(tx.statusPembayaran)}
                          {tx.statusPembayaran === 'sebagian_bulan' && tx.periodeBayar && tx.periodeBayar.length > 0 && (
                            <div>
                              <span className="font-semibold">Periode:</span> {formatPeriodeBayar(tx.periodeBayar)}
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {(tx.debit ?? 0) > 0 ? formatCurrency(tx.debit ?? 0) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {(tx.kredit ?? 0) > 0 ? formatCurrency(tx.kredit ?? 0) : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {tx.locked ? 
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                          Terkunci
                        </Badge> : 
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                          Aktif
                        </Badge>
                      }
                    </TableCell>
                    {canModifyData && (
                      <TableCell className="sticky right-0 bg-white shadow-md">
                        <AlertDialog>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(tx.id)}>
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Buka menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEdit(tx.id)}
                                disabled={tx.locked}
                                className={tx.locked ? "cursor-not-allowed opacity-50" : ""}
                              >
                                <PencilIcon className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleLock(tx.id)}
                              >
                                {tx.locked ?
                                  <UnlockIcon className="mr-2 h-4 w-4" /> :
                                  <LockIcon className="mr-2 h-4 w-4" />
                                }
                                <span>{tx.locked ? 'Buka Kunci' : 'Kunci'}</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  disabled={tx.locked}
                                  className={`${tx.locked ? "cursor-not-allowed opacity-50" : ""} text-red-600 focus:text-red-600`}
                                >
                                  <Trash2Icon className="mr-2 h-4 w-4" />
                                  <span>Hapus</span>
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </AlertDialog>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination Controls */}
      {transactions.length > 0 && (
        <div className="flex flex-col space-y-4 px-2">
          {/* Tampilan mobile */}
          <div className="md:hidden flex flex-col items-center justify-center text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Menampilkan {startIndex + 1}-{endIndex} dari {totalItems} transaksi
              {(searchTerm || typeFilter || dateRange) && 
                ` (difilter dari ${transactions.length} total)`}
            </p>
            <div className="flex items-center justify-center space-x-2">
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
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">per halaman</p>
            </div>
          </div>
          
          {/* Navigasi halaman untuk mobile */}
          <div className="md:hidden flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToFirstPage} 
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronsLeftIcon className="h-4 w-4" />
                <span className="sr-only">First Page</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToPreviousPage} 
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              
              <span className="text-sm mx-2">
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
                <span className="sr-only">Next Page</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToLastPage} 
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronsRightIcon className="h-4 w-4" />
                <span className="sr-only">Last Page</span>
              </Button>
            </div>
          </div>
          
          {/* Tampilan desktop */}
          <div className="hidden md:flex md:items-center md:justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Menampilkan {startIndex + 1}-{endIndex} dari {totalItems} transaksi
                {(searchTerm || typeFilter || dateRange) && 
                  ` (difilter dari ${transactions.length} total)`}
              </p>
              <div className="flex items-center space-x-2">
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
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">per halaman</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToFirstPage} 
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronsLeftIcon className="h-4 w-4" />
                <span className="sr-only">First Page</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToPreviousPage} 
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              
              <span className="text-sm mx-2">
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
                <span className="sr-only">Next Page</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToLastPage} 
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronsRightIcon className="h-4 w-4" />
                <span className="sr-only">Last Page</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 