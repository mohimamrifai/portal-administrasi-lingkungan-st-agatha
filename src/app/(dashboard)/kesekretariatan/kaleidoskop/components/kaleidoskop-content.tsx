"use client";

import { useState, useMemo, useCallback } from "react";
import { PeriodeSelector } from "./periode-selector";
import { dolingData } from "../data/mock-data";
import { filterDataByPeriode } from "../utils/data-utils";
import { ChartBarIcon, Calendar, Users2, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DolingData } from "../types";

// Komponen utama untuk halaman Kaleidoskop
export function KaleidoskopContent({
  periodRange,
  activityData,
  isLoading,
}: {
  periodRange: string;
  activityData: DolingData[];
  isLoading: boolean;
}) {
  // State untuk filter periode
  const currentDate = new Date();
  const [bulanAwal, setBulanAwal] = useState("0"); // Januari
  const [tahunAwal, setTahunAwal] = useState("2024");
  const [bulanAkhir, setBulanAkhir] = useState(currentDate.getMonth().toString()); // Bulan saat ini
  const [tahunAkhir, setTahunAkhir] = useState(currentDate.getFullYear().toString());
  
  // State untuk menyimpan data terfilter saat ini
  const [filteredData, setFilteredData] = useState(() => 
    filterDataByPeriode(dolingData, bulanAwal, tahunAwal, bulanAkhir, tahunAkhir)
  );
  
  // State untuk menampilkan filter
  const [showFilter, setShowFilter] = useState(false);
  
  // Handler untuk tombol "Filter Sekarang"
  const handleFilter = useCallback(() => {
    const newFilteredData = filterDataByPeriode(
      dolingData,
      bulanAwal,
      tahunAwal,
      bulanAkhir,
      tahunAkhir
    );
    setFilteredData(newFilteredData);
    setShowFilter(false);
  }, [bulanAwal, tahunAwal, bulanAkhir, tahunAkhir]);

  // Membuat label periode
  const getPeriodeLabel = () => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    const bulanAwalText = months[parseInt(bulanAwal)];
    const bulanAkhirText = months[parseInt(bulanAkhir)];
    
    if (tahunAwal === tahunAkhir && bulanAwal === bulanAkhir) {
      return `${bulanAwalText} ${tahunAwal}`;
    } else if (tahunAwal === tahunAkhir) {
      return `${bulanAwalText} - ${bulanAkhirText} ${tahunAwal}`;
    } else {
      return `${bulanAwalText} ${tahunAwal} - ${bulanAkhirText} ${tahunAkhir}`;
    }
  };
  
  // Mengelompokkan data berdasarkan jenis ibadat dan sub ibadat
  const groupedIbadatData = useMemo(() => {
    const result: Record<string, Record<string, number>> = {};
    
    filteredData.forEach((item) => {
      const jenisIbadat = item.jenisIbadat;
      const subIbadat = item.subIbadat;
      
      if (!result[jenisIbadat]) {
        result[jenisIbadat] = {};
      }
      
      if (!result[jenisIbadat][subIbadat]) {
        result[jenisIbadat][subIbadat] = 0;
      }
      
      result[jenisIbadat][subIbadat]++;
    });
    
    return result;
  }, [filteredData]);
  
  // Mendapatkan unik jenis ibadat dan total pertemuan
  const ibadatStats = useMemo(() => {
    const jenisIbadatList = Object.keys(groupedIbadatData);
    
    // Hitung total pertemuan untuk setiap jenis ibadat
    const totals = jenisIbadatList.map(jenis => {
      const subIbadats = groupedIbadatData[jenis];
      const total = Object.values(subIbadats).reduce((sum, count) => sum + count, 0);
      const uniqueSubIbadat = Object.keys(subIbadats).length;
      
      return {
        jenisIbadat: jenis,
        totalPertemuan: total,
        uniqueSubIbadat
      };
    });
    
    // Urutkan berdasarkan totalPertemuan (terbanyak dulu)
    return totals.sort((a, b) => b.totalPertemuan - a.totalPertemuan);
  }, [groupedIbadatData]);
  
  // Mendapatkan total statistik
  const totalStats = useMemo(() => {
    const totalPertemuan = filteredData.length;
    const uniqueJenisIbadat = Object.keys(groupedIbadatData).length;
    
    let uniqueSubIbadat = 0;
    Object.values(groupedIbadatData).forEach(subMap => {
      uniqueSubIbadat += Object.keys(subMap).length;
    });
    
    return {
      totalPertemuan,
      uniqueJenisIbadat,
      uniqueSubIbadat
    };
  }, [filteredData, groupedIbadatData]);
  
  // Mendapatkan warna berdasarkan jenisIbadat
  const getColor = (jenisIbadat: string) => {
    const colors = {
      "Doa Bersama": "bg-blue-100 text-blue-700 border-blue-200",
      "Doa Keluarga": "bg-purple-100 text-purple-700 border-purple-200",
      "Makan Malam": "bg-amber-100 text-amber-700 border-amber-200",
    };
    
    return colors[jenisIbadat as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };
  
  // Mendapatkan background color
  const getBgColor = (colorClass: string) => {
    return colorClass.split(' ')[0];
  };
  
  // Mendapatkan text color
  const getTextColor = (colorClass: string) => {
    return colorClass.split(' ')[1];
  };

  return (
    <div className="container mx-auto px-2 py-3 max-w-7xl">
      {/* Header Section */}
      <div className="mb-4 flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ChartBarIcon className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold tracking-tight">Kaleidoskop Doa Lingkungan</h1>
          </div>
          <p className="text-muted-foreground text-xs md:textsm">
            Rekap frekuensi kegiatan doa lingkungan berdasarkan jenis dan sub ibadat
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          <Badge variant="outline" className="px-3 py-1 text-sm font-medium flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{getPeriodeLabel()}</span>
          </Badge>
          
          <button
            className="flex items-center gap-1.5 text-sm px-3 py-1 border rounded-md bg-amber-300 cursor-pointer hover:bg-amber-400 transition-colors"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter Periode
          </button>
        </div>
      </div>
      
      {/* Filter Section */}
      {showFilter && (
        <div className="mb-6 bg-muted/20 border rounded-lg p-4">
          <div className="mb-2 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Filter Periode</h2>
            <button 
              className="text-sm text-muted-foreground"
              onClick={() => setShowFilter(false)}
            >
              Tutup
            </button>
          </div>
          <PeriodeSelector
            bulanAwal={bulanAwal}
            setBulanAwal={setBulanAwal}
            tahunAwal={tahunAwal}
            setTahunAwal={setTahunAwal}
            bulanAkhir={bulanAkhir}
            setBulanAkhir={setBulanAkhir}
            tahunAkhir={tahunAkhir}
            setTahunAkhir={setTahunAkhir}
            onFilter={handleFilter}
          />
        </div>
      )}
      
      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 mb-1">Total Kegiatan</p>
                <h3 className="text-3xl font-bold text-blue-800">{totalStats.totalPertemuan}</h3>
                <p className="text-xs text-blue-600 mt-1">Pertemuan dalam periode {getPeriodeLabel()}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-100 rounded-lg shadow-sm">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 mb-1">Jenis Ibadat</p>
                <h3 className="text-3xl font-bold text-purple-800">{totalStats.uniqueJenisIbadat}</h3>
                <p className="text-xs text-purple-600 mt-1">Kategori ibadat yang dilaksanakan</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <ChartBarIcon className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 rounded-lg shadow-sm">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-amber-600 mb-1">Sub Ibadat</p>
                <h3 className="text-3xl font-bold text-amber-800">{totalStats.uniqueSubIbadat}</h3>
                <p className="text-xs text-amber-600 mt-1">Variasi kegiatan dalam ibadat</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Users2 className="h-5 w-5 text-amber-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div>
        <Tabs defaultValue="kegiatan" className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
            <TabsList>
              <TabsTrigger value="kegiatan">Ringkasan Kegiatan</TabsTrigger>
              <TabsTrigger value="detail">Detail Kegiatan</TabsTrigger>
            </TabsList>
            
            <p className="text-xs text-muted-foreground italic">
              Data periode: {getPeriodeLabel()}
            </p>
          </div>
          
          <TabsContent value="kegiatan" className="mt-0">
            <div className="space-y-4">
              {totalStats.totalPertemuan === 0 ? (
                <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-100">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Tidak ada data</AlertTitle>
                  <AlertDescription>
                    Tidak ada data kegiatan untuk periode {getPeriodeLabel()}. Silakan ubah filter periode atau tambahkan kegiatan baru.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-100">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertTitle>Ringkasan Kegiatan</AlertTitle>
                    <AlertDescription>
                      Terdapat {totalStats.totalPertemuan} kegiatan dari {totalStats.uniqueJenisIbadat} jenis ibadat dengan {totalStats.uniqueSubIbadat} variasi sub ibadat.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ibadatStats.map((stat) => (
                      <div key={stat.jenisIbadat} className="overflow-hidden border rounded-lg shadow-sm">
                        <div className="bg-muted/10 py-3 px-4 border-b">
                          <div className="flex justify-between items-center">
                            <div className="text-base font-semibold flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getBgColor(getColor(stat.jenisIbadat))}`}></div>
                              {stat.jenisIbadat}
                            </div>
                            <Badge variant="outline" className={getColor(stat.jenisIbadat)}>
                              {stat.totalPertemuan} kegiatan
                            </Badge>
                          </div>
                        </div>
                        <div className="p-0">
                          <div className="p-3 border-b bg-muted/5">
                            <div className="flex justify-between items-center text-xs mb-1.5">
                              <span className="text-muted-foreground">{Math.round((stat.totalPertemuan / totalStats.totalPertemuan) * 100)}% dari total kegiatan</span>
                              <span className="font-medium">{stat.totalPertemuan}/{totalStats.totalPertemuan}</span>
                            </div>
                            <Progress value={(stat.totalPertemuan / totalStats.totalPertemuan) * 100} className="h-1.5" />
                          </div>
                          
                          <div className="divide-y">
                            {Object.entries(groupedIbadatData[stat.jenisIbadat] || {})
                              .sort(([, countA], [, countB]) => countB - countA)
                              .map(([subIbadat, count]) => (
                                <div key={subIbadat} className="py-2.5 px-4 flex items-center justify-between hover:bg-muted/5">
                                  <div className="text-sm">{subIbadat}</div>
                                  <Badge variant="outline" className={getColor(stat.jenisIbadat)}>
                                    {count} pertemuan
                                  </Badge>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="detail" className="mt-0">
            <div className="space-y-4">
              {totalStats.totalPertemuan === 0 ? (
                <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-100">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Tidak ada data</AlertTitle>
                  <AlertDescription>
                    Tidak ada data kegiatan untuk periode {getPeriodeLabel()}. Silakan ubah filter periode atau tambahkan kegiatan baru.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {ibadatStats.map((stat) => (
                    <div key={stat.jenisIbadat} className="overflow-hidden border rounded-lg shadow-sm">
                      <div className={`py-3 px-4 ${getBgColor(getColor(stat.jenisIbadat))} border-b`}>
                        <div className="text-base font-semibold flex items-center gap-2">
                          <ChartBarIcon className={`h-4 w-4 ${getTextColor(getColor(stat.jenisIbadat))}`} />
                          <span className={getTextColor(getColor(stat.jenisIbadat))}>{stat.jenisIbadat}</span>
                        </div>
                      </div>
                      <div className="p-0">
                        <ScrollArea className="h-[250px]">
                          <div className="divide-y">
                            {Object.entries(groupedIbadatData[stat.jenisIbadat] || {})
                              .sort(([, countA], [, countB]) => countB - countA)
                              .map(([subIbadat, count]) => (
                                <div key={subIbadat} className="py-3 px-4 flex items-center justify-between">
                                  <div>
                                    <div className="text-sm font-medium">{subIbadat}</div>
                                    <div className="mt-1 flex items-center gap-2">
                                      <Progress 
                                        value={(count / stat.totalPertemuan) * 100} 
                                        className="h-1 w-[100px]" 
                                      />
                                      <span className="text-xs text-muted-foreground">
                                        {Math.round((count / stat.totalPertemuan) * 100)}%
                                      </span>
                                    </div>
                                  </div>
                                  <Badge variant="outline">
                                    {count} pertemuan
                                  </Badge>
                                </div>
                              ))
                            }
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 