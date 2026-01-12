import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { faker } from '@faker-js/faker'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const users: Partial<User>[] = [] // tell TS these are User objects

    for (let i = 0; i < 9000; i++) {
      const cmpid = Math.floor(Math.random() * 1020) + 1
      if ((cmpid > 4 && cmpid < 40) || cmpid === 2) continue
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase() + '_' + i,
        password: 'password123',
        companyId: cmpid,
        role: Math.random() < 0.1 ? 'owner' : 'employee', // <-- TS knows this is allowed
      })
      console.log(i)
    }

    await User.createMany(users)
  }
}
