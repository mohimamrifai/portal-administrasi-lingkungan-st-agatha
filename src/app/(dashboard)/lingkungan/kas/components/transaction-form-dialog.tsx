"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { JenisTransaksi, TipeTransaksiLingkungan } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, PlusIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { UseFormReturn } from "react-hook-form"
import { 
  TransactionFormValues, 
  transactionTypeOptions, 
  transactionSubtypeOptions
} from "../types/schema"
import { Textarea } from "@/components/ui/textarea"

// Common form component shared between create and edit dialogs
function TransactionForm({ 
  form, 
  onSubmit, 
  isEditing 
}: { 
  form: UseFormReturn<TransactionFormValues>,
  onSubmit: (values: TransactionFormValues) => void,
  isEditing: boolean
}) {
  const [showConfirmTransfer, setShowConfirmTransfer] = useState(false);
  const currentType = form.watch("jenisTransaksi");
  const currentSubtype = form.watch("tipeTransaksi");
  
  useEffect(() => {
    setShowConfirmTransfer(
      currentType === JenisTransaksi.UANG_KELUAR && 
      currentSubtype === TipeTransaksiLingkungan.TRANSFER_DANA_KE_IKATA
    );
  }, [currentType, currentSubtype]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        "pl-3 text-left font-normal",
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
        
        {/* Jenis Transaksi */}
        <FormField
          control={form.control}
          name="jenisTransaksi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Transaksi</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value as JenisTransaksi);
                  // Reset subtype when type changes
                  form.setValue("tipeTransaksi", TipeTransaksiLingkungan.KOLEKTE_I);
                }} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis transaksi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transactionTypeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Tipe Transaksi */}
        {currentType && (
          <FormField
            control={form.control}
            name="tipeTransaksi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Transaksi</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value as TipeTransaksiLingkungan)} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe transaksi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {transactionSubtypeOptions[currentType]?.map((subtype) => (
                      <SelectItem key={subtype.value} value={subtype.value}>
                        {subtype.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {/* Keterangan */}
        <FormField
          control={form.control}
          name="keterangan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Masukkan keterangan transaksi"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tambahkan detail untuk transaksi ini
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Jumlah */}
        <FormField
          control={form.control}
          name="jumlah"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2">Rp</span>
                  <Input
                    type="number"
                    min={0}
                    className="pl-10"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Konfirmasi untuk Transfer IKATA - Kita hapus fitur ini untuk sementara */}
        {showConfirmTransfer && (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <div className="space-y-1 leading-none">
              <FormLabel>Kirim ke Kas IKATA</FormLabel>
              <FormDescription>
                Dana akan langsung dicatat di kas IKATA sebagai pemasukan
              </FormDescription>
            </div>
          </FormItem>
        )}
        
        <div className="flex justify-end gap-2">
          <Button type="submit">
            {isEditing ? "Simpan Perubahan" : "Tambah Transaksi"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

interface CreateTransactionProps {
  form: UseFormReturn<TransactionFormValues>;
  onSubmit: (values: TransactionFormValues) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTransactionDialog({ 
  form, 
  onSubmit,
  open,
  onOpenChange
}: CreateTransactionProps) {
  const handleSubmit = (values: TransactionFormValues) => {
    onSubmit(values)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <PlusIcon className="mr-2 h-4 w-4" /> Tambah Transaksi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Transaksi Baru</DialogTitle>
          <DialogDescription>
            Masukkan informasi transaksi kas lingkungan.
          </DialogDescription>
        </DialogHeader>
        <TransactionForm 
          form={form}
          onSubmit={handleSubmit}
          isEditing={false}
        />
        <DialogFooter>
          <Button onClick={form.handleSubmit(handleSubmit)}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface EditTransactionProps {
  form: UseFormReturn<TransactionFormValues>;
  onSubmit: (values: TransactionFormValues) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({ 
  form, 
  onSubmit, 
  open,
  onOpenChange
}: EditTransactionProps) {
  const handleSubmit = (values: TransactionFormValues) => {
    onSubmit(values)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaksi</DialogTitle>
          <DialogDescription>
            Ubah informasi transaksi kas lingkungan.
          </DialogDescription>
        </DialogHeader>
        <TransactionForm 
          form={form}
          onSubmit={handleSubmit}
          isEditing={true}
        />
        <DialogFooter>
          <Button onClick={form.handleSubmit(handleSubmit)}>Perbarui</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 