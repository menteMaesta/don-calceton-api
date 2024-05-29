import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('customizations', (table) => {
      table.dropForeign('variant_id')
      table.dropColumn('variant_id')
      table.integer('product_id').unsigned().references('products.id').onDelete('CASCADE')
    })
  }
}
