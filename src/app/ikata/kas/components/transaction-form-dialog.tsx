'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransactionFormData } from '../types';

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => void;
}

export function TransactionFormDialog({ open, onOpenChange, onSubmit }: TransactionFormDialogProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: '',
    jumlah: 0,
    jenis: 'iuran',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Transaksi</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Jenis Transaksi</label>
            <Select
              value={formData.jenis}
              onValueChange={(value) => setFormData({ ...formData, jenis: value as TransactionFormData['jenis'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis transaksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iuran">Iuran Anggota</SelectItem>
                <SelectItem value="sumbangan">Sumbangan Anggota</SelectItem>
                <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <Input
              type="date"
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Jumlah</label>
            <Input
              type="number"
              value={formData.jumlah}
              onChange={(e) => setFormData({ ...formData, jumlah: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Keterangan</label>
            <Input
              type="text"
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 