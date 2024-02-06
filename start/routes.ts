/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const ProductsController = () => import('#controllers/products_controller')
const VariantsController = () => import('#controllers/variants_controller')
const ImagesController = () => import('#controllers/images_controller')
const UsersController = () => import('#controllers/users_controller')

router
  .resource('products', ProductsController)
  .only(['index', 'store', 'show', 'update', 'destroy'])

router
  .resource('products.variants', VariantsController)
  .only(['index', 'store', 'show', 'update', 'destroy'])

router.resource('variants.images', ImagesController).only(['store', 'update', 'destroy'])

router.resource('users', UsersController).only(['store', 'update', 'destroy'])
