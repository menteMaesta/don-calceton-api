import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare customizationId: number
  @column()
  declare variantId: number
  @column({ serialize: (value: number) => Number(value) })
  declare imageSize: number
  @column({ serialize: (value: number) => Number(value) })
  declare quantity: number
  @column()
  declare status: 'ACTIVE' | 'IN_PROGRESS' | 'DONE'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
