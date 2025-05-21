import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { KesekretariatanSummary } from "../types"
import { formatPercentage, formatDate } from "../utils"
import { Users, User, UserPlus, UserMinus, HeartPulse, Percent } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="bg-green-50 cursor-help">
              <CardHeader className="pb-2 flex flex-row items-center gap-3">
                <UserPlus className="w-7 h-7 text-green-500" />
                <div>
                  <CardDescription>KK Bergabung</CardDescription>
                  <CardTitle className="text-xl text-green-600">{data.kkBergabung}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-2 bg-white shadow-lg rounded-md">
            <div className="font-medium text-sm mb-1">Daftar Keluarga Bergabung:</div>
            {data.detailKKBergabung.length > 0 ? (
              <ul className="text-xs space-y-1">
                {data.detailKKBergabung.map((kk) => (
                  <li key={kk.id} className="flex justify-between">
                    <span>{kk.nama}</span>
                    <span className="text-gray-500 ml-2">{formatDate(new Date(kk.tanggal))}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-gray-500">Tidak ada data</div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="bg-yellow-50 cursor-help">
              <CardHeader className="pb-2 flex flex-row items-center gap-3">
                <UserMinus className="w-7 h-7 text-yellow-500" />
                <div>
                  <CardDescription>KK Pindah</CardDescription>
                  <CardTitle className="text-xl text-yellow-600">{data.kkPindah}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-2 bg-white shadow-lg rounded-md">
            <div className="font-medium text-sm mb-1">Daftar Keluarga Pindah:</div>
            {data.detailKKPindah.length > 0 ? (
              <ul className="text-xs space-y-1">
                {data.detailKKPindah.map((kk) => (
                  <li key={kk.id} className="flex justify-between">
                    <span>{kk.nama}</span>
                    <span className="text-gray-500 ml-2">{formatDate(new Date(kk.tanggal))}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-gray-500">Tidak ada data</div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="bg-red-50 cursor-help">
              <CardHeader className="pb-2 flex flex-row items-center gap-3">
                <HeartPulse className="w-7 h-7 text-red-500" />
                <div>
                  <CardDescription>Umat Meninggal Dunia</CardDescription>
                  <CardTitle className="text-xl text-red-600">{data.umatMeninggalDunia}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-2 bg-white shadow-lg rounded-md">
            <div className="font-medium text-sm mb-1">Daftar Umat Meninggal Dunia:</div>
            {data.detailUmatMeninggal.length > 0 ? (
              <ul className="text-xs space-y-1">
                {data.detailUmatMeninggal.map((umat) => (
                  <li key={umat.id} className="flex justify-between">
                    <span>
                      {umat.nama} <span className="text-gray-500">({umat.statusKeluarga})</span>
                    </span>
                    <span className="text-gray-500 ml-2">{formatDate(new Date(umat.tanggal))}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-gray-500">Tidak ada data</div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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