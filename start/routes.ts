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
const SessionController = () => import('#controllers/session_controller')

router
  .group(() => {
    router.resource('products', ProductsController).only(['index', 'show'])
    router.resource('products.variants', VariantsController).only(['index', 'show'])

    router
      .group(() => {
        router.resource('products', ProductsController).only(['store', 'update', 'destroy'])

        router
          .resource('products.variants', VariantsController)
          .only(['store', 'update', 'destroy'])

        router.resource('variants.images', ImagesController).only(['store', 'update', 'destroy'])

        router.resource('users', UsersController).only(['update', 'destroy'])
      })
      .use(middleware.admin())
  })
  .prefix('/api')
  .use(middleware.auth())

router
  .group(() => {
    router.resource('/users', UsersController).only(['store'])
    router.post('/login', [SessionController, 'store'])
    router.post('/logout', [SessionController, 'logout'])
  })
  .prefix('/api')
