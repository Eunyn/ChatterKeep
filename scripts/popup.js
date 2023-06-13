// popup.js

function init() {
  checkButtonClick();

  function checkButtonClick() {
    const query = document.querySelectorAll('button');
    if (query) {
      query.forEach(btn => {
        btn.addEventListener('click', function (event) {
          var targetcheckButtonClick = event.target;
          var selectButton = targetcheckButtonClick.id;

          const cmdInput = document.getElementById('floatingText');
          const promptInput = document.getElementById('floatingTextarea2');

          console.log('send: ' + selectButton);

          // Create the message object
          var message = {
            selected: selectButton,
            cmd: cmdInput.value,
            prompt: promptInput.value
          };


          // Send the message to the injected page
          sendMessageToContentScript(message);
        });

      });

      const cmdInput = document.getElementById('floatingText');
      const promptInput = document.getElementById('floatingTextarea2');

      if (cmdInput) {
        cmdInput.value = '';
      }
      if (promptInput) {
        promptInput.value = '';
      }
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