'use client'

import { use } from 'react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/app/api/axios'
import { useRouter, useSearchParams } from 'next/navigation'

/* ===================== TYPES ===================== */

export type Screenshot = {
  id: number
  name: string
  path: string
  type: string
  created_at: string
  serial?: number
}

type Interval = {
  interval: string
  screenshots: Screenshot[]
}

type HourData = {
  hour: number
  intervals: Interval[]
}

type OwnerQueryResponse = {
  grouped: string | Record<string, any>
  name: {
    name: string
  }
}

/* ===================== COMPONENT ===================== */

export default function Page({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = use(params)
  const userId = id

  const router = useRouter()
  const searchParams = useSearchParams()
  const queryDate = searchParams.get('date')

  const [date, setDate] = useState(
    queryDate || new Date().toISOString().split('T')[0]
  )
  const [groupBy, setGroupBy] = useState<'5min' | '10min' | '20min'>('10min')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState<Screenshot | null>(null)

  /* ===================== FETCH FUNCTION ===================== */

  const fetchScreenshots = async (): Promise<{
    groupedScreenshots: HourData[]
    totalScreenshots: number
    employeeName: string
  }> => {
    const res = await api.get<OwnerQueryResponse>('/owner-query', {
      params: { userId, date, groupBy },
    })

    const employeeName = res.data.name?.name ?? 'No Employee found'

    const rawGrouped =
      typeof res.data.grouped === 'string'
        ? JSON.parse(res.data.grouped)[date] ?? {}
        : res.data.grouped?.[date] ?? {}

    let serial = 1
    const grouped: HourData[] = []

    Object.entries(rawGrouped).forEach(([timeKey, shots]) => {
      const hour = parseInt(timeKey.split(':')[0], 10)

      const interval: Interval = {
        interval: timeKey,
        screenshots: (shots as any[]).map((shot) => ({
          id: shot.id,
          name: shot.name,
          path: shot.path,
          type: shot.type,
          created_at: shot.createdAt,
          serial: serial++,
        })),
      }

      const existing = grouped.find((g) => g.hour === hour)
      existing
        ? existing.intervals.push(interval)
        : grouped.push({ hour, intervals: [interval] })
    })

    grouped.sort((a, b) => a.hour - b.hour)
    grouped.forEach((h) =>
      h.intervals.sort(
        (a, b) =>
          parseInt(a.interval.split(':')[1], 10) -
          parseInt(b.interval.split(':')[1], 10)
      )
    )

    const totalScreenshots = grouped
      .flatMap((h) => h.intervals)
      .flatMap((i) => i.screenshots).length

    return {
      groupedScreenshots: grouped,
      totalScreenshots,
      employeeName,
    }
  }

  /* ===================== TANSTACK QUERY ===================== */

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['screenshots', userId, date, groupBy],
    queryFn: fetchScreenshots,
    enabled: !!userId,
  })

  /* ===================== HANDLERS ===================== */

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', e.target.value)
    router.replace(
      `/dashboard/owner/employee_list/show_screenshot/${id}?${params.toString()}`
    )
  }

  /* ===================== UI ===================== */

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>
  }

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load screenshots
      </p>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-[70vh] rounded-lg shadow">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold">
        Employee: {data?.employeeName}
      </h1>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="border p-2 rounded"
          />

          <select
            value={groupBy}
            onChange={(e) =>
              setGroupBy(
                e.target.value as '5min' | '10min' | '20min'
              )
            }
            className="border p-2 rounded"
          >
            <option value="5min">5 min</option>
            <option value="10min">10 min</option>
            <option value="20min">20 min</option>
          </select>
        </div>

        <div className="font-bold">
          Total:{' '}
          <span className="text-blue-600">
            {data?.totalScreenshots}
          </span>
        </div>
      </div>

      {data?.groupedScreenshots.map((hour) => (
        <div key={hour.hour} className="mb-6">
          <div className="bg-gray-200 px-3 py-2 rounded font-bold">
            Hour {hour.hour}.00
          </div>

          {hour.intervals.map((interval) => (
            <div key={interval.interval} className="mt-2">
              <p className="text-xs font-semibold">
                {interval.interval}
              </p>

              <div className="flex gap-2 overflow-x-auto">
                {interval.screenshots.map((shot) => (
                  <img
                    key={shot.id}
                    src={shot.path}
                    onClick={() => {
                      setModalImage(shot)
                      setModalOpen(true)
                    }}
                    className="w-28 h-24 object-cover rounded cursor-pointer"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {modalOpen && modalImage && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
        >
          <img
            src={modalImage.path}
            className="max-w-[80vw] max-h-[80vh]"
          />
        </div>
      )}
    </div>
  )
}
