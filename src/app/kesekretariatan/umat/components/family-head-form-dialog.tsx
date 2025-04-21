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
import { useState } from "react";

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

  const form = useForm<FamilyHeadFormValues>({
    resolver: zodResolver(familyHeadFormSchema),
    defaultValues: familyHead
      ? {
          name: familyHead.name,
          address: familyHead.address,
          phoneNumber: familyHead.phoneNumber,
          status: familyHead.status,
        }
      : {
          name: "",
          address: "",
          phoneNumber: "",
          status: "active",
        },
  });

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
                    defaultValue={field.value}
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 