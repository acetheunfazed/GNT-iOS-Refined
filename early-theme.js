// Runs before main newtab.js to apply theme & wallpaper instantly, preventing flash.
(function () {
  'use strict';

  try {
    var saved = localStorage.getItem('ios-newtab-settings');
    if (!saved) return;
    var s = JSON.parse(saved);
    if (!s) return;

    // Apply theme immediately
    var theme = s.theme;
    if (theme === 'system' || !theme) {
      var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    }

    // Apply accent color immediately
    if (s.accentColor && /^#[0-9a-fA-F]{6}$/.test(s.accentColor)) {
      document.documentElement.style.setProperty('--accent', s.accentColor);
      var r = parseInt(s.accentColor.slice(1, 3), 16);
      var g = parseInt(s.accentColor.slice(3, 5), 16);
      var b = parseInt(s.accentColor.slice(5, 7), 16);
      document.documentElement.style.setProperty('--accent-rgb', r + ', ' + g + ', ' + b);
    }
  } catch (e) {
    // Silently ignore — main JS will handle it
  }

  // Check chrome.storage.local for wallpaper presence to prevent bg-gradient flash
  // We can't do async here, but we can mark that wallpaper *might* exist
  try {
    var wallFlag = localStorage.getItem('ios-newtab-has-wallpaper');
    if (wallFlag === '1') {
      document.documentElement.classList.add('wallpaper-pending');
    }
  } catch (e) {}
})();
