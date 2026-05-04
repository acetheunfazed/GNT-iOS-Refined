const DEFAULT_SHORTCUTS = [
  { label: 'YouTube', url: 'https://youtube.com', icon: '▷' },
  { label: 'Gmail', url: 'https://gmail.com', icon: '✉' },
  { label: 'GitHub', url: 'https://github.com', icon: '⌘' },
  { label: 'Drive', url: 'https://drive.google.com', icon: '◎' },
  { label: 'Twitter', url: 'https://twitter.com', icon: '◆' },
  { label: 'Reddit', url: 'https://reddit.com', icon: '●' }
];

async function initShortcuts() {
  const status = document.getElementById('status');
  const elShow = document.getElementById('showShortcuts');
  const elStyle = document.getElementById('shortcutIconStyle');
  const elReset = document.getElementById('resetShortcuts');

  const settings = await getSettings();

  elShow.checked = !!settings.showShortcuts;
  elStyle.value = settings.shortcutIconStyle;

  elShow.addEventListener('change', async () => {
    status.textContent = '';
    await saveSettings({ showShortcuts: !!elShow.checked });
    status.textContent = 'Saved';
    clearStatusLater(status);
  });

  elStyle.addEventListener('change', async () => {
    status.textContent = '';
    await saveSettings({ shortcutIconStyle: elStyle.value });
    status.textContent = 'Saved';
    clearStatusLater(status);
  });

  elReset.addEventListener('click', async () => {
    const ok = confirm('Reset shortcuts to default?');
    if (!ok) return;

    await new Promise((resolve) => {
      chrome.storage.local.set({ shortcuts: DEFAULT_SHORTCUTS }, () => resolve());
    });

    status.textContent = 'Reset';
    clearStatusLater(status);
  });
}

function clearStatusLater(statusEl) {
  setTimeout(() => {
    if (statusEl) statusEl.textContent = '';
  }, 1200);
}

document.addEventListener('DOMContentLoaded', () => {
  initShortcuts().catch(() => {
    const status = document.getElementById('status');
    if (status) status.textContent = 'Unable to load settings.';
  });
});
