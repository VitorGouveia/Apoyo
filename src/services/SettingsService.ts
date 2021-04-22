import { getCustomRepository } from "typeorm"
import { SettingsRepository } from "../repositories/SettingsRepository"

interface ISerttingsCreate {
  chat: boolean
  username: string
}

class SettingsService {
  async create({ chat, username }: ISerttingsCreate) {
    const settingsRepository = getCustomRepository(SettingsRepository)
  
    const settings = settingsRepository.create({
      chat,
      username
    })
  
    await settingsRepository.save(settings)

    return settings
  }
}

export { SettingsService }