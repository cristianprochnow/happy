import { Request, Response, Express } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'
import Orphanage from '../models/Orphanage'
import orphanagesView from '../views/orphanages_view'

export default {
  async index (request: Request, response: Response): Promise<Response<Orphanage[]>> {
    const orphanagesRepository = getRepository(Orphanage)

    try {
      const orphanages = await orphanagesRepository.find({ relations: ['images'] })

      return response.status(200).json(orphanagesView.renderMany(orphanages))
    } catch (error) {
      return response.status(500).send(error)
    }
  },

  async create (request: Request, response: Response): Promise<Response<Orphanage>> {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = request.body

    const requestImages = request.files as Express.Multer.File[]

    const images = requestImages.map(image => {
      return { path: image.filename }
    })

    const orphanagesRepository = getRepository(Orphanage)

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    }

    const validationSchema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    })

    try {
      await validationSchema.validate(data, { abortEarly: false })

      const orphanage = orphanagesRepository.create(data)
      await orphanagesRepository.save(orphanage)

      return response.status(201).json(orphanage)
    } catch (error) {
      return response.status(500).send(error)
    }
  },

  async show (request: Request, response: Response): Promise<Response<Orphanage>> {
    const { id } = request.params

    const orphanagesRepository = getRepository(Orphanage)

    try {
      const orphanage = await orphanagesRepository.findOneOrFail(id, {
        relations: ['images']
      })

      return response.status(200).json(orphanagesView.render(orphanage))
    } catch (error) {
      return response.status(500).send(error)
    }
  }
}
