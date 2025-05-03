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
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { Agenda, AgendaFormValues, ProcessTarget, RejectionFormValues, AgendaStatus } from "../types";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Search } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { createAgenda, deleteAgenda, updateAgenda } from "../actions";

export default function AgendaContent({ initialAgendas = [] }: { initialAgendas: Agenda[] }) {
  const { userRole, userId, username } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [isFinalResultDialogOpen, setIsFinalResultDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | undefined>();
  const [agendaToDelete, setAgendaToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validasi dan normalisasi initialAgendas
  const [agendas, setAgendas] = useState<Agenda[]>(() => {
    try {
      // Pastikan initialAgendas memiliki format yang diharapkan
      return initialAgendas.map(agenda => ({
        ...agenda,
        // Konversi string date ke Date object jika perlu
        date: agenda.date instanceof Date ? agenda.date : new Date(agenda.date),
        createdAt: agenda.createdAt instanceof Date ? agenda.createdAt : new Date(agenda.createdAt),
        updatedAt: agenda.updatedAt instanceof Date ? agenda.updatedAt : new Date(agenda.updatedAt),
        completedAt: agenda.completedAt ? 
          (agenda.completedAt instanceof Date ? agenda.completedAt : new Date(agenda.completedAt)) 
          : undefined,
        // Format createdBy sesuai kebutuhan UI
        createdBy: typeof agenda.createdBy === 'number' 
          ? { id: agenda.createdBy, name: `User ${agenda.createdBy}` } 
          : agenda.createdBy
      }));
    } catch (error) {
      console.error("Error parsing initial agendas:", error);
      return [];
    }
  });

  // Cek apakah pengguna adalah umat atau pengurus
  const isUmatRole = userRole === 'umat';

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Meningkatkan jumlah item per halaman karena tabel lebih ringkas
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
    try {
      setIsSubmitting(true);
      
      // Jika dalam mode edit, panggil updateAgenda
      if (isEditMode && selectedAgenda) {
        const response = await updateAgenda(selectedAgenda.id, values);
        
        if (response.success) {
          // Jika berhasil, perbarui agenda yang diedit dalam state
          if (response.data) {
            setAgendas(prev => prev.map(agenda => 
              agenda.id === selectedAgenda.id 
                ? {
                    ...response.data,
                    date: new Date(response.data.date),
                    createdAt: new Date(response.data.createdAt),
                    updatedAt: new Date(response.data.updatedAt),
                    createdBy: agenda.createdBy // Pertahankan createdBy yang ada format UI-nya
                  } 
                : agenda
            ));
          }
          toast.success(response.message);
          setIsEditMode(false);
        } else {
          toast.error(response.message);
        }
      } else {
        // Mode tambah agenda baru
        const response = await createAgenda(values);
        
        if (response.success) {
          // Jika berhasil, tambahkan agenda baru ke state
          if (response.data) {
            const newAgenda: Agenda = {
              ...response.data,
              createdBy: {
                id: userId ? parseInt(userId) : 0,
                name: username || 'User'
              }
            };
            setAgendas(prev => [newAgenda, ...prev]);
          }
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Gagal ${isEditMode ? 'memperbarui' : 'mengajukan'} agenda: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      setIsFormDialogOpen(false);
    }
  };

  const handleEditAgenda = (id: number) => {
    const agenda = agendas.find(a => a.id === id);
    if (agenda) {
      setSelectedAgenda(agenda);
      setIsEditMode(true);
      setIsFormDialogOpen(true);
    }
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

  const handleOpenNewAgendaForm = () => {
    setSelectedAgenda(undefined);
    setIsEditMode(false);
    setIsFormDialogOpen(true);
  };

  const handleProcessSubmit = (processTarget: ProcessTarget) => {
    if (!selectedAgenda) return;

    const status = `processing_${processTarget}` as AgendaStatus;

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

    const updatedAgendas = agendas.map((agenda) =>
      agenda.id === selectedAgenda.id
        ? {
          ...agenda,
          status: status as AgendaStatus,
          updatedAt: new Date(),
          completedAt: status === 'completed' ? new Date() : agenda.completedAt
        }
        : agenda
    );

    setAgendas(updatedAgendas);

    // Send notification based on status
    if (status === 'forwarded_to_paroki') {
      toast.info(`Agenda "${selectedAgenda.title}" telah diteruskan ke Paroki`);
    } else if (status === 'completed') {
      toast.success(`Agenda "${selectedAgenda.title}" telah diselesaikan`);
    } else if (status === 'rejected') {
      toast.error(`Agenda "${selectedAgenda.title}" telah ditolak`);
    }
  };

  const handleFinalResultSubmit = (result: 'completed' | 'rejected') => {
    if (!selectedAgenda) return;

    const updatedAgendas = agendas.map((agenda) =>
      agenda.id === selectedAgenda.id
        ? {
          ...agenda,
          status: result as AgendaStatus,
          updatedAt: new Date(),
          completedAt: result === 'completed' ? new Date() : agenda.completedAt
        }
        : agenda
    );

    setAgendas(updatedAgendas);

    // Send notification based on result
    if (result === 'completed') {
      toast.success(`Agenda "${selectedAgenda.title}" telah diselesaikan`);
    } else {
      toast.error(`Agenda "${selectedAgenda.title}" telah ditolak`);
    }
  };

  const handleRejectionSubmit = (values: RejectionFormValues) => {
    if (!selectedAgenda) return;

    const updatedAgendas = agendas.map((agenda) =>
      agenda.id === selectedAgenda.id
        ? {
          ...agenda,
          status: 'rejected' as AgendaStatus,
          rejectionReason: values.reason,
          updatedAt: new Date()
        }
        : agenda
    );

    setAgendas(updatedAgendas);

    // Send notification
    toast.error(`Agenda "${selectedAgenda.title}" ditolak dengan alasan: ${values.reason}`);
  };

  const handleConfirmDelete = (id: number) => {
    // Menyimpan ID agenda yang akan dihapus
    setAgendaToDelete(id);
    
    const agenda = agendas.find(a => a.id === id);
    if (agenda) {
      setSelectedAgenda(agenda);
    }
    
    // Membuka dialog konfirmasi
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAgenda = async () => {
    if (!agendaToDelete) return;
    
    try {
      // Memanggil server action untuk menghapus agenda
      const response = await deleteAgenda(agendaToDelete);
      
      if (response.success) {
        setAgendas(agendas.filter((agenda) => agenda.id !== agendaToDelete));
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error deleting agenda:", error);
      toast.error("Gagal menghapus agenda");
    } finally {
      // Reset state
      setAgendaToDelete(null);
      setSelectedAgenda(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold">Agenda Lingkungan</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
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
        {isUmatRole && (
          <Button
            className="whitespace-nowrap w-full sm:w-auto"
            onClick={handleOpenNewAgendaForm}
            disabled={isSubmitting}
          >
            <Plus className="mr-2 h-4 w-4" />
            Pengajuan
          </Button>
        )}
      </div>

      {/* Pesan jika tidak ada agenda */}
      {agendas.length === 0 && (
        <div className="text-center py-10 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">Belum ada agenda. Klik tombol Pengajuan untuk membuat agenda baru.</p>
        </div>
      )}

      {/* Tabel Agenda */}
      {agendas.length > 0 && (
        <AgendaTable
          agendas={paginatedAgendas}
          onProcess={handleProcessAgenda}
          onUpdateStatus={handleUpdateStatusAgenda}
          onFinalResult={handleFinalResultAgenda}
          onDelete={handleConfirmDelete}
          onReject={handleRejectAgenda}
          onEdit={handleEditAgenda}
          userRole={userRole}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Dialog untuk form agenda baru atau edit */}
      <AgendaFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSubmit={handleAddAgenda}
        isSubmitting={isSubmitting}
        agenda={isEditMode ? selectedAgenda : undefined}
      />

      {/* Dialog untuk proses agenda */}
      <ProcessDialog
        open={isProcessDialogOpen}
        onOpenChange={setIsProcessDialogOpen}
        onSubmit={handleProcessSubmit}
      />

      {/* Dialog untuk update status */}
      <UpdateStatusDialog
        open={isUpdateStatusDialogOpen}
        onOpenChange={setIsUpdateStatusDialogOpen}
        onSubmit={handleUpdateStatusSubmit}
      />

      {/* Dialog untuk hasil akhir */}
      <FinalResultDialog
        open={isFinalResultDialogOpen}
        onOpenChange={setIsFinalResultDialogOpen}
        onSubmit={handleFinalResultSubmit}
      />

      {/* Dialog untuk penolakan */}
      <RejectionDialog
        open={isRejectionDialogOpen}
        onOpenChange={setIsRejectionDialogOpen}
        onSubmit={handleRejectionSubmit}
      />

      {/* Dialog konfirmasi penghapusan */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteAgenda}
        title={selectedAgenda?.title}
      />
    </div>
  );
} 