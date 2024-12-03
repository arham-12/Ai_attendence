import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/auth.jsx'
import { DashBoardContextProvider } from './context/IsDashoard.jsx'

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
  <DashBoardContextProvider>
 <BrowserRouter>
  <StrictMode>
    <App />
  </StrictMode>
  </BrowserRouter>,
  </DashBoardContextProvider>
  </AuthContextProvider>
)
