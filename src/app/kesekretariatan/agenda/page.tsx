"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AgendaFormDialog } from "./components/agenda-form-dialog";
import { AgendaTable } from "./components/agenda-table";
import { Agenda, AgendaFormValues } from "./types";
import { toast } from "sonner";

// Mock data - in a real app, this would come from an API
const mockAgendas: Agenda[] = [
  {
    id: 1,
    title: "Rapat Lingkungan",
    description: "Rapat rutin bulanan lingkungan",
    date: new Date("2024-04-20"),
    location: "Aula Paroki",
    status: "pending",
    createdBy: {
      id: 1,
      name: "Budi Santoso"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: "Kegiatan Sosial",
    description: "Bakti sosial lingkungan",
    date: new Date("2024-04-25"),
    location: "Lapangan Lingkungan",
    status: "approved",
    createdBy: {
      id: 2,
      name: "Ani Wijaya"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock user data
const mockUser = {
  id: 1,
  name: "Budi Santoso",
  role: "umat" // or "pengurus"
};

export default function AgendaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | undefined>();
  const [agendas, setAgendas] = useState<Agenda[]>(mockAgendas);

  // Auto-delete completed agendas after 30 days
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      setAgendas(prevAgendas => 
        prevAgendas.filter(agenda => 
          agenda.status !== 'completed' || 
          (agenda.completedAt && agenda.completedAt > thirtyDaysAgo)
        )
      );
    }, 24 * 60 * 60 * 1000); // Check daily

    return () => clearInterval(interval);
  }, []);

  const filteredAgendas = agendas.filter((agenda) =>
    agenda.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agenda.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAgenda = async (values: AgendaFormValues) => {
    const newAgenda: Agenda = {
      id: agendas.length + 1,
      ...values,
      status: "pending",
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

  const handleUpdateAgenda = async (id: number, status: Agenda['status']) => {
    const updatedAgendas = agendas.map((agenda) =>
      agenda.id === id
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
    const agenda = agendas.find(a => a.id === id);
    if (agenda) {
      toast.info(`Status agenda "${agenda.title}" telah diperbarui menjadi ${status}`);
    }
  };

  const handleDeleteAgenda = async (id: number) => {
    setAgendas(agendas.filter((agenda) => agenda.id !== id));
    toast.success("Agenda berhasil dihapus");
  };

  return (
    <div className="container mx-auto py-6 space-y-6 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agenda</h1>
        {mockUser.role === 'umat' && (
          <Button
            onClick={() => {
              setSelectedAgenda(undefined);
              setIsFormDialogOpen(true);
            }}
          >
            Pengajuan Agenda
          </Button>
        )}
      </div>

      <div className="flex justify-between">
        <Input
          placeholder="Cari agenda..."
          className="w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <AgendaTable
        agendas={filteredAgendas}
        onUpdate={handleUpdateAgenda}
        onDelete={handleDeleteAgenda}
        userRole={mockUser.role}
      />

      <AgendaFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        agenda={selectedAgenda}
        onSubmit={handleAddAgenda}
      />
    </div>
  );
} 