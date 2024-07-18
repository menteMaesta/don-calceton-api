import type { HttpContext } from '@adonisjs/core/http'
import { indexOrdersValidator, storeOrderValidator } from '#validators/order'
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
}
