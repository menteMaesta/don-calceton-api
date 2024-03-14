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
    const variants = await product.related('variants').query().preload('images')
    const variantsJson = variants.map((variant) => variant.serialize())

    response.send(variantsJson)
  }

  async store({ request, response }: HttpContext) {
    const {
      params: { product_id },
      ...data
    } = await request.validateUsing(storeVariantValidator)
    const product = await Product.findOrFail(product_id)
    const newVariant = await product.related('variants').create(data)
    const newVariantJson = newVariant.serialize()

    response.send(newVariantJson)
  }

  async show({ request, response }: HttpContext) {
    const {
      params: { id },
    } = await request.validateUsing(showVariantValidator)
    const variant = await Variant.findOrFail(id)
    const images = await variant.related('images').query()
    const variantJson = { ...variant.serialize(), images }

    response.send(variantJson)
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
    const variantJson = variant.serialize()

    response.send(variantJson)
  }

  async destroy({ request, response }: HttpContext) {
    const {
      params: { id },
    } = await request.validateUsing(showVariantValidator)
    const variant = await Variant.findOrFail(id)
    variant.delete()
    response.send({ message: `id of deleted variant: ${variant.id}` })
  }
}
