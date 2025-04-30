"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AgendaFormDialog } from "./agenda-form-dialog";
import { AgendaTable } from "./agenda-table";
import { ProcessDialog } from "./process-dialog";
import { UpdateStatusDialog } from "./update-status-dialog";
import { FinalResultDialog } from "./final-result-dialog";
import { RejectionDialog } from "./rejection-dialog";
import { Agenda, AgendaFormValues, ProcessTarget, RejectionFormValues } from "../types";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Search } from "lucide-react";
import { useMockData } from "../utils/use-mock-data";
import { useAuth } from "@/contexts/auth-context";

export default function AgendaContent() {
  const { mockAgendas, mockUser } = useMockData();
  const { userRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [isFinalResultDialogOpen, setIsFinalResultDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | undefined>();
  const [agendas, setAgendas] = useState<Agenda[]>(mockAgendas);

  // Cek apakah pengguna adalah umat atau pengurus
  const isUmatRole = userRole === 'umat';

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(
    agendas.filter((agenda) =>
      agenda.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agenda.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).length / itemsPerPage
  );

  // Auto-delete completed agendas weekly on Sunday at 00:00
  useEffect(() => {
    const checkDay = () => {
      const now = new Date();
      if (now.getDay() === 0 && now.getHours() === 0 && now.getMinutes() === 0) {
        // It's Sunday at 00:00
        setAgendas(prevAgendas =>
          prevAgendas.filter(agenda =>
            !['completed', 'rejected'].includes(agenda.status)
          )
        );
      }
    };

    // Check every minute
    const interval = setInterval(checkDay, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Send reminder notifications every 3 days at 00:00 for open agendas
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        // It's 00:00
        // Check if today is a day to send reminders (every 3 days)
        const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
        if (dayOfYear % 3 === 0) {
          // Count open agendas
          const openAgendas = agendas.filter(agenda => agenda.status === 'open').length;

          if (openAgendas > 0) {
            toast.info(`Anda memiliki ${openAgendas} agenda yang menunggu tindak lanjut.`, {
              duration: 10000,
            });
          }
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60 * 1000);
    return () => clearInterval(interval);
  }, [agendas]);

  const filteredAgendas = agendas
    .filter((agenda) =>
      agenda.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agenda.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()); // Sort by most recently updated

  const paginatedAgendas = filteredAgendas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddAgenda = async (values: AgendaFormValues) => {
    const newAgenda: Agenda = {
      id: agendas.length + 1,
      ...values,
      status: "open",
      createdBy: {
        id: mockUser.id,
        name: mockUser.name
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setAgendas([...agendas, newAgenda]);
    toast.success("Agenda berhasil diajukan");
  };

  const handleProcessAgenda = (id: number) => {
    const agenda = agendas.find(a => a.id === id);
    if (agenda) {
      setSelectedAgenda(agenda);
      setIsProcessDialogOpen(true);
    }
  };

  const handleUpdateStatusAgenda = (id: number) => {
    const agenda = agendas.find(a => a.id === id);
    if (agenda) {
      setSelectedAgenda(agenda);
      setIsUpdateStatusDialogOpen(true);
    }
  };

  const handleFinalResultAgenda = (id: number): void => {
    const agenda = agendas.find(a => a.id === id);
    if (agenda) {
      setSelectedAgenda(agenda);
      setIsFinalResultDialogOpen(true);
    }
  };

  const handleRejectAgenda = (id: number) => {
    const agenda = agendas.find(a => a.id === id);
    if (agenda) {
      setSelectedAgenda(agenda);
      setIsRejectionDialogOpen(true);
    }
  };

  const handleProcessSubmit = (processTarget: ProcessTarget) => {
    if (!selectedAgenda) return;

    const status = `processing_${processTarget}` as Agenda['status'];

    const updatedAgendas = agendas.map((agenda) =>
      agenda.id === selectedAgenda.id
        ? {
          ...agenda,
          status,
          updatedAt: new Date()
        }
        : agenda
    );

    setAgendas(updatedAgendas);

    // Send notification to the agenda creator
    toast.info(`Agenda "${selectedAgenda.title}" diproses di ${processTarget === 'lingkungan' ? 'Lingkungan' : processTarget === 'stasi' ? 'Stasi' : 'Paroki'}`);
  };

  const handleUpdateStatusSubmit = (status: 'forwarded_to_paroki' | 'completed' | 'rejected') => {
    if (!selectedAgenda) return;

    if (status === 'rejected') {
      // If rejected, we'll open the rejection dialog
      setIsUpdateStatusDialogOpen(false);
      setIsRejectionDialogOpen(true);
      return;
    }

    const updatedAgendas = agendas.map((agenda) =>
      agenda.id === selectedAgenda.id
        ? {
          ...agenda,
          status,
          updatedAt: new Date(),
          completedAt: status === 'completed' ? new Date() : undefined
        }
        : agenda
    );

    setAgendas(updatedAgendas);

    // Send notification to the agenda creator
    if (status === 'forwarded_to_paroki') {
      toast.info(`Agenda "${selectedAgenda.title}" telah diteruskan ke Paroki`);
    } else if (status === 'completed') {
      toast.success(`Agenda "${selectedAgenda.title}" telah selesai diproses`);
    }
  };

  const handleFinalResultSubmit = (result: 'completed' | 'rejected') => {
    if (!selectedAgenda) return;

    if (result === 'rejected') {
      // If rejected, we'll open the rejection dialog
      setIsFinalResultDialogOpen(false);
      setIsRejectionDialogOpen(true);
      return;
    }

    const updatedAgendas = agendas.map((agenda) =>
      agenda.id === selectedAgenda.id
        ? {
          ...agenda,
          status: result,
          updatedAt: new Date(),
          completedAt: new Date()
        }
        : agenda
    );

    setAgendas(updatedAgendas);

    // Send notification to the agenda creator
    toast.success(`Agenda "${selectedAgenda.title}" telah selesai diproses`);
  };

  const handleRejectionSubmit = (values: RejectionFormValues) => {
    if (!selectedAgenda) return;

    const updatedAgendas = agendas.map((agenda) =>
      agenda.id === selectedAgenda.id
        ? {
          ...agenda,
          status: 'rejected' as const,
          rejectionReason: values.reason,
          updatedAt: new Date()
        }
        : agenda
    );

    setAgendas(updatedAgendas);

    // Send notification to the agenda creator
    toast.error(`Agenda "${selectedAgenda.title}" ditolak dengan alasan: ${values.reason}`);
  };

  const handleDeleteAgenda = async (id: number) => {
    setAgendas(agendas.filter((agenda) => agenda.id !== id));
    toast.success("Agenda berhasil dihapus");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold">Agenda Lingkungan</h1>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari agenda..."
            className="w-full pl-8 sm:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Tampilkan tombol Pengajuan untuk semua role agar umat dapat mengajukan agenda */}
        <Button
          className="whitespace-nowrap"
          onClick={() => setIsFormDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Pengajuan
        </Button>
      </div>

      <AgendaTable
        agendas={paginatedAgendas}
        onProcess={handleProcessAgenda}
        onUpdateStatus={handleUpdateStatusAgenda}
        onFinalResult={handleFinalResultAgenda}
        onReject={handleRejectAgenda}
        onDelete={handleDeleteAgenda}
        userRole={userRole}
      />

      {/* Pagination controls */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          Halaman {currentPage} dari {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Form dialog untuk pengajuan agenda baru */}
      <AgendaFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSubmit={handleAddAgenda}
      />

      {/* Dialog untuk proses agenda - hanya tampilkan jika bukan role umat */}
      {userRole !== 'umat' && (
        <>
          <ProcessDialog
            open={isProcessDialogOpen}
            onOpenChange={setIsProcessDialogOpen}
            onSubmit={handleProcessSubmit}
          />

          <UpdateStatusDialog
            open={isUpdateStatusDialogOpen}
            onOpenChange={setIsUpdateStatusDialogOpen}
            onSubmit={handleUpdateStatusSubmit}
          />

          <FinalResultDialog
            open={isFinalResultDialogOpen}
            onOpenChange={setIsFinalResultDialogOpen}
            onSubmit={handleFinalResultSubmit}
          />

          <RejectionDialog
            open={isRejectionDialogOpen}
            onOpenChange={setIsRejectionDialogOpen}
            onSubmit={handleRejectionSubmit}
          />
        </>
      )}
    </div>
  );
} 