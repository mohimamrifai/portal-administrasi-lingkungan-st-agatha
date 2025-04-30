"use client"

import { useEffect } from "react"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { id } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, CalendarRange } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface PeriodFilterProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  setDateRange: (dateRange: DateRange | undefined) => void;
}

export function PeriodFilter({ currentMonth, setCurrentMonth, setDateRange }: PeriodFilterProps) {
  // Buat dateRange dari currentMonth
  const dateRange: DateRange = {
    from: startOfMonth(currentMonth),
    to: endOfMonth(currentMonth),
  };

  // Update dateRange saat currentMonth berubah
  useEffect(() => {
    setDateRange({
      from: startOfMonth(currentMonth),
      to: endOfMonth(currentMonth),
    });
  }, [currentMonth, setDateRange]);

  // Handler untuk mengubah bulan/rentang tanggal
  const handleMonthChange = (date: DateRange | undefined) => {
    if (date?.from) {
      setCurrentMonth(date.from);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <CalendarRange className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Periode Transaksi</span>
      </div>
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full md:w-[300px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(currentMonth, "MMMM yyyy", { locale: id })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="single"
              defaultMonth={currentMonth}
              selected={currentMonth}
              onSelect={(date) => date && setCurrentMonth(date)}
              numberOfMonths={1}
              locale={id}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
} 