'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { 
  IKATATransaction, 
  TransactionFormData, 
  JenisTransaksi, 
  TipeTransaksi, 
  TipeTransaksiMasuk, 
  TipeTransaksiKeluar,
  StatusPembayaran
} from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

// Mock data untuk anggota IKATA
const mockAnggotaIKATA = [
  { id: '1', nama: 'Keluarga John Doe', status: 'aktif' },
  { id: '2', nama: 'Keluarga Jane Smith', status: 'aktif' },
  { id: '3', nama: 'Keluarga Bob Johnson', status: 'aktif' },
  { id: '4', nama: 'Keluarga Alice Williams', status: 'aktif' },
  { id: '5', nama: 'Keluarga David Miller', status: 'aktif' },
  { id: '6', nama: 'Keluarga Susan Brown', status: 'aktif' },
  { id: '7', nama: 'Keluarga Michael Davis', status: 'aktif' },
  { id: '8', nama: 'Keluarga Sarah Wilson', status: 'aktif' },
  { id: '9', nama: 'Keluarga Thomas Moore', status: 'aktif' },
  { id: '10', nama: 'Keluarga Jennifer Taylor', status: 'aktif' },
];

// Periode bulan untuk pembayaran
const periodeBulanOptions = [
  { value: '2024-01', label: 'Januari 2024' },
  { value: '2024-02', label: 'Februari 2024' },
  { value: '2024-03', label: 'Maret 2024' },
  { value: '2024-04', label: 'April 2024' },
  { value: '2024-05', label: 'Mei 2024' },
  { value: '2024-06', label: 'Juni 2024' },
  { value: '2024-07', label: 'Juli 2024' },
  { value: '2024-08', label: 'Agustus 2024' },
  { value: '2024-09', label: 'September 2024' },
  { value: '2024-10', label: 'Oktober 2024' },
  { value: '2024-11', label: 'November 2024' },
  { value: '2024-12', label: 'Desember 2024' },
];

