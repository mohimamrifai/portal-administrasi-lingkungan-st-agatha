import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import KasLingkungan from "./components/kas-lingkungan"
import DanaMandiri from "./components/dana-mandiri"

export default function LingkunganPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Menu Lingkungan</h1>
      <Tabs defaultValue="kas-lingkungan" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="kas-lingkungan">Kas Lingkungan</TabsTrigger>
          <TabsTrigger value="dana-mandiri">Dana Mandiri</TabsTrigger>
        </TabsList>
        <TabsContent value="kas-lingkungan">
          <KasLingkungan />
        </TabsContent>
        <TabsContent value="dana-mandiri">
          <DanaMandiri />
        </TabsContent>
      </Tabs>
    </div>
  )
} 