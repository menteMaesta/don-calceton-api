import type { HttpContext } from '@adonisjs/core/http'
import {
  storeCustomizationValidator,
  updateCustomizationValidator,
  deleteCustomizationValidator,
} from '#validators/customization'
import Variant from '#models/variant'
import Customization from '#models/customization'

export default class CustomizationsController {
  async store({ request, response }: HttpContext) {
    const {
      params: { variant_id: variantId },
      title,
      maxSize,
      minSize,
    } = await request.validateUsing(storeCustomizationValidator)
    const variant = await Variant.findOrFail(variantId)
    const customization = await variant
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
