"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Agenda } from "../types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronDown, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AgendaTableProps {
  agendas: Agenda[];
  onProcess: (id: number) => void;
  onUpdateStatus: (id: number) => void;
  onFinalResult: (id: number) => void;
  onDelete: (id: number) => void;
  onReject: (id: number) => void;
  userRole?: string;
}

export function AgendaTable({ 
  agendas, 
  onProcess, 
  onUpdateStatus, 
  onFinalResult, 
  onDelete, 
  onReject,
  userRole 
}: AgendaTableProps) {
  const getStatusColor = (status: Agenda['status']) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing_lingkungan':
      case 'processing_stasi':
      case 'processing_paroki':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'forwarded_to_paroki':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusVariant = (status: Agenda['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: Agenda['status']) => {
    switch (status) {
      case 'open':
        return 'Menunggu';
      case 'processing_lingkungan':
        return 'Diproses di Lingkungan';
      case 'processing_stasi':
        return 'Diproses di Stasi';
      case 'processing_paroki':
        return 'Diproses di Paroki';
      case 'forwarded_to_paroki':
        return 'Diteruskan ke Paroki';
      case 'rejected':
        return 'Ditolak';
      case 'completed':
        return 'Selesai';
      default:
        return status;
    }
  };

  const getTargetText = (target: Agenda['target']) => {
    switch (target) {
      case 'lingkungan':
        return 'DPL (Lingkungan)';
      case 'stasi':
        return 'DPS (Stasi)';
      case 'paroki':
        return 'DPP (Paroki)';
      default:
        return target;
    }
  };

  const canProcess = (agenda: Agenda, role: string | undefined) => {
    return role === 'pengurus' && agenda.status === 'open';
  };

  const canUpdateStatus = (agenda: Agenda, role: string | undefined) => {
    return role === 'pengurus' && ['processing_lingkungan', 'processing_stasi', 'processing_paroki'].includes(agenda.status);
  };

  const canFinalResult = (agenda: Agenda, role: string | undefined) => {
    return role === 'pengurus' && agenda.status === 'forwarded_to_paroki';
  };

  const isCreator = (agenda: Agenda) => {
    // Ini hanya contoh, pada implementasi sebenarnya perlu logika untuk memeriksa
    // apakah pengguna saat ini adalah pembuat agenda
    return agenda.createdBy.id === 1; // Mengasumsikan ID 1 adalah ID pengguna saat ini
  };

  const canDelete = (agenda: Agenda, role: string | undefined) => {
    return role === 'pengurus' || isCreator(agenda);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Judul</TableHead>
              <TableHead className="whitespace-nowrap hidden md:table-cell">Deskripsi</TableHead>
              <TableHead className="whitespace-nowrap">Tanggal</TableHead>
              <TableHead className="whitespace-nowrap hidden md:table-cell">Lokasi</TableHead>
              <TableHead className="whitespace-nowrap">Tujuan</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Diajukan Oleh</TableHead>
              <TableHead className="whitespace-nowrap sticky right-0 bg-white shadow-md w-[50px] text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agendas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  Tidak ada agenda yang sesuai dengan pencarian
                </TableCell>
              </TableRow>
            ) : (
              agendas.map((agenda) => (
                <TableRow key={agenda.id}>
                  <TableCell className="font-medium whitespace-nowrap">{agenda.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="max-w-xs truncate">{agenda.description}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(agenda.date), 'dd/MM/yyyy', { locale: id })}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="max-w-xs truncate">{agenda.location}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{getTargetText(agenda.target)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusVariant(agenda.status)} 
                      className={`${getStatusColor(agenda.status)} w-max`}
                    >
                      {getStatusText(agenda.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{agenda.createdBy.name}</TableCell>
                  <TableCell className="sticky right-0 bg-white shadow-md text-center">
                    {userRole === 'umat' ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(agenda.id)}
                        disabled={!isCreator(agenda) || agenda.status !== 'open'}
                      >
                        Hapus
                      </Button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          {canProcess(agenda, userRole) && (
                            <DropdownMenuItem onClick={() => onProcess(agenda.id)}>
                              Proses
                            </DropdownMenuItem>
                          )}

                          {canUpdateStatus(agenda, userRole) && (
                            <DropdownMenuItem onClick={() => onUpdateStatus(agenda.id)}>
                              Update Status
                            </DropdownMenuItem>
                          )}

                          {canFinalResult(agenda, userRole) && (
                            <DropdownMenuItem onClick={() => onFinalResult(agenda.id)}>
                              Hasil Akhir
                            </DropdownMenuItem>
                          )}

                          {canProcess(agenda, userRole) && (
                            <DropdownMenuItem onClick={() => onReject(agenda.id)}>
                              Tolak
                            </DropdownMenuItem>
                          )}

                          {canDelete(agenda, userRole) && (
                            <DropdownMenuItem 
                              onClick={() => onDelete(agenda.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              Hapus
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 