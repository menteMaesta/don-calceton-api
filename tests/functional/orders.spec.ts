import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { OrderFactory } from '#database/factories/order_factory'
import { ProductFactory } from '#database/factories/product_factory'
import { createAdminUser } from '#tests/functional/helpers'

test.group('Orders', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('get all orders', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const product = await ProductFactory.with('variants', 1).with('customizations', 1).create()
    const productJson = product.serialize()
    const orders = await OrderFactory.merge({
      customizationId: productJson.customizations[0].id,
      variantId: productJson.variants[0].id,
    }).createMany(3)
    const ordersJson = orders.map((order) => order.serialize())

    const response = await client.post(route('/api/orders/all')).loginAs(admin)

    response.assertAgainstApiSpec()
    assert.equal(response.body().length, ordersJson.length)
  })

  test('get orders with specific status', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const product = await ProductFactory.with('variants', 1).with('customizations', 1).create()
    const productJson = product.serialize()
    const ordersDelivered = await OrderFactory.apply('delivered')
      .merge({
        customizationId: productJson.customizations[0].id,
        variantId: productJson.variants[0].id,
      })
      .createMany(3)

    await OrderFactory.apply('inProcess')
      .merge({
        customizationId: productJson.customizations[0].id,
        variantId: productJson.variants[0].id,
      })
      .createMany(9)
    const ordersDeliveredJson = ordersDelivered.map((order) => order.serialize())

    const response = await client
      .post(route('/api/orders/all'))
      .json({ status: 'DELIVERED' })
      .loginAs(admin)

    response.assertAgainstApiSpec()
    assert.equal(response.body().length, ordersDeliveredJson.length)
  })

  test('store an order', async ({ client, route }) => {
    const product = await ProductFactory.with('variants', 1, (variant) => variant.apply('stock10'))
      .with('customizations', 1)
      .create()
    const productJson = product.serialize()
    const newOrder = await OrderFactory.merge({
      customizationId: productJson.customizations[0].id,
      variantId: productJson.variants[0].id,
      quantity: 1,
    }).makeStubbed()
    const newOrderJson = newOrder.serialize()

    const response = await client.post(route('/api/orders')).json({ ...newOrderJson })

    response.assertAgainstApiSpec()
    response.assertBodyContains({ imageSize: newOrderJson.imageSize })
    response.assertBodyContains({ quantity: newOrderJson.quantity })
    response.assertBodyContains({ status: newOrderJson.status })
    response.assertBodyContains({ customizationId: newOrderJson.customizationId })
    response.assertBodyContains({ variantId: newOrderJson.variantId })
  })

  test('returns error if not enough stock', async ({ client, route }) => {
    const product = await ProductFactory.with('variants', 1, (variant) => variant.apply('stock10'))
      .with('customizations', 1)
      .create()
    const productJson = product.serialize()
    const payload = [{ variantId: productJson.variants[0].id, quantity: 11 }]

    const response = await client
      .post(route('/api/orders/verify_quantity'))
      .json({ orders: payload })

    response.assertAgainstApiSpec()
    response.assertStatus(400)
    response.assertBodyContains({ message: 'Not enough quantity' })
  })

  test('returns 200 if enough stock', async ({ client, route }) => {
    const product = await ProductFactory.with('variants', 1, (variant) => variant.apply('stock10'))
      .with('customizations', 1)
      .create()
    const productJson = product.serialize()
    const payload = [{ variantId: productJson.variants[0].id, quantity: 1 }]

    const response = await client
      .post(route('/api/orders/verify_quantity'))
      .json({ orders: payload })

    response.assertAgainstApiSpec()
    response.assertStatus(200)
  })
})
