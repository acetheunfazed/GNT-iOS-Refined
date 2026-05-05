/**
 * iOS Glass Tab - Settings Store
 * Comprehensive settings with validation
 */

const DEFAULT_SETTINGS = Object.freeze({
  // === Display ===
  theme: 'system',           // 'system', 'light', 'dark'
  accentColor: '#007AFF',    // iOS Blue default
  blurIntensity: 20,         // 0-40
  reduceMotion: false,
  
  // === Clock ===
  showClock: true,
  clockStyle: 'analog',      // 'analog', 'digital'
  use12Hour: true,
  showSeconds: false,
  
  // === Greeting ===
  showGreeting: true,
  customText: '',            // Custom text below clock (empty = auto greeting)
  showQuotes: true,          // Motivational quotes
  
  // === Search ===
  showSearch: true,
  searchOnEnter: true,
  showSearchSuggestions: true,
  showVoiceSearch: false,    // Mic icon (requires permission)
  voiceLanguage: 'auto',     // 'auto' or English locale tag (en-US, en-GB, ...)
  
  // === Shortcuts ===
  showShortcuts: true,
  shortcutStyle: 'pills',    // 'pills', 'grid', 'list'
  shortcutIconStyle: 'auto', // 'auto', 'light', 'dark'
  adaptiveIcons: true,       // Icons adapt to theme
  maxShortcuts: 8,
  
  // === Weather ===
  showWeather: false,
  weatherUnit: 'celsius',    // 'celsius', 'fahrenheit'
  weatherLocation: '',       // City name or coords
  weatherApiKey: '',         // User's API key
  showHumidity: true,
  showFeelsLike: true,
  
  // === Bookmarks ===
  showBookmarks: false,
  
  // === Dock ===
  showDock: false,
  showAiTools: true,
  showCustomDock: true,
  
  // === Wallpaper ===
  wallpaperEnabled: false,
  wallpaperUrl: '',          // Base64 or URL
  wallpaperBlur: 0,          // 0-20
  wallpaperDim: 0,           // 0-50 (%)
  
  // === Advanced ===
  enableSpotlightSearch: true,  // Type anywhere to search
  showDateBelowClock: true,
});

// === Accent Color Presets ===
const ACCENT_COLORS = [
  { name: 'Blue', value: '#007AFF' },
  { name: 'Purple', value: '#AF52DE' },
  { name: 'Pink', value: '#FF2D55' },
  { name: 'Red', value: '#FF3B30' },
  { name: 'Orange', value: '#FF9500' },
  { name: 'Yellow', value: '#FFCC00' },
  { name: 'Green', value: '#34C759' },
  { name: 'Teal', value: '#5AC8FA' },
  { name: 'Indigo', value: '#5856D6' },
  { name: 'Graphite', value: '#8E8E93' },
];

