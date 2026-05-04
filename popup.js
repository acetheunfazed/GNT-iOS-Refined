function openExtensionPage(path) {
  const url = chrome.runtime.getURL(path);
  chrome.tabs.create({ url }, () => window.close());
}

document.addEventListener('DOMContentLoaded', () => {
  const openTabButton = document.getElementById('openTab');

  if (openTabButton) {
    openTabButton.addEventListener('click', () => {
      openExtensionPage('newtab.html');
    });
  }
});
