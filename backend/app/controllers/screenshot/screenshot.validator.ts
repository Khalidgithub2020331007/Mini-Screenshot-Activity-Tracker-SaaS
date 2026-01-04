import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const uploadScreenshotValidator = vine.compile(
  vine.object({
    name: vine.string(),
    path: vine.string(),
    type: vine.string(),
  })
)
uploadScreenshotValidator.messagesProvider = new SimpleMessagesProvider({
  string: 'the value of {{field}} must be a required string',
  number: 'the value of {{field}} must be a number',
  enum: 'the value of {{field}} must be one of {{enum}}',
  any: 'the value of {{field}} is not valid',
  minLength: 'the value of {{field}} must be at least {{minLength}} characters long',
  maxLength: 'the value of {{field}} must be at most {{maxLength}} characters long',
  email: 'the value of {{field}} must be a valid email',
})

// Admin query validation
export const adminQueryValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    date: vine.string().trim(),
    hour: vine.number().min(0).max(23).optional(),
    groupBy: vine.enum(['10min', '5min', '20min']).optional(),
  })
)

adminQueryValidator.messagesProvider = new SimpleMessagesProvider({
  string: 'the value of {{field}} must be a required string',
  number: 'the value of {{field}} must be a number',
  enum: 'the value of {{field}} must be one of {{enum}}',
  any: 'the value of {{field}} is not valid',
  minLength: 'the value of {{field}} must be at least {{minLength}} characters long',
  maxLength: 'the value of {{field}} must be at most {{maxLength}} characters long',
  email: 'the value of {{field}} must be a valid email',
})

// Employee query validation
export const employeeQueryValidator = vine.compile(
  vine.object({
    date: vine.string().trim(), // Format: YYYY-MM-DD
    hour: vine.number().min(0).max(23).optional(),
    groupBy: vine.enum(['10min', '5min', '20min', 'hour']).optional(),
  })
)
employeeQueryValidator.messagesProvider = new SimpleMessagesProvider({
  string: 'the value of {{field}} must be a required string',
  number: 'the value of {{field}} must be a number',
  enum: 'the value of {{field}} must be one of {{enum}}',
  any: 'the value of {{field}} is not valid',
  minLength: 'the value of {{field}} must be at least {{minLength}} characters long',
  maxLength: 'the value of {{field}} must be at most {{maxLength}} characters long',
  email: 'the value of {{field}} must be a valid email',
})
