import React from 'react';
import ReactDOM from 'react-dom';
import AutoFill from './AutoFill';

const root = document.createElement('div');
root.id = 'crx-root';
document.body.appendChild(root);

ReactDOM.render(
  <React.StrictMode>
    <AutoFill />
  </React.StrictMode>,
  root
);
