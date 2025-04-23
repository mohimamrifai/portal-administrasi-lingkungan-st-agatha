"use client"

import * as React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import Pengumuman from "./pengumuman"
import BuatPublikasi from "./buat-publikasi"

export default function PublikasiContent() {
  const [activeTab, setActiveTab] = useState("pengumuman")

  return (
    <div className="space-y-6 p-2">
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="gap-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Publikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Bulan ini</p>
              </CardContent>
            </Card>
            <Card className="gap-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Publikasi Aktif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Belum melewati deadline</p>
              </CardContent>
            </Card>
      </div>

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4 bg-muted/60">
          <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
          <TabsTrigger 
            value="buat-publikasi" 
            className="flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Buat Publikasi
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pengumuman" className="space-y-4">
          <Pengumuman />
        </TabsContent>
        
        <TabsContent value="buat-publikasi" className="space-y-4">
          <BuatPublikasi />
        </TabsContent>
      </Tabs>
    </div>
  )
} 