// === Validation Helpers ===
function isPlainObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function clampNumber(value, min, max, fallback) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function normalizeHexColor(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toUpperCase();
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    // Expand shorthand
    const [, r, g, b] = trimmed.match(/^#(.)(.)(.)$/);
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return null;
}

function sanitizeString(value, allowed, fallback) {
  if (typeof value !== 'string') return fallback;
  const lower = value.toLowerCase().trim();
  return allowed.includes(lower) ? lower : fallback;
}

function sanitizeVoiceLanguage(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (trimmed.toLowerCase() === 'auto') return 'auto';
  if (/^en(?:[-_][a-zA-Z0-9]{2,8})*$/i.test(trimmed)) {
    const parts = trimmed.replace(/_/g, '-').split('-');
    return parts
      .map((part, idx) => (idx === 0 ? 'en' : part.toUpperCase()))
      .join('-');
  }
  return fallback;
}

function sanitizeSettings(input) {
  const i = isPlainObject(input) ? input : {};
  const d = DEFAULT_SETTINGS;

  return {
    // Display
    theme: sanitizeString(i.theme, ['system', 'light', 'dark'], d.theme),
    accentColor: normalizeHexColor(i.accentColor) ?? d.accentColor,
    blurIntensity: clampNumber(i.blurIntensity, 0, 40, d.blurIntensity),
    reduceMotion: typeof i.reduceMotion === 'boolean' ? i.reduceMotion : d.reduceMotion,
    
    // Clock
    showClock: typeof i.showClock === 'boolean' ? i.showClock : d.showClock,
    clockStyle: sanitizeString(i.clockStyle, ['analog', 'digital'], d.clockStyle),
    use12Hour: typeof i.use12Hour === 'boolean' ? i.use12Hour : d.use12Hour,
    showSeconds: typeof i.showSeconds === 'boolean' ? i.showSeconds : d.showSeconds,
    
    // Greeting
    showGreeting: typeof i.showGreeting === 'boolean' ? i.showGreeting : d.showGreeting,
    customText: typeof i.customText === 'string' ? i.customText.replace(/<[^>]*>/g, '').slice(0, 100) : d.customText,
    showQuotes: typeof i.showQuotes === 'boolean' ? i.showQuotes : d.showQuotes,
    
    // Search
    showSearch: typeof i.showSearch === 'boolean' ? i.showSearch : d.showSearch,
    searchOnEnter: typeof i.searchOnEnter === 'boolean' ? i.searchOnEnter : d.searchOnEnter,
    showSearchSuggestions: typeof i.showSearchSuggestions === 'boolean' ? i.showSearchSuggestions : d.showSearchSuggestions,
    showVoiceSearch: typeof i.showVoiceSearch === 'boolean' ? i.showVoiceSearch : d.showVoiceSearch,
    voiceLanguage: sanitizeVoiceLanguage(i.voiceLanguage, d.voiceLanguage),
    
    // Shortcuts
    showShortcuts: typeof i.showShortcuts === 'boolean' ? i.showShortcuts : d.showShortcuts,
    shortcutStyle: sanitizeString(i.shortcutStyle, ['pills', 'grid', 'list'], d.shortcutStyle),
    shortcutIconStyle: sanitizeString(i.shortcutIconStyle, ['auto', 'light', 'dark'], d.shortcutIconStyle),
    adaptiveIcons: typeof i.adaptiveIcons === 'boolean' ? i.adaptiveIcons : d.adaptiveIcons,
    maxShortcuts: clampNumber(i.maxShortcuts, 4, 16, d.maxShortcuts),
    
    // Weather
    showWeather: typeof i.showWeather === 'boolean' ? i.showWeather : d.showWeather,
    weatherUnit: sanitizeString(i.weatherUnit, ['celsius', 'fahrenheit'], d.weatherUnit),
    weatherLocation: typeof i.weatherLocation === 'string' ? i.weatherLocation.replace(/<[^>]*>/g, '').slice(0, 120) : d.weatherLocation,
    weatherApiKey: typeof i.weatherApiKey === 'string' && /^[a-zA-Z0-9_\-]{0,80}$/.test(i.weatherApiKey.trim()) ? i.weatherApiKey.trim().slice(0, 80) : d.weatherApiKey,
    showHumidity: typeof i.showHumidity === 'boolean' ? i.showHumidity : d.showHumidity,
    showFeelsLike: typeof i.showFeelsLike === 'boolean' ? i.showFeelsLike : d.showFeelsLike,
    
    // Bookmarks
    showBookmarks: typeof i.showBookmarks === 'boolean' ? i.showBookmarks : d.showBookmarks,
    
    // Dock
    showDock: typeof i.showDock === 'boolean' ? i.showDock : d.showDock,
    showAiTools: typeof i.showAiTools === 'boolean' ? i.showAiTools : d.showAiTools,
    showCustomDock: typeof i.showCustomDock === 'boolean' ? i.showCustomDock : d.showCustomDock,
    
    // Wallpaper
    wallpaperEnabled: typeof i.wallpaperEnabled === 'boolean' ? i.wallpaperEnabled : d.wallpaperEnabled,
    wallpaperUrl: typeof i.wallpaperUrl === 'string' ? i.wallpaperUrl : d.wallpaperUrl,
    wallpaperBlur: clampNumber(i.wallpaperBlur, 0, 20, d.wallpaperBlur),
    wallpaperDim: clampNumber(i.wallpaperDim, 0, 50, d.wallpaperDim),
    
    // Advanced
    enableSpotlightSearch: typeof i.enableSpotlightSearch === 'boolean' ? i.enableSpotlightSearch : d.enableSpotlightSearch,
    showDateBelowClock: typeof i.showDateBelowClock === 'boolean' ? i.showDateBelowClock : d.showDateBelowClock,
  };
}

// === Storage API ===
function storageGet(keys) {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(keys, (result) => resolve(result || {}));
    } else {
      // Fallback for testing
      resolve({});
    }
  });
}

function storageSet(items) {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set(items, () => resolve());
    } else {
      resolve();
    }
  });
}

async function getSettings() {
  const result = await storageGet(['settings']);
  const stored = result.settings;
  const merged = { ...DEFAULT_SETTINGS, ...(isPlainObject(stored) ? stored : {}) };
  return sanitizeSettings(merged);
}

async function saveSettings(nextSettings) {
  const current = await getSettings();
  const merged = { ...current, ...(isPlainObject(nextSettings) ? nextSettings : {}) };
  const sanitized = sanitizeSettings(merged);
  await storageSet({ settings: sanitized });
  return sanitized;
}

async function resetSettings() {
  await storageSet({ settings: { ...DEFAULT_SETTINGS } });
  return { ...DEFAULT_SETTINGS };
}

// === Shortcuts Storage ===
const DEFAULT_SHORTCUTS = [
  { name: 'YouTube', url: 'https://youtube.com' },
  { name: 'Gmail', url: 'https://gmail.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Drive', url: 'https://drive.google.com' },
];

async function getShortcuts() {
  const result = await storageGet(['shortcuts']);
  if (Array.isArray(result.shortcuts) && result.shortcuts.length > 0) {
    return result.shortcuts;
  }
  return DEFAULT_SHORTCUTS;
}

async function saveShortcuts(shortcuts) {
  if (!Array.isArray(shortcuts)) return;
  const clean = shortcuts
    .filter(s => isPlainObject(s) && typeof s.name === 'string' && typeof s.url === 'string')
    .slice(0, 16)
    .map(s => ({
      name: s.name.replace(/<[^>]*>/g, '').slice(0, 50),
      url: s.url.trim().slice(0, 500)
    }));
  await storageSet({ shortcuts: clean });
}

// === Backup & Restore ===
async function exportSettings() {
  const settings = await getSettings();
  const shortcuts = await getShortcuts();
  return JSON.stringify({ settings, shortcuts, version: 1 }, null, 2);
}

async function importSettings(jsonString) {
  try {
    if (typeof jsonString !== 'string' || jsonString.length > 5 * 1024 * 1024) return false;
    const data = JSON.parse(jsonString);
    if (!isPlainObject(data)) return false;
    if (data.settings) await saveSettings(data.settings);
    if (data.shortcuts) await saveShortcuts(data.shortcuts);
    return true;
  } catch {
    return false;
  }
}
