import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import Variant from '#models/variant'
import {
  storeProductValidator,
  showProductValidator,
  updateProductValidator,
} from '#validators/product'

export default class ProductsController {
  async index({ response }: HttpContext) {
    const allProducts = await Product.query()
      .orderBy('id', 'asc')
      .preload('variants', (query) => {
        return query.preload('images', (subQuery) => subQuery.orderBy('id', 'asc').groupLimit(1))
      })
    const productsJson = allProducts.map((product) => {
      const formatProduct = product.serialize({
        relations: {
          variants: {
            fields: { pick: ['images'] },
            relations: {
              images: {
                fields: { pick: ['id', 'name'] },
              },
            },
          },
        },
      })
      formatProduct.variants = formatProduct.variants.map((variant: Variant) => {
        if (variant.images.length > 0) {
          return {
            id: variant.images[0].id,
            name: variant.images[0].name,
          }
        } else {
          return {
            id: variant.id,
            name: null,
          }
        }
      })
      return formatProduct
    })

    response.send(productsJson)
  }

  async store({ request, response }: HttpContext) {
    const newProductData = await request.validateUsing(storeProductValidator)

    const newProduct = await Product.create(newProductData)

    if (newProduct.$isPersisted) {
      const productJson = newProduct.serialize()
      response.send(productJson)
    } else {
      response.abort({ message: 'can not add element' })
    }
  }

  async show({ request, response }: HttpContext) {
    const payload = await request.validateUsing(showProductValidator)
    const productId = payload.params.id
    const product = await Product.findOrFail(productId)
    const variants = await product
      .related('variants')
      .query()
      .preload('images', (query) => query.groupLimit(1))
    const productJSON = product.serialize()

    response.send({ ...productJSON, variants })
  }

  async update({ request, response }: HttpContext) {
    const {
      params: { id: productId },
      ...data
    } = await request.validateUsing(updateProductValidator)
    const product = await Product.findOrFail(productId)

    if (data.name) {
      product.name = data.name
    }
    if (data.description) {
      product.description = data.description
    }
    if (data.price) {
      product.price = data.price
    }
    if (data.wholesalePrice) {
      product.wholesalePrice = data.wholesalePrice
    }

    if (data.name || data.description || data.price || data.wholesalePrice) {
      product.save()
    }
    const productJson = product.serialize()

    response.send(productJson)
  }

  async destroy({ request, response }: HttpContext) {
    const payload = await request.validateUsing(showProductValidator)
    const productId = payload.params.id
    const product = await Product.findOrFail(productId)
    await product.delete()
    response.send({ message: `id of deleted product: ${product.id}` })
  }
}
