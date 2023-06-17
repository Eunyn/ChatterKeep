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

    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(markdownContent)}`;
    link.download = fileName + '.md';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(textContent)}`;
    link.download = fileName + '.txt';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }



  function uploadFile() {
    const upload = document.createElement('input');
    upload.type = 'file';
    upload.accept = '.txt, .js, .py, .html, .css, .json, .csv, .c, .cpp, .java, .go, .rs, .php, .sql';

    upload.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      const chunkSize = 10000;
      let offset = 0;
      let part = 1;

      while (offset < file.size) {
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

        // Make sure that ChatGPT has finished processing the previous request
        let chatgptReady = false;
        while (!chatgptReady) {
          await new Promise((resolve) => setTimeout(resolve, 8000));
          const submitButton = document.getElementById('prompt-textarea');
          if (submitButton) {
            chatgptReady = !submitButton.disabled;
          }
        }

        offset += chunkSize;
        part++;
      }

      const submit = document.getElementById('prompt-textarea');
      if (submit && submit.value) {
        submit.nextElementSibling.click();
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
    textarea.value = `Part ${part} of ${filename}:\n${text}`;
    textarea.dispatchEvent(inputEvent);
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