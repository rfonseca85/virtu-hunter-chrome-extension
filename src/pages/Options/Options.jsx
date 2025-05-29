import React, { useState } from 'react';
import ProfileSection from './ProfileSection';
import DocumentsSection from './DocumentsSection';
import SectionTitle from '../../components/common/SectionTitle';
import {
  FiUser,
  FiFileText,
  FiSettings,
  FiTag,
  FiSliders
} from 'react-icons/fi';
import logo from '../../assets/img/logo-light.svg';

const sidebarItems = [
  { key: 'profile', label: 'Profile', icon: <FiUser size={20} /> },
  { key: 'documents', label: 'Documents', icon: <FiFileText size={20} /> },
  { key: 'autofill', label: 'Autofill', icon: <FiSettings size={20} /> },
  { key: 'labels', label: 'Custom Labels', icon: <FiTag size={20} /> },
  { key: 'advanced', label: 'Advanced', icon: <FiSliders size={20} /> }
];

const AutofillPreferences = () => (
  <div className="p-6">
    <SectionTitle>Autofill Preferences</SectionTitle>
    <p className="text-gray-600">
      Configure autofill behavior here. (Coming soon)
    </p>
  </div>
);

const CustomLabels = () => (
  <div className="p-6">
    <SectionTitle>Custom Labels</SectionTitle>
    <p className="text-gray-600">
      Manage custom field labels here. (Coming soon)
    </p>
  </div>
);

const AdvancedSettings = () => (
  <div className="p-6">
    <SectionTitle>Advanced Settings</SectionTitle>
    <p className="text-gray-600">
      Advanced configuration options. (Coming soon)
    </p>
  </div>
);

const Options = () => {
  const [tab, setTab] = useState('profile');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col py-8 px-4 min-h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <img src={logo} alt="Virtu Hunter" className="w-8 h-8" />
          <span className="font-bold text-lg text-gray-900 tracking-tight">
            Virtu Hunter
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          {sidebarItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition
                ${
                  tab === key
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start py-12 px-4">
        <div className="w-full max-w-5xl">
          {/* Section content (no outer Card) */}
          {tab === 'profile' && <ProfileSection />}
          {tab === 'documents' && <DocumentsSection />}
          {tab === 'autofill' && <AutofillPreferences />}
          {tab === 'labels' && <CustomLabels />}
          {tab === 'advanced' && <AdvancedSettings />}
        </div>
      </main>
    </div>
  );
};

export default Options;
