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
  pdfButton.textContent = 'PDF';
  pdfButton.style.color = 'blue';
  pdfButton.addEventListener('click', saveQAndAAsPDF);

  const markdownButton = document.createElement('button');
  markdownButton.id = 'markdownButton';
  markdownButton.textContent = 'Markdown';
  markdownButton.style.color = 'blue';
  markdownButton.addEventListener('click', saveQAndAAsMarkdown);

  const textButton = document.createElement('button');
  textButton.id = 'textButton';
  textButton.textContent = 'Text';
  textButton.style.color = 'blue';
  textButton.addEventListener('click', saveQAndAAsText);

  const uploadButton = document.createElement('button');
  uploadButton.id = 'uploadButton';
  uploadButton.textContent = 'Upload';
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

setInterval(() => {
  const target = document.querySelector(".flex.flex-col.w-full.py-\\[10px\\].flex-grow.md\\:py-4.md\\:pl-4.relative.border.border-black\\/10.bg-white.dark\\:border-gray-900\\/50.dark\\:text-white.dark\\:bg-gray-700.rounded-xl.shadow-xs.dark\\:shadow-xs");
  const parentElements = document.querySelector(".relative.flex.h-full.flex-1.items-stretch.md\\:flex-col");
  const saveConversation = parentElements.querySelector('#pdfButton');
  if (!saveConversation) {
    createButton(target);
  }
}, 1000);


async function saveQAndAAsPDF() {
  // Create a new jsPDF instance
  const doc = new window.jspdf.jsPDF();
  const fontPath = './fonts/simhei.ttf';
  // Register the font with jsPDF
  doc.addFileToVFS(fontPath, font);
  doc.addFont(fontPath, 'simhei', 'normal');
  doc.setFont('simhei');

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
    console.log(`${questionsLines[0]}`);
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

  doc.save('conversation.pdf');
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

  const fileName = 'conversation.md';
  const link = document.createElement('a');
  link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(markdownContent)}`;
  link.download = fileName;
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
  const fileName = document.querySelectorAll('.flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative');
  link.download = 'conversation';
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


const addUpdateVscodeBtn = (codeContainer) => {
  // Check if the update button already exists in the container
  if (codeContainer.querySelector("#update-vscode-btn")) {
    return;
  }

  const updateVscodeBtn = document.createElement("button");
  updateVscodeBtn.textContent = "Create File";
  updateVscodeBtn.id = "update-vscode-btn";
  updateVscodeBtn.style.padding = "2px 10px";
  updateVscodeBtn.style.border = "none";
  updateVscodeBtn.style.borderRadius = "20px";
  updateVscodeBtn.style.color = "#fff";
  updateVscodeBtn.style.backgroundColor = "#28a745";
  updateVscodeBtn.style.fontWeight = "300";
  updateVscodeBtn.addEventListener("click", async () => {
    const codeBtn = codeContainer.querySelector(".flex.ml-auto.gap-2");
    if (codeBtn) {
      codeBtn.click();

      const langSpan = codeContainer.querySelector(
        ".flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md > span"
      );
      const lang = langSpan ? langSpan.textContent.trim() : "";
      let extension = ".txt";
      switch (lang.toLowerCase()) {
        case "javascript":
          extension = ".js";
          break;
        case "html":
          extension = ".html";
          break;
        case "css":
          extension = ".css";
          break;
        case "python":
          extension = ".py";
          break;
        case "Java":
          extension = ".java";
          break;
        case "C#":
          extension = ".cs";
          break;
        case "C++":
          extension = ".cpp";
          break;
        case "Ruby":
          extension = ".rb";
          break;
        case "Go":
          extension = ".go";
          break;
        case "Swift":
          extension = ".swift";
          break;
        case "SQL":
          extension = ".sql";
          break;
        // Add more cases for other languages as needed
      }
      const filename = `New${extension}`;
      const fileContent = await navigator.clipboard.readText();

      const blob = new Blob([fileContent], { type: "text/plain" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = filename;
      downloadLink.click();
    } else {
      console.log("Copy code button not found.");
    }
  });

  updateVscodeBtn.style.marginRight = "200px";

  codeContainer.insertAdjacentElement("afterbegin", updateVscodeBtn);
};

// Find and add update button to existing code containers
document
  .querySelectorAll(
    ".flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md"
  )
  .forEach(addUpdateVscodeBtn);

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
        addUpdateVscodeBtn(node);
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Check for button addition every 3 seconds
setInterval(() => {
  document
    .querySelectorAll(
      ".flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md"
    )
    .forEach(addUpdateVscodeBtn);
}, 3000);