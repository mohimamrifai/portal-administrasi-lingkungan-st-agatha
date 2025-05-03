import { Suspense } from "react";
import LoadingSkeleton from "./components/loading-skeleton";
import AgendaContent from "./components/agenda-content";
import { getAgendas } from "./actions";
import { Agenda, ProcessTarget, AgendaStatus } from "./types";

export default async function AgendaPage() {
  // Mengambil data agenda menggunakan server action
  const agendaData = await getAgendas();
  
  // Mengkonversi tipe data dari database ke tipe Agenda
  const agendas = agendaData.map(agenda => {
    // Validasi target
    const targetValue = ['lingkungan', 'stasi', 'paroki'].includes(agenda.target) 
      ? agenda.target as ProcessTarget
      : 'lingkungan' as ProcessTarget;
    
    // Validasi status
    const validStatus = [
      'open', 'processing_lingkungan', 'processing_stasi', 
      'processing_paroki', 'forwarded_to_paroki', 'rejected', 'completed'
    ];
    const statusValue = validStatus.includes(agenda.status)
      ? agenda.status as AgendaStatus
      : 'open' as AgendaStatus;
    
    return {
      id: agenda.id,
      title: agenda.title,
      description: agenda.description,
      date: new Date(agenda.date),
      location: agenda.location,
      target: targetValue,
      status: statusValue,
      createdBy: agenda.createdBy,
      createdAt: new Date(agenda.createdAt),
      updatedAt: new Date(agenda.updatedAt),
      // Menambahkan completedAt jika statusnya completed, atau undefined
      completedAt: statusValue === 'completed' ? new Date() : undefined,
      rejectionReason: agenda.rejectionReason || undefined
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