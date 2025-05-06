import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "react-datepicker/dist/react-datepicker.css";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/auth.jsx'
import { DashBoardContextProvider } from './context/IsDashoard.jsx'
import { BulkImportProvider } from './context/bulkImportContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
 <BulkImportProvider>
 <BrowserRouter>
  <StrictMode>
    <App />
  </StrictMode>
  </BrowserRouter>,
  </BulkImportProvider>
  </AuthContextProvider>
)
