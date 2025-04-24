import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { KesekretariatanSummary } from "../types"
import { formatPercentage } from "../utils"

interface KesekretariatanCardsProps {
  data: KesekretariatanSummary
}

export function KesekretariatanCards({ data }: KesekretariatanCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Kepala Keluarga</CardDescription>
          <CardTitle className="text-xl text-blue-600">{data.totalKepalaKeluarga}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Jumlah Jiwa</CardDescription>
          <CardTitle className="text-xl text-indigo-600">{data.jumlahJiwa}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>KK Bergabung</CardDescription>
          <CardTitle className="text-xl text-green-600">{data.kkBergabung}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>KK Pindah</CardDescription>
          <CardTitle className="text-xl text-yellow-600">{data.kkPindah}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Umat Meninggal Dunia</CardDescription>
          <CardTitle className="text-xl text-red-600">{data.umatMeninggalDunia}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Tingkat Partisipasi Umat</CardDescription>
          <CardTitle className="text-xl text-purple-600">{formatPercentage(data.tingkatPartisipasiUmat)}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
} 