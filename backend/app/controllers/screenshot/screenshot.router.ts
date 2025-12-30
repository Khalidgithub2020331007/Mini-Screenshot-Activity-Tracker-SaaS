import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ScreenshotController = () => import('./screenshot.controller.js')
router
  .post('/upload-screenshot', [ScreenshotController, 'uploadScreenshotController'])
  .use(middleware.auth({ guards: ['api'] }))
router
  .post('/owner-query', [ScreenshotController, 'ownerQueryController'])
  .use(middleware.auth({ guards: ['api'] }))
router
  .post('/employee-query', [ScreenshotController, 'employeeQueryController'])
  .use(middleware.auth({ guards: ['api'] }))
