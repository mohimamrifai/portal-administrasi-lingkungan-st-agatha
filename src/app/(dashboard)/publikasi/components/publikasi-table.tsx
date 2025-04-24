"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Download, 
  EyeIcon, 
  FileText,
  InfoIcon,
  LockIcon,
  MoreVertical, 
  Pencil, 
  Trash,
  UnlockIcon,
  Users,
  MoreHorizontal,
  CalendarIcon,
  Clock,
  CheckCircle,
  Upload,
  Bell
} from "lucide-react"
import { Publikasi } from "../types/publikasi"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { KATEGORI_PUBLIKASI, TARGET_PENERIMA } from "../utils/constants"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

// Definisi kolom tabel dengan urutan yang sudah ditukar
export const columns: ColumnDef<Publikasi>[] = [
  {
    accessorKey: "judul",
    header: () => <div className="text-left">Judul Publikasi</div>,
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
        </div>
      )
    }
  },
  {
    accessorKey: "tanggal",
    header: () => <div className="text-left">Tanggal</div>,
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {format(new Date(row.getValue("tanggal")), "dd MMMM yyyy", { locale: localeID })}
      </div>
    )
  },
  {
    accessorKey: "targetPenerima",
    header: () => <div className="text-left">Target Penerima</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Users className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          <span>{row.getValue("targetPenerima")}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "kategori",
    header: () => <div className="text-left">Kategori</div>,
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
        <Badge className={`${badgeClass} font-medium`} variant="outline">
          {kategori}
        </Badge>
      )
    }
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      return (
        <Badge 
          variant={status === "aktif" ? "success" : "destructive"}
          className={status === "aktif" ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200" : "bg-red-50 text-red-700 hover:bg-red-50 border-red-200"}
        >
          {status === "aktif" ? "Aktif" : "Kedaluwarsa"}
        </Badge>
      )
    }
  },
  {
    accessorKey: "pembuat",
    header: () => <div className="text-left">Pembuat</div>,
    cell: ({ row }) => <div className="text-left">{row.getValue("pembuat")}</div>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      // Cell ini akan diisi oleh implementasi di dalam PublikasiTable
      return (
        <div className="text-right flex justify-end">
          {/* Placeholder - akan diganti saat rendering */}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 60
  }
]

interface PublikasiTableProps {
  data: Publikasi[]
}

