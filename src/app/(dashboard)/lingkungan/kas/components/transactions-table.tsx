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
  ChevronsRightIcon,
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
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipe" />
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
          
          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Pilih rentang tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
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
                  onClick={() => {
                    // Custom confirmation logic could go here
                  }}
                >
                  Terapkan
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Tanggal</TableHead>
              <TableHead className="w-[200px]">Keterangan</TableHead>
              <TableHead className="w-[100px]">Tipe</TableHead>
              <TableHead className="w-[120px]">Masuk</TableHead>
              <TableHead className="w-[120px]">Keluar</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Tidak ada data transaksi yang sesuai dengan filter
                </TableCell>
              </TableRow>
            )}
            {currentTransactions.map((transaction) => (
              <TableRow key={transaction.id} className={transaction.locked ? "bg-muted/50" : ""}>
                <TableCell>
                  {format(transaction.date, "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  <div className="max-w-[180px] truncate font-medium" title={transaction.description}>
                    {transaction.description}
                  </div>
                  {transaction.familyHeadId && (
                    <div className="text-xs text-muted-foreground">
                      {getFamilyHeadName(transaction.familyHeadId)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {transaction.transactionSubtype && (
                    <Badge variant={transaction.debit > 0 ? "default" : "destructive"}>
                      {getSubtypeLabel(transaction)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {transaction.debit > 0 && (
                    <span className="font-medium text-green-600">
                      Rp {transaction.debit.toLocaleString('id-ID')}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {transaction.credit > 0 && (
                    <span className="font-medium text-red-600">
                      Rp {transaction.credit.toLocaleString('id-ID')}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEdit(transaction.id)}
                        disabled={transaction.locked}
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            onSelect={(e) => e.preventDefault()}
                            disabled={transaction.locked}
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Hapus Transaksi
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
                      <DropdownMenuItem
                        onClick={() => onToggleLock(transaction.id)}
                      >
                        {transaction.locked ? (
                          <>
                            <UnlockIcon className="mr-2 h-4 w-4" />
                            Buka Kunci
                          </>
                        ) : (
                          <>
                            <LockIcon className="mr-2 h-4 w-4" />
                            Kunci
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="text-sm text-muted-foreground">
          Menampilkan {startIndex + 1}-{endIndex} dari {totalItems} transaksi
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per halaman</SelectItem>
              <SelectItem value="10">10 per halaman</SelectItem>
              <SelectItem value="20">20 per halaman</SelectItem>
              <SelectItem value="50">50 per halaman</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
            >
              <ChevronsLeftIcon className="h-4 w-4" />
              <span className="sr-only">Halaman pertama</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="sr-only">Halaman sebelumnya</span>
            </Button>
            <span className="text-sm font-medium px-2">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRightIcon className="h-4 w-4" />
              <span className="sr-only">Halaman berikutnya</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToLastPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronsRightIcon className="h-4 w-4" />
              <span className="sr-only">Halaman terakhir</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 