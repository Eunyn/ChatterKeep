// content.js

function initExecute() {

  execute();

  function execute() {
    getCurrentConversationName();
    var questions = document.querySelectorAll('.group.w-full.text-gray-800.dark\\:text-gray-100.border-b.border-black\\/10.dark\\:border-gray-900\\/50.dark\\:bg-gray-800');
    var answers = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.light');

    setInterval(() => {
      getCurrentConversationName();
      questions = document.querySelectorAll('.group.w-full.text-gray-800.dark\\:text-gray-100.border-b.border-black\\/10.dark\\:border-gray-900\\/50.dark\\:bg-gray-800');
      answers = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.light');

      createCodeFile();
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
    const currentConversationName = document.querySelector('[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} bg-gray-800 hover:bg-gray-800 group"]');
    if (currentConversationName) {
      fileName = currentConversationName.textContent;
    }
  }


  function saveQAndAAsPDF(questions, answers) {
    // Create a new jsPDF instance
    const doc = new window.jspdf.jsPDF();
    const fontPath = './fonts/simhei.ttf';
    // Register the font with jsPDF
    doc.addFileToVFS(fontPath, font);
    doc.addFont(fontPath, 'simhei', 'normal');
    doc.setFont('simhei');

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
      const currentConversationName = document.querySelector('[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} bg-gray-800 hover:bg-gray-800 group"]');
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

  function splitHTMLByLength(text, length) {
    const parts = [];
    let temp = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      temp += char;

      if (temp.length >= length && (i === text.length - 1 || text[i + 1] === ' ')) {
        parts.push(temp);
        temp = '';
      }
    }

    if (temp.length > 0) {
      parts.push(temp);
    }

    return parts;
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
          const currentName = document.querySelector('[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} bg-gray-800 hover:bg-gray-800 group"]');
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

      // Split the HTML content by length
      const byteLength = 10000; // Define the desired byte length
      const pages = splitHTMLByLength(result, byteLength);

      for (let i = 0; i < pages.length; i++) {
        const currentName = document.querySelector('[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} bg-gray-800 hover:bg-gray-800 group"]');
        if (currentConversationName != currentName) {
          console.log('Conversation has been changed');
          break;
        }

        const pageContent = pages[i].replace(/\n/g, ' '); // Replace line breaks with spaces
        const pageNumber = i + 1;

        await submitConversation(pageContent, pageNumber, file.name);

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

      // If you want to read the first sheet into an array of arrays
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

      const chunkSize = 5;
      // Function to split array into chunks
      function chunkArray(myArray, chunk_size){
        let results = [];
        while (myArray.length) {
          results.push(myArray.splice(0, chunk_size));
        }
        return results;
      }

      // Split jsonData into chunks
      let chunks = chunkArray(jsonData, chunkSize);
      // console.log('length: ' + chunks.length);
      // console.log('chunks[0]: ' + chunks[0]);
      for(let i = 0; i < chunks.length; i++) {
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
    };

    reader.readAsArrayBuffer(file);
  }


  async function uploadPlainTextFile(file, reader, currentConversationName) {
    const chunkSize = 10000;
    let offset = 0;
    let part = 1;

    while (offset < file.size) {
      const currentName = document.querySelector('[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} bg-gray-800 hover:bg-gray-800 group"]');
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
    const codeLists = document.querySelectorAll(".flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md");
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
        const codeType = codeContainer.querySelector('.flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md span');
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
            '{"lang": "c#", "suffix": ".cs"}]}';

        types = JSON.parse(typeLists);
        let type = '.txt';
        if (codeType) {
          for (let i = 0; i < types.codes.length; i++) {
            if (codeType.textContent.trim() === types.codes[i].lang) {
              type = types.codes[i].suffix;
              break;
            }
          }
        }
        
        const filename = `new${type}`;

        const parentDiv = codeContainer.parentElement;
        const codeContent = parentDiv.querySelector('.p-4.overflow-y-auto code').textContent;

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
        if ( node.nodeType === Node.ELEMENT_NODE && node.matches(".flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md")) {
          createCodeFile();
        }
      });
    });
  }).observe(document.body, { childList: true, subtree: true });




}


if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initExecute();
} else {
  document.addEventListener('DOMContentLoaded', initExecute);
}