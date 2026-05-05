// ============================================
// iOS New Tab Extension - JavaScript
// ============================================

// Default Settings - Comprehensive
const DEFAULT_SETTINGS = {
  userName: '',
  theme: 'system',
  accentColor: '#007AFF',
  // Motion / effects
  reduceMotion: false,
  // Stored by options UI today (future-tuning)
  blurIntensity: 20,
  // Clock settings
  hideClock: false,
  digitalClock: false,
  use12Hour: false,
  showSeconds: true,
  // Greeting settings
  showGreeting: true,
  showCustomText: true,
  // Search settings
  hideMic: false,
  hideEngines: false,
  voiceLanguage: 'auto',
  showQuotes: true,
  // Weather settings
  showWeather: true,
  useFahrenheit: false,
  weatherLocation: '',
  useGPS: false,
  weatherApiKey: '',
  // Apps settings
  showAllApps: true,
  adaptiveIcons: false,
  showTodoWidget: true,
  showStickyNotes: false,
  dockPosition: 'bottom',
  // Wallpaper
  wallpaper: '',
  // Wallpaper tuning (options UI)
  wallpaperEnabled: false,
  wallpaperUrl: '',
  wallpaperBlur: 0,
  wallpaperDim: 0,
  showAiTools: true,
  showCustomDock: true
};

// Default custom dock apps - Users can fully customize
const DEFAULT_DOCK_APPS = [
  { id: 1, name: 'Gmail', url: 'https://mail.google.com/', icon: '', domain: 'gmail.com' },
  { id: 2, name: 'YouTube', url: 'https://youtube.com/', icon: '', domain: 'youtube.com' },
  { id: 3, name: 'Gemini', url: 'https://gemini.google.com/', icon: '', domain: 'gemini.google.com' }
];

// Default AI tools
const DEFAULT_AI_TOOLS = [
  { id: 1, name: 'ChatGPT', url: 'https://chat.openai.com/' },
  { id: 2, name: 'Gemini', url: 'https://gemini.google.com/' },
  { id: 3, name: 'Claude', url: 'https://claude.ai/' },
  { id: 4, name: 'Perplexity', url: 'https://www.perplexity.ai/' },
  { id: 5, name: 'Midjourney', url: 'https://www.midjourney.com/' },
  { id: 6, name: 'Leonardo', url: 'https://leonardo.ai/' }
];

// Motivational Quotes
const quotes = [
  "Stay hungry, stay foolish.",
  "Focus creates results.",
  "Consistency beats intensity.",
  "Small steps still move you forward.",
  "Clarity turns effort into progress.",
  "Done is better than perfect.",
  "Simplicity scales.",
  "Discipline is choosing what matters most.",
  "Energy follows attention.",
  "You do not need more time, only less distraction.",
  "Start before you feel ready.",
  "Quality is a habit, not a mood.",
  "Protect your mornings, they shape your days.",
  "Progress compounds.",
  "Think long term, act today.",
  "The future depends on what you do today.",
  "What you repeat, you become.",
  "If it matters, schedule it.",
  "Simple routines build extraordinary outcomes.",
  "Calm mind, sharp work."
];

const QUOTE_STATE_KEY = 'ios-newtab-quote-state';
let _quoteState = null;
let _quoteTransitionTimer = null;
let _quoteAnimating = false;
const QUOTE_TRANSITION_MS = 220;

const DEFAULT_ALL_APPS = [
  { id: 1, name: 'YouTube', url: 'https://youtube.com' },
  { id: 2, name: 'Gmail', url: 'https://mail.google.com' },
  { id: 3, name: 'ChatGPT', url: 'https://chat.openai.com' },
  { id: 4, name: 'Gemini', url: 'https://gemini.google.com' },
  { id: 5, name: 'Drive', url: 'https://drive.google.com' },
  { id: 6, name: 'Maps', url: 'https://maps.google.com' },
  { id: 7, name: 'Photos', url: 'https://photos.google.com' },
  { id: 8, name: 'Calendar', url: 'https://calendar.google.com' }
];

let allApps = [...DEFAULT_ALL_APPS];

// Weather icons
const weatherIcons = {
  'sunny': '☀️', 'clear': '☀️',
  'partly cloudy': '⛅', 'cloudy': '☁️', 'overcast': '☁️',
  'mist': '🌫️', 'fog': '🌫️', 'haze': '🌫️',
  'rain': '🌧️', 'light rain': '🌦️', 'heavy rain': '🌧️', 'drizzle': '🌦️', 'showers': '🌦️',
  'thunder': '⛈️', 'thunderstorm': '⛈️',
  'snow': '❄️', 'sleet': '🌨️', 'blizzard': '🌨️',
  'wind': '💨', 'windy': '💨'
};

const DEFAULT_ENGINE_ICON_LIGHT = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666B74' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='7.5'/%3E%3Cpath d='M20 20l-4.2-4.2'/%3E%3C/svg%3E";
const DEFAULT_ENGINE_ICON_DARK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23F1F5FD' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='7.5'/%3E%3Cpath d='M20 20l-4.2-4.2'/%3E%3C/svg%3E";

const SEARCH_ENGINES = Object.freeze({
  default: {
    id: 'default',
    label: 'Default',
    iconUrl: DEFAULT_ENGINE_ICON_DARK,
    useChromeDefault: true,
    buildUrl: (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  },
  google: {
    id: 'google',
    label: 'Google',
    iconUrl: 'https://www.google.com/favicon.ico',
    buildUrl: (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  },
  duckduckgo: {
    id: 'duckduckgo',
    label: 'DuckDuckGo',
    iconUrl: 'https://duckduckgo.com/favicon.ico',
    buildUrl: (query) => `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
  },
  bing: {
    id: 'bing',
    label: 'Bing',
    iconUrl: 'https://www.bing.com/sa/simg/favicon-2x.ico',
    buildUrl: (query) => `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
  },
  brave: {
    id: 'brave',
    label: 'Brave',
    iconUrl: 'https://brave.com/favicon.ico',
    buildUrl: (query) => `https://search.brave.com/search?q=${encodeURIComponent(query)}`,
  },
  youtube: {
    id: 'youtube',
    label: 'YouTube',
    iconUrl: 'https://www.youtube.com/favicon.ico',
    buildUrl: (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  },
});

let _appsGridInitialized = false;
let _appsGridItems = [];
let _appsFilterRafId = null;
let currentSearchEngine = 'default';
let _searchIconZoomAnimationTimer = null;
let _wallpaperSwapToken = 0;
let _wallpaperCurrentCssUrl = '';
let _randomWallpaperInFlight = false;
let _uiScrollRafPending = false;

// State
let settings = { ...DEFAULT_SETTINGS };
let customDockApps = [...DEFAULT_DOCK_APPS];
let customAiTools = [...DEFAULT_AI_TOOLS];
const GEOLOCATION_TOGGLE_KEY = 'useGeolocation';

const DEBUG = false;

// ============================================
// Rate Prompt (Every N Visits)
// ============================================

const RATE_PROMPT_EVERY = 60;
const RATE_STORE_URL = 'https://chromewebstore.google.com/detail/pdjebhcifgoembcidgjhdjohnkgcbflb?utm_source=item-share-cb';

const _RATE_LS_KEYS = {
  visitCount: 'gnt_rateVisitCount',
  rated: 'gnt_rateRated',
  nextAt: 'gnt_rateNextAt',
  pending: 'gnt_ratePending',
};

let _rateLastVisitCount = 0;

function readLocalBool(key, fallback = false) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    return fallback;
  } catch {
    return fallback;
  }
}

function writeLocalBool(key, value) {
  try {
    localStorage.setItem(key, value ? 'true' : 'false');
  } catch {
    // ignore
  }
}

function readLocalInt(key, fallback = 0) {
  try {
    const raw = localStorage.getItem(key);
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalInt(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

function isWelcomeOverlayVisible() {
  const overlay = document.getElementById('welcomeOverlay');
  if (!overlay) return false;
  // Inline style is used to show/hide, so this is sufficient.
  return overlay.style.display && overlay.style.display !== 'none';
}

async function maybeShowRatePrompt() {
  try {
    // Synchronous increment so rapid refreshes still count.
    const ratedLocal = readLocalBool(_RATE_LS_KEYS.rated, false);
    if (ratedLocal) return;

    // If chrome.storage.local already has a higher count, seed localStorage once.
    const visitCountLocal = readLocalInt(_RATE_LS_KEYS.visitCount, 0);
    if (visitCountLocal === 0 && hasChromeStorage()) {
      const seed = await storageLocalGet(['rateVisitCount', 'rateNextAt', 'rateRated']);
      const seedRated = !!seed.rateRated;
      if (seedRated) {
        writeLocalBool(_RATE_LS_KEYS.rated, true);
        return;
      }
      const seedCount = Number.isFinite(Number(seed.rateVisitCount)) ? Number(seed.rateVisitCount) : 0;
      if (seedCount > 0) writeLocalInt(_RATE_LS_KEYS.visitCount, seedCount);
      const seedNextAt = Number.isFinite(Number(seed.rateNextAt)) ? Number(seed.rateNextAt) : 0;
      if (seedNextAt > 0) writeLocalInt(_RATE_LS_KEYS.nextAt, seedNextAt);
    }

    let current = readLocalInt(_RATE_LS_KEYS.visitCount, 0);
    let nextCount = current;
    let pending = readLocalBool(_RATE_LS_KEYS.pending, false);

    // Once threshold is reached, keep a pending flag so quick reloads can't skip the popup.
    if (!pending) {
      nextCount = current + 1;
      _rateLastVisitCount = nextCount;
      writeLocalInt(_RATE_LS_KEYS.visitCount, nextCount);
    }

    let nextAt = readLocalInt(_RATE_LS_KEYS.nextAt, 0);
    if (!Number.isFinite(nextAt) || nextAt <= 0) nextAt = RATE_PROMPT_EVERY;

    // Best-effort sync to chrome.storage.local too.
    void storageLocalSet({ rateVisitCount: nextCount, rateNextAt: nextAt });

    if (!pending && nextCount >= nextAt) {
      pending = true;
      writeLocalBool(_RATE_LS_KEYS.pending, true);
    }

    if (!pending) return;
    if (isWelcomeOverlayVisible()) return;
    if (isAnyModalOpen()) return;
    if (document.visibilityState && document.visibilityState !== 'visible') return;

    // Open immediately to avoid missing the threshold during rapid refresh testing.
    if (_timeouts.ratePrompt) {
      try { clearTimeout(_timeouts.ratePrompt); } catch { /* ignore */ }
      _timeouts.ratePrompt = null;
    }
    writeLocalBool(_RATE_LS_KEYS.pending, false);
    openRateModal();
  } catch (e) {
    if (DEBUG) console.log('Rate prompt error:', e);
  }
}

function isAnyModalOpen() {
  const modalIds = ['appsModal', 'todoModal', 'nameModal', 'rateModal', 'supportModal', 'feedbackModal'];
  const anyModal = modalIds.some((id) => {
    const el = document.getElementById(id);
    return !!(el && el.classList.contains('active'));
  });
  if (anyModal) return true;

  const settingsPanel = document.getElementById('settingsPanel');
  if (settingsPanel && settingsPanel.classList.contains('active')) return true;

  const stickyNotes = document.getElementById('stickyNotes');
  if (stickyNotes && stickyNotes.classList.contains('open')) return true;

  return false;
}

function openRateModal() {
  const modal = document.getElementById('rateModal');
  const overlay = document.getElementById('rateOverlay');
  if (!modal || !overlay) return;

  // Reset to step 1 (satisfaction check)
  showRateStep(1);

  modal.classList.add('active');
  overlay.classList.add('active');

  // Focus first satisfaction button
  const loveBtn = document.getElementById('satisfactionLove');
  if (loveBtn) setTimeout(() => loveBtn.focus(), 60);
}

function showRateStep(stepNumber) {
  const steps = document.querySelectorAll('.rate-step');
  steps.forEach((step) => {
    if (step.id === `rateStep${stepNumber}`) {
      step.classList.remove('hidden');
    } else {
      step.classList.add('hidden');
    }
  });
}

async function closeRateModal({ rated = false } = {}) {
  const modal = document.getElementById('rateModal');
  const overlay = document.getElementById('rateOverlay');
  if (modal) modal.classList.remove('active');
  if (overlay) overlay.classList.remove('active');

  const currentCount = _rateLastVisitCount || readLocalInt(_RATE_LS_KEYS.visitCount, 0);
  if (rated) {
    writeLocalBool(_RATE_LS_KEYS.rated, true);
    writeLocalBool(_RATE_LS_KEYS.pending, false);
    // Clear nextAt so it never shows again.
    writeLocalInt(_RATE_LS_KEYS.nextAt, 0);
    void storageLocalSet({ rateRated: true, rateNextAt: 0 });
  } else {
    writeLocalBool(_RATE_LS_KEYS.pending, false);
    // Schedule the next prompt for exactly +RATE_PROMPT_EVERY visits from now.
    const nextAt = Math.max(1, currentCount) + RATE_PROMPT_EVERY;
    writeLocalInt(_RATE_LS_KEYS.nextAt, nextAt);
    void storageLocalSet({ rateNextAt: nextAt });
  }
}

// ============================================
// Support Prompt (Every N Visits)
// ============================================

const SUPPORT_PROMPT_EVERY = 120;
const SUPPORT_COFFEE_URL = 'https://rzp.io/rzp/IwI9196l';

const _SUPPORT_LS_KEYS = {
  visitCount: 'gnt_supportVisitCount',
  supported: 'gnt_supportSupported',
  nextAt: 'gnt_supportNextAt',
};

let _supportLastVisitCount = 0;

async function maybeShowSupportPrompt() {
  try {
    // If the user already supported, never show again.
    const supportedLocal = readLocalBool(_SUPPORT_LS_KEYS.supported, false);
    if (supportedLocal) return;

    // Synchronous increment so rapid refreshes still count.
    const current = readLocalInt(_SUPPORT_LS_KEYS.visitCount, 0);
    const nextCount = current + 1;
    _supportLastVisitCount = nextCount;
    writeLocalInt(_SUPPORT_LS_KEYS.visitCount, nextCount);

    let nextAt = readLocalInt(_SUPPORT_LS_KEYS.nextAt, 0);
    if (!Number.isFinite(nextAt) || nextAt <= 0) nextAt = SUPPORT_PROMPT_EVERY;

    if (nextCount < nextAt) return;
    if (isWelcomeOverlayVisible()) return;
    if (isAnyModalOpen()) return;

    // Open with a small delay so the page doesn't feel jumpy.
    if (_timeouts.supportPrompt) {
      try { clearTimeout(_timeouts.supportPrompt); } catch { /* ignore */ }
      _timeouts.supportPrompt = null;
    }
    _timeouts.supportPrompt = setTimeout(() => {
      _timeouts.supportPrompt = null;
      if (isWelcomeOverlayVisible()) return;
      if (isAnyModalOpen()) return;
      if (document.visibilityState && document.visibilityState !== 'visible') return;
      openSupportModal();
    }, 300);
  } catch (e) {
    if (DEBUG) console.log('Support prompt error:', e);
  }
}

function openSupportModal() {
  const modal = document.getElementById('supportModal');
  const overlay = document.getElementById('supportOverlay');
  if (!modal || !overlay) return;

  modal.classList.add('active');
  overlay.classList.add('active');

  // Focus primary action for keyboard users.
  const btn = document.getElementById('supportNowBtn');
  if (btn) setTimeout(() => btn.focus(), 60);
}

async function closeSupportModal({ supported = false } = {}) {
  const modal = document.getElementById('supportModal');
  const overlay = document.getElementById('supportOverlay');
  if (modal) modal.classList.remove('active');
  if (overlay) overlay.classList.remove('active');

  const currentCount = _supportLastVisitCount || readLocalInt(_SUPPORT_LS_KEYS.visitCount, 0);
  if (supported) {
    writeLocalBool(_SUPPORT_LS_KEYS.supported, true);
    // Clear nextAt so it never shows again.
    writeLocalInt(_SUPPORT_LS_KEYS.nextAt, 0);
    return;
  }

  // Schedule the next prompt for exactly +SUPPORT_PROMPT_EVERY visits from now.
  const nextAt = Math.max(1, currentCount) + SUPPORT_PROMPT_EVERY;
  writeLocalInt(_SUPPORT_LS_KEYS.nextAt, nextAt);
}

// ============================================
// Feedback Prompt (Every N Visits)
// ============================================

const FEEDBACK_PROMPT_EVERY = 160;
const FEEDBACK_FORM_URL = 'https://forms.gle/sc6oMp5k8JngA52PA';

const _FEEDBACK_LS_KEYS = {
  visitCount: 'gnt_feedbackVisitCount',
  submitted: 'gnt_feedbackSubmitted',
  nextAt: 'gnt_feedbackNextAt',
  pending: 'gnt_feedbackPending',
};

let _feedbackLastVisitCount = 0;

async function maybeShowFeedbackPrompt() {
  try {
    const submittedLocal = readLocalBool(_FEEDBACK_LS_KEYS.submitted, false);
    if (submittedLocal) return;

    let current = readLocalInt(_FEEDBACK_LS_KEYS.visitCount, 0);
    let nextCount = current;
    let pending = readLocalBool(_FEEDBACK_LS_KEYS.pending, false);

    if (!pending) {
      nextCount = current + 1;
      _feedbackLastVisitCount = nextCount;
      writeLocalInt(_FEEDBACK_LS_KEYS.visitCount, nextCount);
    }

    let nextAt = readLocalInt(_FEEDBACK_LS_KEYS.nextAt, 0);
    if (!Number.isFinite(nextAt) || nextAt <= 0) nextAt = FEEDBACK_PROMPT_EVERY;

    if (!pending && nextCount >= nextAt) {
      pending = true;
      writeLocalBool(_FEEDBACK_LS_KEYS.pending, true);
    }

    if (!pending) return;
    if (isWelcomeOverlayVisible()) return;
    if (isAnyModalOpen()) return;
    if (document.visibilityState && document.visibilityState !== 'visible') return;

    if (_timeouts.feedbackPrompt) {
      try { clearTimeout(_timeouts.feedbackPrompt); } catch { /* ignore */ }
      _timeouts.feedbackPrompt = null;
    }

    writeLocalBool(_FEEDBACK_LS_KEYS.pending, false);
    openFeedbackModal();
  } catch (e) {
    if (DEBUG) console.log('Feedback prompt error:', e);
  }
}

function openFeedbackModal() {
  const modal = document.getElementById('feedbackModal');
  const overlay = document.getElementById('feedbackOverlay');
  if (!modal || !overlay) return;

  modal.classList.add('active');
  overlay.classList.add('active');

  const btn = document.getElementById('feedbackNowBtn');
  if (btn) setTimeout(() => btn.focus(), 60);
}

async function closeFeedbackModal({ submitted = false } = {}) {
  const modal = document.getElementById('feedbackModal');
  const overlay = document.getElementById('feedbackOverlay');
  if (modal) modal.classList.remove('active');
  if (overlay) overlay.classList.remove('active');

  const currentCount = _feedbackLastVisitCount || readLocalInt(_FEEDBACK_LS_KEYS.visitCount, 0);
  if (submitted) {
    writeLocalBool(_FEEDBACK_LS_KEYS.submitted, true);
    writeLocalBool(_FEEDBACK_LS_KEYS.pending, false);
    writeLocalInt(_FEEDBACK_LS_KEYS.nextAt, 0);
  } else {
    writeLocalBool(_FEEDBACK_LS_KEYS.pending, false);
    const nextAt = Math.max(1, currentCount) + FEEDBACK_PROMPT_EVERY;
    writeLocalInt(_FEEDBACK_LS_KEYS.nextAt, nextAt);
  }
}

// ============================================
// Security Utilities
// ============================================

// Input length limits
const INPUT_LIMITS = {
  userName: 22,
  todoText: 80,
  stickyNotes: 4000,
  dockAppName: 30,
  dockAppUrl: 2000,
  weatherLocation: 120,
  weatherApiKey: 80,
  maxDockApps: 10,
  maxTodos: 50,
  maxWallpaperBytes: 5 * 1024 * 1024,  // 5MB
  maxIconBytes: 512 * 1024,             // 512KB
  maxBackupBytes: 5 * 1024 * 1024,      // 5MB
};

// Strip HTML tags from text input (prevents XSS via textContent)
function sanitizeText(str, maxLen) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim().slice(0, maxLen || 200);
}

function collapseRepeatedProtocolPrefix(url) {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  return trimmed.replace(/^(https?:\/\/){2,}/i, (match) => {
    const schemes = match.match(/https?:\/\//ig) || [];
    return schemes.length ? schemes[schemes.length - 1].toLowerCase() : match;
  });
}

// Validate URL strictly — must be http(s)
function validateUrl(url) {
  if (typeof url !== 'string') return { valid: false, message: 'URL must be a string.' };
  const trimmed = collapseRepeatedProtocolPrefix(url);
  if (!trimmed) return { valid: false, message: 'URL cannot be empty.' };
  if (trimmed.length > INPUT_LIMITS.dockAppUrl) return { valid: false, message: `URL too long (max ${INPUT_LIMITS.dockAppUrl} chars).` };

  // Block dangerous protocols
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:') || lower.startsWith('blob:')) {
    return { valid: false, message: 'Dangerous URL protocol blocked.' };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, message: 'Only https:// URLs are allowed.' };
    }

    // Security hardening: require HTTPS except localhost/private development.
    const host = (parsed.hostname || '').toLowerCase();
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1';
    if (parsed.protocol === 'http:' && !isLocal) {
      return { valid: false, message: 'Use HTTPS URLs for security.' };
    }
    return { valid: true, url: parsed.toString() };
  } catch {
    // Try adding https://
    try {
      const parsed = new URL(`https://${trimmed}`);
      if (parsed.protocol === 'https:') {
        return { valid: true, url: parsed.toString() };
      }
    } catch {}
    return { valid: false, message: 'Invalid URL format. Example: https://example.com' };
  }
}

// Validate file upload (type + size)
function validateFileUpload(file, { allowedTypes, maxBytes, label }) {
  if (!file) return { valid: false, message: 'No file selected.' };
  if (allowedTypes && allowedTypes.length > 0) {
    const ext = (file.name || '').split('.').pop().toLowerCase();
    // Derive allowed extensions from MIME types (no hardcoded list)
    const mimeToExt = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/x-icon': 'ico', 'image/svg+xml': 'svg' };
    const allowedExts = allowedTypes.map(t => mimeToExt[t]).filter(Boolean);
    // Also accept 'jpeg' as alias for 'jpg'
    if (allowedExts.includes('jpg')) allowedExts.push('jpeg');
    const validType = allowedTypes.some(t => file.type === t) || allowedExts.includes(ext);
    if (!validType) {
      return { valid: false, message: `${label || 'File'}: unsupported format (${allowedExts.join(', ')}).` };
    }
  }
  if (maxBytes && file.size > maxBytes) {
    const sizeMB = (maxBytes / (1024 * 1024)).toFixed(1);
    return { valid: false, message: `${label || 'File'} too large (max ${sizeMB}MB). Please use a smaller file.` };
  }
  return { valid: true };
}

// Show a brief inline error message near an input element
function showInputError(inputEl, message, durationMs = 3000) {
  if (!inputEl) return;
  // Remove existing error tooltip
  const existing = inputEl.parentElement?.querySelector('.input-error-tooltip');
  if (existing) existing.remove();

  const tooltip = document.createElement('div');
  tooltip.className = 'input-error-tooltip';
  tooltip.textContent = message;
  tooltip.setAttribute('role', 'alert');

  // Style inline for safety (no CSS class needed)
  Object.assign(tooltip.style, {
    position: 'absolute',
    bottom: '-24px',
    left: '0',
    right: '0',
    fontSize: '11px',
    color: '#FF3B30',
    background: 'rgba(255,59,48,0.12)',
    padding: '3px 8px',
    borderRadius: '6px',
    zIndex: '200',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });

  // Make parent relative if not already
  const parent = inputEl.parentElement;
  if (parent && getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }
  if (parent) parent.appendChild(tooltip);

  // Pulse the input red briefly
  inputEl.style.outline = '2px solid #FF3B30';
  setTimeout(() => {
    inputEl.style.outline = '';
    if (tooltip.parentElement) tooltip.remove();
  }, durationMs);
}

// ============================================
// Lifecycle & Cleanup Management
// Prevents memory leaks on repeated page loads
// ============================================

// Tracked intervals - all intervals MUST be registered here
const _intervals = {
  clock: null,
  date: null,
  greeting: null,
  weather: null,
  quote: null,
};

// Tracked timeouts
const _timeouts = {
  stickyNotesSave: null,
  clockAlign: null,
  weatherDebounce: null,
  ratePrompt: null,
  supportPrompt: null,
  feedbackPrompt: null,
  uiScroll: null,
  glassRestore: null,
};

// Tracked event listener references for removal
const _listeners = {
  storageChanged: null,
  themeChanged: null,
  appVisibilityChange: null,
  glassVisibilityChange: null,
  glassFocus: null,
  weatherVisibilityChange: null,
  pageShow: null,
  aiToolsClick: null,
  aiToolsResize: null,
  searchEngineDocClick: null,
  searchEngineKeydown: null,
};

// Initialization guard - prevents double-init
let _initialized = false;
// Unloading guard - prevents zombie async code from running after cleanup
let _unloading = false;

const GLASS_RESUME_DEBOUNCE_MS = 250;
let _lastGlassRestoreAt = 0;

const GLASS_REFRESH_SELECTOR = [
  '.glass',
  '.glass-card',
  '.dock',
  '.settings-panel',
  '.search-input-wrapper',
  '.clock-container.digital-mode .clock-face',
  '.todo-widget',
  '.sticky-notes',
  '.sticky-notes-fab',
  '.settings-btn',
  '.apps-modal'
].join(', ');

function forceSoftRepaint() {
  const body = document.body;
  if (!body) return;

  body.classList.add('glass-repaint-pulse');
  void body.offsetHeight;
  requestAnimationFrame(() => {
    body.classList.remove('glass-repaint-pulse');
  });
}

function restoreGlassEffect() {
  if (document.visibilityState !== 'visible') return;

  const targets = Array.from(document.querySelectorAll(GLASS_REFRESH_SELECTOR));
  if (!targets.length) {
    forceSoftRepaint();
    return;
  }

  const snapshots = targets.map((el) => ({
    el,
    backdrop: el.style.backdropFilter,
    webkitBackdrop: el.style.webkitBackdropFilter,
    transition: el.style.transition,
    willChange: el.style.willChange,
  }));

  snapshots.forEach(({ el, willChange }) => {
    el.style.transition = 'none';
    el.style.willChange = willChange ? `${willChange}, backdrop-filter` : 'backdrop-filter';
    el.style.backdropFilter = 'none';
    el.style.webkitBackdropFilter = 'none';
    void el.offsetHeight;
  });

  void document.body.offsetHeight;

  snapshots.forEach(({ el, backdrop, webkitBackdrop, transition, willChange }) => {
    el.style.backdropFilter = backdrop;
    el.style.webkitBackdropFilter = webkitBackdrop;
    el.style.transition = transition;
    el.style.willChange = willChange;
  });

  forceSoftRepaint();
}

function scheduleGlassRestore() {
  if (document.visibilityState !== 'visible') return;

  const now = Date.now();
  const elapsed = now - _lastGlassRestoreAt;
  const delay = elapsed >= GLASS_RESUME_DEBOUNCE_MS ? 80 : GLASS_RESUME_DEBOUNCE_MS;

  if (_timeouts.glassRestore) {
    try { clearTimeout(_timeouts.glassRestore); } catch (e) { /* ignore */ }
    _timeouts.glassRestore = null;
  }

  _timeouts.glassRestore = setTimeout(() => {
    _timeouts.glassRestore = null;
    _lastGlassRestoreAt = Date.now();
    restoreGlassEffect();
  }, delay);
}

function markUiScrolling() {
  const body = document.body;
  if (!body) return;

  if (_uiScrollRafPending) return;
  _uiScrollRafPending = true;

  requestAnimationFrame(() => {
    _uiScrollRafPending = false;
    body.classList.add('ui-scrolling');

    if (_timeouts.uiScroll) {
      try { clearTimeout(_timeouts.uiScroll); } catch (e) { /* ignore */ }
      _timeouts.uiScroll = null;
    }

    _timeouts.uiScroll = setTimeout(() => {
      _timeouts.uiScroll = null;
      body.classList.remove('ui-scrolling');
    }, 140);
  });
}

function bindScrollPerformance(container) {
  if (!container || container.dataset.scrollPerfBound === '1') return;
  container.dataset.scrollPerfBound = '1';

  const options = { passive: true };
  container.addEventListener('scroll', markUiScrolling, options);
  container.addEventListener('wheel', markUiScrolling, options);
  container.addEventListener('touchmove', markUiScrolling, options);
}

// Clear all tracked intervals
function clearAllIntervals() {
  Object.keys(_intervals).forEach(key => {
    if (_intervals[key] !== null) {
      try { clearInterval(_intervals[key]); } catch (e) { /* ignore */ }
      _intervals[key] = null;
    }
  });
}

// Clear all tracked timeouts
function clearAllTimeouts() {
  Object.keys(_timeouts).forEach(key => {
    if (_timeouts[key] !== null) {
      try { clearTimeout(_timeouts[key]); } catch (e) { /* ignore */ }
      _timeouts[key] = null;
    }
  });
}

// Remove all tracked event listeners
function removeAllListeners() {
  if (_listeners.storageChanged && hasChromeStorage() && chrome.storage.onChanged) {
    try { chrome.storage.onChanged.removeListener(_listeners.storageChanged); } catch (e) { /* ignore */ }
    _listeners.storageChanged = null;
  }
  if (_listeners.themeChanged) {
    try { window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', _listeners.themeChanged); } catch (e) { /* ignore */ }
    _listeners.themeChanged = null;
  }
  if (_listeners.appVisibilityChange) {
    try { document.removeEventListener('visibilitychange', _listeners.appVisibilityChange); } catch (e) { /* ignore */ }
    _listeners.appVisibilityChange = null;
  }
  if (_listeners.glassVisibilityChange) {
    try { document.removeEventListener('visibilitychange', _listeners.glassVisibilityChange); } catch (e) { /* ignore */ }
    _listeners.glassVisibilityChange = null;
  }
  if (_listeners.glassFocus) {
    try { window.removeEventListener('focus', _listeners.glassFocus); } catch (e) { /* ignore */ }
    _listeners.glassFocus = null;
  }
  if (_listeners.weatherVisibilityChange) {
    try { document.removeEventListener('visibilitychange', _listeners.weatherVisibilityChange); } catch (e) { /* ignore */ }
    _listeners.weatherVisibilityChange = null;
  }
  if (_listeners.pageShow) {
    try { window.removeEventListener('pageshow', _listeners.pageShow); } catch (e) { /* ignore */ }
    _listeners.pageShow = null;
  }
  if (_listeners.aiToolsClick) {
    try { document.removeEventListener('click', _listeners.aiToolsClick); } catch (e) { /* ignore */ }
    _listeners.aiToolsClick = null;
  }
  if (_listeners.aiToolsResize) {
    try { window.removeEventListener('resize', _listeners.aiToolsResize); } catch (e) { /* ignore */ }
    _listeners.aiToolsResize = null;
  }
  if (_listeners.searchEngineDocClick) {
    try { document.removeEventListener('click', _listeners.searchEngineDocClick); } catch (e) { /* ignore */ }
    _listeners.searchEngineDocClick = null;
  }
  if (_listeners.searchEngineKeydown) {
    try { document.removeEventListener('keydown', _listeners.searchEngineKeydown); } catch (e) { /* ignore */ }
    _listeners.searchEngineKeydown = null;
  }
}

// Clear all images to release memory
function clearAllImages() {
  document.querySelectorAll('img').forEach(resetImgElement);
}

// Clear heavy DOM content
function clearHeavyContent() {
  // NOTE: We intentionally do NOT clear wallpaper.style.backgroundImage here.
  // The browser frees this memory when the page unloads. Clearing it causes
  // a race condition where zombie async init code sees empty wallpaper and
  // removes the ios-newtab-has-wallpaper localStorage flag, breaking the
  // fast-load hint for the next new tab.
  
  // Clear dock icons
  const dockIcons = document.querySelectorAll('.dock img, .apps-grid img');
  dockIcons.forEach(resetImgElement);
}

function resetImgElement(img) {
  if (!img) return;
  try {
    img.onload = null;
    img.onerror = null;
  } catch {
    // ignore
  }
  // Don't clear img.src — that causes broken-image placeholders in Chromium.
  // Just detach handlers; the browser handles memory for navigated-away pages.
}

// Full cleanup on page hide/unload
function cleanupForUnload() {
  if (_unloading) return;
  _unloading = true;
  if (_quoteTransitionTimer) {
    try { clearTimeout(_quoteTransitionTimer); } catch (e) { /* ignore */ }
    _quoteTransitionTimer = null;
  }
  _quoteAnimating = false;
  stopClockTimer();
  clearAllIntervals();
  clearAllTimeouts();
  removeAllListeners();
  stopGeolocationWatch();
  clearHeavyContent();
  _initialized = false;
}

// Register pagehide handler immediately (unload is deprecated, don't use it)
window.addEventListener('pagehide', cleanupForUnload, { capture: true });

// For Chrome New Tab: use freeze event (BFCache)
document.addEventListener('freeze', cleanupForUnload, { capture: true });

// Re-initialize when tab becomes visible again after cleanup
// Also toggle .tab-hidden class to pause CSS animations (battery saver)
if (!_listeners.appVisibilityChange) {
  _listeners.appVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      document.documentElement.classList.remove('tab-hidden');
      scheduleGlassRestore();

      // Recover critical runtime systems after tab resume/throttling.
      updateClock(new Date());
      restoreFavicons();
      refreshWeatherIfNeeded();

      if (!_initialized) {
        _initialized = true;
        void runFullInit('visibilitychange');
      }
    } else {
      document.documentElement.classList.add('tab-hidden');
    }
  };
  document.addEventListener('visibilitychange', _listeners.appVisibilityChange);
}

