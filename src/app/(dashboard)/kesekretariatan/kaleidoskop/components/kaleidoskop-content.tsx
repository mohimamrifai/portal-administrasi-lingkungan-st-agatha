"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useAuth } from "@/contexts/auth-context";
import { ROLES } from "@/contexts/auth-context";

// Definisi tipe
export interface KaleidoskopData {
  totalKegiatan: number;
  rataRataKehadiran: number;
  totalKKAktif: number;
}

export function KaleidoskopContent() {
  const { userRole } = useAuth();
  const [selectedYear, setSelectedYear] = useState("2024");
  
  // Memeriksa apakah pengguna memiliki akses
  const hasAccess = [
    ROLES.SUPER_USER,
    ROLES.SEKRETARIS,
    ROLES.WAKIL_SEKRETARIS,
  ].includes(userRole);
  
  // Data untuk simulasi
  const data: KaleidoskopData = {
    totalKegiatan: 48,
    rataRataKehadiran: 83,
    totalKKAktif: 42
  };
  
  // Mock data untuk visualisasi dan tabel
  const yearOptions = ["2024", "2023", "2022"];
  
  // Data per bulan untuk grafik
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
  
  // Jika pengguna tidak memiliki akses, tampilkan pesan
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold mb-2">Akses Terbatas</h2>
        <p className="text-muted-foreground text-center">
          Maaf, Anda tidak memiliki akses untuk melihat halaman Kaleidoskop.
          <br />
          Hanya SuperUser, Sekretaris, dan Wakil Sekretaris yang dapat mengakses halaman ini.
        </p>
      </div>
    );
  }
  
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
                      Tingkat kehadiran sebesar 70% (34 dari 48 KK hadir)
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Rata-rata Kehadiran Tahunan</div>
                      <Badge variant="outline">{calculateAverageAttendance()}%</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Mengalami kenaikan 3.5% dari tahun sebelumnya
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tren dan Pola Kehadiran</CardTitle>
                <CardDescription>Insight berdasarkan analisis data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Tren Tahunan</div>
                    <div className="text-sm text-muted-foreground">
                      Terjadi peningkatan partisipasi pada bulan-bulan menjelang akhir tahun, 
                      terutama di November dan Desember.
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Pola Musiman</div>
                    <div className="text-sm text-muted-foreground">
                      Kehadiran cenderung menurun pada bulan liburan sekolah (Juli-Agustus) 
                      dan meningkat setelahnya.
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Faktor Pengaruh</div>
                    <div className="text-sm text-muted-foreground">
                      Pertemuan dengan tema khusus (perayaan) memiliki tingkat kehadiran 
                      15% lebih tinggi dibanding pertemuan reguler.
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
              <CardTitle>KK dengan Tingkat Kehadiran Tertinggi</CardTitle>
              <CardDescription>
                10 Kepala Keluarga dengan partisipasi terbaik selama tahun {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-3">No</th>
                      <th scope="col" className="px-4 py-3">Nama</th>
                      <th scope="col" className="px-4 py-3">Kehadiran</th>
                      <th scope="col" className="px-4 py-3">Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topKK.map((kk, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2 font-medium">{kk.nama}</td>
                        <td className="px-4 py-2">{kk.hadir} / 48</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center">
                            <span className="mr-2">{kk.persentase}%</span>
                            <div className="w-[100px] bg-muted rounded-full h-2 mr-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${kk.persentase}%` }}
                              ></div>
                            </div>
                          </div>
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
              <CardTitle>KK dengan Tingkat Kehadiran Terendah</CardTitle>
              <CardDescription>
                5 Kepala Keluarga dengan partisipasi terendah selama tahun {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-3">No</th>
                      <th scope="col" className="px-4 py-3">Nama</th>
                      <th scope="col" className="px-4 py-3">Kehadiran</th>
                      <th scope="col" className="px-4 py-3">Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bottomKK.map((kk, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2 font-medium">{kk.nama}</td>
                        <td className="px-4 py-2">{kk.hadir} / 48</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center">
                            <span className="mr-2">{kk.persentase}%</span>
                            <div className="w-[100px] bg-muted rounded-full h-2 mr-2">
                              <div
                                className="bg-destructive h-2 rounded-full"
                                style={{ width: `${kk.persentase}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-md">
                <h4 className="font-medium mb-2">Rekomendasi Tindak Lanjut</h4>
                <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                  <li>Melakukan kunjungan pastoral oleh ketua lingkungan</li>
                  <li>Mengundang secara personal untuk kegiatan selanjutnya</li>
                  <li>Menanyakan kebutuhan dan kendala yang dihadapi</li>
                  <li>Mempertimbangkan lokasi yang lebih mudah dijangkau</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab Lokasi */}
        <TabsContent value="lokasi">
          <Card>
            <CardHeader>
              <CardTitle>Lokasi Pelaksanaan Doa Lingkungan</CardTitle>
              <CardDescription>
                KK yang paling sering menjadi tuan rumah selama tahun {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-3">No</th>
                      <th scope="col" className="px-4 py-3">Nama</th>
                      <th scope="col" className="px-4 py-3">Alamat</th>
                      <th scope="col" className="px-4 py-3">Frekuensi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lokasiDoling.map((lokasi, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2 font-medium">{lokasi.nama}</td>
                        <td className="px-4 py-2">{lokasi.alamat}</td>
                        <td className="px-4 py-2">{lokasi.frekuensi}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Distribusi Lokasi</div>
                <div className="text-sm text-muted-foreground">
                  <p>Dari total 48 kegiatan doa lingkungan:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>23 kepala keluarga (34%) telah menjadi tuan rumah minimal 1 kali</li>
                    <li>5 kepala keluarga (7%) menjadi tuan rumah lebih dari 2 kali</li>
                    <li>45 kepala keluarga (66%) belum pernah menjadi tuan rumah</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 