import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './theme/variables.css';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { AuthProvider } from './contexts/AuthContext';

defineCustomElements(window);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)