import express from "express"
import crypto from "crypto"

import { client } from "./client"

export const router = express.Router()

router.get("/", (_, response) => {
  return response.json({
    alive: true,
  })
})

router.get("/clients/:id", async (request, response) => {
  const user = await client.user.findFirst({
    where: {
      id: request.params.id,
      AND: {
        role: "client",
      },
    },
  })

  if (!user) {
    return response.status(400).json("could not find user.")
  }

  return response.status(200).json(user)
})
router.post("/clients", async (request, response) => {
  const user = await client.user.create({
    data: {
      id: crypto.randomUUID(),
      email: request.body.email,
      role: "client",
    },
  })

  return response.status(201).json(user)
})

router.get("/support/:id", async (request, response) => {
  const user = await client.user.findFirst({
    where: {
      id: request.params.id,
      AND: {
        role: "support",
      },
    },
  })

  if (!user) {
    return response.status(400).json("could not find user.")
  }

  return response.status(200).json(user)
})
router.post("/support", async (request, response) => {
  const user = await client.user.create({
    data: {
      id: crypto.randomUUID(),
      email: request.body.email,
      role: "support",
    },
  })

  return response.status(201).json(user)
})

router.get("/messages/:connectionId", async (request, response) => {
  const messages = await client.message.findMany({
    where: {
      connectionId: Number(request.params.connectionId),
    },
    include: {
      user: {
        select: { role: true },
      },
    },
  })

  if (!messages) {
    return response.status(404).json("could not find messages")
  }

  return response.status(200).json(messages)
})
router.post("/messages", async (request, response) => {
  const connection = await client.connection.findUnique({
    where: {
      id: request.body.connectionId,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  })

  const userExistsInConnection = connection?.users.find(
    (user) => user.id === request.body.userId
  )

  if (!userExistsInConnection) {
    return response.status(401).send()
  }

  const message = await client.message.create({
    data: {
      connectionId: request.body.connectionId,
      text: `${request.body.text} -> ${new Date().toLocaleString()}`,
      userId: userExistsInConnection.id,
    },
  })

  return response.status(201).json(message)
})
router.post("/messages/reply", async (request, response) => {
  const connection = await client.connection.findUnique({
    where: {
      id: request.body.connectionId,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  })

  const userExistsInConnection = connection?.users.find(
    (user) => user.id === request.body.userId
  )

  if (!userExistsInConnection) {
    return response.status(401).send()
  }

  const message = await client.message.create({
    data: {
      connectionId: request.body.connectionId,
      text: `[reply to ${request.body.messageReplyId}]: ${
        request.body.text
      } -> ${new Date().toLocaleString()}`,
      userId: userExistsInConnection.id,
    },
  })

  return response.status(201).json(message)
})

router.get("/connections/:userId", async (request, response) => {
  const connections = await client.connection.findMany({
    where: {
      users: {
        some: {
          id: request.params.userId,
        },
      },
    },
  })

  if (!connections) {
    return response.status(404).json("could not find connections")
  }

  return response.status(200).json(connections)
})
router.post("/connections", async (request, response) => {
  // find a supportId
  const support = await client.user.findFirst({
    select: {
      id: true,
    },
  })

  const connection = await client.connection.create({
    data: {
      users: {
        connect: [{ id: request.body.clientId }, { id: support?.id }],
      },
    },
  })

  return response.json(connection)
})
