import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import KasIkata from "./components/kas-ikata"
import MonitoringPenunggak from "./components/monitoring-penunggak"

export default function IkataPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">IKATA</h1>
      <Tabs defaultValue="kas-ikata" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="kas-ikata">Kas IKATA</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring Penunggak</TabsTrigger>
        </TabsList>
        <TabsContent value="kas-ikata">
          <KasIkata />
        </TabsContent>
        <TabsContent value="monitoring">
          <MonitoringPenunggak />
        </TabsContent>
      </Tabs>
    </div>
  )
} 