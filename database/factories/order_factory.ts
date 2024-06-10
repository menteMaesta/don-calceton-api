import factory from '@adonisjs/lucid/factories'
import Order from '#models/order'
import { STATUS } from '#app/constants'

export const OrderFactory = factory
  .define(Order, async ({ faker }) => {
    return {
      imageSize: faker.number.float({ max: 200, fractionDigits: 2 }),
      quantity: faker.number.int(100),
      status: faker.helpers.arrayElement(STATUS) as Order['status'],
    }
  })
  .state('active', (order) => (order.status = 'ACTIVE'))
  .state('inProgress', (order) => (order.status = 'IN_PROGRESS'))
  .state('done', (order) => (order.status = 'DONE'))
  .build()
