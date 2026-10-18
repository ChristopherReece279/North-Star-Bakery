import { PRODUCTS, CATEGORY_LABELS, FIELD_CONFIG, STORAGE_CONFIG } from './data.mjs';
import { emptyState, normalizeState, toggleFavorite, localDateISO,
         validateRequest, addFavoriteDetails } from './logic.mjs';

let state = emptyState();
let storageAvailable = true;

function showStorageMessage() {
  const message = document.querySelector('#storage-message');
  if (message) message.textContent = storageAvailable ? '' :
    'Browser storage is unavailable. Your choices work on this page but will not be remembered after you leave.';
}

function loadPreferences() {
  try { state = normalizeState(localStorage.getItem(STORAGE_CONFIG.key)); }
  catch { state = emptyState(); storageAvailable = false; }
  showStorageMessage();
}

function savePreferences() {
  try { localStorage.setItem(STORAGE_CONFIG.key, JSON.stringify(state)); }
  catch { storageAvailable = false; }
  showStorageMessage();
}

function renderFavoriteCount() {
  document.querySelectorAll('[data-favorite-count]').forEach(element => {
    element.textContent = String(state.favorites.length);
  });
}

function renderFavoriteButtons() {
  document.querySelectorAll('[data-save-product]').forEach(button => {
    const product = PRODUCTS.find(item => item.id === button.dataset.saveProduct);
    const active = state.favorites.includes(product.id);
    button.hidden = false;
    button.textContent = active ? 'Saved' : 'Save';
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? `Remove ${product.name} from favorites` : `Save ${product.name}`);
  });
}

