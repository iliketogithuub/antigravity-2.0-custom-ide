// Antigravity 2.0 IDE Core Application Logic

// Mock File System State
const files = {
  'README.md': {
    name: 'README.md',
    path: 'README.md',
    type: 'file',
    icon: 'file-text',
    language: 'markdown',
    content: `# 🌌 Antigravity 2.0 IDE

Welcome to the future of AI-native code workspaces. This environment is custom-tailored for building high-performance applications with zero compile lag, zero-G layouts, and full developer support.

## Key Features
- **Monaco Engine**: Powered by VS Code's editor core.
- **Glassmorphic UI**: Cosmic backdrop-blur interface.
- **Viral Launch Center**: Click to create excitement and stars on GitHub!
- **Zero-G AI Assistant**: Built-in Gemini 3.5 LLM context engine.

*Defy gravity, deploy code.*`
  },
  'index.js': {
    name: 'index.js',
    path: 'index.js',
    type: 'file',
    icon: 'file-code-2',
    language: 'javascript',
    content: `// Antigravity 2.0 Core Bootloader
const { AntigravityServer } = require('antigravity-core');
const physics = require('./physics-engine');

const app = new AntigravityServer({
  port: 8080,
  zeroG: true,
  copilotMode: 'high-orbit'
});

// Calculate levitation coefficient
app.get('/compute-lift', (req, res) => {
  const mass = parseFloat(req.query.mass || 100);
  const lift = physics.calculateLift(mass);
  res.json({
    status: "hovering",
    netForceFactor: lift.netForce,
    floatingHeightMeters: lift.altitude
  });
});

app.start(() => {
  console.log("🌌 Antigravity Server floating gracefully at http://localhost:8080");
});`
  },
  'physics-engine.js': {
    name: 'physics-engine.js',
    path: 'physics-engine.js',
    type: 'file',
    icon: 'file-code-2',
    language: 'javascript',
    content: `/**
 * Antigravity calculation matrix
 * Defies standard relativity constraints
 */
exports.calculateLift = function(mass) {
  const G = 9.80665; // standard gravity
  const antiFieldConstant = 1.054e-34; // custom quantum constant
  
  // Calculate cancellation force
  const targetCancellation = mass * G;
  const variance = Math.random() * 0.05; // 5% solar flare variance
  
  return {
    netForce: (targetCancellation * (1 + variance)).toFixed(4),
    altitude: (mass * antiFieldConstant * 1e36).toFixed(2),
    equilibriumReached: true
  };
};`
  },
  'package.json': {
    name: 'package.json',
    path: 'package.json',
    type: 'file',
    icon: 'braces',
    language: 'json',
    content: `{
  "name": "antigravity-zero-g",
  "version": "2.0.0",
  "description": "Viral launchpad coding kit for Antigravity engine",
  "main": "index.js",
  "dependencies": {
    "antigravity-core": "^2.0.1",
    "canvas-confetti": "^1.6.0"
  },
  "devDependencies": {
    "vite": "^4.4.5"
  },
  "scripts": {
    "dev": "vite",
    "compile": "antigravity-compiler index.js"
  }
}`
  }
};

let activeFile = 'README.md';
let editor = null;
let currentTheme = 'theme-space-dark';
let socket = null;
let isBackendConnected = false;

// Git Status Tracker
let modifiedFiles = new Set(['index.js', 'physics-engine.js']);



// Terminal History
let termHistory = [];
let termHistoryIndex = -1;

// 1. Monaco Editor Initialization
function initMonaco() {
  require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.43.0/min/vs' } });
  require(['vs/editor/editor.main'], function () {
    // Hide loading screen
    document.getElementById('editor-loading').style.display = 'none';
    
    // Define sleek custom theme
    monaco.editor.defineTheme('antigravity-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000', // Inherit the glassmorphic backdrop
        'editorCursor.foreground': '#00f0ff', // Cyberpunk cyan sleek cursor
        'editor.lineHighlightBackground': '#ffffff08',
        'editor.selectionBackground': '#9b5de540',
        'editorIndentGuide.background': '#ffffff10',
        'editorIndentGuide.activeBackground': '#00f0ff50'
      }
    });

    // Create editor instance
    editor = monaco.editor.create(document.getElementById('editor-container'), {
      value: files[activeFile].content,
      language: files[activeFile].language,
      theme: 'antigravity-dark',
      automaticLayout: true,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
      fontSize: parseInt(document.getElementById('setting-font-size').value) || 14,
      minimap: { enabled: true },
      padding: { top: 12 },
      cursorSmoothCaretAnimation: 'on',
      cursorBlinking: 'smooth',
      cursorStyle: 'line',
      cursorWidth: 3,
      smoothScrolling: true,
      fontLigatures: true,
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
        useShadows: false
      }
    });

    // Save modifications to state
    editor.onDidChangeModelContent(() => {
      files[activeFile].content = editor.getValue();
      if (!modifiedFiles.has(activeFile)) {
        modifiedFiles.add(activeFile);
        updateGitPanel();
      }
    });
  });
}

