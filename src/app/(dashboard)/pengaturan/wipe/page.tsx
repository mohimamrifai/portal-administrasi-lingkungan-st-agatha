"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function WipeDataPage() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [dataType, setDataType] = useState<string>("")
  const [confirmText, setConfirmText] = useState("")

  const handleWipeData = () => {
    // Here you would implement the actual data wiping functionality
    // For now, we'll just show a toast notification
    toast.success("Data berhasil dihapus")
    setStartDate(undefined)
    setEndDate(undefined)
    setDataType("")
    setConfirmText("")
  }

  const isFormValid = startDate && endDate && dataType && confirmText === "KONFIRMASI"

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Wipe Data</CardTitle>
          <CardDescription>
            Hapus data berdasarkan rentang waktu dan jenis data. Peringatan: Tindakan ini tidak dapat dibatalkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <Trash2 className="h-4 w-4" />
            <AlertTitle>Peringatan!</AlertTitle>
            <AlertDescription>
              Menghapus data akan menghilangkan informasi secara permanen dari sistem. 
              Pastikan Anda telah membuat backup jika diperlukan.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Tanggal Mulai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-date">Tanggal Akhir</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data-type">Jenis Data</Label>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger id="data-type">
                  <SelectValue placeholder="Pilih jenis data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publikasi">Publikasi</SelectItem>
                  <SelectItem value="kas_lingkungan">Kas Lingkungan</SelectItem>
                  <SelectItem value="dana_mandiri">Dana Mandiri</SelectItem>
                  <SelectItem value="kas_ikata">Kas IKATA</SelectItem>
                  <SelectItem value="doling">Doa Lingkungan</SelectItem>
                  <SelectItem value="agenda">Agenda</SelectItem>
                  <SelectItem value="semua">Semua Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm">Ketik "KONFIRMASI" untuk melanjutkan</Label>
              <Input 
                id="confirm" 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="max-w-xs"
              />
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="mt-4"
                  disabled={!isFormValid}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus permanen {dataType === "semua" ? "semua data" : `data ${dataType}`} 
                    dari {startDate ? format(startDate, "dd MMMM yyyy") : "..."} 
                    hingga {endDate ? format(endDate, "dd MMMM yyyy") : "..."}.
                    Data yang sudah dihapus tidak dapat dikembalikan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleWipeData}>
                    Ya, Hapus Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 