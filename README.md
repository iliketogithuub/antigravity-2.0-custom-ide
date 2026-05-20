# 🌌 Antigravity 2.0 IDE: The Zero-Gravity AI Code Workspace

<div align="center">

[![Antigravity](https://img.shields.io/badge/Antigravity-2.0--IDE-blueviolet?style=for-the-badge&logo=spaceship)](https://github.com/iliketogithuub/antigravity-2.0-custom-ide)
[![GitHub stars](https://img.shields.io/github/stars/iliketogithuub/antigravity-2.0-custom-ide?style=for-the-badge&color=gold)](https://github.com/iliketogithuub/antigravity-2.0-custom-ide)
[![Product Hunt](https://img.shields.io/badge/Product--Hunt-1--Product--of--the--Day-orange?style=for-the-badge)](https://github.com/iliketogithuub/antigravity-2.0-custom-ide)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](https://github.com/iliketogithuub/antigravity-2.0-custom-ide/blob/main/LICENSE)

**An ultra-premium, glassmorphic, AI-native IDE built with Gemini 3.5 Flash. Compiles code instantly, communicates with local hosts via WebSockets, and runs browser integrations to access external web assets.**

[Live Repository](https://github.com/iliketogithuub/antigravity-2.0-custom-ide) • [Gemini 3.5 Spec](#-built-with-gemini-35-flash) • [Backend Setup](#-backend-and-connected-terminal) • [Viral Toolkit](#-github-virality-booster)

</div>

---

## ⚡ Built with Gemini 3.5 Flash

This custom IDE was engineered entirely by **Antigravity 2.0** using Google DeepMind's **Gemini 3.5 Flash** model. By leveraging the model's ultra-fast context processing and highly efficient code generation, we built a fully functional IDE featuring:
1. A Monaco editor workspace.
2. A real-time local shell connection.
3. An HTTP-CORS bypass proxy.
4. Premium glassmorphic animations.
All of this is compiled into a lightweight, high-performance static workspace that runs with zero latency.

---

## ✨ Features

- 🌌 **Glassmorphic Cosmic Design**: Backdrop blurs, smooth neon HSL gradients (violet, pink, cyan), and responsive space themes.
- ⚡ **Monaco Editor Core**: Integrated with the same layout mechanics powering VS Code. Full autocomplete, code diagnostics, and tab management.
- 🤖 **Zero-G AI Co-pilot**: Powered by an offline simulated Gemini 3.5 context layer. Instantly optimize calculations, generate unit tests, and resolve boundaries.
- ⚡ **Interactive God Mode**: Unleash autonomous workspace modifications! When toggled ON, the AI copilot writes files directly to your local computer storage via backend WebSocket integrations.
- 🌐 **Split Live Browser View**: Open a fully functional web browser right next to your code editor. Powered by a CORS-free backend proxy mapping that dynamically rewrites relative assets to bypass cross-origin restrictions.
- 💻 **Real Local Terminal Integration**: Connects dynamically to your local PC terminal shell (`bash`) via WebSockets to execute real commands and return console stdout/stderr.
- 🚀 **GitHub Virality Launchpad**: Built-in engagement accelerator! Launch modal tracks stars, visitor ticks, Product Hunt upvotes, and simulates live developer comments.

---

## 🚀 Quick Start

### 1. Start the Connected Backend Server
The IDE includes a local Node.js server that handles the WebSocket shell execution and browser proxy requests.

```bash
# 1. Install dependencies
npm install

# 2. Start the local backend server
npm start
```
This runs the local backend server strictly on `http://127.0.0.1:8081` (secured for local-only traffic).

### 2. Open the IDE in Your Browser
Since the frontend is built on lightweight, performant **Vanilla JS & CSS**, you can run it without heavy compilation. Simply open `index.html` in your browser, or spin up a local server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx live-server --port=8080
```
Open your browser to `http://localhost:8080` to experience the connected interface. 
*The status indicator will automatically switch to **"Connected (Live Shell)"** as soon as it detects the running backend!*

---

## 🖥️ Connected Terminal Commands

Once your shell is connected, you can run normal shell commands directly from the IDE's bottom terminal. We have also added a custom web proxy hook:

- `browse <url>` - Type `browse news.ycombinator.com` or `browse github.com` to fetch the external page, extract headers, and display web layouts directly in your terminal without CORS errors!
- Run standard operations like `ls`, `pwd`, `git status`, or `npm test` directly from your browser-based workbench.

---

## 🛠️ App & Extension Integration

To run this IDE as a popup or extension:

### 1. Browser Extension Popup
Configure the `manifest.json` pointing to `index.html` to load the IDE directly from your browser toolbar:
```json
{
  "manifest_version": 3,
  "name": "Antigravity 2.0 Workspace",
  "version": "2.0.0",
  "action": {
    "default_popup": "index.html",
    "default_icon": "assets/icon.png"
  }
}
```

### 2. Standalone Desktop App (via Tauri or Electron)
Bundle the workspace into a hardware-accelerated desktop application:
```bash
npx tauri-app init
npm run tauri dev
```

---

## 📈 GitHub SEO & Virality Settings

To maximize organic search and discovery on GitHub:

1. **Repository Description**: Copy and paste this short description:
   > 🌌 An ultra-premium, glassmorphic, AI-native web IDE built with Gemini 3.5 Flash. Connected bash terminal, CORS-free web browsing proxy, Monaco Editor engine, and a viral star booster.
2. **Topics / Tags**: Add these topics to your repository to gain organic views:
   `gemini-3-5`, `ai-ide`, `web-ide`, `monaco-editor`, `websocket-terminal`, `glassmorphism`, `developer-tools`, `self-hosted`

---

## 🤝 Contributing
Contributions are what make the open-source community an amazing place to learn, inspire, and create.
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <p>Defy gravity. Code the stars. 🌠</p>
</div>
