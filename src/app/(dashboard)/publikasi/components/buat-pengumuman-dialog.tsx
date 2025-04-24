"use client"

import { useState } from "react"
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
  Users,
  Plus
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { KATEGORI_PUBLIKASI, TARGET_PENERIMA } from "../utils/constants"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"

// Komponen pilihan target penerima
const TargetRecipients = ({ onSelected }: { onSelected: (selected: string[]) => void }) => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const groups = TARGET_PENERIMA

  const toggleGroup = (id: string) => {
    setSelectedGroups(prev => {
      // Jika "Semua Pengguna" dipilih, hilangkan semua pilihan lain
      if (id === "all") {
        return prev.includes("all") ? [] : ["all"]
      }
      
      // Jika salah satu grup selain "all" dipilih, hapus "all" dari pilihan
      const withoutAll = prev.filter(g => g !== "all")
      
      if (prev.includes(id)) {
        return withoutAll.filter(g => g !== id)
      } else {
        return [...withoutAll, id]
      }
    })
    
    // Update parent component
    onSelected(selectedGroups)
  }

  return (
    <div className="space-y-2">
      {groups.map(group => (
        <div key={group.id} className="flex items-center space-x-2">
          <Checkbox 
            id={`group-${group.id}`} 
            checked={selectedGroups.includes(group.id)}
            onCheckedChange={() => {
              toggleGroup(group.id)
              onSelected(selectedGroups)
            }}
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
  )
}

export default function BuatPengumumanDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [deadline, setDeadline] = useState<Date>()
  const [content, setContent] = useState("")
  const [attachment, setAttachment] = useState<File | null>(null)
  const [targetRecipients, setTargetRecipients] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!title || !category || !content) {
      toast.error("Silakan lengkapi semua kolom yang diperlukan")
      return
    }

    setIsSubmitting(true)

    // Simulasi pengiriman data
    setTimeout(() => {
      toast.success("Pengumuman berhasil dibuat", {
        description: "Pengumuman akan ditampilkan kepada target penerima"
      })
      
      // Reset form
      setTitle("")
      setCategory("")
      setLocation("")
      setDeadline(undefined)
      setContent("")
      setAttachment(null)
      setTargetRecipients([])
      setIsSubmitting(false)
      setOpen(false)
    }, 1500)
  }

  const resetForm = () => {
    setTitle("")
    setCategory("")
    setLocation("")
    setDeadline(undefined)
    setContent("")
    setAttachment(null)
    setTargetRecipients([])
  }

  // Kategori options untuk dropdown
  const categoryOptions = KATEGORI_PUBLIKASI.map(item => ({
    value: item.id,
    label: item.label
  }))

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Buat Pengumuman
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Buat Pengumuman</DialogTitle>
          <DialogDescription>
            Input informasi pengumuman untuk disebarkan
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Judul
            </Label>
            <Input
              id="title"
              placeholder="Masukkan judul pengumuman"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Kategori
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="col-span-3">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Lokasi
            </Label>
            <Input
              id="location"
              placeholder="Masukkan lokasi kegiatan (opsional)"
              className="col-span-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">
              Batas Waktu
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="deadline"
                  variant={"outline"}
                  className="col-span-3 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? (
                    format(deadline, "dd MMMM yyyy", { locale: localeID })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  locale={localeID}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target" className="text-right">
              Target Penerima
            </Label>
            <div className="col-span-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    {targetRecipients.length === 0 
                      ? "Pilih target penerima" 
                      : targetRecipients.includes("all") 
                        ? "Semua Pengguna" 
                        : `${targetRecipients.length} grup dipilih`}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Pilih Target Penerima</DialogTitle>
                    <DialogDescription>
                      Pilih grup yang akan menerima notifikasi pengumuman ini
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <TargetRecipients onSelected={setTargetRecipients} />
                  </div>
                  <DialogFooter>
                    <Button onClick={() => {}}>Simpan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
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
            <Label htmlFor="content" className="text-right pt-2">
              Isi Pengumuman
            </Label>
            <Textarea
              id="content"
              placeholder="Masukkan isi pengumuman"
              className="col-span-3"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Publikasikan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 