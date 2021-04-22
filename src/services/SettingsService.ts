import { getCustomRepository } from "typeorm"
import { SettingsRepository } from "../repositories/SettingsRepository"

interface ISerttingsCreate {
  chat: boolean
  username: string
}

class SettingsService {
  async create({ chat, username }: ISerttingsCreate) {
    const settingsRepository = getCustomRepository(SettingsRepository)

    //SELECT * FROM settings WHERE username = "username" limit 1;
    const userAlreadyExists = await settingsRepository.findOne({ username })

    if(userAlreadyExists) {
      throw new Error("User already exists!")
    }
  
    const settings = settingsRepository.create({
      chat,
      username
    })
  
    await settingsRepository.save(settings)

    return settings
  }
}

export { SettingsService }