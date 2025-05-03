"use client";

import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Agenda, AgendaFormValues, ProcessTarget } from "../types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DatePicker } from "./date-picker";
import { TimeInput } from "./time-input";
import { Loader2 } from "lucide-react";

interface AgendaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agenda?: Agenda;
  onSubmit: (values: AgendaFormValues) => void;
  isSubmitting?: boolean;
}

export function AgendaFormDialog({
  open,
  onOpenChange,
  agenda,
  onSubmit,
  isSubmitting = false
}: AgendaFormDialogProps) {
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);
  
  // Inisialisasi formValues di sini, tapi akan diupdate oleh useEffect saat agenda berubah
  const [formValues, setFormValues] = useState<AgendaFormValues>({
    title: "",
    description: "",
    date: new Date(),
    location: "",
    target: "lingkungan",
  });
  
  // Separate state for time to use with TimeInput
  const [timeValue, setTimeValue] = useState("00:00");

  // Update form values when agenda changes or when dialog opens
  useEffect(() => {
    if (open && agenda) {
      // Konversi tanggal jika belum berupa Date
      const agendaDate = agenda.date instanceof Date ? agenda.date : new Date(agenda.date);
      
      // Update form values
      setFormValues({
        title: agenda.title,
        description: agenda.description,
        date: agendaDate,
        location: agenda.location,
        target: agenda.target,
      });
      
      // Update time value
      const hours = agendaDate.getHours().toString().padStart(2, '0');
      const minutes = agendaDate.getMinutes().toString().padStart(2, '0');
      setTimeValue(`${hours}:${minutes}`);
    } else if (open) {
      // Reset form untuk pengajuan baru
      const now = new Date();
      setFormValues({
        title: "",
        description: "",
        date: now,
        location: "",
        target: "lingkungan",
      });
      
      // Reset time juga
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeValue(`${hours}:${minutes}`);
    }
  }, [open, agenda]);

  // Handle date selection from DatePicker
  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (!date) return;
    
    // Preserve time from current date
    const currentDate = new Date(formValues.date);
    date.setHours(currentDate.getHours());
    date.setMinutes(currentDate.getMinutes());
    
    setFormValues(prev => ({
      ...prev,
      date: new Date(date)
    }));
  }, [formValues.date]);

  // Handle time change from TimeInput
  const handleTimeChange = useCallback((time: string) => {
    if (time === timeValue) return; // Prevent unnecessary updates
    
    setTimeValue(time);
    
    // Update the date with new time
    const [hours, minutes] = time.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      setFormValues(prev => {
        const newDate = new Date(prev.date);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        return {
          ...prev,
          date: newDate
        };
      });
    }
  }, [timeValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmittingLocal(true);
      
      // Final validation of time
      const [hours, minutes] = timeValue.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        alert('Silakan masukkan waktu yang valid');
        return;
      }
      
      // Ensure time is properly set
      const finalDate = new Date(formValues.date);
      finalDate.setHours(hours);
      finalDate.setMinutes(minutes);
      
      // Submit form data
      await onSubmit({
        ...formValues,
        date: finalDate
      });
      
      // Only close the dialog if we successfully got here
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat menyimpan: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSubmittingLocal(false);
    }
  };

  // Combined submitting state from parent and local
  const submitting = isSubmitting || isSubmittingLocal;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{agenda ? "Edit Agenda" : "Pengajuan Agenda Baru"}</DialogTitle>
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
              disabled={submitting}
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
              disabled={submitting}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tanggal
              </label>
              <DatePicker 
                date={formValues.date}
                onSelect={handleDateSelect}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Waktu
              </label>
              <TimeInput 
                time={timeValue}
                onChange={handleTimeChange}
              />
            </div>
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
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tujuan Pengajuan
            </label>
            <RadioGroup
              value={formValues.target}
              onValueChange={(value: ProcessTarget) =>
                setFormValues({ ...formValues, target: value })
              }
              disabled={submitting}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lingkungan" id="lingkungan" />
                <Label htmlFor="lingkungan">DPL (Lingkungan)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stasi" id="stasi" />
                <Label htmlFor="stasi">DPS (Stasi)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paroki" id="paroki" />
                <Label htmlFor="paroki">DPP (Paroki)</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 