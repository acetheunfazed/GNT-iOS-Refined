async function initAppearance() {
  const status = document.getElementById('status');
  const blur = document.getElementById('blurIntensity');
  const blurValue = document.getElementById('blurValue');
  const reduceMotion = document.getElementById('reduceMotion');

  const settings = await getSettings();

  // Theme segmented buttons
  const themeButtons = Array.from(document.querySelectorAll('.seg-btn[data-theme]'));
  const setThemeUI = (theme) => {
    themeButtons.forEach((btn) => {
      const isActive = btn.getAttribute('data-theme') === theme;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };
  setThemeUI(settings.theme);

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      status.textContent = '';
      const theme = btn.getAttribute('data-theme');
      await saveSettings({ theme });
      setThemeUI(theme);
      status.textContent = 'Saved';
      clearStatusLater(status);
    });
  });

  // Accent dots
  const dotButtons = Array.from(document.querySelectorAll('.dot[data-color]'));
  const setAccentUI = (color) => {
    dotButtons.forEach((btn) => {
      const isActive = btn.getAttribute('data-color')?.toUpperCase() === color?.toUpperCase();
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.style.background = btn.getAttribute('data-color');
    });
  };
  setAccentUI(settings.accentColor);

  dotButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      status.textContent = '';
      const accentColor = btn.getAttribute('data-color');
      await saveSettings({ accentColor });
      setAccentUI(accentColor);
      status.textContent = 'Saved';
      clearStatusLater(status);
    });
  });

  // Blur slider
  blur.value = String(settings.blurIntensity);
  blurValue.textContent = String(settings.blurIntensity);

  blur.addEventListener('input', () => {
    blurValue.textContent = String(blur.value);
  });

  blur.addEventListener('change', async () => {
    status.textContent = '';
    await saveSettings({ blurIntensity: Number(blur.value) });
    status.textContent = 'Saved';
    clearStatusLater(status);
  });

  // Reduce motion
  reduceMotion.checked = !!settings.reduceMotion;
  reduceMotion.addEventListener('change', async () => {
    status.textContent = '';
    await saveSettings({ reduceMotion: !!reduceMotion.checked });
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
  initAppearance().catch(() => {
    const status = document.getElementById('status');
    if (status) status.textContent = 'Unable to load settings.';
  });
});
