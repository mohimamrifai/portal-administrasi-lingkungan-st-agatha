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
  Plus,
  Eye
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { KATEGORI_PUBLIKASI, TARGET_PENERIMA } from "../utils/constants"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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

export default function BuatPublikasiDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")
  const [deadline, setDeadline] = useState<Date>()
  const [attachment, setAttachment] = useState<File | null>(null)
  const [targetRecipients, setTargetRecipients] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewDialog, setPreviewDialog] = useState(false)

  // Kategori options untuk dropdown
  const categoryOptions = KATEGORI_PUBLIKASI.map(item => ({
    value: item.id,
    label: item.label
  }))

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

    if (targetRecipients.length === 0) {
      toast.error("Pilih minimal satu target penerima")
      return
    }

    setIsSubmitting(true)

    // Simulasi pengiriman data
    setTimeout(() => {
      toast.success("Publikasi berhasil dibuat", {
        description: "Publikasi akan ditampilkan kepada target penerima"
      })
      
      // Reset form
      resetForm()
      setIsSubmitting(false)
      setOpen(false)
    }, 1500)
  }

  const resetForm = () => {
    setTitle("")
    setCategory("")
    setDeadline(undefined)
    setContent("")
    setAttachment(null)
    setTargetRecipients([])
  }

  const handlePreview = () => {
    if (!title || !category || !content) {
      toast.error("Silakan lengkapi semua kolom yang diperlukan")
      return
    }
    setPreviewDialog(true)
  }

  // Mendapatkan warna dan label kategori yang dipilih
  const selectedCategory = KATEGORI_PUBLIKASI.find(item => item.id === category)

  return (
    <>
      <Dialog open={open} onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetForm()
      }}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat Publikasi
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Buat Publikasi</DialogTitle>
            <DialogDescription>
              Input informasi publikasi untuk disebarkan
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Judul
              </Label>
              <Input
                id="title"
                placeholder="Masukkan judul publikasi"
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
                        Pilih grup yang akan menerima notifikasi publikasi ini
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
                Isi Publikasi
              </Label>
              <Textarea
                id="content"
                placeholder="Masukkan isi publikasi"
                className="col-span-3"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="space-x-2 flex">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="button" variant="outline" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Publikasikan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Preview Publikasi</DialogTitle>
            <DialogDescription>
              Pratinjau publikasi sebelum dipublikasikan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatar-admin.png" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Admin Lingkungan</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                {selectedCategory && (
                  <Badge 
                    style={{ backgroundColor: selectedCategory.color === 'red' ? '#ef4444' : 
                                            selectedCategory.color === 'orange' ? '#f97316' :
                                            selectedCategory.color === 'purple' ? '#a855f7' : '#3b82f6' }}
                    className="text-white"
                  >
                    {selectedCategory.label}
                  </Badge>
                )}
              </div>
              <h2 className="text-xl font-semibold">{title || "Judul Publikasi"}</h2>
              <div className="whitespace-pre-wrap text-sm">
                {content || "Isi publikasi akan ditampilkan di sini..."}
              </div>
              {deadline && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  <span>Batas waktu: {format(deadline, "dd MMMM yyyy", { locale: localeID })}</span>
                </div>
              )}
              {attachment && (
                <div className="border rounded-md p-2 flex items-center space-x-2">
                  <div className="bg-primary/10 p-2 rounded">
                    <Upload className="h-4 w-4 text-primary" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(attachment.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              <span>Target: {targetRecipients.includes("all") 
                ? "Semua Pengguna" 
                : targetRecipients.map(id => 
                    TARGET_PENERIMA.find(item => item.id === id)?.label
                  ).filter(Boolean).join(", ")}</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setPreviewDialog(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 