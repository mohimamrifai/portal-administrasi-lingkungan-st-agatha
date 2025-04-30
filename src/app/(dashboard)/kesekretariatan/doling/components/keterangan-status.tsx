"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DetilDoling } from "../types";

interface KeteranganStatusSectionProps {
  keterangan?: string;
  status: DetilDoling['status'];
  onStatusChange: (value: DetilDoling['status']) => void;
}

export function KeteranganStatusSection({
  keterangan,
  status,
  onStatusChange,
}: KeteranganStatusSectionProps) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-md font-medium mb-2">Keterangan & Status</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="keterangan">Keterangan</Label>
          <Textarea
            id="keterangan"
            name="keterangan"
            defaultValue={keterangan || ""}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" value={status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="selesai">Selesai</SelectItem>
              <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 