"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FamilyHead } from "../types";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  familyHead: FamilyHead | null;
  onConfirm: (id: number, reason: "moved" | "deceased", memberName?: string) => Promise<void>;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  familyHead,
  onConfirm
}: DeleteConfirmationDialogProps) {
  const [deleteReason, setDeleteReason] = useState<"moved" | "deceased">("moved");
  const [deceasedMemberName, setDeceasedMemberName] = useState("");

  const handleConfirm = async () => {
    if (!familyHead) return;
    
    await onConfirm(
      familyHead.id, 
      deleteReason, 
      deleteReason === "deceased" ? deceasedMemberName : undefined
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw] sm:w-auto">
        <DialogHeader>
          <DialogTitle>Hapus Data Kepala Keluarga</DialogTitle>
          <DialogDescription>
            Pilih alasan untuk menghapus data kepala keluarga ini
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delete-reason">Alasan</Label>
            <Select 
              value={deleteReason} 
              onValueChange={(value: "moved" | "deceased") => setDeleteReason(value)}
            >
              <SelectTrigger id="delete-reason">
                <SelectValue placeholder="Pilih alasan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moved">Pindah</SelectItem>
                <SelectItem value="deceased">Meninggal</SelectItem>
              </SelectContent>
            </Select>

            {deleteReason === "moved" && (
              <p className="text-sm text-muted-foreground mt-2">
                Memilih alasan "Pindah" akan mengubah status kepala keluarga menjadi "Pindah" dan menjadwalkan penghapusan data dalam 1 tahun 1 bulan.
              </p>
            )}
          </div>

          {deleteReason === "deceased" && (
            <div className="space-y-2">
              <Label htmlFor="deceased-member">Anggota Keluarga yang Meninggal</Label>
              <Input
                id="deceased-member"
                placeholder="Nama anggota keluarga yang meninggal"
                value={deceasedMemberName}
                onChange={(e) => setDeceasedMemberName(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Informasi ini akan digunakan untuk memperbarui status anggota keluarga yang meninggal.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={deleteReason === "deceased" && deceasedMemberName.trim() === ""}
            className="w-full sm:w-auto"
          >
            Konfirmasi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 