function initGlassResumeListeners() {
  if (!_listeners.glassVisibilityChange) {
    _listeners.glassVisibilityChange = () => {
      if (document.hidden) return;
      scheduleGlassRestore();
    };
    document.addEventListener('visibilitychange', _listeners.glassVisibilityChange);
  }

  if (!_listeners.glassFocus) {
    _listeners.glassFocus = () => {
      if (document.visibilityState !== 'visible') return;
      scheduleGlassRestore();
    };
    window.addEventListener('focus', _listeners.glassFocus);
  }
}

initGlassResumeListeners();

// When returning via back/forward cache, visibilitychange may not fire.
// pageshow is the reliable signal to restore cleared images/UI.
if (!_listeners.pageShow) {
  _listeners.pageShow = (e) => {
    if (_initialized) return;
    _initialized = true;
    void runFullInit(e && e.persisted ? 'pageshow-bfcache' : 'pageshow');
  };
  window.addEventListener('pageshow', _listeners.pageShow);
}

async function runFullInit(source = 'init') {
  const initTimerLabel = `init:${source}`;
  try {
    if (console && typeof console.time === 'function') console.time(initTimerLabel);
    _unloading = false;
    await loadSettings();

    // Abort if page started unloading while we were awaiting settings.
    // This prevents zombie init from running applyWallpaper() with empty
    // settings and erasing the ios-newtab-has-wallpaper fast-load flag.
    if (_unloading) return;

    initClock();
    initDate();
    initGreeting();
    initSearch();
    initWeather();
    initDock();
    initAiTools();
    initSettingsPanel();
    initDockAppsSettings();
    initAiToolsSettings();
    initModals();
    initTodo();
    initStickyNotes();
    initEscapeKeyHandler();
    startQuoteInterval();
    initQuoteInteractions();
    applyTheme();
    applyAccentColor();
    applyWallpaper();
    applyAllSettings();

    // Show welcome overlay on first install
    showWelcomeIfFirstRun();

    // Rate prompt: count immediately (works even with rapid refresh)
    void maybeShowRatePrompt();

    // Support prompt: optional cadence
    void maybeShowSupportPrompt();

    // Feedback prompt: user feature request form cadence
    void maybeShowFeedbackPrompt();

    // Live-update when Options/settings pages save settings
    if (hasChromeStorage() && chrome.storage.onChanged) {
      if (!_listeners.storageChanged) {
        _listeners.storageChanged = (changes, areaName) => {
          if (areaName !== 'local') return;
          if (!changes.settings) return;

          const mapped = mapOptionsSettingsToNewtab(changes.settings.newValue);
          settings = { ...settings, ...sanitizeLoadedSettings(mapped) };
          applyMotionToggles();
          applyTheme();
          applyAccentColor();
          applyAllSettings();
        };
        chrome.storage.onChanged.addListener(_listeners.storageChanged);
      }
    }

    // Track theme change listener
    if (!_listeners.themeChanged) {
      _listeners.themeChanged = () => { if (settings.theme === 'system') applyTheme(); };
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', _listeners.themeChanged);
    }
  } catch (e) {
    console.error(source === 'init' ? 'Init error:' : `Re-init error (${source}):`, e);
  } finally {
    if (console && typeof console.timeEnd === 'function') console.timeEnd(initTimerLabel);
  }
}

// Debug helper - call window.__memDebug() in console to check status
if (DEBUG) {
  window.__memDebug = function() {
    const activeIntervals = Object.entries(_intervals).filter(([k,v]) => v !== null).map(([k]) => k);
    const activeTimeouts = Object.entries(_timeouts).filter(([k,v]) => v !== null).map(([k]) => k);
    const activeListeners = Object.entries(_listeners).filter(([k,v]) => v !== null).map(([k]) => k);
    const heap = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 'N/A';
    console.log('=== Memory Debug ===');
    console.log('Heap (MB):', heap);
    console.log('Active intervals:', activeIntervals.length ? activeIntervals.join(', ') : 'none');
    console.log('Active timeouts:', activeTimeouts.length ? activeTimeouts.join(', ') : 'none');
    console.log('Active listeners:', activeListeners.length ? activeListeners.join(', ') : 'none');
    console.log('Initialized:', _initialized);
    console.log('Geo watch ID:', geoWatchId);
    console.log('DOM nodes:', document.querySelectorAll('*').length);
      return { heap, activeIntervals, activeTimeouts, activeListeners, initialized: _initialized };
  };
}

// ============================================
// App Icon Helpers
// ============================================

function normalizeUrlForFavicon(rawUrl) {
  if (typeof rawUrl !== 'string') return null;
  const trimmed = collapseRepeatedProtocolPrefix(rawUrl);
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString();
  } catch {
    // Common during editing: allow "example.com" or "www.example.com"
    try {
      const parsed = new URL(`https://${trimmed}`);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
      return parsed.toString();
    } catch {
      return null;
    }
  }
}

function getHostnameFromAnyUrl(rawUrl) {
  const normalized = normalizeUrlForFavicon(rawUrl);
  if (!normalized) return null;
  try {
    return new URL(normalized).hostname;
  } catch {
    return null;
  }
}

const FAVICON_CACHE_KEY = 'ios-newtab-favicon-cache';
const FAVICON_CACHE_MAX_ENTRIES = 200;
let _faviconCache = null;

function isIpv4Hostname(hostname) {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname || '');
}

function getBaseDomainFromHostname(hostname) {
  if (typeof hostname !== 'string') return '';
  const host = hostname.trim().toLowerCase();
  if (!host) return '';

  if (host === 'localhost' || isIpv4Hostname(host)) return host;

  const parts = host.split('.').filter(Boolean);
  if (parts.length <= 2) return host;

  // Common multi-part public suffixes where registrable domain needs 3 labels.
  const twoPartSuffixes = new Set([
    'co.uk', 'org.uk', 'ac.uk', 'gov.uk',
    'co.in', 'org.in', 'net.in',
    'com.au', 'net.au', 'org.au',
    'co.jp', 'ne.jp', 'or.jp'
  ]);

  const tail = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  if (parts.length >= 3 && twoPartSuffixes.has(tail)) {
    return parts.slice(-3).join('.');
  }
  return parts.slice(-2).join('.');
}

function getBaseDomain(rawUrl) {
  const hostname = getHostnameFromAnyUrl(rawUrl);
  if (!hostname) return '';
  return getBaseDomainFromHostname(hostname);
}

function loadFaviconCache() {
  if (_faviconCache && typeof _faviconCache === 'object') return _faviconCache;
  try {
    const raw = localStorage.getItem(FAVICON_CACHE_KEY);
    if (!raw) {
      _faviconCache = {};
      return _faviconCache;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      _faviconCache = {};
      return _faviconCache;
    }
    _faviconCache = parsed;
    return _faviconCache;
  } catch {
    _faviconCache = {};
    return _faviconCache;
  }
}

function saveFaviconCache() {
  try {
    if (!_faviconCache || typeof _faviconCache !== 'object') return;
    localStorage.setItem(FAVICON_CACHE_KEY, JSON.stringify(_faviconCache));
  } catch {
    // ignore cache write failures
  }
}

function getCachedFaviconUrl(hostname) {
  if (typeof hostname !== 'string' || !hostname) return '';
  const cache = loadFaviconCache();
  const key = hostname.toLowerCase();
  const value = cache[key];
  return typeof value === 'string' ? value : '';
}

function isGenericGoogleFallbackFavicon(iconUrl) {
  if (typeof iconUrl !== 'string' || !iconUrl) return false;
  try {
    const parsed = new URL(iconUrl);
    const host = parsed.hostname.toLowerCase();
    if (host !== 'www.google.com' && host !== 'google.com') return false;
    if (!parsed.pathname.startsWith('/s2/favicons')) return false;
    const domain = (parsed.searchParams.get('domain') || '').toLowerCase();
    return domain === 'google.com';
  } catch {
    return false;
  }
}

function shouldUseCachedFaviconForHost(hostname, iconUrl) {
  if (typeof hostname !== 'string' || !hostname) return false;
  if (typeof iconUrl !== 'string' || !iconUrl) return false;

  const host = hostname.toLowerCase();
  if (isGenericGoogleFallbackFavicon(iconUrl)) {
    return host === 'google.com' || host === 'www.google.com';
  }
  return true;
}

function setCachedFaviconUrl(hostname, iconUrl) {
  if (typeof hostname !== 'string' || !hostname) return;
  if (typeof iconUrl !== 'string' || !/^https?:\/\//i.test(iconUrl)) return;
  const cache = loadFaviconCache();
  const key = hostname.toLowerCase();
  cache[key] = iconUrl;

  const keys = Object.keys(cache);
  if (keys.length > FAVICON_CACHE_MAX_ENTRIES) {
    // Drop oldest-like keys deterministically to cap storage growth.
    // (Object key order preserves insertion order for string keys.)
    const overflow = keys.length - FAVICON_CACHE_MAX_ENTRIES;
    for (let i = 0; i < overflow; i += 1) {
      delete cache[keys[i]];
    }
  }

  _faviconCache = cache;
  saveFaviconCache();
}

function dedupeStrings(items) {
  const out = [];
  const seen = new Set();
  (items || []).forEach((item) => {
    if (typeof item !== 'string') return;
    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed)) return;
    seen.add(trimmed);
    out.push(trimmed);
  });
  return out;
}

function generateDefaultAppIcon() {
  return svgDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#7A8798"/>
          <stop offset="1" stop-color="#4F5B6A"/>
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#g)"/>
      <path d="M32 13c-10.5 0-19 8.5-19 19s8.5 19 19 19 19-8.5 19-19-8.5-19-19-19zm0 4c6.2 0 11.6 3.6 14.1 8.9H17.9C20.4 20.6 25.8 17 32 17zm-14.9 13h29.8a15.4 15.4 0 0 1-2.6 8.3H19.7a15.4 15.4 0 0 1-2.6-8.3zm3.4 12.3h23c-2.8 2.9-6.7 4.7-11.5 4.7s-8.7-1.8-11.5-4.7z" fill="rgba(255,255,255,0.92)"/>
    </svg>`
  );
}

function getGoogleProductIconForUrl(rawUrl) {
  const normalized = normalizeUrlForFavicon(rawUrl);
  if (!normalized) return null;

  let hostname = null;
  let pathname = '/';
  try {
    const parsed = new URL(normalized);
    hostname = parsed.hostname;
    pathname = parsed.pathname || '/';
  } catch {
    return null;
  }

  // Microsoft Copilot - use their official icon
  if (hostname === 'copilot.microsoft.com' || hostname === 'www.copilot.microsoft.com') {
    return 'https://www.google.com/s2/favicons?sz=64&domain=bing.com';
  }

  // Perplexity AI
  if (hostname === 'www.perplexity.ai' || hostname === 'perplexity.ai') {
    return 'https://www.google.com/s2/favicons?sz=64&domain=perplexity.ai';
  }

  // Midjourney
  if (hostname === 'www.midjourney.com' || hostname === 'midjourney.com') {
    return 'https://www.google.com/s2/favicons?sz=64&domain=midjourney.com';
  }

  // Verified stable gstatic product icons (HEAD 200 in this workspace).
  const base = 'https://www.gstatic.com/images/branding/product/2x';

  // Account / profile (myaccount doesn't reliably expose a favicon)
  if (hostname === 'myaccount.google.com' || hostname === 'accounts.google.com') {
    return 'https://ssl.gstatic.com/images/branding/product/2x/avatar_circle_blue_48dp.png';
  }

  // Common Google product icons
  if (hostname === 'maps.google.com') return `${base}/maps_48dp.png`;
  if (hostname === 'music.youtube.com') return `${base}/youtube_music_48dp.png`;
  if (hostname === 'translate.google.com') return `${base}/translate_48dp.png`;
  if (hostname === 'calendar.google.com') return `${base}/calendar_48dp.png`;
  if (hostname === 'photos.google.com') return `${base}/photos_48dp.png`;
  if (hostname === 'gemini.google.com') return `${base}/gemini_48dp.png`;
  // Use productlogos for exact modern Meet/Chat icons (the product/2x ones are not exact).
  if (hostname === 'meet.google.com') {
    return 'https://www.gstatic.com/images/branding/productlogos/meet_2020q4/v8/web-48dp/logo_meet_2020q4_color_2x_web_48dp.png';
  }
  if (hostname === 'chat.google.com') {
    return 'https://www.gstatic.com/images/branding/productlogos/chat_2020q4/v8/web-48dp/logo_chat_2020q4_color_2x_web_48dp.png';
  }
  if (hostname === 'news.google.com') return `${base}/news_48dp.png`;
  if (hostname === 'shopping.google.com') return `${base}/shopping_48dp.png`;
  if (hostname === 'analytics.google.com') return `${base}/analytics_96dp.png`;
  if (hostname === 'ads.google.com') return 'https://www.gstatic.com/images/branding/productlogos/ads/v5/192px.svg';
  if (hostname === 'travel.google.com') return 'https://www.gstatic.com/travel-trips-fe/travel_logo_192.png';
  // Google Business Profile ("Business" in the apps grid)
  if (hostname === 'business.google.com') return `${base}/google_my_business_48dp.png`;

  if (hostname === 'drive.google.com') return `${base}/drive_2020q4_48dp.png`;
  if (hostname === 'docs.google.com') {
    if (pathname.startsWith('/forms')) return `${base}/forms_2020q4_48dp.png`;
    return `${base}/docs_2020q4_48dp.png`;
  }
  if (hostname === 'sheets.google.com') return `${base}/sheets_2020q4_48dp.png`;
  if (hostname === 'slides.google.com') return `${base}/slides_2020q4_48dp.png`;
  if (hostname === 'keep.google.com') return `${base}/keep_2020q4_48dp.png`;
  if (hostname === 'mail.google.com') return `${base}/gmail_2020q4_48dp.png`;
  if (hostname === 'classroom.google.com') return `${base}/classroom_48dp.png`;
  if (hostname === 'passwords.google.com') return `${base}/password_manager_48dp.png`;
  if (hostname === 'contacts.google.com') return `${base}/contacts_48dp.png`;
  if (hostname === 'myadcenter.google.com') return `${base}/my_ad_center_48dp.png`;
  if (hostname === 'play.google.com' && pathname.startsWith('/books')) return `${base}/play_books_48dp.png`;
  if (hostname === 'books.google.com') return `${base}/play_books_48dp.png`;
  if (hostname === 'forms.gle') return `${base}/forms_2020q4_48dp.png`;

  // Chrome Web Store (old domain). No stable product-specific asset found here; use Chrome icon.
  if (hostname === 'chrome.google.com' && pathname.startsWith('/webstore')) return `${base}/chrome_48dp.png`;

  return null;
}

function svgDataUrl(svg) {
  if (typeof svg !== 'string' || !svg.trim()) return '';
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getBuiltInIconForGooglePath(hostname, pathname) {
  const hostKey = hostname && hostname.startsWith('www.') ? hostname.slice(4) : hostname;
  if (hostKey !== 'google.com') return '';

  const safePath = typeof pathname === 'string' ? pathname : '/';

  // Use official service assets for Search/Saved on google.com paths.
  if (safePath.startsWith('/saved')) {
    return 'https://www.gstatic.com/save/icons/light/empty-light@2x.png';
  }

  // Search (google.com root)
  return 'https://www.gstatic.com/images/branding/productlogos/googleg/v6/192px.svg';
}

function getFaviconCandidates(rawUrl) {
  const normalized = normalizeUrlForFavicon(rawUrl);
  const candidates = [];

  const hostname = normalized ? getHostnameFromAnyUrl(normalized) : getHostnameFromAnyUrl(rawUrl);
  if (!hostname) {
    return ['https://www.google.com/s2/favicons?sz=64&domain=google.com'];
  }

  const host = hostname.toLowerCase();
  const baseDomain = getBaseDomainFromHostname(host) || host;

  let parsedPathname = '/';
  try {
    if (normalized) parsedPathname = new URL(normalized).pathname || '/';
  } catch {
    parsedPathname = '/';
  }

  // For direct google.com paths (Search/Saved), use a path-aware built-in icon
  // so we do not fall back to the generic Google "G" icon.
  const builtInGooglePathIcon = getBuiltInIconForGooglePath(host, parsedPathname);
  if (builtInGooglePathIcon) {
    candidates.push(builtInGooglePathIcon);
  }

  // Use Google product icons for known Google services
  const googleProductIcon = getGoogleProductIconForUrl(normalized || rawUrl);
  if (googleProductIcon) {
    candidates.push(googleProductIcon);
  }

  // Optional fast-path: use previously successful icon URL after explicit
  // product/path mappings so stale cache cannot override official icons.
  const cached = getCachedFaviconUrl(host);
  if (cached && shouldUseCachedFaviconForHost(host, cached)) {
    candidates.push(cached);
  }

  const isGoogleSubdomain = host.endsWith('.google.com') && host !== 'google.com';

  // 1) Primary favicon API candidates.
  // For Google subdomains, prefer hostname lookup first because using
  // baseDomain=google.com often resolves to the generic "G" icon.
  if (isGoogleSubdomain) {
    candidates.push(`https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(host)}`);
    candidates.push(`https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(baseDomain)}`);
  } else {
    candidates.push(`https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(baseDomain)}`);
    if (baseDomain !== host) {
      candidates.push(`https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(host)}`);
    }
  }

  // 2) Secondary: direct favicon from the host.
  candidates.push(`https://${host}/favicon.ico`);

  // Secondary fallback: direct favicon from normalized base domain.
  if (baseDomain !== host) {
    candidates.push(`https://${baseDomain}/favicon.ico`);
  }

  // 3) Final remote fallback: generic Google favicon endpoint.
  candidates.push('https://www.google.com/s2/favicons?sz=64&domain=google.com');

  return dedupeStrings(candidates);
}

