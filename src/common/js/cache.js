import storage from '@/common/js/storage'

export const SEARCH_KEY = '__search__';
const SEARCH_MAX_LEN = 15;

export function saveSearchHistory(query) {
  const searchs = storage.get(SEARCH_KEY, [])
  insertArray(searchs, query, item => {
    return item === query;
  }, SEARCH_MAX_LEN);
  storage.set(SEARCH_KEY, searchs);
  return searchs;
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}

export function delSearchHistory(searchs, query) {
  const index = searchs.findIndex(item => item === query);
  const list = [...searchs];
  list.splice(index, 1);
  storage.set(SEARCH_KEY, list);
  return list;
}

export function clearSearchHistory() {
  storage.remove(SEARCH_KEY);
  return [];
}

function insertArray(arr, val, compareFn, maxLen) {
  const index = arr.findIndex(compareFn);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}