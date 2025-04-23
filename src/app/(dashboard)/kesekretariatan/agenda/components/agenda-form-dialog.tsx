"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Agenda, AgendaFormValues } from "../types";
import { format } from "date-fns";

interface AgendaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agenda?: Agenda;
  onSubmit: (values: AgendaFormValues) => void;
}

export function AgendaFormDialog({
  open,
  onOpenChange,
  agenda,
  onSubmit,
}: AgendaFormDialogProps) {
  const [formValues, setFormValues] = useState<AgendaFormValues>({
    title: agenda?.title || "",
    description: agenda?.description || "",
    date: agenda?.date || new Date(),
    location: agenda?.location || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pengajuan Agenda Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Judul Agenda
            </label>
            <Input
              id="title"
              value={formValues.title}
              onChange={(e) =>
                setFormValues({ ...formValues, title: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Deskripsi
            </label>
            <Textarea
              id="description"
              value={formValues.description}
              onChange={(e) =>
                setFormValues({ ...formValues, description: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Tanggal
            </label>
            <Input
              id="date"
              type="datetime-local"
              value={format(new Date(formValues.date), "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  date: new Date(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Lokasi
            </label>
            <Input
              id="location"
              value={formValues.location}
              onChange={(e) =>
                setFormValues({ ...formValues, location: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 