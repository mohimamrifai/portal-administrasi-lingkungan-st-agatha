import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Profil() {
  return (
    <div className="space-y-6">
      {/* Data Kepala Keluarga */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Data Kepala Keluarga</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input placeholder="Masukkan nama lengkap" />
          </div>
          <div className="space-y-2">
            <Label>NIK</Label>
            <Input placeholder="Masukkan NIK" />
          </div>
          <div className="space-y-2">
            <Label>Tempat Lahir</Label>
            <Input placeholder="Masukkan tempat lahir" />
          </div>
          <div className="space-y-2">
            <Label>Tanggal Lahir</Label>
            <Input type="date" />
          </div>
          <div className="space-y-2">
            <Label>No. Telepon</Label>
            <Input placeholder="Masukkan nomor telepon" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Masukkan email" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Alamat</Label>
            <Textarea placeholder="Masukkan alamat lengkap" />
          </div>
        </div>
      </div>

      {/* Data Pasangan */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Data Pasangan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nama Pasangan</Label>
            <Input placeholder="Masukkan nama pasangan" />
          </div>
          <div className="space-y-2">
            <Label>NIK Pasangan</Label>
            <Input placeholder="Masukkan NIK pasangan" />
          </div>
          <div className="space-y-2">
            <Label>Tempat Lahir Pasangan</Label>
            <Input placeholder="Masukkan tempat lahir pasangan" />
          </div>
          <div className="space-y-2">
            <Label>Tanggal Lahir Pasangan</Label>
            <Input type="date" />
          </div>
        </div>
      </div>

      {/* Data Tanggungan */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Data Tanggungan</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Tanggungan</Label>
              <Input placeholder="Masukkan nama tanggungan" />
            </div>
            <div className="space-y-2">
              <Label>Hubungan</Label>
              <Input placeholder="Masukkan hubungan" />
            </div>
          </div>
          <Button variant="outline">Tambah Tanggungan</Button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button>Simpan Perubahan</Button>
      </div>
    </div>
  )
} 