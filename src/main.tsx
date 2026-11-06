import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Global styles first, so each component's CSS module can override them.
import './styles/tokens.css';
import './styles/global.css';
import './styles/intro.css';
import './styles/reveal.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
