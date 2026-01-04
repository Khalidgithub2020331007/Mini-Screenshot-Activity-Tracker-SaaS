import type { HttpContext } from '@adonisjs/core/http'
import UserService from './users.service.js'
import {
  createUserValidator,
  companyCreateValidator,
  planCreateValidator,
} from './users.validator.js'
import User from '../../models/user.js'
import { employeeListValidator } from './users.validator.js'
import type { JwtGuardUser } from '@maximemrf/adonisjs-jwt/types'
import type { jwtGuard } from '@maximemrf/adonisjs-jwt/jwt_config'

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
    const user = auth.user as User
    // console.log(user)
    if (!user) {
      return response.unauthorized({ error: 'Unauthorized' })
    }
    // console.log(user)
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
  // public async loginController({ request, response, auth }: HttpContext) {
  //   // console.log('hit login')
  //   try {
  //     const { email, password } = request.only(['email', 'password'])
  //     const user = await User.verifyCredentials(email, password)
  //     // console.log(user)
  //     if (!user) {
  //       return response.unauthorized({ error: 'Unauthorized' })
  //     }
  //     // console.log(user)
  //     const jwt = auth.use('jwt') as {
  //       generate(user: User): Promise<{ token: string }>
  //     }

  //     const token = await jwt.generate(user)
  //     // console.log(token)
  //     return response.ok({
  //       message: 'Login successful',
  //       data: {
  //         token: token,
  //         user,
  //       },
  //     })

  //     // return auth.use('jwt').generate(user)
  //   } catch (error) {
  //     return response.badRequest({ error: error.message })
  //   }
  // }

  public async loginController({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const user = await User.verifyCredentials(email, password)
      if (!user) return response.unauthorized({ error: 'Unauthorized' })

      // generate JWT token
      const jwt = auth.use('jwt') as {
        generate(user: User): Promise<{ token: string }>
      }

      const token = await jwt.generate(user)

      // set the token as cookie
      response.cookie('token', token.token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3600 * 1000, // 1 hour in ms
      })

      return response.ok({
        message: 'Login successful',
        data: { user },
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  public async logoutController({ auth, response }: HttpContext) {
    try {
      // Revoke the token (optional for JWT)

      // console.log('logout')

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
    const user = auth.user as User

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
  // public async refreshToken({ request, response, auth }: HttpContext) {
  //   try {
  //     // Authenticate user using refresh token sent from client
  //     const refreshToken = request.input('refreshToken')
  //     if (!refreshToken) {
  //       return response.badRequest({ error: 'Refresh token is required' })
  //     }
  //     const jwtRefresh = auth.use('jwt') as any
  //     const user = await jwtRefresh.authenticateWithRefreshToken(refreshToken)

  //     const jwt = auth.use('jwt') as {
  //       generate(user: User): Promise<{ token: string }>
  //     }

  //     const newToken = await jwt.generate(user)
  //     const newRefreshToken = user.currentToken

  //     return response.ok({
  //       message: 'Token refreshed',
  //       data: { token: newToken, refreshToken: newRefreshToken, user },
  //     })
  //   } catch (err) {
  //     return response.unauthorized({ error: 'Invalid refresh token' })
  //   }
  // }
  public async planCreateController({ request, response, auth }: HttpContext) {
    const { name, price, number_of_person } = await request.validateUsing(planCreateValidator)
    try {
      const plancreate = await this.userService.createPlanService(name, price, number_of_person)
      return response.ok(plancreate)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
