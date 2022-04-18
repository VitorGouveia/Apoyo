import { HashRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/home"

export const Router: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </HashRouter>
  )
}
