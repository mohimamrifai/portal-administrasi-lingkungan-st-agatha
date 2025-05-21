'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SaldoAwalFormData } from '../types';
import { BanknoteIcon } from "lucide-react";
import { formatCurrency } from '@/lib/utils';

interface SaldoAwalFormDialogProps {
  onSubmit: (data: SaldoAwalFormData) => void;
  currentBalance: number;
}

export function SaldoAwalFormDialog({
  onSubmit,
  currentBalance,
}: SaldoAwalFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [saldoAwal, setSaldoAwal] = useState<number>(currentBalance);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ saldoAwal });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BanknoteIcon className="mr-2 h-4 w-4" />
          Set Saldo Awal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atur Saldo Awal</DialogTitle>
          <DialogDescription>
            Input saldo awal kas IKATA. Nilai saat ini: {formatCurrency(currentBalance)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="saldoAwal">Jumlah Saldo Awal</Label>
            <Input
              id="saldoAwal"
              type="number"
              min={0}
              value={saldoAwal}
              onChange={(e) => setSaldoAwal(Number(e.target.value))}
              placeholder="0"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 