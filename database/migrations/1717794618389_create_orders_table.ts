import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('customization_id')
        .unsigned()
        .references('customizations.id')
        .onDelete('CASCADE')
      table.integer('variant_id').unsigned().references('variants.id').onDelete('CASCADE')
      table.decimal('image_size')
      table.enu('status', ['ACTIVE', 'IN_PROGRESS', 'DONE'], {
        useNative: true,
        enumName: 'status',
        existingType: false,
        schemaName: 'public',
      })
      table.integer('quantity')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.raw('DROP TYPE IF EXISTS "status" CASCADE')
    this.schema.dropTable(this.tableName)
  }
}