// 2. Navigation Panel Toggle
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-panel]');
  const sidebar = document.getElementById('sidebar-panel');
  const panelContents = document.querySelectorAll('.panel-content');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const panelId = `panel-${item.dataset.panel}`;
      const isActive = item.classList.contains('active');
      
      // Remove all active states
      navItems.forEach(n => n.classList.remove('active'));
      // Remove any indicator spans
      const indicators = document.querySelectorAll('.active-indicator');
      indicators.forEach(ind => ind.remove());

      if (isActive && !sidebar.classList.contains('collapsed')) {
        // Collapse sidebar if active is clicked again
        sidebar.classList.add('collapsed');
      } else {
        sidebar.classList.remove('collapsed');
        item.classList.add('active');
        // Add indicator span
        const ind = document.createElement('span');
        ind.className = 'active-indicator';
        item.appendChild(ind);
        
        panelContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === panelId) {
            content.classList.add('active');
          }
        });
      }
      
      // Trigger editor layout recalculation if it exists
      if (editor) {
        setTimeout(() => editor.layout(), 300);
      }
    });
  });
}

// 3. File Explorer Rendering & Handling
function renderExplorer() {
  const treeContainer = document.getElementById('explorer-tree');
  treeContainer.innerHTML = '';

  // Create Workspace Folder Node
  const workspaceRoot = document.createElement('div');
  workspaceRoot.className = 'tree-item tree-folder';
  workspaceRoot.innerHTML = `<i data-lucide="folder-open"></i> <span>antigravity-project</span>`;
  treeContainer.appendChild(workspaceRoot);

  // Render Files
  Object.keys(files).forEach(fileName => {
    const file = files[fileName];
    const item = document.createElement('div');
    item.className = `tree-item file tree-file ${fileName === activeFile ? 'active' : ''}`;
    item.innerHTML = `<i data-lucide="${file.icon || 'file'}"></i> <span>${fileName}</span>`;
    
    item.addEventListener('click', () => {
      switchToFile(fileName);
    });

    treeContainer.appendChild(item);
  });
  
  lucide.createIcons();
}

function switchToFile(fileName) {
  if (!files[fileName]) return;
  activeFile = fileName;
  
  if (editor) {
    const model = monaco.editor.createModel(files[fileName].content, files[fileName].language);
    editor.setModel(model);
    
    // Save edit changes back
    let saveTimeout;
    editor.onDidChangeModelContent(() => {
      files[activeFile].content = editor.getValue();
      if (!modifiedFiles.has(activeFile)) {
        modifiedFiles.add(activeFile);
        updateGitPanel();
      }
      
      // Auto-save to local disk if a native file handle exists
      const currentFile = files[activeFile];
      if (currentFile && currentFile.fileHandle) {
         clearTimeout(saveTimeout);
         saveTimeout = setTimeout(async () => {
           try {
             const writable = await currentFile.fileHandle.createWritable();
             await writable.write(currentFile.content);
             await writable.close();
           } catch (e) {
             console.error('Auto-save to disk failed', e);
           }
         }, 1000); // 1s debounce to avoid thrashing
      }
    });
  }

  // Update tabs visual state
  renderTabs();
  renderExplorer();
}

function renderTabs() {
  const tabContainer = document.getElementById('editor-tab-bar');
  tabContainer.innerHTML = '';

  Object.keys(files).forEach(fileName => {
    const file = files[fileName];
    const tab = document.createElement('div');
    tab.className = `tab ${fileName === activeFile ? 'active' : ''}`;
    tab.innerHTML = `
      <i data-lucide="${file.icon || 'file'}" class="tab-icon"></i>
      <span>${fileName}</span>
      <i data-lucide="x" class="close-tab"></i>
    `;
    
    tab.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-tab') || e.target.parentElement.classList.contains('close-tab')) {
        e.stopPropagation();
        deleteFile(fileName);
      } else {
        switchToFile(fileName);
      }
    });

    tabContainer.appendChild(tab);
  });
  lucide.createIcons();
}

function deleteFile(fileName) {
  if (Object.keys(files).length <= 1) {
    showToast('Cannot delete the only file in the workspace!', 'info');
    return;
  }
  delete files[fileName];
  modifiedFiles.delete(fileName);
  
  if (activeFile === fileName) {
    activeFile = Object.keys(files)[0];
  }
  
  switchToFile(activeFile);
  updateGitPanel();
  showToast(`Deleted ${fileName} from workspace.`, 'info');
}

// Create New File Dialog via Native OS Picker
document.getElementById('new-file-btn').addEventListener('click', async () => {
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: 'untitled.js',
      types: [{
        description: 'Text Files',
        accept: {'text/plain': ['.js', '.html', '.css', '.md', '.json', '.txt', '.ts']}
      }]
    });
    
    // Create an empty file on disk
    const writable = await fileHandle.createWritable();
    await writable.write(`// New file: ${fileHandle.name}\n`);
    await writable.close();
    
    // Add to IDE virtual filesystem
    const fileName = fileHandle.name;
    let ext = fileName.split('.').pop().toLowerCase();
    let lang = 'javascript';
    let icon = 'file-code-2';

    if (ext === 'md') { lang = 'markdown'; icon = 'file-text'; }
    else if (ext === 'json') { lang = 'json'; icon = 'braces'; }
    else if (ext === 'css') { lang = 'css'; icon = 'file-type-2'; }
    else if (ext === 'html') { lang = 'html'; icon = 'file-code'; }
    else if (ext === 'ts') { lang = 'typescript'; icon = 'file-code-2'; }

    files[fileName] = {
      name: fileName,
      path: fileName,
      type: 'file',
      icon: icon,
      language: lang,
      content: `// New file: ${fileName}\n`,
      fileHandle: fileHandle
    };

    modifiedFiles.add(fileName);
    switchToFile(fileName);
    updateGitPanel();
    showToast(`Saved ${fileName} to disk.`, 'success');
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err);
      showToast("Failed to create native file", "error");
    }
  }
});

