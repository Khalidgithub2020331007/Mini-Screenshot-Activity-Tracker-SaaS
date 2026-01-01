import type { HttpContext } from '@adonisjs/core/http'
import UserService from './users.service.js'
import { createUserValidator, companyCreateValidator } from './users.validator.js'
import User from '../../models/user.js'
import { employeeListValidator } from './users.validator.js'

export default class UsersController {
  private userService = new UserService()

  constructor() {
    this.userService = new UserService()
  }

  /**
   * Create company
   */
  public async createCompanyController({ request, response }: HttpContext) {
    // console.log('create company')
    const data = await request.validateUsing(companyCreateValidator)
    // console.log(data)

    try {
      const { company, user } = await this.userService.createCompanyService(data)
      return response.created({
        message: 'Company created successfully',
        data: {
          id: company.id,
          name: company.name,
          plan: company.plan,
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
  /**
   * Create user
   */ public async createUserController({ request, response, auth }: HttpContext) {
    const user = auth.user
    // console.log(user)
    if (!user) {
      return response.unauthorized({ error: 'Unauthorized' })
    }
    if (user.role !== 'owner') {
      return response.forbidden({ error: 'Forbidden' })
    }
    // 1. Validate request data
    const data = await request.validateUsing(createUserValidator)

    const companyId = user.companyId

    try {
      // 4. Create the new employee user
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
      return response.badRequest({ error: error.message })
    }
  }
  /**
   * login company owner
   */
  public async loginController({ request, response, auth }: HttpContext) {
    // console.log('hit login')
    try {
      const { email, password } = request.only(['email', 'password'])
      const user = await User.verifyCredentials(email, password)
      if (!user) {
        return response.unauthorized({ error: 'Unauthorized' })
      }
      // console.log(user)

      const token = await auth.use('jwt').generate(user)
      console.log('token-------', token.token)
      console.log('---------token')
      // response.cookie('token', token.token, {
      //   httpOnly: true,
      //   sameSite: 'lax',
      //   path: '/',
      //   maxAge: token.maxAge,
      // })
      // console.log('token------', token)
      return response.ok({
        message: 'Login successful',
        user: user,
        token: token,
        redirectUrl: '/owner/dashboard',
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
  public async logoutController({ auth, response }: HttpContext) {
    try {
      // Revoke the token (optional for JWT)

      console.log('logout')

      return response.ok({
        message: 'Logout successful',
      })
    } catch (error) {
      console.error(error)
      return response.badRequest({ message: 'Logout failed' })
    }
  }

  public async checklogin({ response, auth }: HttpContext) {
    const user = auth.user
    // console.log(user)
    if (!user) {
      return response.unauthorized({ error: 'Unauthorized2' })
    }
    return response.ok({ message: 'already login' })
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
}