function saveLastWeather(payload) {
  try {
    localStorage.setItem('ios-newtab-last-weather', JSON.stringify({
      t: Date.now(),
      v: payload
    }));
  } catch {
    // ignore
  }
}

function loadLastWeather(maxAgeMs = 2 * 60 * 60 * 1000) {
  try {
    const raw = localStorage.getItem('ios-newtab-last-weather');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !isPlainObject(parsed) || !parsed.v || !isPlainObject(parsed.v)) return null;
    if (typeof parsed.t === 'number' && Number.isFinite(parsed.t) && maxAgeMs > 0) {
      if (Date.now() - parsed.t > maxAgeMs) return null;
    }
    // Validate essential fields
    const v = parsed.v;
    if (typeof v.tempC !== 'number' || typeof v.feelsC !== 'number') return null;
    return v;
  } catch {
    return null;
  }
}

/**
 * Generate a colourful letter-icon SVG data URL as a guaranteed-to-render fallback.
 */
function generateLetterIcon(name) {
  const letter = (name || '?').charAt(0).toUpperCase();
  const palette = [
    '#FF3B30','#FF9500','#FFCC00','#34C759','#00C7BE',
    '#30B0C7','#007AFF','#5856D6','#AF52DE','#FF2D55'
  ];
  const color = palette[letter.charCodeAt(0) % palette.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="${color}"/>
    <text x="32" y="32" text-anchor="middle" dominant-baseline="central"
      font-family="-apple-system,BlinkMacSystemFont,sans-serif"
      font-size="28" font-weight="600" fill="white">${letter}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function attachIconFallback(img, candidates, options = {}) {
  if (!img || !Array.isArray(candidates) || candidates.length === 0) return;

  const fallbackName = options.name || img.alt || '?';
  const cacheHost = typeof options.cacheHost === 'string' ? options.cacheHost.toLowerCase() : '';
  const defaultIcon = options.defaultIcon || generateDefaultAppIcon();

  // Limit candidates to prevent excessive retries
  const limitedCandidates = dedupeStrings(candidates).slice(0, 6);
  let index = 0;
  let settled = false;
  let activeCandidate = '';

  const cleanup = () => {
    settled = true;
    img.onerror = null;
    img.onload = null;
  };

  const advance = () => {
    index += 1;
    if (index < limitedCandidates.length) {
      activeCandidate = limitedCandidates[index];
      img.src = activeCandidate;
    } else {
      // All remote candidates failed — show stable local fallback icon.
      img.src = defaultIcon || generateLetterIcon(fallbackName);
      cleanup();
    }
  };

  img.onerror = function () {
    if (settled) return;
    advance();
  };

  img.onload = function () {
    if (settled) return;
    if (cacheHost && /^https?:\/\//i.test(activeCandidate) && shouldUseCachedFaviconForHost(cacheHost, activeCandidate)) {
      setCachedFaviconUrl(cacheHost, activeCandidate);
    }
    cleanup();
  };

  // Set the letter icon first so something always renders immediately,
  // then start loading the real icon.
  img.src = defaultIcon || generateLetterIcon(fallbackName);

  // After the letter icon is painted, start loading the remote icon.
  // Using a microtask so the letter icon renders on the current frame.
  Promise.resolve().then(() => {
    if (settled) return;
    activeCandidate = limitedCandidates[0];
    img.src = activeCandidate;
  });
}

function clearElement(el) {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const headers = { ...(options.headers || {}), 'Cache-Control': 'no-cache' };
    return await fetch(url, {
      ...options,
      headers,
      cache: options.cache || 'no-store',
      signal: controller ? controller.signal : undefined,
      referrerPolicy: 'no-referrer',
    });
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

// Weather geolocation state
let geoWatchId = null;
let lastGeoCoords = null;
let geoRequestInFlight = false;
let geoRequestPromise = null;
let geoWatchBootstrapInFlight = false;
let geoLastUpdateAt = 0;
let geoLastUpdateCoords = null;
let weatherApiKeyValidationInFlight = false;
// Note: weatherIntervalId is now tracked via _intervals.weather

const GEO_MIN_UPDATE_INTERVAL_MS = 15000;
const GEO_MIN_MOVE_METERS = 75;

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  if (_initialized) return;
  _initialized = true;
  void runFullInit('domcontentloaded');
});

// ============================================
// Sticky Notes (Simple)
// ============================================

const STICKY_NOTES_KEY = 'ios-newtab-sticky-notes';
// Note: stickyNotesSaveTimer is now tracked via _timeouts.stickyNotesSave
let stickyNotesOpen = false;

function loadStickyNotesText() {
  try {
    const raw = localStorage.getItem(STICKY_NOTES_KEY);
    if (typeof raw === 'string') return raw.slice(0, INPUT_LIMITS.stickyNotes);
    return '';
  } catch {
    return '';
  }
}

function saveStickyNotesText(nextText) {
  const safe = typeof nextText === 'string' ? nextText.slice(0, 4000) : '';
  try {
    localStorage.setItem(STICKY_NOTES_KEY, safe);
  } catch {
    // ignore
  }
}

function applyStickyNotesUiState() {
  const panel = document.getElementById('stickyNotes');
  const btn = document.getElementById('stickyNotesBtn');
  const overlay = document.getElementById('stickyNotesOverlay');
  if (!panel || !btn) return;

  const enabled = !!settings.showStickyNotes;
  btn.style.display = enabled ? 'flex' : 'none';

  if (!enabled) {
    stickyNotesOpen = false;
  }

  const isOpen = enabled && stickyNotesOpen;
  panel.classList.toggle('open', isOpen);
  panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  if (overlay) overlay.classList.toggle('open', isOpen);
}

function initStickyNotes() {
  const panel = document.getElementById('stickyNotes');
  const textArea = document.getElementById('stickyNotesText');
  const clearBtn = document.getElementById('clearStickyNotes');
  const closeBtn = document.getElementById('closeStickyNotes');
  const fabBtn = document.getElementById('stickyNotesBtn');
  const overlay = document.getElementById('stickyNotesOverlay');
  if (!panel || !textArea || !clearBtn || !closeBtn || !fabBtn) return;

  // Prevent double-binding
  if (panel.dataset.initBound) return;
  panel.dataset.initBound = '1';

  // Load persisted text
  textArea.value = loadStickyNotesText();

  const scheduleSave = () => {
    if (_timeouts.stickyNotesSave) clearTimeout(_timeouts.stickyNotesSave);
    _timeouts.stickyNotesSave = setTimeout(() => {
      saveStickyNotesText(textArea.value);
    }, 250);
  };

  textArea.addEventListener('input', scheduleSave);

  clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    textArea.value = '';
    saveStickyNotesText('');
    textArea.focus();
  });

  const openPanel = () => {
    stickyNotesOpen = true;
    applyStickyNotesUiState();
    setTimeout(() => textArea.focus(), 120);
  };

  const closePanel = () => {
    stickyNotesOpen = false;
    applyStickyNotesUiState();
  };

  fabBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!settings.showStickyNotes) return;
    stickyNotesOpen = !stickyNotesOpen;
    applyStickyNotesUiState();
    if (stickyNotesOpen) window.setTimeout(() => textArea.focus(), 120);
  });

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closePanel();
  });

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      e.preventDefault();
      closePanel();
    });
  }

  // Initial state: enabled -> collapsed
  stickyNotesOpen = false;
  applyStickyNotesUiState();
}

// ============================================
// AI Tools Radial Menu
// ============================================

function renderAiToolsMenu() {
  const menu = document.getElementById('aiToolsMenu');
  if (!menu) return;

  clearElement(menu);

  customAiTools.forEach(tool => {
    const item = document.createElement('a');
    item.className = 'ai-tool-item';
    item.href = tool.url;
    item.title = tool.name;
    item.setAttribute('aria-label', tool.name);
    item.target = '_blank';
    item.rel = 'noopener noreferrer';

    const img = document.createElement('img');
    img.className = 'ai-tool-icon';
    img.alt = tool.name;
    img.loading = 'lazy';
    img.decoding = 'async';

    item.appendChild(img);
    menu.appendChild(item);

    attachIconFallback(img, getFaviconCandidates(tool.url), {
      name: tool.name,
      cacheHost: getHostnameFromAnyUrl(tool.url) || '',
    });
  });
}

function initAiTools() {
  const container = document.getElementById('aiTools');
  const btn = document.getElementById('aiToolsBtn');
  const menu = document.getElementById('aiToolsMenu');

  if (!container || !btn || !menu) return;

  // Prevent double-binding
  if (container.dataset.initBound) return;
  container.dataset.initBound = '1';

  // Initial render
  renderAiToolsMenu();

  // Store the closed-position center so we can animate from a stable base.
  let baseCenter = null;

  function getButtonCenter() {
    const iconBox = btn.querySelector('.ai-tools-icon-box') || btn;
    const rect = iconBox.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function resetHubPosition() {
    btn.style.setProperty('--tx', '0px');
    btn.style.setProperty('--ty', '0px');
  }

  function setOpen(isOpen) {
    container.classList.toggle('open', isOpen);
    menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  }

  function closeMenu() {
    if (!container.classList.contains('open')) return;
    setOpen(false);
    resetHubPosition();
    baseCenter = null;
  }

  function layoutFromBase() {
    if (!baseCenter) baseCenter = getButtonCenter();
    const { x: bx, y: by } = baseCenter;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const items = Array.from(menu.querySelectorAll('.ai-tool-item'));
    const count = items.length;
    const itemSize = 56;
    const gap = 12;
    const spacing = itemSize + gap;

    // Ring radius so adjacent icons don't overlap: side length >= spacing.
    // For 6 items, adjacent distance on ring is exactly radius.
    // Smaller radius keeps the hub from moving too far up.
    const radius = Math.max(88, spacing);

    // Place the hub (AI button) as the center of the ring.
    // Keep the ring in a safe lower-left area so it doesn't cover main widgets.
    const margin = radius + itemSize / 2 + 10;

    // Target ring center is just enough up/right to fit the circle.
    const desiredCx = bx + radius + 10;
    const desiredCy = by - radius - 10;

    const cx = clamp(desiredCx, margin, vw - margin);
    const cy = clamp(desiredCy, margin, vh - margin);

    // Move the hub button to the ring center.
    const tx = Math.round(cx - bx);
    const ty = Math.round(cy - by);
    btn.style.setProperty('--tx', `${tx}px`);
    btn.style.setProperty('--ty', `${ty}px`);

    // Menu origin follows the hub center.
    menu.style.setProperty('--ox', `${Math.round(cx)}px`);
    menu.style.setProperty('--oy', `${Math.round(cy)}px`);

    // Each item's transition is relative to the origin (--ox, --oy).
    const startDeg = -90;
    const step = 360 / Math.max(1, count);
    items.forEach((item, index) => {
      const deg = startDeg + (index * step);
      const rad = (deg * Math.PI) / 180;
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;
      item.style.setProperty('--x', `${Math.round(x)}px`);
      item.style.setProperty('--y', `${Math.round(y)}px`);
      item.style.setProperty('--d', `${index * 35}ms`);
    });
  }

  function openMenu() {
    // Reset first
    resetHubPosition();
    // Add open class so we measure the final expanded size (64x64)
    setOpen(true);
    
    requestAnimationFrame(() => {
      baseCenter = getButtonCenter();
      layoutFromBase();
    });
  }

  function toggle() {
    if (container.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  });

  // Close when clicking outside - use tracked listener
  const aiToolsClickHandler = (e) => {
    if (!container.classList.contains('open')) return;
    if (container.contains(e.target)) return;
    closeMenu();
  };
  document.addEventListener('click', aiToolsClickHandler);
  _listeners.aiToolsClick = aiToolsClickHandler;

  // Keep positions correct if the page is resized - use tracked listener
  const aiToolsResizeHandler = () => {
    if (!container.classList.contains('open')) return;
    layoutFromBase();
  };
  window.addEventListener('resize', aiToolsResizeHandler);
  _listeners.aiToolsResize = aiToolsResizeHandler;
}

// ============================================
// Settings
// ============================================

function hasChromeStorage() {
  return typeof chrome !== 'undefined' && !!chrome.storage && !!chrome.storage.local;
}

function storageLocalGet(keys) {
  return new Promise((resolve) => {
    if (!hasChromeStorage()) return resolve({});
    chrome.storage.local.get(keys, (result) => resolve(result || {}));
  });
}

function storageLocalSet(items) {
  return new Promise((resolve) => {
    if (!hasChromeStorage()) return resolve();
    chrome.storage.local.set(items, () => resolve());
  });
}

function mapOptionsSettingsToNewtab(storeSettings) {
  // Options/settingsStore.js schema -> New Tab schema
  const s = isPlainObject(storeSettings) ? storeSettings : {};
  const out = {};

  // Shared
  if (typeof s.theme === 'string') out.theme = s.theme;
  if (typeof s.accentColor === 'string') out.accentColor = s.accentColor;
  if (typeof s.reduceMotion === 'boolean') out.reduceMotion = s.reduceMotion;
  if (typeof s.blurIntensity === 'number') out.blurIntensity = s.blurIntensity;

  // Clock
  if (typeof s.showClock === 'boolean') out.hideClock = !s.showClock;
  if (typeof s.clockStyle === 'string') out.digitalClock = s.clockStyle === 'digital';
  if (typeof s.use12Hour === 'boolean') out.use12Hour = s.use12Hour;
  if (typeof s.showSeconds === 'boolean') out.showSeconds = s.showSeconds;

  // Greeting
  if (typeof s.showGreeting === 'boolean') out.showGreeting = s.showGreeting;
  if (typeof s.showQuotes === 'boolean') out.showQuotes = s.showQuotes;
  if (typeof s.userName === 'string') out.userName = s.userName;
  if (typeof s.showCustomText === 'boolean') out.showCustomText = s.showCustomText;

  // Search
  if (typeof s.showVoiceSearch === 'boolean') out.hideMic = !s.showVoiceSearch;
  if (typeof s.voiceLanguage === 'string') out.voiceLanguage = s.voiceLanguage;

  // Weather
  if (typeof s.showWeather === 'boolean') out.showWeather = s.showWeather;
  if (typeof s.weatherUnit === 'string') out.useFahrenheit = s.weatherUnit === 'fahrenheit';
  if (typeof s.weatherLocation === 'string' && s.weatherLocation.trim()) out.weatherLocation = s.weatherLocation;
  if (typeof s.weatherApiKey === 'string') out.weatherApiKey = s.weatherApiKey;
  if (typeof s.useGPS === 'boolean') out.useGPS = s.useGPS;

  // Dock
  if (typeof s.showDock === 'boolean') out.showAllApps = s.showDock;
  if (typeof s.showAiTools === 'boolean') out.showAiTools = s.showAiTools;
  if (typeof s.showCustomDock === 'boolean') out.showCustomDock = s.showCustomDock;
  if (typeof s.adaptiveIcons === 'boolean') out.adaptiveIcons = s.adaptiveIcons;
  if (typeof s.dockPosition === 'string') out.dockPosition = s.dockPosition;
  if (typeof s.showTodoWidget === 'boolean') out.showTodoWidget = s.showTodoWidget;
  if (typeof s.showStickyNotes === 'boolean') out.showStickyNotes = s.showStickyNotes;
  if (typeof s.hideEngines === 'boolean') out.hideEngines = s.hideEngines;

  // Wallpaper tuning (no behavior change unless you wire it in)
  if (typeof s.wallpaperEnabled === 'boolean') out.wallpaperEnabled = s.wallpaperEnabled;
  if (typeof s.wallpaperUrl === 'string') out.wallpaperUrl = s.wallpaperUrl;
  if (typeof s.wallpaperBlur === 'number') out.wallpaperBlur = s.wallpaperBlur;
  if (typeof s.wallpaperDim === 'number') out.wallpaperDim = s.wallpaperDim;

  return out;
}

function mapNewtabSettingsToOptionsSchema(newtabSettings) {
  // New Tab schema -> Options/settingsStore.js schema (overlapping keys only)
  const s = isPlainObject(newtabSettings) ? newtabSettings : {};
  const out = {};

  if (typeof s.theme === 'string') out.theme = s.theme;
  if (typeof s.accentColor === 'string') out.accentColor = s.accentColor;
  if (typeof s.reduceMotion === 'boolean') out.reduceMotion = s.reduceMotion;
  if (typeof s.blurIntensity === 'number') out.blurIntensity = s.blurIntensity;

  if (typeof s.hideClock === 'boolean') out.showClock = !s.hideClock;
  if (typeof s.digitalClock === 'boolean') out.clockStyle = s.digitalClock ? 'digital' : 'analog';
  if (typeof s.use12Hour === 'boolean') out.use12Hour = s.use12Hour;
  if (typeof s.showSeconds === 'boolean') out.showSeconds = s.showSeconds;

  if (typeof s.showGreeting === 'boolean') out.showGreeting = s.showGreeting;
  if (typeof s.showQuotes === 'boolean') out.showQuotes = s.showQuotes;
  if (typeof s.userName === 'string') out.userName = s.userName;
  if (typeof s.showCustomText === 'boolean') out.showCustomText = s.showCustomText;

  if (typeof s.hideMic === 'boolean') out.showVoiceSearch = !s.hideMic;
  if (typeof s.voiceLanguage === 'string') out.voiceLanguage = s.voiceLanguage;

  if (typeof s.showWeather === 'boolean') out.showWeather = s.showWeather;
  if (typeof s.useFahrenheit === 'boolean') out.weatherUnit = s.useFahrenheit ? 'fahrenheit' : 'celsius';
  if (typeof s.weatherLocation === 'string') out.weatherLocation = s.weatherLocation;
  if (typeof s.weatherApiKey === 'string') out.weatherApiKey = s.weatherApiKey;
  if (typeof s.useGPS === 'boolean') out.useGPS = s.useGPS;

  if (typeof s.showAllApps === 'boolean') out.showDock = s.showAllApps;
  if (typeof s.showAiTools === 'boolean') out.showAiTools = s.showAiTools;
  if (typeof s.showCustomDock === 'boolean') out.showCustomDock = s.showCustomDock;
  if (typeof s.adaptiveIcons === 'boolean') out.adaptiveIcons = s.adaptiveIcons;
  if (typeof s.dockPosition === 'string') out.dockPosition = s.dockPosition;
  if (typeof s.showTodoWidget === 'boolean') out.showTodoWidget = s.showTodoWidget;
  if (typeof s.showStickyNotes === 'boolean') out.showStickyNotes = s.showStickyNotes;
  if (typeof s.hideEngines === 'boolean') out.hideEngines = s.hideEngines;

  if (typeof s.wallpaperEnabled === 'boolean') out.wallpaperEnabled = s.wallpaperEnabled;
  if (typeof s.wallpaperUrl === 'string') out.wallpaperUrl = s.wallpaperUrl;
  if (typeof s.wallpaperBlur === 'number') out.wallpaperBlur = s.wallpaperBlur;
  if (typeof s.wallpaperDim === 'number') out.wallpaperDim = s.wallpaperDim;

  return out;
}

function applyMotionToggles() {
  document.body.classList.toggle('reduce-motion', !!settings.reduceMotion);

  const blur = Number.isFinite(Number(settings.wallpaperBlur)) ? Number(settings.wallpaperBlur) : 0;
  const dim = Number.isFinite(Number(settings.wallpaperDim)) ? Number(settings.wallpaperDim) : 0;
  const blurClamped = Math.min(20, Math.max(0, blur));
    const dimClamped = Math.min(50, Math.max(0, dim));
  document.documentElement.style.setProperty('--wallpaper-blur', `${blurClamped}px`);
  document.documentElement.style.setProperty('--wallpaper-dim', String(dimClamped / 100));
}

function sanitizeAiTools(tools) {
  if (!Array.isArray(tools)) return [...DEFAULT_AI_TOOLS];
  return tools.map(t => ({
    id: t.id || Date.now() + Math.random(),
    name: String(t.name || 'New AI Tool').substring(0, 50),
    url: String(t.url || '').substring(0, 500)
  })).filter(t => t.url);
}

async function loadSettings() {
  let hadLocalSettings = false;
  try {
    const saved = localStorage.getItem('ios-newtab-settings');
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      settings = { ...DEFAULT_SETTINGS, ...sanitizeLoadedSettings(parsedSettings) };
      hadLocalSettings = true;
      // Ensure weather defaults are always set
      if (!settings.weatherLocation) {
        settings.weatherLocation = DEFAULT_SETTINGS.weatherLocation;
      }
    }
    
    // Load custom dock apps
    const savedDockApps = localStorage.getItem('ios-newtab-dock-apps');
    if (savedDockApps) {
      customDockApps = sanitizeDockApps(JSON.parse(savedDockApps));
    } else {
      customDockApps = sanitizeDockApps(customDockApps);
    }

    // Load custom AI tools
    const savedAiTools = localStorage.getItem('ios-newtab-ai-tools');
    if (savedAiTools) {
      customAiTools = sanitizeAiTools(JSON.parse(savedAiTools));
    } else {
      customAiTools = sanitizeAiTools(customAiTools);
    }

    // Load All Apps
    const savedAllApps = localStorage.getItem('allApps');
    if (savedAllApps) {
      allApps = sanitizeAllApps(JSON.parse(savedAllApps));
    } else {
      allApps = sanitizeAllApps(allApps);
    }
  } catch (e) {
    console.error('Error loading settings:', e);
  }

  // Merge in Options/settingsStore.js settings (chrome.storage.local)
  try {
    const { settings: storedSettings, dockApps, aiTools, allApps: storedAllApps, wallpaper, [GEOLOCATION_TOGGLE_KEY]: storedUseGeolocation } = await storageLocalGet(['settings', 'dockApps', 'aiTools', 'allApps', 'wallpaper', GEOLOCATION_TOGGLE_KEY]);

    const hasStoredSettings = !!storedSettings;

    if (storedSettings) {
      const mapped = mapOptionsSettingsToNewtab(storedSettings);
      settings = { ...settings, ...sanitizeLoadedSettings(mapped) };
    }

    if (typeof storedUseGeolocation === 'boolean') {
      settings.useGPS = storedUseGeolocation;
    }

    if (dockApps) {
      customDockApps = sanitizeDockApps(dockApps);
    }

    if (aiTools) {
      customAiTools = sanitizeAiTools(aiTools);
    }

    if (wallpaper) {
      settings.wallpaper = sanitizeWallpaperValue(wallpaper) || '';
    }

    if (storedAllApps) {
      allApps = sanitizeAllApps(storedAllApps);
    }

    // If the user has v1 localStorage settings but the Options store isn't seeded yet,
    // write a merged settings object so Options pages reflect current behavior.
    if (hadLocalSettings && !hasStoredSettings) {
      const patch = mapNewtabSettingsToOptionsSchema(settings);
      const safeExisting = isPlainObject(storedSettings) ? storedSettings : {};
      await storageLocalSet({
        settings: { ...safeExisting, ...patch },
        [GEOLOCATION_TOGGLE_KEY]: !!settings.useGPS,
        allApps: allApps.map(a => ({ id: a.id, name: a.name, url: a.url }))
      });
    }
  } catch (e) {
    console.error('Error loading chrome.storage.local settings:', e);
  }

  applyMotionToggles();
}

function isPlainObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  // Prototype pollution guard: only accept plain objects
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function sanitizeWallpaperValue(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return '';
  // Allow only https URLs or raster base64 data URLs for wallpapers.
  // (Block SVG data URLs to avoid scriptable image formats.)
  if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(trimmed)) return trimmed;
  try {
    const u = new URL(trimmed);
    if (u.protocol === 'https:') return u.toString();
  } catch {
    // ignore
  }
  return null;
}

function sanitizeIconValue(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';

  // Allow uploaded images only (avoid SVG data URLs).
  if (/^data:image\/(png|jpe?g|webp|gif|ico);base64,/i.test(trimmed)) return trimmed;

  // Allow only https URLs for remote icons.
  try {
    const u = new URL(trimmed);
    if (u.protocol === 'https:') return u.toString();
  } catch {
    // ignore
  }
  return '';
}

function sanitizeDockApps(input) {
  const fallback = [...DEFAULT_DOCK_APPS];
  if (!Array.isArray(input)) return fallback;

  const out = [];
  input.slice(0, INPUT_LIMITS.maxDockApps).forEach((raw, index) => {
    if (!isPlainObject(raw)) return;
    const idNum = Number(raw.id);
    const id = Number.isFinite(idNum) ? idNum : (index + 1);
    const name = (typeof raw.name === 'string' ? raw.name : '').replace(/<[^>]*>/g, '').trim().slice(0, INPUT_LIMITS.dockAppName) || 'App';
    const rawUrl = (typeof raw.url === 'string' ? raw.url : '').trim().slice(0, INPUT_LIMITS.dockAppUrl);
    // Normalize to safe http(s) URLs only (auto-prepend https:// for bare domains)
    const url = normalizeUrlForFavicon(rawUrl) || '';
    const icon = sanitizeIconValue(raw.icon);
    const domain = (typeof raw.domain === 'string' ? raw.domain : '').trim().slice(0, 200);

    const next = { id, name, url, icon };
    if (domain) next.domain = domain;
    out.push(next);
  });

  return out;
}

function sanitizeEnglishVoiceLanguage(value, fallback = 'auto') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (trimmed.toLowerCase() === 'auto') return 'auto';

  // Accept English locale tags like en-US, en-GB, en-IN, en-001.
  if (/^en(?:[-_][a-zA-Z0-9]{2,8})*$/i.test(trimmed)) {
    const parts = trimmed.replace(/_/g, '-').split('-');
    return parts
      .map((part, idx) => (idx === 0 ? 'en' : part.toUpperCase()))
      .join('-');
  }

  return fallback;
}

