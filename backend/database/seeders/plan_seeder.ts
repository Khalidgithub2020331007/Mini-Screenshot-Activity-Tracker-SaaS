import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Plan from '#models/plan'

export default class PlanSeeder extends BaseSeeder {
  async run() {
    await Plan.createMany([
      { name: 'Starter', price: 800, number_of_person: 2 },
      { name: 'Small Team', price: 1200, number_of_person: 5 },
      { name: 'Team', price: 2000, number_of_person: 10 },
      { name: 'Business', price: 3500, number_of_person: 20 },
      { name: 'Company', price: 5000, number_of_person: 30 },
      { name: 'Enterprise Plus', price: 12000, number_of_person: 80 },
      { name: 'Corporate', price: 15000, number_of_person: 100 },
      { name: 'Unlimited', price: 20000, number_of_person: 200 },
    ])
  }
}
