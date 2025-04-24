"use client"

import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface EmergencyWipeTabProps {
  confirmText: string
  setConfirmText: (text: string) => void
  backupConfirm: boolean
  setBackupConfirm: (confirm: boolean) => void
}

export default function EmergencyWipeTab({
  confirmText,
  setConfirmText,
  backupConfirm,
  setBackupConfirm
}: EmergencyWipeTabProps) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Emergency Wipe!</AlertTitle>
        <AlertDescription>
          Fitur ini akan menghapus SEMUA DATA tanpa memandang jenis atau periode waktu. Hanya digunakan untuk situasi darurat.
        </AlertDescription>
      </Alert>
      
      <div className="p-4 border border-red-500 rounded-md mt-4">
        <h3 className="text-lg font-bold text-red-600 mb-2">Peringatan Penting!</h3>
        <p className="text-sm text-red-600">
          Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Semua data yang dihapus tidak dapat dikembalikan.
          Pastikan Anda telah membuat backup dari seluruh database sistem sebelum melanjutkan.
        </p>
      </div>
      
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox 
          id="emergency-backup-confirm"
          checked={backupConfirm}
          onCheckedChange={(checked) => setBackupConfirm(checked === true)}
        />
        <Label htmlFor="emergency-backup-confirm" className="text-sm font-medium">
          Saya TELAH membuat backup lengkap dari seluruh database sebelum melanjutkan
        </Label>
      </div>
      
      <div className="space-y-2 mt-4">
        <Label htmlFor="emergency-confirm">Ketik "EMERGENCY WIPE" untuk melanjutkan</Label>
        <Input 
          id="emergency-confirm" 
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="max-w-xs bg-red-50"
        />
      </div>
    </div>
  )
} 