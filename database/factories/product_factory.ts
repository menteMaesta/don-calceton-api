import factory from '@adonisjs/lucid/factories'
import Product from '#models/product'
import { VariantFactory } from '#database/factories/variant_factory'
import { CustomizationFactory } from '#database/factories/customization_factory'

export const ProductFactory = factory
  .define(Product, async ({ faker }) => {
    return {
      name: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      price: faker.number.float({ max: 100, fractionDigits: 2 }),
      wholesalePrice: faker.number.float({ max: 50, fractionDigits: 2 }),
    }
  })
  .relation('variants', () => VariantFactory)
  .relation('customizations', () => CustomizationFactory)
  .build()
