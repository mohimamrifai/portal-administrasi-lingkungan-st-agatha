import { Transaction } from "../types"
import { addDays } from "date-fns"
import { filterTransactionsByDateRange } from "./date-utils"
import { generateWeeklyReport } from "./transaction-utils"

/**
 * Sends a weekly notification with a summary of transactions
 * @param transactions All transactions
 */
export function sendWeeklyNotification(transactions: Transaction[]) {
  // Get current week's transactions
  const now = new Date();
  const oneWeekAgo = addDays(now, -7);
  
  const weeklyTransactions = filterTransactionsByDateRange(
    transactions, 
    oneWeekAgo, 
    now
  );
  
  generateWeeklyReport(weeklyTransactions);
}

/**
 * Sets up a periodic notification timer
 * @param nextNotificationTime Date for the next notification
 * @param transactions All transactions
 * @param setNextNotificationTime Function to update the next notification time
 * @returns A cleanup function for the timer
 */
export function setupNotificationTimer(
  nextNotificationTime: Date,
  transactions: Transaction[],
  setNextNotificationTime: (date: Date) => void
) {
  if (nextNotificationTime) {
    const timer = setTimeout(() => {
      sendWeeklyNotification(transactions);
      // Schedule next notification for next Sunday
      setNextNotificationTime(addDays(nextNotificationTime, 7));
    }, nextNotificationTime.getTime() - new Date().getTime());
    
    return () => clearTimeout(timer);
  }
  
  return () => {};
} 