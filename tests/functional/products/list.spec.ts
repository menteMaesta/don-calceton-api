import { test } from '@japa/runner'

test.group('Products list', () => {
  test('get a list of products', async ({ client, route, assert }) => {
    const response = await client.get(route('products.index'))

    response.assertAgainstApiSpec()
  })
})
