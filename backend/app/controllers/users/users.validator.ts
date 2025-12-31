import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(8),
  })
)

export const companyCreateValidator = vine.compile(
  vine.object({
    ownerName: vine.string().trim().minLength(3),
    ownerEmail: vine.string().trim().email(),
    ownerPassword: vine.string().trim().minLength(8),
    companyName: vine.string().trim().minLength(3),
    plan: vine.enum(['basic', 'pro', 'enterprise']),
  })
)
export const employeeListValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    page: vine
      .number()
      .optional()
      .transform((value) => Number(value)),
    limit: vine
      .number()
      .optional()
      .transform((value) => Number(value)),
  })
)

createUserValidator.messagesProvider = new SimpleMessagesProvider({
  string: 'the value of {{field}} must be a required string',
  number: 'the value of {{field}} must be a number',
  enum: 'the value of {{field}} must be one of {{enum}}',
  any: 'the value of {{field}} is not valid',
  minLength: 'the value of {{field}} must be at least {{minLength}} characters long',
  maxLength: 'the value of {{field}} must be at most {{maxLength}} characters long',
  email: 'the value of {{field}} must be a valid email',
})

companyCreateValidator.messagesProvider = new SimpleMessagesProvider({
  string: 'the value of {{field}} must be a required string',
  enum: 'the value of {{field}} must be one of {{enum}}',
  any: 'the value of {{field}} is not valid',
  minLength: 'the value of {{field}} must be at least {{minLength}} characters long',
  length: 'the value of {{field}} must be {{length}} characters long',
  email: 'the value of {{field}} must be a valid email',
})
