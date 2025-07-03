import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router"
import '@fontsource/inter';
import PlaceholderPage from "./pages/PlaceholderPage";
import './index.sass'
import { CssVarsProvider } from '@mui/joy/styles/CssVarsProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <CssVarsProvider defaultMode="system">
        <BrowserRouter>
            <Routes>
                <Route path={"*"} element={<PlaceholderPage />} />
            </Routes>
        </BrowserRouter>
      </CssVarsProvider>
  </StrictMode>,
)