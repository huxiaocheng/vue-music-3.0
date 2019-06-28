<template>
  <transition appear name="slide">
    <MusicList :rank='true' :title="topList.topTitle" :bgImage="songs && songs[0] && songs[0].image" :songs="songs"/>
  </transition>
</template>

<script>
import MusicList from "@/components/music-list/";
import { mapGetters } from "vuex";
import { getMusicList } from "@/api/rank";
import { ERR_OK } from "@/api/config";
import { processSongsUrl, isValidMusic, createSong } from "@/common/js/song";

export default {
  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push("/rank");
        return;
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.songlist)).then(songs => {
            this.songs = songs;
          });
        }
      });
    },
    _normalizeSongs(list) {
      const ret = [];
      list.forEach(item => {
        const { data } = item;
        if (isValidMusic(data)) {
          ret.push(createSong(data));
        }
      });
      return ret;
    }
  },
  computed: {
    ...mapGetters(["topList"])
  },
  components: {
    MusicList
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
