"use client"

import * as React from "react"
import { useState } from "react"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { 
  ColumnDef, 
  ColumnFiltersState,
  flexRender, 
  getCoreRowModel, 
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable 
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
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
import { 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Download, 
  EyeIcon, 
  LockIcon,
  MoreVertical, 
  Pencil, 
  Plus,
  Search, 
  Trash,
  UnlockIcon,
  Users,
  X
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"

// Interface untuk data publikasi
interface Publikasi {
  id: string
  judul: string
  tanggal: string
  waktu: string
  lokasi: string
  targetPenerima: string
  status: "aktif" | "kedaluwarsa"
  pembuat: string
  lampiran: boolean
  locked: boolean
  kategori: "Penting" | "Umum" | "Rahasia" | "Segera"
}

// Data untuk simulasi
const dummyData: Publikasi[] = [
  { 
    id: "1", 
    judul: "Persiapan Natalan 2023",
    tanggal: "2023-12-10", 
    waktu: "19:30", 
    lokasi: "Gereja St. Agatha",
    targetPenerima: "Semua umat", 
    status: "aktif",
    pembuat: "Admin Lingkungan",
    lampiran: true,
    locked: false,
    kategori: "Penting"
  },
  { 
    id: "2", 
    judul: "Jadwal Misa Paskah",
    tanggal: "2023-04-05", 
    waktu: "15:00", 
    lokasi: "Gereja St. Agatha",
    targetPenerima: "Semua umat", 
    status: "aktif",
    pembuat: "Admin Lingkungan",
    lampiran: true,
    locked: true,
    kategori: "Umum"
  },
  { 
    id: "3", 
    judul: "Pengumpulan Dana Bantuan Bencana",
    tanggal: "2023-02-12", 
    waktu: "09:00", 
    lokasi: "Aula Paroki",
    targetPenerima: "Wilayah Timur", 
    status: "kedaluwarsa",
    pembuat: "Ketua Lingkungan",
    lampiran: false,
    locked: true,
    kategori: "Segera"
  },
  { 
    id: "4", 
    judul: "Perubahan Jadwal Doa Rosario",
    tanggal: "2023-05-16", 
    waktu: "16:00", 
    lokasi: "Rumah Ketua Lingkungan",
    targetPenerima: "Wilayah Barat", 
    status: "aktif",
    pembuat: "Sekretaris",
    lampiran: true,
    locked: false,
    kategori: "Umum"
  },
  { 
    id: "5", 
    judul: "Rapat Evaluasi Kegiatan Tahunan",
    tanggal: "2023-11-25", 
    waktu: "10:00", 
    lokasi: "Aula Paroki",
    targetPenerima: "Pengurus", 
    status: "aktif",
    pembuat: "Admin Lingkungan",
    lampiran: false,
    locked: false,
    kategori: "Rahasia"
  },
  { 
    id: "6", 
    judul: "Pembagian Sembako untuk Lansia",
    tanggal: "2023-08-05", 
    waktu: "08:00", 
    lokasi: "Depan Gereja",
    targetPenerima: "Lansia", 
    status: "kedaluwarsa",
    pembuat: "Ketua Lingkungan",
    lampiran: true,
    locked: true,
    kategori: "Penting"
  },
]

// Definisi kolom tabel
const columns: ColumnDef<Publikasi>[] = [
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("tanggal")), "dd/MM/yyyy")}</div>
    )
  },
  {
    accessorKey: "judul",
    header: "Judul Publikasi",
    cell: ({ row }) => {
      const kategori = row.original.kategori;
      const getKategoriIcon = () => {
        switch (kategori) {
          case "Penting":
            return <span className="text-red-500">●</span>
          case "Segera":
            return <span className="text-orange-500">●</span>
          case "Rahasia":
            return <span className="text-purple-500">●</span>
          case "Umum":
            return <span className="text-blue-500">●</span>
          default:
            return null
        }
      }
      
      return (
        <div className="max-w-[250px] break-words">
          <div className="font-medium line-clamp-2 flex items-center gap-1">
            {getKategoriIcon()} {row.getValue("judul")}
          </div>
          <div className="text-xs text-muted-foreground flex items-center">
            <Users className="h-3.5 w-3.5 mr-1.5" /> 
            {row.original.targetPenerima}
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "kategori",
    header: "Kategori",
    cell: ({ row }) => {
      const kategori = row.getValue("kategori") as string;
      let badgeClass;
      
      switch (kategori) {
        case "Penting":
          badgeClass = "bg-red-50 text-red-700 border-red-200";
          break;
        case "Segera":
          badgeClass = "bg-orange-50 text-orange-700 border-orange-200";
          break;
        case "Rahasia":
          badgeClass = "bg-purple-50 text-purple-700 border-purple-200";
          break;
        case "Umum":
          badgeClass = "bg-blue-50 text-blue-700 border-blue-200";
          break;
        default:
          badgeClass = "bg-gray-50 text-gray-700 border-gray-200";
      }
      
      return (
        <Badge 
          variant="outline"
          className={`${badgeClass} hover:${badgeClass}`}
        >
          {kategori}
        </Badge>
      )
    }
  },
  {
    accessorKey: "lokasi",
    header: "Lokasi",
    cell: ({ row }) => (
      <div className="max-w-[120px]">{row.getValue("lokasi")}</div>
    )
  },
  {
    accessorKey: "lampiran",
    header: "Lampiran",
    cell: ({ row }) => {
      const hasAttachment = row.getValue("lampiran") as boolean
      return hasAttachment ? (
        <div className="flex items-center">
          <FileText className="h-4 w-4 text-blue-500" />
        </div>
      ) : null
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge 
          variant={status === "aktif" ? "outline" : "secondary"}
          className={
            status === "aktif" 
              ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200" 
              : "bg-gray-100 text-gray-500 hover:bg-gray-100"
          }
        >
          {status === "aktif" ? "Aktif" : "Kedaluwarsa"}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const publikasi = row.original
      
      return (
        <AlertDialog>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus publikasi ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={() => console.log("Hapus publikasi", publikasi.id)}>
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
                onClick={() => console.log("Lihat detail", publikasi.id)}
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                <span>Lihat Detail</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Edit publikasi", publikasi.id)}
                disabled={publikasi.locked}
                className={publikasi.locked ? "cursor-not-allowed opacity-50" : ""}
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              {publikasi.lampiran && (
                <DropdownMenuItem
                  onClick={() => console.log("Unduh lampiran", publikasi.id)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  <span>Unduh Lampiran</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => console.log("Toggle lock", publikasi.id)}
              >
                {publikasi.locked ?
                  <UnlockIcon className="mr-2 h-4 w-4" /> :
                  <LockIcon className="mr-2 h-4 w-4" />
                }
                <span>{publikasi.locked ? 'Buka Kunci' : 'Kunci'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  disabled={publikasi.locked}
                  className={`${publikasi.locked ? "cursor-not-allowed opacity-50" : ""} text-red-600 focus:text-red-600`}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Hapus</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDialog>
      )
    }
  }
]

export default function Pengumuman() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [data] = useState<Publikasi[]>(dummyData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [kategoriFilter, setKategoriFilter] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Status filter options
  const statusOptions = [
    { value: null, label: "Semua Status", key: "all" },
    { value: "aktif", label: "Aktif", key: "aktif" },
    { value: "kedaluwarsa", label: "Kedaluwarsa", key: "kedaluwarsa" }
  ]
  
  // Kategori filter options
  const kategoriOptions = [
    { value: null, label: "Semua Kategori", key: "all" },
    { value: "Penting", label: "Penting", key: "penting" },
    { value: "Umum", label: "Umum", key: "umum" },
    { value: "Rahasia", label: "Rahasia", key: "rahasia" },
    { value: "Segera", label: "Segera", key: "segera" }
  ]
  
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Pengumuman</CardTitle>
        <CardDescription>
          Kelola semua pengumuman yang tersedia dalam sistem
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-4">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengumuman..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                table.getColumn("judul")?.setFilterValue(e.target.value)
              }}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                className="absolute right-0 top-0 h-9 w-9 p-0"
                onClick={() => {
                  setSearchTerm("")
                  table.getColumn("judul")?.setFilterValue("")
                }}
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
              onValueChange={(value) => {
                const filter = value === "all" ? null : value
                setStatusFilter(filter)
                if (filter) {
                  table.getColumn("status")?.setFilterValue(filter)
                } else {
                  table.getColumn("status")?.setFilterValue(undefined)
                }
              }}
            >
              <SelectTrigger className="w-[150px]">
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
            
            {/* Kategori Filter */}
            <Select
              value={kategoriFilter || "all"}
              onValueChange={(value) => {
                const filter = value === "all" ? null : value
                setKategoriFilter(filter)
                if (filter) {
                  table.getColumn("kategori")?.setFilterValue(filter)
                } else {
                  table.getColumn("kategori")?.setFilterValue(undefined)
                }
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                {kategoriOptions.map((option) => (
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
                  locale={localeID}
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
          
          <div className="flex mt-4 md:mt-0">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Buat Laporan
            </Button>
            <Button className="ml-2">
              <Plus className="mr-2 h-4 w-4" />
              Buat Pengumuman
            </Button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchTerm || statusFilter || kategoriFilter || dateRange) && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>Filter aktif:</span>
            {searchTerm && (
              <Badge variant="outline" className="gap-1 px-2 py-1">
                <span>Pencarian: {searchTerm}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => {
                    setSearchTerm("")
                    table.getColumn("judul")?.setFilterValue("")
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear search</span>
                </Button>
              </Badge>
            )}
            
            {statusFilter && (
              <Badge variant="outline" className="gap-1 px-2 py-1">
                <span>Status: {statusOptions.find(t => t.value === statusFilter)?.label}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => {
                    setStatusFilter(null)
                    table.getColumn("status")?.setFilterValue(undefined)
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear status</span>
                </Button>
              </Badge>
            )}
            
            {kategoriFilter && (
              <Badge variant="outline" className="gap-1 px-2 py-1">
                <span>Kategori: {kategoriOptions.find(t => t.value === kategoriFilter)?.label}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => {
                    setKategoriFilter(null)
                    table.getColumn("kategori")?.setFilterValue(undefined)
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear kategori</span>
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
                setStatusFilter(null);
                setKategoriFilter(null);
                setDateRange(undefined);
                table.getColumn("judul")?.setFilterValue("")
                table.getColumn("status")?.setFilterValue(undefined)
                table.getColumn("kategori")?.setFilterValue(undefined)
              }}
            >
              Reset Semua
            </Button>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-muted-foreground">Tidak ada data pengumuman yang sesuai dengan filter</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter(null);
                          setKategoriFilter(null);
                          setDateRange(undefined);
                          table.getColumn("judul")?.setFilterValue("")
                          table.getColumn("status")?.setFilterValue(undefined)
                          table.getColumn("kategori")?.setFilterValue(undefined)
                        }}
                      >
                        Reset Filter
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} dari{" "}
            {table.getFilteredRowModel().rows.length} pengumuman
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Baris per halaman</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ke halaman pertama</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ke halaman sebelumnya</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ke halaman berikutnya</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ke halaman terakhir</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 