// Open Local Folder / Workspace Mount
document.getElementById('new-folder-btn').addEventListener('click', async () => {
  try {
    const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    
    // Clear existing mock files
    for (let key in files) delete files[key];
    modifiedFiles.clear();
    
    // Function to recursively read directory
    async function readDir(dirHandle, path = '') {
      for await (const entry of dirHandle.values()) {
        const entryPath = path ? `${path}/${entry.name}` : entry.name;
        if (entry.kind === 'file') {
          try {
            const file = await entry.getFile();
            const content = await file.text();
            let ext = entry.name.split('.').pop().toLowerCase();
            let lang = 'javascript';
            let icon = 'file-code-2';
            
            if (ext === 'md') { lang = 'markdown'; icon = 'file-text'; }
            else if (ext === 'json') { lang = 'json'; icon = 'braces'; }
            else if (ext === 'css') { lang = 'css'; icon = 'file-type-2'; }
            else if (ext === 'html') { lang = 'html'; icon = 'file-code'; }
            
            files[entryPath] = {
              name: entry.name,
              path: entryPath,
              type: 'file',
              icon: icon,
              language: lang,
              content: content,
              fileHandle: entry
            };
          } catch(e) {
            console.warn("Skipped unreadable file:", entry.name);
          }
        } else if (entry.kind === 'directory') {
          // Ignore heavy vendor directories
          if (entry.name !== 'node_modules' && entry.name !== '.git') {
            await readDir(entry, entryPath);
          }
        }
      }
    }
    
    showToast(`Loading workspace from ${dirHandle.name}...`, 'info');
    await readDir(dirHandle);
    
    renderExplorer();
    const firstFile = Object.keys(files)[0];
    if (firstFile) switchToFile(firstFile);
    
    document.querySelector('.tree-folder span').textContent = dirHandle.name;
    updateGitPanel();
    showToast(`Mounted native workspace: ${dirHandle.name}`, 'success');
    
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err);
      showToast("Failed to mount folder", "error");
    }
  }
});

// 4. Simulated Terminal Controller
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');

function appendTerminalLine(text, className = '') {
  const line = document.createElement('div');
  line.className = `terminal-line ${className}`;
  line.textContent = text;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function printInitialTerminal() {
  appendTerminalLine("Antigravity 2.0 Quantum Compiler CLI");
  appendTerminalLine("Type 'help' to view available operations.");
  if (localStorage.getItem('antigravity_godmode') !== 'false') {
    appendTerminalLine("⚡ [SYSTEM STATE]: GOD MODE AUTHORIZED & ACTIVE");
  }
  appendTerminalLine("--------------------------------------------------");
}

terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = terminalInput.value;
    terminalInput.value = '';
    
    if (val) {
      termHistory.push(val.trim());
      termHistoryIndex = termHistory.length;
      
      if (isBackendConnected) {
        if (val.trim().toLowerCase().startsWith('browse ')) {
          const url = val.trim().substring(7).trim();
          handleBrowserProxyCommand(url);
        } else {
          socket.send(JSON.stringify({ type: 'input', data: val + '\n' }));
        }
      } else {
        executeCommand(val.trim());
      }
    }
  } else if (e.key === 'ArrowUp') {
    if (termHistoryIndex > 0) {
      termHistoryIndex--;
      terminalInput.value = termHistory[termHistoryIndex];
    }
  } else if (e.key === 'ArrowDown') {
    if (termHistoryIndex < termHistory.length - 1) {
      termHistoryIndex++;
      terminalInput.value = termHistory[termHistoryIndex];
    } else {
      termHistoryIndex = termHistory.length;
      terminalInput.value = '';
    }
  }
});

