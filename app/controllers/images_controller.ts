import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import { unlink } from 'fs'
import { storeImageValidator, updateImageValidator, destroyImageValidator } from '#validators/image'
import Variant from '#models/variant'
import Image from '#models/image'

export default class ImagesController {
  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const {
      params: { variant_id },
      image,
    } = await request.validateUsing(storeImageValidator)
    const imageName = `${cuid()}.${image.extname}`
    await image.move(app.makePath('uploads'), {
      name: imageName,
    })

    const variant = await Variant.findOrFail(variant_id)
    const newImg = await variant.related('images').create({ name: imageName })

    response.send(newImg)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response }: HttpContext) {
    const {
      params: { id },
      image: newImage,
    } = await request.validateUsing(updateImageValidator)
    const image = await Image.findOrFail(id)

    unlink(`uploads/${image.name}`, (err) => {
      if (err) throw err
      console.log(`uploads/${image.name} was deleted`)
    })

    const imageName = `${cuid()}.${newImage.extname}`
    await newImage.move(app.makePath('uploads'), {
      name: imageName,
    })

    image.name = imageName
    image.save()

    response.send(image)
  }

  /**
   * Delete record
   */
  async destroy({ request, response }: HttpContext) {
    const {
      params: { id },
    } = await request.validateUsing(destroyImageValidator)
    const image = await Image.findOrFail(id)
    image.delete()
    response.send(`id of deleted image: ${image.id}`)
  }
}