export function PublikasiTable({ data }: PublikasiTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  
  // Dialog state
  const [viewDetailOpen, setViewDetailOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [toggleLockDialogOpen, setToggleLockDialogOpen] = useState(false)
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false)
  const [selectedPublication, setSelectedPublication] = useState<Publikasi | null>(null)
  
  // Edit form states
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editTargetRecipients, setEditTargetRecipients] = useState<string[]>([])
  const [editDeadline, setEditDeadline] = useState<Date>()
  const [editAttachment, setEditAttachment] = useState<File | null>(null)
  const [editSendNotification, setEditSendNotification] = useState(true)
  
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
      columnFilters
    }
  })

  // Implementasi fungsi-fungsi untuk aksi pada tabel
  const handleViewDetail = (publikasi: Publikasi) => {
    setSelectedPublication(publikasi)
    setViewDetailOpen(true)
  };

  const handleEdit = (publikasi: Publikasi) => {
    setSelectedPublication(publikasi)
    setEditTitle(publikasi.judul)
    setEditCategory(publikasi.kategori)
    setEditContent("Isi konten publikasi yang akan diedit...")
    setEditTargetRecipients([publikasi.targetPenerima])
    // Jika ada deadline/tanggal publikasi, konversi ke Date
    if (publikasi.tanggal) {
      setEditDeadline(new Date(publikasi.tanggal))
    }
    // Inisialisasi attachment sebagai null karena kita tidak punya file fisik
    setEditAttachment(null)
    // Default notifikasi
    setEditSendNotification(true)
    setEditDialogOpen(true)
  };

  const handleSaveEdit = () => {
    if (selectedPublication) {
      // Validasi input
      if (!editTitle || !editCategory || !editContent) {
        toast.error("Silakan lengkapi semua kolom yang diperlukan");
        return;
      }

      if (editTargetRecipients.length === 0) {
        toast.error("Pilih minimal satu target penerima");
        return;
      }

      // Simulasi penyimpanan data
      // Di implementasi nyata, kita akan mengirim data ke server
      toast.success("Publikasi berhasil diperbarui", {
        description: `Publikasi "${editTitle}" telah diperbarui`,
      });

      // Menutup dialog setelah berhasil
      setEditDialogOpen(false);

      // Reset form (opsional)
      setEditTitle("");
      setEditCategory("");
      setEditContent("");
      setEditTargetRecipients([]);
      setEditDeadline(undefined);
      setEditAttachment(null);
      setEditSendNotification(true);
    }
  };

  const handleDeleteConfirm = (publikasi: Publikasi) => {
    setSelectedPublication(publikasi)
    setDeleteDialogOpen(true)
  };

  const handleDelete = (id: string, judul: string) => {
    toast.error("Publikasi dihapus", {
      description: `Publikasi "${judul}" telah dihapus`,
    });
    setDeleteDialogOpen(false)
  };

  const handleDownload = (id: string, filename: string) => {
    toast.success("Mengunduh lampiran", {
      description: `Mengunduh lampiran: ${filename}`,
    });
  };

  const handleToggleLockConfirm = (publikasi: Publikasi) => {
    setSelectedPublication(publikasi);
    setToggleLockDialogOpen(true);
  };

  const handleToggleLock = (id: string, judul: string, currentStatus: boolean) => {
    if (currentStatus) {
      // Jika saat ini terkunci, maka membuka kunci
      toast.success("Publikasi dibuka", {
        description: `Publikasi "${judul}" berhasil dibuka`,
      });
    } else {
      // Jika saat ini tidak terkunci, maka mengunci
      toast.success("Publikasi dikunci", {
        description: `Publikasi "${judul}" berhasil dikunci`,
      });
    }
    setToggleLockDialogOpen(false);
  };

  const handleNotificationConfirm = (publikasi: Publikasi) => {
    setSelectedPublication(publikasi);
    setNotificationDialogOpen(true);
  };

  const handleSendNotification = (id: string, judul: string) => {
    toast.success("Notifikasi dikirim", {
      description: `Notifikasi untuk publikasi "${judul}" telah dikirim ke penerima terpilih`,
    });
    setNotificationDialogOpen(false);
  };

  // Render Actions Cell Function
  const renderActionsCell = (publikasi: Publikasi) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 flex items-center justify-center">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleViewDetail(publikasi)} className="cursor-pointer">
            <EyeIcon className="h-4 w-4 mr-2" />
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleEdit(publikasi)} className="cursor-pointer">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownload(publikasi.id, "Lampiran publikasi.pdf")} className="cursor-pointer">
            <Download className="h-4 w-4 mr-2" />
            Unduh Lampiran
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNotificationConfirm(publikasi)} className="cursor-pointer">
            <Bell className="h-4 w-4 mr-2" />
            Kirim Notifikasi
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleToggleLockConfirm(publikasi)} className="cursor-pointer">
            {publikasi.locked ? (
              <><UnlockIcon className="h-4 w-4 mr-2" />Buka Kunci</>
            ) : (
              <><LockIcon className="h-4 w-4 mr-2" />Kunci</>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleDeleteConfirm(publikasi)} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
            <Trash className="h-4 w-4 mr-2" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Komponen TargetRecipients
  const TargetRecipients = ({ onSelected, initialSelected = [] }: { 
    onSelected: (selected: string[]) => void,
    initialSelected?: string[]
  }) => {
    const [selected, setSelected] = useState<string[]>(initialSelected);

    useEffect(() => {
      onSelected(selected);
    }, [selected, onSelected]);

    const toggleGroup = (id: string) => {
      if (id === "all") {
        if (selected.includes("all")) {
          setSelected([]);
        } else {
          setSelected(["all"]);
        }
        return;
      }

      if (selected.includes("all")) {
        setSelected([id]);
        return;
      }

      if (selected.includes(id)) {
        setSelected(selected.filter(item => item !== id));
      } else {
        setSelected([...selected, id]);
      }
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {TARGET_PENERIMA.map((group) => (
            <div key={group.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`group-${group.id}`} 
                checked={
                  selected.includes(group.id) || 
                  (group.id !== "all" && selected.includes("all"))
                }
                onCheckedChange={() => toggleGroup(group.id)}
                disabled={group.id !== "all" && selected.includes("all")}
              />
              <label
                htmlFor={`group-${group.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {group.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isActions = header.id === "actions";
                    return (
                      <TableHead 
                        key={header.id}
                        className={isActions ? "sticky right-0 bg-white shadow-md w-[50px] text-center" : ""}
                      >
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
                    {row.getVisibleCells().map((cell) => {
                      const isActions = cell.column.id === "actions";
                      return (
                        <TableCell 
                          key={cell.id}
                          className={isActions ? "sticky right-0 bg-white shadow-md" : ""}
                        >
                          {isActions
                            ? renderActionsCell(row.original)
                            : flexRender(cell.column.columnDef.cell, cell.getContext())
                          }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-muted-foreground">Tidak ada data publikasi yang sesuai dengan filter</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.resetColumnFilters()
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
      </div>
      
      {/* Footer pagination - diperbaiki untuk lebih sejajar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} dari{" "}
          {table.getFilteredRowModel().rows.length} publikasi
        </div>
        <div className="flex flex-col md:flex-row items-center md:space-x-6 lg:space-x-8">
          <div className="flex items-center justify-end space-x-2 mb-4 md:mb-0">
            <p className="text-sm font-medium whitespace-nowrap">Baris per halaman</p>
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
          <div className="flex w-full justify-between items-center">
            <div className="flex w-[140px] items-center justify-center text-sm font-medium">
              Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 md:flex"
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
                className="hidden h-8 w-8 p-0 md:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ke halaman terakhir</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Lihat Detail */}
      <Dialog open={viewDetailOpen} onOpenChange={setViewDetailOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <InfoIcon className="h-5 w-5" />
              Detail Publikasi
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang publikasi
            </DialogDescription>
          </DialogHeader>
          
          {selectedPublication && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Judul:</Label>
                <div className="col-span-3 font-medium">{selectedPublication.judul}</div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Kategori:</Label>
                <div className="col-span-3">
                  <Badge className={
                    selectedPublication.kategori === "Penting" ? "bg-red-50 text-red-700 border-red-200" :
                    selectedPublication.kategori === "Segera" ? "bg-orange-50 text-orange-700 border-orange-200" :
                    selectedPublication.kategori === "Rahasia" ? "bg-purple-50 text-purple-700 border-purple-200" :
                    "bg-blue-50 text-blue-700 border-blue-200"
                  }>
                    {selectedPublication.kategori}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Tanggal:</Label>
                <div className="col-span-3">
                  {format(new Date(selectedPublication.tanggal), "dd MMMM yyyy", { locale: localeID })}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Status:</Label>
                <div className="col-span-3">
                  <Badge variant={selectedPublication.status === "aktif" ? "success" : "destructive"}>
                    {selectedPublication.status === "aktif" ? "Aktif" : "Kedaluwarsa"}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Target:</Label>
                <div className="col-span-3 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  {selectedPublication.targetPenerima}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Pembuat:</Label>
                <div className="col-span-3">{selectedPublication.pembuat}</div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right font-medium pt-2">Isi:</Label>
                <div className="col-span-3 rounded-md border p-3 min-h-[100px]">
                  <p className="text-sm">
                    Isi konten dari publikasi akan ditampilkan di sini...
                  </p>
                </div>
              </div>
              
              {selectedPublication.lampiran && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Lampiran:</Label>
                  <div className="col-span-3">
                    <Button variant="outline" size="sm" onClick={() => handleDownload(selectedPublication.id, "Lampiran.pdf")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Lampiran.pdf
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setViewDetailOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal Edit */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Publikasi
            </DialogTitle>
            <DialogDescription>
              Perbarui informasi publikasi ini
            </DialogDescription>
          </DialogHeader>
          
          {selectedPublication && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom Kiri */}
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right font-medium">Judul:</Label>
                  <Input 
                    id="edit-title" 
                    className="col-span-3"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right font-medium">Kategori:</Label>
                  <div className="col-span-3">
                    <Select value={editCategory} onValueChange={setEditCategory}>
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {KATEGORI_PUBLIKASI.map((kategori) => (
                          <SelectItem key={kategori.id} value={kategori.label}>
                            {kategori.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Target Penerima:</Label>
                  <div className="col-span-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          {editTargetRecipients.length === 0 
                            ? "Pilih target penerima" 
                            : editTargetRecipients.includes("all") 
                              ? "Semua Pengguna" 
                              : `${editTargetRecipients.length} grup dipilih`}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Pilih Target Penerima</DialogTitle>
                          <DialogDescription>
                            Pilih grup yang akan menerima notifikasi publikasi ini
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <TargetRecipients 
                            onSelected={setEditTargetRecipients} 
                            initialSelected={editTargetRecipients}
                          />
                        </div>
                        <DialogFooter>
                          <Button>Simpan</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-content" className="text-right font-medium pt-2">Isi:</Label>
                  <Textarea
                    id="edit-content"
                    className="col-span-3 min-h-[150px]"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Batas Waktu:</Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editDeadline ? (
                            format(editDeadline, "PPP", { locale: localeID })
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={editDeadline}
                          onSelect={setEditDeadline}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Lampiran:</Label>
                  <div className="col-span-3">
                    <div className="border-2 border-dashed rounded-lg overflow-hidden">
                      <label className="flex flex-col items-center justify-center w-full h-24 cursor-pointer hover:bg-gray-50">
                        <div className="flex flex-col items-center justify-center pt-4 pb-2">
                          {editAttachment ? (
                            <>
                              <CheckCircle className="w-6 h-6 mb-2 text-green-500" />
                              <p className="text-sm text-gray-500 text-center truncate max-w-full px-4">
                                {editAttachment.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(editAttachment.size / 1024).toFixed(2)} KB
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 mb-2 text-gray-500" />
                              <p className="text-sm text-gray-500">
                                <span className="font-semibold">Klik untuk upload</span>
                              </p>
                              <p className="text-xs text-gray-500">PDF, DOC, XLS, JPG, PNG</p>
                            </>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setEditAttachment(e.target.files[0])
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Notifikasi:</Label>
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="edit-notification"
                        checked={editSendNotification}
                        onCheckedChange={setEditSendNotification}
                      />
                      <Label
                        htmlFor="edit-notification"
                        className="text-sm font-medium leading-none"
                      >
                        Kirim notifikasi
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSaveEdit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog Konfirmasi Hapus */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus publikasi &quot;{selectedPublication?.judul}&quot;? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedPublication && handleDelete(selectedPublication.id, selectedPublication.judul)}
              className="bg-red-500 hover:bg-red-600"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Dialog Konfirmasi Toggle Lock */}
      <AlertDialog open={toggleLockDialogOpen} onOpenChange={setToggleLockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedPublication?.locked ? "Buka Kunci Publikasi" : "Kunci Publikasi"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPublication?.locked ? (
                <>Apakah Anda yakin ingin membuka kunci publikasi &quot;{selectedPublication?.judul}&quot;? Publikasi akan dapat diedit dan dihapus.</>
              ) : (
                <>Apakah Anda yakin ingin mengunci publikasi &quot;{selectedPublication?.judul}&quot;? Publikasi tidak akan dapat diedit atau dihapus sampai dibuka kuncinya.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedPublication && handleToggleLock(selectedPublication.id, selectedPublication.judul, selectedPublication.locked)}
            >
              {selectedPublication?.locked ? "Buka Kunci" : "Kunci"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Konfirmasi Kirim Notifikasi */}
      <AlertDialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Kirim Notifikasi
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengirim notifikasi untuk publikasi &quot;{selectedPublication?.judul}&quot;? 
              Notifikasi akan dikirim ke semua target penerima ({selectedPublication?.targetPenerima}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedPublication && handleSendNotification(selectedPublication.id, selectedPublication.judul)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Kirim Notifikasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 