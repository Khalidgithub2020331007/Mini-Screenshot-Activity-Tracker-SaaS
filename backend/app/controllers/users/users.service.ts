import User from '../../models/user.js'
import Company from '../../models/company.js'
import db from '@adonisjs/lucid/services/db'
import Plan from '../../models/plan.js'

type UserPayload = {
  name: string
  email: string
  password: string
}
type CompanyPayload = {
  ownerName: string
  ownerEmail: string
  ownerPassword: string
  companyName: string
  planId: number
}

export default class UserService {
  async createUserService(payload: UserPayload, companyId: number) {
    const { name, email, password } = payload
    const company = await Company.find(companyId)

    if (!company) {
      throw new Error('Company not found')
    }
    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    const user = await User.create({
      name: name,
      email: email,
      password: password,
      role: 'employee',
      companyId: companyId,
    })

    return user
  }

  async createCompanyService(payload: CompanyPayload) {
    console.log(payload)
    const { ownerName, ownerEmail, ownerPassword, companyName, planId } = payload

    const trx = await db.transaction()

    try {
      const existingCompany = await Company.findBy('name', companyName)

      if (existingCompany) {
        throw new Error('Company already exists')
      }

      const company = await Company.create({ name: companyName, plan_id: planId }, { client: trx })

      const user = await User.create(
        {
          name: ownerName,
          email: ownerEmail,
          password: ownerPassword,
          role: 'owner',
          companyId: company.id,
        },
        { client: trx }
      )
      await trx.commit()

      return { company, user }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
  public async userListService(user: User, page?: number, limit?: number, name?: string) {
    try {
      const query = User.query()
        .select('id', 'name')
        .where('companyId', user.companyId)
        .where('name', 'like', `%${name}%`)

      const employees = await query.paginate(page || 1, limit || 10)

      return {
        messages: 'Employee list fetched successfully',
        data: employees,
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  public async createPlanService(name: string, price: number, number_of_person: number) {
    const plan = await Plan.create({ name, price, number_of_person })
    return plan
  }
  public async getPlanService() {
    const plans = await Plan.query().select('id', 'name', 'price', 'number_of_person')
    return plans
  }
}
