"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { 
  CalendarIcon, 
  CheckCircle, 
  Upload,
  FileText,
  Plus
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { JENIS_LAPORAN } from "../utils/constants"
import { toast } from "sonner"
import { Publikasi } from "../types/publikasi"

interface FormValues {
  title: string;
  type: string;
  date?: Date;
  description?: string;
  attachment?: File | null;
  publikasiId?: string;
}

interface BuatLaporanDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  publikasi?: Publikasi;
  onSubmit?: (values: FormValues) => void;
}

export default function BuatLaporanDialog({
  open = false,
  onOpenChange,
  publikasi,
  onSubmit
}: BuatLaporanDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(open);
  const [title, setTitle] = useState("")
  const [type, setType] = useState("")
  const [date, setDate] = useState<Date>()
  const [description, setDescription] = useState("")
  const [attachment, setAttachment] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync internal open state with props
  useEffect(() => {
    setDialogOpen(open);
  }, [open]);

  // Initialize form with publikasi data if available
  useEffect(() => {
    if (publikasi) {
      setTitle(`Laporan: ${publikasi.judul}`);
      setDate(new Date(publikasi.tanggal));
      setDescription(`Laporan untuk publikasi: ${publikasi.judul}`);
    }
  }, [publikasi]);

  const handleOpenChange = (newOpen: boolean) => {
    setDialogOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
    if (!newOpen) resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!title || !type) {
      toast.error("Silakan lengkapi semua kolom yang diperlukan")
      return
    }

    setIsSubmitting(true)

    // Prepare form values
    const formValues = {
      title,
      type,
      date,
      description,
      attachment,
      publikasiId: publikasi?.id
    };

    // Call the external onSubmit handler if provided
    if (onSubmit) {
      onSubmit(formValues);
    } else {
      // Fallback behavior if no onSubmit provided
      setTimeout(() => {
        toast.success("Laporan berhasil disimpan", {
          description: "Laporan telah berhasil ditambahkan ke sistem"
        });
        
        resetForm();
        setIsSubmitting(false);
        handleOpenChange(false);
      }, 1500);
    }
  }

  const resetForm = () => {
    setTitle("")
    setType("")
    setDate(undefined)
    setDescription("")
    setAttachment(null)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {!onOpenChange && !publikasi && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat Laporan
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[525px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Laporan</DialogTitle>
          <DialogDescription>
            Input data laporan untuk disimpan dalam sistem
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Judul
            </Label>
            <Input
              id="title"
              placeholder="Masukkan judul laporan"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Jenis Laporan
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type" className="col-span-3">
                <SelectValue placeholder="Pilih jenis laporan" />
              </SelectTrigger>
              <SelectContent>
                {JENIS_LAPORAN.map((jenis) => (
                  <SelectItem key={jenis.id} value={jenis.id}>
                    {jenis.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Tanggal
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className="col-span-3 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "dd MMMM yyyy", { locale: localeID })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={localeID}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="attachment" className="text-right">
              Lampiran
            </Label>
            <div className="col-span-3">
              <div className="border rounded-md overflow-hidden">
                <label className="flex items-center justify-center w-full h-20 cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center">
                    {attachment ? (
                      <>
                        <CheckCircle className="w-6 h-6 mb-1 text-green-500" />
                        <p className="text-sm text-gray-500 text-center truncate max-w-full px-4">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(attachment.size / 1024).toFixed(2)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mb-1 text-gray-500" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Upload file</span>
                        </p>
                      </>
                    )}
                  </div>
                  <input 
                    id="attachment"
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" 
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Keterangan
            </Label>
            <Textarea
              id="description"
              placeholder="Masukkan detail atau keterangan tambahan tentang laporan"
              className="col-span-3"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Laporan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 