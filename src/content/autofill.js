console.log('Virtu Hunter content script loaded');
import { classifyLabel } from '../classifier/classify';

// Configurable delay for progress bar animation (ms)
const PROGRESS_DELAY_MS = 15; // Set to 0 for instant, or tweak as needed

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

function showConfirmBanner(onConfirm, profileName) {
  removeAutofillBanner();
  const banner = document.createElement('div');
  banner.id = 'virtu-hunter-autofill-banner';
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
  banner.innerHTML = `
    <span>Virtu Hunter: Would you like to autofill this form with <b>"${
      profileName || 'Profile'
    }"</b>?</span>
    <button id="virtu-hunter-autofill-confirm" style="margin-left:1em;padding:0.3em 1em;border:none;border-radius:4px;background:#fff;color:#2563eb;font-weight:600;cursor:pointer;">Autofill Now</button>
  `;
  document.body.appendChild(banner);
  document.getElementById('virtu-hunter-autofill-confirm').onclick = onConfirm;
}

function showProgressBanner(progress, currentFieldLabel) {
  let banner = document.getElementById('virtu-hunter-autofill-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'virtu-hunter-autofill-banner';
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
  banner.innerHTML = `
    <span>Virtu Hunter: Autofilling... (${Math.round(progress * 100)}%)</span>
    <div style="margin:0.5em auto 0 auto;width:60%;height:22px;background:#fff3;border-radius:4px;overflow:hidden;display:flex;align-items:center;">
      <div style="height:100%;width:${Math.round(
        progress * 100
      )}%;background:#fff;display:flex;align-items:center;justify-content:center;transition:width 0.2s;">
        <span style="color:#2563eb;font-size:0.95em;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 8px;">${
          currentFieldLabel || ''
        }</span>
      </div>
    </div>
  `;
}

function removeAutofillBanner() {
  const banner = document.getElementById('virtu-hunter-autofill-banner');
  if (banner) banner.remove();
}

async function autofillWithProgress() {
  // Get all profiles and active profile id from storage
  const { profiles = {}, activeProfileId } = await new Promise((resolve) => {
    chrome.storage.local.get(['profiles', 'activeProfileId'], resolve);
  });
  const profile = profiles[activeProfileId] || {};
  const labels = Array.from(document.querySelectorAll('label'));
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const input = getInputForLabel(label);
    let currentFieldLabel = label.innerText;
    let matchedKey = null;
    let didAutofill = false;
    if (input) {
      const result = await classifyLabel(label.innerText);
      if (result) {
        matchedKey = idToProfileKey[result.id];
        let value = matchedKey ? profile[matchedKey] : null;
        if (value) {
          input.value = value;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          didAutofill = true;
        }
        currentFieldLabel = result.display;
      }
    }
    showProgressBanner((i + 1) / labels.length, currentFieldLabel);
    if (didAutofill && PROGRESS_DELAY_MS > 0) {
      await new Promise((res) => setTimeout(res, PROGRESS_DELAY_MS));
    }
  }
  setTimeout(removeAutofillBanner, 1200);
}

function runAutofillWithConfirmation() {
  // Get the active profile name
  chrome.storage.local.get(['profiles', 'activeProfileId'], (result) => {
    const { profiles = {}, activeProfileId } = result;
    const profile = profiles[activeProfileId] || {};
    const profileName = profile.name || 'Profile';
    showConfirmBanner(() => {
      showProgressBanner(0, '');
      autofillWithProgress();
    }, profileName);
  });
}

function checkAndRunAutofill() {
  chrome.storage.local.get(['autofillEnabled'], (result) => {
    if (result.autofillEnabled) {
      runAutofillWithConfirmation();
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
      runAutofillWithConfirmation();
    } else {
      // Optionally: clear fields or remove banner here
      removeAutofillBanner();
    }
  }
});

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', checkAndRunAutofill);
} else {
  checkAndRunAutofill();
}

console.log('Virtu Hunter content script runned');
