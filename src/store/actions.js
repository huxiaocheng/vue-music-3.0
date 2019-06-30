import * as types from './types'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/util';
import { getSongsUrl } from '@/api/song';
import { saveSearchHistory, delSearchHistory, clearSearchHistory } from '@/common/js/cache';

export const selectPlay = ({ commit, state }, { list, index }) => {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    const randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = ({ commit }, { list }) => {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  const randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = ({ commit, state }, song) => {
  let { currentIndex } = state;
  const playlist = state.playlist.slice();
  const sequenceList = state.sequenceList.slice();
  const currentSong = playlist[currentIndex];
  const fpIndex = findIndex(playlist, song);
  playlist.splice(++currentIndex, 0, song)
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playlist.splice(fpIndex + 1, 1);
    }
  }

  const currentSIndex = findIndex(sequenceList, currentSong) + 1;
  const fsIndex = findIndex(sequenceList, song);
  sequenceList.splice(currentSIndex, 0, song);
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}

export const saveSearch = ({ commit }, query) => {
  commit(types.SET_SEARCH_HISTORY, saveSearchHistory(query))
}

export const delSearch = ({ commit, state }, query) => {
  commit(types.SET_SEARCH_HISTORY, delSearchHistory(state.searchHistory, query))
}

export const clearSearch = ({ commit }) => {
  commit(types.SET_SEARCH_HISTORY, clearSearchHistory());
}

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}