import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Image from '#models/image'

export default class Variant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string
  @column()
  declare productId: number
  @column()
  declare quantity: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Image)
  declare images: HasMany<typeof Image>
}
