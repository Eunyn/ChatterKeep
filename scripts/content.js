async function createButton(targetElement) {
  if (targetElement.querySelector("#saveConversation")) {
    return;
  }

  const divElement = document.createElement('div');
  divElement.classList.add('saveConversation');
  divElement.id = 'saveConversation';
  divElement.style.display = 'flex';
  divElement.style.gap = '10px';

  // Create the three buttons
  const pdfButton = document.createElement('button');
  pdfButton.id = 'pdfButton';
  pdfButton.textContent = 'pdf';
  pdfButton.style.color = 'blue';
  pdfButton.addEventListener('click', saveQAndAAsPDF);

  const markdownButton = document.createElement('button');
  markdownButton.id = 'markdownButton';
  markdownButton.textContent = 'markdown';
  markdownButton.style.color = 'blue';
  markdownButton.addEventListener('click', saveQAndAAsMarkdown);

  const textButton = document.createElement('button');
  textButton.id = 'textButton';
  textButton.textContent = 'text';
  textButton.style.color = 'blue';
  textButton.addEventListener('click', saveQAndAAsText);

  const uploadButton = document.createElement('button');
  uploadButton.id = 'uploadButton';
  uploadButton.textContent = 'upload';
  uploadButton.style.color = 'blue';
  uploadButton.addEventListener('click', uploadFile);

  // Append the buttons to the div element
  divElement.appendChild(pdfButton);
  divElement.appendChild(markdownButton);
  divElement.appendChild(textButton);
  divElement.appendChild(uploadButton);

  //  Insert the div element above the target element
  if (targetElement) {
    targetElement.parentNode.insertBefore(divElement, targetElement);
  }
};

let fileName = 'conversation';
function getCurrentConversationName() {
  const currentConversationName = document.querySelector('[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-[4.5rem] )} )} bg-gray-800 hover:bg-gray-800 group"]');
  if (currentConversationName) {
    fileName = currentConversationName.textContent;
  }
}
getCurrentConversationName();

async function saveQAndAAsPDF() {
  // Create a new jsPDF instance
  const doc = new window.jspdf.jsPDF();
  const fontPath = './fonts/simsunb.ttf';
  // Register the font with jsPDF
  doc.addFileToVFS(fontPath, font);
  doc.addFont(fontPath, 'simsunb', 'normal');
  doc.setFont('simsunb');

  const questionElements = document.querySelectorAll('.group.w-full.text-gray-800.dark\\:text-gray-100.border-b.border-black\\/10.dark\\:border-gray-900\\/50.dark\\:bg-gray-800');
  const answerElements = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.light');

  let y = 10;

  for (let i = 0; i < questionElements.length; i++) {
    const question = questionElements[i].textContent.trim();
    const answer = answerElements[i].textContent.trim();

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


async function saveQAndAAsMarkdown() {
  const questionElements = document.querySelectorAll('.group.w-full.text-gray-800.dark\\:text-gray-100.border-b.border-black\\/10.dark\\:border-gray-900\\/50.dark\\:bg-gray-800');
  const answerElements = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.light');
  let markdownContent = '';

  for (let i = 0; i < questionElements.length; i++) {
    const question = questionElements[i].textContent.trim();
    const answer = answerElements[i].textContent.trim();

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


async function saveQAndAAsText() {
  const questionElements = document.querySelectorAll('.group.w-full.text-gray-800.dark\\:text-gray-100.border-b.border-black\\/10.dark\\:border-gray-900\\/50.dark\\:bg-gray-800');
  const answerElements = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.light');
  let textContent = '';

  for (let i = 0; i < questionElements.length; i++) {
    const question = questionElements[i].textContent;
    const answer = answerElements[i].textContent;

    const questionWithoutPageNumber = question.replace(/^\d+ \/ \d+/, '');
    textContent += `Q${i + 1}: ${questionWithoutPageNumber}\n`;
    textContent += `A: ${answer}\n\n`;
  }

  const link = document.createElement('a');
  link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(textContent)}`;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


async function uploadFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt, .js, .py, .html, .css, .json, .csv';

  input.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    const chunkSize = 15000;
    let offset = 0;
    let part = 1;

    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      const text = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(chunk);
      });

      await submitConversation(text, part, file.name);

      const numChunks = Math.ceil(file.size / chunkSize);

      let chatgptReady = false;
      while (!chatgptReady) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        chatgptReady = !document.querySelector('.text-2xl > span:not(.invisible)');
      }

      offset += chunkSize;
      part++;
    }
  });

    input.click();
}

async function submitConversation(text, part, filename) {
  const textarea = document.querySelector("textarea[tabindex='0']");
  const enterKeyEvent = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
  textarea.dispatchEvent(enterKeyEvent);
}


const addCreateFileButton = (codeContainer) => {
  // Check if the update button already exists in the container
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

  createFileButton.style.marginRight = "200px";

  codeContainer.insertAdjacentElement("afterbegin", createFileButton);
};

// Find and add update button to existing code containers
document
  .querySelectorAll(
    ".flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md"
  )
  .forEach(addCreateFileButton);

// Use a MutationObserver to listen for new code containers added to the page
const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.matches(
          ".flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md"
        )
      ) {
        addCreateFileButton(node);
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Check every 3 seconds
setInterval(() => {
  document
    .querySelectorAll(
      ".flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md"
    )
    .forEach(addCreateFileButton);

  const target = document.querySelector(".flex.flex-col.w-full.py-\\[10px\\].flex-grow.md\\:py-4.md\\:pl-4.relative.border.border-black\\/10.bg-white.dark\\:border-gray-900\\/50.dark\\:text-white.dark\\:bg-gray-700.rounded-xl.shadow-xs.dark\\:shadow-xs");
  const parentElements = document.querySelector(".relative.flex.h-full.flex-1.items-stretch.md\\:flex-col");
  const saveConversation = parentElements.querySelector('#pdfButton');
  if (!saveConversation) {
    getCurrentConversationName();
    createButton(target);
  }
}, 3000);