import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ScreenshotController = () => import('./screenshot.controller.js')
router
  .post('/upload-screenshot', [ScreenshotController, 'uploadScreenshotController'])
  .use(middleware.auth())
router.get('/owner-query', [ScreenshotController, 'ownerQueryController']).use(middleware.auth())

router
  .get('/employee-query', [ScreenshotController, 'employeeQueryController'])
  .use(middleware.auth())
