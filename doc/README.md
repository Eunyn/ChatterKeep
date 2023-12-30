
# ChatterKeep — ChatGPT 扩展

ChatterKeep 是一个强大的 ChatGPT 扩展，借助 ChatterKeep，您可以方便地下载对话内容、保存生成的代码、上传大文件以及各种`Prompts`。[<img src="https://github.com/Eunyn/ChatterKeep/blob/main/image/main.png" alt="main" style="zoom:30%;" />](https://youtu.be/RrRpUIcM86s)

## 功能

- 以 `Markdown` 和`Text`格式导出与 ChatGPT 的对话。
- 将文件上传到 ChatGPT 输入框中，以便轻松填充内容。支持以下文件格式：`.txt`, `.pdf`, `.docx`, `.xlsx`,` .js`, `.py`, `.html`, `.css`, `.json`, `.c`, `.cpp`, `.java`, `.go`, `.rs`, `.php`, `.sql`。
- 允许您创建 ChatGPT 生成的代码文件。
- 提供一组预定义的`Prompt`提示，以增强与 ChatGPT 的交互。
- 以图形方式显示您的每日消息计数。

## 安装

要使用 ChatterKeep 插件，请按照以下步骤进行操作：

1. 将存储库克隆到本地计算机，或直接点击下载：

   ```
   git clone git@github.com:Eunyn/ChatterKeep.git
   ```

2. 打开您的浏览器的扩展管理页面。

3. 启用开发者模式。

4. 点击“加载已解压”并选择克隆的文件夹。

## 使用方法

安装了 ChatGPT 文件插件后，您可以在 ChatGPT 接口中使用它。以下是如何使用的方法：

1. 导出对话：
   - 在浏览器中打开 ChatGPT 接口。
   - 启动与 ChatGPT 的对话。
   - 在插件窗口上方，将看到三个按钮：Markdown、Text 和 Upload。
   - 单击所需格式的按钮（Markdown 或 Text）以将对话以相应的格式保存到本地计算机。
   - 文件将下载到默认的下载位置。
   
2. 上传文件：
   - 要将文件上传到 ChatGPT 输入框中，请确保文件属于支持的格式之一：`.txt`、`.js`、`.py`、`.html`、`.css`、`.json`、`.csv`。
   - 单击文本输入窗口上方的`Upload`按钮。
   - 从本地计算机中选择要上传的文件。
   - 文件将被解析，其内容将填充到 ChatGPT 输入框中。
   
3. `Prompt`提示：
   - 支持中英文`prompt`
   
     > 例如“`/linux`”，表示你需要英文`prompt`。
     >
     > 如“`#充当Linux客户端`”，表示你需要中文`prompt`。
   
   - 您可以使用键盘上的上箭头和下箭头键浏览提示列表。
   
   - 按下确认键（通常为 `Ente`r 键）选择并将该提示直接发送给 ChatGPT。
   
   - 也可以使用鼠标单击列表中的任何`prompt`。然后，完整的`prompt`将插入到输入框中。
   
   - 支持自定义添加和删除`Prompt`。

## 展示

- 导出对话：

  - 导出为 `Markdown `格式

    <img src="https://github.com/Eunyn/ChatterKeep/blob/main/image/markdown.png" alt="markdown" style="zoom:30%;" />

  - 导出为`Text`格式

    <img src="https://github.com/Eunyn/ChatterKeep/blob/main/image/text.png" alt="text" style="zoom:30%;" />

  - 导出代码

    <img src="https://github.com/Eunyn/ChatterKeep/blob/main/image/code.png" alt="code" style="zoom:30%;" />

- 上传文件：

  <img src="https://github.com/Eunyn/ChatterKeep/blob/main/image/upload.png" alt="upload" style="zoom:30%;" />

- `Prompt`：

  <img src="https://github.com/Eunyn/ChatterKeep/blob/main/image/prompts.png" alt="prompts" style="zoom:30%;" />
  
- Chart Show:

  

## 贡献

欢迎为 ChatterKeep 插件做出贡献！如果您发现任何问题或有改进建议，请随时打开问题或提交拉取请求。特别欢迎能够增强插件功能或可用性的贡献。

## 感谢

非常感谢[Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts) 和 [PlexPt/awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)。此插件提供的默认提示都来自于他们。

## 许可证

该项目基于 [MIT 许可证](https://chat.openai.com/c/LICENSE) 授权。
