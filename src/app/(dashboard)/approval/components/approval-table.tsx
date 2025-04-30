"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ApprovalItem } from "../types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  MessageCircleIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreVertical,
  CheckIcon,
  XIcon,
  RotateCcwIcon,
  AlertCircleIcon,
  PencilIcon
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface ApprovalTableProps {
  items: ApprovalItem[]
  onApprove: (item: ApprovalItem) => void
  onReject: (item: ApprovalItem) => void
}

export function ApprovalTable({ items, onApprove, onReject }: ApprovalTableProps) {
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'reset' | 'approve' | 'reject' | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editValues, setEditValues] = useState({
    kolekte1: 0,
    kolekte2: 0,
    ucapanSyukur: 0,
    keterangan: ""
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Calculate pagination values
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  // Get current page data
  const currentItems = items.slice(startIndex, endIndex);
  
  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);
  
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

  const viewMessage = (item: ApprovalItem) => {
    setSelectedItem(item);
    setMessageDialogOpen(true);
  };

  const handleResetStatus = (item: ApprovalItem) => {
    setSelectedItem(item);
    setActionType('reset');
    setConfirmationDialogOpen(true);
  };

  const handleChangeStatus = (item: ApprovalItem, newStatus: 'approve' | 'reject') => {
    setSelectedItem(item);
    setActionType(newStatus);
    setConfirmationDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedItem || !actionType) return;
    
    if (actionType === 'reset') {
      // Reset ke status pending
      // Implementasi akan ditambahkan sesuai kebutuhan
      console.log('Reset status', selectedItem);
    } else if (actionType === 'approve') {
      onApprove(selectedItem);
    } else if (actionType === 'reject') {
      onReject(selectedItem);
    }
    
    setConfirmationDialogOpen(false);
  };

  // Fungsi untuk membuka dialog edit
  const handleEditNominal = (item: ApprovalItem) => {
    setSelectedItem(item);
    setEditValues({
      kolekte1: item.kolekte1,
      kolekte2: item.kolekte2,
      ucapanSyukur: item.ucapanSyukur,
      keterangan: item.keterangan || ""
    });
    setEditDialogOpen(true);
  };

  // Fungsi untuk menyimpan hasil edit
  const handleSaveEdit = () => {
    if (!selectedItem) return;
    // Update data pada items (harus di-lift ke parent jika ingin persist)
    selectedItem.kolekte1 = editValues.kolekte1;
    selectedItem.kolekte2 = editValues.kolekte2;
    selectedItem.ucapanSyukur = editValues.ucapanSyukur;
    selectedItem.keterangan = editValues.keterangan;
    setEditDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border relative overflow-x-auto max-w-[1020px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Kolekte I</TableHead>
              <TableHead>Kolekte II</TableHead>
              <TableHead>Ucapan Syukur</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead>Jumlah Hadir</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pesan</TableHead>
              <TableHead className="sticky right-0 bg-white z-20 shadow-lg text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{format(item.tanggal, "dd/MM/yyyy", { locale: id })}</TableCell>
                  <TableCell>Rp {item.kolekte1.toLocaleString('id-ID')}</TableCell>
                  <TableCell>Rp {item.kolekte2.toLocaleString('id-ID')}</TableCell>
                  <TableCell>Rp {item.ucapanSyukur.toLocaleString('id-ID')}</TableCell>
                  <TableCell>{item.keterangan || '-'}</TableCell>
                  <TableCell>{item.jumlahHadir} orang</TableCell>
                  <TableCell>Rp {(item.kolekte1 + item.kolekte2 + item.ucapanSyukur).toLocaleString('id-ID')}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'destructive' : 'outline'}
                      className={
                        item.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                          : item.status === 'approved'
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                      }
                    >
                      {item.status === 'pending'
                        ? 'Menunggu'
                        : item.status === 'approved'
                        ? 'Disetujui'
                        : 'Diedit'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.message || item.reason ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => viewMessage(item)}
                            >
                              <MessageCircleIcon className="h-4 w-4 text-blue-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Lihat pesan</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="sticky right-0 bg-white z-20 shadow-lg text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {item.status === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => onApprove(item)}>
                              <CheckIcon className="mr-2 h-4 w-4 text-green-600" />
                              <span>Setujui</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditNominal(item)}>
                              <PencilIcon className="mr-2 h-4 w-4 text-blue-600" />
                              <span>Edit Nominal</span>
                            </DropdownMenuItem>
                          </>
                        )}

                        {item.status === 'approved' && (
                          <>
                            <DropdownMenuItem onClick={() => handleResetStatus(item)}>
                              <RotateCcwIcon className="mr-2 h-4 w-4 text-amber-600" />
                              <span>Batalkan Persetujuan</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleChangeStatus(item, 'reject')}>
                              <XIcon className="mr-2 h-4 w-4 text-red-600" />
                              <span>Ubah Jadi Diedit</span>
                            </DropdownMenuItem>
                          </>
                        )}

                        {item.status === 'rejected' && (
                          <>
                            <DropdownMenuItem onClick={() => handleResetStatus(item)}>
                              <RotateCcwIcon className="mr-2 h-4 w-4 text-amber-600" />
                              <span>Batalkan Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleChangeStatus(item, 'approve')}>
                              <CheckIcon className="mr-2 h-4 w-4 text-green-600" />
                              <span>Ubah Jadi Disetujui</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            Menampilkan {startIndex + 1}-{endIndex} dari {totalItems} item
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[130px] h-9">
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
                className="h-9 w-9"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
              >
                <ChevronsLeftIcon className="h-4 w-4" />
                <span className="sr-only">Halaman pertama</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
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
                className="h-9 w-9"
                onClick={goToNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRightIcon className="h-4 w-4" />
                <span className="sr-only">Halaman berikutnya</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={goToLastPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronsRightIcon className="h-4 w-4" />
                <span className="sr-only">Halaman terakhir</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pesan</DialogTitle>
            <DialogDescription>
              {selectedItem?.status === 'rejected' ? 'Alasan edit:' : 'Catatan:'}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-md bg-gray-50">
            <p>{selectedItem?.status === 'rejected' && selectedItem?.reason 
              ? selectedItem.reason 
              : selectedItem?.message || 'Tidak ada pesan.'}</p>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setMessageDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationDialogOpen} onOpenChange={setConfirmationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
            <DialogDescription>
              {actionType === 'reset'
                ? 'Apakah Anda yakin ingin membatalkan status persetujuan ini?'
                : actionType === 'approve'
                ? 'Apakah Anda yakin ingin mengubah status menjadi disetujui?'
                : 'Apakah Anda yakin ingin mengubah status menjadi diedit?'}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-md bg-amber-50 flex items-start space-x-2">
            <AlertCircleIcon className="h-5 w-5 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-800">
              {actionType === 'reset'
                ? 'Tindakan ini akan mengembalikan status persetujuan menjadi "Menunggu".'
                : 'Tindakan ini akan mengubah status persetujuan saat ini.'}
            </p>
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setConfirmationDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              variant={actionType === 'reject' ? 'destructive' : 'default'} 
              onClick={confirmAction}
            >
              Ya, Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Nominal Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Nominal Kolekte</DialogTitle>
            <DialogDescription>
              Ubah nominal kolekte dan keterangan sesuai kebutuhan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Kolekte I</label>
              <Input
                type="number"
                value={editValues.kolekte1}
                onChange={e => setEditValues({ ...editValues, kolekte1: Number(e.target.value) })}
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kolekte II</label>
              <Input
                type="number"
                value={editValues.kolekte2}
                onChange={e => setEditValues({ ...editValues, kolekte2: Number(e.target.value) })}
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ucapan Syukur</label>
              <Input
                type="number"
                value={editValues.ucapanSyukur}
                onChange={e => setEditValues({ ...editValues, ucapanSyukur: Number(e.target.value) })}
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Keterangan</label>
              <Input
                type="text"
                value={editValues.keterangan}
                onChange={e => setEditValues({ ...editValues, keterangan: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveEdit}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 