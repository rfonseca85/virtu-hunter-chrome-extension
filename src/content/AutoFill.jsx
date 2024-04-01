import Alert from './Alert';

function AutoFill() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', contentScriptMain);
  } else {
    // The DOMContentLoaded event already fired. Run the main function immediately.
    contentScriptMain();
  }

  function contentScriptMain() {
    var inputFields = document.querySelectorAll('input');
    inputFields.forEach((field) => {
      if (field.name === 'username') {
        chrome.storage.sync.get('username', function (data) {
          field.value = data.username || ''; // Fallback to an empty string if username is undefined
        });
      }
    });
  }

  return (
    <div>
      <Alert />
    </div>
  );
}
export default AutoFill;
