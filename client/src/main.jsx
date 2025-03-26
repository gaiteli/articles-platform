import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import router from './router/index.jsx'
import { RouterProvider } from 'react-router-dom'
import 'normalize.css'
import './index.scss'
import { AuthProvider } from '/src/store/AuthContext';
import { ThemeProvider } from '/src/store/ThemeContext';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
  // </StrictMode>
)
