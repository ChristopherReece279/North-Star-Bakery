import { PRODUCTS, CATEGORY_LABELS, REQUEST_TYPES, STORAGE_CONFIG } from './data.mjs';

export function emptyState() {
  return { version: STORAGE_CONFIG.version, favorites: [], category: 'all' };
}

export function normalizeState(raw) {
  try {
    const parsed = JSON.parse(raw || 'null');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return emptyState();
    const allowed = new Set(PRODUCTS.map(product => product.id));
    const favorites = Array.isArray(parsed.favorites)
      ? [...new Set(parsed.favorites.filter(id => typeof id === 'string' && allowed.has(id)))]
      : [];
    const category = Object.hasOwn(CATEGORY_LABELS, parsed.category) ? parsed.category : 'all';
    return { version: STORAGE_CONFIG.version, favorites, category };
  } catch {
    return emptyState();
  }
}

export function toggleFavorite(state, id) {
  if (!PRODUCTS.some(product => product.id === id)) return state;
  const favorites = state.favorites.includes(id)
    ? state.favorites.filter(value => value !== id) : [...state.favorites, id];
  return { ...state, favorites };
}

export function localDateISO(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

export function pickupDateError(value, required, today = localDateISO()) {
  if (!value) return required ? 'Choose a pickup date for your preorder.' : '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Enter a valid pickup date.';
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month-1, day, 12);
  if (Number.isNaN(date.valueOf()) || localDateISO(date) !== value) return 'Enter a valid pickup date.';
  if (value < today) return 'Choose today or a later pickup date.';
  if (date.getDay() === 0) return 'The bakery is closed Sunday. Choose Monday through Saturday.';
  return '';
}

export function validateRequest(values, today = localDateISO()) {
  const errors = {};
  const name = String(values.name || '').trim();
  const email = String(values.email || '').trim();
  const details = String(values.details || '').trim();
  const allergy = String(values.allergy || '').trim();
  if (name.length < 2) errors.name = 'Enter your full name using at least 2 characters.';
  else if (name.length > 100) errors.name = 'Keep your name within 100 characters.';
  if (!email) errors.email = 'Enter your email address.';
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Enter a valid email address, such as name@example.com.';
  if (!Object.hasOwn(REQUEST_TYPES, values.type)) errors.type = 'Choose a request type.';
  const dateMessage = pickupDateError(values.date || '', values.type === 'preorder', today);
  if (dateMessage) errors.date = dateMessage;
  if (details.length < 10) errors.details = 'Describe your request using at least 10 characters.';
  else if (details.length > 1500) errors.details = 'Keep item details within 1500 characters.';
  if (allergy.length > 500) errors.allergy = 'Keep allergy notes within 500 characters.';
  return errors;
}

export function addFavoriteDetails(existing, ids) {
  const names = PRODUCTS.filter(product => ids.includes(product.id)).map(product => product.name);
  if (names.length === 0) return { text: existing, added: false, reason: 'empty' };
  const addition = `Products I am interested in: ${names.join(', ')}.`;
  if (existing.includes(addition)) return { text: existing, added: false, reason: 'duplicate' };
  const text = existing.trim() ? `${existing.trim()}\n${addition}` : addition;
  if (text.length > 1500) return { text: existing, added: false, reason: 'length' };
  return { text, added: true, reason: 'added' };
}
