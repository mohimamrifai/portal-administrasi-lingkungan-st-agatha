"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JadwalDoling } from "../types";
import { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
  valueColor?: string;
}

export function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  className = "",
  valueColor = "",
}: SummaryCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor}`}>
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface JadwalDolingCardsProps {
  jadwalState: JadwalDoling[];
  className?: string;
}

export function JadwalDolingCards({ jadwalState, className = "" }: JadwalDolingCardsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      <SummaryCard
        title="Total Jadwal"
        value={jadwalState.length}
        subtitle="Semua periode"
        className="bg-blue-50"
      />

      <SummaryCard
        title="Jadwal Selesai"
        value={jadwalState.filter(j => j.status === "selesai").length}
        subtitle={`Dari total ${jadwalState.length} jadwal`}
        className="bg-green-50"
      />

      <SummaryCard
        title="Jadwal Mendatang"
        value={jadwalState.filter(j => j.status === "terjadwal").length}
        subtitle="Jadwal yang akan dilaksanakan"
        className="bg-yellow-50"
      />
    </div>
  );
} 