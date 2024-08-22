import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('orders', (table) => {
      table.string('invoice_id').nullable()
      table.string('custom_id').nullable()
    })
  }
}
