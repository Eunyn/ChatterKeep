// implements the prompts hints when input something.

function initPrompt() {
    if (window.formInterval) {
        clearInterval(window.formInterval);
    }

    let selectedIndex = -1;

    window.formInterval = setInterval(()=>{
        const form = document.querySelector('form textarea');
        if (!form)
            return;

        clearInterval(window.formInterval);
        promptsPrompt();

        new MutationObserver((mutationsList)=>{
            for (const mutation of mutationsList) {
                if (mutation.target.getAttribute('id') === 'prompt-textarea') {
                    initPromptDOM();
                    selectedIndex = -1;
                    promptsPrompt();
                }
            }
        }
        ).observe(document.body, {
            childList: true,
            subtree: true,
        });

    }
    , 300);

    async function promptsPrompt() {
        initPromptDOM();
        const promptTextarea = document.getElementById('prompt-textarea');
        if (promptTextarea == null) {
            return
        }
        let targetElement = promptTextarea.parentNode.parentNode;
        let promptsElement = document.getElementById('suggestionBox');
        if (!promptsElement) {
            let promptsElement = document.createElement('div');
            promptsElement.id = 'suggestionBox';
            promptsElement.style.top = '100%';
            promptsElement.style.left = '0';
            promptsElement.style.width = '350px';
            promptsElement.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            promptsElement.style.color = '#F0F0F0';
            promptsElement.style.fontFamily = 'Times New Roman';
            promptsElement.style.border = '1px solid #ccc';
            promptsElement.style.maxHeight = '200px';
            promptsElement.style.overflowY = 'auto';
            promptsElement.style.padding = '4px';
            promptsElement.style.marginRight = '340px';
            promptsElement.style.display = 'none';

            //  Insert the div element above the target element
            if (targetElement) {
                targetElement.parentNode.insertBefore(promptsElement, targetElement);
            }

            promptsElement = document.getElementById('suggestionBox');
        }

        function promptsShow() {
            let promptsElement = document.getElementById('suggestionBox');
            if (promptsElement) {

                const input = promptTextarea.value.toLowerCase();
                const promptLists = getPromptType(input);
                const shortlistItems = promptLists.map(item=>item.cmd);

                let matchingItems = '';

                if (input.startsWith('#')) {
                    matchingItems = shortlistItems.filter(item=>item.startsWith(input));
                } else {
                    matchingItems = shortlistItems.filter(item=>item.toLowerCase().startsWith(input));
                }

                if (input && matchingItems.length > 0) {
                    promptsElement.innerHTML = '';
                    matchingItems.forEach(item=>{
                        const suggestionItem = document.createElement('div');
                        suggestionItem.classList.add('suggestion-item');
                        suggestionItem.textContent = item;
                        suggestionItem.style.cursor = 'pointer';
                        suggestionItem.style.padding = '4px';

                        const selected = promptLists.find(items=>items.cmd === item);

                        suggestionItem.setAttribute('title', selected.prompt);

                        suggestionItem.addEventListener('click', ()=>{
                            promptTextarea.value = item;

                            const input = promptTextarea.value.toLowerCase();
                            const selectedItem = promptLists.find(item=>item.cmd === input);
                            if (selectedItem) {
                                promptTextarea.value = selectedItem.prompt;
                                promptsElement.style.display = 'none';
                            }
                        }
                        );

                        promptsElement.appendChild(suggestionItem);
                    }
                    );

                    const inputRect = promptTextarea.getBoundingClientRect();
                    promptsElement.style.top = `${inputRect.bottom}px`;
                    promptsElement.style.display = 'block';
                } else {
                    promptsElement.style.display = 'none';
                }
            }
        }

        if (promptTextarea) {
            if (promptTextarea.value.startsWith("/") || promptTextarea.value.startsWith("#")) {
                promptTextarea.removeEventListener('input', promptsShow);
                promptTextarea.addEventListener('input', promptsShow);
            } else {
                console.log('Not StartsWith \'\/\' || \'\#\'');
            }
        }

        function getPromptType(input) {
            let prompt = '';
            if (input.startsWith('#')) {
                prompt = localStorage.getItem('prompts-zh');
                if (!prompt) {
                    prompt = jsonDataZh;
                } else {
                    prompt = JSON.parse(prompt);
                }
            } else {
                prompt = localStorage.getItem('prompts-eng');
                if (!prompt) {
                    prompt = jsonData;
                } else {
                    prompt = JSON.parse(prompt);
                }
            }

            return prompt;
        }

        function keyDown(event) {
            if (!promptTextarea.value.startsWith("/") && !promptTextarea.value.startsWith("#")) {
                return;
            }

            let promptsElement = document.getElementById('suggestionBox');
            if (promptsElement) {
                const suggestionItems = Array.from(promptsElement.getElementsByClassName('suggestion-item'));
                const suggestionItemCount = suggestionItems.length;

                if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    selectedIndex = (selectedIndex - 1 + suggestionItemCount) % suggestionItemCount;
                } else if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    selectedIndex = (selectedIndex + 1) % suggestionItemCount;
                }

                suggestionItems.forEach((item,index)=>{
                    if (index === selectedIndex) {
                        item.classList.add('selected');
                        promptTextarea.value = item.textContent;
                    } else {
                        item.classList.remove('selected');
                    }
                }
                );

                if (event.key === 'Enter') {
                    const input = promptTextarea.value.toLowerCase();
                    const promptLists = getPromptType(input);

                    const selectedItem = promptLists.find(item=>item.cmd === input);
                    if (selectedItem) {
                        promptTextarea.value = selectedItem.prompt;
                        promptsElement.style.display = 'none';
                    }
                }
            }

            if (event.key === 'Delete') {
                event.stopPropagation();
                promptTextarea.value = '';
                selectedIndex = -1;

                const divToDelete = document.querySelectorAll('.suggestion-item');
                divToDelete.forEach(div=>{
                    div.textContent = '';
                    div.remove();
                }
                );
            }
        }

        promptTextarea.addEventListener('keydown', keyDown, {
            capture: true
        });
    }

    function initPromptDOM() {
        const promptDom = document.querySelector('.suggestionBox');
        if (promptDom) {
            promptDom.innerHTML = '';
        }
    }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initPrompt();
} else {
    document.addEventListener('DOMContentLoaded', initPrompt);
}
