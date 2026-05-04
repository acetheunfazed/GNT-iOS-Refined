async function initSearch() {
  const status = document.getElementById('status');

  const elEnable = document.getElementById('enableSpotlightSearch');
  const elOnEnter = document.getElementById('searchOnEnter');
  const elSuggestions = document.getElementById('showSearchSuggestions');

  const settings = await getSettings();

  elEnable.checked = !!settings.enableSpotlightSearch;
  elOnEnter.checked = !!settings.searchOnEnter;
  elSuggestions.checked = !!settings.showSearchSuggestions;

  elEnable.addEventListener('change', async () => {
    status.textContent = '';
    await saveSettings({ enableSpotlightSearch: !!elEnable.checked });
    status.textContent = 'Saved';
    clearStatusLater(status);
  });

  elOnEnter.addEventListener('change', async () => {
    status.textContent = '';
    await saveSettings({ searchOnEnter: !!elOnEnter.checked });
    status.textContent = 'Saved';
    clearStatusLater(status);
  });

  elSuggestions.addEventListener('change', async () => {
    status.textContent = '';
    await saveSettings({ showSearchSuggestions: !!elSuggestions.checked });
    status.textContent = 'Saved';
    clearStatusLater(status);
  });
}

function clearStatusLater(statusEl) {
  setTimeout(() => {
    if (statusEl) statusEl.textContent = '';
  }, 1200);
}

document.addEventListener('DOMContentLoaded', () => {
  initSearch().catch(() => {
    const status = document.getElementById('status');
    if (status) status.textContent = 'Unable to load settings.';
  });
});
