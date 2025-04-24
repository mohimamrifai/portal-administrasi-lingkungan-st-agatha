"use client"

import { useState } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { PaymentHistory, PaymentStatus } from "../types"

// Schema untuk form tambah pembayaran
const addPaymentSchema = z.object({
  userId: z.number().min(1, "Pilih umat"),
  type: z.enum(["Dana Mandiri", "IKATA"], {
    required_error: "Pilih jenis pembayaran",
  }),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  amount: z.string().refine(
    (val) => !isNaN(Number(val.replace(/\./g, ""))),
    { message: "Jumlah harus berupa angka" }
  ),
  status: z.enum(["Lunas", "Menunggu", "Belum Bayar"]),
  year: z.number().min(2000, "Tahun minimal 2000").max(new Date().getFullYear() + 1, "Tahun tidak valid"),
  paymentDate: z.date().nullable(),
});

// Tipe untuk nilai form
type AddPaymentValues = z.infer<typeof addPaymentSchema>;

interface AddPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payment: Partial<PaymentHistory>) => void
  users: { id: number; name: string }[]
}

export function AddPaymentDialog({
  open,
  onOpenChange,
  onSave,
  users
}: AddPaymentDialogProps) {
  // Default form values
  const defaultValues: AddPaymentValues = {
    userId: 0,
    type: "Dana Mandiri",
    description: "",
    amount: "0",
    status: "Belum Bayar",
    year: new Date().getFullYear(),
    paymentDate: null,
  }
  
  // Initialize form
  const form = useForm<AddPaymentValues>({
    resolver: zodResolver(addPaymentSchema),
    defaultValues,
  })
  
  // Get current status and update payment date field
  const status = form.watch("status")
  
  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(defaultValues)
    }
    onOpenChange(open)
  }
  
  // Handle form submission
  const onSubmit = (data: AddPaymentValues) => {
    // Format amount by removing thousand separators
    const amount = parseFloat(data.amount.replace(/\./g, ""))
    
    // Create payment data
    const paymentData: Partial<PaymentHistory> = {
      userId: data.userId,
      familyHeadName: users.find(user => user.id === data.userId)?.name,
      type: data.type,
      description: data.description,
      amount: amount,
      status: data.status,
      year: data.year,
      paymentDate: data.paymentDate,
    }
    
    // Save data and close dialog
    onSave(paymentData)
    handleOpenChange(false)
    toast.success("Pembayaran berhasil ditambahkan")
  }
  
  // Format amount with thousand separator
  const formatAmount = (value: string) => {
    if (!value) return ""
    
    const numericValue = value.replace(/\./g, "")
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Pembayaran Baru</DialogTitle>
          <DialogDescription>
            Tambahkan data pembayaran baru untuk umat.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Pilih Umat */}
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Umat</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value ? field.value.toString() : "0"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih umat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Jenis Pembayaran */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Pembayaran</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis pembayaran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Dana Mandiri">Dana Mandiri</SelectItem>
                      <SelectItem value="IKATA">IKATA</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Deskripsi Pembayaran */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Input placeholder="Deskripsi pembayaran" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Tahun */}
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={2000}
                      max={new Date().getFullYear() + 1}
                      placeholder="Tahun"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Jumlah */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah (Rp)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Masukkan jumlah" 
                      {...field} 
                      onChange={(e) => {
                        const formatted = formatAmount(e.target.value)
                        field.onChange(formatted)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value as PaymentStatus)
                      
                      // Jika status Lunas dan tanggal pembayaran kosong, set ke hari ini
                      if (value === "Lunas" && !form.getValues("paymentDate")) {
                        form.setValue("paymentDate", new Date())
                      }
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Lunas">Lunas</SelectItem>
                      <SelectItem value="Menunggu">Menunggu</SelectItem>
                      <SelectItem value="Belum Bayar">Belum Bayar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Tanggal Pembayaran */}
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Pembayaran</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={status === "Belum Bayar"}
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
                        selected={field.value as Date}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    {status === "Lunas" 
                      ? "Tanggal harus diisi untuk status Lunas" 
                      : "Opsional untuk status Menunggu"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 