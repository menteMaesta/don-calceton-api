import factory from '@adonisjs/lucid/factories'
import Customization from '#models/customization'

export const CustomizationFactory = factory
  .define(Customization, async ({ faker }) => {
    return {
      title: faker.word.words(3),
      max_size: faker.number.float({ max: 200, fractionDigits: 2 }),
      min_size: faker.number.float({ max: 200, fractionDigits: 2 }),
    }
  })
  .build()
