import cron from 'node-cron';
import { autoDeleteCompletedAgendas, sendReminderNotifications } from '@/app/(dashboard)/kesekretariatan/agenda/actions';

// Fungsi untuk menginisialisasi scheduler
export function initScheduler() {
  // Jalankan auto-delete setiap hari Minggu jam 00:00
  cron.schedule('0 0 * * 0', async () => {
    console.log('Running auto-delete for completed agendas...');
    try {
      const result = await autoDeleteCompletedAgendas();
      console.log('Auto-delete result:', result);
    } catch (error) {
      console.error('Error in auto-delete scheduler:', error);
    }
  }, {
    timezone: 'Asia/Jakarta' // Sesuaikan dengan timezone Indonesia
  });

  // Jalankan pengingat setiap 3 hari sekali jam 00:00
  cron.schedule('0 0 */3 * *', async () => {
    console.log('Sending reminder notifications...');
    try {
      const result = await sendReminderNotifications();
      console.log('Reminder notifications result:', result);
    } catch (error) {
      console.error('Error in reminder notifications scheduler:', error);
    }
  }, {
    timezone: 'Asia/Jakarta'
  });

  console.log('Agenda schedulers initialized');
} 