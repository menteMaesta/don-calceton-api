import type { HttpContext } from '@adonisjs/core/http'
import {
  indexCustomizationValidator,
  storeCustomizationValidator,
  updateCustomizationValidator,
  deleteCustomizationValidator,
} from '#validators/customization'
import Product from '#models/product'
import Customization from '#models/customization'

export default class CustomizationsController {
  async index({ request, response }: HttpContext) {
    const {
      params: { product_id: productId },
    } = await request.validateUsing(indexCustomizationValidator)
    const product = await Product.findOrFail(productId)
    const customizations = await product.related('customizations').query().orderBy('id', 'asc')
    const customizationsJson = customizations.map((customization) => customization.serialize())

    response.send(customizationsJson)
  }

  async store({ request, response }: HttpContext) {
    const {
      params: { product_id: productId },
      title,
      maxSize,
      minSize,
    } = await request.validateUsing(storeCustomizationValidator)
    const product = await Product.findOrFail(productId)
    const customization = await product
      .related('customizations')
      .create({ title, max_size: maxSize, min_size: minSize })
    const newCustomizationJson = customization.serialize()

    response.send(newCustomizationJson)
  }

  async update({ request, response }: HttpContext) {
    const {
      params: { id },
      title,
      maxSize,
      minSize,
    } = await request.validateUsing(updateCustomizationValidator)
    const customization = await Customization.findOrFail(id)

    if (title) {
      customization.title = title
    }
    if (maxSize) {
      customization.max_size = maxSize
    }
    if (minSize) {
      customization.min_size = minSize
    }
    customization.save()
    const customizationJson = customization.serialize()

    response.send(customizationJson)
  }

  async destroy({ request, response }: HttpContext) {
    const {
      params: { id },
    } = await request.validateUsing(deleteCustomizationValidator)
    const customization = await Customization.findOrFail(id)
    await customization.delete()

    response.send({ message: `id of deleted customization: ${customization.id}` })
  }
}
