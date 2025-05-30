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
  how_heard: 'howHeard',
  cover_letter_text: 'coverLetterText',
  resume_file: 'resumeFile',
  cover_letter_file: 'coverLetterFile',
  leadership_2_years: 'leadership2Years',
  gender: 'gender',
  gender_identity: 'genderIdentity',
  age_bracket: 'ageBracket',
  disability: 'disability',
  allow_process_personal_info: 'allowProcessPersonalInfo'
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

// Add helper to show file upload banner
function showFileUploadBanner(message) {
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
  banner.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(banner);
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
    const labelText = label.innerText || label.textContent;
    let currentFieldLabel = labelText;
    let matchedKey = null;
    let didAutofill = false;
    const result = await classifyLabel(labelText);
    if (result) {
      matchedKey = idToProfileKey[result.id];
      let value = matchedKey ? profile[matchedKey] : null;
      let input = getInputForLabel(label);
      // If input not found, try to find in the nearest container (for custom forms)
      let container = label.closest('.pad-v-3') || label.parentElement;
      if (!input && container) {
        // Try radio
        let radios = container.querySelectorAll('input[type=radio]');
        if (radios.length) input = radios[0];
        // Try select
        let select = container.querySelector('select');
        if (!input && select) input = select;
        // Try checkbox
        let checkbox = container.querySelector('input[type=checkbox]');
        if (!input && checkbox) input = checkbox;
      }
      if (value !== undefined && value !== null) {
        if (input) {
          // Standard autofill logic
          if (
            input.type === 'file' &&
            typeof value === 'string' &&
            value.startsWith('data:')
          ) {
            let fileName = profile[matchedKey + 'Name'] || 'file';
            // Look for a hidden file input near the label/container
            let fileInput = input;
            if (!fileInput || fileInput.type !== 'file') {
              if (label.htmlFor) {
                fileInput = document.getElementById(label.htmlFor);
              }
              if (!fileInput) {
                fileInput = container.querySelector('input[type=file]');
              }
              if (!fileInput) {
                fileInput = document.querySelector('input[type=file]');
              }
            }
            // If file input is found, set the file directly
            if (fileInput && fileInput.type === 'file') {
              let getFilePromise = Promise.resolve(value);
              if (!value && matchedKey === 'resumeFile') {
                getFilePromise = new Promise((resolve) => {
                  chrome.storage.local.get(['resumeFile'], (result) => {
                    resolve(result.resumeFile);
                  });
                });
              }
              getFilePromise.then((fileData) => {
                if (!fileData || !fileInput) return;
                fetch(fileData)
                  .then((res) => res.blob())
                  .then((blob) => {
                    const file = new File([blob], fileName, {
                      type: blob.type
                    });
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    fileInput.files = dt.files;
                    fileInput.dispatchEvent(
                      new Event('change', { bubbles: true })
                    );
                  });
              });
              didAutofill = true;
            } else {
              // If file input is not found, prompt the user to click the upload button
              showFileUploadBanner(
                'Click the "Attach" button to upload your resume automatically.'
              );
              let uploadBtn = null;
              uploadBtn = container.querySelector('button, label, div');
              if (uploadBtn) {
                const btnText = uploadBtn.textContent.toLowerCase();
                if (!/attach|upload|resume|cv/.test(btnText)) uploadBtn = null;
              }
              if (!uploadBtn) {
                uploadBtn = document.querySelector('button, label, div');
                if (uploadBtn) {
                  const btnText = uploadBtn.textContent.toLowerCase();
                  if (!/attach|upload|resume|cv/.test(btnText))
                    uploadBtn = null;
                }
              }
              if (uploadBtn) {
                // Use MutationObserver to wait for file input
                const observer = new MutationObserver((mutations, obs) => {
                  let newInput =
                    container.querySelector('input[type=file]') ||
                    document.querySelector('input[type=file]');
                  if (newInput) {
                    obs.disconnect();
                    let getFilePromise = Promise.resolve(value);
                    if (!value && matchedKey === 'resumeFile') {
                      getFilePromise = new Promise((resolve) => {
                        chrome.storage.local.get(['resumeFile'], (result) => {
                          resolve(result.resumeFile);
                        });
                      });
                    }
                    getFilePromise.then((fileData) => {
                      if (!fileData || !newInput) return;
                      fetch(fileData)
                        .then((res) => res.blob())
                        .then((blob) => {
                          const file = new File([blob], fileName, {
                            type: blob.type
                          });
                          const dt = new DataTransfer();
                          dt.items.add(file);
                          newInput.files = dt.files;
                          newInput.dispatchEvent(
                            new Event('change', { bubbles: true })
                          );
                          showFileUploadBanner('Resume uploaded!');
                          setTimeout(removeAutofillBanner, 2000);
                        });
                    });
                  }
                });
                observer.observe(container, { childList: true, subtree: true });
                // Also set a timeout fallback in case the input is already present
                setTimeout(() => {
                  let newInput =
                    container.querySelector('input[type=file]') ||
                    document.querySelector('input[type=file]');
                  if (newInput) {
                    observer.disconnect();
                    let getFilePromise = Promise.resolve(value);
                    if (!value && matchedKey === 'resumeFile') {
                      getFilePromise = new Promise((resolve) => {
                        chrome.storage.local.get(['resumeFile'], (result) => {
                          resolve(result.resumeFile);
                        });
                      });
                    }
                    getFilePromise.then((fileData) => {
                      if (!fileData || !newInput) return;
                      fetch(fileData)
                        .then((res) => res.blob())
                        .then((blob) => {
                          const file = new File([blob], fileName, {
                            type: blob.type
                          });
                          const dt = new DataTransfer();
                          dt.items.add(file);
                          newInput.files = dt.files;
                          newInput.dispatchEvent(
                            new Event('change', { bubbles: true })
                          );
                          showFileUploadBanner('Resume uploaded!');
                          setTimeout(removeAutofillBanner, 2000);
                        });
                    });
                  } else {
                    showFileUploadBanner(
                      'Please select your resume file manually.'
                    );
                    setTimeout(removeAutofillBanner, 4000);
                  }
                }, 1500);
              } else {
                showFileUploadBanner(
                  'Please select your resume file manually.'
                );
                setTimeout(removeAutofillBanner, 4000);
              }
            }
          } else if (input.tagName === 'TEXTAREA') {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            didAutofill = true;
          } else if (input.type === 'radio') {
            const radios = container.querySelectorAll('input[type=radio]');
            for (let radio of radios) {
              if (
                radio.value.toLowerCase() === String(value).toLowerCase() ||
                (radio.labels &&
                  radio.labels[0] &&
                  radio.labels[0].innerText.trim().toLowerCase() ===
                    String(value).toLowerCase())
              ) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
                didAutofill = true;
              }
            }
          } else if (input.tagName === 'SELECT') {
            input.value = value;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            didAutofill = true;
          } else if (input.type === 'checkbox') {
            input.checked = !!value;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            didAutofill = true;
          } else {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            didAutofill = true;
          }
        } else if (container) {
          // Only run this if input is not found and container exists
          // Try to handle custom React select (e.g., react-select)
          const reactSelectContainer = container.querySelector('.react-select');
          const reactSelectControl = container.querySelector(
            '.react-select__control'
          );
          if (reactSelectControl && value) {
            reactSelectControl.click();
            await new Promise((res) => setTimeout(res, 150));
            // Try to scope menu search to the closest react-select container
            let menu = null;
            if (reactSelectContainer) {
              menu = reactSelectContainer.querySelector('.react-select__menu');
            }
            if (!menu) {
              // fallback to global if not found in container
              menu = document.querySelector('.react-select__menu');
            }
            if (menu) {
              const options = Array.from(
                menu.querySelectorAll('.react-select__option')
              );
              let match = null;
              // Try to match by visible text (case-insensitive)
              match = options.find(
                (opt) =>
                  opt.textContent.trim().toLowerCase() ===
                  String(value).trim().toLowerCase()
              );
              // Try to match by value attribute (if present)
              if (!match) {
                match = options.find(
                  (opt) =>
                    (opt.getAttribute('value') || '').toLowerCase() ===
                    String(value).trim().toLowerCase()
                );
              }
              // Try to match by data-value attribute (if present)
              if (!match) {
                match = options.find(
                  (opt) =>
                    (opt.getAttribute('data-value') || '').toLowerCase() ===
                    String(value).trim().toLowerCase()
                );
              }
              // Try to match by number (if value is a number)
              if (!match && !isNaN(Number(value))) {
                match = options.find(
                  (opt) =>
                    (
                      opt.getAttribute('value') ||
                      opt.getAttribute('data-value') ||
                      ''
                    ).toString() === value.toString()
                );
              }
              if (match) {
                match.click();
                didAutofill = true;
              }
            }
          }
          // Fallback: try to set the hidden <select> (match by text or value)
          const hiddenSelect = container.querySelector('select');
          if (!didAutofill && hiddenSelect) {
            // Try to match by option text or value
            let found = false;
            for (let opt of hiddenSelect.options) {
              if (
                opt.text.trim().toLowerCase() ===
                  String(value).trim().toLowerCase() ||
                String(opt.value).trim().toLowerCase() ===
                  String(value).trim().toLowerCase()
              ) {
                hiddenSelect.value = opt.value;
                hiddenSelect.dispatchEvent(
                  new Event('change', { bubbles: true })
                );
                didAutofill = true;
                found = true;
                break;
              }
            }
            // If not found, fallback to setting value directly
            if (!found) {
              hiddenSelect.value = value;
              hiddenSelect.dispatchEvent(
                new Event('change', { bubbles: true })
              );
              didAutofill = true;
            }
          }
        }
      }
      currentFieldLabel = result.display;
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
