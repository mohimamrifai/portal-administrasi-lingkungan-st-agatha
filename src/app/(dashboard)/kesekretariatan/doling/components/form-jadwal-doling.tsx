"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, isBefore, isAfter, addMonths } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { JadwalDoling } from "../types";

// Validasi untuk tanggal
const disabledDays = [
  // Contoh: tanggal yang sudah dipesan
  new Date(2023, 10, 10),
  new Date(2023, 10, 15),
  new Date(2023, 10, 20),
];

// Membuat skema validasi form
const formSchema = z.object({
  tuanRumah: z
    .string()
    .min(3, "Nama tuan rumah minimal 3 karakter")
    .max(50, "Nama tuan rumah maksimal 50 karakter"),
  alamat: z
    .string()
    .min(5, "Alamat minimal 5 karakter")
    .max(200, "Alamat maksimal 200 karakter"),
  tanggal: z
    .date({
      required_error: "Tanggal doa lingkungan wajib diisi",
    })
    .refine(
      (date) => isAfter(date, new Date()), 
      "Tanggal harus setelah hari ini"
    )
    .refine(
      (date) => isBefore(date, addMonths(new Date(), 6)), 
      "Tanggal tidak boleh lebih dari 6 bulan dari sekarang"
    ),
  waktu: z
    .string()
    .min(5, "Format waktu tidak valid"),
  noTelepon: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit"),
  catatan: z
    .string()
    .max(500, "Catatan maksimal 500 karakter")
    .optional(),
  status: z.enum(["terjadwal", "selesai", "dibatalkan"], {
    required_error: "Status harus dipilih",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface FormJadwalDolingProps {
  initialData?: JadwalDoling;
  onSubmit: (data: JadwalDoling) => void;
  onCancel: () => void;
}

export function FormJadwalDoling({ initialData, onSubmit, onCancel }: FormJadwalDolingProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      tuanRumah: initialData.tuanRumah,
      alamat: initialData.alamat,
      tanggal: initialData.tanggal,
      waktu: initialData.waktu,
      noTelepon: initialData.noTelepon || "",
      catatan: initialData.catatan || "",
      status: initialData.status,
    } : {
      tuanRumah: "",
      alamat: "",
      tanggal: new Date(),
      waktu: "19:00",
      noTelepon: "",
      catatan: "",
      status: "terjadwal",
    },
  });

  function handleSubmit(values: FormValues) {
    onSubmit({
      id: initialData?.id || Math.floor(Math.random() * 1000),
      ...values,
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    });
  }

  const timeOptions = [
    "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  const isEditMode = !!initialData;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Jadwal Doa Lingkungan" : "Tambah Jadwal Doa Lingkungan"}</CardTitle>
        <CardDescription>
          Silakan isi formulir di bawah untuk {isEditMode ? "mengubah" : "menambahkan"} jadwal doa lingkungan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="tuanRumah"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tuan Rumah <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama tuan rumah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="noTelepon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 081234567890" type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tanggal"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal <span className="text-destructive">*</span></FormLabel>
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
                                format(field.value, "EEEE, dd MMMM yyyy", { locale: id })
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
                              isBefore(date, new Date()) || 
                              disabledDays.some(
                                (disabledDate) => 
                                  format(disabledDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                              )
                            }
                            initialFocus
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
                  name="waktu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu <span className="text-destructive">*</span></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih waktu" />
                            <Clock className="h-4 w-4 opacity-50" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time} WIB
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Masukkan alamat lengkap" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="catatan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catatan</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Catatan tambahan (opsional)" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {isEditMode && (
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status <span className="text-destructive">*</span></FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="terjadwal">Terjadwal</SelectItem>
                            <SelectItem value="selesai">Selesai</SelectItem>
                            <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
            
            <Alert variant="default" className="bg-primary/5 border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertTitle>Perhatian</AlertTitle>
              <AlertDescription>
                Jadwal yang telah dibuat akan dikirimkan notifikasi ke admin lingkungan dan pengurus seksi doaling.
              </AlertDescription>
            </Alert>
            
            <Separator />
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Batal
              </Button>
              <Button type="submit">
                {isEditMode ? "Perbarui Jadwal" : "Simpan Jadwal"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 