'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { TransactionFormData } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// Mock data untuk anggota IKATA
const mockAnggotaIKATA = [
  { id: '1', nama: 'John Doe', status: 'aktif' },
  { id: '2', nama: 'Jane Smith', status: 'aktif' },
  { id: '3', nama: 'Bob Johnson', status: 'aktif' },
];

const transactionFormSchema = z.object({
  tanggal: z.date({
    required_error: 'Tanggal wajib diisi',
  }),
  keterangan: z.string().min(3, {
    message: 'Keterangan minimal 3 karakter',
  }),
  jumlah: z.coerce.number().positive({
    message: 'Jumlah harus lebih dari 0',
  }),
  jenis: z.enum(['iuran', 'sumbangan', 'pengeluaran'], {
    required_error: 'Jenis transaksi wajib dipilih',
  }),
  anggotaId: z.string().optional(),
  periodeIuran: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => void;
}

export function TransactionFormDialog({ open, onOpenChange, onSubmit }: TransactionFormDialogProps) {
  const [showAnggotaFields, setShowAnggotaFields] = useState(false);
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      tanggal: new Date(),
      keterangan: '',
      jumlah: 0,
      jenis: 'iuran',
      anggotaId: undefined,
      periodeIuran: undefined,
    },
  });

  const selectedJenis = form.watch('jenis');

  useEffect(() => {
    setShowAnggotaFields(selectedJenis === 'iuran' || selectedJenis === 'sumbangan');
  }, [selectedJenis]);

  const handleSubmit = async (values: TransactionFormValues) => {
    try {
      // Simulasi pengiriman notifikasi
      if (values.jenis === 'iuran' || values.jenis === 'sumbangan') {
        toast.success("Notifikasi Terkirim", {
          description: `Notifikasi telah dikirim ke semua anggota IKATA untuk transaksi ${values.jenis}`,
        });
      }

      onSubmit({
        tanggal: format(values.tanggal, 'yyyy-MM-dd'),
        keterangan: values.keterangan,
        jumlah: values.jumlah,
        jenis: values.jenis,
        anggotaId: values.anggotaId,
        periodeIuran: values.periodeIuran,
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Error", {
        description: "Terjadi kesalahan saat menyimpan transaksi",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[600px] w-full mx-auto">
        <DialogHeader>
          <DialogTitle>Tambah Transaksi</DialogTitle>
          <DialogDescription>
            Isi formulir di bawah untuk menambahkan transaksi kas IKATA.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="jenis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Transaksi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis transaksi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="iuran">Iuran Anggota</SelectItem>
                      <SelectItem value="sumbangan">Sumbangan Anggota</SelectItem>
                      <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showAnggotaFields && (
              <>
                <FormField
                  control={form.control}
                  name="anggotaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anggota IKATA</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih anggota" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockAnggotaIKATA.map((anggota) => (
                            <SelectItem key={anggota.id} value={anggota.id}>
                              {anggota.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedJenis === 'iuran' && (
                  <FormField
                    control={form.control}
                    name="periodeIuran"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Periode Iuran</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih periode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2024-01">Januari 2024</SelectItem>
                            <SelectItem value="2024-02">Februari 2024</SelectItem>
                            <SelectItem value="2024-03">Maret 2024</SelectItem>
                            <SelectItem value="2024-04">April 2024</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            <FormField
              control={form.control}
              name="tanggal"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: id })
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        locale={id}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jumlah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah (Rp)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Keterangan transaksi" 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 