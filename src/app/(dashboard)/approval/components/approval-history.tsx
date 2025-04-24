"use client"

import { useState, useEffect } from "react"
import { ApprovalItem } from "../types"
import { fetchApprovalHistory } from "../utils/service"
import LoadingSkeleton from "./loading-skeleton"

interface ApprovalHistoryItem {
  id: number
  approvalDate: Date
  approvedBy: string
  itemId: number
  tuanRumah: string
  biaya: number
  status: 'approved' | 'rejected'
  reason?: string
  message?: string
}

type ApprovalHistoryProps = {
  selectedMonth: string
}

export function ApprovalHistory({ selectedMonth }: ApprovalHistoryProps) {
  const [historyData, setHistoryData] = useState<ApprovalHistoryItem[]>([])
  const [filteredHistory, setFilteredHistory] = useState<ApprovalHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true)
      try {
        const data = await fetchApprovalHistory()
        // Memastikan status sesuai dengan tipe yang diharapkan
        const typedData = data.map(item => ({
          ...item,
          status: item.status as 'approved' | 'rejected'
        }))
        setHistoryData(typedData)
      } catch (error) {
        console.error("Error fetching approval history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [])

  // Filter data berdasarkan bulan
  useEffect(() => {
    if (historyData.length === 0) return

    const [year, month] = selectedMonth.split('-').map(n => parseInt(n))
    
    const filtered = historyData.filter(item => {
      const itemYear = item.approvalDate.getFullYear()
      const itemMonth = item.approvalDate.getMonth() + 1
      return itemYear === year && itemMonth === month
    })
    
    setFilteredHistory(filtered)
  }, [selectedMonth, historyData])

  if (isLoading) {
    return <div className="h-48"><LoadingSkeleton /></div>
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {filteredHistory.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Tidak ada data riwayat untuk periode ini
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Approval
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diapprove Oleh
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tuan Rumah
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Biaya
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catatan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.approvalDate.toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.approvedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.tuanRumah}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(item.biaya)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.status === 'rejected' && item.reason ? item.reason : item.message || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 