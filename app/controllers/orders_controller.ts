import type { HttpContext } from '@adonisjs/core/http'
import {
  indexOrdersValidator,
  storeOrderValidator,
  bulkStoreOrderValidator,
} from '#validators/order'
import Order from '#models/order'
import Customization from '#models/customization'
import Variant from '#models/variant'

export default class OrdersController {
  async index({ request, response }: HttpContext) {
    const { status = '' } = await request.validateUsing(indexOrdersValidator)
    const allOrders = status
      ? await Order.query().where('status', status.toLocaleUpperCase())
      : await Order.all()
    const ordersJson = allOrders.map((order) => order.serialize())
    response.send(ordersJson)
  }

  async store({ request, response }: HttpContext) {
    const { customizationId, variantId, imageSize, quantity, status } =
      await request.validateUsing(storeOrderValidator)
    await Customization.findOrFail(customizationId)
    await Variant.findOrFail(variantId)
    const order = await Order.create({
      customizationId,
      variantId,
      imageSize,
      quantity,
      status,
    })
    const orderJson = order.serialize()
    response.send(orderJson)
  }

  /**
   * Handle bulk order submissions
   */
  async bulkStore({ request, response }: HttpContext) {
    const { orders } = await request.validateUsing(bulkStoreOrderValidator)
    let someFailed = false

    for (let order of orders) {
      const customization = await Customization.find(order.customizationId)
      const variant = await Variant.find(order.variantId)
      if (customization && variant) {
        await Order.create({
          customizationId: order.customizationId,
          variantId: order.variantId,
          imageSize: order.imageSize,
          quantity: order.quantity,
          status: order.status,
        })
      } else {
        someFailed = true
      }
    }
    someFailed
      ? response
          .status(400)
          .send({ message: 'Some orders where not created, customization or variant not found' })
      : response.send({ message: 'All orders created successfully' })
  }
}
