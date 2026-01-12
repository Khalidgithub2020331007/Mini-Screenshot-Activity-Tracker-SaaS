// app/utils/group_screenshots.ts
import { DateTime } from 'luxon'

export type Screenshot = {
  id: number
  name: string
  url?: string
  type?: string
  createdAt: string
  [key: string]: any
}

export type GroupedScreenshots = Record<string, Record<string, Screenshot[]>>

export function groupScreenshots(
  screenshots: Screenshot[],
  groupBy: '5min' | '10min' | '20min' | 'hour'
): GroupedScreenshots {
  const grouped: GroupedScreenshots = {}
  let droppedInvalidDate = 0
  let droppedNoDate = 0

  for (const s of screenshots) {
    if (!s.createdAt) {
      droppedNoDate++
      console.log(`Dropped screenshot (no createdAt): id=${s.id}, name=${s.name}`)
      continue
    }

    const dt = DateTime.fromISO(s.createdAt, { zone: 'utc' })
    if (!dt.isValid) {
      droppedInvalidDate++
      console.log(
        `Dropped screenshot (invalid date): id=${s.id}, name=${s.name}, createdAt=${s.createdAt}`
      )
      continue
    }

    const dateKey = dt.toISODate()! // e.g., "2026-01-07"
    let timeKey: string

    if (groupBy === 'hour') {
      timeKey = dt.startOf('hour').toFormat('HH:mm')
    } else {
      let interval: number
      if (groupBy === '5min') interval = 5
      else if (groupBy === '10min') interval = 10
      else interval = 20

      const rounded = Math.floor(dt.minute / interval) * interval
      timeKey = dt.set({ minute: rounded, second: 0, millisecond: 0 }).toFormat('HH:mm')
    }

    grouped[dateKey] ??= {}
    grouped[dateKey][timeKey] ??= []
    grouped[dateKey][timeKey].push(s)
  }

  console.log('--- GroupScreenshots Debug ---')
  console.log(`Total screenshots input: ${screenshots.length}`)
  console.log(`Dropped because missing createdAt: ${droppedNoDate}`)
  console.log(`Dropped because invalid createdAt: ${droppedInvalidDate}`)
  console.log(
    `Total screenshots after grouping: ${screenshots.length - droppedNoDate - droppedInvalidDate}`
  )
  console.log('-------------------------------')

  return grouped
}
