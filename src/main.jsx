import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import router from './router/index.jsx'
import { RouterProvider } from 'react-router-dom'
import 'normalize.css'
import './index.scss'
import { GlobalsProvider } from '/src/store/globalContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalsProvider>
      <RouterProvider router={router} />
    </GlobalsProvider>
  </StrictMode>
)
