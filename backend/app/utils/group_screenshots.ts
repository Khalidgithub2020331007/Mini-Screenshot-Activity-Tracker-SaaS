// app/utils/group_screenshots.ts
import { DateTime } from 'luxon'

export function groupScreenshots(
  screenshots: { createdAt: string }[],
  groupBy: '5min' | '10min' | '20min' | 'hour'
) {
  const grouped: Record<string, Record<string, any[]>> = {}

  for (const s of screenshots) {
    // console.log('RAW createdAt:', s.createdAt)

    const dt = DateTime.fromISO(s.createdAt, { zone: 'utc' }).setZone('Asia/Dhaka')

    // console.log('PARSED:', dt.toISO(), 'isValid:', dt.isValid)

    if (!dt.isValid) continue

    const dateKey = dt.toISODate()!

    let timeKey: string

    if (groupBy === 'hour') {
      timeKey = dt.startOf('hour').toFormat('HH:mm')
    } else {
      const interval = groupBy === '5min' ? 5 : 10
      const rounded = Math.floor(dt.minute / interval) * interval

      timeKey = dt.set({ minute: rounded, second: 0, millisecond: 0 }).toFormat('HH:mm')
    }

    grouped[dateKey] ??= {}
    grouped[dateKey][timeKey] ??= []
    grouped[dateKey][timeKey].push(s)
  }

  return grouped
}
