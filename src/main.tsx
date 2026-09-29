import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { MediaProvider } from './context/MediaContext.tsx';
import { SiteContentProvider } from './context/SiteContentContext.tsx';
import { AdminAuthProvider } from './context/AdminAuthContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <AdminAuthProvider>
    <SiteContentProvider>
      <MediaProvider>
        <App />
      </MediaProvider>
    </SiteContentProvider>
  </AdminAuthProvider>
);
