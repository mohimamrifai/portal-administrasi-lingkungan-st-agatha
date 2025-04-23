"use client"

import { useState, useEffect } from "react"
import { format, isWithinInterval } from "date-fns"
import { DateRange } from "react-day-picker"
import { Transaction, transactionSubtypes, familyHeads } from "../types"
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
  ChevronsRightIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleLock: (id: number) => void;
}

export function TransactionsTable({ 
  transactions, 
  onEdit, 
  onDelete, 
  onToggleLock 
}: TransactionsTableProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Create arrays for filter options
  const categoryOptions = [
    { value: null, label: "Semua Kategori", key: "all" },
    ...Object.entries(transactionSubtypes).flatMap(([type, subtypes]) => 
      subtypes.map(subtype => ({ 
        value: subtype.value, 
        label: subtype.label,
        key: `${type}_${subtype.value}`
      }))
    )
  ];
  
  const typeOptions = [
    { value: null, label: "Semua Tipe", key: "all" },
    { value: "debit", label: "Pemasukan", key: "debit" },
    { value: "credit", label: "Pengeluaran", key: "credit" }
  ];
  
  // Helper function to get transaction subtype label
  const getSubtypeLabel = (tx: Transaction) => {
    if (!tx.transactionType || !tx.transactionSubtype) return "";
    
    const type = tx.transactionType as "debit" | "credit";
    const subtype = transactionSubtypes[type].find(
      s => s.value === tx.transactionSubtype
    );
    
    return subtype?.label || "";
  };
  
  // Helper function to get transaction type label
  const getTypeLabel = (type: string) => {
    if (type === "debit") return "Pemasukan";
    if (type === "credit") return "Pengeluaran";
    return "Unknown";
  };
  
  // Helper function to get family head name
  const getFamilyHeadName = (id?: number) => {
    if (!id) return "";
    const head = familyHeads.find(h => h.id === id);
    return head?.name || "";
  };
  
  // Calculate pagination values for filtered data
  const filteredTransactions = transactions.filter(tx => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSubtypeLabel(tx).toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === null || 
      tx.transactionSubtype === categoryFilter;
    
    // Type filter
    const matchesType = typeFilter === null || 
      (typeFilter === "debit" && tx.debit > 0) ||
      (typeFilter === "credit" && tx.credit > 0);
    
    // Date range filter
    const matchesDateRange = !dateRange?.from || !dateRange?.to || 
      isWithinInterval(tx.date, {
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
    .sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort newest first
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
        
        <div className="flex flex-wrap gap-2">
          {/* Category Filter */}
          <Select
            value={categoryFilter || "all"}
            onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem 
                  key={option.key || option.value || "all"} 
                  value={option.value === null ? "all" : option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Type Filter */}
          <Select
            value={typeFilter || "all"}
            onValueChange={(value) => setTypeFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[150px]">
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
                  "w-[240px] justify-start text-left font-normal",
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
                numberOfMonths={2}
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
      {(searchTerm || categoryFilter || typeFilter || dateRange) && (
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
          
          {categoryFilter && (
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span>Kategori: {categoryOptions.find(c => c.value === categoryFilter)?.label}</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => setCategoryFilter(null)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear category</span>
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
              setCategoryFilter(null);
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
                <TableHead className="w-[140px]">Kategori</TableHead>
                <TableHead className="w-[110px]">Tipe Transaksi</TableHead>
                <TableHead className="min-w-[250px]">Keterangan</TableHead>
                <TableHead className="text-right w-[120px]">Debit (Rp)</TableHead>
                <TableHead className="text-right w-[120px]">Kredit (Rp)</TableHead>
                <TableHead className="text-center w-[90px]">Status</TableHead>
                <TableHead className="sticky right-0 bg-white shadow-md w-[50px] text-center">Aksi</TableHead>
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
                              setCategoryFilter(null);
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
                    <TableCell>{format(tx.date, "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      {tx.transactionSubtype ? getSubtypeLabel(tx) : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={tx.debit > 0 ? "success" : "outline"} 
                        className={tx.debit > 0 ? 
                          "whitespace-nowrap bg-green-100 text-green-700" : 
                          "whitespace-nowrap bg-red-100 text-red-700 border-red-300"
                        }
                      >
                        {tx.debit > 0 ? "Pemasukan" : "Pengeluaran"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[250px] break-words">
                      <div className="line-clamp-2">
                        {tx.familyHeadId ? 
                          <span>{tx.description} <span className="text-xs text-muted-foreground">({getFamilyHeadName(tx.familyHeadId)})</span></span> :
                          tx.description
                        }
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {tx.debit > 0 ? Number(tx.debit).toLocaleString('id-ID') : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {tx.credit > 0 ? Number(tx.credit).toLocaleString('id-ID') : "-"}
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
                            <AlertDialogAction onClick={() => onDelete(tx.id)}>
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
                              onClick={() => onEdit(tx.id)}
                              disabled={tx.locked}
                              className={tx.locked ? "cursor-not-allowed opacity-50" : ""}
                            >
                              <PencilIcon className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onToggleLock(tx.id)}
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination Controls */}
      {transactions.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Menampilkan {startIndex + 1}-{endIndex} dari {totalItems} transaksi
              {(searchTerm || categoryFilter || typeFilter || dateRange) && 
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
            
            <span className="text-sm">
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
      )}
    </div>
  );
} 