"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PrintPdfFormValues, printPdfSchema } from "../types"
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

interface PrintPdfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PrintPdfFormValues) => void;
}

export function PrintPdfDialog({
  open,
  onOpenChange,
  onSubmit,
}: PrintPdfDialogProps) {
  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Create year options (current year +/- 10 years)
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  
  // Form
  const form = useForm<PrintPdfFormValues>({
    resolver: zodResolver(printPdfSchema),
    defaultValues: {
      documentType: "yearly_report",
      year: currentYear,
      fileFormat: "pdf",
    },
  });
  
  // Document type options
  const documentTypes = [
    { value: "payment_receipt", label: "Bukti Pembayaran" },
    { value: "yearly_report", label: "Laporan Tahunan" },
    { value: "debt_report", label: "Laporan Tunggakan" },
  ];
  
  // Handle form submission
  const handleSubmit = (values: PrintPdfFormValues) => {
    values.fileFormat = "pdf";
    onSubmit(values);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Print PDF</DialogTitle>
          <DialogDescription>
            Pilih jenis dokumen dan tahun yang ingin dicetak.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Dokumen</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih jenis dokumen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentTypes.map((type) => (
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
            
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih tahun" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" className="w-full">Print PDF</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 