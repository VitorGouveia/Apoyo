import express from "express"

import "./database"

const app = express()

/** Métodos HTTP
 * GET = Buscas
 * POST = Criação
 * PUT = Alteração
 * DELETE = Deltar
 * PATCH = Alterar uma informação específica
*/

app.get("/", (request, response) => {
  return response.json({
    message: "Olá NLW 05"
  })
})

app.post("/users", (request, response) => {
  return response.json({
    message: "Usuário salvo com sucesso!"
  })
})

app.listen(3333, () => console.log("[server] running on http://localhost:3333"))