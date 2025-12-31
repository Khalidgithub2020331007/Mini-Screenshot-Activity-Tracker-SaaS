import vine from '@vinejs/vine'

export const uploadScreenshotValidator = vine.compile(
  vine.object({
    name: vine.string(),
    path: vine.string(),
    type: vine.string(),
  })
)

// Admin query validation
export const adminQueryValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    date: vine.string().trim(),
    hour: vine.number().min(0).max(23).optional(),
    groupBy: vine.enum(['10min', '5min', 'hour']).optional(),
  })
)

// Employee query validation
export const employeeQueryValidator = vine.compile(
  vine.object({
    date: vine.string().trim(), // Format: YYYY-MM-DD
    hour: vine.number().min(0).max(23).optional(),
    groupBy: vine.enum(['10min', '5min', 'hour']).optional(),
  })
)

export const deleteScreenshotValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  })
)
