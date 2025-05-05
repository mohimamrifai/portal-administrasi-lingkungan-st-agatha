"use client";

import * as React from "react";

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

// Import komponen
import { PeriodFilter } from "./period-filter";
import { KeuanganLingkunganCards } from "./keuangan-lingkungan-cards";
import { KeuanganIkataCards } from "./keuangan-ikata-cards";
import { KesekretariatanCards } from "./kesekretariatan-cards";
import { PenunggakDanaMandiriTable, PenunggakIkataTable } from "./penunggak-table";

// Tipe data untuk props
import type { 
  KeuanganLingkunganSummary,
  KeuanganIkataSummary,
  KesekretariatanSummary,
  PenunggakDanaMandiri,
  PenunggakIkata
} from "../types";

// Tipe props untuk komponen
interface DashboardContentProps {
  keuanganLingkunganData: KeuanganLingkunganSummary;
  keuanganIkataData: KeuanganIkataSummary;
  kesekretariatanData: KesekretariatanSummary;
  penunggakDanaMandiri: PenunggakDanaMandiri[];
  penunggakIkata: PenunggakIkata[];
  userRole: string;
}

export default function DashboardContent({
  keuanganLingkunganData,
  keuanganIkataData,
  kesekretariatanData,
  penunggakDanaMandiri,
  penunggakIkata,
  userRole,
}: DashboardContentProps) {
  // Cek akses berdasarkan role sesuai dengan enum Role di schema.prisma
  const canViewKeuanganLingkungan = [
    'SUPER_USER', 
    'KETUA', 
    'WAKIL_KETUA',
    'BENDAHARA'
  ].includes(userRole);
  
  const canViewKeuanganIkata = [
    'SUPER_USER', 
    'KETUA', 
    'WAKIL_KETUA',
    'WAKIL_BENDAHARA'
  ].includes(userRole);
  
  const canViewKesekretariatan = [
    'SUPER_USER', 
    'KETUA', 
    'WAKIL_KETUA',
    'SEKRETARIS', 
    'WAKIL_SEKRETARIS',
    'UMAT'
  ].includes(userRole);
  
  // Semua pengguna dapat melihat daftar penunggak pada dashboard
  const canViewPenunggak = true;

  return (
    <div className="space-y-8 p-2">
      {/* Filter Periode */}
      <div className="w-full">
        <PeriodFilter />
      </div>
      
      {/* Resume Keuangan Lingkungan */}
      {canViewKeuanganLingkungan && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Resume Keuangan Lingkungan</h2>
          <KeuanganLingkunganCards data={keuanganLingkunganData} />
        </div>
      )}
      
      {/* Resume Keuangan IKATA */}
      {canViewKeuanganIkata && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Resume Keuangan IKATA</h2>
          <KeuanganIkataCards data={keuanganIkataData} />
        </div>
      )}
      
      {/* Resume Kesekretariatan */}
      {canViewKesekretariatan && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Resume Kesekretariatan</h2>
          <KesekretariatanCards data={kesekretariatanData} />
        </div>
      )}
      
      {/* Daftar Penunggak */}
      {canViewPenunggak && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Daftar Kepala Keluarga Penunggak</h2>
          
          <Tabs defaultValue="dana-mandiri" className="w-full">
            <div className="mb-4">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger 
                  value="dana-mandiri" 
                  className="flex-1 sm:flex-initial"
                >
                  Dana Mandiri
                </TabsTrigger>
                <TabsTrigger 
                  value="ikata" 
                  className="flex-1 sm:flex-initial"
                >
                  IKATA
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="dana-mandiri" className="mt-0">
              <PenunggakDanaMandiriTable data={penunggakDanaMandiri} />
            </TabsContent>
            
            <TabsContent value="ikata" className="mt-0">
              <PenunggakIkataTable data={penunggakIkata} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
} 