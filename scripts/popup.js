// popup.js

function init() {
  checkButtonClick();

  function checkButtonClick() {
    const query = document.querySelectorAll('button');
    if (query) {
      query.forEach(btn => {
        btn.addEventListener('click', function (event) {
          const targetcheckButtonClick = event.target;
          const selectButton = targetcheckButtonClick.id;

          const cmdInput = document.getElementById('cmdInput');
          const promptInput = document.getElementById('promptInput');

          // Create the message object
          const message = {
            selected: selectButton,
            cmd: cmdInput ? cmdInput.value: '',
            prompt: promptInput ? promptInput.value: ''
          };

          if (cmdInput) {
            cmdInput.value = '';
          }
          if (promptInput) {
            promptInput.value = '';
          }
          if (message.selected == null || message.cmd == null) {
            return
          }

          // Send the message to the injected page
          sendMessageToContentScript(message);
        });

      });
    }
  }


  function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  }
}


if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}