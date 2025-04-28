"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RiwayatDoling, RekapitulasiKegiatan } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, X, DownloadIcon, CalendarIcon, TrendingUpIcon } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface RiwayatDolingContentProps {
  riwayat: RiwayatDoling[];
  rekapitulasi: RekapitulasiKegiatan[];
}

export function RiwayatDolingContent({ riwayat, rekapitulasi }: RiwayatDolingContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("all");
  const [sortBy, setSortBy] = useState("nama"); // nama, kehadiran, persentase
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc

  // Opsi periode tersedia
  const periodeOptions = [
    { value: "all", label: "Semua Periode" },
    { value: "2024", label: "Tahun 2024" },
    { value: "2023", label: "Tahun 2023" },
    { value: "2022", label: "Tahun 2022" },
  ];

  // Opsi bulan tersedia
  const bulanOptions = [
    { value: "all", label: "Semua Bulan" },
    { value: "April 2024", label: "April 2024" },
    { value: "Maret 2024", label: "Maret 2024" },
    { value: "Februari 2024", label: "Februari 2024" },
  ];
  
  // Filter riwayat berdasarkan pencarian
  const filteredRiwayat = riwayat.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Urutkan data
  const sortedRiwayat = [...filteredRiwayat].sort((a, b) => {
    if (sortBy === "nama") {
      return sortOrder === "asc" 
        ? a.nama.localeCompare(b.nama) 
        : b.nama.localeCompare(a.nama);
    } else if (sortBy === "kehadiran") {
      return sortOrder === "asc" 
        ? a.totalHadir - b.totalHadir 
        : b.totalHadir - a.totalHadir;
    } else {
      return sortOrder === "asc" 
        ? a.persentase - b.persentase 
        : b.persentase - a.persentase;
    }
  });
  
  // Filter rekapitulasi berdasarkan periode
  const filteredRekapitulasi = rekapitulasi.filter(item => {
    if (selectedPeriode === "all") return true;
    return item.bulan.includes(selectedPeriode);
  });
  
  // Fungsi untuk mendapatkan warna badge berdasarkan persentase
  const getBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "default";
    if (percentage >= 40) return "outline";
    return "destructive";
  };
  
  // Handler untuk cetak riwayat
  const handleCetakRiwayat = () => {
    toast.success("Fitur cetak riwayat sedang dalam pengembangan");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Riwayat Doa Lingkungan</h2>
          <p className="text-muted-foreground">Rincian kegiatan dan absensi doa lingkungan</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleCetakRiwayat}
          className="flex items-center gap-2"
        >
          <DownloadIcon className="h-4 w-4" />
          Cetak Riwayat
        </Button>
      </div>
      
      {/* Visualisasi Trend Kehadiran */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUpIcon className="h-5 w-5 text-primary" />
            Trend Kehadiran
          </CardTitle>
          <CardDescription>Persentase kehadiran anggota dalam 6 bulan terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <div className="h-full w-full flex flex-col">
              <div className="flex-1 flex items-end justify-between px-4">
                {rekapitulasi.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-16 bg-primary rounded-t-md relative overflow-hidden"
                      style={{ height: `${(item.rataRataHadir / 40) * 100}%` }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 text-xs text-white text-center p-1">
                        {item.rataRataHadir}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between px-4 mt-2">
                {rekapitulasi.map((item, index) => (
                  <div key={index} className="text-xs font-medium">
                    {item.bulan.split(" ")[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rekapitulasi Kehadiran */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Rekapitulasi Kehadiran</CardTitle>
                <div className="flex gap-2">
                  <Select
                    value={sortBy}
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Urutkan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nama">Nama</SelectItem>
                      <SelectItem value="kehadiran">Total Hadir</SelectItem>
                      <SelectItem value="persentase">Persentase</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="h-9 w-9"
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>
              
              <div className="relative mt-2">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari anggota..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    className="absolute right-0 top-0 h-9 w-9 p-0"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead className="text-center">Total Hadir</TableHead>
                      <TableHead className="text-center">Persentase</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedRiwayat.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                          Tidak ada data yang sesuai dengan pencarian
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedRiwayat.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.nama}</TableCell>
                          <TableCell className="text-center">{item.totalHadir}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={getBadgeVariant(item.persentase)}>
                              {item.persentase}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Rekapitulasi Kegiatan */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Rekapitulasi Kegiatan</CardTitle>
                <Select
                  value={selectedPeriode}
                  onValueChange={setSelectedPeriode}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Pilih Periode" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bulan</TableHead>
                      <TableHead className="text-center">Jumlah Kegiatan</TableHead>
                      <TableHead className="text-center">Rata-rata Hadir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRekapitulasi.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                          Tidak ada data untuk periode yang dipilih
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRekapitulasi.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.bulan}</TableCell>
                          <TableCell className="text-center">
                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {item.jumlahKegiatan}x
                            </span>
                          </TableCell>
                          <TableCell className="text-center">{item.rataRataHadir} orang</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Summary Card */}
              {filteredRekapitulasi.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Total Kegiatan</div>
                      <div className="text-2xl font-bold mt-1">
                        {filteredRekapitulasi.reduce((sum, item) => sum + item.jumlahKegiatan, 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Kehadiran Tertinggi</div>
                      <div className="text-2xl font-bold mt-1">
                        {Math.max(...filteredRekapitulasi.map(item => item.rataRataHadir))}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Rata-rata</div>
                      <div className="text-2xl font-bold mt-1">
                        {Math.round(
                          filteredRekapitulasi.reduce((sum, item) => sum + item.rataRataHadir, 0) / 
                          filteredRekapitulasi.length
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 