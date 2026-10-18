export const PRODUCTS = [
  { id: 'signature-loaf', name: 'Country sourdough Signature Loaf', category: 'breads' },
  { id: 'sandwich-loaf', name: 'Seeded sandwich loaf', category: 'breads' },
  { id: 'daily-rolls', name: 'Daily rolls', category: 'breads' },
  { id: 'croissant', name: 'Butter croissant', category: 'pastries' },
  { id: 'fruit-pastry', name: 'Seasonal fruit pastry', category: 'pastries' },
  { id: 'cookies', name: 'Cookies', category: 'pastries' },
  { id: 'small-cake', name: 'Small celebration cake', category: 'cakes' },
  { id: 'event-cake', name: 'Custom event cake', category: 'cakes' }
];

export const CATEGORY_LABELS = {
  all: 'All products', breads: 'Breads', pastries: 'Pastries', cakes: 'Cakes'
};

export const FIELD_CONFIG = [
  { id: 'customer-name', key: 'name', errorId: 'name-error' },
  { id: 'email', key: 'email', errorId: 'email-error' },
  { id: 'pickup-date', key: 'date', errorId: 'date-error' },
  { id: 'request-type', key: 'type', errorId: 'type-error' },
  { id: 'item-details', key: 'details', errorId: 'details-error' },
  { id: 'allergy-notes', key: 'allergy', errorId: 'allergy-error' }
];

export const REQUEST_TYPES = {
  preorder: 'Preorder request', question: 'General question', event: 'Cake or event inquiry'
};

export const STORAGE_CONFIG = {
  key: 'northStarBakery.touchstone4.preferences.v1', version: 1
};