function sanitizeLoadedSettings(input) {
  const i = isPlainObject(input) ? input : {};

  const sanitizeBool = (v, fallback) => (typeof v === 'boolean' ? v : fallback);
  const sanitizeStr = (v, maxLen, fallback) => {
    if (typeof v !== 'string') return fallback;
    return v.replace(/<[^>]*>/g, '').trim().slice(0, maxLen);
  };
  const clampNum = (v, min, max, fallback) => {
    if (typeof v !== 'number' || !Number.isFinite(v)) return fallback;
    return Math.min(max, Math.max(min, v));
  };

  const theme = (typeof i.theme === 'string' && ['system', 'light', 'dark'].includes(i.theme)) ? i.theme : DEFAULT_SETTINGS.theme;
  const accentColor = (typeof i.accentColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(i.accentColor.trim())) ? i.accentColor.trim() : DEFAULT_SETTINGS.accentColor;

  return {
    userName: sanitizeStr(i.userName, INPUT_LIMITS.userName, DEFAULT_SETTINGS.userName),
    theme,
    accentColor,

    reduceMotion: sanitizeBool(i.reduceMotion, DEFAULT_SETTINGS.reduceMotion),
    blurIntensity: clampNum(i.blurIntensity, 0, 40, DEFAULT_SETTINGS.blurIntensity),

    hideClock: sanitizeBool(i.hideClock, DEFAULT_SETTINGS.hideClock),
    digitalClock: sanitizeBool(i.digitalClock, DEFAULT_SETTINGS.digitalClock),
    use12Hour: sanitizeBool(i.use12Hour, DEFAULT_SETTINGS.use12Hour),
    showSeconds: sanitizeBool(i.showSeconds, DEFAULT_SETTINGS.showSeconds),

    showGreeting: sanitizeBool(i.showGreeting, DEFAULT_SETTINGS.showGreeting),
    showCustomText: sanitizeBool(i.showCustomText, DEFAULT_SETTINGS.showCustomText),

    hideMic: sanitizeBool(i.hideMic, DEFAULT_SETTINGS.hideMic),
    hideEngines: sanitizeBool(i.hideEngines, DEFAULT_SETTINGS.hideEngines),
    voiceLanguage: sanitizeEnglishVoiceLanguage(i.voiceLanguage, DEFAULT_SETTINGS.voiceLanguage),
    showQuotes: sanitizeBool(i.showQuotes, DEFAULT_SETTINGS.showQuotes),

    showWeather: sanitizeBool(i.showWeather, DEFAULT_SETTINGS.showWeather),
    useFahrenheit: sanitizeBool(i.useFahrenheit, DEFAULT_SETTINGS.useFahrenheit),
    weatherLocation: sanitizeStr(i.weatherLocation, INPUT_LIMITS.weatherLocation, DEFAULT_SETTINGS.weatherLocation),
    useGPS: sanitizeBool(i.useGPS, DEFAULT_SETTINGS.useGPS),
    weatherApiKey: sanitizeStr(i.weatherApiKey, INPUT_LIMITS.weatherApiKey, DEFAULT_SETTINGS.weatherApiKey),

    showAllApps: sanitizeBool(i.showAllApps, DEFAULT_SETTINGS.showAllApps),
    adaptiveIcons: sanitizeBool(i.adaptiveIcons, DEFAULT_SETTINGS.adaptiveIcons),
    showTodoWidget: sanitizeBool(i.showTodoWidget, DEFAULT_SETTINGS.showTodoWidget),
    showStickyNotes: sanitizeBool(i.showStickyNotes, DEFAULT_SETTINGS.showStickyNotes),
    dockPosition: (typeof i.dockPosition === 'string' && ['bottom', 'top', 'left', 'right'].includes(i.dockPosition)) ? i.dockPosition : DEFAULT_SETTINGS.dockPosition,

    wallpaperEnabled: sanitizeBool(i.wallpaperEnabled, DEFAULT_SETTINGS.wallpaperEnabled),
    wallpaperUrl: sanitizeStr(i.wallpaperUrl, 900, DEFAULT_SETTINGS.wallpaperUrl),
    wallpaperBlur: clampNum(i.wallpaperBlur, 0, 20, DEFAULT_SETTINGS.wallpaperBlur),
    wallpaperDim: clampNum(i.wallpaperDim, 0, 50, DEFAULT_SETTINGS.wallpaperDim),
    showAiTools: sanitizeBool(i.showAiTools, DEFAULT_SETTINGS.showAiTools),
    showCustomDock: sanitizeBool(i.showCustomDock, DEFAULT_SETTINGS.showCustomDock),

    // wallpaper is stored separately in chrome.storage.local
  };
}

function saveSettings() {
  try {
    // Save settings without wallpaper (wallpaper is stored separately)
    const settingsToSave = { ...settings };
    delete settingsToSave.wallpaper;
    localStorage.setItem('ios-newtab-settings', JSON.stringify(settingsToSave));

    // Keep Options UI in sync for overlapping settings
    const patch = mapNewtabSettingsToOptionsSchema(settingsToSave);
    storageLocalGet(['settings'])
      .then(({ settings: existing }) => {
        const safeExisting = isPlainObject(existing) ? existing : {};
        return storageLocalSet({
          settings: { ...safeExisting, ...patch },
          [GEOLOCATION_TOGGLE_KEY]: !!settings.useGPS,
        });
      })
      .catch(() => {});
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

function saveDockApps() {
  try {
    customDockApps = sanitizeDockApps(customDockApps);
    localStorage.setItem('ios-newtab-dock-apps', JSON.stringify(customDockApps));

    storageLocalSet({ dockApps: customDockApps }).catch(() => {});
  } catch (e) {
    console.error('Error saving dock apps:', e);
  }
}

function saveAiTools() {
  try {
    customAiTools = sanitizeAiTools(customAiTools);
    localStorage.setItem('ios-newtab-ai-tools', JSON.stringify(customAiTools));

    storageLocalSet({ aiTools: customAiTools }).catch(() => {});
    
    // Immediately re-render menu and settings
    renderAiToolsMenu();
    renderAiToolsSettings();
  } catch (e) {
    console.error('Error saving AI tools:', e);
  }
}

// Save wallpaper to chrome.storage.local (handles large data)
function saveWallpaper(wallpaperData) {
  if (DEBUG) console.log('Saving wallpaper...', wallpaperData ? 'Has data' : 'Empty');

  const safe = sanitizeWallpaperValue(wallpaperData);
  if (safe === null) {
    alert('Unsupported wallpaper URL. Use an uploaded image or an https URL.');
    return;
  }
  
  if (chrome && chrome.storage) {
    chrome.storage.local.set({ wallpaper: safe }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving wallpaper:', chrome.runtime.lastError);
        alert('Wallpaper too large. Please use a smaller image.');
      } else {
        if (DEBUG) console.log('Wallpaper saved successfully!');
      }
    });
  } else {
    console.error('chrome.storage not available');
  }
}

function applyMicVisibility() {
  const micBtn = document.getElementById('micBtn');
  if (!micBtn) return;

  const hidden = !!settings.hideMic;
  micBtn.classList.toggle('mic-hidden', hidden);
  micBtn.setAttribute('aria-hidden', hidden ? 'true' : 'false');
  micBtn.tabIndex = hidden ? -1 : 0;

  if (hidden) {
    micBtn.classList.remove('listening');
  }
}

function applyAiToolsVisibility() {
  const aiTools = document.getElementById('aiTools');
  if (!aiTools) return;
  aiTools.style.display = settings.showAiTools ? 'block' : 'none';
}

function applyAllAppsVisibility() {
  const dockContainer = document.querySelector('.dock-container');
  if (dockContainer) {
    dockContainer.style.display = settings.showAllApps ? 'flex' : 'none';
  }
}

function applyDockVisibility() {
  const dock = document.getElementById('appDock');
  if (!dock) return;
  
  const divider = dock.querySelector('.dock-divider');
  const hasCustomApps = customDockApps.length > 0;
  const showCustom = !!settings.showCustomDock && hasCustomApps;

  if (divider) {
    divider.style.display = showCustom ? 'block' : 'none';
  }

  // Toggle outer box (glass-card background)
  dock.classList.toggle('dock-minimal', !showCustom);
}

// Apply all visual settings
function applyAllSettings() {
  // Centered layout logic: center Weather/Search if Clock & Greeting are both hidden
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    const bothHidden = settings.hideClock && !settings.showGreeting;
    mainContent.classList.toggle('centered-layout', bothHidden);
  }

  // Clock visibility
  const clockContainer = document.querySelector('.clock-container');
  if (clockContainer) {
    clockContainer.style.display = settings.hideClock ? 'none' : 'block';
  }
  
  // Digital vs Analog clock
  updateClockDisplay();
  restartClockTimer();
  
  // Greeting visibility - apply to container and text
  const greetingContainer = document.querySelector('.greeting-container');
  const greetingText = document.getElementById('greetingText');
  if (greetingContainer) {
    greetingContainer.style.display = settings.showGreeting ? 'block' : 'none';
  }
  if (greetingText) {
    greetingText.style.display = settings.showGreeting ? 'block' : 'none';
  }
  
  // Custom text visibility
  const userName = document.getElementById('userName');
  if (userName) {
    userName.style.display = settings.showCustomText ? 'block' : 'none';
  }
  
  // Microphone visibility
  applyMicVisibility();
  applyAiToolsVisibility();
  applyDockVisibility();
  applyAllAppsVisibility();

  const voiceLanguageSelect = document.getElementById('voiceLanguageSelect');
  if (voiceLanguageSelect) {
    const nextVoiceLang = sanitizeEnglishVoiceLanguage(settings.voiceLanguage, DEFAULT_SETTINGS.voiceLanguage);
    if (voiceLanguageSelect.value !== nextVoiceLang) {
      voiceLanguageSelect.value = nextVoiceLang;
    }
  }
  
  // Search engines visibility
  const searchEnginesEl = document.getElementById('searchEngines');
  if (searchEnginesEl) {
    searchEnginesEl.style.display = settings.hideEngines ? 'none' : 'flex';
    if (settings.hideEngines && currentSearchEngine !== 'google') {
      currentSearchEngine = 'google';
      updateSearchEngineUI();
    }
    if (settings.hideEngines) {
      closeSearchEnginesMenu();
    }
  }
  
  // Quotes visibility
  const quoteContainer = document.getElementById('quoteContainer');
  if (quoteContainer) {
    quoteContainer.style.display = settings.showQuotes ? 'block' : 'none';
    // Only show a quote if none is displayed yet (avoid randomizing on every settings change)
    if (settings.showQuotes && !quoteContainer.querySelector('.quote-text')?.textContent) {
      displayRandomQuote();
    }
  }
  
  // Weather visibility
  const weatherCard = document.getElementById('weatherCard');
  if (weatherCard) {
    weatherCard.style.display = settings.showWeather ? 'flex' : 'none';
  }
  
  // Apply dock position
  applyDockPosition();
  
  // ToDo widget visibility
  const todoWidget = document.getElementById('todoWidget');
  if (todoWidget) {
    todoWidget.style.display = settings.showTodoWidget ? 'flex' : 'none';
  }

  // Sticky notes enabled/open state
  applyStickyNotesUiState();
  
  // Apply adaptive icons
  applyAdaptiveIcons();
  
  // Seconds hand visibility
  const secondHand = document.getElementById('secondHand');
  if (secondHand) {
    secondHand.style.display = settings.showSeconds ? 'block' : 'none';
  }
  
  // Update wallpaper preview
  updateWallpaperPreview();
}

function updateClockDisplay() {
  const clockContainer = document.querySelector('.clock-container');
  const clockFace = document.querySelector('.clock-face');
  if (!clockFace || !clockContainer) return;
  
  if (settings.digitalClock) {
    // Add digital mode class for Apple widget styling
    clockContainer.classList.add('digital-mode');
    
    // Hide analog elements including second hand
    document.querySelectorAll('.hour-num, .hand, .center-dot').forEach(el => {
      el.style.display = 'none';
    });
    // Explicitly hide second hand
    const secondHand = document.getElementById('secondHand');
    if (secondHand) secondHand.style.display = 'none';
    
    // Create tick marks container if not exists
    let tickMarks = clockFace.querySelector('.tick-marks');
    if (!tickMarks) {
      tickMarks = document.createElement('div');
      tickMarks.className = 'tick-marks';
      // Create 60 tick marks (one per minute)
      for (let i = 0; i < 60; i++) {
        const tick = document.createElement('div');
        tick.className = i % 5 === 0 ? 'tick hour-tick' : 'tick';
        tick.style.transform = `rotate(${i * 6}deg)`;
        tickMarks.appendChild(tick);
      }
      clockFace.appendChild(tickMarks);
    }
    tickMarks.style.display = 'block';
    
    // Create or update digital display
    let digitalDisplay = document.getElementById('digitalDisplay');
    if (!digitalDisplay) {
      digitalDisplay = document.createElement('div');
      digitalDisplay.id = 'digitalDisplay';
      digitalDisplay.className = 'digital-display';
      clockFace.appendChild(digitalDisplay);
    }
    digitalDisplay.style.display = 'flex';
    updateDigitalClock();
  } else {
    // Remove digital mode class
    clockContainer.classList.remove('digital-mode');
    
    // Show analog elements
    document.querySelectorAll('.hour-num, .hand, .center-dot').forEach(el => {
      el.style.display = '';
    });
    
    // Restore second hand visibility based on settings
    const secondHand = document.getElementById('secondHand');
    if (secondHand) {
      secondHand.style.display = settings.showSeconds ? 'block' : 'none';
    }
    
    // Hide tick marks
    const tickMarks = clockFace.querySelector('.tick-marks');
    if (tickMarks) {
      tickMarks.style.display = 'none';
    }
    
    // Hide digital display
    const digitalDisplay = document.getElementById('digitalDisplay');
    if (digitalDisplay) {
      digitalDisplay.style.display = 'none';
    }
  }
}

function updateDigitalClock() {
  const digitalDisplay = document.getElementById('digitalDisplay');
  if (!digitalDisplay) return;
  
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  
  let period = '';
  if (settings.use12Hour) {
    period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }
  
  // Format hours (no leading zero for 12-hour, with leading zero for 24-hour)
  const hoursStr = settings.use12Hour ? hours.toString() : hours.toString().padStart(2, '0');
  
  // Create Apple-style display (no innerHTML)
  let timeDisplay = digitalDisplay.querySelector('.time-display');
  if (!timeDisplay) {
    clearElement(digitalDisplay);

    timeDisplay = document.createElement('span');
    timeDisplay.className = 'time-display';

    const hoursEl = document.createElement('span');
    hoursEl.className = 'time-hours';

    const colon1 = document.createElement('span');
    colon1.className = 'time-colon';
    colon1.appendChild(document.createElement('span'));
    colon1.appendChild(document.createElement('span'));

    const minutesEl = document.createElement('span');
    minutesEl.className = 'time-minutes';

    timeDisplay.appendChild(hoursEl);
    timeDisplay.appendChild(colon1);
    timeDisplay.appendChild(minutesEl);
    digitalDisplay.appendChild(timeDisplay);

    const periodEl = document.createElement('span');
    periodEl.className = 'time-period';
    digitalDisplay.appendChild(periodEl);
  }

  const hoursEl = digitalDisplay.querySelector('.time-hours');
  const minutesEl = digitalDisplay.querySelector('.time-minutes');
  const periodEl = digitalDisplay.querySelector('.time-period');
  if (hoursEl) hoursEl.textContent = hoursStr;
  if (minutesEl) minutesEl.textContent = minutes;

  // Seconds
  const existingSeconds = digitalDisplay.querySelector('.time-seconds');
  const existingSecondColon = existingSeconds ? existingSeconds.previousElementSibling : null;
  const wantSeconds = !!settings.showSeconds;
  if (wantSeconds && !existingSeconds) {
    const colon2 = document.createElement('span');
    colon2.className = 'time-colon';
    colon2.appendChild(document.createElement('span'));
    colon2.appendChild(document.createElement('span'));

    const secondsEl = document.createElement('span');
    secondsEl.className = 'time-seconds';

    timeDisplay.appendChild(colon2);
    timeDisplay.appendChild(secondsEl);
  } else if (!wantSeconds && existingSeconds) {
    if (existingSecondColon && existingSecondColon.classList.contains('time-colon')) {
      existingSecondColon.remove();
    }
    existingSeconds.remove();
  }
  const secondsEl = digitalDisplay.querySelector('.time-seconds');
  if (secondsEl) secondsEl.textContent = seconds;

  // Period
  if (periodEl) {
    if (settings.use12Hour) {
      periodEl.textContent = period;
      periodEl.style.display = '';
    } else {
      periodEl.textContent = '';
      periodEl.style.display = 'none';
    }
  }
}

// ============================================
// Clock
// ============================================

function updateDigitalClockSubOptions() {
  const show = !!settings.digitalClock;
  const el12 = document.getElementById('setting12Hour');
  const elSec = document.getElementById('settingSeconds');
  if (el12) el12.style.display = show ? '' : 'none';
  if (elSec) elSec.style.display = show ? '' : 'none';
}

let _clockRafId = null;
let _clockRafRunning = false;
let _clockLastSecond = -1;
let _clockLastMinute = -1;

const _clockDom = {
  hourHand: null,
  minuteHand: null,
  secondHand: null,
};

function getClockDom() {
  if (!_clockDom.hourHand) _clockDom.hourHand = document.getElementById('hourHand');
  if (!_clockDom.minuteHand) _clockDom.minuteHand = document.getElementById('minuteHand');
  if (!_clockDom.secondHand) _clockDom.secondHand = document.getElementById('secondHand');
  return _clockDom;
}

function initClock() {
  if (_clockRafRunning) return;

  const secondHand = document.getElementById('secondHand');
  if (secondHand) {
    secondHand.style.display = settings.showSeconds ? 'block' : 'none';
  }

  updateClockDisplay();
  restartClockTimer();
}

function stopClockTimer() {
  _clockRafRunning = false;
  if (_clockRafId !== null) {
    try { cancelAnimationFrame(_clockRafId); } catch {}
    _clockRafId = null;
  }
  if (_timeouts.clockAlign !== null) {
    try { clearTimeout(_timeouts.clockAlign); } catch {}
    _timeouts.clockAlign = null;
  }
}

function startClockLoop() {
  if (_clockRafRunning) return;
  _clockRafRunning = true;

  const tick = () => {
    if (!_clockRafRunning) return;

    if (!settings.hideClock && document.visibilityState === 'visible') {
      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const shouldUpdate = settings.showSeconds
        ? sec !== _clockLastSecond || min !== _clockLastMinute
        : min !== _clockLastMinute;

      if (shouldUpdate) {
        updateClock(now);
        _clockLastSecond = sec;
        _clockLastMinute = min;
      }
    }

    _clockRafId = requestAnimationFrame(tick);
  };

  _clockLastSecond = -1;
  _clockLastMinute = -1;
  _clockRafId = requestAnimationFrame(tick);
}

function restartClockTimer() {
  stopClockTimer();
  if (settings.hideClock) return;
  updateClock(new Date());
  startClockLoop();
}

function updateClock(now = new Date()) {
  if (settings.digitalClock) {
    updateDigitalClock();
    return;
  }

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const ms = now.getMilliseconds();

  const secDeg = ((s + ms / 1000) / 60) * 360;
  const minDeg = (settings.showSeconds ? (m + s / 60) : m) / 60 * 360;
  const hourDeg = ((h % 12 + m / 60) / 12) * 360;

  const { hourHand, minuteHand, secondHand } = getClockDom();
  if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;
  if (minuteHand) minuteHand.style.transform = `rotate(${minDeg}deg)`;
  if (secondHand) secondHand.style.transform = `rotate(${secDeg}deg)`;
}

// ============================================
// Date & Greeting
// ============================================

function initDate() {
  if (_intervals.date !== null) return; // Already running
  updateDate();
  _intervals.date = setInterval(updateDate, 60000);
}

function updateDate() {
  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  document.getElementById('dateText').textContent = now.toLocaleDateString('en-US', options);
}

function initGreeting() {
  if (_intervals.greeting !== null) return; // Already running
  updateGreeting();
  _intervals.greeting = setInterval(updateGreeting, 60000);
  
  // Update name display
  const nameEl = document.getElementById('userName');
  nameEl.textContent = settings.userName || 'Name';
  
  // Click to edit - only add once
  if (!nameEl.dataset.clickBound) {
    nameEl.addEventListener('click', openNameModal);
    nameEl.dataset.clickBound = '1';
  }
}

function updateGreeting() {
  // Prefer the detected location timezone (WeatherAPI tz_id), otherwise system local time.
  let hour = null;
  try {
    const cached = loadLastWeather(24 * 60 * 60 * 1000);
    const tzId = cached && typeof cached.tzId === 'string' ? cached.tzId : null;
    if (tzId && typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      const parts = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        hour12: false,
        timeZone: tzId,
      }).formatToParts(new Date());
      const h = parts.find(p => p.type === 'hour');
      const parsed = h ? Number(h.value) : NaN;
      if (Number.isFinite(parsed)) hour = parsed;
    }

    // Fallback: use WeatherAPI's localtime_epoch if tz formatting isn't available.
    if (!Number.isFinite(hour)) {
      const epoch = cached && typeof cached.localtimeEpochSec === 'number' ? cached.localtimeEpochSec : null;
      if (Number.isFinite(epoch) && epoch > 0) {
        hour = new Date(epoch * 1000).getHours();
      }
    }
  } catch {
    // ignore
  }
  if (!Number.isFinite(hour)) hour = new Date().getHours();
  let greeting;
  
  if (hour >= 5 && hour < 12) greeting = 'Good Morning';
  else if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
  else if (hour >= 17 && hour < 21) greeting = 'Good Evening';
  else greeting = 'Good Night';
  
  const greetingEl = document.getElementById('greetingText');
  if (greetingEl) greetingEl.textContent = greeting;
}

// ============================================
// Character Count Display Helper
// ============================================

function createCharCountDisplay() {
  const modal = document.getElementById('nameModal');
  if (!modal) return null;
  
  let countEl = document.getElementById('nameCharCount');
  if (!countEl) {
    countEl = document.createElement('div');
    countEl.id = 'nameCharCount';
    countEl.style.cssText = `
      position: absolute;
      bottom: 55px;
      right: 40px;
      font-size: 12px;
      color: rgba(255,255,255,0.6);
      font-weight: 500;
    `;
    modal.appendChild(countEl);
  }
  return countEl;
}

// ============================================
// Name Modal
// ============================================

function openNameModal() {
  const modal = document.getElementById('nameModal');
  const overlay = document.getElementById('nameOverlay');
  const input = document.getElementById('nameInput');
  
  input.value = settings.userName || '';
  modal.classList.add('active');
  overlay.classList.add('active');
  input.focus();
}

function closeNameModal() {
  document.getElementById('nameModal').classList.remove('active');
  document.getElementById('nameOverlay').classList.remove('active');
}

function saveName() {
  const raw = document.getElementById('nameInput').value;
  const name = sanitizeText(raw, INPUT_LIMITS.userName);
  if (raw.trim().length > INPUT_LIMITS.userName) {
    showInputError(document.getElementById('nameInput'), `⚠️ Name too long! Maximum ${INPUT_LIMITS.userName} characters allowed. Current: ${raw.trim().length}`);
  }
  settings.userName = name;
  saveSettings();
  
  document.getElementById('userName').textContent = name || 'Name';
  document.getElementById('settingsName').value = name;
  
  closeNameModal();
}

// ============================================
// Search
// ============================================

function initSearch() {
  const input = document.getElementById('searchInput');
  const micBtn = document.getElementById('micBtn');

  initSearchEnginePicker();

  // Prevent double-binding
  if (input.dataset.initBound) return;
  input.dataset.initBound = '1';
  
  // Search on Enter
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  
  // Voice Search
  if (micBtn && !settings.hideMic) {
    initVoiceSearch(micBtn, input);
  }
}

function normalizeSearchEngineId(engineId) {
  const id = typeof engineId === 'string' ? engineId.trim().toLowerCase() : '';
  return SEARCH_ENGINES[id] ? id : 'default';
}

function getDefaultEngineIconForTheme() {
  const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
  return isLightTheme ? DEFAULT_ENGINE_ICON_LIGHT : DEFAULT_ENGINE_ICON_DARK;
}

function closeSearchEnginesMenu() {
  const menu = document.getElementById('searchEnginesMenu');
  const pickerBtn = document.getElementById('enginePickerBtn');
  if (!menu || !pickerBtn) return;
  menu.hidden = true;
  pickerBtn.setAttribute('aria-expanded', 'false');
}

function updateSearchEngineUI() {
  const pickerBtn = document.getElementById('enginePickerBtn');
  const pickerLogo = document.getElementById('enginePickerLogo');
  const menu = document.getElementById('searchEnginesMenu');
  const engine = SEARCH_ENGINES[normalizeSearchEngineId(currentSearchEngine)] || SEARCH_ENGINES.default;
  const defaultIconUrl = getDefaultEngineIconForTheme();
  const pickerIconUrl = engine.id === 'default' ? defaultIconUrl : engine.iconUrl;

  if (pickerLogo) {
    pickerLogo.src = pickerIconUrl;
    pickerLogo.alt = engine.label;
  }
  if (pickerBtn) {
    pickerBtn.title = `Search with ${engine.label}`;
    pickerBtn.setAttribute('aria-label', `Search engine: ${engine.label}`);
    pickerBtn.classList.toggle('default-engine-mode', engine.id === 'default');
  }

  if (menu) {
    const defaultOptionLogo = menu.querySelector('.search-engine-item[data-engine="default"] .search-engine-logo');
    if (defaultOptionLogo instanceof HTMLImageElement) {
      defaultOptionLogo.src = defaultIconUrl;
    }

    const options = menu.querySelectorAll('.search-engine-item');
    options.forEach((option) => {
      option.classList.toggle('active', option.dataset.engine === engine.id);
    });
  }
}

