import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import OrderImage from '#models/order_image'
import Customization from '#models/customization'
import Variant from '#models/variant'

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
  declare status: 'IN_PROCESS' | 'DELIVERED' | 'CANCELED'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => OrderImage)
  declare images: HasMany<typeof OrderImage>

  @belongsTo(() => Customization)
  declare customization: BelongsTo<typeof Customization>

  @belongsTo(() => Variant)
  declare variant: BelongsTo<typeof Variant>
}
