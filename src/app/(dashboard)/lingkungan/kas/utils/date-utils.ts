import { addDays, nextSunday, setHours, setMinutes, isAfter, isSunday } from "date-fns"
import { DateRange } from "react-day-picker"
import { TransactionData } from "../types/schema"

/**
 * Calculates the next notification time (Sundays at 12:00)
 * @returns The date for the next notification
 */
export function calculateNextNotificationTime(): Date {
  const now = new Date();
  let nextTime: Date;
  
  if (isSunday(now) && isAfter(now, setHours(setMinutes(now, 0), 12))) {
    // If it's Sunday after 12:00, set for next Sunday
    nextTime = setHours(setMinutes(nextSunday(addDays(now, 1)), 0), 12);
  } else {
    // Otherwise set for this Sunday (or next if today is not Sunday)
    nextTime = setHours(setMinutes(nextSunday(now), 0), 12);
  }
  
  return nextTime;
}

/**
 * Gets the default date range for the current month
 * @param date Current date
 * @returns DateRange object for the full month containing the date
 */
export function getMonthDateRange(date: Date): DateRange {
  return {
    from: new Date(date.getFullYear(), date.getMonth(), 1),
    to: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  }
}

/**
 * Filters transactions for a specific month
 * @param transactions List of transactions
 * @param targetMonth The month to filter for
 * @returns Filtered transactions
 */
export function filterTransactionsByMonth(transactions: TransactionData[], targetMonth: Date) {
  return transactions.filter(tx => 
    tx.tanggal.getMonth() === targetMonth.getMonth() && 
    tx.tanggal.getFullYear() === targetMonth.getFullYear()
  )
}

/**
 * Filters transactions for a specific date range
 * @param transactions List of transactions
 * @param from Start date
 * @param to End date
 * @returns Filtered transactions
 */
export function filterTransactionsByDateRange(transactions: TransactionData[], from: Date, to: Date) {
  return transactions.filter(tx => 
    tx.tanggal >= from && tx.tanggal <= to
  )
} 