import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import router from './router/index.jsx'
import { RouterProvider } from 'react-router-dom'
import 'normalize.css'
import './index.scss'
import { AuthProvider } from '/src/store/AuthContext'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  // </StrictMode>
)
