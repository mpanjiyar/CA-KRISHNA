import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { MediaProvider } from './context/MediaContext.tsx';
import { AdminAuthProvider } from './context/AdminAuthContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <AdminAuthProvider>
    <MediaProvider>
      <App />
    </MediaProvider>
  </AdminAuthProvider>
);
