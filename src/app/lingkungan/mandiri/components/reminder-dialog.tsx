"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SendReminderValues, sendReminderSchema } from "../types"
import { getFamilyHeadName } from "../utils"
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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface ReminderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: SendReminderValues) => void
  selectedFamilyIds: number[]
}

export function ReminderDialog({
  open,
  onOpenChange,
  onSubmit,
  selectedFamilyIds,
}: ReminderDialogProps) {
  // Form
  const form = useForm<SendReminderValues>({
    resolver: zodResolver(sendReminderSchema),
    defaultValues: {
      familyHeadIds: selectedFamilyIds,
      message: "Dengan hormat, kami ingin mengingatkan bahwa terdapat tunggakan Dana Mandiri yang perlu diselesaikan. Mohon untuk segera melakukan pembayaran. Terima kasih.",
    },
  })
  
  // Handle form submission
  const handleSubmit = (values: SendReminderValues) => {
    onSubmit({
      ...values,
      familyHeadIds: selectedFamilyIds // Ensure we're using the selected IDs
    })
    onOpenChange(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Kirim Pengingat</DialogTitle>
          <DialogDescription>
            Kirim pengingat kepada Kepala Keluarga yang memiliki tunggakan Dana Mandiri.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <p className="text-sm font-medium mb-2">Kepala Keluarga yang dipilih:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedFamilyIds.map(id => (
              <Badge key={id} variant="secondary">
                {getFamilyHeadName(id)}
              </Badge>
            ))}
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pesan Pengingat</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan pesan pengingat"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
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
              <Button type="submit">Kirim Pengingat</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 