function renderFavorites() {
  renderFavoriteCount();
  renderFavoriteButtons();
  const list = document.querySelector('#favorites-list');
  if (!list) return;
  list.replaceChildren();
  state.favorites.forEach(id => {
    const product = PRODUCTS.find(item => item.id === id);
    const li = document.createElement('li');
    const name = document.createElement('span');name.textContent = product.name;
    const remove = document.createElement('button');
    remove.type = 'button';remove.className = 'remove-favorite';
    remove.dataset.removeId = id;remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove ${product.name} from favorites`);
    li.append(name, remove);list.append(li);
  });
  document.querySelector('#favorites-empty').hidden = state.favorites.length > 0;
  document.querySelector('#clear-favorites').hidden = state.favorites.length === 0;
}

function applyCategory() {
  const sections = [...document.querySelectorAll('[data-product-category]')];
  if (!sections.length) return;
  sections.forEach(section => {
    section.hidden = state.category !== 'all' && section.dataset.productCategory !== state.category;
  });
  const wrapper = document.querySelector('.product-categories');
  wrapper.hidden = [...wrapper.querySelectorAll('[data-product-category]')].every(section => section.hidden);
  document.querySelectorAll('[data-category]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.category === state.category));
  });
  const count = PRODUCTS.filter(product => state.category === 'all' || product.category === state.category).length;
  document.querySelector('#filter-result').textContent =
    `${CATEGORY_LABELS[state.category]}: ${count} ${count === 1 ? 'product' : 'products'} shown.`;
}

function announceFavorite(message) {
  const status = document.querySelector('#favorites-status');
  if (status) status.textContent = message;
}

function initializeProductTools() {
  document.querySelectorAll('[data-category]').forEach(button => {
    button.addEventListener('click', () => {
      state = { ...state, category: button.dataset.category };
      savePreferences();applyCategory();
    });
  });
  document.querySelectorAll('[data-save-product]').forEach(button => {
    button.addEventListener('click', () => {
      const product = PRODUCTS.find(item => item.id === button.dataset.saveProduct);
      state = toggleFavorite(state, product.id);
      savePreferences();renderFavorites();
      announceFavorite(`${product.name} ${state.favorites.includes(product.id) ? 'saved to' : 'removed from'} your shortlist.`);
    });
  });
  const list = document.querySelector('#favorites-list');
  if (list) list.addEventListener('click', event => {
    const button = event.target.closest('[data-remove-id]');
    if (!button) return;
    const product = PRODUCTS.find(item => item.id === button.dataset.removeId);
    state = toggleFavorite(state, product.id);
    savePreferences();renderFavorites();announceFavorite(`${product.name} removed from your shortlist.`);
    const next = list.querySelector('button') || document.querySelector('[data-category="all"]');
    next.focus();
  });
  const clear = document.querySelector('#clear-favorites');
  if (clear) clear.addEventListener('click', () => {
    state = { ...state, favorites: [] };
    savePreferences();renderFavorites();announceFavorite('Your shortlist is empty.');
    document.querySelector('[data-category="all"]').focus();
  });
  renderFavorites();applyCategory();
}

function initializeForm() {
  const form = document.querySelector('#request-form');
  if (!form) return;
  const fields = FIELD_CONFIG.map(config => ({ ...config, element: document.getElementById(config.id) }));
  const summary = document.querySelector('#validation-summary');
  const result = document.querySelector('#form-result');
  const type = document.querySelector('#request-type');
  const date = document.querySelector('#pickup-date');
  let attempted = false;
  function readValues() {
    return Object.fromEntries(fields.map(field => [field.key, field.element.value]));
  }
  function updateDateRequirement() {
    date.required = type.value === 'preorder';date.min = localDateISO();
  }
  function renderErrors(errors) {
    fields.forEach(field => {
      document.getElementById(field.errorId).textContent = errors[field.key] || '';
      if (errors[field.key]) field.element.setAttribute('aria-invalid', 'true');
      else field.element.removeAttribute('aria-invalid');
    });
    const count = Object.keys(errors).length;
    summary.hidden = count === 0;
    summary.textContent = count ? `Please correct ${count} ${count === 1 ? 'field' : 'fields'} below.` : '';
  }
  function checkAfterEdit() {
    result.hidden = true;updateDateRequirement();
    if (attempted) renderErrors(validateRequest(readValues()));
  }
  form.addEventListener('submit', event => {
    event.preventDefault();attempted = true;updateDateRequirement();
    const errors = validateRequest(readValues());renderErrors(errors);result.hidden = true;
    const firstInvalid = fields.find(field => errors[field.key]);
    if (firstInvalid) { firstInvalid.element.focus();return; }
    result.textContent = 'Your details passed the checks. This is a local demonstration: no bakery request has been sent and no items are reserved.';
    result.hidden = false;result.focus();
  });
  fields.forEach(field => {
    field.element.addEventListener('input', checkAfterEdit);
    field.element.addEventListener('change', checkAfterEdit);
  });
  document.querySelector('#use-favorites').addEventListener('click', () => {
    const details = document.querySelector('#item-details');
    const added = addFavoriteDetails(details.value, state.favorites);
    const status = document.querySelector('#prefill-status');
    if (added.added) {
      details.value = added.text;
      status.textContent = 'Saved products added. Include quantities and a preferred pickup time if relevant.';
      details.dispatchEvent(new Event('input', { bubbles: true }));details.focus();
    } else {
      status.textContent = added.reason === 'empty' ? 'No saved products yet. Choose favorites on Products first.' :
        added.reason === 'length' ? 'There is not enough space to add the shortlist. Shorten the details first.' :
        'Your current shortlist is already included in the details.';
    }
  });
  updateDateRequirement();
  form.noValidate = true;
}

loadPreferences();
document.querySelectorAll('[data-js-tools]').forEach(element => { element.hidden = false; });
initializeProductTools();
initializeForm();

window.addEventListener('storage', event => {
  if (event.key === STORAGE_CONFIG.key || event.key === null) {
    state = event.key === null ? emptyState() : normalizeState(event.newValue);
    renderFavorites();applyCategory();
  }
});
