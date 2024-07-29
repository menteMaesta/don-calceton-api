import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { createAdminUser, getImagePath } from '#tests/functional/helpers'
import { ProductFactory } from '#database/factories/product_factory'
import { OrderFactory } from '#database/factories/order_factory'

test.group('Order images', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('store an order image', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const product = await ProductFactory.with('variants', 1).with('customizations', 1).create()
    const productJson = product.serialize()
    const order = await OrderFactory.merge({
      customizationId: productJson.customizations[0].id,
      variantId: productJson.variants[0].id,
    }).create()
    const orderJson = order.serialize()

    const response = await client
      .post(route('/api/orders/:order_id/images', [orderJson.id]))
      .field('orderId', orderJson.id)
      .file('image', getImagePath())
      .loginAs(admin)
    const responseBody = response.body()

    assert.include(responseBody.name, '.png')
    response.assertStatus(200)
    response.assertAgainstApiSpec()
  })
})
