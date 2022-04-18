import React from "react"
import { Router } from "./router"

import { UserContextProvider } from "./context/user"

export const App: React.FC = () => {
  return (
    <React.Fragment>
      <UserContextProvider>
        <Router />
      </UserContextProvider>
    </React.Fragment>
  )
}
