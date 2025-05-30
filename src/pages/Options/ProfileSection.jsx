import React, { useEffect, useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiTrash2,
  FiPlus
} from 'react-icons/fi';

const categories = [
  {
    key: 'personal',
    title: 'Personal Info',
    fields: [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Phone' }
    ]
  },
  {
    key: 'address',
    title: 'Address',
    fields: [
      { key: 'address', label: 'Address' },
      { key: 'city', label: 'City' },
      { key: 'province', label: 'Province/State' },
      { key: 'postalCode', label: 'Postal Code' },
      { key: 'country', label: 'Country' }
    ]
  },
  {
    key: 'online',
    title: 'Online Profiles',
    fields: [
      { key: 'website', label: 'Website, Blog, or Portfolio', type: 'url' },
      { key: 'linkedin', label: 'LinkedIn Profile URL', type: 'url' },
      { key: 'college', label: 'College/University' }
    ]
  },
  {
    key: 'applicationDetails',
    title: 'Application Details',
    fields: [
      {
        key: 'leadership2Years',
        label: 'Do you have a minimum of 2+ years in a leadership role?',
        type: 'radio',
        options: ['Yes', 'No']
      },
      { key: 'dateAvailable', label: 'Date Available', type: 'date' },
      { key: 'desiredPay', label: 'Desired Pay' }
    ]
  },
  {
    key: 'diversityConsent',
    title: 'Diversity & Consent',
    fields: [
      {
        key: 'gender',
        label: 'Gender',
        type: 'select',
        options: [
          '',
          'Male',
          'Female',
          'Non-binary',
          'Prefer not to say',
          'Other'
        ]
      },
      {
        key: 'genderIdentity',
        label: 'Gender Identity',
        type: 'select',
        options: [
          '',
          'Cisgender',
          'Transgender',
          'Non-binary',
          'Prefer not to say',
          'Other'
        ]
      },
      {
        key: 'ageBracket',
        label: 'Age Bracket',
        type: 'select',
        options: [
          '',
          '18-24',
          '25-34',
          '35-44',
          '45-54',
          '55-64',
          '65+',
          'Prefer not to say'
        ]
      },
      {
        key: 'disability',
        label: 'Disability',
        type: 'select',
        options: ['', 'Yes', 'No', 'Prefer not to say']
      },
      {
        key: 'allowProcessPersonalInfo',
        label: 'Allow us to process your personal information',
        type: 'checkbox'
      }
    ]
  },
  {
    key: 'motivation',
    title: 'Referral & Motivation',
    fields: [
      { key: 'referral', label: 'Who referred you for this position?' },
      { key: 'whyWork', label: 'Why do you want to work at [Company]?' },
      {
        key: 'managedDevs',
        label:
          'Have you directly managed software developers previously? If so, how many?'
      },
      {
        key: 'agileExperience',
        label:
          'Have you led an agile delivery process (scrum, kanban) for a team? Please briefly list some examples.'
      },
      {
        key: 'recentExample',
        label:
          'Could you share a recent example where you have had hands on development experience?'
      }
    ]
  },
  {
    key: 'eligibility',
    title: 'Eligibility & Preferences',
    fields: [
      {
        key: 'remoteEligible',
        label:
          'Are you currently located in and legally eligible to work in Canada?'
      },
      {
        key: 'visaRequired',
        label:
          'Will you require us to file for a visa petition on your behalf to allow you to work?'
      },
      { key: 'howHeard', label: 'How did you hear about this opportunity?' }
    ]
  },
  {
    key: 'documents',
    title: 'Documents',
    fields: [
      {
        key: 'coverLetterText',
        label: 'Cover Letter (Text)',
        type: 'textarea'
      },
      { key: 'resumeFile', label: 'Resume (File)', type: 'file' },
      { key: 'coverLetterFile', label: 'Cover Letter (File)', type: 'file' }
    ]
  }
];

// Validation rules for each field (no required, only format)
const validators = {
  email: (v) => (v && !/^\S+@\S+\.\S+$/.test(v) ? 'Invalid email address' : ''),
  website: (v) => (v && !/^https?:\/\/.+\..+/.test(v) ? 'Invalid URL' : ''),
  linkedin: (v) => (v && !/^https?:\/\/.+\..+/.test(v) ? 'Invalid URL' : '')
};

function generateId() {
  return 'profile_' + Math.random().toString(36).slice(2, 10);
}

const emptyProfile = (name = 'New Profile') => ({
  name,
  // All fields empty
  ...Object.fromEntries(
    categories.flatMap((cat) => cat.fields.map((f) => [f.key, '']))
  )
});

