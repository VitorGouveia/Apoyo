import { Request, Response } from "express"
import { SettingsService } from "../services/SettingsService"
class SettingsController {
  async create(request: Request, response: Response) {
    const settingsService = new SettingsService()

    const settings = await settingsService.create(request.body)
  
    return response.json(settings)
  }
}

export { SettingsController }