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
        .index() // Filter by company quickly

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .index() // Filter by employee quickly

      table.string('image_name').notNullable()

      table
        .timestamp('created_at', { useTz: true })
        .defaultTo(this.now())
        .index() // For grouping by day/hour/5-10 min

      // Optional composite index for even faster queries:
      // table.index(['user_id', 'created_at'], 'idx_user_created_at');
      // table.index(['company_id', 'created_at'], 'idx_company_created_at');
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

