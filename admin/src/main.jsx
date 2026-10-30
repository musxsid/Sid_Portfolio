
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import keycloak from './keycloak'

const root = createRoot(document.getElementById('root'));

keycloak.init({ onLoad: 'login-required', checkLoginIframe: false })
  .then((authenticated) => {
    if (!authenticated) {
      window.location.reload();
    } else {
      root.render(<App />);
    }
  })
  .catch((err) => {
    console.error("Failed to initialize Keycloak", err);
    root.render(
      <div className="flex h-screen w-full items-center justify-center bg-background text-destructive p-4">
        Failed to initialize authentication. Please make sure Keycloak is running.
      </div>
    );
  });
