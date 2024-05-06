import type { HttpContext } from '@adonisjs/core/http'
import {
  listVariantsValidator,
  storeVariantValidator,
  showVariantValidator,
  updateVariantValidator,
  listCartVariantsValidator,
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
      params: { product_id: productId },
      ...data
    } = await request.validateUsing(storeVariantValidator)
    const product = await Product.findOrFail(productId)
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

  async showAll({ response }: HttpContext) {
    const allProducts = await Product.query()
    const productsJson = allProducts.map((product) =>
      product.serialize({ fields: ['id', 'name', 'price', 'wholesalePrice'] })
    )
    const allVariants = await Variant.query().preload('images', (query) => query.groupLimit(1))
    const variantsJson = allVariants.map((variant) => {
      const currentProduct = productsJson.find((product) => product.id === variant.productId)
      let variantJson = variant.serialize({
        fields: {
          omit: ['createdAt', 'updatedAt'],
        },
        relations: {
          images: {
            fields: {
              pick: ['id', 'name'],
            },
          },
        },
      })
      variantJson.images = variantJson.images[0]
      variantJson.productName = currentProduct?.name
      variantJson.productPrice = currentProduct?.price
      variantJson.productWholesalePrice = currentProduct?.wholesalePrice
      return variantJson
    })
    response.send(variantsJson)
  }

  async getCartItems({ request, response }: HttpContext) {
    const payload = await request.validateUsing(listCartVariantsValidator)
    const variantIds = payload.variantIds
    const variants = await Variant.query().whereIn('id', variantIds).preload('images')
    const variantsJson = variants.map((variant) => variant.serialize())
    response.send(variantsJson)
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
