// Windows XP Portfolio JavaScript

class PortfolioApp {
    constructor() {
        this.windows = new Map();
        this.windowCounter = 0;
        this.activeWindow = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.startMenuVisible = false;
        this.contextMenuVisible = false;
        
        this.init();
    }

    init() {
        this.setupBootSequence();
        this.setupEventListeners();
        this.setupTimeDisplay();
        this.setupPortfolioContent();
    }

    setupBootSequence() {
        // Show boot screen for 3 seconds
        setTimeout(() => {
            const bootScreen = document.getElementById('boot-screen');
            bootScreen.classList.add('hidden');
            
            // Play boot sound if available
            this.playSound('boot');
        }, 3000);
    }

    setupEventListeners() {
        // Start button
        document.getElementById('start-button').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        // Desktop icons
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', (e) => {
                const windowType = e.currentTarget.dataset.window;
                this.openWindow(windowType);
            });
        });

        // Start menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const windowType = e.currentTarget.dataset.window;
                if (windowType) {
                    this.openWindow(windowType);
                    this.hideStartMenu();
                } else if (e.currentTarget.classList.contains('shutdown')) {
                    this.showBSOD();
                }
            });
        });

        // Click outside to close menus
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.start-menu')) {
                this.hideStartMenu();
            }
            if (!e.target.closest('.context-menu')) {
                this.hideContextMenu();
            }
        });

        // Right click for context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideStartMenu();
                this.hideContextMenu();
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.openWindow('about');
            }
        });

        // BSOD restart
        document.getElementById('bsod').addEventListener('keydown', () => {
            this.hideBSOD();
        });

        // Context menu items
        document.getElementById('refresh-desktop').addEventListener('click', () => {
            this.refreshDesktop();
            this.hideContextMenu();
        });

        document.getElementById('new-window').addEventListener('click', () => {
            this.openWindow('about');
            this.hideContextMenu();
        });

        document.getElementById('properties').addEventListener('click', () => {
            this.showProperties();
            this.hideContextMenu();
        });
    }

    setupTimeDisplay() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            document.getElementById('time-display').textContent = timeString;
        };

        updateTime();
        setInterval(updateTime, 1000);
    }

    setupPortfolioContent() {
        this.portfolioData = {
            about: {
                title: 'About Me',
                content: `
                    <h1>About Me</h1>
                    <p>Hello! I'm a passionate developer with a love for retro computing and pixel art.</p>
                    <p>I specialize in creating unique web experiences that blend nostalgia with modern functionality.</p>
                    <h2>Skills</h2>
                    <ul>
                        <li>HTML5 & CSS3</li>
                        <li>JavaScript (ES6+)</li>
                        <li>React & Vue.js</li>
                        <li>Node.js & Express</li>
                        <li>Pixel Art & 8-bit Design</li>
                        <li>Retro Game Development</li>
                    </ul>
                    <h2>Interests</h2>
                    <p>When I'm not coding, I enjoy playing classic video games, creating pixel art, and exploring the history of computing.</p>
                `
            },
            projects: {
                title: 'Projects',
                content: `
                    <h1>My Projects</h1>
                    <div class="project-item">
                        <div class="project-title">Windows XP Portfolio</div>
                        <div class="project-description">A pixelated portfolio website that mimics the classic Windows XP interface. Built with vanilla HTML, CSS, and JavaScript.</div>
                    </div>
                    <div class="project-item">
                        <div class="project-title">8-bit Game Engine</div>
                        <div class="project-description">A lightweight JavaScript game engine for creating retro-style games with pixel-perfect graphics and chiptune audio.</div>
                    </div>
                    <div class="project-item">
                        <div class="project-title">Pixel Art Generator</div>
                        <div class="project-description">A web-based tool for creating and editing pixel art with a focus on 8-bit and 16-bit aesthetics.</div>
                    </div>
                    <div class="project-item">
                        <div class="project-title">Retro Terminal</div>
                        <div class="project-description">A customizable terminal emulator with support for classic computer themes and authentic sound effects.</div>
                    </div>
                `
            },
            resume: {
                title: 'Resume',
                content: `
                    <h1>Resume</h1>
                    <h2>Experience</h2>
                    <p><strong>Senior Frontend Developer</strong> - Tech Corp (2020-2024)</p>
                    <p>Led development of pixel-perfect user interfaces and retro-themed web applications.</p>
                    
                    <p><strong>Full Stack Developer</strong> - StartupXYZ (2018-2020)</p>
                    <p>Built responsive web applications using modern JavaScript frameworks and retro design principles.</p>
                    
                    <h2>Education</h2>
                    <p><strong>Computer Science B.S.</strong> - University of Technology (2014-2018)</p>
                    <p>Specialized in Human-Computer Interaction and Retro Computing</p>
                    
                    <h2>Certifications</h2>
                    <ul>
                        <li>Certified Web Developer (CWD)</li>
                        <li>Pixel Art Master Certification</li>
                        <li>Retro Computing Specialist</li>
                    </ul>
                `
            },
            contact: {
                title: 'Contact Me',
                content: `
                    <h1>Get In Touch</h1>
                    <p>I'm always interested in new opportunities and creative projects!</p>
                    <h2>Contact Information</h2>
                    <p><strong>Email:</strong> portfolio@example.com</p>
                    <p><strong>Phone:</strong> (555) 123-4567</p>
                    <p><strong>Location:</strong> San Francisco, CA</p>
                    <h2>Social Media</h2>
                    <p><strong>GitHub:</strong> github.com/portfolio-user</p>
                    <p><strong>LinkedIn:</strong> linkedin.com/in/portfolio-user</p>
                    <p><strong>Twitter:</strong> @portfolio_dev</p>
                    <h2>Let's Work Together</h2>
                    <p>Whether you need a retro-themed website, a pixel art project, or just want to chat about classic computing, I'd love to hear from you!</p>
                `
            },
            gallery: {
                title: 'Gallery',
                content: `
                    <h1>Design Gallery</h1>
                    <p>Here are some of my favorite pixel art and design projects:</p>
                    <div class="project-item">
                        <div class="project-title">🎮 Classic Game Sprites</div>
                        <div class="project-description">A collection of 8-bit character sprites inspired by classic arcade games.</div>
                    </div>
                    <div class="project-item">
                        <div class="project-title">🖼️ Pixel Landscapes</div>
                        <div class="project-description">Retro-style landscape art featuring mountains, forests, and cities.</div>
                    </div>
                    <div class="project-item">
                        <div class="project-title">🏠 Isometric Buildings</div>
                        <div class="project-description">3D-style pixel art buildings and architectural elements.</div>
                    </div>
                    <div class="project-item">
                        <div class="project-title">🎨 UI Elements</div>
                        <div class="project-description">Custom pixel art buttons, icons, and interface elements.</div>
                    </div>
                `
            }
        };
    }

    openWindow(type) {
        // Close existing window of same type
        if (this.windows.has(type)) {
            this.closeWindow(type);
            return;
        }

        const windowId = type;
        this.windowCounter++;

        const windowElement = document.createElement('div');
        windowElement.className = 'window';
        windowElement.id = `window-${windowId}`;
        windowElement.style.left = `${50 + (this.windowCounter * 30)}px`;
        windowElement.style.top = `${50 + (this.windowCounter * 30)}px`;

        const content = this.portfolioData[type] || { title: 'Unknown', content: '<p>Content not found.</p>' };

        windowElement.innerHTML = `
            <div class="window-header" data-window-id="${windowId}">
                <div class="window-title">${content.title}</div>
                <div class="window-controls">
                    <div class="window-control minimize" data-action="minimize">_</div>
                    <div class="window-control maximize" data-action="maximize">□</div>
                    <div class="window-control close" data-action="close">×</div>
                </div>
            </div>
            <div class="window-content">
                ${content.content}
            </div>
        `;

        // Add special styling for command prompt
        if (type === 'cmd') {
            windowElement.classList.add('cmd-window');
            windowElement.querySelector('.window-content').classList.add('cmd-content');
            this.setupCommandPrompt(windowElement);
        }

        document.getElementById('windows-container').appendChild(windowElement);
        this.windows.set(windowId, { element: windowElement, type: type });

        this.setupWindowEvents(windowElement, windowId);
        this.addToTaskbar(windowId, content.title);
        this.bringToFront(windowId);
        this.playSound('open');

        // Focus the window
        this.focusWindow(windowId);
    }

    setupCommandPrompt(windowElement) {
        const content = windowElement.querySelector('.window-content');
        content.innerHTML = `
            <div class="cmd-output">Microsoft Windows XP [Version 5.1.2600]</div>
            <div class="cmd-output">(C) Copyright 1985-2001 Microsoft Corp.</div>
            <div class="cmd-output"></div>
            <div class="cmd-output">C:\\> Welcome to my portfolio!</div>
            <div class="cmd-output">Type 'help' for available commands.</div>
            <div class="cmd-output"></div>
            <div class="cmd-line">
                <span class="cmd-prompt">C:\\></span>
                <input type="text" class="cmd-input" autofocus>
            </div>
        `;

        const input = content.querySelector('.cmd-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand(input.value, content);
                input.value = '';
            }
        });
    }

    executeCommand(command, content) {
        const output = document.createElement('div');
        output.className = 'cmd-output';
        
        const cmdLine = document.createElement('div');
        cmdLine.className = 'cmd-line';
        cmdLine.innerHTML = `
            <span class="cmd-prompt">C:\\></span>
            <span>${command}</span>
        `;
        
        content.insertBefore(cmdLine, content.querySelector('.cmd-line'));
        content.insertBefore(output, content.querySelector('.cmd-line'));

        switch (command.toLowerCase().trim()) {
            case 'help':
                output.innerHTML = `
                    Available commands:<br>
                    about - Open About Me window<br>
                    projects - Open Projects window<br>
                    resume - Open Resume window<br>
                    contact - Open Contact window<br>
                    gallery - Open Gallery window<br>
                    clear - Clear screen<br>
                    bsod - Blue screen of death<br>
                    help - Show this help
                `;
                break;
            case 'about':
                this.openWindow('about');
                output.textContent = 'Opening About Me window...';
                break;
            case 'projects':
                this.openWindow('projects');
                output.textContent = 'Opening Projects window...';
                break;
            case 'resume':
                this.openWindow('resume');
                output.textContent = 'Opening Resume window...';
                break;
            case 'contact':
                this.openWindow('contact');
                output.textContent = 'Opening Contact window...';
                break;
            case 'gallery':
                this.openWindow('gallery');
                output.textContent = 'Opening Gallery window...';
                break;
            case 'clear':
                const outputs = content.querySelectorAll('.cmd-output, .cmd-line');
                outputs.forEach(el => {
                    if (el !== content.querySelector('.cmd-line:last-child')) {
                        el.remove();
                    }
                });
                return;
            case 'bsod':
                this.showBSOD();
                output.textContent = 'Initiating system crash...';
                break;
            default:
                output.textContent = `'${command}' is not recognized as an internal or external command, operable program or batch file.`;
        }

        content.scrollTop = content.scrollHeight;
    }

    setupWindowEvents(windowElement, windowId) {
        const header = windowElement.querySelector('.window-header');
        const controls = windowElement.querySelectorAll('.window-control');

        // Make window draggable
        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-control')) return;
            
            this.isDragging = true;
            this.bringToFront(windowId);
            this.focusWindow(windowId);
            
            const rect = windowElement.getBoundingClientRect();
            this.dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        });

        // Window controls
        controls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = control.dataset.action;
                
                switch (action) {
                    case 'minimize':
                        this.minimizeWindow(windowId);
                        break;
                    case 'maximize':
                        this.toggleMaximize(windowId);
                        break;
                    case 'close':
                        this.closeWindow(windowId);
                        break;
                }
            });
        });

        // Click to focus
        windowElement.addEventListener('mousedown', () => {
            this.focusWindow(windowId);
        });
    }

    addToTaskbar(windowId, title) {
        const taskbarApps = document.getElementById('taskbar-apps');
        const appButton = document.createElement('div');
        appButton.className = 'taskbar-app';
        appButton.textContent = title;
        appButton.dataset.windowId = windowId;
        
        appButton.addEventListener('click', () => {
            this.focusWindow(windowId);
        });
        
        taskbarApps.appendChild(appButton);
    }

    removeFromTaskbar(windowId) {
        const appButton = document.querySelector(`[data-window-id="${windowId}"]`);
        if (appButton) {
            appButton.remove();
        }
    }

    focusWindow(windowId) {
        // Remove active class from all windows
        document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
        document.querySelectorAll('.taskbar-app').forEach(a => a.classList.remove('active'));
        
        // Add active class to focused window
        const windowElement = document.getElementById(`window-${windowId}`);
        const taskbarApp = document.querySelector(`[data-window-id="${windowId}"]`);
        
        if (windowElement) {
            windowElement.classList.add('active');
        }
        if (taskbarApp) {
            taskbarApp.classList.add('active');
        }
        
        this.activeWindow = windowId;
    }

    bringToFront(windowId) {
        const windowElement = document.getElementById(`window-${windowId}`);
        if (windowElement) {
            // Bring to front by setting high z-index
            const maxZ = Math.max(...Array.from(document.querySelectorAll('.window')).map(w => parseInt(w.style.zIndex) || 0));
            windowElement.style.zIndex = maxZ + 1;
        }
    }

    minimizeWindow(windowId) {
        const windowElement = document.getElementById(`window-${windowId}`);
        if (windowElement) {
            windowElement.style.display = 'none';
            this.playSound('minimize');
        }
    }

    toggleMaximize(windowId) {
        const windowElement = document.getElementById(`window-${windowId}`);
        if (windowElement) {
            windowElement.classList.toggle('maximized');
            this.playSound('maximize');
        }
    }

    closeWindow(windowId) {
        const windowElement = document.getElementById(`window-${windowId}`);
        if (windowElement) {
            windowElement.remove();
            this.windows.delete(windowId);
            this.removeFromTaskbar(windowId);
            this.playSound('close');
        }
    }

    toggleStartMenu() {
        this.startMenuVisible = !this.startMenuVisible;
        const startMenu = document.getElementById('start-menu');
        
        if (this.startMenuVisible) {
            startMenu.classList.add('visible');
            this.playSound('menu');
        } else {
            startMenu.classList.remove('visible');
        }
    }

    hideStartMenu() {
        this.startMenuVisible = false;
        document.getElementById('start-menu').classList.remove('visible');
    }

    showContextMenu(x, y) {
        const contextMenu = document.getElementById('context-menu');
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.classList.add('visible');
        this.contextMenuVisible = true;
        this.playSound('menu');
    }

    hideContextMenu() {
        this.contextMenuVisible = false;
        document.getElementById('context-menu').classList.remove('visible');
    }

    refreshDesktop() {
        // Simulate desktop refresh
        this.playSound('refresh');
        // Could add visual effects here
    }

    showProperties() {
        this.openWindow('about');
    }

    showBSOD() {
        const bsod = document.getElementById('bsod');
        bsod.classList.add('visible');
        bsod.focus();
        this.playSound('error');
    }

    hideBSOD() {
        const bsod = document.getElementById('bsod');
        bsod.classList.remove('visible');
    }

    playSound(type) {
        // Simple sound simulation using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            let frequency = 440;
            let duration = 0.1;
            
            switch (type) {
                case 'boot':
                    frequency = 220;
                    duration = 0.5;
                    break;
                case 'open':
                    frequency = 880;
                    duration = 0.2;
                    break;
                case 'close':
                    frequency = 220;
                    duration = 0.15;
                    break;
                case 'menu':
                    frequency = 660;
                    duration = 0.1;
                    break;
                case 'minimize':
                    frequency = 330;
                    duration = 0.1;
                    break;
                case 'maximize':
                    frequency = 550;
                    duration = 0.1;
                    break;
                case 'error':
                    frequency = 150;
                    duration = 0.3;
                    break;
                case 'refresh':
                    frequency = 440;
                    duration = 0.2;
                    break;
            }
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            // Silently fail if Web Audio API is not supported
        }
    }
}

// Global mouse events for dragging
document.addEventListener('mousemove', (e) => {
    if (window.portfolioApp && window.portfolioApp.isDragging && window.portfolioApp.activeWindow) {
        const windowElement = document.getElementById(`window-${window.portfolioApp.activeWindow}`);
        if (windowElement && !windowElement.classList.contains('maximized')) {
            windowElement.style.left = `${e.clientX - window.portfolioApp.dragOffset.x}px`;
            windowElement.style.top = `${e.clientY - window.portfolioApp.dragOffset.y}px`;
        }
    }
});

document.addEventListener('mouseup', () => {
    if (window.portfolioApp) {
        window.portfolioApp.isDragging = false;
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});
