import type { HttpContext } from '@adonisjs/core/http'
import { storeOrderValidator } from '#validators/order'
import Order from '#models/order'
import Customization from '#models/customization'
import Variant from '#models/variant'

export default class OrdersController {
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
