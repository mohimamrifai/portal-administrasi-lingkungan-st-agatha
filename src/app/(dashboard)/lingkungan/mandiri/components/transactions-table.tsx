"use client"

import { useState, useEffect } from "react"
import { format, isWithinInterval } from "date-fns"
import { DateRange } from "react-day-picker"
import { DanaMandiriTransaction } from "../types"
import { formatCurrency, getFamilyHeadName } from "../utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Checkbox } from "@/components/ui/checkbox"
import { 
  PencilIcon, 
  Trash2Icon, 
  LockIcon, 
  UnlockIcon,
  MoreVertical,
  SearchIcon,
  X,
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CalendarIcon,
  FilterIcon
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface TransactionsTableProps {
  transactions: DanaMandiriTransaction[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onToggleLock: (id: number) => void
  selectedIds: number[]
  onSelectChange: (id: number, isChecked: boolean) => void
  onSelectAll: (isChecked: boolean) => void
}

export function TransactionsTable({
  transactions,
  onEdit,
  onDelete,
  onToggleLock,
  selectedIds,
  onSelectChange,
  onSelectAll,
}: TransactionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [yearFilter, setYearFilter] = useState<number | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, yearFilter, dateRange])
  
  // Generate years for the year filter dropdown (last 10 years to next 5 years)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 16 }, (_, i) => currentYear - 10 + i)
  
  // Filter transactions by search term, status, year, and date range
  const filteredTransactions = transactions.filter(tx => {
    const familyHeadName = getFamilyHeadName(tx.familyHeadId).toLowerCase()
    const matchesSearch = 
      searchTerm === "" || 
      familyHeadName.includes(searchTerm.toLowerCase()) ||
      tx.year.toString().includes(searchTerm) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = 
      statusFilter === null || 
      tx.status === statusFilter
      
    const matchesYear = 
      yearFilter === null ||
      tx.year === yearFilter
      
    const matchesDateRange = !dateRange?.from || !dateRange?.to || 
      isWithinInterval(tx.paymentDate, {
        start: dateRange.from,
        end: dateRange.to || dateRange.from
      })
      
    return matchesSearch && matchesStatus && matchesYear && matchesDateRange
  })
  
  // Calculate pagination values
  const totalItems = filteredTransactions.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  
  // Get current page data
  const currentTransactions = filteredTransactions
    .sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime()) // Sort newest first
    .slice(startIndex, endIndex)
  
  // Check if all visible transactions are selected
  const allSelected = 
    currentTransactions.length > 0 && 
    currentTransactions.every(tx => 
      selectedIds.includes(tx.id) || tx.isLocked || tx.status === "submitted"
    )
  
  // Handle select all for current page only
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableIds = currentTransactions
        .filter(tx => !tx.isLocked && tx.status !== "submitted")
        .map(tx => tx.id)
      
      const newSelected = [...selectedIds]
      selectableIds.forEach(id => {
        if (!newSelected.includes(id)) {
          newSelected.push(id)
        }
      })
      
      onSelectAll(true)
    } else {
      const currentIds = currentTransactions.map(tx => tx.id)
      const newSelected = selectedIds.filter(id => !currentIds.includes(id))
      onSelectAll(false)
    }
  }
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("")
    setStatusFilter(null)
    setYearFilter(null)
    setDateRange(undefined)
  }
  
  // Get status badge color and text
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700 border-green-300">Lunas</Badge>
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">Belum Lunas</Badge>
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-300">Disetor</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  // Pagination functions
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }
  
  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1))
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1))
  
  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    setCurrentPage(1) // Reset to first page when changing page size
  }
  
  // Status filter options
  const statusOptions = [
    { value: null, label: "Semua Status" },
    { value: "paid", label: "Lunas" },
    { value: "pending", label: "Belum Lunas" },
    { value: "submitted", label: "Disetor" }
  ]
  
  // Format date for display
  const formatDateDisplay = (date: Date | null): string => {
    return date ? format(date, "dd MMM yyyy") : ""
  }
  
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
          {/* Year Filter */}
          <Select
            value={yearFilter?.toString() || "all"}
            onValueChange={(value) => {
              setYearFilter(value === "all" ? null : Number(value))
              setCurrentPage(1) // Reset to first page when filter changes
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {yearOptions.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Status Filter */}
          <Select
            value={statusFilter === null ? "all" : statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value === "all" ? null : value)
              setCurrentPage(1) // Reset to first page when filter changes
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem 
                  key={option.value || "all"} 
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
      
      {/* Active Filters */}
      {(searchTerm || statusFilter || yearFilter || dateRange) && (
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
          
          {yearFilter && (
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span>Tahun: {yearFilter}</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => setYearFilter(null)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear year</span>
              </Button>
            </Badge>
          )}
          
          {(dateRange?.from || dateRange?.to) && (
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span>
                Tanggal: {dateRange.from ? format(dateRange.from, "dd/MM/yyyy") : "..."} - {dateRange.to ? format(dateRange.to, "dd/MM/yyyy") : "..."}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => {
                  setDateRange(undefined)
                }}
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
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={allSelected}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  />
                </TableHead>
                <TableHead className="min-w-[180px]">Nama Kepala Keluarga</TableHead>
                <TableHead className="w-[80px]">Tahun</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="text-right w-[120px]">Jumlah (Rp)</TableHead>
                <TableHead className="w-[120px]">Tanggal Bayar</TableHead>
                <TableHead className="w-[100px]">Status Kunci</TableHead>
                <TableHead className="sticky right-0 bg-white shadow-md w-[50px] text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {filteredTransactions.length === 0 ? (
                        transactions.length > 0 ? (
                          <>
                            <p className="text-muted-foreground">Tidak ada data transaksi yang sesuai dengan filter</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearAllFilters}
                            >
                              Reset Filter
                            </Button>
                          </>
                        ) : (
                          <p className="text-muted-foreground">Tidak ada data transaksi tersedia</p>
                        )
                      ) : (
                        <p className="text-muted-foreground">Tidak ada data transaksi pada halaman ini</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentTransactions.map((tx) => (
                  <TableRow key={tx.id} className={`group ${tx.isLocked ? "bg-gray-50" : ""}`}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedIds.includes(tx.id)}
                        onCheckedChange={(checked) => onSelectChange(tx.id, !!checked)}
                        disabled={tx.isLocked || tx.status === "submitted"}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {getFamilyHeadName(tx.familyHeadId)}
                    </TableCell>
                    <TableCell>{tx.year}</TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(tx.amount)}</TableCell>
                    <TableCell>{format(tx.paymentDate, "dd MMM yyyy")}</TableCell>
                    <TableCell>
                      {tx.isLocked ? 
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
                            <AlertDialogTitle>Hapus Transaksi</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => onDelete(tx.id)}
                            >
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
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <DropdownMenuItem
                                      onClick={() => onEdit(tx.id)}
                                      disabled={tx.isLocked || tx.status === "submitted"}
                                      className={tx.isLocked || tx.status === "submitted" ? "cursor-not-allowed opacity-50" : ""}
                                    >
                                      <PencilIcon className="mr-2 h-4 w-4" />
                                      <span>Edit</span>
                                    </DropdownMenuItem>
                                  </div>
                                </TooltipTrigger>
                                {(tx.isLocked || tx.status === "submitted") && (
                                  <TooltipContent>
                                    <p>Transaksi terkunci tidak dapat diedit</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                            
                            <DropdownMenuItem
                              onClick={() => onToggleLock(tx.id)}
                              disabled={tx.status === "submitted"}
                              className={tx.status === "submitted" ? "cursor-not-allowed opacity-50" : ""}
                            >
                              {tx.isLocked ?
                                <UnlockIcon className="mr-2 h-4 w-4" /> :
                                <LockIcon className="mr-2 h-4 w-4" />
                              }
                              <span>{tx.isLocked ? 'Buka Kunci' : 'Kunci'}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        disabled={tx.isLocked || tx.status === "submitted"}
                                        className={`${tx.isLocked || tx.status === "submitted" ? "cursor-not-allowed opacity-50" : ""} text-red-600 focus:text-red-600`}
                                      >
                                        <Trash2Icon className="mr-2 h-4 w-4" />
                                        <span>Hapus</span>
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                  </div>
                                </TooltipTrigger>
                                {(tx.isLocked || tx.status === "submitted") && (
                                  <TooltipContent>
                                    <p>Transaksi terkunci tidak dapat dihapus</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
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
          <div className="flex flex-col md:flex-row items-center gap-2 md:space-x-2 w-full md:w-auto text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              Menampilkan {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} dari {totalItems} transaksi
              {(searchTerm || statusFilter || yearFilter || dateRange) && 
                ` (difilter dari ${transactions.length} total)`}
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
                  <SelectItem value="100">100</SelectItem>
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
  )
} 