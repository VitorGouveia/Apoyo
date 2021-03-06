import express from "express"
import path from "path"
import cors from "cors"

import { createServer } from "http"
import { Server, Socket } from "socket.io"

import "./database"
import { routes } from "./routes"

const app = express()

app.use(express.static(path.join(__dirname, "..", "public")))
app.set("views", path.join(__dirname, "..", "public"))
app.engine("html", require("ejs").renderFile)
app.set("view engine", "html")
app.use(cors())

app.get("/", (request, response) => {
  return response.render("html/client.html")
})
app.get("/admin", (request, response) => {
  return response.render("html/admin.html")
})

const http = createServer(app) // Criando protocolo http
const io = new Server(http) // Criando protocolo websocket

// io.on("connection", (socket: Socket) => {
//   console.log("Se conectou", socket.id)
// })

app.use(express.json())

app.use(routes)

export { http, io }