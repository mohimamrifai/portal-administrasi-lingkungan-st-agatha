import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

export default function BuatPublikasi() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Judul</Label>
            <Input placeholder="Masukkan judul pengumuman" />
          </div>
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="penting">Penting</SelectItem>
                <SelectItem value="umum">Umum</SelectItem>
                <SelectItem value="rahasia">Rahasia</SelectItem>
                <SelectItem value="segera">Segera</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Target Penerima</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih target penerima" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Umat</SelectItem>
                <SelectItem value="pengurus">Pengurus</SelectItem>
                <SelectItem value="khusus">Khusus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Batas Waktu</Label>
            <Input type="datetime-local" />
          </div>
          <div className="space-y-2">
            <Label>Lampiran</Label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, XLS, JPG, PNG</p>
                </div>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label>Isi Pengumuman</Label>
        <Textarea placeholder="Masukkan isi pengumuman" className="min-h-[200px]" />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button>Publikasikan</Button>
      </div>
    </div>
  )
} 