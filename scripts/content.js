// content.js

function initExecute() {

  execute();

  function execute() {
    getCurrentConversationName();
    var questions = document.querySelectorAll('.group.w-full.text-token-text-primary.border-b.border-black\\/10.dark\\:border-gray-900\\/50.dark\\:bg-gray-800');
    var answers = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.light');

    setInterval(() => {
      getCurrentConversationName();
      questions = document.querySelectorAll('.group.w-full.text-token-text-primary.border-b.border-black\\/10.dark\\:border-gray-900\\/50.dark\\:bg-gray-800');
      answers = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.light');

      createCodeFile();

      // initTimerDom();
    }, 3000);


    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.selected === 'addPrompt') {

        console.log('add prompt: ' + message.cmd + '\n' + message.prompt);
        handleAddButtonClick(message.cmd, message.prompt);

      } else if (message.selected === 'deletePrompt') {

        console.log('delete prompt: ' + message.cmd);
        handleDeleteButtonClick(message.cmd);

      } else if (message.selected === 'pdfDown') {

        console.log('saveQAndAAsPDF');
        saveQAndAAsPDF(questions, answers);

      } else if (message.selected === 'markDown') {

        console.log('saveQAndAAsMarkdown');
        saveQAndAAsMarkdown(questions, answers);

      } else if (message.selected === 'textDown') {

        console.log('saveQAndAAsText');
        saveQAndAAsText(questions, answers);

      } else if (message.selected === 'uploadFile') {

        console.log('uploadFile');
        uploadFile();

      }
    });
  }


  function handleAddButtonClick(cmdInput, promptInput) {
    if (!cmdInput || !promptInput) {
      console.log('none');
      return;
    }

    var prompts = '';
    var isContainsChinese = containsChinese(cmdInput);
    if (isContainsChinese && cmdInput.startsWith('#')) {
      prompts = localStorage.getItem('prompts-zh');
      if (!prompts) {
        prompts = JSON.stringify(jsonDataZh)
        localStorage.setItem('prompts-zh', prompts);
      }
    } else {
      prompts = localStorage.getItem('prompts-eng');
      if (!prompts) {
        var data = JSON.stringify(jsonData);
        localStorage.setItem('prompts-eng', data);
        prompts = data;
      } 
    }

    prompts = JSON.parse(prompts);
    var index = prompts.findIndex(function(entry) {
      return entry.cmd === cmdInput;
    });


    if (index !== -1) {
      prompts.splice(index, 1);
      // return;
    }
    
    var newEntry = {
      "cmd": cmdInput,
      "prompt": promptInput
    };

    prompts.push(newEntry);

    if (isContainsChinese && cmdInput.startsWith('#')) {
      localStorage.setItem('prompts-zh', JSON.stringify(prompts));
    } else {
      localStorage.setItem('prompts-eng', JSON.stringify(prompts));
    }

    // console.log(prompts);
  }

  function handleDeleteButtonClick(cmdInput) {
    if (!cmdInput) {
      return;
    }

    var isContainsChinese = containsChinese(cmdInput);
    var prompts = '';

    if (isContainsChinese && cmdInput.startsWith('#')) {
      prompts = localStorage.getItem('prompts-zh');
    } else {
      prompts = localStorage.getItem('prompts-eng');
    }

    if (!prompts) {
      return;
    }

    var deleteData = JSON.parse(prompts);

    var index = deleteData.findIndex(function(entry) {
      return entry.cmd === cmdInput;
    });

    if (index !== -1) {
      deleteData.splice(index, 1);
    } else {
      return;
    }

    if (isContainsChinese && cmdInput.startsWith('#')) {
      localStorage.setItem('prompts-zh', JSON.stringify(deleteData));
    } else {
      localStorage.setItem('prompts-eng', JSON.stringify(deleteData));
    }

    // console.log(deleteData);
  }


  function containsChinese(text) {
    const chineseRegex = /[\u4e00-\u9fa5]/; // Regular expression to match Chinese characters
    return chineseRegex.test(text);
  }


  let fileName = 'conversation';
  function getCurrentConversationName() {
    const currentConversationName = document.querySelector('[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all bg-gray-800 pr-14 hover:bg-gray-800 group"]');
    if (currentConversationName) {
      fileName = currentConversationName.textContent;
    }
  }


  function saveQAndAAsPDF(questions, answers) {
    // Create a new jsPDF instance
    const doc = new window.jspdf.jsPDF();
    const fontPath = './fonts/simsunb.ttf';
    // Register the font with jsPDF
    doc.addFileToVFS(fontPath, font);
    doc.addFont(fontPath, 'simsunb', 'normal');
    doc.setFont('simsunb');

    let y = 10;
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i].textContent.trim();
      const answer = answers[i].textContent.trim();

      // convert the question content
      const questionWithoutPageNumber = question.replace(/^\d+ \/ \d+/, '');
      const questionsLines = doc.splitTextToSize(questionWithoutPageNumber, 185);
      doc.text(10, y, `Q${i + 1}: ${questionsLines[0]}`);
      y += 6;
      for (let j = 1; j < questionsLines.length; j++) {
        if (y + 10 > doc.internal.pageSize.getHeight()) {
          doc.addPage();
          y = 6;
        }
        doc.text(10, y, `${questionsLines[j]}`);
        y += 6;
      }
      y += 1;

      // convert the answer content
      const answerLines = doc.splitTextToSize(answer, 185);
      doc.text(10, y, `A: ${answerLines[0]}`);
      y += 6;
      for (let j = 1; j < answerLines.length; j++) {
        if (y + 10 > doc.internal.pageSize.getHeight()) {
          doc.addPage();
          y = 6;
        }
        doc.text(10, y, `${answerLines[j]}`);
        y += 6;
      }
      y += 6;
    }

    doc.save(fileName + '.pdf');
  }



  function saveQAndAAsMarkdown(questions, answers) {
    let markdownContent = '';

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i].textContent.trim();
      const answer = answers[i].textContent.trim();

      const questionWithoutPageNumber = question.replace(/^\d+ \/ \d+/, '');
      markdownContent += `**Q${i + 1}:** ${questionWithoutPageNumber}\n\n`;
      markdownContent += '```markdown\n';
      markdownContent += `${answer}\n`;
      markdownContent += '```\n\n';
    }

    downloadFileByType('.md', markdownContent);
  }


  function saveQAndAAsText(questions, answers) {
    let textContent = '';

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i].textContent;
      const answer = answers[i].textContent;

      const questionWithoutPageNumber = question.replace(/^\d+ \/ \d+/, '');
      textContent += `Q${i + 1}: ${questionWithoutPageNumber}\n`;
      textContent += `A: ${answer}\n\n`;
    }

    downloadFileByType('.txt', textContent);    
  }


  function downloadFileByType(type, content) {
    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
    link.download = fileName + type;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  function uploadFile() {
    const upload = document.createElement('input');
    upload.type = 'file';
    upload.accept = '.txt, .pdf, .docx, .xlsx, .js, .py, .html, .css, .json, .c, .cpp, .java, .go, .rs, .php, .sql';

    upload.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      const currentConversationName = document.querySelector('[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all bg-gray-800 pr-14 hover:bg-gray-800 group"]');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.min.js';

      if (file.type === 'application/pdf') {
        uploadPDFFile(file, reader, currentConversationName);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        uploadWordFile(file, reader, currentConversationName);
      } else  if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        uploadExcelFile(file, reader, currentConversationName);
      } else {
        uploadPlainTextFile(file, reader, currentConversationName);
      }
    });

    upload.click();
  }


  function submitConversation(text, part, filename) {
    const textarea = document.querySelector("textarea");
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
    textarea.dispatchEvent(inputEvent);
  }


  function uploadPDFFile(file, reader, currentConversationName) {
    reader.onload = async (event) => {
        const typedarray = new Uint8Array(event.target.result);

        // Load the PDF using PDF.js
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const numPages = pdf.numPages;
        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
          const currentName = document.querySelector('[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all bg-gray-800 pr-14 hover:bg-gray-800 group"]');
          if (currentConversationName != currentName) {
            console.log('Conversation has been changed');
            break;
          }

          let text = '';

          const page = await pdf.getPage(pageNumber);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');

          // Append page text to the overall text
          text += `Page ${pageNumber}:\n${pageText}\n\n`;

          await submitConversation(text, pageNumber, file.name);
          
          const submit = document.getElementById('prompt-textarea');
          if (submit) {
            submit.nextElementSibling.click();
          }

          let chatgptReady = false;
          while (!chatgptReady) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            const stopGenerating = document.querySelector('.btn.relative.btn-neutral.border-0.md\\:border');
            if (stopGenerating) {
              chatgptReady = stopGenerating.textContent !== "Stop generating";
            }
          }

          text = '';
        }
      };

    reader.readAsArrayBuffer(file);
  }


  function setSizeByModel() {
    var chunkSize = 1024;
    const modelType = document.querySelector('[class="relative z-20 flex flex-wrap items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300"]');
    if (modelType && modelType.textContent === 'Model: GPT-4') {
      chunkSize = chunkSize * 4;
    } else {
      chunkSize = chunkSize * 10;
    }

    return chunkSize;
  }


  function uploadWordFile(file, reader, currentConversationName) {
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;

      // Convert the Word file to HTML using mammoth.js
      const result = await new Promise((resolve, reject) => {
        const options = {
          arrayBuffer: arrayBuffer,
        };

        mammoth.extractRawText(options)
          .then((result) => {
            resolve(result.value);
          })
          .catch((error) => {
            reject(error);
          });
      });

      const chunkSizeInBytes = setSizeByModel();
      const chunkSize = Math.floor(chunkSizeInBytes / 2); // 1 JavaScript character is 2 bytes
      const text = result.replace(/\n/g, ' '); // Replace line breaks with spaces

      const chunks = [];
      for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
      }

      for (let i = 0; i < chunks.length; i++) {
        const currentName = document.querySelector('[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all bg-gray-800 pr-14 hover:bg-gray-800 group"]');
        if (currentConversationName != currentName) {
          console.log('Conversation has been changed');
          break;
        }

        const chunkContent = chunks[i];
        const chunkNumber = i + 1;

        await submitConversation(chunkContent, chunkNumber, file.name);

        const submit = document.getElementById('prompt-textarea');
        if (submit) {
          submit.nextElementSibling.click();
        }

        let chatgptReady = false;
        while (!chatgptReady) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          const stopGenerating = document.querySelector('.btn.relative.btn-neutral.border-0.md\\:border');
          if (stopGenerating) {
            chatgptReady = stopGenerating.textContent !== "Stop generating";
          }
        }
      }
    };

    reader.readAsArrayBuffer(file);
  }


  function uploadExcelFile(file, reader, currentConversationName) {
    reader.onload = async (event) => {
        let data = new Uint8Array(event.target.result);
        let workbook = XLSX.read(data, {type: 'array'});

        const chunkSizeInBytes = setSizeByModel(); // adjust this as needed

        // Function to split array into chunks
        function chunkArray(myArray, chunk_size_in_bytes){
            let results = [];
            let chunk = [];
            let chunkSize = 0;
            for (const item of myArray) {
                const itemSize = JSON.stringify(item).length * 2;
                if (chunkSize + itemSize > chunk_size_in_bytes) {
                    results.push(chunk);
                    chunk = [item];
                    chunkSize = itemSize;
                } else {
                    chunk.push(item);
                    chunkSize += itemSize;
                }
            }
            if (chunk.length > 0) {
                results.push(chunk);
            }
            return results;
        }

        // Iterate over each sheet
        for (let sheetName of workbook.SheetNames) {
            let worksheet = workbook.Sheets[sheetName];
            let jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

            const currentName = document.querySelector('[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all bg-gray-800 pr-14 hover:bg-gray-800 group"]');
            if (currentConversationName != currentName) {
              console.log('Conversation has been changed');
              break;
            }

            // Split jsonData into chunks
            let chunks = chunkArray(jsonData, chunkSizeInBytes);

            for(let i = 0; i < chunks.length; i++) {
                const currentName = document.querySelector('[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all bg-gray-800 pr-14 hover:bg-gray-800 group"]');
                if (currentConversationName != currentName) {
                  console.log('Conversation has been changed');
                  break;
                }
                await submitConversation(chunks[i], i + 1, file.name);

                const submit = document.getElementById('prompt-textarea');
                if (submit) {
                    submit.nextElementSibling.click();
                }

                let chatgptReady = false;
                while (!chatgptReady) {
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                    const stopGenerating = document.querySelector('.btn.relative.btn-neutral.border-0.md\\:border');
                    if (stopGenerating) {
                      chatgptReady = stopGenerating.textContent !== "Stop generating";
                    }
                }
            }
        }
    };

    reader.readAsArrayBuffer(file);
  }


  async function uploadPlainTextFile(file, reader, currentConversationName) {
    const chunkSize = setSizeByModel();
    let offset = 0;
    let part = 1;

    while (offset < file.size) {
      const currentName = document.querySelector('[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all bg-gray-800 pr-14 hover:bg-gray-800 group"]');
      if (currentConversationName != currentName) {
        console.log('Conversation has been changed');
        break;
      }
        
      const chunk = file.slice(offset, offset + chunkSize);
      const text = await new Promise((resolve) => {
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsText(chunk);
      });

      await submitConversation(text, part, file.name);

      const submit = document.getElementById('prompt-textarea');
      if (submit) {
        submit.nextElementSibling.click();
      }

      let chatgptReady = false;
      while (!chatgptReady) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const stopGenerating = document.querySelector('.btn.relative.btn-neutral.border-0.md\\:border');
        if (stopGenerating) {
          chatgptReady = stopGenerating.textContent !== "Stop generating";
        }
      }

      offset += chunkSize;
      part++;
    }

    const submit = document.getElementById('prompt-textarea');
    if (submit && submit.value) {
      submit.nextElementSibling.click();
    }
  }


  function createCodeFile() {
    let domClass = getCodeBlockByAIType();

    const codeLists = document.querySelectorAll(domClass.codeBlock);
    codeLists.forEach(codeContainer => {
      if (codeContainer.querySelector("#createfile")) {
        return;
      }

      const createFileButton = document.createElement("button");
      createFileButton.textContent = "Create";
      createFileButton.id = "createfile";
      createFileButton.style.padding = "2px 10px";
      createFileButton.style.border = "none";
      createFileButton.style.borderRadius = "20px";
      createFileButton.style.color = "#fff";
      createFileButton.style.backgroundColor = "#28a745";
      createFileButton.style.fontWeight = "300";
      createFileButton.addEventListener("click", async () => {
        const codeType = codeContainer.querySelector(domClass.codeType);
        let typeLists = '{ "codes" : [' +
            '{"lang": "java", "suffix": ".java"},' + 
            '{"lang": "javascript", "suffix": ".js"},' +
            '{"lang": "css", "suffix": ".css"},' +
            '{"lang": "python", "suffix": ".py"},' +
            '{"lang": "cpp", "suffix": ".cpp"},' +
            '{"lang": "c", "suffix": ".c"},' +
            '{"lang": "go", "suffix": ".go"},' +
            '{"lang": "html", "suffix": ".html"},' +
            '{"lang": "rust", "suffix": ".rs"},' +
            '{"lang": "php", "suffix": ".php"},' +
            '{"lang": "shell", "suffix": ".sh"},' +
            '{"lang": "mysql", "suffix": ".sql"},' +
            '{"lang": "c#", "suffix": ".cs"},' + 
            '{"lang": "json", "suffix": ".json"},' +
            '{"lang": "properties", "suffix": ".properties"},' + 
            '{"lang": "ini", "suffix": ".ini"},' + 
            '{"lang": "xml", "suffix": ".xml"},' + 
            '{"lang": "kotlin ", "suffix": ".kt"},' + 
            '{"lang": "swift", "suffix": ".swift"},' + 
            '{"lang": "jsp", "suffix": ".jsp"},' + 
            '{"lang": "R", "suffix": ".R"}]}';

        types = JSON.parse(typeLists);
        let type = '.txt';
        let typeFound = false;
        if (codeType) {
          for (let i = 0; i < types.codes.length; i++) {
            if (codeType.textContent.trim() === types.codes[i].lang) {
              type = types.codes[i].suffix;
              typeFound = true;
              break;
            }
          }
        }

        if (!typeFound) {
          for (let i = 0; i < types.codes.length; i++) {
            if (codeType.textContent.trim() === types.codes[i].suffix.substr(1)) {
              type = types.codes[i].suffix;
              break;
            }
          }
        }
        
        const filename = `new${type}`;

        const parentDiv = codeContainer.parentElement;
        const codeContent = parentDiv.querySelector(domClass.code).textContent;

        const blob = new Blob([codeContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      });

      createFileButton.style.marginRight = "220px";

      codeContainer.insertAdjacentElement("afterbegin", createFileButton);
    });
  }


  new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        let domClass = getCodeBlockByAIType();
        if ( node.nodeType === Node.ELEMENT_NODE && node.matches(domClass.codeBlock)) {
          createCodeFile();
        }

        if (node.nodeType === Node.ELEMENT_NODE && node.matches('[class="group w-full text-token-text-primary border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800"]')) {
          console.log('init dom#########');
          initTimerDom();
        }

        // Monitor for the dynamically appearing button
        if (node.nodeType === Node.ELEMENT_NODE && node.matches('[class="text-center mt-2 flex justify-center"]')) {
          const saveSButton = document.querySelector('[class="btn relative btn-primary mr-2"]');
          console.log("Added element:", node);
          if (!saveSButton.myEventListener) { // Check if the event is already added
            saveSButton.addEventListener('click', handleEvent);
            saveSButton.myEventListener = true; // Flag that the event listener is added
          }
        }
      });
    });
  }).observe(document.body, { childList: true, subtree: true });


  function getCurrentUrl() {
    let currentUrl = window.location.href;
    console.log("currentUrl: " + currentUrl);
    return currentUrl;
  }


  function getCodeBlockByAIType() {
    let currentUrl = window.location.href;

    let regExOpenAI = /^https:\/\/chat\.openai\.com\//;
    let regExClaude = /^https:\/\/claude\.ai\/chat\//;

    if (regExOpenAI.test(currentUrl)) {
      let domClass = {
        codeBlock: '.flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md',
        codeType: '.flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md span',
        code: '.p-4.overflow-y-auto code'
      };

      return domClass;
    }

    if (regExClaude.test(currentUrl)) {
      let domClass = {
        codeBlock: '.flex.justify-between.items-center.pt-1.pl-3',
        codeType: '.text-\\[11px\\].text-stone-300',
        code: 'code'
      };

      return domClass;
    }
  }


  function initTimerDom() {
    const countID4 = document.getElementById('modelGPT-4');
    const countID3 = document.getElementById('modelGPT-3');
    if (countID4 || countID3) {
        return;
    }
    const divElement = document.querySelector('.flex.flex-1.flex-grow.items-center.gap-1.p-1.text-gray-600.dark\\:text-gray-200.sm\\:justify-center.sm\\:p-0');
    if (divElement) {
      const textNode = document.createTextNode("Total Messages Sent: ");
      const spanElement = document.createElement("span");
      
      let messageCount = 0;
      const modelType = divElement.textContent.substring(0, 32);
      if (modelType === 'GPT-4Custom instructions details') {
        if (countID4) {
          return;
        }

        spanElement.id = "modelGPT-4";
        messageCount = localStorage.getItem('modelGPT-4') || 0;
      } else {
        if (countID3) {
          return;
        }

        spanElement.id = "modelGPT-3";
        messageCount = localStorage.getItem('modelGPT-3') || 0;
      }
      spanElement.textContent = messageCount;

      divElement.appendChild(textNode);
      divElement.appendChild(spanElement);
    }
  }

  const submitButtonClass = '[class="absolute p-1 rounded-md md:bottom-3 md:p-2 md:right-3 dark:hover:bg-gray-900 dark:disabled:hover:bg-transparent right-2 disabled:text-gray-400 enabled:bg-brand-purple text-white bottom-1.5 transition-colors disabled:opacity-40"]';
  // Initialize flags and counters
  let timerStarted = { 'GPT-3': false, 'GPT-4': false };
  let timers = {};

  // Event Listeners
  addEventListenerById('click', submitButtonClass, handleEvent);
  let textarea = document.getElementById("prompt-textarea");
  // Event listener for keyboard's Enter key
  if (textarea) {
    textarea.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleEvent();
      }
    }, {capture: true});
  }

  function addEventListenerById(eventType, selector, callback) {
    let element = document.querySelector(selector);
    if (element && !element.myEventListener) {
      console.log('Click: ' + element.textContent);
      element.addEventListener(eventType, callback);
      element.myEventListener = true;
    }
  }

  function handleEvent() {
    const modelType = getModelType();
    if (!modelType) return;

    if (!timerStarted[modelType]) {
      startTimer(modelType);
    }

    const messageCount = incrementMessageCount(modelType);
    updateMessageCountDisplay(messageCount, modelType);
  }

  function getModelType() {
    const divElement = document.querySelector('.flex.flex-1.flex-grow.items-center.gap-1.p-1.text-gray-600.dark\\:text-gray-200.sm\\:justify-center.sm\\:p-0');
    const modelTypeName = divElement.textContent.substring(0, 32);
    return modelTypeName === 'GPT-4Custom instructions details' ? 'GPT-4' : 'GPT-3';
  }

  function startTimer(modelType) {
    timerStarted[modelType] = true;

    const time = modelType === 'GPT-3' ? getTimeUntilMidnight() : 3 * 60 * 60 * 1000;
    
    timers[modelType] = setTimeout(() => {
      resetMessageCount(modelType);
    }, time);
  }

  function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight - now;
  }

  function incrementMessageCount(modelType) {
    let count = parseInt(localStorage.getItem(`model${modelType}`) || 0);
    count++;
    localStorage.setItem(`model${modelType}`, count);
    return count;
  }

  function updateMessageCountDisplay(count, modelType) {
    const countElement = document.getElementById(`model${modelType}`);
    if (countElement) {
      countElement.textContent = count;
    }
  }

  function resetMessageCount(modelType) {
    localStorage.setItem(`model${modelType}`, 0);
    updateMessageCountDisplay(0, modelType);
    timerStarted[modelType] = false;
  }


  // const observerCallback = (mutationsList, observer) => {
  //   for (const mutation of mutationsList) {
  //     if (mutation.type === 'childList') {
  //       // Loop through all added nodes
  //       for (const addedNode of mutation.addedNodes) {
  //         if (addedNode.nodeType === Node.ELEMENT_NODE) {  // Filter out non-element nodes
  //           console.log("Added element:", addedNode);
  //         }
  //       }
  //     }
  //   }
  // };

  // // Create a new observer instance with the callback
  // const observer = new MutationObserver(observerCallback);

  // // Options for the observer (which mutations to observe)
  // const config = { childList: true, subtree: true };

  // // Start observing a particular target node (in this case, the whole body)
  // observer.observe(document.body, config);


}


if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initExecute();
} else {
  document.addEventListener('DOMContentLoaded', initExecute);
}