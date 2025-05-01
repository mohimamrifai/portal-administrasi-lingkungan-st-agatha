import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { KesekretariatanSummary } from "../types"
import { formatPercentage } from "../utils"
import { Users, User, UserPlus, UserMinus, HeartPulse, Percent } from "lucide-react"

interface KesekretariatanCardsProps {
  data: KesekretariatanSummary
}

export function KesekretariatanCards({ data }: KesekretariatanCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-blue-50">
        <CardHeader className="pb-2 flex flex-row items-center gap-3">
          <Users className="w-7 h-7 text-blue-500" />
          <div>
            <CardDescription>Total Kepala Keluarga</CardDescription>
            <CardTitle className="text-xl text-blue-600">{data.totalKepalaKeluarga}</CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="bg-indigo-50">
        <CardHeader className="pb-2 flex flex-row items-center gap-3">
          <User className="w-7 h-7 text-indigo-500" />
          <div>
            <CardDescription>Jumlah Jiwa</CardDescription>
            <CardTitle className="text-xl text-indigo-600">{data.jumlahJiwa}</CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="bg-green-50">
        <CardHeader className="pb-2 flex flex-row items-center gap-3">
          <UserPlus className="w-7 h-7 text-green-500" />
          <div>
            <CardDescription>KK Bergabung</CardDescription>
            <CardTitle className="text-xl text-green-600">{data.kkBergabung}</CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="bg-yellow-50">
        <CardHeader className="pb-2 flex flex-row items-center gap-3">
          <UserMinus className="w-7 h-7 text-yellow-500" />
          <div>
            <CardDescription>KK Pindah</CardDescription>
            <CardTitle className="text-xl text-yellow-600">{data.kkPindah}</CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="bg-red-50">
        <CardHeader className="pb-2 flex flex-row items-center gap-3">
          <HeartPulse className="w-7 h-7 text-red-500" />
          <div>
            <CardDescription>Umat Meninggal Dunia</CardDescription>
            <CardTitle className="text-xl text-red-600">{data.umatMeninggalDunia}</CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="bg-purple-50">
        <CardHeader className="pb-2 flex flex-row items-center gap-3">
          <Percent className="w-7 h-7 text-purple-500" />
          <div>
            <CardDescription>Tingkat Partisipasi Umat</CardDescription>
            <CardTitle className="text-xl text-purple-600">{formatPercentage(data.tingkatPartisipasiUmat)}</CardTitle>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
} 