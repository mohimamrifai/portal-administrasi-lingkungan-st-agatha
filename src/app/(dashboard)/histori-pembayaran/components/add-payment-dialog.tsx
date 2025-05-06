"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { danaMandiriFormSchema, ikataFormSchema, DanaMandiriFormValues, IkataFormValues } from "../types"
import { createDanaMandiri } from "../actions/dana-mandiri"
import { createIkata, getKeluargaOptions } from "../actions/ikata"

type PaymentType = "Dana Mandiri" | "IKATA";

interface AddPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentType: PaymentType;
  onSuccess: () => void;
  isSuperUser: boolean;
  defaultKeluargaId?: string;
}

export function AddPaymentDialog({
  isOpen,
  onClose,
  paymentType,
  onSuccess,
  isSuperUser,
  defaultKeluargaId,
}: AddPaymentDialogProps) {
  const [keluargaOptions, setKeluargaOptions] = useState<{ id: string; namaKepalaKeluarga: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchKeluarga, setSearchKeluarga] = useState("")
  const [showKeluargaList, setShowKeluargaList] = useState(false)
  const [filteredKeluargaOptions, setFilteredKeluargaOptions] = useState<{ id: string; namaKepalaKeluarga: string }[]>([])
  
  // Form untuk Dana Mandiri
  const danaMandiriForm = useForm<DanaMandiriFormValues>({
    resolver: zodResolver(danaMandiriFormSchema),
    defaultValues: {
      keluargaId: defaultKeluargaId || "",
      tanggal: new Date(),
      jumlahDibayar: 0,
      tahun: new Date().getFullYear(),
      bulan: new Date().getMonth() + 1,
      statusSetor: false,
      tanggalSetor: null,
    },
  })
  
  // Form untuk IKATA
  const ikataForm = useForm<IkataFormValues>({
    resolver: zodResolver(ikataFormSchema),
    defaultValues: {
      keluargaId: defaultKeluargaId || "",
      status: "LUNAS",
      bulanAwal: 1,
      bulanAkhir: isSuperUser ? 12 : null,
      tahun: new Date().getFullYear(),
      jumlahDibayar: 0,
    },
  })

  // Load keluarga options
  useEffect(() => {
    const loadKeluargaOptions = async () => {
      try {
        const options = await getKeluargaOptions()
        setKeluargaOptions(options)
      } catch (error) {
        console.error("Failed to load keluarga options:", error)
        toast.error("Gagal memuat data keluarga")
      }
    }
    
    loadKeluargaOptions()
  }, [])
  
  // Effect untuk filter keluarga options berdasarkan pencarian
  useEffect(() => {
    if (searchKeluarga.trim() === "") {
      setFilteredKeluargaOptions(keluargaOptions);
    } else {
      const lowercaseSearch = searchKeluarga.toLowerCase();
      const filtered = keluargaOptions.filter(keluarga => 
        keluarga.namaKepalaKeluarga.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredKeluargaOptions(filtered);
    }
  }, [searchKeluarga, keluargaOptions]);
  
  // Event listener untuk menutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdownContainer = document.getElementById('keluarga-dropdown-container');
      if (dropdownContainer && !dropdownContainer.contains(target)) {
        setShowKeluargaList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Submit handler untuk Dana Mandiri
  const onSubmitDanaMandiri = async (data: DanaMandiriFormValues) => {
    try {
      setIsLoading(true)
      
      const result = await createDanaMandiri(data)
      
      if (result.success) {
        toast.success("Pembayaran Dana Mandiri berhasil disimpan")
        onSuccess()
        onClose()
      } else {
        throw new Error("Gagal menyimpan pembayaran")
      }
    } catch (error) {
      console.error("Error submitting Dana Mandiri payment:", error)
      toast.error("Gagal menyimpan pembayaran Dana Mandiri")
    } finally {
      setIsLoading(false)
    }
  }
  
  // Submit handler untuk IKATA
  const onSubmitIkata = async (data: IkataFormValues) => {
    try {
      setIsLoading(true)
      
      const result = await createIkata(data)
      
      if (result.success) {
        toast.success("Pembayaran IKATA berhasil disimpan")
        onSuccess()
        onClose()
      } else {
        throw new Error("Gagal menyimpan pembayaran")
      }
    } catch (error) {
      console.error("Error submitting IKATA payment:", error)
      toast.error("Gagal menyimpan pembayaran IKATA")
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle IKATA status change
  const handleIkataStatusChange = (value: string) => {
    if (value === "LUNAS") {
      ikataForm.setValue("bulanAwal", 1)
      ikataForm.setValue("bulanAkhir", 12)
    } else if (value === "BELUM_BAYAR") {
      ikataForm.setValue("bulanAwal", null)
      ikataForm.setValue("bulanAkhir", null)
      ikataForm.setValue("jumlahDibayar", 0)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Tambah Pembayaran {paymentType}
          </DialogTitle>
          <DialogDescription>
            Isi data pembayaran {paymentType} dengan lengkap
          </DialogDescription>
        </DialogHeader>
        
        {paymentType === "Dana Mandiri" ? (
          <Form {...danaMandiriForm}>
            <form onSubmit={danaMandiriForm.handleSubmit(onSubmitDanaMandiri)} className="space-y-4">
              {isSuperUser && (
                <FormField
                  control={danaMandiriForm.control}
                  name="keluargaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kepala Keluarga</FormLabel>
                      <FormControl>
                        <div id="keluarga-dropdown-container" className="relative">
                          <Input
                            placeholder="Cari kepala keluarga..."
                            className="w-full"
                            value={searchKeluarga}
                            onChange={(e) => {
                              setSearchKeluarga(e.target.value);
                              setShowKeluargaList(true);
                            }}
                            onFocus={() => setShowKeluargaList(true)}
                          />
                          {showKeluargaList && (
                            <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-md max-h-[200px] overflow-y-auto">
                              {filteredKeluargaOptions.length > 0 ? (
                                filteredKeluargaOptions.map((keluarga) => (
                                  <div
                                    key={keluarga.id}
                                    className="px-3 py-2 cursor-pointer hover:bg-accent"
                                    onClick={() => {
                                      field.onChange(keluarga.id);
                                      setSearchKeluarga(keluarga.namaKepalaKeluarga);
                                      setShowKeluargaList(false);
                                    }}
                                  >
                                    {keluarga.namaKepalaKeluarga}
                                  </div>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-muted-foreground">Tidak ada hasil</div>
                              )}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={danaMandiriForm.control}
                name="tanggal"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Pembayaran</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isLoading}
                          >
                            {field.value ? (
                              format(field.value, "dd MMMM yyyy")
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={danaMandiriForm.control}
                  name="tahun"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahun</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={danaMandiriForm.control}
                  name="bulan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bulan</FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={(value) => field.onChange(parseInt(value, 10))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih bulan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Januari</SelectItem>
                          <SelectItem value="2">Februari</SelectItem>
                          <SelectItem value="3">Maret</SelectItem>
                          <SelectItem value="4">April</SelectItem>
                          <SelectItem value="5">Mei</SelectItem>
                          <SelectItem value="6">Juni</SelectItem>
                          <SelectItem value="7">Juli</SelectItem>
                          <SelectItem value="8">Agustus</SelectItem>
                          <SelectItem value="9">September</SelectItem>
                          <SelectItem value="10">Oktober</SelectItem>
                          <SelectItem value="11">November</SelectItem>
                          <SelectItem value="12">Desember</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={danaMandiriForm.control}
                name="jumlahDibayar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Dibayar</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={danaMandiriForm.control}
                name="statusSetor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Status Setor</FormLabel>
                      <FormDescription>
                        Pembayaran sudah disetorkan ke bendahara
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {danaMandiriForm.watch("statusSetor") && (
                <FormField
                  control={danaMandiriForm.control}
                  name="tanggalSetor"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Setor</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isLoading}
                            >
                              {field.value ? (
                                format(field.value, "dd MMMM yyyy")
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
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isLoading}>
                    Batal
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...ikataForm}>
            <form onSubmit={ikataForm.handleSubmit(onSubmitIkata)} className="space-y-4">
              {isSuperUser && (
                <FormField
                  control={ikataForm.control}
                  name="keluargaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kepala Keluarga</FormLabel>
                      <FormControl>
                        <div id="keluarga-dropdown-container" className="relative">
                          <Input
                            placeholder="Cari kepala keluarga..."
                            className="w-full"
                            value={searchKeluarga}
                            onChange={(e) => {
                              setSearchKeluarga(e.target.value);
                              setShowKeluargaList(true);
                            }}
                            onFocus={() => setShowKeluargaList(true)}
                          />
                          {showKeluargaList && (
                            <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-md max-h-[200px] overflow-y-auto">
                              {filteredKeluargaOptions.length > 0 ? (
                                filteredKeluargaOptions.map((keluarga) => (
                                  <div
                                    key={keluarga.id}
                                    className="px-3 py-2 cursor-pointer hover:bg-accent"
                                    onClick={() => {
                                      field.onChange(keluarga.id);
                                      setSearchKeluarga(keluarga.namaKepalaKeluarga);
                                      setShowKeluargaList(false);
                                    }}
                                  >
                                    {keluarga.namaKepalaKeluarga}
                                  </div>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-muted-foreground">Tidak ada hasil</div>
                              )}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={ikataForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Pembayaran</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleIkataStatusChange(value)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LUNAS">Lunas</SelectItem>
                        <SelectItem value="SEBAGIAN_BULAN">Sebagian Bulan</SelectItem>
                        <SelectItem value="BELUM_BAYAR">Belum Bayar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {(ikataForm.watch("status") === "LUNAS" || ikataForm.watch("status") === "SEBAGIAN_BULAN") && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={ikataForm.control}
                    name="bulanAwal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bulan Awal</FormLabel>
                        <Select
                          disabled={isLoading || (ikataForm.watch("status") === "LUNAS")}
                          onValueChange={(value) => field.onChange(parseInt(value, 10))}
                          value={field.value?.toString() || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih bulan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Januari</SelectItem>
                            <SelectItem value="2">Februari</SelectItem>
                            <SelectItem value="3">Maret</SelectItem>
                            <SelectItem value="4">April</SelectItem>
                            <SelectItem value="5">Mei</SelectItem>
                            <SelectItem value="6">Juni</SelectItem>
                            <SelectItem value="7">Juli</SelectItem>
                            <SelectItem value="8">Agustus</SelectItem>
                            <SelectItem value="9">September</SelectItem>
                            <SelectItem value="10">Oktober</SelectItem>
                            <SelectItem value="11">November</SelectItem>
                            <SelectItem value="12">Desember</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={ikataForm.control}
                    name="bulanAkhir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bulan Akhir</FormLabel>
                        <Select
                          disabled={isLoading || (ikataForm.watch("status") === "LUNAS")}
                          onValueChange={(value) => field.onChange(parseInt(value, 10))}
                          value={field.value?.toString() || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih bulan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Januari</SelectItem>
                            <SelectItem value="2">Februari</SelectItem>
                            <SelectItem value="3">Maret</SelectItem>
                            <SelectItem value="4">April</SelectItem>
                            <SelectItem value="5">Mei</SelectItem>
                            <SelectItem value="6">Juni</SelectItem>
                            <SelectItem value="7">Juli</SelectItem>
                            <SelectItem value="8">Agustus</SelectItem>
                            <SelectItem value="9">September</SelectItem>
                            <SelectItem value="10">Oktober</SelectItem>
                            <SelectItem value="11">November</SelectItem>
                            <SelectItem value="12">Desember</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <FormField
                control={ikataForm.control}
                name="tahun"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tahun</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={ikataForm.control}
                name="jumlahDibayar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Dibayar</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        disabled={isLoading || ikataForm.watch("status") === "BELUM_BAYAR"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isLoading}>
                    Batal
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Untuk keperluan inline form description
function FormDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-muted-foreground">
      {children}
    </p>
  )
} 