const transactionFormSchema = z.object({
  tanggal: z.date({
    required_error: 'Tanggal wajib diisi',
  }),
  jenis: z.enum(['uang_masuk', 'uang_keluar'], {
    required_error: 'Jenis transaksi wajib dipilih',
  }),
  tipeTransaksi: z.string({
    required_error: 'Tipe transaksi wajib dipilih',
  }),
  keterangan: z.string().min(3, {
    message: 'Keterangan minimal 3 karakter',
  }),
  jumlah: z.coerce.number().positive({
    message: 'Jumlah harus lebih dari 0',
  }),
  anggotaId: z.string().optional(),
  statusPembayaran: z.enum(['lunas', 'sebagian_bulan', 'belum_ada_pembayaran']).optional(),
  periodeBayar: z.array(z.string()).optional(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => void;
  editTransaction?: IKATATransaction | null;
}

export function TransactionFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  editTransaction 
}: TransactionFormDialogProps) {
  const [showAnggotaFields, setShowAnggotaFields] = useState(false);
  const [showStatusPembayaran, setShowStatusPembayaran] = useState(false);
  const [showPeriodeBayar, setShowPeriodeBayar] = useState(false);
  const isEditing = !!editTransaction;
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      tanggal: new Date(),
      jenis: 'uang_masuk',
      tipeTransaksi: '',
      keterangan: '',
      jumlah: 0,
      anggotaId: undefined,
      statusPembayaran: undefined,
      periodeBayar: [],
    },
  });

  // Reset form ketika dialog dibuka atau editTransaction berubah
  useEffect(() => {
    if (open) {
      if (editTransaction) {
        // Isi form dengan data transaksi yang akan diedit
        form.reset({
          tanggal: new Date(editTransaction.tanggal),
          jenis: editTransaction.jenis,
          tipeTransaksi: editTransaction.tipeTransaksi,
          keterangan: editTransaction.keterangan,
          jumlah: editTransaction.jumlah,
          anggotaId: editTransaction.anggotaId,
          statusPembayaran: editTransaction.statusPembayaran,
          periodeBayar: editTransaction.periodeBayar || [],
        });
      } else {
        // Reset form untuk transaksi baru
        form.reset({
          tanggal: new Date(),
          jenis: 'uang_masuk',
          tipeTransaksi: '',
          keterangan: '',
          jumlah: 0,
          anggotaId: undefined,
          statusPembayaran: undefined,
          periodeBayar: [],
        });
      }
    }
  }, [open, editTransaction, form]);

  const watchJenis = form.watch('jenis');
  const watchTipeTransaksi = form.watch('tipeTransaksi');
  const watchStatusPembayaran = form.watch('statusPembayaran');

  // Mendapatkan opsi tipe transaksi berdasarkan jenis transaksi yang dipilih
  const tipeTransaksiOptions = useMemo(() => {
    if (watchJenis === 'uang_masuk') {
      return [
        { value: 'iuran_anggota', label: 'Iuran Anggota' },
        { value: 'transfer_dana_lingkungan', label: 'Transfer Dana dari Lingkungan' },
        { value: 'sumbangan_anggota', label: 'Sumbangan Anggota' },
        { value: 'penerimaan_lain', label: 'Penerimaan Lain-Lain' },
      ];
    } else {
      return [
        { value: 'uang_duka', label: 'Uang Duka / Papan Bunga' },
        { value: 'kunjungan_kasih', label: 'Kunjungan Kasih' },
        { value: 'cinderamata_kelahiran', label: 'Cinderamata Kelahiran' },
        { value: 'cinderamata_pernikahan', label: 'Cinderamata Pernikahan' },
        { value: 'uang_akomodasi', label: 'Uang Akomodasi' },
        { value: 'pembelian', label: 'Pembelian' },
        { value: 'lain_lain', label: 'Lain-Lain' },
      ];
    }
  }, [watchJenis]);

  // Update field saat jenis transaksi berubah
  useEffect(() => {
    // Reset tipe transaksi saat jenis transaksi berubah
    form.setValue('tipeTransaksi', '');
    
    // Reset field terkait anggota jika jenis atau tipe berubah
    form.setValue('anggotaId', undefined);
    form.setValue('statusPembayaran', undefined);
    form.setValue('periodeBayar', []);
    
    setShowAnggotaFields(false);
    setShowStatusPembayaran(false);
    setShowPeriodeBayar(false);
  }, [watchJenis, form]);

  // Update field saat tipe transaksi berubah
  useEffect(() => {
    if (watchJenis === 'uang_masuk') {
      if (watchTipeTransaksi === 'iuran_anggota') {
        setShowAnggotaFields(true);
        setShowStatusPembayaran(true);
      } else if (watchTipeTransaksi === 'sumbangan_anggota') {
        setShowAnggotaFields(true);
        setShowStatusPembayaran(false);
      } else {
        setShowAnggotaFields(false);
        setShowStatusPembayaran(false);
      }
    } else {
      setShowAnggotaFields(false);
      setShowStatusPembayaran(false);
    }
  }, [watchJenis, watchTipeTransaksi]);

  // Update field saat status pembayaran berubah
  useEffect(() => {
    if (watchStatusPembayaran === 'sebagian_bulan') {
      setShowPeriodeBayar(true);
    } else {
      setShowPeriodeBayar(false);
    }
  }, [watchStatusPembayaran]);

  const handleSubmit = async (values: TransactionFormValues) => {
    try {
      // Validasi khusus untuk iuran anggota
      if (values.jenis === 'uang_masuk' && values.tipeTransaksi === 'iuran_anggota' && !values.anggotaId) {
        toast.error("Anggota IKATA wajib dipilih", {
          description: "Silakan pilih anggota untuk iuran"
        });
        return;
      }

      if (values.jenis === 'uang_masuk' && values.tipeTransaksi === 'iuran_anggota' && !values.statusPembayaran) {
        toast.error("Status pembayaran wajib dipilih", {
          description: "Silakan pilih status pembayaran untuk iuran"
        });
        return;
      }

      if (values.statusPembayaran === 'sebagian_bulan' && (!values.periodeBayar || values.periodeBayar.length === 0)) {
        toast.error("Periode pembayaran wajib dipilih", {
          description: "Silakan pilih periode bulan yang sudah dilunasi"
        });
        return;
      }

      // Simulasi pengiriman notifikasi
      if (values.jenis === 'uang_masuk') {
        if (values.tipeTransaksi === 'iuran_anggota') {
          const anggota = mockAnggotaIKATA.find(a => a.id === values.anggotaId);
          if (anggota) {
            toast.success(`Notifikasi Terkirim ke ${anggota.nama}`, {
              description: `Iuran sebesar Rp ${values.jumlah.toLocaleString('id-ID')} telah berhasil dibukukan.`
            });
          }
        } else if (values.tipeTransaksi === 'sumbangan_anggota') {
          toast.success("Notifikasi Terkirim ke Semua Anggota", {
            description: `Sumbangan anggota sebesar Rp ${values.jumlah.toLocaleString('id-ID')} telah diterima.`
          });
        }
      }

      onSubmit({
        tanggal: format(values.tanggal, 'yyyy-MM-dd'),
        jenis: values.jenis,
        tipeTransaksi: values.tipeTransaksi as TipeTransaksi,
        keterangan: values.keterangan,
        jumlah: values.jumlah,
        anggotaId: values.anggotaId,
        statusPembayaran: values.statusPembayaran,
        periodeBayar: values.periodeBayar,
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
          <DialogTitle>{isEditing ? 'Edit Transaksi' : 'Tambah Transaksi'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Ubah data transaksi yang sudah ada.'
              : 'Isi formulir di bawah untuk menambahkan transaksi kas IKATA.'
            }
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis transaksi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="uang_masuk">Uang Masuk</SelectItem>
                      <SelectItem value="uang_keluar">Uang Keluar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipeTransaksi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Transaksi</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={!watchJenis}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe transaksi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tipeTransaksiOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {showAnggotaFields && (
              <FormField
                control={form.control}
                name="anggotaId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Anggota IKATA</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? mockAnggotaIKATA.find((anggota) => anggota.id === field.value)?.nama
                              : "Pilih anggota"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Cari anggota..." />
                          <CommandEmpty>Anggota tidak ditemukan.</CommandEmpty>
                          <CommandGroup className="max-h-60 overflow-auto">
                            {mockAnggotaIKATA.map((anggota) => (
                              <CommandItem
                                key={anggota.id}
                                value={anggota.nama}
                                onSelect={() => {
                                  form.setValue("anggotaId", anggota.id)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    anggota.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {anggota.nama}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showStatusPembayaran && (
              <FormField
                control={form.control}
                name="statusPembayaran"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Pembayaran</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status pembayaran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lunas">Lunas</SelectItem>
                        <SelectItem value="sebagian_bulan">Sebagian Bulan</SelectItem>
                        <SelectItem value="belum_ada_pembayaran">Belum Ada Pembayaran</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showPeriodeBayar && (
              <FormField
                control={form.control}
                name="periodeBayar"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel>Periode Bulan yang Dilunasi</FormLabel>
                      <FormDescription>
                        Pilih bulan-bulan yang sudah dilunasi
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-1">
                      {periodeBulanOptions.map((periode) => (
                        <FormField
                          key={periode.value}
                          control={form.control}
                          name="periodeBayar"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={periode.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(periode.value)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        form.setValue("periodeBayar", [
                                          ...current,
                                          periode.value,
                                        ]);
                                      } else {
                                        form.setValue("periodeBayar", current.filter(
                                          (value) => value !== periode.value
                                        ));
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {periode.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            {!showAnggotaFields && (
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
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit">{isEditing ? 'Simpan Perubahan' : 'Simpan'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 