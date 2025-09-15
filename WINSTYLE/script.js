
document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('boot-screen');
    const loadingBar = document.getElementById('loading-bar');
    const desktop = document.getElementById('desktop');
    const taskbarTime = document.getElementById('taskbar-time');
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const windows = document.querySelectorAll('.window');
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    const startMenuItems = document.querySelectorAll('.start-menu-item');
    const closeButtons = document.querySelectorAll('.close-btn');
    const cmdWindow = document.getElementById('cmd-window');
    const cmdInput = cmdWindow.querySelector('.cmd-input');
    const cmdOutput = cmdWindow.querySelector('.cmd-output');
    const bsodTriggerStart = document.getElementById('bsod-trigger-start');
    const bsodScreen = document.getElementById('bsod-screen');
    const contextMenu = document.getElementById('context-menu');
    const refreshDesktopBtn = document.getElementById('refresh-desktop');
    const newWindowBtn = document.getElementById('new-window-btn');
    const openAllWindowsBtn = document.getElementById('open-all-windows');
    const openSound = document.getElementById('open-sound');
    const closeSound = document.getElementById('close-sound');
    const bsodSound = document.getElementById('bsod-sound');

    let zIndexCounter = 10;
    let currentWindow = null;

    // Boot-up animation
    const bootSequence = () => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            loadingBar.style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    bootScreen.style.opacity = 0;
                    setTimeout(() => {
                        bootScreen.style.display = 'none';
                        desktop.style.display = 'block';
                    }, 1000);
                }, 500);
            }
        }, 100);
    };

    // Update Taskbar Time
    const updateTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        taskbarTime.textContent = `${hours % 12 || 12}:${minutes} ${ampm}`;
    };
    setInterval(updateTime, 1000);
    updateTime();

    // Handle window bringing to front
    const bringToFront = (windowElement) => {
        if (windowElement && windowElement.style.display === 'block') {
            zIndexCounter++;
            windowElement.style.zIndex = zIndexCounter;
        }
    };

    // Toggle Start Menu
    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'flex';
    });

    // Hide Start Menu and Context Menu when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && e.target !== startButton) {
            startMenu.style.display = 'none';
        }
        if (!contextMenu.contains(e.target)) {
            contextMenu.style.display = 'none';
        }
    });

    // Handle desktop icon clicks
    const openWindow = (targetId) => {
        const targetWindow = document.getElementById(targetId);
        if (targetWindow) {
            targetWindow.style.display = 'block';
            bringToFront(targetWindow);
            try { openSound.play(); } catch (e) { console.error("Could not play sound:", e); }
        }
    };

    desktopIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const targetId = icon.dataset.target;
            openWindow(targetId);
            e.stopPropagation();
        });
    });

    startMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.dataset.target;
            openWindow(targetId);
            startMenu.style.display = 'none';
        });
    });

    // Close window functionality
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetWindow = document.getElementById(targetId);
            if (targetWindow) {
                targetWindow.style.display = 'none';
                try { closeSound.play(); } catch (e) { console.error("Could not play sound:", e); }
            }
        });
    });

    // Make windows draggable
    windows.forEach(win => {
        const titleBar = win.querySelector('.window-title-bar');
        let isDragging = false;
        let offsetX, offsetY;

        win.addEventListener('mousedown', () => bringToFront(win));

        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
            titleBar.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                win.style.left = (e.clientX - offsetX) + 'px';
                win.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            titleBar.style.cursor = 'grab';
        });
    });

    // Command Prompt functionality
    cmdInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = cmdInput.value.toLowerCase().trim();
            const outputLine = `C:\\&gt;${command}\n`;

            let response = '';
            switch (command) {
                case 'about':
                    response = "Hello! I'm your name. I built this retro portfolio using vanilla HTML, CSS, and JS. I'm a developer with a passion for creative and interactive web experiences.";
                    openWindow('about-window');
                    break;
                case 'projects':
                    response = "To view my projects, please open the 'Projects' window.";
                    openWindow('projects-window');
                    break;
                case 'contact':
                    response = "You can find my contact information in the 'Contact Me' window.";
                    openWindow('contact-window');
                    break;
                case 'clear':
                    cmdOutput.innerHTML = 'Microsoft Windows [Version 5.1.2600]<br>(C) Copyright 1985-2001 Microsoft Corp.<br><br>';
                    response = '';
                    break;
                case 'help':
                    response = 'Available commands: about, projects, contact, clear, bsod, and help.';
                    break;
                case 'bsod':
                    showBsod();
                    break;
                default:
                    response = ` '${command}' is not recognized as an internal or external command, operable program or batch file.`;
                    break;
            }

            cmdOutput.textContent += outputLine + response + '\n\n';
            cmdInput.value = '';
            cmdOutput.scrollTop = cmdOutput.scrollHeight;
        }
    });

    // BSOD Easter Egg
    const showBsod = () => {
        desktop.style.display = 'none';
        bsodScreen.style.display = 'flex';
        try { bsodSound.play(); } catch (e) { console.error("Could not play sound:", e); }
        setTimeout(() => {
            bsodScreen.style.display = 'none';
            desktop.style.display = 'block';
        }, 5000);
    };

    bsodTriggerStart.addEventListener('click', showBsod);

    // Right-click context menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        contextMenu.style.display = 'flex';
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.top = `${e.clientY}px`;
    });

    // Context Menu actions
    refreshDesktopBtn.addEventListener('click', () => {
        location.reload();
    });

    newWindowBtn.addEventListener('click', () => {
        // Example of creating a new generic window
        const newWindow = document.createElement('div');
        newWindow.classList.add('window');
        newWindow.innerHTML = `
                    <div class="window-title-bar">
                        <span class="window-title">New Window</span>
                        <div class="window-controls">
                            <button class="close-btn">X</button>
                        </div>
                    </div>
                    <div class="window-content">
                        <p>This is a new window created dynamically.</p>
                    </div>
                `;
        document.getElementById('desktop').appendChild(newWindow);
        newWindow.style.display = 'block';
        bringToFront(newWindow);
        const newCloseBtn = newWindow.querySelector('.close-btn');
        const newTitleBar = newWindow.querySelector('.window-title-bar');

        newCloseBtn.addEventListener('click', () => {
            newWindow.style.display = 'none';
        });

        // Re-apply drag logic for new window
        let isDragging = false;
        let offsetX, offsetY;

        newTitleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - newWindow.offsetLeft;
            offsetY = e.clientY - newWindow.offsetTop;
            newTitleBar.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                newWindow.style.left = (e.clientX - offsetX) + 'px';
                newWindow.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            newTitleBar.style.cursor = 'grab';
        });
    });

    openAllWindowsBtn.addEventListener('click', () => {
        windows.forEach(win => {
            win.style.display = 'block';
            bringToFront(win);
        });
    });

    // Start the boot-up process
    bootSequence();
});
