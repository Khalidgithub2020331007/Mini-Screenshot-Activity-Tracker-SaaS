import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import Screenshot from './screenshot.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string
  @column()
  declare plan: 'basic' | 'pro' | 'enterprise'

  // Relationships

  @hasMany(() => User)
  declare employees: HasMany<typeof User>

  @hasMany(() => Screenshot)
  declare screenshots: HasMany<typeof Screenshot>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
