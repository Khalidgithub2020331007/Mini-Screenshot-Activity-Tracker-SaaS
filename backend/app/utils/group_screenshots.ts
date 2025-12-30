import { DateTime } from 'luxon'

export function groupScreenshots(screenshots: any[], interval: '5min' | '10min' | 'hour') {
  const result: any = {}

  screenshots.forEach((shot) => {
    const time = DateTime.fromJSDate(shot.createdAt)

    const hourKey = time.toFormat('HH:00')

    if (!result[hourKey]) {
      result[hourKey] = {}
    }

    let minuteKey = 'full-hour'

    if (interval !== 'hour') {
      const step = interval === '5min' ? 5 : 10
      const roundedMinute = Math.floor(time.minute / step) * step
      minuteKey = `${time.toFormat('HH')}:${roundedMinute.toString().padStart(2, '0')}`
    }

    if (!result[hourKey][minuteKey]) {
      result[hourKey][minuteKey] = []
    }

    result[hourKey][minuteKey].push(shot)
  })

  return result
}
