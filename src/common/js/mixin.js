import { mapGetters, mapMutations } from 'vuex';
import { playMode } from "@/common/js/config";
import { shuffle } from "@/common/js/util";

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlayList(this.playlist);
  },
  activated() {
    this.handlePlayList(this.playlist);
  },
  watch: {
    playlist(newList) {
      this.handlePlayList(newList);
    }
  },
  methods: {
    handlePlayList(list) {
      throw new Error('component must implement handlePlaylist method');
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
          ? "icon-loop"
          : "icon-random";
    },
    ...mapGetters([
      "sequenceList",
      "playlist",
      "currentSong",
      "mode",
      "currentIndex"
    ])
  },
  methods: {
    changeMode() {
      const mode =
        this.mode === playMode.sequence
          ? playMode.loop
          : this.mode === playMode.loop
            ? playMode.random
            : playMode.sequence;
      this.setPlayMode(mode);
      let list = [];
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      const index = list.findIndex(item => {
        return item.id === this.currentSong["id"];
      });
      this.setCurrentIndex(index);
    },
    ...mapMutations({
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX"
    })
  }
}