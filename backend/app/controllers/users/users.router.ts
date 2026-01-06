// users.router.ts

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('./users.contorller.js')

router.post('/login', [UsersController, 'loginController'])
router.post('/plan-create', [UsersController, 'planCreateController'])
router.get('/plans_list', [UsersController, 'planListController'])
router.post('/create-company', [UsersController, 'createCompanyController'])
router
  .group(() => {
    router.post('/create-employee', [UsersController, 'createUserController'])

    router.post('/logout', [UsersController, 'logoutController'])
    router.post('/checklogin', [UsersController, 'checklogin'])
    router.get('/employees_list', [UsersController, 'employeeList'])
    router.delete('/delete-employee', [UsersController, 'deleteEmployeeController'])
  })
  .use(middleware.auth())
