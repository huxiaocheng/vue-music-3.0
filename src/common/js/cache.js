import storage from '@/common/js/storage'

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LEN = 15;

const PLAY_KEY = '__play__';
const PLAY_MAX_LEN = 200;

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

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, []);
  insertArray(songs, song, item => {
    return item.id === song.id;
  }, PLAY_MAX_LEN);
  storage.set(PLAY_KEY, songs);
  return songs;
}

export function loadPlay() {
  return storage.get(PLAY_KEY, []);
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
