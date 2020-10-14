import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import Orphanage from '../models/Orphanage'

export default {
  async index (request: Request, response: Response): Promise<Response<Orphanage[]>> {
    const orphanagesRepository = getRepository(Orphanage)

    try {
      const orphanages = await orphanagesRepository.find()

      return response.status(200).json(orphanages)
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

    const orphanagesRepository = getRepository(Orphanage)

    const orphanage = orphanagesRepository.create({
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    })

    try {
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
      const orphanage = await orphanagesRepository.findOneOrFail(id)

      return response.status(200).json(orphanage)
    } catch (error) {
      return response.status(500).send(error)
    }
  }
}
