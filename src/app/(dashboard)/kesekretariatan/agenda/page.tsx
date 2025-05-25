import { Suspense } from "react";
import LoadingSkeleton from "./components/loading-skeleton";
import AgendaContent from "./components/agenda-content";
import { getAgendas } from "./actions";
import { Agenda, ProcessTarget, AgendaStatus } from "./types";
import { Pengajuan, TujuanPengajuan } from "@prisma/client";
import { prisma } from "@/lib/db";

export default async function AgendaPage() {
  // Mengambil data agenda menggunakan server action dengan include user data dan keluarga
  const agendaData = await prisma.pengajuan.findMany({
    include: {
      pengaju: {
        select: {
          id: true,
          username: true,
          keluarga: {
            select: {
              namaKepalaKeluarga: true
            }
          }
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });
  
  // Mengkonversi tipe data dari database ke tipe Agenda
  const agendas = agendaData.map((agenda) => {
    // Validasi target
    const targetValue = (() => {
      switch (agenda.tujuan) {
        case TujuanPengajuan.DPL: return 'lingkungan';
        case TujuanPengajuan.STASI: return 'stasi';
        case TujuanPengajuan.PAROKI: return 'paroki';
        default: return 'lingkungan';
      }
    })() as ProcessTarget;
    
    // Validasi status
    const statusValue = agenda.status === 'OPEN' ? 'open' : 'completed' as AgendaStatus;
    
    // Ambil nama kepala keluarga jika ada, jika tidak gunakan username
    const displayName = agenda.pengaju.keluarga?.namaKepalaKeluarga || agenda.pengaju.username;
    
    return {
      id: agenda.id,
      title: agenda.perihal || "",
      description: agenda.alasanPenolakan || "",
      date: new Date(agenda.tanggal),
      location: agenda.alasanPenolakan || "", // Gunakan field lain yang tersedia
      target: targetValue,
      status: statusValue,
      createdBy: {
        id: agenda.pengaju.id,
        name: displayName
      },
      createdAt: new Date(agenda.createdAt),
      updatedAt: new Date(agenda.updatedAt),
      // Menambahkan completedAt jika statusnya completed, atau undefined
      completedAt: statusValue === 'completed' ? new Date() : undefined,
      rejectionReason: agenda.alasanPenolakan || ""
    } as Agenda;
  });
  
  return (
    <div className="p-2 px-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <AgendaContent initialAgendas={agendas} />
      </Suspense>
    </div>
  );
} 