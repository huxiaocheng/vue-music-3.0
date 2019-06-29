const storage = {
  set(key, value) {
    return localStorage.setItem(key, isObject(value)
      ? JSON.stringify(value)
      : value)
  },
  get(key, def) {
    try {
      return JSON.parse(localStorage.getItem(key)) || (def || '');
    } catch (err) {
      return localStorage.getItem(key);
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  }
}

function isObject(val) {
  return typeof val === 'object' && val !== null;
}

export default storage;