function executeCommand(cmdLine) {
  appendTerminalLine(`antigravity-ide $ ${cmdLine}`, 'cmd-input');
  
  const tokens = cmdLine.split(' ');
  const cmd = tokens[0].toLowerCase();
  const args = tokens.slice(1);
  
  switch(cmd) {
    case 'help':
      appendTerminalLine("Available commands:");
      appendTerminalLine("  help               - Show this help sheet");
      appendTerminalLine("  clear              - Clear output screen");
      appendTerminalLine("  ls                 - List files in local project root");
      appendTerminalLine("  cat <file>         - Display file contents");
      appendTerminalLine("  git status         - Verify uncommitted alterations");
      appendTerminalLine("  git commit -m <m>  - Create a staging block");
      appendTerminalLine("  git push           - Deploy launch sequence to GitHub");
      appendTerminalLine("  npm run dev        - Launch local Dev Server");
      appendTerminalLine("  antigravity compile- Run hot compilation sequence");
      appendTerminalLine("  stars              - Manually pull active star telemetry");
      break;
      
    case 'clear':
      terminalOutput.innerHTML = '';
      break;
      
    case 'ls':
      appendTerminalLine(Object.keys(files).join('   '));
      break;
      
    case 'cat':
      if (!args[0]) {
        appendTerminalLine("Error: Missing file name. (Usage: cat README.md)");
      } else if (files[args[0]]) {
        appendTerminalLine(files[args[0]].content);
      } else {
        appendTerminalLine(`Error: File ${args[0]} not found.`);
      }
      break;
      
    case 'git':
      if (args[0] === 'status') {
        if (modifiedFiles.size === 0) {
          appendTerminalLine("On branch main\nYour branch is up to date.\n\nnothing to commit, working tree clean");
        } else {
          appendTerminalLine("On branch main\nChanges not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n");
          modifiedFiles.forEach(f => {
            appendTerminalLine(`\tmodified:   ${f}`, 'text-pink');
          });
        }
      } else if (args[0] === 'commit') {
        if (modifiedFiles.size === 0) {
          appendTerminalLine("Nothing to commit, working tree clean");
        } else {
          let msg = args.slice(1).join(' ').replace(/['"]/g, '');
          if (!msg || msg === '-m') msg = "feat: optimize antigravity vector equations";
          appendTerminalLine(`[main ${Math.random().toString(16).substr(2, 7)}] ${msg}`);
          appendTerminalLine(` ${modifiedFiles.size} files changed, 24 insertions(+), 8 deletions(-)`);
          modifiedFiles.clear();
          updateGitPanel();
        }
      } else if (args[0] === 'push') {
        appendTerminalLine("Enumerating objects: 4, done.");
        appendTerminalLine("Counting objects: 100% (4/4), done.");
        appendTerminalLine("Delta compression using up to 8 threads");
        appendTerminalLine("Compressing objects: 100% (3/3), done.");
        appendTerminalLine("Writing objects: 100% (4/4), 425 bytes | 425.00 KiB/s, done.");
        appendTerminalLine("To github.com/antigravity-dev/antigravity-ide.git");
        appendTerminalLine("   a4c28f1..9b5de5a  main -> main");
        appendTerminalLine("🔥 LAUNCHING VIRAL ENGINE...");
        setTimeout(() => {
          openViralModal();
        }, 1000);
      } else {
        appendTerminalLine("Unknown git sub-command. Try: git status, git commit, git push");
      }
      break;
      
    case 'npm':
      if (args[0] === 'run' && args[1] === 'dev') {
        appendTerminalLine("Starting local development hosting...");
        appendTerminalLine("> vite dev --host");
        appendTerminalLine("");
        appendTerminalLine("  VITE v4.4.5  ready in 48ms");
        appendTerminalLine("  ➜  Local:   http://localhost:5173/");
        appendTerminalLine("  ➜  Network: use --host to expose");
        appendTerminalLine("  ➜  press h to show help");
        
        // Show build output compile logs
        const buildPane = document.getElementById('build-output');
        buildPane.innerHTML = `[Vite Dev Mode] Active
Watching /antigravity-project for changes...
[10:48:10] Loaded dependency list
[10:48:12] Hot Module Replacement active for index.js`;
        showToast("Dev Server is now running on port 5173!", "success");
      } else {
        appendTerminalLine("Only 'npm run dev' is supported in local sandboxed environment.");
      }
      break;
      
    case 'antigravity':
      if (args[0] === 'compile') {
        appendTerminalLine("🚀 Initiating Zero-G Compiling Pipeline...");
        setTimeout(() => {
          appendTerminalLine("✔ Analysing code vectors...");
          appendTerminalLine("✔ Balancing gravitational cancellation matrices...");
          appendTerminalLine("✔ Injecting anti-matter packets into memory cache...");
          appendTerminalLine("");
          appendTerminalLine("------------------------------------------------");
          appendTerminalLine("           COMPILATION SUCCESSFUL               ");
          appendTerminalLine("           Build output size: 24.3 KB           ");
          appendTerminalLine("           Floating rate: 100% stable           ");
          appendTerminalLine("------------------------------------------------");
          
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 1200);
      } else {
        appendTerminalLine("Try command: 'antigravity compile'");
      }
      break;
      
    case 'stars':
      triggerStarConfetti();
      appendTerminalLine(`Star Count verified: ${starCount} stars and climbing!`);
      break;
      
    default:
      appendTerminalLine(`Command not found: ${cmd}. Type 'help' for suggestions.`);
  }
}

document.getElementById('clear-terminal').addEventListener('click', () => {
  executeCommand('clear');
});

// 5. Source Control Panel UI sync
function updateGitPanel() {
  const gitFileList = document.getElementById('git-file-list');
  const countBubbles = document.querySelectorAll('.count-bubble, .git-badge');
  
  gitFileList.innerHTML = '';
  
  countBubbles.forEach(b => {
    b.textContent = modifiedFiles.size;
    if (b.classList.contains('git-badge')) {
      b.style.display = modifiedFiles.size > 0 ? 'block' : 'none';
    }
  });

  if (modifiedFiles.size === 0) {
    gitFileList.innerHTML = '<p class="placeholder-text">No unstaged alterations in workspace.</p>';
    return;
  }

  modifiedFiles.forEach(f => {
    const item = document.createElement('div');
    item.className = 'git-file-item';
    item.innerHTML = `
      <div class="git-file-info">
        <i data-lucide="file-code-2" class="text-pink"></i>
        <span>${f}</span>
      </div>
      <span class="git-status-badge mod">M</span>
    `;
    item.addEventListener('click', () => switchToFile(f));
    gitFileList.appendChild(item);
  });
  
  lucide.createIcons();
}

// Git Buttons setup
document.getElementById('git-commit-btn').addEventListener('click', () => {
  const msgInput = document.getElementById('commit-msg');
  const msg = msgInput.value.trim();
  if (!msg) {
    showToast("Please write a commit message!", "info");
    return;
  }
  executeCommand(`git commit -m "${msg}"`);
  msgInput.value = '';
});

document.getElementById('git-push-btn').addEventListener('click', () => {
  const msgInput = document.getElementById('commit-msg');
  const msg = msgInput.value.trim() || 'feat: viral setup for antigravity workspace';
  executeCommand(`git commit -m "${msg}"`);
  msgInput.value = '';
  executeCommand('git push');
});

// 6. AI Agent Chatbot Simulator
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatMessages = document.getElementById('chat-messages');

function appendMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  
  const content = document.createElement('div');
  content.className = 'message-content';
  content.innerHTML = formatMarkdown(text);
  
  msg.appendChild(content);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const typing = document.createElement('div');
  typing.className = 'message agent typing-msg';
  typing.id = 'typing-indicator';
  typing.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

function formatMarkdown(text) {
  // Simple markdown highlight replacement
  let res = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
    
  // Code block parser
  if (res.includes('```')) {
    const parts = res.split('```');
    for (let i = 1; i < parts.length; i += 2) {
      const codeLines = parts[i].split('\n');
      const lang = codeLines[0].trim();
      const code = codeLines.slice(1).join('\n');
      parts[i] = `<pre><code>${code}</code></pre>`;
    }
    res = parts.join('');
  }
  
  return res.replace(/\n/g, '<br>');
}

function handleChatMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  
  appendMessage(text, 'user');
  chatInput.value = '';
  
  showTypingIndicator();
  
  setTimeout(() => {
    hideTypingIndicator();
    const reply = getAIResponse(text);
    appendMessage(reply, 'agent');
  }, 1000);
}

chatSendBtn.addEventListener('click', handleChatMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleChatMessage();
});

// Chat templates handling
document.querySelectorAll('.chat-template-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const promptText = btn.dataset.prompt;
    appendMessage(promptText, 'user');
    showTypingIndicator();
    
    setTimeout(() => {
      hideTypingIndicator();
      let reply = "";
      const isGodMode = document.getElementById('setting-godmode').checked;
      
      if (promptText.includes("Optimize")) {
        if (activeFile === 'physics-engine.js') {
          const optimizedCode = `/**
 * Antigravity calculation matrix
 * Defies standard relativity constraints
 * OPTIMIZED: Memoized computation vector cache
 */
const computationCache = new Map();

exports.calculateLift = function(mass) {
  if (computationCache.has(mass)) {
    return computationCache.get(mass);
  }

  const G = 9.80665;
  const antiFieldConstant = 1.054e-34;
  
  const targetCancellation = mass * G;
  const variance = 0.02; // Locked target variance
  
  const result = {
    netForce: (targetCancellation * (1 + variance)).toFixed(4),
    altitude: (mass * antiFieldConstant * 1e36).toFixed(2),
    equilibriumReached: true,
    cached: true
  };
  
  computationCache.set(mass, result);
  return result;
};`;
          files['physics-engine.js'].content = optimizedCode;
          if (editor && activeFile === 'physics-engine.js') {
            editor.setValue(optimizedCode);
          }
          
          if (isGodMode && isBackendConnected) {
            socket.send(JSON.stringify({
              type: 'input',
              data: `cat << 'EOF' > physics-engine.js\n${optimizedCode}\nEOF\n`
            }));
            reply = "🚀 **GOD MODE ACTIVE**: Optimized code injected directly to your local workspace path: `physics-engine.js`! Shell compilation executed successfully.";
          } else {
            reply = "🚀 I have optimized **physics-engine.js** in memory:\n- Implemented a standard memory cache Map to store computations.\n- Replaced raw runtime random math variables with static equilibrium coefficient to reduce variance jitters.\n- Cleaned comments for faster JS compiling. The file will load **35% faster** now!";
          }
        } else {
          reply = `I can help optimize **${activeFile}**. Try switching to \`physics-engine.js\` for a demonstration of my automatic source optimization module.`;
        }
      } 
      else if (promptText.includes("Bugs")) {
        reply = `🔍 Checked **${activeFile}**:\n- **No critical vulnerabilities found**.\n- *Recommendation*: Ensure you validate that division parameters do not reach 0 when calculations are pushed near high gravity boundaries.`;
      } 
      else if (promptText.includes("Test")) {
        const testCode = `// Antigravity Quantum Vector Test Suite
const physics = require('./physics-engine');

describe('Antigravity Physics Engine Spec', () => {
  test('Calculation balance matches target lift cancellation', () => {
    const mass = 100;
    const lift = physics.calculateLift(mass);
    expect(parseFloat(lift.netForce)).toBeGreaterThanOrEqual(980);
    expect(lift.equilibriumReached).toBe(true);
  });
});`;
        
        files['physics.test.js'] = {
          name: 'physics.test.js',
          path: 'physics.test.js',
          type: 'file',
          icon: 'file-check-2',
          language: 'javascript',
          content: testCode
        };
        
        switchToFile('physics.test.js');
        
        if (isGodMode && isBackendConnected) {
          socket.send(JSON.stringify({
            type: 'input',
            data: `cat << 'EOF' > physics.test.js\n${testCode}\nEOF\n`
          }));
          reply = "✅ **GOD MODE ACTIVE**: Generated real unit test suite inside **physics.test.js** directly on your local computer via WebSocket command pipeline!";
        } else {
          reply = "✅ Generated unit test suite inside new file **physics.test.js** in memory! Click to check out the structure. You can run `npm run test` in terminal to check validity.";
        }
      } 
      else if (promptText.includes("Viral")) {
        reply = "📢 Generate viral engagement for **Antigravity 2.0 IDE**! I have compiled social links and headlines inside the **Launch Center**. Click the rocket icon in the sidebar to open the Viral Boost toolkit.";
      }
      
      appendMessage(reply, 'agent');
    }, 1200);
  });
});

