import type { HttpContext } from '@adonisjs/core/http'
import UserService from './users.service.js'
import {
  companyCreateValidator,
  createUserValidator,
  employeeListValidator,
  planCreateValidator,
} from './users.validator.js'
import User from '../../models/user.js'
import { deleteEmployeeValidator } from '#controllers/screenshot/screenshot.validator'

export default class UsersController {
  private userService = new UserService()

  constructor() {
    this.userService = new UserService()
  }
  public async createCompanyController({ request, response }: HttpContext) {
    const data = await request.validateUsing(companyCreateValidator)

    try {
      const { company, user } = await this.userService.createCompanyService(data)
      return response.created({
        message: 'Company created successfully',
        data: {
          id: company.id,
          name: company.name,
          planId: company.plan_id,
          created_at: company.createdAt,
          owner: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            company_id: user.companyId,
            created_at: user.createdAt,
          },
        },
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
  public async createUserController({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not found' })
    }
    if (user.role !== 'owner') {
      return response.unauthorized({ message: 'You are not authorized to perform this action' })
    }
    const data = await request.validateUsing(createUserValidator)

    const companyId = user.companyId

    try {
      const newUser = await this.userService.createUserService(data, companyId)

      return response.created({
        message: 'User created successfully',
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          company_id: newUser.companyId,
          created_at: newUser.createdAt,
        },
      })
    } catch (error: any) {
      return response.badRequest({ 'fail to create user': error.message })
    }
  }
  public async loginController({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const user = await User.verifyCredentials(email, password)

      const token = await auth.use('jwt').generate(user)
      response.cookie('token', token.token, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      })
      return response.ok({
        message: 'User logged in successfully',
        user: user,
      })
    } catch (error) {
      return response.badRequest({
        message: 'User login failed',
      })
    }
  }
  public async logoutController({ response }: HttpContext) {
    try {
      response.clearCookie('token')
      return response.ok({
        message: 'User logged out successfully',
      })
    } catch (error) {
      return response.badRequest({
        message: 'User logout failed',
      })
    }
  }
  public async checklogin({ response, auth }: HttpContext) {
    const user = auth.user
    console.log(user)
    if (!user) {
      return response.unauthorized({ error: 'Unauthorized2' })
    }
    return response.ok({
      message: 'already login',
      role: user.role,
    })
  }
  public async employeeList({ request, response, auth }: HttpContext) {
    const user = auth.user

    if (user!.role !== 'owner') {
      return response.forbidden({ error: 'Forbidden' })
    }

    const { page, limit, name } = await request.validateUsing(employeeListValidator)
    try {
      const employeeList = await this.userService.userListService(user!, page, limit, name)
      return response.ok(employeeList)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
  public async planCreateController({ request, response, auth }: HttpContext) {
    const { name, price, number_of_person } = await request.validateUsing(planCreateValidator)
    try {
      const plancreate = await this.userService.createPlanService(name, price, number_of_person)
      return response.ok(plancreate)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
  public async planListController({ response }: HttpContext) {
    try {
      const plans = await this.userService.getPlanService()
      return response.ok(plans)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
  public async deleteEmployeeController({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ error: 'Unauthorized' })
    }
    if (user.role !== 'owner') {
      return response.forbidden({ error: 'Forbidden' })
    }

    const { employeeId } = await request.validateUsing(deleteEmployeeValidator)

    try {
      await this.userService.deleteEmployeeService(user, employeeId)
      return response.ok({ message: 'Employee deleted successfully' })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
