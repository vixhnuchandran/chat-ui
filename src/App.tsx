import "./App.css"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"

import Access from "./pages/Access"
import Home from "./pages/Home"
import Documents from "./pages/Documents"
import NotFound from "./pages/NotFound"

function App() {
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Access />} />
        <Route path="/home" element={<Home />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  )

  return (
    <ThemeProvider
      defaultTheme={prefersDarkMode ? "dark" : "light"}
      storageKey="vite-ui-theme"
    >
      <RouterProvider router={router} />

      <Toaster />
    </ThemeProvider>
  )
}

export default App
