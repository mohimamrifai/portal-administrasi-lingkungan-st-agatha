"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Agenda } from "../types";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface AgendaTableProps {
  agendas: Agenda[];
  onUpdate: (id: number, status: Agenda['status']) => void;
  onDelete: (id: number) => void;
  userRole?: string;
}

export function AgendaTable({ agendas, onUpdate, onDelete, userRole }: AgendaTableProps) {
  const getStatusColor = (status: Agenda['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Diajukan Oleh</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agendas.map((agenda) => (
            <TableRow key={agenda.id}>
              <TableCell className="font-medium">{agenda.title}</TableCell>
              <TableCell>{agenda.description}</TableCell>
              <TableCell>
                {format(new Date(agenda.date), 'dd MMMM yyyy', { locale: id })}
              </TableCell>
              <TableCell>{agenda.location}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(agenda.status)}`}>
                  {agenda.status}
                </span>
              </TableCell>
              <TableCell>{agenda.createdBy.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {userRole === 'pengurus' && agenda.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdate(agenda.id, 'approved')}
                      >
                        Setujui
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdate(agenda.id, 'rejected')}
                      >
                        Tolak
                      </Button>
                    </>
                  )}
                  {userRole === 'pengurus' && agenda.status === 'approved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdate(agenda.id, 'completed')}
                    >
                      Selesai
                    </Button>
                  )}
                  {(userRole === 'pengurus' || agenda.createdBy.id === agenda.id) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(agenda.id)}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 