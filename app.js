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

// Git Status Tracker
let modifiedFiles = new Set(['index.js', 'physics-engine.js']);

// GitHub Stars Tracker
let starCount = 12504;
let forkCount = 1824;
let visitorCount = 483;
let trendingRank = 1;

// Terminal History
let termHistory = [];
let termHistoryIndex = -1;

// 1. Monaco Editor Initialization
function initMonaco() {
  require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.43.0/min/vs' } });
  require(['vs/editor/editor.main'], function () {
    // Hide loading screen
    document.getElementById('editor-loading').style.display = 'none';
    
    // Create editor instance
    editor = monaco.editor.create(document.getElementById('editor-container'), {
      value: files[activeFile].content,
      language: files[activeFile].language,
      theme: 'vs-dark',
      automaticLayout: true,
      fontFamily: 'JetBrains Mono',
      fontSize: parseInt(document.getElementById('setting-font-size').value) || 14,
      minimap: { enabled: true },
      padding: { top: 12 },
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8
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
    editor.onDidChangeModelContent(() => {
      files[activeFile].content = editor.getValue();
      if (!modifiedFiles.has(activeFile)) {
        modifiedFiles.add(activeFile);
        updateGitPanel();
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

// Create New File Dialog
document.getElementById('new-file-btn').addEventListener('click', () => {
  const fileName = prompt("Enter new file name (e.g. engine.js):");
  if (!fileName) return;
  
  if (files[fileName]) {
    showToast("File already exists!", "info");
    return;
  }

  let ext = fileName.split('.').pop();
  let lang = 'javascript';
  let icon = 'file-code-2';

  if (ext === 'md') { lang = 'markdown'; icon = 'file-text'; }
  else if (ext === 'json') { lang = 'json'; icon = 'braces'; }
  else if (ext === 'css') { lang = 'css'; icon = 'file-type-2'; }

  files[fileName] = {
    name: fileName,
    path: fileName,
    type: 'file',
    icon: icon,
    language: lang,
    content: `// New file ${fileName}\n`
  };

  modifiedFiles.add(fileName);
  switchToFile(fileName);
  updateGitPanel();
  showToast(`Created file ${fileName}`, 'success');
});

document.getElementById('new-folder-btn').addEventListener('click', () => {
  showToast("Folders will be automatically grouped in simulated file tree.", "info");
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
  appendTerminalLine("--------------------------------------------------");
}

terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = terminalInput.value.trim();
    terminalInput.value = '';
    
    if (val) {
      termHistory.push(val);
      termHistoryIndex = termHistory.length;
      executeCommand(val);
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
      
      if (promptText.includes("Optimize")) {
        // Run code optimizer mock
        if (activeFile === 'physics-engine.js') {
          files['physics-engine.js'].content = `/**
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
          if (editor && activeFile === 'physics-engine.js') {
            editor.setValue(files['physics-engine.js'].content);
          }
          reply = "🚀 I have optimized **physics-engine.js**:\n- Implemented a standard memory cache Map to store computations.\n- Replaced raw runtime random math variables with static equilibrium coefficient to reduce variance jitters.\n- Cleaned comments for faster JS compiling. The file will load **35% faster** now!";
        } else {
          reply = `I can help optimize **${activeFile}**. Try switching to \`physics-engine.js\` for a demonstration of my automatic source optimization module.`;
        }
      } 
      else if (promptText.includes("Bugs")) {
        reply = `🔍 Checked **${activeFile}**:\n- **No critical vulnerabilities found**.\n- *Recommendation*: Ensure you validate that division parameters do not reach 0 when calculations are pushed near high gravity boundaries.`;
      } 
      else if (promptText.includes("Test")) {
        // Create tests file
        files['physics.test.js'] = {
          name: 'physics.test.js',
          path: 'physics.test.js',
          type: 'file',
          icon: 'file-check-2',
          language: 'javascript',
          content: `// Antigravity Quantum Vector Test Suite
const physics = require('./physics-engine');

describe('Antigravity Physics Engine Spec', () => {
  test('Calculation balance matches target lift cancellation', () => {
    const mass = 100;
    const lift = physics.calculateLift(mass);
    expect(parseFloat(lift.netForce)).toBeGreaterThanOrEqual(980);
    expect(lift.equilibriumReached).toBe(true);
  });
});`
        };
        switchToFile('physics.test.js');
        reply = "✅ Generated unit test suite inside new file **physics.test.js**! Click to check out the structure. You can run `npm run test` in terminal to check validity.";
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
    return "Hello developer! I am the Antigravity 2.0 co-pilot. I can compile, generate unit tests, or help you push this project to viral fame on GitHub. Ask me anything about this repository.";
  }
  if (userText.includes("viral") || userText.includes("github") || userText.includes("stars")) {
    return "To go viral on GitHub, we need standard features: high-quality clean SVGs, descriptive badges, a solid README.md pitch, and a Product Hunt launch sequence. Open the **Viral Launch Dashboard** using the rocket icon in the left-hand menu to boost stars instantly!";
  }
  if (userText.includes("zero-g") || userText.includes("gravity") || userText.includes("antigravity")) {
    return "Antigravity is achieved by counteracting gravity using an electromagnetic field that balances the acceleration coefficient. In our code, look at `physics-engine.js` where the quantum lift vector is calculated!";
  }
  
  return `I've analyzed your question: "${userText}". As an AI agent loaded inside Antigravity 2.0 workspace, I can optimize code, write files, or trigger compilation. Let me know how you'd like to proceed!`;
}

// 7. GitHub Viral Launch Modal Controller
const viralModal = document.getElementById('viral-modal');
const launchViralBtn = document.getElementById('launch-viral-btn');
const closeViralModal = document.getElementById('close-viral-modal');

function openViralModal() {
  viralModal.classList.add('active');
  updateModalStats();
  startSimulatedActivity();
}

function closeModal() {
  viralModal.classList.remove('active');
}

launchViralBtn.addEventListener('click', openViralModal);
closeViralModal.addEventListener('click', closeModal);

// Modal stats sync
function updateModalStats() {
  document.getElementById('modal-star-count').textContent = starCount.toLocaleString();
  document.getElementById('github-star-counter').textContent = `${(starCount / 1000).toFixed(1)}k stars`;
  
  document.getElementById('modal-fork-count').textContent = forkCount.toLocaleString();
  document.getElementById('modal-visitor-count').textContent = visitorCount.toLocaleString();
  document.getElementById('modal-rank').textContent = `#${trendingRank} Global`;
}

// Booster Buttons
document.getElementById('boost-stars-btn').addEventListener('click', () => {
  starCount += 100;
  forkCount += Math.floor(Math.random() * 15) + 5;
  visitorCount += Math.floor(Math.random() * 50) + 20;
  updateModalStats();
  triggerStarConfetti();
  addFeedEvent("star");
  showToast("GitHub Star Booster deployed! Added 100 organic stars.", "success");
});

document.getElementById('boost-ph-btn').addEventListener('click', () => {
  starCount += 250;
  forkCount += 45;
  visitorCount += 150;
  updateModalStats();
  
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
  
  addFeedEvent("producthunt");
  showToast("Product Hunt Launch sequence deployed! Rank rising.", "success");
});

document.getElementById('trending-hijack-btn').addEventListener('click', () => {
  starCount += 500;
  trendingRank = 1;
  updateModalStats();
  
  // Burst confetti
  let duration = 2 * 1000;
  let end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
  
  addFeedEvent("trending");
  showToast("Hijacked GitHub Trending #1 Spot! Viral growth active.", "success");
});

function triggerStarConfetti() {
  confetti({
    particleCount: 30,
    angle: 90,
    spread: 45,
    origin: { y: 0.8 },
    colors: ['#fee440', '#9b5de5', '#f15bb5']
  });
}

// Copy Action handler
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const text = document.getElementById(targetId).textContent;
    
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied to clipboard!", "success");
    }).catch(err => {
      showToast("Failed to copy", "info");
    });
  });
});

// Viral Tab Controller
const vtabs = document.querySelectorAll('.vtab');
const vtabContents = document.querySelectorAll('.vtab-content');

vtabs.forEach(tab => {
  tab.addEventListener('click', () => {
    vtabs.forEach(t => t.classList.remove('active'));
    vtabContents.forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    document.getElementById(`vtab-${tab.dataset.vtab}`).classList.add('active');
  });
});

// Live Activity Stream
const activityFeed = document.getElementById('activity-feed');
const usernames = ['@dan_abramov', '@yyx990803', '@rusty_dev', '@spacex_coder', '@hacker_news_fan', '@ai_pioneer', '@tailwind_guru', '@web_craftsman'];
const reviews = [
  'Defying gravity on local compiling speeds. Absolutely loving this.',
  'Just starred! The glassmorphism and Monaco editor combo works smoothly.',
  'Finally, a lightweight IDE built for floating physics compilers.',
  'This is going to blow up on Product Hunt. The UX is sleek.',
  'Just built my first Zero-G server on this. Impressed by the speed!',
  'The visual look is incredible. Good job on the theme palette.',
  'Clean, robust, and feels like VS Code but runs instantly.'
];

function addFeedEvent(type) {
  const item = document.createElement('div');
  item.className = 'feed-item';
  
  const user = usernames[Math.floor(Math.random() * usernames.length)];
  const avatarText = user.substring(1, 3).toUpperCase();
  
  let actionText = '';
  if (type === 'star') {
    actionText = `starred the repository. <em>"Organic traffic injection boost!"</em>`;
  } else if (type === 'producthunt') {
    actionText = `upvoted on Product Hunt. <em>"Congrats on product of the day! Sleek web workspace."</em>`;
  } else if (type === 'trending') {
    actionText = `shared on Twitter. <em>"Antigravity 2.0 IDE is the real deal. Defying relativity in JS."</em>`;
  } else {
    const msg = reviews[Math.floor(Math.random() * reviews.length)];
    actionText = `starred the repository. <em>"${msg}"</em>`;
  }
  
  item.innerHTML = `
    <span class="user-avatar" style="background: hsl(${Math.random() * 360}, 75%, 60%)">${avatarText}</span>
    <div class="feed-body">
      <strong>${user}</strong> ${actionText}
      <span class="feed-time">Just now</span>
    </div>
  `;
  
  activityFeed.prepend(item);
  if (activityFeed.children.length > 8) {
    activityFeed.removeChild(activityFeed.lastChild);
  }
}

let activityInterval = null;
function startSimulatedActivity() {
  if (activityInterval) clearInterval(activityInterval);
  
  // Random additions every 4-8 seconds
  activityInterval = setInterval(() => {
    if (document.getElementById('setting-stars-hack').checked) {
      starCount += Math.floor(Math.random() * 3) + 1;
      visitorCount += Math.floor(Math.random() * 5) + 1;
      if (Math.random() > 0.6) {
        forkCount += 1;
        addFeedEvent('organic');
      }
      updateModalStats();
    }
  }, 5000);
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

// 10. Startup Initialization
window.addEventListener('DOMContentLoaded', () => {
  initMonaco();
  setupNavigation();
  renderExplorer();
  renderTabs();
  printInitialTerminal();
  updateGitPanel();
  
  // Trigger initial icons build
  lucide.createIcons();
  
  // Welcome Toast
  setTimeout(() => {
    showToast("Cosmic Space Dark workspace active. Ready to launch!", "success");
  }, 1000);
});
