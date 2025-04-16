import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DataUmat from "./components/data-umat"
import DoaLingkungan from "./components/doa-lingkungan"
import Agenda from "./components/agenda"

export default function KesekretariatanPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Kesekretariatan</h1>
      <Tabs defaultValue="data-umat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data-umat">Data Umat</TabsTrigger>
          <TabsTrigger value="doa-lingkungan">Doa Lingkungan</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
        </TabsList>
        <TabsContent value="data-umat">
          <DataUmat />
        </TabsContent>
        <TabsContent value="doa-lingkungan">
          <DoaLingkungan />
        </TabsContent>
        <TabsContent value="agenda">
          <Agenda />
        </TabsContent>
      </Tabs>
    </div>
  )
} 