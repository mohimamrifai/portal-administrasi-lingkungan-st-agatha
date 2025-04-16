import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Pengumuman from "./components/pengumuman"
import BuatPublikasi from "./components/buat-publikasi"

export default function PublikasiPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Publikasi</h1>
      <Tabs defaultValue="pengumuman" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
          <TabsTrigger value="buat-publikasi">Buat Publikasi</TabsTrigger>
        </TabsList>
        <TabsContent value="pengumuman">
          <Pengumuman />
        </TabsContent>
        <TabsContent value="buat-publikasi">
          <BuatPublikasi />
        </TabsContent>
      </Tabs>
    </div>
  )
} 