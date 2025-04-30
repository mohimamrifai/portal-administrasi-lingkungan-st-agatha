"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { FamilyHead } from "../types";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (newData: FamilyHead[]) => void;
  existingDataCount: number;
}

export function ImportDialog({
  open,
  onOpenChange,
  onImportComplete,
  existingDataCount
}: ImportDialogProps) {
  const [importFile, setImportFile] = useState<File | null>(null);

  const processImportFile = () => {
    if (!importFile) {
      toast.error('Silakan pilih file terlebih dahulu');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Ambil worksheet pertama
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Konversi ke JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          toast.error('File tidak berisi data');
          return;
        }
        
        // Simulasi penambahan data
        const newFamilyHeads = jsonData.map((row: any, index) => {
          // Parse tanggal
          let joinDate = new Date();
          try {
            const dateStr = row['Tanggal Bergabung (DD/MM/YYYY)'];
            if (dateStr && typeof dateStr === 'string') {
              const dateParts = dateStr.split('/');
              if (dateParts.length === 3) {
                const day = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]) - 1; // Bulan di JavaScript dimulai dari 0
                const year = parseInt(dateParts[2]);
                
                // Validasi nilai tanggal
                if (!isNaN(day) && !isNaN(month) && !isNaN(year) && 
                  day > 0 && day <= 31 && month >= 0 && month <= 11 && year > 1900) {
                  const tempDate = new Date(year, month, day);
                  // Pastikan tanggal valid (mis. 31 Feb tidak valid)
                  if (tempDate.getDate() === day) {
                    joinDate = tempDate;
                  }
                }
              }
            } else if (dateStr instanceof Date) {
              // Jika dateStr sudah berupa objek Date
              joinDate = dateStr;
            }
          } catch (error) {
            console.error('Format tanggal tidak valid:', error);
            // Gunakan tanggal hari ini jika format tidak valid
          }
          
          // Konversi nilai numerik dengan validasi
          const parseIntSafe = (value: any): number => {
            if (value === undefined || value === null || value === '') return 0;
            const parsed = parseInt(value);
            return isNaN(parsed) ? 0 : parsed;
          };
          
          return {
            id: existingDataCount + index + 1,
            name: row['Nama Kepala Keluarga'] || 'Tidak Ada Nama',
            address: row['Alamat'] || '',
            phoneNumber: row['No. Telepon'] || '',
            joinDate: joinDate,
            childrenCount: parseIntSafe(row['Jumlah Anak Tertanggung']),
            relativesCount: parseIntSafe(row['Jumlah Kerabat Tertanggung']),
            familyMembersCount: Math.max(1, parseIntSafe(row['Jumlah Anggota Keluarga'])),
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
          } as FamilyHead;
        });
        
        onImportComplete(newFamilyHeads);
        toast.success(`${newFamilyHeads.length} data berhasil diimpor`);
        onOpenChange(false);
        setImportFile(null);
        
      } catch (error) {
        console.error('Error processing file:', error);
        let errorMessage = 'Terjadi kesalahan saat memproses file';
        
        // Menampilkan pesan error yang lebih spesifik
        if (error instanceof Error) {
          if (error.message.includes('Invalid time value')) {
            errorMessage = 'File berisi format tanggal yang tidak valid. Pastikan format tanggal adalah DD/MM/YYYY.';
          } else {
            errorMessage = `Error: ${error.message}`;
          }
        }
        
        toast.error(errorMessage);
      }
    };
    
    reader.readAsArrayBuffer(importFile);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw] sm:w-auto">
        <DialogHeader>
          <DialogTitle>Impor Data Kepala Keluarga</DialogTitle>
          <DialogDescription>
            Unggah file Excel yang berisi data kepala keluarga. Pastikan format sesuai dengan template.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="file-upload">Pilih File Excel</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            />
            <p className="text-sm text-muted-foreground">
              Format file: .xlsx atau .xls
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false)
              setImportFile(null)
            }}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button 
            onClick={processImportFile} 
            disabled={!importFile}
            className="w-full sm:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" />
            Impor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 