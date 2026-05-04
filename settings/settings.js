async function loadAndBind() {
  const status = document.getElementById('status');

  const elShowShortcuts = document.getElementById('showShortcuts');
  const elShowBookmarks = document.getElementById('showBookmarks');
  const elEnableSpotlightSearch = document.getElementById('enableSpotlightSearch');
  const elShowDock = document.getElementById('showDock');
  const elReduceMotion = document.getElementById('reduceMotion');
  const elReset = document.getElementById('resetSettings');

  const settings = await getSettings();

  elShowShortcuts.checked = !!settings.showShortcuts;
  elShowBookmarks.checked = !!settings.showBookmarks;
  elEnableSpotlightSearch.checked = !!settings.enableSpotlightSearch;
  elShowDock.checked = !!settings.showDock;
  elReduceMotion.checked = !!settings.reduceMotion;

  const bindToggle = (el, key) => {
    el.addEventListener('change', async () => {
      status.textContent = '';
      const next = {};
      next[key] = !!el.checked;
      await saveSettings(next);
      status.textContent = 'Saved';
      clearStatusLater(status);
    });
  };

  bindToggle(elShowShortcuts, 'showShortcuts');
  bindToggle(elShowBookmarks, 'showBookmarks');
  bindToggle(elEnableSpotlightSearch, 'enableSpotlightSearch');
  bindToggle(elShowDock, 'showDock');
  bindToggle(elReduceMotion, 'reduceMotion');

  elReset.addEventListener('click', async () => {
    const ok = confirm('Reset all settings to default?');
    if (!ok) return;

    const defaults = await resetSettings();

    elShowShortcuts.checked = !!defaults.showShortcuts;
    elShowBookmarks.checked = !!defaults.showBookmarks;
    elEnableSpotlightSearch.checked = !!defaults.enableSpotlightSearch;
    elShowDock.checked = !!defaults.showDock;
    elReduceMotion.checked = !!defaults.reduceMotion;

    status.textContent = 'Reset to defaults';
    clearStatusLater(status);
  });
}

function clearStatusLater(statusEl) {
  setTimeout(() => {
    if (statusEl) statusEl.textContent = '';
  }, 1200);
}

// ==========================================
// APPLY SYSTEM THEME
// ==========================================

function applySystemTheme() {
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

document.addEventListener('DOMContentLoaded', () => {
  applySystemTheme();
  loadAndBind().catch(() => {
    const status = document.getElementById('status');
    if (status) status.textContent = 'Unable to load settings.';
  });
});
