import React from 'react';
import ReactDOM from 'react-dom/client';
import PopupApp from './PopupApp';
import '../index.scss';

import { ThemeProvider } from '@material-tailwind/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <PopupApp />
    </ThemeProvider>
  </React.StrictMode>
);
