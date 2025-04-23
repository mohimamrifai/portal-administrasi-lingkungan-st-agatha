import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UbahPassword() {
  return (
    <div className="space-y-6 max-w-md">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Password Lama</Label>
          <Input type="password" placeholder="Masukkan password lama" />
        </div>
        <div className="space-y-2">
          <Label>Password Baru</Label>
          <Input type="password" placeholder="Masukkan password baru" />
        </div>
        <div className="space-y-2">
          <Label>Konfirmasi Password Baru</Label>
          <Input type="password" placeholder="Konfirmasi password baru" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button>Simpan Password</Button>
      </div>
    </div>
  )
} 