import factory from '@adonisjs/lucid/factories'
import Variant from '#models/variant'
import { ImageFactory } from '#database/factories/image_factory'

export const VariantFactory = factory
  .define(Variant, async ({ faker }) => {
    return {
      name: faker.commerce.productAdjective(),
      quantity: faker.number.int({ max: 10 }),
    }
  })
  .state('stock10', (variant) => (variant.quantity = 10))
  .relation('images', () => ImageFactory)
  .build()
