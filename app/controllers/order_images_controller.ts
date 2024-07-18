import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import env from '#start/env'
import { storeOrderImageValidator } from '#validators/order_image'
import Order from '#models/order'
import OrderImage from '#models/order_image'

export default class OrderImagesController {
  async store({ request, response }: HttpContext) {
    const {
      params: { order_id: orderId },
      image,
    } = await request.validateUsing(storeOrderImageValidator)
    const imageName = `${cuid()}.${image.extname}`
    await image.move(app.makePath(env.get('UPLOADS_PATH')), {
      name: imageName,
    })
    await Order.findOrFail(orderId)
    const orderImage = await OrderImage.create({
      orderId,
      name: imageName,
    })
    const orderImageJson = orderImage.serialize()
    response.send(orderImageJson)
  }
}
