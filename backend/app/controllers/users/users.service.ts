/*
1.company signup
2.plan selection
3.add/create employee
4. employee login/logout
5.
6.
*/

import User from '../../models/user.js'
import Company from '../../models/company.js'
import db from '@adonisjs/lucid/services/db'

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
  plan: 'basic' | 'pro' | 'enterprise'
}

export default class UserService {
  /**
   * Create user
   */
  async createUserService(payload: UserPayload, companyId: number) {
    const { name, email, password } = payload
    const company = await Company.find(companyId)

    if (!company) {
      throw new Error('Company not found')
    }

    // Create user
    const user = await User.create({
      name: name,
      email: email,
      password: password,
      role: 'employee',
      companyId: companyId,
    })

    return user
  }

  /**
   * Create company
   */
  async createCompanyService(payload: CompanyPayload) {
    const { ownerName, ownerEmail, ownerPassword, companyName, plan } = payload

    const trx = await db.transaction()

    try {
      const existingCompany = await Company.findBy('name', companyName)

      if (existingCompany) {
        throw new Error('Company already exists')
      }

      const company = await Company.create({ name: companyName, plan }, { client: trx })

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
}
