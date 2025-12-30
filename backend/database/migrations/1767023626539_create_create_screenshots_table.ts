import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ScreenshotsSchema extends BaseSchema {
  protected tableName = 'screenshots'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('company_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')
        .index()

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .index()

      table.string('name', 255).notNullable()
      table.string('path', 255).notNullable()
      table.string('type', 255).notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now()).index()
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())

      // Composite indexes for fast queries (Hubstaff-like)
      table.index(['user_id', 'created_at'], 'idx_user_created_at')
      table.index(['company_id', 'created_at'], 'idx_company_created_at')
      table.index(['company_id', 'user_id', 'created_at'], 'idx_company_user_created_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
