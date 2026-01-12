import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Play from "./pages/Play"
import About from "./pages/About"
import Layout from "./components/Layout"
import * as Tooltip from "@radix-ui/react-tooltip"
import NotFound from "./pages/NotFound"

export default function App() {

  return (
    <Tooltip.Provider delayDuration={0}>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="play" element={<Play />} />
                  <Route path="about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Route>
          </Routes>
      </BrowserRouter>
    </Tooltip.Provider>
  )
}