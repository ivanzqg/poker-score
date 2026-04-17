const STORAGE_KEY = 'poker_game_v2';

export function saveToStorage(state) {
  try {
    uni.setStorageSync(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Save failed', e);
  }
}

export function loadFromStorage() {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearStorage() {
  try {
    uni.removeStorageSync(STORAGE_KEY);
  } catch (e) {}
}
