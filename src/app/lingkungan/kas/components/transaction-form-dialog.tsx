"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
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
  transactionTypes, 
  transactionSubtypes,
  familyHeads
} from "../types"

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
  const [showFamilyHeadSelect, setShowFamilyHeadSelect] = useState(false);
  const currentType = form.watch("type");
  const currentSubtype = form.watch("subtype");
  
  // Show family head selection when "Sumbangan Umat" is selected
  useEffect(() => {
    setShowFamilyHeadSelect(
      currentType === "debit" && currentSubtype === "sumbangan_umat"
    );
  }, [currentType, currentSubtype]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
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
        
        {/* Jenis Transaksi (Type) */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Transaksi</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset subtype when type changes
                  form.setValue("subtype", "");
                }} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis transaksi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transactionTypes.map((type) => (
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
        
        {/* Tipe Transaksi (Subtype) */}
        {currentType && (
          <FormField
            control={form.control}
            name="subtype"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Transaksi</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe transaksi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {transactionSubtypes[currentType as "debit" | "credit"].map((subtype) => (
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
        
        {/* Family Head Selection (for Donations) */}
        {showFamilyHeadSelect && (
          <FormField
            control={form.control}
            name="familyHeadId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kepala Keluarga</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(Number(value))} 
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kepala keluarga" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {familyHeads.map((head) => (
                      <SelectItem key={head.id} value={head.id.toString()}>
                        {head.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Input placeholder="Keterangan transaksi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah (Rp)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* From IKATA Checkbox */}
        {currentType === "debit" && currentSubtype === "transfer_ikata" && (
          <FormField
            control={form.control}
            name="fromIkata"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Transfer dari Kas IKATA
                  </FormLabel>
                  <FormDescription>
                    Pilih ini jika transaksi merupakan transfer dari Kas IKATA
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}
        
        <DialogFooter>
          <Button type="submit" className="w-full md:w-auto">
            {isEditing ? "Perbarui" : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// Create transaction dialog
interface CreateTransactionProps {
  form: UseFormReturn<TransactionFormValues>;
  onSubmit: (values: TransactionFormValues) => void;
}

export function CreateTransactionDialog({ form, onSubmit }: CreateTransactionProps) {
  const [showIkataConfirmation, setShowIkataConfirmation] = useState(false);
  const [pendingValues, setPendingValues] = useState<TransactionFormValues | null>(null);
  
  // Handle form submission
  const handleSubmit = (values: TransactionFormValues) => {
    // Check if it's a transfer to IKATA and needs confirmation
    if (values.type === "credit" && values.subtype === "transfer_ikata") {
      setShowIkataConfirmation(true);
      setPendingValues(values);
    } else {
      onSubmit(values);
    }
  };
  
  // Handle confirmation submit
  const handleConfirmTransfer = () => {
    if (pendingValues) {
      // Add confirmation flag and submit
      onSubmit({
        ...pendingValues,
        confirmIkataTransfer: true
      });
      
      // Reset state
      setShowIkataConfirmation(false);
      setPendingValues(null);
    }
  };
  
  // Handle cancel
  const handleCancelTransfer = () => {
    setShowIkataConfirmation(false);
    setPendingValues(null);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto mt-2 md:mt-0">
            <PlusIcon className="h-4 w-4 mr-2" />
            Input Transaksi
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] md:max-w-md">
          <DialogHeader>
            <DialogTitle>Input Transaksi Baru</DialogTitle>
            <DialogDescription>
              Isi form berikut untuk menambahkan transaksi kas lingkungan.
            </DialogDescription>
          </DialogHeader>
          
          <TransactionForm 
            form={form} 
            onSubmit={handleSubmit} 
            isEditing={false} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog for IKATA Transfers */}
      <AlertDialog open={showIkataConfirmation} onOpenChange={setShowIkataConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Transfer ke IKATA</AlertDialogTitle>
            <AlertDialogDescription>
              Transaksi ini akan otomatis tercatat di kas IKATA sebagai pemasukan. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelTransfer}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTransfer}>
              Konfirmasi Transfer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Edit transaction dialog
interface EditTransactionProps {
  form: UseFormReturn<TransactionFormValues>;
  onSubmit: (values: TransactionFormValues) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({ 
  form, 
  onSubmit, 
  isOpen,
  onOpenChange
}: EditTransactionProps) {
  const [showIkataConfirmation, setShowIkataConfirmation] = useState(false);
  const [pendingValues, setPendingValues] = useState<TransactionFormValues | null>(null);
  
  // Handle form submission
  const handleSubmit = (values: TransactionFormValues) => {
    // Check if it's a transfer to IKATA and needs confirmation
    if (values.type === "credit" && values.subtype === "transfer_ikata") {
      setShowIkataConfirmation(true);
      setPendingValues(values);
    } else {
      onSubmit(values);
    }
  };
  
  // Handle confirmation submit
  const handleConfirmTransfer = () => {
    if (pendingValues) {
      // Add confirmation flag and submit
      onSubmit({
        ...pendingValues,
        confirmIkataTransfer: true
      });
      
      // Reset state
      setShowIkataConfirmation(false);
      setPendingValues(null);
    }
  };
  
  // Handle cancel
  const handleCancelTransfer = () => {
    setShowIkataConfirmation(false);
    setPendingValues(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] md:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaksi</DialogTitle>
            <DialogDescription>
              Ubah detail transaksi sesuai kebutuhan.
            </DialogDescription>
          </DialogHeader>
          
          <TransactionForm 
            form={form} 
            onSubmit={handleSubmit} 
            isEditing={true} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog for IKATA Transfers */}
      <AlertDialog open={showIkataConfirmation} onOpenChange={setShowIkataConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Transfer ke IKATA</AlertDialogTitle>
            <AlertDialogDescription>
              Transaksi ini akan otomatis tercatat di kas IKATA sebagai pemasukan. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelTransfer}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTransfer}>
              Konfirmasi Transfer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 