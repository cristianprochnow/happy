import { Router } from 'express'
import multer from 'multer'
import uploadConfig from './config/upload'
import OrphanagesController from './controllers/OrphanagesController'

const routes = Router()
const fileUpload = multer(uploadConfig)

routes.get('/orphanages', OrphanagesController.index)
routes.post(
  '/orphanages',
  fileUpload.array('images'),
  OrphanagesController.create
)
routes.get('/orphanages/:id', OrphanagesController.show)

export { routes }
