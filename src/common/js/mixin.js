import { mapGetters } from 'vuex';

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