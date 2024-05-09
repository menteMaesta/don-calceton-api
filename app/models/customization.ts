import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Customization extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column({ serializeAs: 'variantId' })
  declare variantId: number

  @column()
  declare title: string
  @column({ serializeAs: 'maxSize' })
  declare max_size: number
  @column({ serializeAs: 'minSize' })
  declare min_size: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
