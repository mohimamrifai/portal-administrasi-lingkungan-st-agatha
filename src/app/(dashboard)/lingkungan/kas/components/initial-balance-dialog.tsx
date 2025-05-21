"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BanknoteIcon } from "lucide-react"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { InitialBalanceFormValues } from "../types"

interface InitialBalanceDialogProps {
  form: UseFormReturn<InitialBalanceFormValues>;
  onSubmit: (values: InitialBalanceFormValues) => void;
  currentBalance: number;
}

export function InitialBalanceDialog({ 
  form, 
  onSubmit,
  currentBalance
}: InitialBalanceDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (values: InitialBalanceFormValues) => {
    onSubmit(values)
    setOpen(false)
  }

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
            Input saldo awal kas lingkungan. Nilai saat ini: Rp {currentBalance.toLocaleString('id-ID')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="saldoAwal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Saldo Awal</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 