function getAIResponse(userText) {
  userText = userText.toLowerCase();
  
  if (userText.includes("hello") || userText.includes("hi")) {
    return "Hello developer! I am the Antigravity 2.0 co-pilot. I can compile or generate unit tests. Ask me anything about this repository.";
  }

  if (userText.includes("zero-g") || userText.includes("gravity") || userText.includes("antigravity")) {
    return "Antigravity is achieved by counteracting gravity using an electromagnetic field that balances the acceleration coefficient. In our code, look at `physics-engine.js` where the quantum lift vector is calculated!";
  }
  
  return `I've analyzed your question: "${userText}". As an AI agent loaded inside Antigravity 2.0 workspace, I can optimize code, write files, or trigger compilation. Let me know how you'd like to proceed!`;
}



// 8. Settings and Theme Modulation
const themeSelect = document.getElementById('setting-theme');
themeSelect.addEventListener('change', () => {
  const newTheme = themeSelect.value;
  document.body.classList.remove(currentTheme);
  document.body.classList.add(newTheme);
  currentTheme = newTheme;
  showToast(`Applied theme: ${themeSelect.options[themeSelect.selectedIndex].text}`, 'success');
});

const fontSizeInput = document.getElementById('setting-font-size');
fontSizeInput.addEventListener('change', () => {
  const size = parseInt(fontSizeInput.value) || 14;
  if (editor) {
    editor.updateOptions({ fontSize: size });
  }
});

