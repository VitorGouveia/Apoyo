import "dotenv-safe/config"

import express from "express"
import cors from "cors"

import { router } from "./routes"

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
)

app.use(router)

const port = process.env.PORT || 3333

app.listen(port, () => console.log(`[app]: listening on localhost:${port}`))

console.log("bruh")
