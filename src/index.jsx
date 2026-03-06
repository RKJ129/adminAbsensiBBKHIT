// third party
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from './contexts/ConfigContext';

// project imports
import App from './App';
import reportWebVitals from './reportWebVitals';

// style + assets
import './index.scss';
import './views/rekap/rekap.css';
import { AuthProvider } from './contexts/AuthContext';

// -----------------------|| REACT DOM RENDER  ||-----------------------//

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ConfigProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ConfigProvider>
);

reportWebVitals();
