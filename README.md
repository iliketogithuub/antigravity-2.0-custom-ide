# 🌌 Antigravity 2.0 IDE: The Zero-Gravity AI Code Workspace

<div align="center">

[![Antigravity](https://img.shields.io/badge/Antigravity-2.0--IDE-blueviolet?style=for-the-badge&logo=spaceship)](https://github.com/antigravity-dev/antigravity-ide)
[![GitHub stars](https://img.shields.io/github/stars/antigravity-dev/antigravity-ide?style=for-the-badge&color=gold)](https://github.com/antigravity-dev/antigravity-ide)
[![Product Hunt](https://img.shields.io/badge/Product--Hunt-1--Product--of--the--Day-orange?style=for-the-badge)](https://producthunt.com/posts/antigravity-ide)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

**An ultra-premium, backdrop-blur, AI-native IDE designed specifically for compiling and deploying with the Antigravity 2.0 cancellation engine.**

[Demo Workspace](https://github.com/antigravity-dev/antigravity-ide) • [AI Copilot Spec](docs/copilot.md) • [Viral Launch Blueprint](docs/viral.md)

</div>

---

## ✨ Features

- 🌌 **Glassmorphic Cosmic Design**: Backdrop blurs, smooth neon gradients (violet, pink, cyan), and responsive space themes.
- ⚡ **Monaco Editor Core**: Integrated with the same layout mechanics powering VS Code. Full autocomplete, code diagnostics, and tab management.
- 🤖 **Zero-G AI Co-pilot**: Powered by an offline simulated Gemini 3.5 context layer. Instantly optimize calculations, generate unit tests, and resolve boundaries.
- 🚀 **Simulated Terminal Matrix**: Fully functional local CLI supporting `ls`, `cat`, custom `git` staging pipelines, and `npm run dev` servers.
- 📈 **GitHub Virality Launchpad**: Built-in engagement accelerator! Launch modal tracks stars, visitor ticks, Product Hunt upvotes, and simulates live developer comments.

---

## 🚀 Quick Start

### 1. Serve Instantly (No compilation needed)
Since the workspace is built on lightweight, performant **Vanilla JS & CSS**, you can run it without heavy compilation. Just open `index.html` in your browser, or spin up a local server:

```bash
# Python 3
python3 -m http.server 8080

# Node.js
npx live-server
```

Open your browser to `http://localhost:8080` to experience the interface.

### 2. Run Compilation Commands (Via the in-app Terminal)
Open the bottom drawer in the IDE and try these interactive commands:

- `help` - Show all operations.
- `antigravity compile` - Compile code with high-orbit vector cancellation.
- `git status` / `git commit -m "feat"` - Stage modifications.
- `git push` - Upload repository changes and open the **Viral Star Booster Dashboard**.
- `npm run dev` - Fire up Vite hot reloader simulation.

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

## 🌌 Cosmic Color Tokens (CSS Variables)

Define custom dark or light modes using our HSL variables inside `style.css`:

```css
:root {
  --bg-primary: #0b0816;
  --violet: hsl(265, 85%, 63%);
  --pink: hsl(325, 90%, 60%);
  --cyan: hsl(188, 90%, 50%);
  --font-ui: 'Outfit', sans-serif;
}
```

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
