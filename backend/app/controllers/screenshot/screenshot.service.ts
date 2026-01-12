import Screenshot from '../../models/screenshot.js'
import { RawQuery } from '@adonisjs/lucid/types/querybuilder'
type ScreenshotPayload = {
  name: string
  path: string
  type: string
  companyId: number
  userId: number
}
type OwnerQueryPayload = {
  companyId: number
  userId: number
  date: string
}
type EmployeeQueryPayload = {
  companyId: number
  userId: number
  date: string
}

export default class ScreenshotService {
  public async storeScreenshotService(payload: ScreenshotPayload) {
    const { name, path, type, companyId, userId } = payload
    const screenshot = await Screenshot.create({
      name: name,
      path: path,
      type: type,
      companyId: companyId,
      userId: userId,
    })
    return screenshot
  }

  public async ownerQueryService(payload: OwnerQueryPayload) {
    const { companyId, userId, date } = payload

    const start = new Date(date + 'T00:00:00') // start of today
    const end = new Date(start)
    end.setDate(start.getDate() + 1)
    console.log('service') // start of next day

    const query = Screenshot.query()
      .select('id', 'name', 'path', 'type', 'createdAt', 'updatedAt')
      .where('user_id', userId)
      .where('company_id', companyId)
      .where('created_at', '>=', start)
      .where('created_at', '<', end) // strictly less than next day

    console.log(query.toQuery())
    return await query
  }

  public async employeeQueryService(payload: EmployeeQueryPayload) {
    const { companyId, userId, date } = payload

    return await Screenshot.query()
      .where('company_id', companyId)
      .where('user_id', userId)
      .whereRaw('DATE(created_at) = ?', [date])
  }
}
