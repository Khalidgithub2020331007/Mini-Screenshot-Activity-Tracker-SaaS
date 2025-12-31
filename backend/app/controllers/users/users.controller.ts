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
    console.log('create company')
    const data = await request.validateUsing(companyCreateValidator)
    console.log(data)

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
    console.log(user)
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
    try {
      const { email, password } = await request.only(['email', 'password'])
      const user = await User.verifyCredentials(email, password)
      if (!user) {
        return response.unauthorized({ error: 'Unauthorized' })
      }

      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: '1d',
      })
      const redirectUrl = user.role === 'owner' ? '/owner/dashboard' : '/member/dashboard'
      return response.ok({
        message: 'Login successful',
        user: user,
        token: token,
        redirectUrl,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
  public async logoutController({ response, auth }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.ok({
      message: 'Logout successful',
    })
  }
  public async checklogin({ response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ error: 'Unauthorized' })
    }
    return response.ok({ message: 'already login' })
  }
  public async employeeList({ request, response, auth }: HttpContext) {
    const user = auth.user

    if (user!.role !== 'owner') {
      return response.forbidden({ error: 'Forbidden' })
    }
    // console.log(user)
    const { page, limit, name } = await request.validateUsing(employeeListValidator)
    // console.log(page, limit, name)
    try {
      const employeeList = await this.userService.userListService(user!, page, limit, name)
      // console.log('okk')
      return response.ok(employeeList)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
