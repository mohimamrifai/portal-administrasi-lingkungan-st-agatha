"use client";

import { Button } from "@/components/ui/button";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { FamilyHead } from "../types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface FamilyHeadsTableProps {
  familyHeads: FamilyHead[];
  onEdit: (familyHead: FamilyHead) => void;
  onDelete: (id: number) => Promise<void>;
}

export function FamilyHeadsTable({
  familyHeads,
  onEdit,
  onDelete,
}: FamilyHeadsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFamilyHead, setSelectedFamilyHead] = useState<FamilyHead | null>(
    null
  );

  const handleDelete = async () => {
    if (!selectedFamilyHead) return;

    try {
      await onDelete(selectedFamilyHead.id);
      toast.success("Data kepala keluarga berhasil dihapus");
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus data");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedFamilyHead(null);
    }
  };

  const getStatusLabel = (status: FamilyHead["status"]) => {
    switch (status) {
      case "active":
        return "Aktif";
      case "moved":
        return "Pindah";
      case "deceased":
        return "Meninggal";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama Kepala Keluarga</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>No. Telepon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {familyHeads.map((familyHead, index) => (
              <TableRow key={familyHead.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{familyHead.name}</TableCell>
                <TableCell>{familyHead.address}</TableCell>
                <TableCell>{familyHead.phoneNumber}</TableCell>
                <TableCell>{getStatusLabel(familyHead.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(familyHead)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedFamilyHead(familyHead);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Kepala Keluarga</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data kepala keluarga ini? Tindakan
              ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 