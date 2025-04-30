import { Agenda } from "../types";
import { useAuth } from "@/contexts/auth-context";

export function useMockData() {
  // Mendapatkan informasi user dari auth context
  const { userRole } = useAuth();

  // Mock data - in a real app, this would come from an API
  const mockAgendas: Agenda[] = [
    {
      id: 1,
      title: "Rapat Lingkungan",
      description: "Rapat rutin bulanan lingkungan",
      date: new Date("2024-04-20"),
      location: "Aula Paroki",
      target: "lingkungan",
      status: "open",
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
      target: "stasi",
      status: "processing_stasi",
      createdBy: {
        id: 2,
        name: "Ani Wijaya"
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      title: "Perayaan Paskah",
      description: "Perayaan Paskah lingkungan",
      date: new Date("2024-04-30"),
      location: "Gereja Stasi",
      target: "paroki",
      status: "forwarded_to_paroki",
      createdBy: {
        id: 1,
        name: "Budi Santoso"
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Mock user data dengan role yang didapat dari auth context
  const mockUser = {
    id: 1,
    name: "Budi Santoso",
    role: userRole // Menggunakan role dari auth context
  };

  return { mockAgendas, mockUser };
} 