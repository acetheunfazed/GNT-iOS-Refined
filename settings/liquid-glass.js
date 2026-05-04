/**
 * iOS Glass Tab - Settings UI Controller
 * Liquid Glass inspired interface
 */

let currentSettings = {};

// === Initialize ===
document.addEventListener('DOMContentLoaded', async () => {
  currentSettings = await getSettings();
  populateUI();
  setupListeners();
});

// === Populate UI from Settings ===
function populateUI() {
  const s = currentSettings;
  
  // Theme
  setActiveButton('themePicker', `[data-theme="${s.theme}"]`);
  
  // Accent Color
  setActiveColorDot(s.accentColor);
  document.getElementById('customColor').value = s.accentColor;
  document.documentElement.style.setProperty('--accent', s.accentColor);
  
  // Blur
  document.getElementById('blurSlider').value = s.blurIntensity;
  document.getElementById('blurValue').textContent = s.blurIntensity;
  
  // Checkboxes
  setCheckbox('reduceMotion', s.reduceMotion);
  setCheckbox('showClock', s.showClock);
  setCheckbox('use12Hour', s.use12Hour);
  setCheckbox('showDateBelowClock', s.showDateBelowClock);
  setCheckbox('showGreeting', s.showGreeting);
  setCheckbox('showQuotes', s.showQuotes);
  setCheckbox('showSearch', s.showSearch);
  setCheckbox('enableSpotlightSearch', s.enableSpotlightSearch);
  setCheckbox('showShortcuts', s.showShortcuts);
  setCheckbox('adaptiveIcons', s.adaptiveIcons);
  setCheckbox('showWeather', s.showWeather);
  setCheckbox('showBookmarks', s.showBookmarks);
  setCheckbox('showDock', s.showDock);
  setCheckbox('wallpaperEnabled', s.wallpaperEnabled);
  
  // Clock Style
  setActiveButton('clockStylePicker', `[data-value="${s.clockStyle}"]`);
  
  // Shortcut Style
  setActiveButton('shortcutStylePicker', `[data-value="${s.shortcutStyle}"]`);
  
  // Weather
  setActiveButton('weatherUnitPicker', `[data-value="${s.weatherUnit}"]`);
  document.getElementById('weatherLocation').value = s.weatherLocation || '';
  document.getElementById('weatherApiKey').value = s.weatherApiKey || '';
  
  // Custom Text
  document.getElementById('customText').value = s.customText || '';
  
  // Wallpaper
  document.getElementById('wallpaperBlur').value = s.wallpaperBlur;
  document.getElementById('wallpaperBlurValue').textContent = s.wallpaperBlur;
  document.getElementById('wallpaperDim').value = s.wallpaperDim;
  document.getElementById('wallpaperDimValue').textContent = s.wallpaperDim + '%';
}

