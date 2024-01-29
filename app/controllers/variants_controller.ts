import type { HttpContext } from '@adonisjs/core/http'
import {
  listVariantsValidator,
  storeVariantValidator,
  showVariantValidator,
  updateVariantValidator,
} from '#validators/variant'
import Product from '#models/product'
import Variant from '#models/variant'

export default class VariantsController {
  async index({ request, response }: HttpContext) {
    const payload = await request.validateUsing(listVariantsValidator)
    const product = await Product.findOrFail(payload.params.product_id)
    const variants = await product
      .related('variants')
      .query()
      .preload('images', (query) => query.groupLimit(1))
    response.send(variants)
  }

  async store({ request, response }: HttpContext) {
    const {
      params: { product_id },
      ...data
    } = await request.validateUsing(storeVariantValidator)
    const product = await Product.findOrFail(product_id)
    const newVariant = await product.related('variants').create(data)
    response.send(newVariant)
  }

  async show({ request, response }: HttpContext) {
    const {
      params: { id },
    } = await request.validateUsing(showVariantValidator)
    const variant = await Variant.findOrFail(id) // TODO: attach images
    response.send(variant)
  }

  async update({ request, response }: HttpContext) {
    const {
      params: { id },
      ...data
    } = await request.validateUsing(updateVariantValidator)
    const variant = await Variant.findOrFail(id)
    if (data.name) {
      variant.name = data.name
    }
    if (data.quantity) {
      variant.quantity = data.quantity
    }
    variant.save()
    response.send(variant)
  }

  async destroy({ request, response }: HttpContext) {
    const {
      params: { id },
    } = await request.validateUsing(showVariantValidator)
    const variant = await Variant.findOrFail(id)
    variant.delete()
    response.send(`id of deleted variant: ${variant.id}`)
  }
}
