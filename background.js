// Minimal background service worker for Virtu.hunter Chrome Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Virtu.hunter extension installed.');
});
