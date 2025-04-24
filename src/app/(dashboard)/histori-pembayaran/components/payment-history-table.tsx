"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Eye, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, Edit, Trash2, FileText, MoreVertical, CalendarIcon } from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

import { PaymentHistory } from "../types"
import { formatRupiah, getStatusColor } from "../utils/index"

interface PaymentHistoryTableProps {
  data: PaymentHistory[]
  showUserColumn?: boolean
  onStatusChange?: (payment: PaymentHistory, newStatus: string, newPaymentDate: Date | null) => void
  onDelete?: (payment: PaymentHistory) => void
  onExport?: (payment: PaymentHistory) => void
}

export function PaymentHistoryTable({ 
  data, 
  showUserColumn = false,
  onStatusChange,
  onDelete,
  onExport
}: PaymentHistoryTableProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1)
  }, [data])
  
  // Calculate pagination values
  const totalItems = data.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  
  // Get current page data
  const currentData = data
    .sort((a, b) => b.year - a.year) // Sort by year (newest first)
    .slice(startIndex, endIndex)

  // Jika tidak ada data, tampilkan pesan
  if (data.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {showUserColumn && <TableHead>Nama</TableHead>}
            <TableHead>Tahun</TableHead>
            <TableHead>Tanggal Bayar</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={showUserColumn ? 6 : 5} className="text-center">
              Tidak ada data
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  const handleViewDetails = (payment: PaymentHistory) => {
    setSelectedPayment(payment)
    setSelectedStatus(payment.status)
    setSelectedDate(payment.paymentDate)
    setEditMode(false)
    setDialogOpen(true)
  }
  
  const handleStatusChange = () => {
    if (selectedPayment && onStatusChange) {
      // Jika status diubah menjadi Lunas dan belum ada tanggal, set ke hari ini
      let newDate = selectedDate
      if (selectedStatus === "Lunas" && !selectedDate) {
        newDate = new Date()
      }
      
      // Jika status diubah menjadi Belum Bayar, hapus tanggal
      if (selectedStatus === "Belum Bayar") {
        newDate = null
      }
      
      onStatusChange(selectedPayment, selectedStatus, newDate)
      setDialogOpen(false)
    }
  }
  
  const handleDelete = (payment: PaymentHistory) => {
    if (onDelete) {
      onDelete(payment)
    }
  }
  
  const handleExport = (payment: PaymentHistory) => {
    if (onExport) {
      onExport(payment)
    }
  }
  
  // Watch for status change
  useEffect(() => {
    // Jika status diubah menjadi Lunas dan tidak ada tanggal, set tanggal ke hari ini
    if (selectedStatus === "Lunas" && !selectedDate) {
      setSelectedDate(new Date())
    }
    
    // Jika status diubah menjadi Belum Bayar, hapus tanggal
    if (selectedStatus === "Belum Bayar") {
      setSelectedDate(null)
    }
  }, [selectedStatus])
  
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

  // Tampilkan data dalam tabel
  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {showUserColumn && <TableHead>Nama</TableHead>}
                <TableHead>Tahun</TableHead>
                <TableHead>Tanggal Bayar</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="sticky right-0 bg-white shadow-md text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((payment) => (
                <TableRow key={payment.id}>
                  {showUserColumn && <TableCell>{payment.familyHeadName || 'Tidak ada nama'}</TableCell>}
                  <TableCell>{payment.year}</TableCell>
                  <TableCell>
                    {payment.paymentDate 
                      ? format(payment.paymentDate, "d MMMM yyyy", { locale: id }) 
                      : "-"}
                  </TableCell>
                  <TableCell>{formatRupiah(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="sticky right-0 bg-white shadow-md">
                    {showUserColumn ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Buka Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(payment)}>
                            <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedPayment(payment);
                            setSelectedStatus(payment.status);
                            setSelectedDate(payment.paymentDate);
                            setEditMode(true);
                            setDialogOpen(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport(payment)}>
                            <FileText className="mr-2 h-4 w-4" /> Export PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(payment)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewDetails(payment)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Lihat Detail</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination Controls */}
      {data.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 px-2">
          <div className="flex flex-col md:flex-row items-center gap-2 md:space-x-2 w-full md:w-auto text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              Menampilkan {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} dari {totalItems} transaksi
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

      {/* Dialog detail pembayaran */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editMode ? "Edit Status Pembayaran" : "Detail Pembayaran"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          {selectedPayment && (
            <div className="mt-4 space-y-3">
              {showUserColumn && selectedPayment.familyHeadName && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Nama</div>
                  <div>{selectedPayment.familyHeadName}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Jenis Pembayaran</div>
                <div>{selectedPayment.type}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Deskripsi</div>
                <div>{selectedPayment.description}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Tahun</div>
                <div>{selectedPayment.year}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Jumlah</div>
                <div>{formatRupiah(selectedPayment.amount)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Status</div>
                {editMode ? (
                  <Select 
                    value={selectedStatus} 
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lunas">Lunas</SelectItem>
                      <SelectItem value="Menunggu">Menunggu</SelectItem>
                      <SelectItem value="Belum Bayar">Belum Bayar</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div>
                    <Badge className={getStatusColor(selectedPayment.status)}>
                      {selectedPayment.status}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Tanggal Bayar</div>
                {editMode ? (
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                          disabled={selectedStatus === "Belum Bayar"}
                        >
                          {selectedDate ? (
                            format(selectedDate, "d MMMM yyyy", { locale: id })
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate as Date}
                          onSelect={(date) => date ? setSelectedDate(date) : setSelectedDate(null)}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedStatus === "Lunas" 
                        ? "Tanggal harus diisi untuk status Lunas" 
                        : selectedStatus === "Menunggu"
                          ? "Opsional untuk status Menunggu"
                          : "Tidak tersedia untuk status Belum Bayar"}
                    </p>
                  </div>
                ) : (
                  <div>
                    {selectedPayment.paymentDate
                      ? format(selectedPayment.paymentDate, "d MMMM yyyy", { locale: id })
                      : "-"}
                  </div>
                )}
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Tutup</AlertDialogCancel>
            {editMode ? (
              <AlertDialogAction onClick={handleStatusChange}>
                Simpan Perubahan
              </AlertDialogAction>
            ) : (
              selectedPayment?.status === "Belum Bayar" && (
                <AlertDialogAction>Bayar Sekarang</AlertDialogAction>
              )
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 