import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Company from '#models/company'
import { faker } from '@faker-js/faker'

export default class CompanySeeder extends BaseSeeder {
  public async run() {
    const companies = []

    for (let i = 5; i < 34; i++) {
      companies.push({
        name: faker.company.name() + '_' + i, // ensure unique names
        plan_id: Math.floor(Math.random() * 12) + 1, // random plan_id 1-12
      })
    }

    await Company.createMany(companies)
  }
}
