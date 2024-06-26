/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const ProductsController = () => import('#controllers/products_controller')
const VariantsController = () => import('#controllers/variants_controller')
const ImagesController = () => import('#controllers/images_controller')
const UsersController = () => import('#controllers/users_controller')
const TokenController = () => import('#controllers/token_controller')
const CustomizationsController = () => import('#controllers/customizations_controller')
const OrdersController = () => import('#controllers/orders_controller')

router
  .group(() => {
    router.delete('/logout', [TokenController, 'logout'])

    router
      .group(() => {
        router.resource('products', ProductsController).only(['store', 'update', 'destroy'])

        router
          .resource('products.variants', VariantsController)
          .only(['store', 'update', 'destroy'])
        router
          .resource('products.customizations', CustomizationsController)
          .only(['index', 'store', 'update', 'destroy'])

        router.resource('variants.images', ImagesController).only(['store', 'update', 'destroy'])
        router.post('variants/:variant_id/bulk/images', [ImagesController, 'bulkStore'])

        router.resource('users', UsersController).only(['update', 'destroy'])
        router.get('/validate_credentials', [UsersController, 'validate'])
        router.resource('/orders', OrdersController).only(['store'])
      })
      .use(middleware.admin())
  })
  .prefix('/api')
  .use(middleware.auth({ guards: ['api'] }))

router
  .group(() => {
    // router.resource('/users', UsersController).only(['store'])
    router.post('/login', [TokenController, 'login'])
    router.post('/forgot_password', [TokenController, 'generateForgotPasswordLink'])
    router.post('/update_password', [TokenController, 'updatePassword'])
    router.resource('products', ProductsController).only(['index', 'show'])
    router.resource('products.variants', VariantsController).only(['index', 'show'])
    router.get('/all_variants', [VariantsController, 'showAll'])
    router.post('/cart_items', [VariantsController, 'getCartItems'])
    router.post('/orders/all', [OrdersController, 'index'])
  })
  .prefix('/api')