// === Setup Event Listeners ===
function setupListeners() {
  // Theme Picker
  document.getElementById('themePicker').addEventListener('click', async (e) => {
    const btn = e.target.closest('.theme-btn');
    if (!btn) return;
    setActiveButton('themePicker', null, btn);
    await save({ theme: btn.dataset.theme });
  });
  
  // Color Picker
  document.getElementById('colorPicker').addEventListener('click', async (e) => {
    const dot = e.target.closest('.color-dot');
    if (!dot) return;
    const color = dot.dataset.color;
    setActiveColorDot(color);
    document.documentElement.style.setProperty('--accent', color);
    await save({ accentColor: color });
  });
  
  // Custom Color
  document.getElementById('customColor').addEventListener('input', async (e) => {
    const color = e.target.value.toUpperCase();
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
    document.documentElement.style.setProperty('--accent', color);
    await save({ accentColor: color });
  });
  
  // Blur Slider
  document.getElementById('blurSlider').addEventListener('input', async (e) => {
    const val = parseInt(e.target.value);
    document.getElementById('blurValue').textContent = val;
    await save({ blurIntensity: val });
  });
  
  // Wallpaper Blur
  document.getElementById('wallpaperBlur').addEventListener('input', async (e) => {
    const val = parseInt(e.target.value);
    document.getElementById('wallpaperBlurValue').textContent = val;
    await save({ wallpaperBlur: val });
  });
  
  // Wallpaper Dim
  document.getElementById('wallpaperDim').addEventListener('input', async (e) => {
    const val = parseInt(e.target.value);
    document.getElementById('wallpaperDimValue').textContent = val + '%';
    await save({ wallpaperDim: val });
  });
  
  // Checkbox Toggles
  const checkboxes = [
    'reduceMotion', 'showClock', 'use12Hour', 'showDateBelowClock',
    'showGreeting', 'showQuotes', 'showSearch',
    'enableSpotlightSearch', 'showShortcuts', 'adaptiveIcons',
    'showWeather', 'showBookmarks', 'showDock', 'wallpaperEnabled'
  ];
  
  checkboxes.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', async () => {
        await save({ [id]: el.checked });
      });
    }
  });
  
  // Clock Style
  document.getElementById('clockStylePicker').addEventListener('click', async (e) => {
    const btn = e.target.closest('.segment');
    if (!btn) return;
    setActiveButton('clockStylePicker', null, btn);
    await save({ clockStyle: btn.dataset.value });
  });
  
  // Shortcut Style
  document.getElementById('shortcutStylePicker').addEventListener('click', async (e) => {
    const btn = e.target.closest('.segment');
    if (!btn) return;
    setActiveButton('shortcutStylePicker', null, btn);
    await save({ shortcutStyle: btn.dataset.value });
  });
  
  // Weather Unit
  document.getElementById('weatherUnitPicker').addEventListener('click', async (e) => {
    const btn = e.target.closest('.segment');
    if (!btn) return;
    setActiveButton('weatherUnitPicker', null, btn);
    await save({ weatherUnit: btn.dataset.value });
  });
  
  // Text Inputs (debounced)
  setupDebouncedInput('customText', 'customText');
  setupDebouncedInput('weatherLocation', 'weatherLocation');
  setupDebouncedInput('weatherApiKey', 'weatherApiKey');
  
  // Edit Shortcuts
  document.getElementById('editShortcutsBtn').addEventListener('click', () => {
    // TODO: Open shortcuts editor modal
    alert('Shortcuts editor coming soon!');
  });
  
  // Wallpaper Upload
  document.getElementById('uploadWallpaper').addEventListener('click', () => {
    document.getElementById('wallpaperInput').click();
  });
  
  document.getElementById('wallpaperInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      await save({ wallpaperUrl: base64, wallpaperEnabled: true });
      setCheckbox('wallpaperEnabled', true);
    };
    reader.readAsDataURL(file);
  });
  
  // Random Wallpaper (Unsplash)
  document.getElementById('randomWallpaper').addEventListener('click', async () => {
    const url = 'https://source.unsplash.com/1920x1080/?nature,landscape';
    await save({ wallpaperUrl: url, wallpaperEnabled: true });
    setCheckbox('wallpaperEnabled', true);
  });
  
  // Remove Wallpaper
  document.getElementById('removeWallpaper').addEventListener('click', async () => {
    await save({ wallpaperUrl: '', wallpaperEnabled: false });
    setCheckbox('wallpaperEnabled', false);
  });
  
  // Backup
  document.getElementById('backupBtn').addEventListener('click', async () => {
    const data = await exportSettings();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ios-glass-tab-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  });
  
  // Restore
  document.getElementById('restoreBtn').addEventListener('click', () => {
    document.getElementById('restoreInput').click();
  });
  
  document.getElementById('restoreInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const success = await importSettings(event.target.result);
      if (success) {
        currentSettings = await getSettings();
        populateUI();
        alert('Settings restored successfully!');
      } else {
        alert('Failed to restore settings. Invalid file.');
      }
    };
    reader.readAsText(file);
  });
  
  // Reset
  document.getElementById('resetBtn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      await resetSettings();
      currentSettings = await getSettings();
      populateUI();
    }
  });
  
  // Feedback
  document.getElementById('feedbackBtn').addEventListener('click', () => {
    // Open feedback form or email
    window.location.href = `mailto:animeshpatra.dev@gmail.com?subject=${encodeURIComponent('iOS Glass Tab Feedback')}`;
  });
}

// === Helpers ===
async function save(partial) {
  currentSettings = await saveSettings(partial);
}

function setCheckbox(id, value) {
  const el = document.getElementById(id);
  if (el) el.checked = value;
}

function setActiveButton(containerId, selector, element) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const buttons = container.querySelectorAll('button');
  buttons.forEach(b => b.classList.remove('active'));
  
  if (element) {
    element.classList.add('active');
  } else if (selector) {
    const target = container.querySelector(selector);
    if (target) target.classList.add('active');
  }
}

function setActiveColorDot(color) {
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.classList.toggle('active', dot.dataset.color === color);
  });
}

function setupDebouncedInput(elementId, settingKey) {
  const el = document.getElementById(elementId);
  if (!el) return;
  
  let timeout;
  el.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      await save({ [settingKey]: el.value });
    }, 500);
  });
}