function shouldReduceSearchMotion() {
  if (settings && settings.reduceMotion) return true;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function animateSearchIconZoom() {
  const pickerBtn = document.getElementById('enginePickerBtn');
  if (!pickerBtn) return;

  pickerBtn.classList.remove('search-zoom-animate');
  // Force a reflow so the class re-add reliably restarts animation.
  void pickerBtn.offsetWidth;
  pickerBtn.classList.add('search-zoom-animate');

  if (_searchIconZoomAnimationTimer) {
    window.clearTimeout(_searchIconZoomAnimationTimer);
  }
  _searchIconZoomAnimationTimer = window.setTimeout(() => {
    pickerBtn.classList.remove('search-zoom-animate');
    _searchIconZoomAnimationTimer = null;
  }, 360);
}

function initSearchEnginePicker() {
  const pickerBtn = document.getElementById('enginePickerBtn');
  const menu = document.getElementById('searchEnginesMenu');
  if (!pickerBtn || !menu) return;

  // Keep "Default" as the initial engine each time a new tab initializes.
  currentSearchEngine = 'default';
  updateSearchEngineUI();
  closeSearchEnginesMenu();

  if (pickerBtn.dataset.bound === '1') return;

  pickerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!shouldReduceSearchMotion()) animateSearchIconZoom();
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    pickerBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });

  const options = menu.querySelectorAll('.search-engine-item');
  options.forEach((option) => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      const nextEngine = normalizeSearchEngineId(option.dataset.engine);
      currentSearchEngine = nextEngine;
      updateSearchEngineUI();
      closeSearchEnginesMenu();
    });
  });

  if (!_listeners.searchEngineDocClick) {
    _listeners.searchEngineDocClick = (e) => {
      if (menu.hidden) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (pickerBtn.contains(target) || menu.contains(target)) return;
      closeSearchEnginesMenu();
    };
    document.addEventListener('click', _listeners.searchEngineDocClick);
  }

  if (!_listeners.searchEngineKeydown) {
    _listeners.searchEngineKeydown = (e) => {
      if (e.key === 'Escape') {
        closeSearchEnginesMenu();
      }
    };
    document.addEventListener('keydown', _listeners.searchEngineKeydown);
  }

  pickerBtn.dataset.bound = '1';
}

function initVoiceSearch(micBtn, input) {
  // Prevent double-binding
  if (micBtn.dataset.voiceBound) return;
  micBtn.dataset.voiceBound = '1';

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    micBtn.title = 'Voice search not supported in this browser';
    micBtn.style.opacity = '0.5';
    micBtn.style.cursor = 'not-allowed';
    return;
  }
  
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = resolveVoiceRecognitionLanguage();
  
  let isListening = false;
  
  micBtn.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
      return;
    }
    recognition.lang = resolveVoiceRecognitionLanguage();
    try {
      recognition.start();
    } catch (e) {
      // Fallback to en-US if the selected English locale isn't supported.
      try {
        recognition.lang = 'en-US';
        recognition.start();
      } catch {
        console.error('Speech recognition start failed:', e);
      }
    }
  });
  
  recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add('listening');
    input.placeholder = 'Listening...';
  };
  
  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
    
    input.value = transcript;
    
    if (event.results[0].isFinal) {
      setTimeout(() => performSearch(), 500);
    }
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isListening = false;
    micBtn.classList.remove('listening');
    input.placeholder = 'Search the web...';
  };
  
  recognition.onend = () => {
    isListening = false;
    micBtn.classList.remove('listening');
    input.placeholder = 'Search the web...';
  };
}

function resolveVoiceRecognitionLanguage() {
  const selected = sanitizeEnglishVoiceLanguage(settings.voiceLanguage, DEFAULT_SETTINGS.voiceLanguage);
  if (selected !== 'auto') return selected;

  const preferred = Array.isArray(navigator.languages) && navigator.languages.length
    ? String(navigator.languages[0] || '')
    : String(navigator.language || '');

  const browserLang = sanitizeEnglishVoiceLanguage(preferred, 'en-US');
  return browserLang === 'auto' ? 'en-US' : browserLang;
}

function performSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  const engineId = normalizeSearchEngineId(currentSearchEngine);
  const engine = SEARCH_ENGINES[engineId] || SEARCH_ENGINES.default;

  const executeSearch = () => {
    if (engine.useChromeDefault) {
      try {
        if (typeof chrome !== 'undefined' && chrome.search && typeof chrome.search.query === 'function') {
          const maybePromise = chrome.search.query({ text: query, disposition: 'CURRENT_TAB' });
          if (maybePromise && typeof maybePromise.then === 'function') {
            maybePromise.catch(() => {
              window.location.href = engine.buildUrl(query);
            });
          }
          return;
        }
      } catch {
        // Fall through to URL fallback.
      }
    }

    window.location.href = engine.buildUrl(query);
  };

  if (!shouldReduceSearchMotion()) {
    animateSearchIconZoom();
    window.setTimeout(executeSearch, 130);
    return;
  }

  executeSearch();
}

// ============================================
// Weather
// ============================================

// Debounce state for weather visibility refresh
let _weatherLastRefreshAt = 0;
const WEATHER_LOCATION_CACHE_KEYS = {
  city: 'city',
  coords: 'coords',
};

function normalizeStoredCoords(value) {
  if (!value || typeof value !== 'object') return null;
  const lat = Number(value.latitude);
  const lon = Number(value.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { latitude: lat, longitude: lon };
}

function updateLocationUI(locationText) {
  const locationEl = document.getElementById('weatherLocationText');
  if (!locationEl) return;
  locationEl.textContent = locationText || 'Locating...';
}

function showLocationLoadingState() {
  updateLocationUI('Locating...');
}

function persistWeatherLocationCache(city, coords = null) {
  const patch = {};
  if (typeof city === 'string') {
    const safeCity = city.trim().slice(0, INPUT_LIMITS.weatherLocation || 120);
    if (safeCity) patch[WEATHER_LOCATION_CACHE_KEYS.city] = safeCity;
  }
  const normalizedCoords = normalizeStoredCoords(coords);
  if (normalizedCoords) {
    patch[WEATHER_LOCATION_CACHE_KEYS.coords] = normalizedCoords;
  }
  if (Object.keys(patch).length) {
    storageLocalSet(patch).catch(() => {});
  }
}

async function primeWeatherLocationFromCache() {
  try {
    const data = await storageLocalGet([WEATHER_LOCATION_CACHE_KEYS.city, WEATHER_LOCATION_CACHE_KEYS.coords]);
    const cachedCity = typeof data[WEATHER_LOCATION_CACHE_KEYS.city] === 'string' ? data[WEATHER_LOCATION_CACHE_KEYS.city].trim() : '';
    const cachedCoords = normalizeStoredCoords(data[WEATHER_LOCATION_CACHE_KEYS.coords]);

    if (cachedCity) {
      updateLocationUI(cachedCity);
    } else {
      showLocationLoadingState();
    }

    if (cachedCoords) {
      lastGeoCoords = cachedCoords;
      if (settings.showWeather) {
        safeWeatherFetch(0);
      }
    }
  } catch {
    showLocationLoadingState();
  }
}

function safeWeatherFetch(delayMs = 500) {
  if (_timeouts.weatherDebounce) {
    try { clearTimeout(_timeouts.weatherDebounce); } catch {}
  }
  _timeouts.weatherDebounce = setTimeout(() => {
    _timeouts.weatherDebounce = null;
    void fetchWeatherByLocation();
  }, Math.max(0, Number(delayMs) || 0));
}

function refreshWeatherIfNeeded() {
  if (!settings.showWeather) return;
  const now = Date.now();
  if (now - _weatherLastRefreshAt < 30_000) return;
  _weatherLastRefreshAt = now;
  safeWeatherFetch(250);
}

function restoreFavicons() {
  // Rebuild icon nodes after tab resume so suspended image pipelines recover.
  renderDock();
  if (_appsGridInitialized) initAppsGrid();
}

function initWeather() {
  void primeWeatherLocationFromCache();

  if (settings.showWeather) {
    startWeatherPolling();
    if (settings.useGPS) {
      startGeolocationWatch();
    }
  } else {
    stopWeatherPolling();
  }

  // Refresh on tab visibility so the widget feels real-time.
  if (!_listeners.weatherVisibilityChange) {
    _listeners.weatherVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      refreshWeatherIfNeeded();
    };
    document.addEventListener('visibilitychange', _listeners.weatherVisibilityChange);
  }
}

function startWeatherPolling() {
  if (_intervals.weather !== null) return;
  safeWeatherFetch(0);
  _intervals.weather = setInterval(() => safeWeatherFetch(0), 600000); // 10 minutes
}

function stopWeatherPolling() {
  if (_intervals.weather === null) return;
  try {
    clearInterval(_intervals.weather);
  } catch {
    // ignore
  }
  _intervals.weather = null;
}

function parseCoordinatesFromString(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  // Accept formats like: "12.34, 56.78" or "12.34 56.78"
  const m = trimmed.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lon = Number(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { latitude: lat, longitude: lon };
}

function getWeatherQuery() {
  if (settings.useGPS && lastGeoCoords) {
    return {
      type: 'coords',
      latitude: lastGeoCoords.latitude,
      longitude: lastGeoCoords.longitude,
      label: 'Current Location'
    };
  }

  const fromText = parseCoordinatesFromString(settings.weatherLocation || '');
  if (fromText) {
    return { type: 'coords', ...fromText, label: `${fromText.latitude.toFixed(2)}, ${fromText.longitude.toFixed(2)}` };
  }

  const name = (settings.weatherLocation || '').trim();
  return { type: 'name', name, label: name };
}

function setUseGpsToggleUi(enabled) {
  const toggle = document.getElementById('toggleUseGPS');
  if (toggle) toggle.checked = !!enabled;
}

function setWeatherLocationInputValue(value) {
  const input = document.getElementById('weatherLocation');
  if (input && typeof value === 'string') {
    input.value = value;
  }
}

function haversineMeters(a, b) {
  if (!a || !b) return Number.POSITIVE_INFINITY;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const r = 6371000;
  const dLat = toRad((b.latitude || 0) - (a.latitude || 0));
  const dLon = toRad((b.longitude || 0) - (a.longitude || 0));
  const lat1 = toRad(a.latitude || 0);
  const lat2 = toRad(b.latitude || 0);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

function shouldProcessGeoUpdate(nextCoords) {
  const now = Date.now();
  if (!geoLastUpdateCoords) {
    geoLastUpdateCoords = nextCoords;
    geoLastUpdateAt = now;
    return true;
  }

  const elapsed = now - geoLastUpdateAt;
  const movedMeters = haversineMeters(geoLastUpdateCoords, nextCoords);
  if (elapsed < GEO_MIN_UPDATE_INTERVAL_MS && movedMeters < GEO_MIN_MOVE_METERS) {
    return false;
  }

  geoLastUpdateCoords = nextCoords;
  geoLastUpdateAt = now;
  return true;
}

async function syncLocationFromCoordinates(latitude, longitude) {
  try {
    const place = await reverseGeocodeOpenMeteo(latitude, longitude);
    if (!place || !place.name) return;
    const nextName = [place.name, place.country].filter(Boolean).join(', ');
    if (!nextName) return;
    persistWeatherLocationCache(nextName, { latitude, longitude });
    updateLocationUI(nextName);
    if (settings.weatherLocation === nextName) return;

    settings.weatherLocation = sanitizeText(nextName, INPUT_LIMITS.weatherLocation);
    setWeatherLocationInputValue(settings.weatherLocation);
    saveSettings();
  } catch {
    // ignore reverse geocode failures
  }
}

function handleGeolocationError(err) {
  const msg = err && err.message ? err.message : 'Unable to access location.';
  console.error('Geolocation error:', msg);

  // Permission denied: disable GPS mode so toggle state and behavior stay consistent.
  if (err && err.code === 1) {
    settings.useGPS = false;
    setUseGpsToggleUi(false);
    stopGeolocationWatch();
    saveSettings();
  }

  const input = document.getElementById('weatherLocation');
  if (input) showInputError(input, msg);

  const locationEl = document.getElementById('weatherLocationText');
  if (locationEl && settings.showWeather) {
    const fallbackLabel = (settings.weatherLocation || '').trim() || 'Location unavailable';
    locationEl.textContent = fallbackLabel;
  }
}

function startGeolocationWatch() {
  if (!settings.useGPS) return;
  if (!navigator.geolocation) {
    console.error('Geolocation not supported by this browser');
    return;
  }
  if (geoWatchId !== null || geoWatchBootstrapInFlight) return;
  geoWatchBootstrapInFlight = true;

  // Clear old geocode cache to force fresh local-area lookup
  geocodeCache = null;
  geocodeCacheKey = '';
  try { localStorage.removeItem('ios-newtab-geocode-cache'); } catch (e) {}

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      geoWatchBootstrapInFlight = false;
      // Permission granted - start watching
      const nextCoords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      if (!shouldProcessGeoUpdate(nextCoords)) return;
      lastGeoCoords = nextCoords;
      await syncLocationFromCoordinates(lastGeoCoords.latitude, lastGeoCoords.longitude);
      if (settings.showWeather) safeWeatherFetch(300);

      // Now start the continuous watch
      if (geoWatchId !== null) return;
      geoWatchId = navigator.geolocation.watchPosition(
        async (pos2) => {
          const nextCoords = {
            latitude: pos2.coords.latitude,
            longitude: pos2.coords.longitude,
          };
          if (!shouldProcessGeoUpdate(nextCoords)) return;
          lastGeoCoords = nextCoords;
          await syncLocationFromCoordinates(lastGeoCoords.latitude, lastGeoCoords.longitude);
          if (settings.showWeather) safeWeatherFetch(300);
        },
        (err) => {
          handleGeolocationError(err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 2 * 60 * 1000,
          timeout: 15 * 1000,
        }
      );
    },
    (err) => {
      geoWatchBootstrapInFlight = false;
      handleGeolocationError(err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 20 * 1000,
    }
  );
}

function stopGeolocationWatch() {
  if (geoWatchId !== null) {
    try {
      navigator.geolocation.clearWatch(geoWatchId);
    } catch (e) {
      // ignore
    }
  }
  geoWatchId = null;
  geoWatchBootstrapInFlight = false;
  lastGeoCoords = null;
  geoRequestInFlight = false; // Reset in-flight flag to allow new requests
  geoRequestPromise = null;
  geoLastUpdateAt = 0;
  geoLastUpdateCoords = null;
}

function requestGeolocationOnce() {
  if (!settings.useGPS) return Promise.resolve(false);
  if (!navigator.geolocation) return Promise.resolve(false);
  if (geoRequestPromise) return geoRequestPromise;
  if (geoRequestInFlight) return Promise.resolve(false);
  geoRequestInFlight = true;
  // Clear old geocode cache to force fresh local-area lookup
  geocodeCache = null;
  geocodeCacheKey = '';
  try { localStorage.removeItem('ios-newtab-geocode-cache'); } catch (e) {}

  geoRequestPromise = new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        geoRequestInFlight = false;
        const nextCoords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        if (!shouldProcessGeoUpdate(nextCoords)) {
          geoRequestPromise = null;
          resolve(!!lastGeoCoords);
          return;
        }
        lastGeoCoords = nextCoords;
        await syncLocationFromCoordinates(lastGeoCoords.latitude, lastGeoCoords.longitude);
        if (settings.showWeather) safeWeatherFetch(300);
        geoRequestPromise = null;
        resolve(true);
      },
      (err) => {
        geoRequestInFlight = false;
        console.error('Geolocation error:', err && err.message ? err.message : err);
        geoRequestPromise = null;
        resolve(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20 * 1000,
      }
    );
  });

  return geoRequestPromise;
}

function normalizeConditionToIcon(conditionText, isDay = null) {
  const t = (conditionText || '').toLowerCase().trim();
  if (!t) return '🌡️';
  const normalized = t.replace(/\s+/g, ' ');
  // Night-specific variants for common sky conditions.
  // (We intentionally keep rain/snow/fog/thunder icons the same day/night.)
  if (isDay === false) {
    if (normalized.includes('clear') || normalized.includes('sun')) return '🌙';
    if (normalized.includes('partly cloudy') || normalized.includes('mostly clear')) return '🌙☁️';
    if (normalized.includes('cloud') || normalized.includes('overcast')) return '☁️';
  }

  if (weatherIcons[normalized]) return weatherIcons[normalized];
  if (weatherIcons[t]) return weatherIcons[t];

  // Keyword-based fallback for providers with varied phrasing
  if (normalized.includes('thunder')) return '⛈️';
  if (normalized.includes('snow') || normalized.includes('sleet') || normalized.includes('blizzard') || normalized.includes('ice')) return '❄️';
  if (normalized.includes('drizzle') || normalized.includes('shower')) return '🌦️';
  if (normalized.includes('rain')) return '🌧️';
  if (normalized.includes('fog') || normalized.includes('mist') || normalized.includes('haze')) return '🌫️';
  if (normalized.includes('overcast')) return '☁️';
  if (normalized.includes('cloud')) {
    if (isDay === false) return '🌙☁️';
    return '⛅';
  }
  if (normalized.includes('clear') || normalized.includes('sun')) {
    if (isDay === false) return '🌙';
    return '☀️';
  }
  if (normalized.includes('wind')) return '💨';
  return '🌡️';
}

// Cache for reverse geocode results to avoid repeated API calls
let geocodeCache = null;
let geocodeCacheKey = '';

// Load cached geocode from localStorage on init
try {
  const cached = localStorage.getItem('ios-newtab-geocode-cache');
  if (cached) {
    const parsed = JSON.parse(cached);
    // Invalidate old caches (2 decimal precision) - new format uses 3 decimals
    if (parsed && parsed.key && parsed.result && parsed.key.match(/^-?\d+\.\d{3},-?\d+\.\d{3}$/)) {
      geocodeCacheKey = parsed.key;
      geocodeCache = parsed.result;
    } else {
      // Clear stale cache with old precision
      localStorage.removeItem('ios-newtab-geocode-cache');
    }
  }
} catch (e) {}

function saveGeocodeCache(key, result) {
  try {
    localStorage.setItem('ios-newtab-geocode-cache', JSON.stringify({ key, result }));
  } catch (e) {}
}

async function reverseGeocodeOpenMeteo(latitude, longitude) {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  
  if (isNaN(lat) || isNaN(lon)) {
    return null;
  }
  
  // Round to 3 decimal places for cache key (about 100m precision)
  const cacheKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  
  // Return cached result if coordinates haven't changed significantly
  if (geocodeCache && geocodeCacheKey === cacheKey) {
    return geocodeCache;
  }
  
  // Method 1: BigDataCloud (free, CORS-friendly, most reliable)
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetchWithTimeout(url, {}, 8000);
    if (res.ok) {
      const data = await res.json();
      if (data) {
        // Prefer most specific: locality/neighbourhood > city > state
        const localArea = data.locality || data.city || data.principalSubdivision || '';
        const cityName = data.city || data.principalSubdivision || '';
        const countryName = data.countryName || '';
        // Show "LocalArea, City" if they differ, otherwise just city
        let displayName = localArea;
        if (localArea && cityName && localArea !== cityName) {
          displayName = `${localArea}, ${cityName}`;
        }
        if (displayName) {
          const result = { name: displayName, country: countryName };
          geocodeCache = result;
          geocodeCacheKey = cacheKey;
          saveGeocodeCache(cacheKey, result);
          return result;
        }
      }
    }
  } catch (e) {
    // Continue to fallback
  }

  // Method 2: Nominatim/OpenStreetMap
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`;
    const res = await fetchWithTimeout(url, { 
      headers: { 'User-Agent': 'GlassNewTab/2.0' }
    }, 8000);
    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        // Prefer most specific: suburb/neighbourhood > city_district > city
        const localArea = addr.suburb || addr.neighbourhood || addr.city_district || '';
        const cityName = addr.city || addr.town || addr.village || addr.municipality || 
                        addr.county || addr.state || '';
        const countryName = addr.country || '';
        // Show "LocalArea, City" if local area differs from city
        let displayName = localArea || cityName;
        if (localArea && cityName && localArea !== cityName) {
          displayName = `${localArea}, ${cityName}`;
        }
        if (displayName) {
          const result = { name: displayName, country: countryName };
          geocodeCache = result;
          geocodeCacheKey = cacheKey;
          saveGeocodeCache(cacheKey, result);
          return result;
        }
      }
    }
  } catch (e) {
    // Continue
  }
  
  return null;
}

function renderWeather({ tempC, feelsC, humidity, conditionText, locationText, icon, localtimeEpochSec, tzId, isDay, latitude, longitude }) {
  const temp = settings.useFahrenheit ? (tempC * 9/5) + 32 : tempC;
  const feels = settings.useFahrenheit ? (feelsC * 9/5) + 32 : feelsC;

  // If provider tells us it's night, prefer a moon icon for clear conditions.
  const resolvedIcon = (() => {
    if (typeof isDay === 'boolean') {
      const baseIcon = icon || normalizeConditionToIcon(conditionText, isDay);
      // Only override for sky-condition icons; keep rain/snow/etc unchanged.
      if (!isDay) {
        if (baseIcon === '☀️' || baseIcon === '🌤️' || baseIcon === '🌥️') return '🌙';
        if (baseIcon === '⛅') return '🌙☁️';
      }
      return baseIcon;
    }
    return icon || normalizeConditionToIcon(conditionText);
  })();

  document.getElementById('tempValue').textContent = Math.round(temp);
  const locationEl = document.getElementById('weatherLocationText');
  if (locationEl) locationEl.textContent = locationText || '';
  document.getElementById('weatherHumidity').textContent = `💧 ${Math.round(humidity)}%`;
  document.getElementById('weatherFeels').textContent = `🌡️ ${Math.round(feels)}°`;
  document.getElementById('weatherIcon').textContent = resolvedIcon || '🌡️';

  saveLastWeather({ tempC, feelsC, humidity, conditionText, locationText, icon: resolvedIcon, localtimeEpochSec, tzId, isDay });

  if (locationText) {
    persistWeatherLocationCache(locationText, { latitude, longitude });
  }

  // Keep greeting aligned with the detected location's local time.
  updateGreeting();
}

async function fetchWeatherFromWeatherApi(query) {
  const key = (settings.weatherApiKey || '').trim();
  if (!key) return null;

  let q = query.type === 'coords'
    ? `${query.latitude},${query.longitude}`
    : (query.name || '').trim();

  // If GPS is enabled but no coords available yet, don't use IP fallback - will try Open-Meteo instead
  if (!q && settings.useGPS) {
    return null;
  }

  // Only use IP fallback if GPS is explicitly disabled
  if (!q && !settings.useGPS) q = 'auto:ip';

  if (!q) return null; // No location data available

  const url = `https://api.weatherapi.com/v1/current.json?key=${encodeURIComponent(key)}&q=${encodeURIComponent(q)}&aqi=no`;
  let res;
  try {
    res = await fetchWithTimeout(url, {}, 10000);
  } catch (e) {
    return null;
  }
  if (!res.ok) {
    return null;
  }
  let data;
  try {
    data = await res.json();
  } catch {
    return null;
  }
  if (!data || !data.current || !data.location) return null;

  const conditionText = data.current.condition && data.current.condition.text ? data.current.condition.text : 'Unknown';
  const isDay = data.current && (data.current.is_day === 1 || data.current.is_day === 0)
    ? data.current.is_day === 1
    : null;
  const icon = normalizeConditionToIcon(conditionText, isDay);
  const locationTextParts = [data.location.name, data.location.country].filter(Boolean);
  const locationText = locationTextParts.join(', ');

  const localtimeEpochSec = Number(data.location.localtime_epoch);

  return {
    tempC: Number(data.current.temp_c),
    feelsC: Number(data.current.feelslike_c),
    humidity: Number(data.current.humidity),
    conditionText,
    locationText: locationText || (query.label || ''),
    icon,
    localtimeEpochSec: Number.isFinite(localtimeEpochSec) ? localtimeEpochSec : null,
    tzId: typeof data.location.tz_id === 'string' ? data.location.tz_id : null,
    isDay: typeof isDay === 'boolean' ? isDay : null,
    latitude: Number(data.location.lat),
    longitude: Number(data.location.lon),
  };
}

async function fetchWeatherFromOpenMeteo(query) {
  let latitude = null;
  let longitude = null;
  let locationName = '';
  let country = '';

  if (query.type === 'coords') {
    latitude = query.latitude;
    longitude = query.longitude;
    // Try to turn GPS coordinates into a friendly place name
    const place = await reverseGeocodeOpenMeteo(latitude, longitude);
    locationName = (place && place.name) ? place.name : (query.label || 'Current Location');
    country = (place && place.country) ? place.country : '';
  } else {
    const locationNameInput = (query.name || '').trim();
    if (!locationNameInput) {
      return null;
    }
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationNameInput)}&count=1&language=en&format=json`;
    let geoRes;
    try {
      geoRes = await fetchWithTimeout(geoUrl, {}, 9000);
    } catch {
      return null;
    }
    if (!geoRes.ok) {
      return null;
    }

    let geoData;
    try {
      geoData = await geoRes.json();
    } catch {
      return null;
    }
    if (!geoData.results || geoData.results.length === 0) {
      return null;
    }

    ({ latitude, longitude, name: locationName, country } = geoData.results[0]);
  }

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,is_day&timezone=auto`;
  let weatherRes;
  try {
    weatherRes = await fetchWithTimeout(weatherUrl, {}, 10000);
  } catch {
    return null;
  }
  if (!weatherRes.ok) {
    return null;
  }

  let weatherData;
  try {
    weatherData = await weatherRes.json();
  } catch {
    return null;
  }
  if (!weatherData || !weatherData.current) return null;

  const current = weatherData.current;
  const weatherCode = current.weather_code;
  const isDay = current && (current.is_day === 1 || current.is_day === 0)
    ? current.is_day === 1
    : null;
  const condition = weatherConditions[weatherCode] || { text: 'Unknown', icon: '🌡️' };
  const locationText = country ? `${locationName}, ${country}` : `${locationName}`;

  let icon = condition.icon;
  if (isDay === false) {
    if ((weatherCode === 0 || weatherCode === 1) && (icon === '☀️' || icon === '🌤️')) {
      icon = '🌙';
    }
    if (weatherCode === 2 && icon === '⛅') {
      icon = '🌙☁️';
    }
  }

  return {
    tempC: Number(current.temperature_2m),
    feelsC: Number(current.apparent_temperature),
    humidity: Number(current.relative_humidity_2m),
    conditionText: condition.text,
    locationText,
    icon,
    isDay: typeof isDay === 'boolean' ? isDay : null,
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
}

