import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('./users.controller.js')

router
  .post('/create-employee', [UsersController, 'createUserController'])
  .use(middleware.auth({ guards: ['api'] }))
router.post('/login', [UsersController, 'loginController'])
router.post('/create-company', [UsersController, 'createCompanyController'])
router.post('/logout', [UsersController, 'logoutController'])
router
  .post('/checklogin', [UsersController, 'checklogin'])
  .use(middleware.auth({ guards: ['api'] }))
router
  .get('/employees_list', [UsersController, 'employeeList'])
  .use(middleware.auth({ guards: ['api'] }))
