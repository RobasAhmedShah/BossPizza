import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import LoadingScreen from './components/ui/LoadingScreen.tsx'
import './index.css'

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Render the loading screen first
root.render(<LoadingScreen />);

// After a delay, render the actual app
setTimeout(() => {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}, 3000);
