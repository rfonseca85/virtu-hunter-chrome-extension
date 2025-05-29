import React, { useEffect, useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

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
    key: 'application',
    title: 'Application Details',
    fields: [
      { key: 'dateAvailable', label: 'Date Available', type: 'date' },
      { key: 'desiredPay', label: 'Desired Pay' }
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
  }
];

// Validation rules for each field (no required, only format)
const validators = {
  email: (v) => (v && !/^\S+@\S+\.\S+$/.test(v) ? 'Invalid email address' : ''),
  website: (v) => (v && !/^https?:\/\/.+\..+/.test(v) ? 'Invalid URL' : ''),
  linkedin: (v) => (v && !/^https?:\/\/.+\..+/.test(v) ? 'Invalid URL' : '')
};

const ProfileSection = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState({});
  const [collapsed, setCollapsed] = useState(() => {
    // All open by default
    const state = {};
    categories.forEach((cat) => {
      state[cat.key] = false;
    });
    return state;
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    chrome.storage.local.get(['profile'], (result) => {
      setProfile(result.profile || {});
      setLoading(false);
    });
  }, []);

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
    // Validate on change
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
    // Validate all fields in this category
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
    chrome.storage.local.set({ profile: updatedProfile }, () => {
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

  if (loading)
    return <div className="p-6 bg-white rounded-xl shadow">Loading...</div>;

  return (
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
              {cat.fields.map(({ key, label, type }) => (
                <Input
                  key={key}
                  label={label}
                  type={type || 'text'}
                  value={profile[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  onBlur={() => handleBlur(key)}
                  error={Boolean(errors[key] && touched[key])}
                  helperText={touched[key] && errors[key] ? errors[key] : ''}
                />
              ))}
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
  );
};

export default ProfileSection;
