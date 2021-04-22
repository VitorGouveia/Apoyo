import { Request, Response } from "express"
import { MessagesService } from "../services/MessagesService"

class MessagesController {
  async create(request: Request, response: Response) {
    const messageService = new MessagesService()

    const message = await messageService.create(request.body)
    
    return response.json(message)
  }
}

export { MessagesController }