let _weatherFetchInFlight = false;

async function fetchWeatherByLocation() {
  try {
    if (!settings.showWeather) return;
    if (_weatherFetchInFlight) return; // Prevent overlapping fetches
    _weatherFetchInFlight = true;
    if (settings.useGPS && !lastGeoCoords) {
      await requestGeolocationOnce();
      if (!lastGeoCoords) {
        const locationEl = document.getElementById('weatherLocationText');
        if (locationEl) {
          locationEl.textContent = (settings.weatherLocation || '').trim() || 'Location unavailable';
        }
        return;
      }
    }

    const query = getWeatherQuery();

    // Prefer WeatherAPI if user provided a key, fallback to Open-Meteo.
    const fromWeatherApi = await fetchWeatherFromWeatherApi(query);
    if (fromWeatherApi) {
      renderWeather(fromWeatherApi);
      return;
    }

    const fromOpenMeteo = await fetchWeatherFromOpenMeteo(query);
    if (fromOpenMeteo) {
      renderWeather(fromOpenMeteo);
      return;
    }

    // If network blocked, show last known weather (silent fallback)
    const cached = loadLastWeather();
    if (cached) {
      renderWeather(cached);
    }
  } catch (err) {
    // Avoid noisy console errors for transient network issues
    const cached = loadLastWeather();
    if (cached) {
      renderWeather(cached);
      return;
    }
    // silent
  } finally {
    _weatherFetchInFlight = false;
  }
}

// Weather code to condition mapping (WMO codes)
const weatherConditions = {
  0: { text: 'Clear', icon: '☀️' },
  1: { text: 'Mainly Clear', icon: '🌤️' },
  2: { text: 'Partly Cloudy', icon: '⛅' },
  3: { text: 'Overcast', icon: '☁️' },
  45: { text: 'Foggy', icon: '🌫️' },
  48: { text: 'Rime Fog', icon: '🌫️' },
  51: { text: 'Light Drizzle', icon: '🌧️' },
  53: { text: 'Drizzle', icon: '🌧️' },
  55: { text: 'Heavy Drizzle', icon: '🌧️' },
  61: { text: 'Light Rain', icon: '🌧️' },
  63: { text: 'Rain', icon: '🌧️' },
  65: { text: 'Heavy Rain', icon: '🌧️' },
  71: { text: 'Light Snow', icon: '❄️' },
  73: { text: 'Snow', icon: '❄️' },
  75: { text: 'Heavy Snow', icon: '❄️' },
  77: { text: 'Snow Grains', icon: '❄️' },
  80: { text: 'Light Showers', icon: '🌦️' },
  81: { text: 'Showers', icon: '🌦️' },
  82: { text: 'Heavy Showers', icon: '🌦️' },
  85: { text: 'Light Snow Showers', icon: '🌨️' },
  86: { text: 'Snow Showers', icon: '🌨️' },
  95: { text: 'Thunderstorm', icon: '⛈️' },
  96: { text: 'Thunderstorm with Hail', icon: '⛈️' },
  99: { text: 'Thunderstorm with Heavy Hail', icon: '⛈️' }
};

function updateWeatherUI(data, locationName, country) {
  const current = data.current;
  
  const tempC = current.temperature_2m;
  const feelsC = current.apparent_temperature;
  const temp = settings.useFahrenheit ? (tempC * 9/5) + 32 : tempC;
  const feels = settings.useFahrenheit ? (feelsC * 9/5) + 32 : feelsC;
  
  const weatherCode = current.weather_code;
  const condition = weatherConditions[weatherCode] || { text: 'Unknown', icon: '🌡️' };
  
  document.getElementById('tempValue').textContent = Math.round(temp);
  document.getElementById('weatherCondition').textContent = condition.text;
  const locationEl = document.getElementById('weatherLocationText');
  if (locationEl) locationEl.textContent = `${locationName}, ${country}`;
  document.getElementById('weatherHumidity').textContent = `💧 ${current.relative_humidity_2m}%`;
  document.getElementById('weatherFeels').textContent = `🌡️ ${Math.round(feels)}°`;
  document.getElementById('weatherIcon').textContent = condition.icon;
}

function setSaveButtonFeedback(btn, { state, text, durationMs = 1200 } = {}) {
  if (!btn) return;

  const originalText = btn.dataset.originalText || btn.textContent;
  btn.dataset.originalText = originalText;

  const clearTimerId = btn.dataset.feedbackTimer ? Number(btn.dataset.feedbackTimer) : null;
  if (Number.isFinite(clearTimerId)) {
    try { clearTimeout(clearTimerId); } catch { /* ignore */ }
  }

  btn.classList.remove('is-working', 'is-saved', 'is-error');
  if (state) btn.classList.add(state);
  if (typeof text === 'string') btn.textContent = text;

  if (state === 'is-working') {
    btn.disabled = true;
    return;
  }

  btn.disabled = false;
  const tid = setTimeout(() => {
    btn.classList.remove('is-working', 'is-saved', 'is-error');
    btn.textContent = btn.dataset.originalText || originalText;
    btn.disabled = false;
    btn.dataset.feedbackTimer = '';
  }, durationMs);
  btn.dataset.feedbackTimer = String(tid);
}

async function validateWeatherApiKeyForCurrentContext() {
  const key = (settings.weatherApiKey || '').trim();
  if (!key) return { ok: false, reason: 'empty' };

  // Validate with an inexpensive call; prefer IP auto-detect (doesn't require GPS).
  const url = `https://api.weatherapi.com/v1/current.json?key=${encodeURIComponent(key)}&q=${encodeURIComponent('auto:ip')}&aqi=no`;
  let res;
  try {
    res = await fetchWithTimeout(url, {}, 10000);
  } catch {
    return { ok: false, reason: 'network' };
  }
  if (res && res.ok) return { ok: true };
  if (res && (res.status === 401 || res.status === 403)) return { ok: false, reason: 'invalid' };
  return { ok: false, reason: 'unknown' };
}

// ============================================
// Dock & Apps
// ============================================

function initDock() {
  renderDock();
  scheduleDockMount();
}

function scheduleDockMount() {
  const dockContainer = document.querySelector('.dock-container');
  if (!dockContainer) return;
  if (dockContainer.dataset.mountInitialized === '1') return;

  dockContainer.dataset.mountInitialized = '1';

  if (settings.reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dockContainer.classList.remove('dock-preload');
    dockContainer.classList.add('dock-mounted');
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      dockContainer.classList.add('dock-mounted');
      dockContainer.classList.remove('dock-preload');
    });
  });
}

function renderDock() {
  const dock = document.getElementById('appDock');
  if (!dock) return;
  
  // Clear existing apps (keep the button and divider)
  const existingApps = dock.querySelectorAll('.dock-app');
  existingApps.forEach(app => app.remove());
  
  if (!settings.showCustomDock) {
    applyDockVisibility();
    return;
  }

  // Only render custom dock apps (user controlled)
  customDockApps.forEach(app => {
    const link = document.createElement('a');
    const safeHref = normalizeUrlForFavicon(app.url);
    link.href = safeHref || '#';
    if (!safeHref) {
      link.addEventListener('click', (e) => e.preventDefault());
    }
    link.className = 'dock-app';
    link.title = app.name;
    const img = document.createElement('img');
    img.alt = app.name;
    img.referrerPolicy = 'no-referrer';

    const safeIcon = sanitizeIconValue(app.icon);
    attachIconFallback(img, safeIcon ? [safeIcon] : getFaviconCandidates(app.url), {
      cacheHost: getHostnameFromAnyUrl(app.url) || '',
      name: app.name || '',
    });

    link.appendChild(img);
    dock.appendChild(link);
  });

  applyDockVisibility();
}

function initAppsGrid() {
  const grid = document.getElementById('appsGrid');
  if (!grid) return;
  _appsGridInitialized = true;
  clearElement(grid);
  _appsGridItems = [];

  const fragment = document.createDocumentFragment();
  
  allApps.forEach(app => {
    const item = document.createElement('a');
    item.href = app.url;
    item.className = 'app-item';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'app-icon';

    const img = document.createElement('img');
    img.alt = app.name;
    img.referrerPolicy = 'no-referrer';
    attachIconFallback(img, getFaviconCandidates(app.url), {
      cacheHost: getHostnameFromAnyUrl(app.url) || '',
      name: app.name || '',
    });
    iconWrap.appendChild(img);

    const label = document.createElement('span');
    label.textContent = app.name;

    item.appendChild(iconWrap);
    item.appendChild(label);
    fragment.appendChild(item);
    _appsGridItems.push(item);
  });

  grid.appendChild(fragment);
}

// ============================================
// Global Escape Key Handler
// ============================================

function initEscapeKeyHandler() {
  if (document._escBound) return;
  document._escBound = true;
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    // Close modals/panels in priority order (topmost first)
    const settingsPanel = document.getElementById('settingsPanel');
    const appsModal = document.getElementById('appsModal');
    const todoModal = document.getElementById('todoModal');
    const nameModal = document.getElementById('nameModal');
    const rateModal = document.getElementById('rateModal');
    const supportModal = document.getElementById('supportModal');
    const feedbackModal = document.getElementById('feedbackModal');
    const stickyNotes = document.getElementById('stickyNotes');

    if (feedbackModal && feedbackModal.classList.contains('active')) {
      void closeFeedbackModal({ submitted: false });
    } else if (supportModal && supportModal.classList.contains('active')) {
      void closeSupportModal({ supported: false });
    } else if (rateModal && rateModal.classList.contains('active')) {
      void closeRateModal({ rated: false });
    } else if (nameModal && nameModal.classList.contains('active')) {
      closeNameModal();
    } else if (todoModal && todoModal.classList.contains('active')) {
      todoModal.classList.remove('active');
      const todoOverlay = document.getElementById('todoOverlay');
      if (todoOverlay) todoOverlay.classList.remove('active');
    } else if (appsModal && appsModal.classList.contains('active')) {
      appsModal.classList.remove('active');
      const appsOverlay = document.getElementById('appsOverlay');
      if (appsOverlay) appsOverlay.classList.remove('active');
      const appsSearchInput = document.getElementById('appsSearchInput');
      if (appsSearchInput) { appsSearchInput.value = ''; filterApps(''); }
    } else if (stickyNotes && stickyNotes.classList.contains('open')) {
      stickyNotesOpen = false;
      applyStickyNotesUiState();
    } else if (settingsPanel && settingsPanel.classList.contains('active')) {
      closeSettings();
    }
  });
}

// ============================================
// Modals
// ============================================

function initModals() {
  // Apps modal
  const showAllBtn = document.getElementById('showAllApps');
  const appsModal = document.getElementById('appsModal');
  const appsOverlay = document.getElementById('appsOverlay');
  const closeApps = document.getElementById('closeAppsModal');
  const appsSearchInput = document.getElementById('appsSearchInput');
  const appsClearSearch = document.getElementById('appsClearSearch');

  bindScrollPerformance(document.getElementById('appsGrid'));

  // Prevent double-binding
  if (appsModal.dataset.initBound) return;
  appsModal.dataset.initBound = '1';
  
  showAllBtn.addEventListener('click', () => {
    if (!_appsGridInitialized) initAppsGrid();
    appsModal.classList.add('active');
    appsOverlay.classList.add('active');
    // Focus search input after modal opens
    setTimeout(() => appsSearchInput.focus(), 300);
  });
  
  const closeAppsModal = () => {
    appsModal.classList.remove('active');
    appsOverlay.classList.remove('active');
    // Clear search when closing
    appsSearchInput.value = '';
    appsClearSearch.style.display = 'none';
    filterApps('');
  };
  
  closeApps.addEventListener('click', closeAppsModal);
  appsOverlay.addEventListener('click', closeAppsModal);
  
  // Apps search functionality with debounce for smooth performance
  let searchTimeout = null;
  appsSearchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    appsClearSearch.style.display = query ? 'flex' : 'none';
    
    // Debounce search for smoother typing
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => filterApps(query), 50);
  });
  
  appsClearSearch.addEventListener('click', () => {
    appsSearchInput.value = '';
    appsClearSearch.style.display = 'none';
    if (searchTimeout) clearTimeout(searchTimeout);
    filterApps('');
    appsSearchInput.focus();
  });
  
  // Name modal
  const nameOverlay = document.getElementById('nameOverlay');
  const nameClose = document.getElementById('closeNameModal');
  const saveBtn = document.getElementById('saveNameBtn');
  
  nameClose.addEventListener('click', closeNameModal);
  nameOverlay.addEventListener('click', closeNameModal);
  saveBtn.addEventListener('click', saveName);
  
  // Real-time character count feedback
  const nameInputEl = document.getElementById('nameInput');
  nameInputEl.addEventListener('input', (e) => {
    const len = e.target.value.trim().length;
    const maxLen = INPUT_LIMITS.userName;
    const remaining = maxLen - len;
    
    // Update visual feedback
    if (len > maxLen) {
      nameInputEl.style.borderColor = '#ff4444';
      nameInputEl.style.backgroundColor = 'rgba(255, 68, 68, 0.1)';
    } else if (remaining <= 3) {
      nameInputEl.style.borderColor = '#ffaa00';
      nameInputEl.style.backgroundColor = 'rgba(255, 170, 0, 0.1)';
    } else {
      nameInputEl.style.borderColor = '';
      nameInputEl.style.backgroundColor = '';
    }
    
    // Show character count
    const countEl = document.getElementById('nameCharCount') || createCharCountDisplay();
    countEl.textContent = `${len}/${maxLen}`;
    countEl.style.color = len > maxLen ? '#ff4444' : (remaining <= 3 ? '#ffaa00' : 'rgba(255,255,255,0.6)');
  });
  
  nameInputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveName();
  });

  // Rate prompt modal
  const rateOverlay = document.getElementById('rateOverlay');
  const rateNowBtn = document.getElementById('rateNowBtn');
  const rateLaterBtn = document.getElementById('rateLaterBtn');
  const rateCloseBtn = document.getElementById('closeRateModal');
  const satisfactionLove = document.getElementById('satisfactionLove');
  const satisfactionOkay = document.getElementById('satisfactionOkay');
  const satisfactionNeedsWork = document.getElementById('satisfactionNeedsWork');

  if (rateOverlay && !rateOverlay.dataset.initBound) {
    rateOverlay.dataset.initBound = '1';
    rateOverlay.addEventListener('click', () => { void closeRateModal({ rated: false }); });
  }

  // Step 1: Satisfaction Buttons
  if (satisfactionLove && !satisfactionLove.dataset.initBound) {
    satisfactionLove.dataset.initBound = '1';
    satisfactionLove.addEventListener('click', (e) => {
      e.preventDefault();
      // User loves it - show review prompt (step 2)
      showRateStep(2);
      const reviewBtn = document.getElementById('rateNowBtn');
      if (reviewBtn) setTimeout(() => reviewBtn.focus(), 60);
    });
  }

  if (satisfactionOkay && !satisfactionOkay.dataset.initBound) {
    satisfactionOkay.dataset.initBound = '1';
    satisfactionOkay.addEventListener('click', (e) => {
      e.preventDefault();
      // Rating-only flow: send all users to review step.
      showRateStep(2);
      const reviewBtn = document.getElementById('rateNowBtn');
      if (reviewBtn) setTimeout(() => reviewBtn.focus(), 60);
    });
  }

  if (satisfactionNeedsWork && !satisfactionNeedsWork.dataset.initBound) {
    satisfactionNeedsWork.dataset.initBound = '1';
    satisfactionNeedsWork.addEventListener('click', (e) => {
      e.preventDefault();
      // Rating-only flow: send all users to review step.
      showRateStep(2);
      const reviewBtn = document.getElementById('rateNowBtn');
      if (reviewBtn) setTimeout(() => reviewBtn.focus(), 60);
    });
  }

  // Step 2: Review Prompt Actions
  if (rateLaterBtn && !rateLaterBtn.dataset.initBound) {
    rateLaterBtn.dataset.initBound = '1';
    rateLaterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      void closeRateModal({ rated: false });
    });
  }

  if (rateNowBtn && !rateNowBtn.dataset.initBound) {
    rateNowBtn.dataset.initBound = '1';
    rateNowBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      // Show loading state
      showRateStep(4);
      
      // Delay 1-1.5 seconds before opening store
      const delay = 1000 + Math.random() * 500;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      try {
        const w = window.open(RATE_STORE_URL, '_blank', 'noopener,noreferrer');
        if (w) w.opener = null;
      } catch {
        // ignore
      }
      await closeRateModal({ rated: true });
    });
  }

  if (rateCloseBtn && !rateCloseBtn.dataset.initBound) {
    rateCloseBtn.dataset.initBound = '1';
    rateCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      void closeRateModal({ rated: false });
    });
  }

  // Support prompt modal
  const supportOverlay = document.getElementById('supportOverlay');
  const supportNowBtn = document.getElementById('supportNowBtn');
  const supportLaterBtn = document.getElementById('supportLaterBtn');
  const supportCloseBtn = document.getElementById('closeSupportModal');

  if (supportOverlay && !supportOverlay.dataset.initBound) {
    supportOverlay.dataset.initBound = '1';
    supportOverlay.addEventListener('click', () => { void closeSupportModal({ supported: false }); });
  }

  if (supportLaterBtn && !supportLaterBtn.dataset.initBound) {
    supportLaterBtn.dataset.initBound = '1';
    supportLaterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      void closeSupportModal({ supported: false });
    });
  }

  if (supportNowBtn && !supportNowBtn.dataset.initBound) {
    supportNowBtn.dataset.initBound = '1';
    supportNowBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const w = window.open(SUPPORT_COFFEE_URL, '_blank', 'noopener,noreferrer');
        if (w) w.opener = null;
      } catch {
        // ignore
      }
      await closeSupportModal({ supported: true });
    });
  }

  if (supportCloseBtn && !supportCloseBtn.dataset.initBound) {
    supportCloseBtn.dataset.initBound = '1';
    supportCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      void closeSupportModal({ supported: false });
    });
  }

  // Feedback prompt modal
  const feedbackOverlay = document.getElementById('feedbackOverlay');
  const feedbackNowBtn = document.getElementById('feedbackNowBtn');
  const feedbackLaterBtn = document.getElementById('feedbackLaterBtn');
  const feedbackCloseBtn = document.getElementById('closeFeedbackModal');

  if (feedbackOverlay && !feedbackOverlay.dataset.initBound) {
    feedbackOverlay.dataset.initBound = '1';
    feedbackOverlay.addEventListener('click', () => { void closeFeedbackModal({ submitted: false }); });
  }

  if (feedbackLaterBtn && !feedbackLaterBtn.dataset.initBound) {
    feedbackLaterBtn.dataset.initBound = '1';
    feedbackLaterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      void closeFeedbackModal({ submitted: false });
    });
  }

  if (feedbackNowBtn && !feedbackNowBtn.dataset.initBound) {
    feedbackNowBtn.dataset.initBound = '1';
    feedbackNowBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const w = window.open(FEEDBACK_FORM_URL, '_blank', 'noopener,noreferrer');
        if (w) w.opener = null;
      } catch {
        // ignore
      }
      await closeFeedbackModal({ submitted: true });
    });
  }

  if (feedbackCloseBtn && !feedbackCloseBtn.dataset.initBound) {
    feedbackCloseBtn.dataset.initBound = '1';
    feedbackCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      void closeFeedbackModal({ submitted: false });
    });
  }
}

// Filter apps in the grid
function filterApps(query) {
  const grid = document.getElementById('appsGrid');
  if (!grid) return;

  const appItems = _appsGridItems.length ? _appsGridItems : Array.from(grid.querySelectorAll('.app-item'));
  if (!appItems.length) return;

  const lowerQuery = query.toLowerCase().trim();

  if (_appsFilterRafId !== null) {
    try { cancelAnimationFrame(_appsFilterRafId); } catch (e) { /* ignore */ }
    _appsFilterRafId = null;
  }
  
  // Use requestAnimationFrame for smooth rendering
  _appsFilterRafId = requestAnimationFrame(() => {
    _appsFilterRafId = null;
    appItems.forEach(item => {
      const appName = item.querySelector('span').textContent.toLowerCase();
      const isVisible = lowerQuery === '' || appName.includes(lowerQuery);
      item.classList.toggle('filtered-out', !isVisible);
    });
  });
}

// ============================================
// ToDo Widget
// ============================================

let todos = [];

function initTodo() {
  // Load todos from localStorage with shape validation
  try {
    const saved = localStorage.getItem('ios-newtab-todos');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        todos = parsed.slice(0, INPUT_LIMITS.maxTodos).filter(t => {
          if (!t || typeof t !== 'object') return false;
          if (typeof t.id !== 'number' || !Number.isFinite(t.id)) return false;
          if (typeof t.text !== 'string' || !t.text.trim()) return false;
          return true;
        }).map(t => ({
          id: t.id,
          text: sanitizeText(t.text, INPUT_LIMITS.todoText),
          completed: !!t.completed
        }));
      }
    }
  } catch (e) {
    console.error('Error loading todos:', e);
  }
  
  renderTodos();
  
  // Elements
  const widget = document.getElementById('todoWidget');
  const modal = document.getElementById('todoModal');
  const overlay = document.getElementById('todoOverlay');
  const closeBtn = document.getElementById('closeTodoModal');
  const input = document.getElementById('todoInput');
  const inputHint = document.getElementById('todoInputHint');
  const submitBtn = document.getElementById('todoSubmitBtn');

  // Prevent double-binding
  if (widget.dataset.initBound) return;
  widget.dataset.initBound = '1';
  
  // Open modal
  const openTodoModal = () => {
    modal.classList.add('active');
    overlay.classList.add('active');
    setTimeout(() => input.focus(), 200);
  };
  
  // Close modal
  const closeTodoModal = () => {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  };
  
  // Event listeners
  widget.addEventListener('click', openTodoModal);
  closeBtn.addEventListener('click', closeTodoModal);
  overlay.addEventListener('click', closeTodoModal);
  
  // Add todo
  const addTodo = () => {
    const raw = input.value.trim();
    if (!raw) return;
    // Enforce text length limit
    if (raw.length > INPUT_LIMITS.todoText) {
      showInputError(input, `Task too long (max ${INPUT_LIMITS.todoText} chars).`);
      return;
    }
    // Enforce max todos limit
    if (todos.length >= INPUT_LIMITS.maxTodos) {
      showInputError(input, `Maximum ${INPUT_LIMITS.maxTodos} tasks. Delete some first.`);
      return;
    }
    const text = sanitizeText(raw, INPUT_LIMITS.todoText);
    if (text) {
      todos.unshift({
        id: Date.now(),
        text: text,
        completed: false
      });
      saveTodos();
      renderTodos();
      input.value = '';
      if (inputHint) {
        inputHint.textContent = '';
        inputHint.classList.remove('warn');
      }
    }
  };

  input.addEventListener('input', () => {
    if (input.value.length > INPUT_LIMITS.todoText) {
      input.value = input.value.slice(0, INPUT_LIMITS.todoText);
    }
    const len = input.value.trim().length;
    if (!inputHint) return;
    if (len >= INPUT_LIMITS.todoText) {
      inputHint.textContent = `Max ${INPUT_LIMITS.todoText} characters`;
      inputHint.classList.add('warn');
      return;
    }
    inputHint.textContent = '';
    inputHint.classList.remove('warn');
  });
  
  submitBtn.addEventListener('click', addTodo);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });
}

function saveTodos() {
  try {
    localStorage.setItem('ios-newtab-todos', JSON.stringify(todos));
  } catch (e) {
    console.error('Error saving todos:', e);
  }
}

function renderTodos() {
  const list = document.getElementById('todoList');
  if (!list) return;
  clearElement(list);
  
  if (todos.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'todo-empty';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.5');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2');
    svg.appendChild(path);

    const p = document.createElement('p');
    p.textContent = 'No tasks yet. Add one above!';

    empty.appendChild(svg);
    empty.appendChild(p);
    list.appendChild(empty);
    return;
  }

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    li.dataset.id = String(todo.id);

    const toggleBtn = document.createElement('button');
    toggleBtn.className = `todo-checkbox${todo.completed ? ' checked' : ''}`;
    toggleBtn.dataset.action = 'toggle';
    toggleBtn.dataset.id = String(todo.id);
    toggleBtn.type = 'button';

    const checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    checkSvg.setAttribute('viewBox', '0 0 24 24');
    checkSvg.setAttribute('fill', 'none');
    checkSvg.setAttribute('stroke', 'currentColor');
    checkSvg.setAttribute('stroke-width', '3');
    const checkPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    checkPath.setAttribute('d', 'M5 13l4 4L19 7');
    checkSvg.appendChild(checkPath);
    toggleBtn.appendChild(checkSvg);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const delBtn = document.createElement('button');
    delBtn.className = 'todo-delete';
    delBtn.dataset.action = 'delete';
    delBtn.dataset.id = String(todo.id);
    delBtn.type = 'button';
    const xSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    xSvg.setAttribute('viewBox', '0 0 24 24');
    xSvg.setAttribute('fill', 'none');
    xSvg.setAttribute('stroke', 'currentColor');
    xSvg.setAttribute('stroke-width', '2');
    const xPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    xPath.setAttribute('d', 'M18 6L6 18M6 6l12 12');
    xSvg.appendChild(xPath);
    delBtn.appendChild(xSvg);

    li.appendChild(toggleBtn);
    li.appendChild(text);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  if (!list.dataset.bound) {
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn || !list.contains(btn)) return;
      e.preventDefault();
      const id = Number(btn.dataset.id);
      if (!Number.isFinite(id)) return;
      if (btn.dataset.action === 'toggle') toggleTodo(id);
      if (btn.dataset.action === 'delete') deleteTodo(id);
    });
    list.dataset.bound = '1';
  }
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

