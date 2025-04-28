"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KaleidoskopData } from "../types";
import { 
  UsersIcon, 
  CalendarIcon, 
  HomeIcon, 
  BookIcon, 
  BarChart2,
  TrendingUpIcon,
  TrendingDownIcon,
  PieChartIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface KaleidoskopContentProps {
  data: KaleidoskopData;
}

export function KaleidoskopContent({ data }: KaleidoskopContentProps) {
  const [selectedYear, setSelectedYear] = useState("2024");
  
  // Mock data untuk visualisasi dan tabel
  const yearOptions = ["2024", "2023", "2022"];
  
  // Data per bulan untuk grafik (akan digantikan dengan data dari API)
  const bulanData = [
    { bulan: "Jan", kehadiran: 85, kegiatan: 4 },
    { bulan: "Feb", kehadiran: 78, kegiatan: 4 },
    { bulan: "Mar", kehadiran: 82, kegiatan: 5 },
    { bulan: "Apr", kehadiran: 88, kegiatan: 4 },
    { bulan: "Mei", kehadiran: 92, kegiatan: 4 },
    { bulan: "Jun", kehadiran: 80, kegiatan: 4 },
    { bulan: "Jul", kehadiran: 75, kegiatan: 3 },
    { bulan: "Agt", kehadiran: 70, kegiatan: 4 },
    { bulan: "Sep", kehadiran: 82, kegiatan: 4 },
    { bulan: "Okt", kehadiran: 88, kegiatan: 4 },
    { bulan: "Nov", kehadiran: 90, kegiatan: 4 },
    { bulan: "Des", kehadiran: 95, kegiatan: 4 },
  ];
  
  // Data 10 KK paling aktif
  const topKK = [
    { nama: "Budi Santoso", hadir: 48, persentase: 100 },
    { nama: "Joko Susilo", hadir: 46, persentase: 96 },
    { nama: "Ahmad Fauzi", hadir: 45, persentase: 94 },
    { nama: "Herman Wijaya", hadir: 43, persentase: 90 },
    { nama: "Bambang Dwi", hadir: 42, persentase: 88 },
    { nama: "Sutrisno", hadir: 40, persentase: 83 },
    { nama: "Agus Handoko", hadir: 38, persentase: 79 },
    { nama: "Rudi Hartono", hadir: 36, persentase: 75 },
    { nama: "Dedi Purwanto", hadir: 35, persentase: 73 },
    { nama: "Eko Setiawan", hadir: 34, persentase: 71 },
  ];
  
  // Data 5 KK paling tidak aktif
  const bottomKK = [
    { nama: "Hadi Nugroho", hadir: 5, persentase: 10 },
    { nama: "Gunawan", hadir: 8, persentase: 17 },
    { nama: "Tono Santoso", hadir: 10, persentase: 21 },
    { nama: "Widodo Prayitno", hadir: 12, persentase: 25 },
    { nama: "Andi Susanto", hadir: 14, persentase: 29 },
  ];
  
  // Data lokasi doa lingkungan
  const lokasiDoling = [
    { nama: "Budi Santoso", alamat: "Jl. Merdeka No. 123", frekuensi: 4 },
    { nama: "Joko Susilo", alamat: "Jl. Diponegoro No. 45", frekuensi: 3 },
    { nama: "Ani Wijaya", alamat: "Jl. Sudirman No. 67", frekuensi: 3 },
    { nama: "Siti Rahayu", alamat: "Jl. Pahlawan No. 89", frekuensi: 2 },
    { nama: "Hadi Pratama", alamat: "Jl. Veteran No. 12", frekuensi: 2 },
  ];
  
  // Fungsi untuk menghitung tingkat hadir rata-rata
  const calculateAverageAttendance = () => {
    const total = bulanData.reduce((sum, item) => sum + item.kehadiran, 0);
    return (total / bulanData.length).toFixed(1);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Kaleidoskop Doa Lingkungan</h2>
          <p className="text-muted-foreground">Rekapitulasi kegiatan doa lingkungan secara menyeluruh</p>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Pilih Tahun" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map(year => (
              <SelectItem key={year} value={year}>
                Tahun {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Datacard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kegiatan</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalKegiatan}</div>
            <p className="text-xs text-muted-foreground">
              Kegiatan dalam setahun
            </p>
            <div className="mt-2 text-sm flex items-center">
              <Badge variant="outline" className="gap-1 px-2 py-1">
                <TrendingUpIcon className="h-3 w-3 text-green-500" />
                <span>+4% dari tahun lalu</span>
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Kehadiran</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.rataRataKehadiran}%</div>
            <p className="text-xs text-muted-foreground">
              Tingkat partisipasi umat
            </p>
            <div className="mt-2 text-sm flex items-center">
              <Badge variant="outline" className="gap-1 px-2 py-1">
                <TrendingUpIcon className="h-3 w-3 text-green-500" />
                <span>+2.5% dari bulan lalu</span>
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total KK Aktif</CardTitle>
            <HomeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalKKAktif}</div>
            <p className="text-xs text-muted-foreground">
              Dari 68 total kepala keluarga
            </p>
            <div className="mt-2 text-sm flex items-center">
              <Badge variant="outline" className="gap-1 px-2 py-1">
                <TrendingDownIcon className="h-3 w-3 text-red-500" />
                <span>-3 dari bulan lalu</span>
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tuan Rumah Aktif</CardTitle>
            <BookIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              KK yang pernah menjadi tuan rumah
            </p>
            <div className="mt-2 text-sm flex items-center">
              <Badge variant="outline" className="gap-1 px-2 py-1">
                <TrendingUpIcon className="h-3 w-3 text-green-500" />
                <span>+2 dari bulan lalu</span>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="partisipasi" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full">
          <TabsTrigger value="partisipasi">Partisipasi</TabsTrigger>
          <TabsTrigger value="top-kk">KK Teraktif</TabsTrigger>
          <TabsTrigger value="bottom-kk">KK Terinaktif</TabsTrigger>
          <TabsTrigger value="lokasi">Lokasi Doling</TabsTrigger>
        </TabsList>
        
        {/* Tab Partisipasi */}
        <TabsContent value="partisipasi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grafik Partisipasi Umat Tahun {selectedYear}</CardTitle>
              <CardDescription>
                Persentase kehadiran umat di kegiatan doa lingkungan per bulan
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px] w-full">
                {/* Chart akan diimplementasikan menggunakan library chart seperti recharts */}
                <div className="h-full w-full flex items-end justify-between px-4">
                  {bulanData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-12 bg-primary rounded-t-md"
                        style={{ height: `${item.kehadiran * 2.5}px` }}
                      >
                        <div className="text-xs text-white text-center p-1">
                          {item.kehadiran}%
                        </div>
                      </div>
                      <div className="text-xs font-medium mt-2">{item.bulan}</div>
                      <div className="text-xs text-muted-foreground">{item.kegiatan}x</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Analisis Tingkat Partisipasi</CardTitle>
                <CardDescription>Temuan penting dari data kehadiran</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Bulan dengan Partisipasi Tertinggi</div>
                      <Badge variant="outline">Desember</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tingkat kehadiran sebesar 95% (46 dari 48 KK hadir)
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Bulan dengan Partisipasi Terendah</div>
                      <Badge variant="outline">Agustus</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tingkat kehadiran sebesar 70% (33 dari 47 KK hadir)
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Rata-rata Tingkat Kehadiran</div>
                      <Badge variant="outline">{calculateAverageAttendance()}%</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total kegiatan yang dilaksanakan sebanyak 48 kali
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Kehadiran</CardTitle>
                <CardDescription>Sebaran tingkat kehadiran KK</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Hadir &gt;80%</div>
                      <Badge variant="success">20 KK</Badge>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "30%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Hadir 60-80%</div>
                      <Badge variant="default">15 KK</Badge>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: "22%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Hadir 40-60%</div>
                      <Badge variant="outline">10 KK</Badge>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-yellow-500" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Hadir &lt;40%</div>
                      <Badge variant="destructive">5 KK</Badge>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-red-500" style={{ width: "7%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab KK Teraktif */}
        <TabsContent value="top-kk">
          <Card>
            <CardHeader>
              <CardTitle>10 Kepala Keluarga Paling Aktif</CardTitle>
              <CardDescription>
                Berdasarkan tingkat kehadiran dalam kegiatan doa lingkungan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-2 text-left font-medium">No</th>
                      <th className="p-2 text-left font-medium">Nama Kepala Keluarga</th>
                      <th className="p-2 text-left font-medium">Kehadiran</th>
                      <th className="p-2 text-left font-medium">Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topKK.map((kk, index) => (
                      <tr key={index} className="border-t hover:bg-muted/50">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2 font-medium">{kk.nama}</td>
                        <td className="p-2">{kk.hadir} dari 48</td>
                        <td className="p-2">
                          <Badge variant={kk.persentase >= 80 ? "success" : kk.persentase >= 60 ? "default" : kk.persentase >= 40 ? "outline" : "destructive"}>
                            {kk.persentase}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab KK Terinaktif */}
        <TabsContent value="bottom-kk">
          <Card>
            <CardHeader>
              <CardTitle>5 Kepala Keluarga Paling Tidak Aktif</CardTitle>
              <CardDescription>
                Berdasarkan tingkat ketidakhadiran dalam kegiatan doa lingkungan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-2 text-left font-medium">No</th>
                      <th className="p-2 text-left font-medium">Nama Kepala Keluarga</th>
                      <th className="p-2 text-left font-medium">Kehadiran</th>
                      <th className="p-2 text-left font-medium">Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bottomKK.map((kk, index) => (
                      <tr key={index} className="border-t hover:bg-muted/50">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2 font-medium">{kk.nama}</td>
                        <td className="p-2">{kk.hadir} dari 48</td>
                        <td className="p-2">
                          <Badge variant={kk.persentase >= 80 ? "success" : kk.persentase >= 60 ? "default" : kk.persentase >= 40 ? "outline" : "destructive"}>
                            {kk.persentase}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab Lokasi */}
        <TabsContent value="lokasi">
          <Card>
            <CardHeader>
              <CardTitle>Lokasi Doa Lingkungan Terbanyak</CardTitle>
              <CardDescription>
                Berdasarkan frekuensi penggunaan rumah sebagai tempat doa lingkungan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-2 text-left font-medium">No</th>
                      <th className="p-2 text-left font-medium">Nama Tuan Rumah</th>
                      <th className="p-2 text-left font-medium">Alamat</th>
                      <th className="p-2 text-left font-medium">Frekuensi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lokasiDoling.map((lokasi, index) => (
                      <tr key={index} className="border-t hover:bg-muted/50">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2 font-medium">{lokasi.nama}</td>
                        <td className="p-2">{lokasi.alamat}</td>
                        <td className="p-2">
                          <Badge variant="outline">
                            {lokasi.frekuensi} kali
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 