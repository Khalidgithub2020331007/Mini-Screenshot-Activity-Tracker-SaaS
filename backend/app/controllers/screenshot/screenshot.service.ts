import Screenshot from '../../models/screenshot.js'

type ScreenshotPayload = {
  name: string
  path: string
  type: string
  companyId: number
  userId: number
}
type OwnerQueryPayload = {
  companyId: number
  name: string
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
    const { companyId, name, date } = payload

    const query = Screenshot.query()
      .where('company_id', companyId)
      .whereRaw('DATE(created_at) = ?', [date])
      .preload('user', (q) => {
        q.select('id', 'name')
        if (name) {
          q.whereILike('name', `%${name}%`)
        }
      })
      .orderBy('created_at', 'asc')

    return await query
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
