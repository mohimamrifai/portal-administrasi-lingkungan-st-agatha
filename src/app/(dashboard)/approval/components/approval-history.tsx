"use client"

import { useState, useEffect, useMemo } from "react";
import { CheckCircle2, XCircle, User2, Home, FileText } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { DropdownBulanTahun } from "@/app/(dashboard)/approval/components/dropdown-bulan-tahun";
import { ApprovalItem } from "../types";

type ApprovalHistoryProps = {
  selectedMonth: string;
  approvalData: ApprovalItem[];
};

export function ApprovalHistory({ selectedMonth, approvalData }: ApprovalHistoryProps) {
  const [month, setMonth] = useState<string>(selectedMonth);

  // Sinkronkan prop selectedMonth ke state month jika berubah
  useEffect(() => {
    setMonth(selectedMonth);
  }, [selectedMonth]);

  // Filter data: status approved/rejected, lalu filter bulan
  const filteredHistory = useMemo(() => {
    if (!approvalData.length) return [];
    // Hanya status approved/rejected
    let history = approvalData.filter(item => item.status === 'approved' || item.status === 'rejected');
    if (month === 'all') return [...history].sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime());
    const [year, monthNum] = month.split("-").map((n) => parseInt(n));
    let filtered = history.filter((item) => {
      const itemYear = item.tanggal.getFullYear();
      const itemMonth = item.tanggal.getMonth() + 1;
      return itemYear === year && itemMonth === monthNum;
    });
    // Urutkan terbaru di atas
    filtered.sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime());
    return filtered;
  }, [month, approvalData]);

  return (
    <section className="space-y-6">
      {/* Judul & Deskripsi */}
      <div className="mb-2">
        <h2 className="text-xl font-bold">Riwayat Persetujuan</h2>
        <p className="text-sm text-muted-foreground">
          Daftar permohonan yang telah disetujui atau ditolak
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-muted-foreground">Pilih Bulan</label>
          <DropdownBulanTahun value={month} onChange={setMonth} />
        </div>
      </div>

      {/* Daftar Riwayat */}
      {filteredHistory.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground rounded border bg-muted/40">
          Tidak ada data riwayat untuk periode ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHistory.map((item) => (
            <Card
              key={item.id}
              className={`flex flex-col border shadow-sm transition hover:shadow-md ${
                item.status === "approved"
                  ? "border-green-200 bg-green-50/40"
                  : "border-red-200 bg-red-50/40"
              }`}
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="flex items-center gap-2">
                  {item.status === "approved" ? (
                    <CheckCircle2 className="text-green-500 w-6 h-6" />
                  ) : (
                    <XCircle className="text-red-500 w-6 h-6" />
                  )}
                  <Badge
                    variant="outline"
                    className={`text-xs px-2 py-0.5 font-semibold border-0 ${
                      item.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status === "approved" ? "Disetujui" : "Ditolak"}
                  </Badge>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">
                  {item.tanggal.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-0">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User2 className="w-4 h-4" />
                  <span className="text-sm">
                    <span className="font-medium text-foreground">Pengurus: </span>
                    {item.approvedBy || "Budi Pengurus"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">
                    <span className="font-medium text-foreground">Kolekte I: </span>
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.kolekte1 || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">
                    <span className="font-medium text-foreground">Kolekte II: </span>
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.kolekte2 || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">
                    <span className="font-medium text-foreground">Ucapan Syukur: </span>
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.ucapanSyukur || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">
                    <span className="font-medium text-foreground">Total: </span>
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.total || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">
                    <span className="font-medium text-foreground">Keterangan: </span>
                    {item.keterangan || "-"}
                  </span>
                </div>
                <Separator className="my-2" />
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">
                    Catatan:
                  </div>
                  <div className="text-sm text-foreground whitespace-pre-line">
                    {item.status === "rejected" && item.reason
                      ? item.reason
                      : item.message || "-"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}