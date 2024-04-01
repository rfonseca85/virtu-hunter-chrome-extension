import React from 'react';
import './PopupApp.css';

function PopupApp() {
  const openOptionsPage = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('./index.html'));
    }
  };

  return (
    <div>
      <button onClick={openOptionsPage}>Open Configuration Page</button>
    </div>
  );
}

export default PopupApp;