// Toast Notification Engine
function showToast(message, type = 'success') {
  const container = document.getElementById('notification-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'sparkles';
  if (type === 'success') icon = 'check-circle';
  else if (type === 'info') icon = 'info';

  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  lucide.createIcons();
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.9)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// 9. Right AI Chat drawer toggle
const toggleChatBtn = document.getElementById('toggle-chat');
const chatPanel = document.getElementById('chat-panel');
toggleChatBtn.addEventListener('click', () => {
  chatPanel.classList.toggle('collapsed');
  if (editor) {
    setTimeout(() => editor.layout(), 300);
  }
});

// Bottom drawer toggle
const toggleDrawerBtn = document.getElementById('toggle-drawer');
const bottomDrawer = document.getElementById('bottom-drawer');
toggleDrawerBtn.addEventListener('click', () => {
  bottomDrawer.classList.toggle('collapsed');
  const icon = toggleDrawerBtn.querySelector('i');
  if (bottomDrawer.classList.contains('collapsed')) {
    icon.setAttribute('data-lucide', 'chevron-up');
  } else {
    icon.setAttribute('data-lucide', 'chevron-down');
  }
  lucide.createIcons();
  if (editor) {
    setTimeout(() => editor.layout(), 300);
  }
});

// Resize Sidebar Handle
const resizeHandle = document.getElementById('sidebar-resize');
const sidebarPanel = document.getElementById('sidebar-panel');
let isResizing = false;

resizeHandle.addEventListener('mousedown', (e) => {
  isResizing = true;
  document.body.style.cursor = 'col-resize';
  resizeHandle.classList.add('active');
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isResizing) return;
  
  let newWidth = e.clientX - 55; // subtract activity bar width
  if (newWidth > 150 && newWidth < 450) {
    sidebarPanel.style.width = `${newWidth}px`;
    if (editor) {
      editor.layout();
    }
  }
});

document.addEventListener('mouseup', () => {
  if (isResizing) {
    isResizing = false;
    document.body.style.cursor = 'default';
    resizeHandle.classList.remove('active');
  }
});

// Connected Backend WebSockets & Browser Proxy Logic
function connectBackend() {
  socket = new WebSocket('ws://127.0.0.1:8081');
  
  socket.onopen = () => {
    isBackendConnected = true;
    updateStatusBarConnection(true);
    showToast("Linked to local PC backend! Shell active.", "success");
    
    // Clear terminal and request bash prompt
    terminalOutput.innerHTML = '';
    socket.send(JSON.stringify({ type: 'input', data: '\n' }));
    
    // Refresh live browser if active
    const browserSplitPane = document.getElementById('browser-split-pane');
    if (browserSplitPane.classList.contains('active')) {
      loadBrowserUrl(document.getElementById('browser-url-input').value);
    }
    
    logToSatellite("Linked to local shell: WebSocket active.");
  };
  
  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === 'output') {
        appendTerminalRaw(msg.data);
      } else if (msg.type === 'exit') {
        isBackendConnected = false;
        updateStatusBarConnection(false);
        showToast("Local shell session ended.", "info");
      }
    } catch (err) {
      console.error("WS msg error:", err);
    }
  };
  
  socket.onclose = () => {
    if (isBackendConnected) {
      isBackendConnected = false;
      updateStatusBarConnection(false);
      showToast("Backend connection lost. Switched to simulated mode.", "info");
      printInitialTerminal();
      
      // Update browser panel if active to display offline warning
      const browserSplitPane = document.getElementById('browser-split-pane');
      if (browserSplitPane.classList.contains('active')) {
        loadBrowserUrl(document.getElementById('browser-url-input').value);
      }
      
      logToSatellite("Connection closed: shell disconnected.");
    }
  };
  
  socket.onerror = () => {
    isBackendConnected = false;
    updateStatusBarConnection(false);
    
    // Update browser panel if active to display offline warning
    const browserSplitPane = document.getElementById('browser-split-pane');
    if (browserSplitPane.classList.contains('active')) {
      loadBrowserUrl(document.getElementById('browser-url-input').value);
    }
    
    logToSatellite("Socket connection error encountered.");
  };
}

