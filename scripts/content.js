let buttonCreated = false;

function createButton() {
  const divElement = document.createElement('div');
  divElement.classList.add('saveConversation');
  divElement.style.display = 'flex';
  divElement.style.gap = '10px';

  // Create the three buttons
  const pdfButton = document.createElement('button');
  pdfButton.id = 'pdfButton';
  pdfButton.textContent = 'PDF';
  pdfButton.style.color = 'blue';
  // pdfButton.addEventListener('click', saveQAndAAsPDF);

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

  // Find the target element to insert the div element above
  const targetElement = document.querySelector('.flex.flex-col.w-full.py-\\[10px\\].flex-grow.md\\:py-4.md\\:pl-4.relative.border.border-black\\/10.bg-white.dark\\:border-gray-900\\/50.dark\\:text-white.dark\\:bg-gray-700.rounded-xl.shadow-xs.dark\\:shadow-xs');

  // Insert the div element above the target element
  if (targetElement) {
    targetElement.parentNode.insertBefore(divElement, targetElement);
  }

  buttonCreated = true;
};

document.addEventListener('mouseover', function() {
  if (!buttonCreated) {
    createButton();
  } else {
    // DOMContentLoaded has already fired, create the button immediately
    // document.addEventListener('DOMContentLoaded', saveQAndAAsText);
    // saveQAndAAsText();
  }
});


function saveQAndAAsPDF() {

}


function saveQAndAAsMarkdown() {
  const questionElements = document.querySelectorAll('.group.w-full.text-gray-800.dark\\:text-gray-100.border-b.border-black\\/10.dark\\:border-gray-900\\/50.dark\\:bg-gray-800');
  const answerElements = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.light');
  let markdownContent = '';

  for (let i = 0; i < questionElements.length; i++) {
    const question = questionElements[i].textContent.trim();
    const answer = answerElements[i].textContent.trim();

    const questionWithoutPageNumber = question.replace(/^\d+ \/ \d+/, '');
    markdownContent += `**Q${i + 1}:** ${questionWithoutPageNumber}\n\n`;
    markdownContent += '```html\n';
    markdownContent += `${answer}\n`;
    markdownContent += '```\n\n';
  }

  const fileName = 'converted_content.md';
  const link = document.createElement('a');
  link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(markdownContent)}`;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


function saveQAndAAsText() {
  const questionElements = document.querySelectorAll('.group.w-full.text-gray-800.dark\\:text-gray-100.border-b.border-black\\/10.dark\\:border-gray-900\\/50.dark\\:bg-gray-800');
  const answerElements = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.light');
  let textContent = '';

  for (let i = 0; i < questionElements.length; i++) {
    const question = questionElements[i].textContent;
    const answer = answerElements[i].textContent;

    textContent += `Q: ${question}\n`;
    textContent += `A: ${answer}\n\n`;
  }

  const link = document.createElement('a');
  link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(textContent)}`;
  const fileName = document.querySelectorAll('.flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative');
  link.download = 'Q&A';
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