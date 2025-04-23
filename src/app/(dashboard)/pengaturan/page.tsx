import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Profil from "./components/profil"
import UbahPassword from "./components/ubah-password"

export default function PengaturanPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Pengaturan</h1>
      <Tabs defaultValue="profil" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="ubah-password">Ubah Password</TabsTrigger>
        </TabsList>
        <TabsContent value="profil">
          <Profil />
        </TabsContent>
        <TabsContent value="ubah-password">
          <UbahPassword />
        </TabsContent>
      </Tabs>
    </div>
  )
} 