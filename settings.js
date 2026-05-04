/* ========================================
   SETTINGS PAGE LOGIC
   ======================================== */

// Throttle utility for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const DEFAULT_SHORTCUTS = [
  { label: 'YouTube', url: 'https://youtube.com', icon: '▷' },
  { label: 'Gmail', url: 'https://gmail.com', icon: '✉' },
  { label: 'GitHub', url: 'https://github.com', icon: '⌘' },
  { label: 'Drive', url: 'https://drive.google.com', icon: '◎' },
  { label: 'Twitter', url: 'https://twitter.com', icon: '◆' },
  { label: 'Reddit', url: 'https://reddit.com', icon: '●' }
];

const WALLPAPERS = {
  gradient1: 'linear-gradient(to bottom, #0a1628 0%, #1a2942 50%, #2a3f5f 100%)',
  gradient2: 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  gradient3: 'linear-gradient(to bottom, #2c1a4d 0%, #3e2c5f 50%, #4a3869 100%)',
  gradient4: 'linear-gradient(to bottom, #1c3334 0%, #2d4a4a 50%, #3d5a5a 100%)'
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  loadSettings();
  initEventListeners();
});

// ==========================================
// APPLY THEME
// ==========================================

function applyTheme() {
  chrome.storage.sync.get(['theme'], (result) => {
    const theme = result.theme || 'auto';
    
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      
      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      });
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  });
}

// ==========================================
// LOAD SETTINGS
// ==========================================

function loadSettings() {
  chrome.storage.sync.get(['theme', 'wallpaper', 'shortcuts'], (result) => {
    // Theme
    const theme = result.theme || 'auto';
    document.getElementById('themeSelect').value = theme;
    
    // Wallpaper
    const wallpaper = result.wallpaper || 'gradient1';
    document.getElementById('wallpaperSelect').value = wallpaper;
    
    // Shortcuts
    const shortcuts = result.shortcuts || DEFAULT_SHORTCUTS;
    renderShortcuts(shortcuts);
  });
}

// ==========================================
// RENDER SHORTCUTS
// ==========================================

function renderShortcuts(shortcuts) {
  const list = document.getElementById('shortcutsList');
  if (!list) return;
  
  // Use DocumentFragment for batch DOM updates (better performance)
  const fragment = document.createDocumentFragment();
  
  shortcuts.forEach((shortcut) => {
    const item = document.createElement('div');
    item.className = 'shortcut-item';
    item.style.willChange = 'background-color';

    const icon = document.createElement('div');
    icon.className = 'shortcut-item-icon';
    icon.textContent = shortcut.icon || '';

    const info = document.createElement('div');
    info.className = 'shortcut-item-info';

    const label = document.createElement('div');
    label.className = 'shortcut-item-label';
    label.textContent = shortcut.label || '';

    const url = document.createElement('div');
    url.className = 'shortcut-item-url';
    url.textContent = shortcut.url || '';

    info.appendChild(label);
    info.appendChild(url);

    item.appendChild(icon);
    item.appendChild(info);
    
    fragment.appendChild(item);
  });
  
  // Clear and append all at once
  list.innerHTML = '';
  list.appendChild(fragment);
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function initEventListeners() {
  // Theme change listener
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const selectedTheme = e.target.value;
      
      // Apply theme immediately
      if (selectedTheme === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', selectedTheme);
      }
      
      // Save theme preference
      chrome.storage.sync.set({ theme: selectedTheme }, () => {
        showSaveStatus('✓ Theme updated', 'success');
      });
    });
  }
  
  // Save button
  document.getElementById('saveSettings').addEventListener('click', saveSettings);
  
  // Reset shortcuts
  document.getElementById('resetShortcuts').addEventListener('click', resetShortcuts);
  
  // Live preview for wallpaper with passive listener
  document.getElementById('wallpaperSelect').addEventListener('change', (e) => {
    const selectedWallpaper = e.target.value;
    document.body.style.background = WALLPAPERS[selectedWallpaper];
  }, { passive: true });
}

// ==========================================
// SAVE SETTINGS
// ==========================================

function saveSettings() {
  const theme = document.getElementById('themeSelect').value;
  const wallpaper = document.getElementById('wallpaperSelect').value;
  
  chrome.storage.sync.get(['shortcuts'], (result) => {
    const shortcuts = result.shortcuts || DEFAULT_SHORTCUTS;
    
    chrome.storage.sync.set({
      theme: theme,
      wallpaper: wallpaper,
      shortcuts: shortcuts
    }, () => {
      showSaveStatus('✓ Settings saved successfully!', 'success');
    });
  });
}

// ==========================================
// RESET SHORTCUTS
// ==========================================

function resetShortcuts() {
  if (confirm('Reset shortcuts to default? This cannot be undone.')) {
    renderShortcuts(DEFAULT_SHORTCUTS);
    chrome.storage.sync.set({ shortcuts: DEFAULT_SHORTCUTS }, () => {
      showSaveStatus('✓ Shortcuts reset to defaults', 'success');
    });
  }
}

// ==========================================
// SAVE STATUS MESSAGE
// ==========================================

function showSaveStatus(message, type) {
  const status = document.getElementById('saveStatus');
  status.textContent = message;
  status.className = `save-status ${type}`;
  
  setTimeout(() => {
    status.textContent = '';
    status.className = 'save-status';
  }, 3000);
}
