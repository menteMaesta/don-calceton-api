import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('products', (table) => {
      table.decimal('wholesale_price', 10, 2).nullable()
    })
  }
}
