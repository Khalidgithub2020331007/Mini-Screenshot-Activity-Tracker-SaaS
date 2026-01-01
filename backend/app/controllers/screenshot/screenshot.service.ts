import Screenshot from '../../models/screenshot.js'
import db from '@adonisjs/lucid/services/db'
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

    const query = await Screenshot.query()
      .where('company_id', companyId)
      .where('user_id', userId)
      .whereRaw('DATE(created_at) = ?', [date])

    return query
  }
  public async employeeQueryService(payload: EmployeeQueryPayload) {
    const { companyId, userId, date } = payload

    return await Screenshot.query()
      .where('company_id', companyId)
      .where('user_id', userId)
      .whereRaw('DATE(created_at) = ?', [date])
      .orderBy('created_at', 'asc')
  }
}
