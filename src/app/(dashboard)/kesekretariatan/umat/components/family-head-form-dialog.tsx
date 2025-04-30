"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FamilyHead, FamilyHeadFormValues, familyHeadFormSchema, familyHeadStatuses } from "../types";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FamilyHeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  familyHead?: FamilyHead;
  onSubmit: (values: FamilyHeadFormValues) => Promise<void>;
}

export function FamilyHeadFormDialog({
  open,
  onOpenChange,
  familyHead,
  onSubmit,
}: FamilyHeadFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: FamilyHeadFormValues = {
    name: "",
    address: "",
    phoneNumber: "",
    joinDate: new Date(),
    childrenCount: 0,
    relativesCount: 0,
    familyMembersCount: 1,
    status: "active",
  };

  const form = useForm<FamilyHeadFormValues>({
    resolver: zodResolver(familyHeadFormSchema),
    defaultValues,
  });

  // Reset form when dialog is opened/closed or familyHead changes
  useEffect(() => {
    if (open) {
      if (familyHead) {
        // Editing existing family head
        form.reset({
          name: familyHead.name,
          address: familyHead.address,
          phoneNumber: familyHead.phoneNumber,
          joinDate: familyHead.joinDate,
          childrenCount: familyHead.childrenCount,
          relativesCount: familyHead.relativesCount,
          familyMembersCount: familyHead.familyMembersCount,
          status: familyHead.status,
          deceasedMemberName: familyHead.deceasedMemberName,
        });
      } else {
        // Adding new family head
        form.reset(defaultValues);
      }
    }
  }, [open, familyHead, form]);

  // Mengawasi perubahan status
  const statusValue = form.watch("status");
  
  // Atur deceasedMemberName menjadi undefined jika status bukan deceased
  useEffect(() => {
    if (statusValue !== "deceased") {
      form.setValue("deceasedMemberName", undefined);
    }
  }, [statusValue, form]);

  const handleSubmit = async (values: FamilyHeadFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      toast.success(
        familyHead
          ? "Data kepala keluarga berhasil diperbarui"
          : "Data kepala keluarga berhasil ditambahkan"
      );
      onOpenChange(false);
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Reset form when dialog is closed without submitting
      setTimeout(() => form.reset(defaultValues), 100);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-auto">
        <DialogHeader>
          <DialogTitle>
            {familyHead ? "Edit Kepala Keluarga" : "Tambah Kepala Keluarga"}
          </DialogTitle>
          <DialogDescription>
            {familyHead
              ? "Perbarui data kepala keluarga di bawah ini"
              : "Isi data kepala keluarga di bawah ini"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama kepala keluarga" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="joinDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Bergabung</FormLabel>
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
                            format(field.value, "dd MMM yyyy", { locale: id })
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input placeholder="Alamat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="childrenCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Anak Tertanggung</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                        value={field.value || 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="relativesCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Kerabat Tertanggung</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value || 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="familyMembersCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Anggota Keluarga</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1}
                        placeholder="1" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} 
                        value={field.value || 1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="Nomor telepon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {familyHeadStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {statusValue === "deceased" && (
              <FormField
                control={form.control}
                name="deceasedMemberName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Anggota Keluarga yang Meninggal</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama anggota keluarga yang meninggal" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 