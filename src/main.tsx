import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './store/auth.tsx'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'



createRoot(document.getElementById('root')!).render(

  <AuthProvider>
    <StrictMode>
      <App />
      <ToastContainer/>
    </StrictMode>

  </AuthProvider>
)
