import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Variant from '#models/variant'
import Customization from '#models/customization'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string
  @column()
  declare description: string | null
  @column({ serialize: (value: number) => Number(value) })
  declare price: number
  @column({ serialize: (value: number) => Number(value) })
  declare wholesalePrice: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Variant)
  declare variants: HasMany<typeof Variant>

  @hasMany(() => Customization)
  declare customizations: HasMany<typeof Customization>
}
