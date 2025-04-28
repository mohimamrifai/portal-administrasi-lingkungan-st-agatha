"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { JadwalDoling } from "../types"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useEffect, useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Definisi lokal untuk FamilyHead
interface FamilyHead {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  status: "active" | "inactive";
}

interface JadwalDolingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jadwal?: JadwalDoling
  onSubmit: (values: Omit<JadwalDoling, 'id' | 'createdAt' | 'updatedAt'>) => void
}

// Mock data dari Data Umat - dalam aplikasi nyata, ini akan diambil dari API
const mockFamilyHeads: FamilyHead[] = [
  {
    id: 1,
    name: "Budi Santoso",
    address: "Jl. Merdeka No. 123",
    phoneNumber: "081234567890",
    status: "active",
  },
  {
    id: 2,
    name: "Ani Wijaya",
    address: "Jl. Sudirman No. 456",
    phoneNumber: "089876543210",
    status: "active",
  },
  {
    id: 3,
    name: "Hendra Gunawan",
    address: "Jl. Diponegoro No. 789",
    phoneNumber: "081234567891",
    status: "active",
  },
  {
    id: 4,
    name: "Siti Rahayu",
    address: "Jl. Pahlawan No. 101",
    phoneNumber: "081234567892",
    status: "active",
  },
]

export function JadwalDolingFormDialog({
  open,
  onOpenChange,
  jadwal,
  onSubmit,
}: JadwalDolingFormDialogProps) {
  const [selectedFamilyHead, setSelectedFamilyHead] = useState<string>(jadwal?.tuanRumahId?.toString() || "");
  const [alamat, setAlamat] = useState<string>(jadwal?.alamat || "");
  const [tuanRumah, setTuanRumah] = useState<string>(jadwal?.tuanRumah || "");
  const [manualInput, setManualInput] = useState<boolean>(!jadwal?.tuanRumahId || false);
  const [openCombobox, setOpenCombobox] = useState(false);

  // Update alamat when family head is selected
  useEffect(() => {
    if (selectedFamilyHead && !manualInput) {
      const family = mockFamilyHeads.find(f => f.id.toString() === selectedFamilyHead);
      if (family) {
        setAlamat(family.address);
        setTuanRumah(family.name);
      }
    }
  }, [selectedFamilyHead, manualInput]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Get selected family head if not using manual input
    const familyHeadId = manualInput ? undefined : Number(formData.get('tuanRumahId') || selectedFamilyHead);
    
    onSubmit({
      tanggal: new Date(formData.get('tanggal') as string),
      waktu: formData.get('waktu') as string,
      tuanRumahId: familyHeadId,
      tuanRumah: tuanRumah,
      alamat: formData.get('alamat') as string,
      status: formData.get('status') as JadwalDoling['status'],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[600px] w-full mx-auto">
        <DialogHeader>
          <DialogTitle>
            {jadwal ? 'Edit Jadwal Doling' : 'Tambah Jadwal Doling'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input
              id="tanggal"
              name="tanggal"
              type="date"
              defaultValue={jadwal ? format(jadwal.tanggal, 'yyyy-MM-dd') : undefined}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waktu">Waktu</Label>
            <Input
              id="waktu"
              name="waktu"
              type="time"
              defaultValue={jadwal?.waktu}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tuanRumahSelection">Tuan Rumah</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="manualInput" className="text-sm">Input Manual</Label>
                <input 
                  type="checkbox" 
                  id="manualInput"
                  checked={manualInput}
                  onChange={(e) => setManualInput(e.target.checked)}
                />
              </div>
            </div>
            
            {!manualInput ? (
              <div className="relative">
                <input type="hidden" name="tuanRumahId" value={selectedFamilyHead} />
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCombobox}
                      className="w-full justify-between"
                    >
                      {selectedFamilyHead
                        ? mockFamilyHeads.find((head) => head.id.toString() === selectedFamilyHead)?.name
                        : "Pilih Tuan Rumah..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Cari Tuan Rumah..." />
                      <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {mockFamilyHeads
                          .filter(f => f.status === "active")
                          .map((head) => (
                            <CommandItem
                              key={head.id}
                              value={head.name}
                              onSelect={() => {
                                setSelectedFamilyHead(head.id.toString());
                                setOpenCombobox(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedFamilyHead === head.id.toString() ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {head.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="tuanRumah">Nama Tuan Rumah</Label>
                <Input
                  id="tuanRumah"
                  name="tuanRumah"
                  value={tuanRumah}
                  onChange={(e) => setTuanRumah(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Input
              id="alamat"
              name="alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={jadwal?.status}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="terjadwal">Terjadwal</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {jadwal ? 'Simpan Perubahan' : 'Tambah'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 