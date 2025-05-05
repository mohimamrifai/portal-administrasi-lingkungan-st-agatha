import { getDelinquentPayments } from "./utils/monitoring-service";
import { DelinquentPayment } from "./types";
import MonitoringClient from "./components/monitoring-client";

export default async function MonitoringPenunggakPage() {
  // Mendapatkan data penunggak iuran
  const delinquentPayments: DelinquentPayment[] = await getDelinquentPayments();
  
  return <MonitoringClient delinquentPayments={delinquentPayments} />;
} 