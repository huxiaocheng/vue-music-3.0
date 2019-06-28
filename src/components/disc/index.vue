<template>
  <transition appear name="slide">
    <music-list :title="disc.dissname" :bgImage="disc.imgurl" :songs="discList"/>
  </transition>
</template>

<script>
import MusicList from "@/components/music-list";
import { getSongList } from "@/api/recommend";
import { mapGetters } from "vuex";
import { ERR_OK } from "@/api/config";
import { processSongsUrl, isValidMusic, createSong } from "@/common/js/song";

export default {
  data() {
    return {
      discList: []
    };
  },
  created() {
    this._getSongList();
  },
  computed: {
    ...mapGetters(["disc"])
  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push("/recommend");
        return;
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then(
            songs => {
              this.discList = songs;
            }
          );
        }
      });
    },
    _normalizeSongs(list) {
      const ret = [];
      list.forEach(musicData => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
