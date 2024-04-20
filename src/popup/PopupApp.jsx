import React from 'react';

function PopupApp() {
  const openOptionsPage = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('./index.html'));
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mb-8">
          <i className="fas fa-search text-3xl mb-2"></i>
          <h1 className="text-4xl font-bold">Virtu.hunter</h1>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <button
            className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 w-40 rounded-full inline-flex items-center justify-center"
            onClick={openOptionsPage}
          >
            <i className="fas fa-cog mr-2"></i>
            Settings
          </button>
          <button className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 w-40 rounded-full inline-flex items-center justify-center">
            <i className="fas fa-user mr-2"></i>
            Profile
          </button>
        </div>
        <div className="mt-8">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-gray-600"
            />
            <span className="ml-2 text-white font-bold">Activate</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default PopupApp;
