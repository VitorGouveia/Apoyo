import { lazy, Suspense } from "react"
import { HashRouter, Routes, Route } from "react-router-dom"

// import { SkeletonHome } from "./pages/home"

const Home = lazy(() => import("./pages/home"))

export const Router: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route
          index
          element={
            <Suspense fallback={"cu"}>
              <Home />
            </Suspense>
          }
        />
      </Routes>
    </HashRouter>
  )
}
