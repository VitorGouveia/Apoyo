import { Request, Response } from "express"
import { MessagesService } from "../services/MessagesService"

class MessagesController {
  async create(request: Request, response: Response) {
    const messageService = new MessagesService()

    const message = await messageService.create(request.body)
    
    return response.json(message)
  }

  async showByUser(request: Request, response: Response) {
    const { user_id } = request.params

    const messageService = new MessagesService()

    const list = await messageService.listByUser(user_id)

    return response.json(list)
  }
}

export { MessagesController }