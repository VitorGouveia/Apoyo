import React from "react"
import ReactDOM from "react-dom/client"

import "./styles/global.scss"

import { App } from "./App"

ReactDOM.createRoot(document.getElementById("apoyo")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
