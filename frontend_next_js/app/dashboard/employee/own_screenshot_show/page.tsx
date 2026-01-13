'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/app/api/axios'

export type Screenshot = {
  id: number
  name: string
  url: string
  type: string
  created_at: string
}

type Interval = {
  interval: string
  screenshots: Screenshot[]
}

type HourData = {
  hour: number
  intervals: Interval[]
}

// ---------------- FETCH FUNCTION ----------------
const fetchScreenshots = async (
  date: string,
  groupBy: '5min' | '10min' | '20min'
): Promise<HourData[]> => {
  const res = await api.get('/employee-query', {
    params: { date, groupBy },
  })

  const data = res.data?.[date]
  if (!data) return []

  const grouped: HourData[] = []

  Object.entries(data).forEach(([timeKey, shots]: [string, any[]]) => {
    const hour = parseInt(timeKey.split(':')[0], 10)

    const intervalObj: Interval = {
      interval: timeKey,
      screenshots: shots.map((shot: any) => ({
        id: shot.id,
        name: shot.name,
        url: shot.path,
        type: shot.type,
        created_at: shot.createdAt,
      })),
    }

    const existingHour = grouped.find((h) => h.hour === hour)
    if (existingHour) {
      existingHour.intervals.push(intervalObj)
    } else {
      grouped.push({ hour, intervals: [intervalObj] })
    }
  })

  grouped.sort((a, b) => a.hour - b.hour)
  grouped.forEach((h) =>
    h.intervals.sort(
      (a, b) =>
        parseInt(a.interval.split(':')[1]) -
        parseInt(b.interval.split(':')[1])
    )
  )

  return grouped
}

// ---------------- COMPONENT ----------------
const Show_Screenshot: React.FC = () => {
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [groupBy, setGroupBy] = useState<'5min' | '10min' | '20min'>('10min')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState<Screenshot | null>(null)

  const {
    data: groupedScreenshots,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['screenshots', date, groupBy],
    queryFn: () => fetchScreenshots(date, groupBy),
  })

  const openModal = (shot: Screenshot) => {
    setModalImage(shot)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalImage(null)
  }

  // ---------------- UI ----------------
  if (isLoading) {
    return <p className="text-center py-10 text-gray-500">Loading screenshots...</p>
  }

  if (isError) {
    return <p className="text-center py-10 text-red-500">Failed to load screenshots</p>
  }

  return (
    <div className="p-6 bg-gray-50 min-h-[70vh] rounded-lg shadow-md relative">
      {/* Controls */}
      <div className="flex items-center gap-4 mb-4">
        <p className="font-semibold">Select Date:</p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />

        <p className="font-semibold">Group By:</p>
        <select
          value={groupBy}
          onChange={(e) =>
            setGroupBy(e.target.value as '5min' | '10min' | '20min')
          }
          className="border p-2 rounded"
        >
          <option value="5min">5 Minutes</option>
          <option value="10min">10 Minutes</option>
          <option value="20min">20 Minutes</option>
        </select>
      </div>

      {/* Content */}
      {groupedScreenshots?.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No screenshots found for this date.
        </p>
      ) : (
        groupedScreenshots?.map((hourData) => (
          <div key={hourData.hour} className="mb-6">
            <h2 className="font-bold mb-2">Hour: {hourData.hour}.00</h2>

            {hourData.intervals.map((interval) => (
              <div key={interval.interval}>
                <p className="text-xs font-semibold mb-1">
                  {interval.interval}
                </p>

                <div className="flex gap-2 overflow-x-auto">
                  {interval.screenshots.map((shot) => (
                    <div
                      key={shot.id}
                      className="w-32 cursor-pointer"
                      onClick={() => openModal(shot)}
                    >
                      <img
                        src={shot.url}
                        alt={shot.name}
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Modal */}
      {modalOpen && modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
          onClick={closeModal}
        >
          <img
            src={modalImage.url}
            alt={modalImage.name}
            className="max-w-[80vw] max-h-[80vh]"
          />
        </div>
      )}
    </div>
  )
}

export default Show_Screenshot
