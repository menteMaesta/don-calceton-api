import { test } from '@japa/runner'

test.group('Products list', () => {
  test('get a list of products', async ({ client, assert }) => {
    const response = await client.get('/products')

    response.assertAgainstApiSpec()
  })
})
