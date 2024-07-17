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
    const ordersDone = await OrderFactory.apply('done')
      .merge({
        customizationId: productJson.customizations[0].id,
        variantId: productJson.variants[0].id,
      })
      .createMany(3)

    await OrderFactory.apply('active')
      .merge({
        customizationId: productJson.customizations[0].id,
        variantId: productJson.variants[0].id,
      })
      .createMany(9)
    const ordersDoneJson = ordersDone.map((order) => order.serialize())

    const response = await client
      .post(route('/api/orders/all'))
      .json({ status: 'DONE' })
      .loginAs(admin)

    response.assertAgainstApiSpec()
    assert.equal(response.body().length, ordersDoneJson.length)
  })

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
      .post(route('/api/orders'))
      .json({ ...newOrderJson, images: [] })
      .loginAs(admin)

    response.assertAgainstApiSpec()
    response.assertBodyContains({ imageSize: newOrderJson.imageSize })
    response.assertBodyContains({ quantity: newOrderJson.quantity })
    response.assertBodyContains({ status: newOrderJson.status })
    response.assertBodyContains({ customizationId: newOrderJson.customizationId })
    response.assertBodyContains({ variantId: newOrderJson.variantId })
  })

  test('bulk store orders', async ({ client, route, assert }) => {
    const admin = await createAdminUser()
    const product = await ProductFactory.with('variants', 1).with('customizations', 1).create()
    const productJson = product.serialize()
    const newOrders = await OrderFactory.merge({
      customizationId: productJson.customizations[0].id,
      variantId: productJson.variants[0].id,
    }).makeStubbedMany(3)
    const newOrdersJson = newOrders.map((order) => ({ ...order.serialize(), images: [] }))

    const response = await client
      .post(route('/api/orders/bulk'))
      .json({ orders: newOrdersJson })
      .loginAs(admin)
    const responseAllOrders = await client.post(route('/api/orders/all')).loginAs(admin)

    response.assertAgainstApiSpec()
    assert.equal(responseAllOrders.body().length, newOrdersJson.length)
  })
})