// ============================================
// Settings Panel
// ============================================

function initSettingsPanel() {
  const settingsBtn = document.getElementById('settingsBtn');
  const panel = document.getElementById('settingsPanel');
  const overlay = document.getElementById('settingsOverlay');
  const closeBtn = document.getElementById('closeSettings');

  // Prevent double-binding
  if (panel.dataset.initBound) return;
  panel.dataset.initBound = '1';
  
  settingsBtn.addEventListener('click', () => {
    // Use RAF for smooth animation start
    requestAnimationFrame(() => {
      panel.classList.add('active');
      overlay.classList.add('active');
    });
  });
  
  closeBtn.addEventListener('click', closeSettings);
  overlay.addEventListener('click', closeSettings);

  bindScrollPerformance(panel.querySelector('.settings-content'));
  
  // Initialize all settings controls
  initSettingsControls();
}

function closeSettings() {
  const panel = document.getElementById('settingsPanel');
  const overlay = document.getElementById('settingsOverlay');
  requestAnimationFrame(() => {
    panel.classList.remove('active');
    overlay.classList.remove('active');
  });
}

function initSettingsControls() {
  // ===== CLOCK SETTINGS =====
  initToggle('toggleHideClock', 'hideClock', () => {
    const clockContainer = document.querySelector('.clock-container');
    if (clockContainer) clockContainer.style.display = settings.hideClock ? 'none' : 'block';
    restartClockTimer();
  });
  
  initToggle('toggleDigitalClock', 'digitalClock', () => {
    updateClockDisplay();
    updateDigitalClockSubOptions();
    restartClockTimer();
  });
  initToggle('toggle12Hour', 'use12Hour', updateClockDisplay);
  initToggle('toggleSeconds', 'showSeconds', () => {
    const secondHand = document.getElementById('secondHand');
    if (secondHand) secondHand.style.display = settings.showSeconds ? 'block' : 'none';
    updateClockDisplay();
    restartClockTimer();
  });
  
  // Show/hide digital-only sub-options on init
  updateDigitalClockSubOptions();
  
  // ===== GREETING SETTINGS =====
  initToggle('toggleGreeting', 'showGreeting', () => {
    const greetingContainer = document.querySelector('.greeting-container');
    const greetingText = document.getElementById('greetingText');
    if (greetingContainer) greetingContainer.style.display = settings.showGreeting ? 'block' : 'none';
    if (greetingText) greetingText.style.display = settings.showGreeting ? 'block' : 'none';
  });
  
  initToggle('toggleCustomText', 'showCustomText', () => {
    const userName = document.getElementById('userName');
    if (userName) userName.style.display = settings.showCustomText ? 'block' : 'none';
  });

  // ===== SEARCH SETTINGS =====
  initToggle('toggleHideMic', 'hideMic', () => {
    const micBtn = document.getElementById('micBtn');
    const input = document.getElementById('searchInput');
    applyMicVisibility();

    // If the user re-enables the microphone after startup, ensure voice search is initialized.
    if (micBtn && input && !settings.hideMic) {
      initVoiceSearch(micBtn, input);
    }
  });

  initToggle('toggleQuotes', 'showQuotes', () => {
    const quoteContainer = document.getElementById('quoteContainer');
    if (!quoteContainer) return;

    quoteContainer.style.display = settings.showQuotes ? 'block' : 'none';
    if (settings.showQuotes && !quoteContainer.querySelector('.quote-text')?.textContent) {
      displayRandomQuote();
    }
  });

  const voiceLanguageSelect = document.getElementById('voiceLanguageSelect');
  if (voiceLanguageSelect) {
    const currentVoiceLang = sanitizeEnglishVoiceLanguage(settings.voiceLanguage, DEFAULT_SETTINGS.voiceLanguage);
    voiceLanguageSelect.value = currentVoiceLang;

    if (!voiceLanguageSelect.dataset.bound) {
      voiceLanguageSelect.addEventListener('change', () => {
        const nextVoiceLang = sanitizeEnglishVoiceLanguage(voiceLanguageSelect.value, DEFAULT_SETTINGS.voiceLanguage);
        settings.voiceLanguage = nextVoiceLang;
        voiceLanguageSelect.value = nextVoiceLang;
        saveSettings();
      });
      voiceLanguageSelect.dataset.bound = '1';
    }
  }
  
  // Name input
  const nameInput = document.getElementById('settingsName');
  if (nameInput) {
    nameInput.value = settings.userName;
    nameInput.setAttribute('maxlength', String(INPUT_LIMITS.userName));
    
    // Real-time character count feedback for settings name input
    nameInput.addEventListener('input', (e) => {
      const len = e.target.value.trim().length;
      const maxLen = INPUT_LIMITS.userName;
      const remaining = maxLen - len;
      
      // Create or update helper text
      let helperText = nameInput.parentElement.querySelector('.input-helper');
      if (!helperText) {
        helperText = document.createElement('div');
        helperText.className = 'input-helper';
        helperText.style.cssText = `
          font-size: 11px;
          color: rgba(255,255,255,0.6);
          margin-top: 4px;
          font-weight: 500;
        `;
        nameInput.parentElement.appendChild(helperText);
      }
      
      helperText.textContent = `${len}/${maxLen} characters`;
      if (len > maxLen) {
        helperText.style.color = '#ff4444';
      } else if (remaining <= 3) {
        helperText.style.color = '#ffaa00';
      } else {
        helperText.style.color = 'rgba(255,255,255,0.6)';
      }
    });
    
    nameInput.addEventListener('change', () => {
      const sanitized = sanitizeText(nameInput.value, INPUT_LIMITS.userName);
      settings.userName = sanitized;
      nameInput.value = sanitized;

      saveSettings();
      const userNameEl = document.getElementById('userName');
      if (userNameEl) userNameEl.textContent = sanitized || 'Name';
    });
  }

  initToggle('toggleUseGPS', 'useGPS', async () => {
    if (settings.useGPS) {
      // ============ STEP 1: RESET STATE ON TOGGLE ON ============
      // Clear any in-flight request from previous toggle
      geoRequestInFlight = false;
      
      // Kill any existing watchers
      if (geoWatchId !== null) {
        try { navigator.geolocation.clearWatch(geoWatchId); } catch {}
      }
      geoWatchId = null;
      
      // Reset location coordinates
      lastGeoCoords = null;
      
      // Clear cached geocode data
      geocodeCache = null;
      geocodeCacheKey = '';
      try { localStorage.removeItem('ios-newtab-geocode-cache'); } catch (e) {}

      // Persist explicit geolocation toggle key for reliability.
      storageLocalSet({ [GEOLOCATION_TOGGLE_KEY]: true }).catch(() => {});
      
      // Show detecting message
      setWeatherLocationInputValue('Detecting current location...');
      
      // Start fresh geolocation watch
      startGeolocationWatch();
      await requestGeolocationOnce();
      safeWeatherFetch(0);
      return;
    }

    // ============ STEP 1: RESET STATE ON TOGGLE OFF ============
    // Clear any in-flight request
    geoRequestInFlight = false;
    
    // Kill any active watchers
    if (geoWatchId !== null) {
      try { navigator.geolocation.clearWatch(geoWatchId); } catch {}
    }
    geoWatchId = null;
    lastGeoCoords = null;
    
    // Clear loading state from UI
    const input = document.getElementById('weatherLocation');
    if (input && input.value === 'Detecting current location...') {
      input.value = '';
    }
    
    // Reset toggle state in storage
    storageLocalSet({ [GEOLOCATION_TOGGLE_KEY]: false }).catch(() => {});
    
    // Fetch weather using user-provided location instead
    safeWeatherFetch(0);
  });
  
  // Location save button
  const saveLocationBtn = document.getElementById('saveLocation');
  const locationInput = document.getElementById('weatherLocation');
  if (saveLocationBtn && locationInput) {
    locationInput.value = settings.weatherLocation;
    locationInput.setAttribute('maxlength', String(INPUT_LIMITS.weatherLocation));
    saveLocationBtn.addEventListener('click', () => {
      const raw = String(locationInput.value || '').trim();
      if (raw.length > INPUT_LIMITS.weatherLocation) {
        showInputError(locationInput, `Location too long (max ${INPUT_LIMITS.weatherLocation} chars).`);
        return;
      }
      // Basic content check — reject suspicious patterns
      if (/<script|javascript:/i.test(raw)) {
        showInputError(locationInput, 'Invalid location input.');
        return;
      }
      setSaveButtonFeedback(saveLocationBtn, { state: 'is-working', text: 'Saving…' });
      settings.weatherLocation = sanitizeText(raw, INPUT_LIMITS.weatherLocation);
      saveSettings();
      safeWeatherFetch(0);
      setSaveButtonFeedback(saveLocationBtn, { state: 'is-saved', text: 'Saved' });
    });
  }
  
  // API key save button
  const saveApiKeyBtn = document.getElementById('saveApiKey');
  const apiKeyInput = document.getElementById('weatherApiKey');
  if (saveApiKeyBtn && apiKeyInput) {
    apiKeyInput.value = settings.weatherApiKey || '';
    apiKeyInput.setAttribute('maxlength', String(INPUT_LIMITS.weatherApiKey));
    saveApiKeyBtn.addEventListener('click', async () => {
      if (weatherApiKeyValidationInFlight) return;
      weatherApiKeyValidationInFlight = true;
      saveApiKeyBtn.disabled = true;

      const prev = settings.weatherApiKey || '';
      const rawKey = String(apiKeyInput.value || '').trim();
      
      // Validate API key format (alphanumeric only, reasonable length)
      if (rawKey && !/^[a-zA-Z0-9_\-]{8,80}$/.test(rawKey)) {
        setSaveButtonFeedback(saveApiKeyBtn, { state: 'is-error', text: 'Invalid format', durationMs: 1800 });
        weatherApiKeyValidationInFlight = false;
        saveApiKeyBtn.disabled = false;
        return;
      }
      settings.weatherApiKey = rawKey;
      saveSettings();

      setSaveButtonFeedback(saveApiKeyBtn, { state: 'is-working', text: 'Checking…' });
      const result = await validateWeatherApiKeyForCurrentContext();
      if (!result.ok) {
        // Revert on invalid key to avoid silently breaking weather.
        if (result.reason === 'invalid') {
          settings.weatherApiKey = prev;
          saveSettings();
          apiKeyInput.value = prev;
          setSaveButtonFeedback(saveApiKeyBtn, { state: 'is-error', text: 'Invalid key', durationMs: 1800 });
          weatherApiKeyValidationInFlight = false;
          saveApiKeyBtn.disabled = false;
          return;
        }

        // Network/unknown: keep saved but inform user.
        setSaveButtonFeedback(saveApiKeyBtn, { state: 'is-error', text: 'Saved (offline)', durationMs: 1600 });
        safeWeatherFetch(0);
        weatherApiKeyValidationInFlight = false;
        saveApiKeyBtn.disabled = false;
        return;
      }

      setSaveButtonFeedback(saveApiKeyBtn, { state: 'is-saved', text: 'Saved', durationMs: 1200 });
      safeWeatherFetch(0);
      weatherApiKeyValidationInFlight = false;
      saveApiKeyBtn.disabled = false;
    });
  }
  
  // ===== APPS SETTINGS =====
  initToggle('toggleTodoWidget', 'showTodoWidget', () => {
    const todoWidget = document.getElementById('todoWidget');
    if (todoWidget) todoWidget.style.display = settings.showTodoWidget ? 'flex' : 'none';
  });
  
  initToggle('toggleStickyNotes', 'showStickyNotes', () => {
    stickyNotesOpen = false;
    applyStickyNotesUiState();
  });
  
  initToggle('toggleAllApps', 'showAllApps', () => {
    const dockContainer = document.querySelector('.dock-container');
    if (dockContainer) dockContainer.style.display = settings.showAllApps ? 'flex' : 'none';
  });
  
  initToggle('toggleAdaptiveIcons', 'adaptiveIcons', applyAdaptiveIcons);
  
  // Dock position (value sync only — listener is in initDockAppsSettings)
  const dockPositionSelect = document.getElementById('dockPosition');
  if (dockPositionSelect) {
    dockPositionSelect.value = settings.dockPosition || 'bottom';
  }
  
  // Initialize custom dock apps UI
  initDockAppsSettings();
  initAiToolsSettings();
  initAllAppsSettings();
  
  // ===== THEME =====
  const themeOptions = document.querySelectorAll('#themeSelector .theme-option');
  themeOptions.forEach(btn => {
    if (btn.dataset.theme === settings.theme) btn.classList.add('active');
    btn.addEventListener('click', () => {
      themeOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      settings.theme = btn.dataset.theme;
      saveSettings();
      applyTheme();
    });
  });
  
  // ===== ACCENT COLOR =====
  const colorDots = document.querySelectorAll('#colorGrid .color-dot');
  colorDots.forEach(btn => {
    if (btn.dataset.color === settings.accentColor) btn.classList.add('active');
    btn.addEventListener('click', () => {
      colorDots.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      settings.accentColor = btn.dataset.color;
      saveSettings();
      applyAccentColor();
    });
  });
  
  // ===== WALLPAPER =====
  document.getElementById('uploadWallpaper').addEventListener('click', () => {
    document.getElementById('wallpaperInput').click();
  });
  document.getElementById('wallpaperInput').addEventListener('change', handleWallpaperUpload);
  document.getElementById('randomWallpaper').addEventListener('click', setRandomWallpaper);
  document.getElementById('clearWallpaper').addEventListener('click', clearWallpaper);
  
  // ===== DATA =====
  document.getElementById('backupSettings').addEventListener('click', backupSettings);
  document.getElementById('restoreSettings').addEventListener('click', () => {
    document.getElementById('restoreInput').click();
  });
  document.getElementById('restoreInput').addEventListener('change', restoreSettingsFromFile);
  document.getElementById('resetSettings').addEventListener('click', resetAllSettings);
}

// Helper function for toggle initialization
function initToggle(elementId, settingKey, callback) {
  const toggle = document.getElementById(elementId);
  if (!toggle) return;

  if (toggle.dataset.bound === '1') {
    toggle.checked = settings[settingKey];
    return;
  }
  
  toggle.checked = settings[settingKey];
  toggle.addEventListener('change', () => {
    settings[settingKey] = toggle.checked;
    saveSettings();
    if (callback) callback();
  });
  toggle.dataset.bound = '1';
}

// ============================================
// Theme & Appearance
// ============================================

function applyTheme() {
  const theme = settings.theme;
  
  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Keep the default engine icon color synced with active theme.
  updateSearchEngineUI();
}

function applyAccentColor() {
  const color = settings.accentColor;
  const rgb = hexToRgb(color);
  
  document.documentElement.style.setProperty('--accent', color);
  if (rgb) {
    document.documentElement.style.setProperty('--accent-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
  }
  
  // Re-apply adaptive icons when accent color changes
  applyAdaptiveIcons();
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// ============================================
// Custom Dock Apps Settings
// ============================================

let currentEditingDockAppId = null;

function initAiToolsSettings() {
  const addBtn = document.getElementById('addAiTool');
  if (addBtn && !addBtn.dataset.bound) {
    addBtn.addEventListener('click', () => {
      const newId = Date.now();
      customAiTools.push({
        id: newId,
        name: 'New AI Tool',
        url: 'https://'
      });
      saveAiTools();
    });
    addBtn.dataset.bound = '1';
  }
  renderAiToolsSettings();

  const toggleAiTools = document.getElementById('toggleAiTools');
  if (toggleAiTools) {
    toggleAiTools.checked = !!settings.showAiTools;
    if (!toggleAiTools.dataset.bound) {
      toggleAiTools.addEventListener('change', (e) => {
        settings.showAiTools = e.target.checked;
        saveSettings();
        applyAiToolsVisibility();
      });
      toggleAiTools.dataset.bound = '1';
    }
  }
}

function renderAiToolsSettings() {
  const list = document.getElementById('aiToolsList');
  if (!list) return;

  clearElement(list);

  if (customAiTools.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'dock-empty';
    empty.textContent = 'No custom tools. Click Add to create one.';
    list.appendChild(empty);
    return;
  }

  customAiTools.forEach((tool, index) => {
    const item = document.createElement('div');
    item.className = 'dock-app-item ai-tool-settings-item';
    item.dataset.id = String(tool.id);

    // Left: Icon Preview
    const iconWrap = document.createElement('div');
    iconWrap.className = 'dock-app-icon';
    const img = document.createElement('img');
    img.alt = tool.name || '';
    iconWrap.appendChild(img);
    item.appendChild(iconWrap);

    attachIconFallback(img, getFaviconCandidates(tool.url), {
      name: tool.name,
      cacheHost: getHostnameFromAnyUrl(tool.url) || '',
    });

    // Middle: Inputs
    const inputs = document.createElement('div');
    inputs.className = 'dock-app-inputs';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'dock-app-name';
    nameInput.value = tool.name || '';
    nameInput.dataset.id = String(tool.id);
    nameInput.dataset.field = 'name';
    nameInput.placeholder = 'Tool name';
    nameInput.maxLength = 50;

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'dock-app-url';
    urlInput.value = tool.url || '';
    urlInput.dataset.id = String(tool.id);
    urlInput.dataset.field = 'url';
    urlInput.placeholder = 'https://ai-service.com';
    urlInput.maxLength = 500;

    inputs.appendChild(nameInput);
    inputs.appendChild(urlInput);
    item.appendChild(inputs);

    // Right: Reorder & Delete
    const actions = document.createElement('div');
    actions.className = 'dock-app-actions ai-tool-actions';

    const reorderWrap = document.createElement('div');
    reorderWrap.className = 'ai-reorder-buttons';

    const upBtn = document.createElement('button');
    upBtn.className = 'ai-reorder-btn up';
    upBtn.innerHTML = '▲';
    upBtn.disabled = index === 0;
    upBtn.addEventListener('click', () => {
      if (index > 0) {
        const temp = customAiTools[index];
        customAiTools[index] = customAiTools[index - 1];
        customAiTools[index - 1] = temp;
        saveAiTools();
      }
    });

    const downBtn = document.createElement('button');
    downBtn.className = 'ai-reorder-btn down';
    downBtn.innerHTML = '▼';
    downBtn.disabled = index === customAiTools.length - 1;
    downBtn.addEventListener('click', () => {
      if (index < customAiTools.length - 1) {
        const temp = customAiTools[index];
        customAiTools[index] = customAiTools[index + 1];
        customAiTools[index + 1] = temp;
        saveAiTools();
      }
    });

    reorderWrap.appendChild(upBtn);
    reorderWrap.appendChild(downBtn);
    actions.appendChild(reorderWrap);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'ai-delete-btn-minimal';
    deleteBtn.dataset.id = String(tool.id);
    deleteBtn.title = 'Remove AI tool';
    deleteBtn.type = 'button';
    deleteBtn.innerHTML = '✕';
    deleteBtn.addEventListener('click', () => {
      customAiTools = customAiTools.filter(t => String(t.id) !== String(tool.id));
      saveAiTools();
    });

    item.appendChild(actions);
    item.appendChild(deleteBtn); // Top right
    list.appendChild(item);

    // Event listeners for inputs
    const saveOnInput = (e) => {
      const field = e.target.dataset.field;
      const id = e.target.dataset.id;
      const t = customAiTools.find(x => String(x.id) === String(id));
      if (t) {
        t[field] = e.target.value;
        // debounce save
        clearTimeout(t._saveTimer);
        t._saveTimer = setTimeout(() => {
          saveAiTools();
        }, 800);
      }
    };

    nameInput.addEventListener('input', saveOnInput);
    urlInput.addEventListener('input', saveOnInput);
  });
}

function initAllAppsSettings() {
  const addBtn = document.getElementById('addAllApp');
  if (addBtn && !addBtn.dataset.bound) {
    addBtn.addEventListener('click', () => {
      const newApp = {
        id: Date.now(),
        name: 'New App',
        url: 'https://',
      };
      allApps.push(newApp);
      saveAllApps();
      renderAllAppsSettings();
      initAppsGrid(); // Update actual modal grid
    });
    addBtn.dataset.bound = '1';
  }

  const toggleAllApps = document.getElementById('toggleAllApps');
  if (toggleAllApps) {
    toggleAllApps.checked = !!settings.showAllApps;
    if (!toggleAllApps.dataset.bound) {
      toggleAllApps.addEventListener('change', (e) => {
        settings.showAllApps = e.target.checked;
        saveSettings();
        applyAllAppsVisibility();
      });
      toggleAllApps.dataset.bound = '1';
    }
  }

  renderAllAppsSettings();
}

function renderAllAppsSettings() {
  const list = document.getElementById('allAppsList');
  if (!list) return;

  clearElement(list);
  
  if (allApps.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'dock-empty';
    empty.textContent = 'No apps in grid. Click Add to create one.';
    list.appendChild(empty);
    return;
  }

  allApps.forEach((app, index) => {
    const item = document.createElement('div');
    item.className = 'dock-app-item ai-tool-settings-item';
    item.dataset.id = String(app.id);

    // Left: Icon Preview
    const iconWrap = document.createElement('div');
    iconWrap.className = 'dock-app-icon';
    const img = document.createElement('img');
    img.alt = app.name || '';
    iconWrap.appendChild(img);
    item.appendChild(iconWrap);

    attachIconFallback(img, getFaviconCandidates(app.url), {
      name: app.name,
      cacheHost: getHostnameFromAnyUrl(app.url) || '',
    });

    // Middle: Inputs
    const inputs = document.createElement('div');
    inputs.className = 'dock-app-inputs';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'dock-app-name';
    nameInput.value = app.name || '';
    nameInput.dataset.id = String(app.id);
    nameInput.dataset.field = 'name';
    nameInput.placeholder = 'App name';
    nameInput.maxLength = INPUT_LIMITS.dockAppName;

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'dock-app-url';
    urlInput.value = app.url || '';
    urlInput.dataset.id = String(app.id);
    urlInput.dataset.field = 'url';
    urlInput.placeholder = 'https://example.com';
    urlInput.maxLength = INPUT_LIMITS.dockAppUrl;

    inputs.appendChild(nameInput);
    inputs.appendChild(urlInput);
    item.appendChild(inputs);

    // Right: Reorder & Delete
    const actions = document.createElement('div');
    actions.className = 'dock-app-actions ai-tool-actions';

    const reorderWrap = document.createElement('div');
    reorderWrap.className = 'ai-reorder-buttons';

    const upBtn = document.createElement('button');
    upBtn.className = 'ai-reorder-btn up';
    upBtn.innerHTML = '▲';
    upBtn.disabled = index === 0;
    upBtn.addEventListener('click', () => {
      if (index > 0) {
        const temp = allApps[index];
        allApps[index] = allApps[index - 1];
        allApps[index - 1] = temp;
        saveAllApps();
        initAppsGrid();
        renderAllAppsSettings();
      }
    });

    const downBtn = document.createElement('button');
    downBtn.className = 'ai-reorder-btn down';
    downBtn.innerHTML = '▼';
    downBtn.disabled = index === allApps.length - 1;
    downBtn.addEventListener('click', () => {
      if (index < allApps.length - 1) {
        const temp = allApps[index];
        allApps[index] = allApps[index + 1];
        allApps[index + 1] = temp;
        saveAllApps();
        initAppsGrid();
        renderAllAppsSettings();
      }
    });

    reorderWrap.appendChild(upBtn);
    reorderWrap.appendChild(downBtn);
    actions.appendChild(reorderWrap);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'ai-delete-btn-minimal';
    deleteBtn.dataset.id = String(app.id);
    deleteBtn.title = 'Remove app from grid';
    deleteBtn.type = 'button';
    deleteBtn.innerHTML = '✕';
    deleteBtn.addEventListener('click', () => {
      allApps = allApps.filter(t => String(t.id) !== String(app.id));
      saveAllApps();
      initAppsGrid();
      renderAllAppsSettings();
    });

    item.appendChild(actions);
    item.appendChild(deleteBtn);
    list.appendChild(item);

    // Event listeners for inputs
    const saveOnInput = (e) => {
      const field = e.target.dataset.field;
      const id = e.target.dataset.id;
      const a = allApps.find(x => String(x.id) === String(id));
      if (a) {
        a[field] = e.target.value;
        // debounce save
        clearTimeout(a._saveTimer);
        a._saveTimer = setTimeout(() => {
          saveAllApps();
          initAppsGrid();
        }, 800);
      }
    };

    nameInput.addEventListener('input', saveOnInput);
    urlInput.addEventListener('input', saveOnInput);
  });
}

function saveAllApps() {
  const data = allApps.map(a => ({
    id: a.id,
    name: a.name,
    url: a.url
  }));
  localStorage.setItem('allApps', JSON.stringify(data));
  if (window.chrome && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ allApps: data });
  }
}

function sanitizeAllApps(input) {
  if (!Array.isArray(input)) return [...DEFAULT_ALL_APPS];
  const out = [];
  input.slice(0, 50).forEach((raw, index) => {
    if (!isPlainObject(raw)) return;
    const idNum = Number(raw.id);
    const id = Number.isFinite(idNum) ? idNum : (index + 1);
    const name = (typeof raw.name === 'string' ? raw.name : '').replace(/<[^>]*>/g, '').trim().slice(0, INPUT_LIMITS.dockAppName) || 'App';
    const rawUrl = (typeof raw.url === 'string' ? raw.url : '').trim().slice(0, INPUT_LIMITS.dockAppUrl);
    const url = normalizeUrlForFavicon(rawUrl) || '';
    out.push({ id, name, url });
  });
  return out;
}