const ProfileSection = () => {
  const [profiles, setProfiles] = useState({}); // {id: profileData}
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState({});
  const [collapsed, setCollapsed] = useState(() => {
    const state = {};
    categories.forEach((cat) => {
      state[cat.key] = false;
    });
    return state;
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [editingName, setEditingName] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  // Load all profiles and activeProfileId
  useEffect(() => {
    chrome.storage.local.get(['profiles', 'activeProfileId'], (result) => {
      const allProfiles = result.profiles || {};
      let activeId = result.activeProfileId;
      // If no profiles, create one
      if (!Object.keys(allProfiles).length) {
        const id = generateId();
        allProfiles[id] = emptyProfile('Default Profile');
        activeId = id;
        chrome.storage.local.set({
          profiles: allProfiles,
          activeProfileId: id
        });
      }
      setProfiles(allProfiles);
      setActiveProfileId(activeId);
      setProfile(allProfiles[activeId]);
      setLoading(false);
    });
  }, []);

  // When activeProfileId changes, update profile
  useEffect(() => {
    if (activeProfileId && profiles[activeProfileId]) {
      setProfile(profiles[activeProfileId]);
    }
  }, [activeProfileId, profiles]);

  // Save profile changes
  const saveProfile = (updatedProfile, cb) => {
    const updatedProfiles = { ...profiles, [activeProfileId]: updatedProfile };
    setProfiles(updatedProfiles);
    setProfile(updatedProfile);
    chrome.storage.local.set({ profiles: updatedProfiles }, cb);
  };

  // Validate a single field
  const validateField = (key, value) => {
    if (validators[key]) {
      return validators[key](value);
    }
    return '';
  };

  // Validate all fields in a category
  const validateCategory = (fields) => {
    const newErrors = {};
    fields.forEach(({ key }) => {
      const err = validateField(key, profile[key] || '');
      if (err) newErrors[key] = err;
    });
    return newErrors;
  };

  const handleChange = (key, value) => {
    const updated = { ...profile, [key]: value };
    setProfile(updated);
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
    setSaved({});
  };

  const handleBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({
      ...prev,
      [key]: validateField(key, profile[key] || '')
    }));
  };

  const handleSaveCategory = (catKey, fields) => (e) => {
    e.preventDefault();
    const catErrors = validateCategory(fields);
    setErrors((prev) => ({ ...prev, ...catErrors }));
    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(fields.map((f) => [f.key, true]))
    }));
    if (Object.keys(catErrors).length > 0) return;
    const updatedProfile = { ...profile };
    fields.forEach(({ key }) => {
      updatedProfile[key] = profile[key];
    });
    saveProfile(updatedProfile, () => {
      setSaved((prev) => ({ ...prev, [catKey]: true }));
      setTimeout(
        () => setSaved((prev) => ({ ...prev, [catKey]: false })),
        1500
      );
    });
  };

  const toggleCollapse = (catKey) => {
    setCollapsed((prev) => ({ ...prev, [catKey]: !prev[catKey] }));
  };

  // Profile management
  const handleProfileSelect = (e) => {
    const id = e.target.value;
    setActiveProfileId(id);
    chrome.storage.local.set({ activeProfileId: id });
  };

  const handleCreateProfile = () => {
    const id = generateId();
    const name = prompt('Enter a name for the new profile:', 'New Profile');
    if (!name) return;
    const newProfiles = { ...profiles, [id]: emptyProfile(name) };
    setProfiles(newProfiles);
    setActiveProfileId(id);
    chrome.storage.local.set({ profiles: newProfiles, activeProfileId: id });
  };

  const handleDeleteProfile = () => {
    if (Object.keys(profiles).length <= 1) {
      alert('You must have at least one profile.');
      return;
    }
    if (!window.confirm('Delete this profile? This cannot be undone.')) return;
    const newProfiles = { ...profiles };
    delete newProfiles[activeProfileId];
    const nextId = Object.keys(newProfiles)[0];
    setProfiles(newProfiles);
    setActiveProfileId(nextId);
    chrome.storage.local.set({
      profiles: newProfiles,
      activeProfileId: nextId
    });
  };

  const handleDuplicateProfile = () => {
    const id = generateId();
    const name = prompt(
      'Enter a name for the duplicated profile:',
      profile.name + ' (Copy)'
    );
    if (!name) return;
    const newProfile = { ...profile, name };
    const newProfiles = { ...profiles, [id]: newProfile };
    setProfiles(newProfiles);
    setActiveProfileId(id);
    chrome.storage.local.set({ profiles: newProfiles, activeProfileId: id });
  };

  const handleNameEdit = () => {
    setEditingName(true);
    setNewProfileName(profile.name);
  };

  const handleNameSave = () => {
    if (!newProfileName.trim()) return;
    const updatedProfile = { ...profile, name: newProfileName.trim() };
    saveProfile(updatedProfile, () => setEditingName(false));
  };

  if (loading)
    return <div className="p-6 bg-white rounded-xl shadow">Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <label
          className="text-xs font-semibold text-gray-600 mr-2"
          htmlFor="options-profile-select"
        >
          Profile
        </label>
        <select
          id="options-profile-select"
          value={activeProfileId}
          onChange={handleProfileSelect}
          className="border rounded px-2 py-1"
        >
          {Object.entries(profiles).map(([id, p]) => (
            <option key={id} value={id}>
              {p.name}
            </option>
          ))}
        </select>
        <Button
          onClick={handleCreateProfile}
          variant="secondary"
          className="px-2 py-1"
        >
          <FiPlus size={16} />
        </Button>
        <Button
          onClick={handleDuplicateProfile}
          variant="secondary"
          className="px-2 py-1"
        >
          <FiCopy size={16} />
        </Button>
        <Button
          onClick={handleDeleteProfile}
          variant="secondary"
          className="px-2 py-1"
        >
          <FiTrash2 size={16} />
        </Button>
        {editingName ? (
          <span className="flex items-center gap-1">
            <input
              className="border rounded px-2 py-1 text-sm"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSave();
              }}
              autoFocus
              style={{ width: 120 }}
            />
            <Button
              onClick={handleNameSave}
              variant="secondary"
              className="px-2 py-1 text-xs"
            >
              Save
            </Button>
          </span>
        ) : (
          <span
            className="ml-2 text-blue-700 font-semibold cursor-pointer"
            onClick={handleNameEdit}
          >
            {profile.name}
          </span>
        )}
      </div>
      <form className="flex flex-col gap-4">
        {categories.map((cat) => (
          <div key={cat.key} className="bg-white border rounded-xl shadow">
            <div
              className="flex items-center justify-between cursor-pointer select-none px-4 py-2"
              onClick={() => toggleCollapse(cat.key)}
            >
              <span className="font-semibold text-blue-700 flex items-center gap-2">
                {cat.title}
                <span className="ml-1">
                  {collapsed[cat.key] ? (
                    <FiChevronDown size={18} />
                  ) : (
                    <FiChevronUp size={18} />
                  )}
                </span>
              </span>
            </div>
            {!collapsed[cat.key] && (
              <div className="flex flex-col gap-3 px-4 pb-4">
                {cat.fields.map(({ key, label, type, options }) => {
                  if (type === 'textarea') {
                    return (
                      <div key={key} className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                          {label}
                        </label>
                        <textarea
                          value={profile[key] || ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500 min-h-[100px]"
                        />
                      </div>
                    );
                  }
                  if (type === 'file') {
                    const fileName = profile[key + 'Name'] || '';
                    return (
                      <div key={key} className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                          {label}
                        </label>
                        <input
                          type="file"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              handleChange(key, ev.target.result);
                              handleChange(key + 'Name', file.name);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                        {fileName && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600">
                              {fileName}
                            </span>
                            <Button
                              type="button"
                              variant="secondary"
                              className="px-2 py-1 text-xs"
                              onClick={() => {
                                handleChange(key, '');
                                handleChange(key + 'Name', '');
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  }
                  if (type === 'radio') {
                    return (
                      <div key={key} className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                          {label}
                        </label>
                        <div className="flex gap-4 mt-1">
                          {options.map((opt) => (
                            <label
                              key={opt}
                              className="flex items-center gap-1 text-sm"
                            >
                              <input
                                type="radio"
                                name={key + activeProfileId}
                                value={opt}
                                checked={profile[key] === opt}
                                onChange={(e) =>
                                  handleChange(key, e.target.value)
                                }
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  if (type === 'select') {
                    return (
                      <div key={key} className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                          {label}
                        </label>
                        <select
                          value={profile[key] || ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (type === 'checkbox') {
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={key + activeProfileId}
                          checked={!!profile[key]}
                          onChange={(e) => handleChange(key, e.target.checked)}
                        />
                        <label
                          htmlFor={key + activeProfileId}
                          className="text-sm font-medium text-gray-700"
                        >
                          {label}
                        </label>
                      </div>
                    );
                  }
                  // Default input
                  return (
                    <Input
                      key={key}
                      label={label}
                      type={type || 'text'}
                      value={profile[key] || ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                      onBlur={() => handleBlur(key)}
                      error={Boolean(errors[key] && touched[key])}
                      helperText={
                        touched[key] && errors[key] ? errors[key] : ''
                      }
                    />
                  );
                })}
                <div className="flex items-center gap-4 mt-2">
                  <Button
                    type="button"
                    onClick={handleSaveCategory(cat.key, cat.fields)}
                  >
                    Save {cat.title}
                  </Button>
                  {saved[cat.key] && (
                    <span className="text-green-600 text-sm">Saved!</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </form>
    </div>
  );
};

export default ProfileSection;
