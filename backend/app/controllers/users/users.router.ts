import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('./users.controller.js')

router.post('/login', [UsersController, 'loginController'])
router.post('/plan-create', [UsersController, 'planCreateController'])

router
  .group(() => {
    router.post('/create-employee', [UsersController, 'createUserController'])
    router.post('/logout', [UsersController, 'logoutController'])
    router.post('/checklogin', [UsersController, 'checklogin'])
    router.get('/employees_list', [UsersController, 'employeeList'])
  })
  .use(middleware.auth())
// router.post('/refresh-token', [UsersController, 'refreshToken'])