function initDockAppsSettings() {
  const addBtn = document.getElementById('addDockApp');
  const positionSelect = document.getElementById('dockPosition');
  
  // Initialize position select (guard against duplicate listeners)
  if (positionSelect) {
    positionSelect.value = settings.dockPosition || 'bottom';
    if (!positionSelect.dataset.bound) {
      positionSelect.addEventListener('change', (e) => {
        settings.dockPosition = e.target.value;
        saveSettings();
        applyDockPosition();
      });
      positionSelect.dataset.bound = '1';
    }
  }
  
  if (addBtn && !addBtn.dataset.bound) {
    addBtn.addEventListener('click', () => {
      // Enforce max dock apps limit
      if (customDockApps.length >= INPUT_LIMITS.maxDockApps) {
        alert(`Maximum ${INPUT_LIMITS.maxDockApps} dock apps allowed. Remove one first.`);
        return;
      }
      const newApp = {
        id: Date.now(),
        name: 'New App',
        url: '',
        icon: ''
      };
      customDockApps.push(newApp);
      saveDockApps();
      renderDockAppsSettings();
      renderDock(); // Update actual dock
    });
    addBtn.dataset.bound = '1';
  }
  
  const toggleCustomDock = document.getElementById('toggleCustomDock');
  if (toggleCustomDock) {
    toggleCustomDock.checked = !!settings.showCustomDock;
    if (!toggleCustomDock.dataset.bound) {
      toggleCustomDock.addEventListener('change', (e) => {
        settings.showCustomDock = e.target.checked;
        saveSettings();
        applyDockVisibility();
        renderDock();
      });
      toggleCustomDock.dataset.bound = '1';
    }
  }
  
  renderDockAppsSettings();
}

function renderDockAppsSettings() {
  const list = document.getElementById('dockAppsList');
  if (!list) return;

  clearElement(list);
  
  if (customDockApps.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'dock-empty';
    empty.textContent = 'No custom apps. Click Add to create one.';
    list.appendChild(empty);
    return;
  }

  customDockApps.forEach((app, index) => {
    const item = document.createElement('div');
    item.className = 'dock-app-item ai-tool-settings-item';
    item.dataset.id = String(app.id);

    // Left: Icon Preview
    const iconWrap = document.createElement('div');
    iconWrap.className = 'dock-app-icon';
    const img = document.createElement('img');
    img.alt = app.name || '';
    iconWrap.appendChild(img);
    item.appendChild(iconWrap);

    attachIconFallback(img, getFaviconCandidates(app.url), {
      name: app.name,
      cacheHost: getHostnameFromAnyUrl(app.url) || '',
    });

    // Middle: Inputs
    const inputs = document.createElement('div');
    inputs.className = 'dock-app-inputs';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'dock-app-name';
    nameInput.value = app.name || '';
    nameInput.dataset.id = String(app.id);
    nameInput.dataset.field = 'name';
    nameInput.placeholder = 'App name';
    nameInput.maxLength = INPUT_LIMITS.dockAppName;

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'dock-app-url';
    urlInput.value = app.url || '';
    urlInput.dataset.id = String(app.id);
    urlInput.dataset.field = 'url';
    urlInput.placeholder = 'https://example.com';
    urlInput.maxLength = INPUT_LIMITS.dockAppUrl;

    inputs.appendChild(nameInput);
    inputs.appendChild(urlInput);
    item.appendChild(inputs);

    // Right: Reorder & Delete
    const actions = document.createElement('div');
    actions.className = 'dock-app-actions ai-tool-actions';

    const reorderWrap = document.createElement('div');
    reorderWrap.className = 'ai-reorder-buttons';

    const upBtn = document.createElement('button');
    upBtn.className = 'ai-reorder-btn up';
    upBtn.innerHTML = '▲';
    upBtn.disabled = index === 0;
    upBtn.addEventListener('click', () => {
      if (index > 0) {
        const temp = customDockApps[index];
        customDockApps[index] = customDockApps[index - 1];
        customDockApps[index - 1] = temp;
        saveDockApps();
        renderDock();
        renderDockAppsSettings();
      }
    });

    const downBtn = document.createElement('button');
    downBtn.className = 'ai-reorder-btn down';
    downBtn.innerHTML = '▼';
    downBtn.disabled = index === customDockApps.length - 1;
    downBtn.addEventListener('click', () => {
      if (index < customDockApps.length - 1) {
        const temp = customDockApps[index];
        customDockApps[index] = customDockApps[index + 1];
        customDockApps[index + 1] = temp;
        saveDockApps();
        renderDock();
        renderDockAppsSettings();
      }
    });

    reorderWrap.appendChild(upBtn);
    reorderWrap.appendChild(downBtn);
    actions.appendChild(reorderWrap);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'ai-delete-btn-minimal';
    deleteBtn.dataset.id = String(app.id);
    deleteBtn.title = 'Remove dock app';
    deleteBtn.type = 'button';
    deleteBtn.innerHTML = '✕';
    deleteBtn.addEventListener('click', () => {
      customDockApps = customDockApps.filter(t => String(t.id) !== String(app.id));
      saveDockApps();
      renderDock();
      renderDockAppsSettings();
    });

    item.appendChild(actions);
    item.appendChild(deleteBtn);
    list.appendChild(item);

    // Event listeners for inputs
    const saveOnInput = (e) => {
      const field = e.target.dataset.field;
      const id = e.target.dataset.id;
      const a = customDockApps.find(x => String(x.id) === String(id));
      if (a) {
        a[field] = e.target.value;
        // debounce save
        clearTimeout(a._saveTimer);
        a._saveTimer = setTimeout(() => {
          saveDockApps();
          renderDock();
        }, 800);
      }
    };

    nameInput.addEventListener('input', saveOnInput);
    urlInput.addEventListener('input', saveOnInput);
  });
}



function getDomainFromUrl(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    // Explicit overrides for service subdomains where base-domain collapsing is undesirable.
    const domainMap = {
      'mail.google.com': 'gmail.com',
      'drive.google.com': 'drive.google.com',
      'docs.google.com': 'docs.google.com',
      'sheets.google.com': 'sheets.google.com',
      'slides.google.com': 'slides.google.com',
      'calendar.google.com': 'calendar.google.com',
      'photos.google.com': 'photos.google.com',
      'maps.google.com': 'maps.google.com',
      'meet.google.com': 'meet.google.com',
      'chat.google.com': 'chat.google.com',
      'music.youtube.com': 'music.youtube.com',
      'keep.google.com': 'keep.google.com'
    };
    return domainMap[hostname] || getBaseDomainFromHostname(hostname) || hostname;
  } catch {
    return 'google.com';
  }
}

// ============================================
// Motivational Quotes
// ============================================

function shuffleIndices(size) {
  const arr = Array.from({ length: size }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function isValidQuoteOrder(order) {
  if (!Array.isArray(order) || order.length !== quotes.length) return false;
  const seen = new Set();
  for (const idx of order) {
    if (!Number.isInteger(idx) || idx < 0 || idx >= quotes.length) return false;
    if (seen.has(idx)) return false;
    seen.add(idx);
  }
  return seen.size === quotes.length;
}

function loadQuoteState() {
  try {
    const raw = localStorage.getItem(QUOTE_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    const order = Array.isArray(parsed.order) ? parsed.order : null;
    const cursor = Number(parsed.cursor);
    const lastIndex = Number(parsed.lastIndex);

    if (!isValidQuoteOrder(order)) return null;
    if (!Number.isInteger(cursor) || cursor < 0 || cursor > order.length) return null;
    if (!Number.isInteger(lastIndex) || lastIndex < -1 || lastIndex >= quotes.length) return null;

    return { order, cursor, lastIndex };
  } catch {
    return null;
  }
}

function saveQuoteState() {
  if (!_quoteState) return;
  try {
    localStorage.setItem(QUOTE_STATE_KEY, JSON.stringify(_quoteState));
  } catch {
    // ignore localStorage failures
  }
}

function rebuildQuoteCycle(previousLastIndex = -1) {
  const order = shuffleIndices(quotes.length);

  // Avoid immediate repeat when rolling into a new cycle.
  if (order.length > 1 && order[0] === previousLastIndex) {
    const first = order.shift();
    order.push(first);
  }

  return {
    order,
    cursor: 0,
    lastIndex: previousLastIndex,
  };
}

function ensureQuoteState() {
  if (_quoteState) return;
  _quoteState = loadQuoteState() || rebuildQuoteCycle(-1);
}

function getNextQuote() {
  ensureQuoteState();

  if (!_quoteState || _quoteState.cursor >= _quoteState.order.length) {
    const previousLast = _quoteState && Number.isInteger(_quoteState.lastIndex) ? _quoteState.lastIndex : -1;
    _quoteState = rebuildQuoteCycle(previousLast);
  }

  const index = _quoteState.order[_quoteState.cursor];
  _quoteState.cursor += 1;
  _quoteState.lastIndex = index;
  saveQuoteState();

  return quotes[index] || '';
}

function displayRandomQuote() {
  const quoteText = document.getElementById('quoteText');
  if (!quoteText) return;

  quoteText.textContent = getNextQuote();
}

function displayNextQuoteAnimated() {
  const quoteText = document.getElementById('quoteText');
  if (!quoteText || _quoteAnimating) return;

  _quoteAnimating = true;
  quoteText.classList.add('is-transitioning');

  if (_quoteTransitionTimer) {
    try { clearTimeout(_quoteTransitionTimer); } catch (e) { /* ignore */ }
    _quoteTransitionTimer = null;
  }

  _quoteTransitionTimer = setTimeout(() => {
    quoteText.textContent = getNextQuote();
    quoteText.classList.remove('is-transitioning');
    _quoteAnimating = false;
    _quoteTransitionTimer = null;
  }, QUOTE_TRANSITION_MS);
}

function initQuoteInteractions() {
  const quoteContainer = document.getElementById('quoteContainer');
  if (!quoteContainer || quoteContainer.dataset.interactiveBound === '1') return;

  quoteContainer.dataset.interactiveBound = '1';
  quoteContainer.setAttribute('role', 'button');
  quoteContainer.setAttribute('tabindex', '0');
  quoteContainer.setAttribute('aria-label', 'Show next quote');

  quoteContainer.addEventListener('click', () => {
    if (!settings.showQuotes) return;
    displayNextQuoteAnimated();
  });

  quoteContainer.addEventListener('keydown', (e) => {
    if (!settings.showQuotes) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    displayNextQuoteAnimated();
  });
}

// Start quote interval - called during init
function startQuoteInterval() {
  if (_intervals.quote !== null) return; // Already running
  _intervals.quote = setInterval(() => {
    if (settings.showQuotes) {
      displayNextQuoteAnimated();
    }
  }, 30000);
}

// ============================================
// Adaptive Icons
// ============================================

function applyAdaptiveIcons() {
  const dock = document.querySelector('.dock');
  const appsModal = document.querySelector('.apps-modal');
  
  if (settings.adaptiveIcons) {
    if (dock) dock.classList.add('adaptive-icons');
    if (appsModal) appsModal.classList.add('adaptive-icons');
  } else {
    if (dock) dock.classList.remove('adaptive-icons');
    if (appsModal) appsModal.classList.remove('adaptive-icons');
  }
}

// ============================================
// Dock Position
// ============================================

function applyDockPosition() {
  const dockContainer = document.querySelector('.dock-container');
  if (!dockContainer) return;
  
  // Remove all position classes
  dockContainer.classList.remove('position-top', 'position-left', 'position-right', 'position-bottom');
  
  // Add the appropriate position class
  dockContainer.classList.add(`position-${settings.dockPosition || 'bottom'}`);

  // Keep mount animation frame-synced after initial layout settles.
  scheduleDockMount();
}

// ============================================
// Wallpaper
// ============================================

function preloadWallpaperImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';

    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
      img.src = '';
    };

    img.onload = async () => {
      try {
        if (typeof img.decode === 'function') {
          await img.decode();
        }
      } catch {
        // decode can fail on some browsers even when image is usable.
      }
      cleanup();
      resolve();
    };

    img.onerror = () => {
      cleanup();
      reject(new Error('Failed to preload wallpaper image'));
    };

    img.src = url;
  });
}

async function applyWallpaper(options = {}) {
  const { animateSwap = true } = options;
  const el = document.getElementById('wallpaper');
  if (DEBUG) console.log('Applying wallpaper:', settings.wallpaper ? 'Has wallpaper' : 'No wallpaper');
  
  if (!el) {
    console.error('Wallpaper element not found!');
    return;
  }

  // If the page is unloading, don't touch wallpaper state — a race condition
  // could erase the ios-newtab-has-wallpaper flag used by early-theme.js.
  if (_unloading) return;
  
  const safe = sanitizeWallpaperValue(settings.wallpaper);
  if (safe) {
    // Quote the URL to reduce any chance of CSS parsing weirdness.
    const quoted = safe.replace(/"/g, '%22').replace(/\n/g, '');
    const cssUrl = `url("${quoted}")`;
    const reduceMotion = !!settings.reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canCrossfade = animateSwap && !reduceMotion && el.classList.contains('active') && _wallpaperCurrentCssUrl && _wallpaperCurrentCssUrl !== cssUrl;

    if (canCrossfade) {
      const token = ++_wallpaperSwapToken;

      try {
        await preloadWallpaperImage(safe);
      } catch {
        // If preload fails, fall back to direct apply.
      }

      if (_unloading || token !== _wallpaperSwapToken) return;

      el.style.setProperty('--wallpaper-next-image', cssUrl);
      el.classList.add('is-swapping');

      // Let the overlay layer fade in before committing the real background.
      await new Promise((resolve) => setTimeout(resolve, 360));
      if (_unloading || token !== _wallpaperSwapToken) return;
    }

    el.style.backgroundImage = cssUrl;
    _wallpaperCurrentCssUrl = cssUrl;

    if (canCrossfade) {
      el.classList.remove('is-swapping');
      el.style.removeProperty('--wallpaper-next-image');
    }

    el.classList.add('active');
    try { localStorage.setItem('ios-newtab-has-wallpaper', '1'); } catch (e) {}
    if (DEBUG) console.log('Wallpaper applied successfully');
  } else {
    _wallpaperSwapToken += 1;
    _wallpaperCurrentCssUrl = '';
    el.classList.remove('is-swapping');
    el.style.removeProperty('--wallpaper-next-image');
    el.style.backgroundImage = '';
    el.classList.remove('active');
    try { localStorage.removeItem('ios-newtab-has-wallpaper'); } catch (e) {}
  }
  // Remove the pending class so background gradient fades in if no wallpaper
  document.documentElement.classList.remove('wallpaper-pending');
  updateWallpaperPreview();
}

function updateWallpaperPreview() {
  const preview = document.getElementById('wallpaperPreview');
  if (!preview) return;
  
  const safe = sanitizeWallpaperValue(settings.wallpaper);
  if (safe) {
    const quoted = safe.replace(/"/g, '%22').replace(/\n/g, '');
    const urlVal = `url("${quoted}")`;
    preview.style.backgroundImage = urlVal;
    preview.style.setProperty('--wp-url', urlVal);
    preview.classList.add('has-wallpaper');
    clearElement(preview);
  } else {
    preview.style.backgroundImage = '';
    preview.style.removeProperty('--wp-url');
    preview.classList.remove('has-wallpaper');
    clearElement(preview);
    const span = document.createElement('span');
    span.textContent = 'No wallpaper set';
    preview.appendChild(span);
  }
}

function handleWallpaperUpload(e) {
  const file = e.target.files[0];
  if (!file) {
    if (DEBUG) console.log('No file selected');
    return;
  }
  
  // Reset file input so re-selecting the same file triggers change event
  e.target.value = '';
  
  // Validate file type and size
  const validation = validateFileUpload(file, {
    allowedTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
    maxBytes: INPUT_LIMITS.maxWallpaperBytes,
    label: 'Wallpaper'
  });
  if (!validation.valid) {
    alert(validation.message);
    return;
  }
  
  if (DEBUG) console.log('Uploading wallpaper:', file.name, file.size, 'bytes');
  
  // Compress image before saving
  const img = new Image();
  
  const cleanupImg = () => {
    img.onload = null;
    img.onerror = null;
    img.src = ''; // Release memory
  };
  
  img.onload = () => {
    if (DEBUG) console.log('Image loaded:', img.width, 'x', img.height);
    const canvas = document.createElement('canvas');
    const maxSize = 1920;
    let width = img.width;
    let height = img.height;
    
    // Resize if too large
    if (width > maxSize || height > maxSize) {
      if (width > height) {
        height = (height / width) * maxSize;
        width = maxSize;
      } else {
        width = (width / height) * maxSize;
        height = maxSize;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convert to JPEG for smaller size
    const compressedData = canvas.toDataURL('image/jpeg', 0.8);
    if (DEBUG) console.log('Compressed size:', compressedData.length, 'chars');
    settings.wallpaper = compressedData;
    saveWallpaper(compressedData);
    applyWallpaper();
    
    cleanupImg();
  };
  
  img.onerror = () => {
    console.error('Failed to load image');
    cleanupImg();
  };
  
  const reader = new FileReader();
  reader.onload = (ev) => {
    if (DEBUG) console.log('File read complete');
    img.src = ev.target.result;
    // Clean up reader
    reader.onload = null;
    reader.onerror = null;
  };
  reader.onerror = () => {
    console.error('Failed to read file');
    reader.onload = null;
    reader.onerror = null;
  };
  reader.readAsDataURL(file);
}

async function setRandomWallpaper() {
  if (_randomWallpaperInFlight) return;

  const randomBtn = document.getElementById('randomWallpaper');
  _randomWallpaperInFlight = true;
  if (randomBtn) randomBtn.disabled = true;

  const seed = Math.random().toString(36).substring(7);
  const wallpaperUrl = `https://picsum.photos/seed/${seed}/1920/1080`;

  try {
    settings.wallpaper = wallpaperUrl;
    saveWallpaper(wallpaperUrl);
    await applyWallpaper({ animateSwap: true });
  } finally {
    _randomWallpaperInFlight = false;
    if (randomBtn) randomBtn.disabled = false;
  }
}

function clearWallpaper() {
  settings.wallpaper = '';
  saveWallpaper('');
  applyWallpaper();
}

// ============================================
// Backup & Restore
// ============================================

async function backupSettings() {
  // Create backup object with settings
  const backupData = {
    settings: { ...settings },
    customDockApps: customDockApps || [],
    backupDate: new Date().toISOString(),
    version: '2.0'
  };
  
  // Include wallpaper from chrome.storage.local
  try {
    if (hasChromeStorage()) {
      const result = await storageLocalGet(['wallpaper']);
      if (result.wallpaper) {
        backupData.wallpaper = result.wallpaper;
      }
    }
  } catch (e) {
    console.error('Error getting wallpaper for backup:', e);
  }
  
  const data = JSON.stringify(backupData, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ios-newtab-backup.json';
  a.click();
  
  URL.revokeObjectURL(url);
  
  alert('Backup created successfully!');
}

function restoreSettingsFromFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Validate backup file size
  if (file.size > INPUT_LIMITS.maxBackupBytes) {
    const sizeMB = (INPUT_LIMITS.maxBackupBytes / (1024 * 1024)).toFixed(0);
    alert(`Backup file too large (max ${sizeMB}MB). This doesn't look like a valid backup.`);
    e.target.value = '';
    return;
  }
  
  // Validate file extension
  if (!file.name.toLowerCase().endsWith('.json')) {
    alert('Invalid file type. Please select a .json backup file.');
    e.target.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = async (ev) => {
    try {
      let data;
      try {
        data = JSON.parse(ev.target.result);
      } catch (parseErr) {
        alert('Corrupted backup file. The JSON data is invalid.');
        return;
      }

      // Validate it's a plain object (not array, not primitive)
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        alert('Invalid backup format. Expected a JSON object.');
        return;
      }
      
      // Handle both old format (direct settings) and new format (wrapped)
      const settingsData = data.settings || data;
      
      // Restore settings through sanitization
      settings = { ...DEFAULT_SETTINGS, ...sanitizeLoadedSettings(settingsData) };
      saveSettings();

      // Restore dock apps if present (through sanitization)
      if (data.customDockApps || data.dockApps || settingsData.customDockApps || settingsData.dockApps) {
        customDockApps = sanitizeDockApps(data.customDockApps || data.dockApps || settingsData.customDockApps || settingsData.dockApps);
        saveDockApps();
      }
      
      // Restore wallpaper if present — sanitize before saving
      if (data.wallpaper && hasChromeStorage()) {
        const safeWallpaper = sanitizeWallpaperValue(data.wallpaper);
        if (safeWallpaper) {
          try {
            await storageLocalSet({ wallpaper: safeWallpaper });
            settings.wallpaper = safeWallpaper;
          } catch (e) {
            console.error('Error restoring wallpaper:', e);
          }
        } else {
          console.warn('Backup wallpaper rejected by sanitizer (unsafe value).');
        }
      }

      alert('Settings restored successfully! Page will reload.');
      location.reload();
    } catch (err) {
      console.error('Restore error:', err);
      alert('Invalid backup file. Please use a valid backup JSON file.');
    }
  };
  reader.readAsText(file);
  
  // Reset file input so same file can be selected again
  e.target.value = '';
}

async function resetAllSettings() {
  if (!confirm('Reset ALL settings including wallpaper? This cannot be undone.')) {
    return;
  }
  
  try {
    // Clear all extension localStorage keys
    ['ios-newtab-settings', 'ios-newtab-todos', 'ios-newtab-sticky-notes',
     'ios-newtab-dock-apps', 'ios-newtab-last-weather', 'ios-newtab-geocode-cache',
     'ios-newtab-has-wallpaper'].forEach(key => localStorage.removeItem(key));
    
    // Clear chrome.storage.local (wallpaper, dockApps, settings, welcome flag)
    if (hasChromeStorage()) {
      await storageLocalSet({ 
        wallpaper: '',
        dockApps: [],
        settings: {},
        welcomeShown: false
      });
    }
    
    alert('All settings have been reset! Page will reload.');
    location.reload();
  } catch (e) {
    console.error('Error resetting settings:', e);
    alert('Error resetting settings. Please try again.');
  }
}

// ============================================
// Welcome Screen — First Install
// ============================================

async function showWelcomeIfFirstRun() {
  try {
    const data = await storageLocalGet(['welcomeShown']);
    if (data.welcomeShown) return; // Already shown before
    
    const overlay = document.getElementById('welcomeOverlay');
    if (!overlay) return;
    
    // Show the overlay
    overlay.style.display = 'flex';
    
    // Escape key handler
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', escHandler);
        dismissWelcome(overlay);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    // Get Started button — also removes escHandler
    const btn = document.getElementById('welcomeStartBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        document.removeEventListener('keydown', escHandler);
        dismissWelcome(overlay, { showFooterTip: true });
      }, { once: true });
    }
  } catch (e) {
    if (DEBUG) console.log('Welcome screen error:', e);
  }
}

async function showFooterTipIfNeeded() {
  try {
    const data = await storageLocalGet(['footerTipShown']);
    if (data.footerTipShown) return;

    const tip = document.getElementById('footerTip');
    if (!tip) return;

    const card = tip.querySelector('.footer-tip-card');

    // If the dock is at the bottom, lift the tip above it to avoid overlap.
    const dockContainer = document.querySelector('.dock-container.position-bottom');
    if (dockContainer) {
      const dockRect = dockContainer.getBoundingClientRect();
      // Distance from viewport bottom to the top of the dock.
      const spaceAboveDock = Math.max(0, window.innerHeight - dockRect.top);
      // Add a small gap so it feels intentional.
      tip.style.bottom = `${spaceAboveDock + 14}px`;
    } else {
      tip.style.bottom = '';
    }

    // Mark as shown immediately to avoid repeats on reload
    await storageLocalSet({ footerTipShown: true });

    tip.style.display = 'block';

    // Start progress animation
    const progressBar = document.getElementById('footerTipProgressBar');
    if (progressBar) {
      progressBar.style.animation = 'none';
      // Force reflow to restart animation
      void progressBar.offsetHeight;
      progressBar.style.animation = 'footerTipProgress 8s linear forwards';
    }

    const btn = document.getElementById('footerTipGotItBtn');
    let dismissed = false;
    let timerId;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      if (timerId) clearTimeout(timerId);

      if (card) {
        card.classList.add('closing');
        setTimeout(() => {
          tip.style.display = 'none';
          if (tip.parentNode) tip.remove();
        }, 300);
      } else {
        tip.style.display = 'none';
        if (tip.parentNode) tip.remove();
      }
    };

    if (btn) {
      btn.addEventListener('click', dismiss, { once: true });
    }

    // Auto-dismiss after 8 seconds
    timerId = setTimeout(dismiss, 8000);
  } catch (e) {
    if (DEBUG) console.log('Footer tip error:', e);
  }
}

function dismissWelcome(overlay, options = {}) {
  if (!overlay || overlay.classList.contains('dismissing')) return;
  
  overlay.classList.add('dismissing');
  
  // Mark as shown so it never appears again
  storageLocalSet({ welcomeShown: true });
  
  // Remove overlay from DOM
  let removed = false;
  function removeOverlay() {
    if (removed) return;
    removed = true;
    overlay.style.display = 'none';
    if (overlay.parentNode) overlay.remove();

    if (options.showFooterTip) {
      void showFooterTipIfNeeded();
    }
  }
  
  // Remove after animation completes (with timeout fallback for reduce-motion)
  overlay.addEventListener('animationend', removeOverlay, { once: true });
  setTimeout(removeOverlay, 700);
}

// Note: Theme change listener is now tracked and registered in DOMContentLoaded
