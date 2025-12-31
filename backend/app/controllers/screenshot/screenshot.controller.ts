import { HttpContext } from '@adonisjs/core/http'
import ScreenshotService from './screenshot.service.js'
import cloudinary from '#config/cloudinary'
import { inject } from '@adonisjs/core'
import { groupScreenshots } from '../../utils/group_screenshots.js'
import { adminQueryValidator, employeeQueryValidator } from './screenshot.validator.js'
@inject()
export default class ScreenshotController {
  constructor(private screenshotService: ScreenshotService) {}
  public async uploadScreenshotController({ request, response, auth }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    // ✅ Proper file handling (DO NOT use request.all())
    const file = request.file('file', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png'],
    })

    if (!file) {
      return response.badRequest({ error: 'Screenshot file is required' })
    }

    if (!file.tmpPath) {
      return response.badRequest({ error: 'Invalid file upload' })
    }

    try {
      // ✅ Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(file.tmpPath, {
        folder: 'image_of_screenshots',
      })

      const screenshot = await this.screenshotService.storeScreenshotService({
        path: uploadResult.secure_url,
        userId: user.id,
        companyId: user.companyId,
        name: file.clientName,
        type: file.extname ?? 'unknown',
      })

      return response.created(screenshot)
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        error: 'Failed to upload screenshot',
      })
    }
  }

  public async ownerQueryController({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (user!.role !== 'owner') {
      return response.forbidden({ error: 'Forbidden' })
    }

    const { userId, date, groupBy } = await request.validateUsing(adminQueryValidator)

    // Validate date

    try {
      const screenshots = await this.screenshotService.ownerQueryService({
        companyId: user!.companyId,
        userId,
        date: date ?? new Date().toISOString().split('T')[0],
      })

      // Map createdAt and updatedAt to ISO strings
      const formattedScreenshots = screenshots.map((s) => {
        return {
          ...s.serialize(), // converts model to plain object
          created_at: s.createdAt.toISO(), // Luxon DateTime to ISO string
          updated_at: s.updatedAt.toISO(),
        }
      })

      const grouped = groupScreenshots(formattedScreenshots, groupBy ?? '10min')
      console.log(grouped)
      return grouped
    } catch (error) {
      console.log('Error in ownerQueryController:', error)
      return response.badRequest({ error: error.message })
    }
  }

  public async employeeQueryController({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (user!.role !== 'employee') {
      return response.forbidden({ error: 'Forbidden' })
    }
    const { date, groupBy } = await request.validateUsing(employeeQueryValidator)
    try {
      const screenshot = await this.screenshotService.employeeQueryService({
        companyId: user!.companyId,
        userId: user!.id,
        date: date ?? new Date().toISOString().split('T')[0],
      })
      // console.log(screenshot)
      // console.log('okkk')
      const grouped = groupScreenshots(screenshot, groupBy ?? '10min')
      // console.log(groupBy)
      return grouped
    } catch (error) {
      console.log(error)
      return response.badRequest({ error: error.message })
    }
  }
}
