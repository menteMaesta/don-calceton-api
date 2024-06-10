import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { OrderFactory } from '#database/factories/order_factory'
import { ProductFactory } from '#database/factories/product_factory'
import { createAdminUser } from '#tests/functional/helpers'

test.group('Orders', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('store an order', async ({ client, route }) => {
    const admin = await createAdminUser()
    const product = await ProductFactory.with('variants', 1).with('customizations', 1).create()
    const productJson = product.serialize()
    const newOrder = await OrderFactory.merge({
      customizationId: productJson.customizations[0].id,
      variantId: productJson.variants[0].id,
    }).makeStubbed()
    const newOrderJson = newOrder.serialize()

    const response = await client
      .post(route('orders.store'))
      .json({ ...newOrderJson, images: [] })
      .loginAs(admin)

    response.assertAgainstApiSpec()
    response.assertBodyContains({ imageSize: newOrderJson.imageSize })
    response.assertBodyContains({ quantity: newOrderJson.quantity })
    response.assertBodyContains({ status: newOrderJson.status })
    response.assertBodyContains({ customizationId: newOrderJson.customizationId })
    response.assertBodyContains({ variantId: newOrderJson.variantId })
  })
})
