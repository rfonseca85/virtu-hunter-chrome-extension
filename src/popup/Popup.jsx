import React, { useEffect, useState } from 'react';
import SectionTitle from '../components/common/SectionTitle';
import Button from '../components/common/Button';
import { Switch } from '@material-tailwind/react';
import { FiSettings } from 'react-icons/fi';
import logo from '../assets/img/logo-light.svg';

const Popup = () => {
  const [enabled, setEnabled] = useState(false);
  const [profiles, setProfiles] = useState({});
  const [activeProfileId, setActiveProfileId] = useState('');

  useEffect(() => {
    chrome.storage.local.get(
      ['autofillEnabled', 'profiles', 'activeProfileId'],
      (result) => {
        setEnabled(!!result.autofillEnabled);
        setProfiles(result.profiles || {});
        setActiveProfileId(result.activeProfileId || '');
      }
    );
  }, []);

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    chrome.storage.local.set({ autofillEnabled: newValue });
  };

  const handleProfileChange = (e) => {
    const id = e.target.value;
    setActiveProfileId(id);
    chrome.storage.local.set({ activeProfileId: id });
  };

  const openOptions = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('options.html');
    }
  };

  return (
    <div className="min-w-[340px] min-h-[260px] bg-gray-50 flex rounded-2xl shadow-xl overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 px-2">
        <img src={logo} alt="Virtu Hunter" className="w-10 h-10 mb-4" />
        <button
          onClick={openOptions}
          className="flex flex-col items-center gap-1 text-blue-700 hover:text-blue-900 mt-2"
          title="Open Options"
        >
          <FiSettings size={22} />
          <span className="text-xs font-medium">Options</span>
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-6 px-4">
        <SectionTitle className="mb-1 text-center text-xl font-bold text-blue-700">
          Virtu Hunter
        </SectionTitle>
        <div className="w-full flex flex-col items-center mb-2">
          <label
            className="text-xs font-semibold text-gray-600 mb-1"
            htmlFor="popup-profile-select"
          >
            Profile
          </label>
          <select
            id="popup-profile-select"
            value={activeProfileId}
            onChange={handleProfileChange}
            className="border rounded px-2 py-1 text-sm mb-2"
            style={{ minWidth: 180 }}
          >
            {Object.entries(profiles).map(([id, p]) => (
              <option key={id} value={id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-gray-500 text-sm mb-4 text-center">
          Smart Job Form Autofill
        </div>
        <div className="flex items-center gap-3 w-full justify-between bg-blue-50 rounded-lg px-3 py-2 mb-4">
          <span className="text-sm font-medium text-blue-700">Autofill</span>
          <Switch
            checked={enabled}
            onChange={handleToggle}
            color="blue"
            className="scale-110"
          />
        </div>
      </main>
    </div>
  );
};

export default Popup;