function updateStatusBarConnection(connected) {
  const syncStatus = document.querySelector('.sync-status');
  const termPrompt = document.querySelector('.terminal-prompt');
  
  if (connected) {
    syncStatus.classList.remove('text-green');
    syncStatus.classList.add('text-pink');
    syncStatus.innerHTML = `<i data-lucide="terminal"></i> <span>Connected (Live Shell)</span>`;
    
    if (termPrompt) termPrompt.textContent = '';
  } else {
    syncStatus.classList.remove('text-pink');
    syncStatus.classList.add('text-green');
    syncStatus.innerHTML = `<i data-lucide="cloud-lightning"></i> <span>Vibe Connected</span>`;
    
    if (termPrompt) termPrompt.textContent = 'antigravity-ide $';
  }
  lucide.createIcons();
}

function stripAnsi(text) {
  return text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

function appendTerminalRaw(text) {
  const clean = stripAnsi(text);
  const lines = clean.split('\n');
  
  lines.forEach((line, index) => {
    if (index > 0) {
      const div = document.createElement('div');
      div.className = 'terminal-line';
      terminalOutput.appendChild(div);
    }
    
    let activeLine = terminalOutput.lastElementChild;
    if (!activeLine) {
      activeLine = document.createElement('div');
      activeLine.className = 'terminal-line';
      terminalOutput.appendChild(activeLine);
    }
    
    if (line.includes('\r')) {
      const parts = line.split('\r');
      activeLine.textContent = parts[parts.length - 1];
    } else {
      activeLine.textContent += line;
    }
  });
  
  while (terminalOutput.children.length > 250) {
    terminalOutput.removeChild(terminalOutput.firstChild);
  }
  
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function handleBrowserProxyCommand(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  appendTerminalRaw(`[Proxy Browser] Connecting to ${url}...\n`);
  
  fetch(`http://127.0.0.1:8081/proxy?url=${encodeURIComponent(url)}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return res.text();
    })
    .then(html => {
      appendTerminalRaw(`[Proxy Browser] Connected! Extracting page layout...\n`);
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const title = doc.querySelector('title')?.textContent || 'No Title';
      appendTerminalRaw(`Title: ${title}\n`);
      
      const h1s = Array.from(doc.querySelectorAll('h1, h2, h3')).slice(0, 10);
      if (h1s.length > 0) {
        appendTerminalRaw(`\nHeadings found:\n`);
        h1s.forEach(h => {
          appendTerminalRaw(`  • [${h.tagName}] ${h.textContent.trim().replace(/\s+/g, ' ')}\n`);
        });
      }
      
      const links = Array.from(doc.querySelectorAll('a')).slice(0, 10);
      if (links.length > 0) {
        appendTerminalRaw(`\nMain links found:\n`);
        links.forEach(a => {
          const href = a.getAttribute('href');
          const text = a.textContent.trim().replace(/\s+/g, ' ');
          if (href && text) {
            appendTerminalRaw(`  • ${text} -> ${href}\n`);
          }
        });
      }
      
      appendTerminalRaw(`\n[Proxy Browser] Page loading successful!\n`);
    })
    .catch(err => {
      appendTerminalRaw(`[Proxy Browser] Failed: ${err.message}\n`);
    });
}

// 9.5 Split Live Web Browser Controller
function loadBrowserUrl(url) {
  const browserIframe = document.getElementById('browser-iframe');
  const browserUrlInput = document.getElementById('browser-url-input');
  
  if (!url) return;
  
  let formattedUrl = url.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl;
  }
  browserUrlInput.value = formattedUrl;
  
  if (isBackendConnected) {
    browserIframe.src = `http://127.0.0.1:8081/proxy?url=${encodeURIComponent(formattedUrl)}`;
  } else {
    // Render offline message in iframe
    const fallbackHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap" rel="stylesheet">
        <style>
          body {
            background-color: #0b0816;
            color: #ffffff;
            font-family: 'Outfit', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 80vh;
            margin: 0;
            padding: 20px;
            text-align: center;
          }
          .card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(155, 93, 229, 0.25);
            border-radius: 12px;
            padding: 28px;
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          }
          h2 { color: #f15bb5; font-size: 18px; margin-top: 0; margin-bottom: 12px; }
          p { color: #c5c9db; font-size: 12.5px; line-height: 1.5; margin-bottom: 16px; }
          code {
            background: #000;
            color: #00f5d4;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>🌐 Live Browser Proxy Offline</h2>
          <p>This panel uses a local CORS-Free bypass proxy to render internet webpages directly inside the IDE split screen.</p>
          <p>To start browsing the internet, run the backend server on your machine:</p>
          <p><code>npm start</code></p>
          <p style="margin-bottom: 0; font-size: 11px; color: #8f94ab;">Once active, the status bar will show "Connected" and pages will load instantly!</p>
        </div>
      </body>
      </html>
    `;
    const doc = browserIframe.contentWindow.document;
    doc.open();
    doc.write(fallbackHTML);
    doc.close();
  }
}

// Live Browser listeners
const toggleSplitBrowserBtn = document.getElementById('toggle-split-browser-btn');
const browserSplitPane = document.getElementById('browser-split-pane');
const browserUrlInput = document.getElementById('browser-url-input');
const browserBtnGo = document.getElementById('browser-btn-go');
const browserBtnRefresh = document.getElementById('browser-btn-refresh');

toggleSplitBrowserBtn.addEventListener('click', () => {
  const isActive = browserSplitPane.classList.toggle('active');
  toggleSplitBrowserBtn.classList.toggle('active', isActive);
  
  if (isActive) {
    loadBrowserUrl(browserUrlInput.value);
  }
  
  // Reflow Monaco Editor layout
  setTimeout(() => {
    if (editor) editor.layout();
  }, 150);
});

browserBtnGo.addEventListener('click', () => {
  loadBrowserUrl(browserUrlInput.value);
});

browserUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    loadBrowserUrl(browserUrlInput.value);
  }
});

browserBtnRefresh.addEventListener('click', () => {
  loadBrowserUrl(browserUrlInput.value);
});

// God Mode Toggle Event Handling
const godmodeToggle = document.getElementById('setting-godmode');
godmodeToggle.addEventListener('change', () => {
  const active = godmodeToggle.checked;
  localStorage.setItem('antigravity_godmode', active);
  if (active) {
    showToast("⚡ GOD MODE ENABLED: AI auto-allow write actions authorized!", "info");
    appendTerminalRaw("\n⚡ [GOD MODE] Elevating access parameters... Auto-allow active.\n");
    document.querySelector('.app-container').classList.add('godmode-active');
  } else {
    showToast("God Mode disabled.", "info");
    appendTerminalRaw("\n[GOD MODE] Restoring standard sandbox restrictions.\n");
    document.querySelector('.app-container').classList.remove('godmode-active');
  }
});
// 9.6 Detached Satellite Dock Synchronization
let sidebarWindow = null;
const SIDEBAR_WIDTH = 320;

function openSidebarDock() {
  if (sidebarWindow && !sidebarWindow.closed) {
    sidebarWindow.focus();
    return;
  }
  
  // Calculate right-hand side alignment positions
  const targetX = window.screenX + window.outerWidth;
  const targetY = window.screenY;
  const targetHeight = window.outerHeight;
  
  sidebarWindow = window.open(
    'sidebar.html', 
    'antigravity_sidebar', 
    `width=${SIDEBAR_WIDTH},height=${targetHeight},left=${targetX},top=${targetY},menubar=no,toolbar=no,location=no,status=no`
  );
  
  if (!sidebarWindow) {
    showToast("⚠️ Popup blocked! Please allow popups to open the Satellite Dock.", "warning");
    return;
  }
  
  showToast("📡 Satellite Dock linked. Try dragging or resizing this IDE window!", "success");
  
  const userAgent = navigator.userAgent.toLowerCase();
  let platformLabel = "Linux/Unix";
  if (userAgent.includes('win')) platformLabel = "Windows";
  else if (userAgent.includes('mac')) platformLabel = "macOS";
  
  setTimeout(() => {
    logToSatellite(`Detected host OS: ${platformLabel}.`);
    if (userAgent.includes('win')) {
      logToSatellite("Applied Windows Aero shadow border compensation (-8px offset).");
    } else if (userAgent.includes('mac')) {
      logToSatellite("Applied Apple macOS Aqua viewport bounds synchronization.");
    } else {
      logToSatellite("Applied Linux X11/Wayland system alignment metrics.");
    }
  }, 800);

  // Start synchronization loop
  syncSidebarWindow();
}

function syncSidebarWindow() {
  if (!sidebarWindow || sidebarWindow.closed) {
    sidebarWindow = null;
    return;
  }
  
  try {
    const mainX = window.screenX || window.screenLeft;
    const mainY = window.screenY || window.screenTop;
    const mainWidth = window.outerWidth;
    const mainHeight = window.outerHeight;
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isWindows = userAgent.includes('win');
    const isMac = userAgent.includes('mac');
    
    let offsetX = 0;
    let offsetY = 0;
    let heightAdjustment = 0;
    
    if (isWindows) {
      // Windows has invisible shadow border drag handles (approx. 7-8px)
      offsetX = -8;
      offsetY = 0;
      heightAdjustment = 0;
    } else if (isMac) {
      // macOS Aqua/Quartz borders
      offsetX = 0;
      offsetY = 0;
      heightAdjustment = 0;
    } else {
      // Linux GTK/Qt window manager borders
      offsetX = 0;
      offsetY = 0;
      heightAdjustment = 0;
    }
    
    // Position sidebar stuck to the right edge of main IDE container
    const targetX = mainX + mainWidth + offsetX;
    const targetY = mainY + offsetY;
    const targetHeight = mainHeight + heightAdjustment;
    
    sidebarWindow.moveTo(targetX, targetY);
    sidebarWindow.resizeTo(SIDEBAR_WIDTH, targetHeight);
    
    // Mirror theme class name
    const activeTheme = document.body.className;
    if (sidebarWindow.document.body.className !== activeTheme) {
      sidebarWindow.document.body.className = activeTheme;
    }
  } catch (e) {
    // Suppress warnings
  }
  
  requestAnimationFrame(syncSidebarWindow);
}

function logToSatellite(message) {
  if (sidebarWindow && !sidebarWindow.closed) {
    sidebarWindow.postMessage({ type: 'log', message }, '*');
  }
}

// Hook header launch button
document.getElementById('launch-dock-btn').addEventListener('click', openSidebarDock);

// 10. Startup Initialization
window.addEventListener('DOMContentLoaded', () => {
  initMonaco();
  setupNavigation();
  renderExplorer();
  renderTabs();
  printInitialTerminal();
  updateGitPanel();
  
  // Restore God Mode state (default to true on first load)
  const savedGodmode = localStorage.getItem('antigravity_godmode') !== 'false';
  godmodeToggle.checked = savedGodmode;
  if (savedGodmode) {
    document.querySelector('.app-container').classList.add('godmode-active');
  }
  
  // Trigger initial icons build
  lucide.createIcons();
  
  // Welcome Toast
  setTimeout(() => {
    showToast("Cosmic Space Dark workspace active. Ready to launch!", "success");
    // Connect to local machine backend
    connectBackend();
  }, 1000);
});
