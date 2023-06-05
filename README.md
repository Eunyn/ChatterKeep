# ChatGPT File Plugin

The ChatGPT File Plugin is a browser plugin that adds functionality to the ChatGPT interface. It allows users to save conversations with ChatGPT in various formats and also provides the ability to upload files into the ChatGPT input box.

## Features

- Export conversations with ChatGPT in PDF, Markdown, and Text formats.
- Upload files into the ChatGPT input box for easy population of content.
- Supports the following file formats: `.txt`, `.js`, `.py`, `.html`, `.css`, `.json`, `.csv`.
- Divides large files into batches for importing.

## Installation

To use the ChatGPT File Plugin, follow these steps:

1. Clone the repository to your local machine:

   ```sh
   git clone git@github.com:Eunyn/chatgpt.git
   ```

2. Open your browser's extension management page.

3. Enable the developer mode.

4. Click on "Load unpacked" and select the cloned repository folder (`chatgpt`).

## Usage

Once the ChatGPT File Plugin is installed, you can use it with the ChatGPT interface. Here's how to use the different features:

1. Exporting Conversations:
   - Open the ChatGPT interface in your browser.
   - Start a conversation with ChatGPT.
   - Above the text input window, you will see four buttons: PDF, Markdown, Text, and Upload.
   - Click on the desired format button (PDF, Markdown, or Text) to save the conversation in the corresponding format to your local computer.
   - The file will be downloaded to your default download location.
2. Uploading Files:
   - To upload a file into the ChatGPT input box, make sure the file is in one of the supported formats: `.txt`, `.js`, `.py`, `.html`, `.css`, `.json`, `.csv`.
   - Click on the "Upload" button above the text input window.
   - Select the file you want to upload from your local computer.
   - The file will be parsed and its content will be populated into the ChatGPT input box.

Please note that for large files, the plugin will automatically divide them into batches for importing into ChatGPT.

## Contributing

Contributions to the ChatGPT File Exporter Plugin are welcome! If you find any issues or have suggestions for improvement, feel free to open an issue or submit a pull request. Contributions that enhance the functionality or usability of the plugin are especially appreciated.

## License

This project is licensed under the [MIT License](https://chat.openai.com/c/LICENSE).

