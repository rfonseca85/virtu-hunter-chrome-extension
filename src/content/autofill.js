console.log('Virtu Hunter content script loaded');
import { classifyLabel } from '../classifier/classify';

// Map classifier id to profile key
const idToProfileKey = {
  first_name: 'firstName',
  last_name: 'lastName',
  full_name: 'fullName',
  email: 'email',
  phone: 'phone',
  address: 'address',
  city: 'city',
  province: 'province',
  postal_code: 'postalCode',
  country: 'country',
  website: 'website',
  linkedin: 'linkedin',
  college: 'college',
  date_available: 'dateAvailable',
  desired_pay: 'desiredPay',
  referral: 'referral',
  why_work: 'whyWork',
  managed_devs: 'managedDevs',
  agile_experience: 'agileExperience',
  recent_example: 'recentExample',
  remote_eligible: 'remoteEligible',
  visa_required: 'visaRequired',
  how_heard: 'howHeard'
};

// Helper: get associated input for a label
function getInputForLabel(label) {
  if (label.htmlFor) {
    return document.getElementById(label.htmlFor);
  }
  // Try next sibling or input inside label
  return (
    label.querySelector('input,textarea,select') || label.nextElementSibling
  );
}

function showAutofillBanner() {
  const banner = document.createElement('div');
  banner.id = 'virtu-hunter-autofill-banner';
  banner.textContent = 'Virtu Hunter: Autofill is running...';
  banner.style.position = 'fixed';
  banner.style.top = '0';
  banner.style.left = '0';
  banner.style.width = '100%';
  banner.style.background = '#2563eb';
  banner.style.color = '#fff';
  banner.style.fontWeight = 'bold';
  banner.style.fontSize = '1rem';
  banner.style.textAlign = 'center';
  banner.style.padding = '0.5em 0';
  banner.style.zIndex = '9999';
  document.body.appendChild(banner);
}

function removeAutofillBanner() {
  const banner = document.getElementById('virtu-hunter-autofill-banner');
  if (banner) banner.remove();
}

async function autofill() {
  console.log('Virtu Hunter content script runned');
  showAutofillBanner();
  console.log('Banner shown');
  // Get user profile from storage
  const { profile = {} } = await new Promise((resolve) => {
    chrome.storage.local.get(['profile'], resolve);
  });

  const labels = Array.from(document.querySelectorAll('label'));
  for (const label of labels) {
    const input = getInputForLabel(label);
    if (!input) continue;
    const result = await classifyLabel(label.innerText);
    if (!result) continue;
    // Map category id to profile key
    const profileKey = idToProfileKey[result.id];
    let value = profileKey ? profile[profileKey] : null;
    if (value) {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
  setTimeout(removeAutofillBanner, 2000);
  console.log('Autofill function finished');
}

function runAutofill() {
  autofill();
}

function checkAndRunAutofill() {
  chrome.storage.local.get(['autofillEnabled'], (result) => {
    if (result.autofillEnabled) {
      runAutofill();
    } else {
      console.log('Virtu Hunter autofill is disabled');
    }
  });
}

// Listen for instant toggle changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && 'autofillEnabled' in changes) {
    const newValue = changes.autofillEnabled.newValue;
    if (newValue) {
      console.log('Virtu Hunter autofill enabled (live)');
      runAutofill();
    } else {
      console.log('Virtu Hunter autofill disabled (live)');
      // Optionally: clear fields or remove banner here
    }
  }
});

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', checkAndRunAutofill);
} else {
  checkAndRunAutofill();
}

console.log('Virtu Hunter content script runned');
