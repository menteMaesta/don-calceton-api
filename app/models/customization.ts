import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Customization extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare variantId: number

  @column()
  declare title: string
  @column({ serialize: (value: number) => Number(value) })
  declare max_size: number
  @column({ serialize: (value: number) => Number(value) })
  declare min_size: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
