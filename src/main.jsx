import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';

import { ThemeProvider } from '@material-tailwind/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
