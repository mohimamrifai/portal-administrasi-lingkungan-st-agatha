"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
import { CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { 
  DependentFormValues, 
  dependentFormSchema, 
  Gender, 
  Dependent 
} from "../types"
import { formatDateForInput } from "../utils"

interface DependentFormProps {
  initialData?: Dependent
  onSubmit: (values: DependentFormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

export function DependentForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isLoading = false 
}: DependentFormProps) {
  // Initialize form with default values or data from prop
  const form = useForm<DependentFormValues>({
    resolver: zodResolver(dependentFormSchema),
    defaultValues: initialData 
      ? {
          ...initialData,
        }
      : {
          fullName: "",
          gender: Gender.MALE,
          birthPlace: "",
          birthDate: new Date(2000, 0, 1),
          nik: "",
          relationship: "Anak",
          occupation: "",
        }
  })

  // Form submission handler
  const handleSubmit = (values: DependentFormValues) => {
    onSubmit(values)
  }

  return (
    <div className="border p-4 rounded-md relative mb-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onCancel}
        className="absolute right-2 top-2"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Batal</span>
      </Button>
      
      <h3 className="text-lg font-medium mb-4">Data Tanggungan</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Gender.MALE}>{Gender.MALE}</SelectItem>
                      <SelectItem value={Gender.FEMALE}>{Gender.FEMALE}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Birth Place */}
            <FormField
              control={form.control}
              name="birthPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Lahir</FormLabel>
                  <FormControl>
                    <Input placeholder="Tempat Lahir" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Birth Date */}
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Lahir</FormLabel>
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
                            format(field.value, "dd MMMM yyyy", { locale: id })
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* NIK */}
          <FormField
            control={form.control}
            name="nik"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIK (Nomor Induk Kependudukan)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="16 digit NIK (tanpa spasi)" 
                    {...field} 
                    maxLength={16}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            {/* Relationship */}
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hubungan</FormLabel>
                  <FormControl>
                    <Input placeholder="contoh: Anak, Orang Tua, dll" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Occupation */}
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pekerjaan/Aktivitas</FormLabel>
                  <FormControl>
                    <Input placeholder="contoh: Pelajar, Mahasiswa, dll" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 