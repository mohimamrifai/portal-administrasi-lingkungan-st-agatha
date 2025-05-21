"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { DetilDoling } from "../types";

interface KeteranganStatusSectionProps {
  keterangan: string;
  status: string;
  onKeteranganChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function KeteranganStatusSection({ 
  keterangan, 
  status, 
  onKeteranganChange, 
  onStatusChange 
}: KeteranganStatusSectionProps) {
  return (
    <div className="space-y-4 p-4 pt-2 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Status Kegiatan</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Keterangan */}
        <div className="space-y-2">
          <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
          <Textarea
            id="keterangan"
            placeholder="Masukkan keterangan tambahan..."
            value={keterangan}
            onChange={(e) => onKeteranganChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        {/* Status Kegiatan */}
        <div className="space-y-2">
          <Label>Status Kegiatan</Label>
          <RadioGroup 
            value={status} 
            onValueChange={onStatusChange}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="selesai" id="status-selesai" />
              <Label 
                htmlFor="status-selesai" 
                className="text-green-700 font-medium cursor-pointer"
              >
                Selesai (Disetujui)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dibatalkan" id="status-dibatalkan" />
              <Label 
                htmlFor="status-dibatalkan" 
                className="text-red-700 font-medium cursor-pointer"
              >
                Dibatalkan (Ditolak)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="menunggu" id="status-menunggu" />
              <Label 
                htmlFor="status-menunggu" 
                className="text-blue-700 font-medium cursor-pointer"
              >
                Menunggu Persetujuan
              </Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground mt-2">
            Status akan mengubah approval kegiatan ini.
          </p>
        </div>
      </div>
    </div>
  )
} 