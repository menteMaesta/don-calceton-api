import app from '@adonisjs/core/services/app'
import env from '#start/env'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import { unlinkSync } from 'fs'
import {
  storeImageValidator,
  updateImageValidator,
  destroyImageValidator,
  bulkStoreImageValidator,
} from '#validators/image'
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
    await image.move(app.makePath(env.get('UPLOADS_PATH')), {
      name: imageName,
    })

    const variant = await Variant.findOrFail(variant_id)
    const newImg = await variant.related('images').create({ name: imageName })
    const imgJson = newImg.serialize()

    response.send(imgJson)
  }

  /**
   * Handle bulk image submissions
   */
  async bulkStore({ request, response }: HttpContext) {
    const {
      params: { variant_id },
      images,
    } = await request.validateUsing(bulkStoreImageValidator)

    const variant = await Variant.findOrFail(variant_id)

    for (let image of images) {
      const imageName = `${cuid()}.${image.extname}`
      await image.move(app.makePath(env.get('UPLOADS_PATH')), {
        name: imageName,
      })
      await variant.related('images').create({ name: imageName })
    }

    response.send({ message: `uploaded images to ${variant_id}` })
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

    try {
      unlinkSync(`${env.get('UPLOADS_PATH')}/${image.name}`)
    } catch (err) {
      response.abort({ message: err.message })
    }

    const imageName = `${cuid()}.${newImage.extname}`
    await newImage.move(app.makePath(env.get('UPLOADS_PATH')), {
      name: imageName,
    })

    image.name = imageName
    image.save()
    const imageJson = image.serialize()

    response.send(imageJson)
  }

  /**
   * Delete record
   */
  async destroy({ request, response }: HttpContext) {
    const {
      params: { id },
    } = await request.validateUsing(destroyImageValidator)
    const image = await Image.findOrFail(id)

    try {
      unlinkSync(`${env.get('UPLOADS_PATH')}/${image.name}`)
    } catch (err) {
      response.abort({ message: err.message })
    }

    image.delete()
    response.send({ message: `id of deleted image: ${image.id}` })
  }
}
