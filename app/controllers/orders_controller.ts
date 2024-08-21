import type { HttpContext } from '@adonisjs/core/http'
import {
  indexOrdersValidator,
  storeOrderValidator,
  verifyQuantityValidator,
} from '#validators/order'
import Order from '#models/order'
import Customization from '#models/customization'
import Variant from '#models/variant'

export default class OrdersController {
  async index({ request, response }: HttpContext) {
    const { status = '' } = await request.validateUsing(indexOrdersValidator)
    const allOrders = status
      ? await Order.query()
          .where('status', status.toLocaleUpperCase())
          .preload('images')
          .preload('customization')
          .preload('variant')
          .orderBy('created_at', 'asc')
      : await Order.query()
          .preload('images')
          .preload('customization')
          .preload('variant', (subQuery) => subQuery.preload('images'))
          .orderBy('created_at', 'asc')
    const ordersJson = allOrders.map((order) =>
      order.serialize({
        relations: {
          customization: {
            fields: { pick: ['title'] },
          },
          variant: { fields: { pick: ['name', 'images'] } },
        },
      })
    )
    response.send(ordersJson)
  }

  async store({ request, response }: HttpContext) {
    const { customizationId, variantId, imageSize, quantity, status } =
      await request.validateUsing(storeOrderValidator)

    const variant = await Variant.findOrFail(variantId)
    await Customization.findOrFail(customizationId)
    variant.quantity = variant.quantity - quantity

    if (variant.quantity >= 0) {
      const order = await Order.create({
        customizationId,
        variantId,
        imageSize,
        quantity,
        status,
      })
      variant.save() // Save the variant with the new quantity
      const orderJson = order.serialize()
      response.send(orderJson)
    } else {
      response.status(400).send({ message: 'Not enough quantity' })
    }
  }

  async verifyQuantity({ request, response }: HttpContext) {
    const { orders } = await request.validateUsing(verifyQuantityValidator)
    for (const order of orders) {
      const variant = await Variant.findOrFail(order.variantId)
      if (variant.quantity < order.quantity) {
        response.status(400).send({ message: 'Not enough quantity' })
        return
      }
    }
  }
}
