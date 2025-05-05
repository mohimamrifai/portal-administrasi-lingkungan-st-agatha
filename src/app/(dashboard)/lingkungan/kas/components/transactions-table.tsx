"use client"

import { useState, useEffect } from "react"
import { format, isWithinInterval } from "date-fns"
import { DateRange } from "react-day-picker"
import { JenisTransaksi, TipeTransaksiLingkungan } from "@prisma/client"
import { TransactionData, transactionSubtypeOptions, getCategoryOptions } from "../types/schema"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  PencilIcon, 
  Trash2Icon, 
  LockIcon, 
  UnlockIcon,
  MoreVertical,
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, SearchIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TransactionsTableProps {
  transactions: TransactionData[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  canModifyData?: boolean;
  canApprove?: boolean;
}

export function TransactionsTable({ 
  transactions, 
  onEdit, 
  onDelete,
  onApprove,
  onReject,
  canModifyData = true,
  canApprove = false
}: TransactionsTableProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<TipeTransaksiLingkungan | null>(null);
  const [typeFilter, setTypeFilter] = useState<JenisTransaksi | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Create arrays for filter options
  const categoryOptions = getCategoryOptions();
  
  const typeOptions = [
    { value: null, label: "Semua Tipe", key: "all" },
    { value: JenisTransaksi.UANG_MASUK, label: "Pemasukan", key: "uang_masuk" },
    { value: JenisTransaksi.UANG_KELUAR, label: "Pengeluaran", key: "uang_keluar" }
  ];
  
  // Helper function to get transaction subtype label
  const getSubtypeLabel = (tx: TransactionData) => {
    const options = transactionSubtypeOptions[tx.jenisTransaksi];
    if (!options) return String(tx.tipeTransaksi);
    
    const match = options.find(opt => opt.value === tx.tipeTransaksi);
    return match ? match.label : String(tx.tipeTransaksi);
  };
  
  // Calculate pagination values for filtered data
  const filteredTransactions = transactions.filter(tx => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      (tx.keterangan && tx.keterangan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      getSubtypeLabel(tx).toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === null || 
      tx.tipeTransaksi === categoryFilter;
    
    // Type filter
    const matchesType = typeFilter === null || 
      tx.jenisTransaksi === typeFilter;
    
    // Date range filter
    const matchesDateRange = !dateRange?.from || !dateRange?.to || 
      isWithinInterval(tx.tanggal, {
        start: dateRange.from,
        end: dateRange.to || dateRange.from
      });
    
    return matchesSearch && matchesCategory && matchesType && matchesDateRange;
  });
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, typeFilter, dateRange]);
  
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  // Get current page data
  const currentTransactions = filteredTransactions
    .sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime()) // Sort newest first
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
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
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
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>
          
          {/* Type Filter */}
          <div className="flex-1 md:max-w-[180px]">
            <Select
              value={typeFilter?.toString() || ""}
              onValueChange={(value) => 
                setTypeFilter(value ? value as JenisTransaksi : null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tipe" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem
                    key={option.key}
                    value={option.value?.toString() || ""}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Category Filter */}
          <div className="flex-1 md:max-w-[220px]">
            <Select
              value={categoryFilter?.toString() || ""}
              onValueChange={(value) => 
                setCategoryFilter(value ? value as TipeTransaksiLingkungan : null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem
                    key={option.key}
                    value={option.value?.toString() || ""}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Range Filter */}
          <div className="flex-1 md:max-w-[180px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yy")} -{" "}
                        {format(dateRange.to, "dd/MM/yy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Pilih Tanggal</span>
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
                />
                <div className="flex items-center justify-between p-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDateRange(undefined)}
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => document.body.click()} // Close popover
                  >
                    Terapkan
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tampilkan</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">per halaman</span>
        </div>
      </div>
      
      {/* Clear Filters Button */}
      {(searchTerm || typeFilter || categoryFilter || dateRange) && (
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => {
              setSearchTerm("");
              setTypeFilter(null);
              setCategoryFilter(null);
              setDateRange(undefined);
            }}
          >
            <X className="mr-1 h-3 w-3" />
            Hapus Filter
          </Button>
        </div>
      )}
      
      {/* Transactions Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Kredit</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Tidak ada data transaksi
                </TableCell>
              </TableRow>
            ) : (
              currentTransactions.map((transaction, index) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell>
                    {format(transaction.tanggal, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-default">
                          <span className="truncate">
                            {transaction.keterangan || getSubtypeLabel(transaction)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{transaction.keterangan || getSubtypeLabel(transaction)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.jenisTransaksi === JenisTransaksi.UANG_MASUK ? "default" : "destructive"}
                      className="whitespace-nowrap"
                    >
                      {getSubtypeLabel(transaction)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {transaction.debit > 0
                      ? new Intl.NumberFormat("id-ID").format(transaction.debit)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {transaction.kredit > 0
                      ? new Intl.NumberFormat("id-ID").format(transaction.kredit)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {transaction.isApproved ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Disetujui</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : transaction.isRejected ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <XCircle className="h-5 w-5 text-red-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ditolak</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Clock className="h-5 w-5 text-amber-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Menunggu Persetujuan</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Buka menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canModifyData && !transaction.isApproved && (
                          <>
                            <DropdownMenuItem
                              onClick={() => onEdit(transaction.id)}
                            >
                              <PencilIcon className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive"
                                >
                                  <Trash2Icon className="mr-2 h-4 w-4" />
                                  Hapus
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Konfirmasi Penghapusan
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDelete(transaction.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        
                        {/* Approval Options */}
                        {canApprove && transaction.isPending && (
                          <>
                            <DropdownMenuItem
                              onClick={() => onApprove(transaction.id)}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Setujui
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onReject(transaction.id)}
                              className="text-red-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Tolak
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {startIndex + 1} sampai {endIndex} dari {totalItems} transaksi
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
            >
              <ChevronsLeftIcon className="h-4 w-4" />
              <span className="sr-only">Halaman Pertama</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="sr-only">Halaman Sebelumnya</span>
            </Button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="icon"
                    onClick={() => goToPage(pageNumber)}
                    className="w-9 h-9"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
              <span className="sr-only">Halaman Berikutnya</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
            >
              <ChevronsRightIcon className="h-4 w-4" />
              <span className="sr-only">Halaman Terakhir</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 