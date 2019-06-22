<template>
  <transition appear name="slide">
    <music-list :title="singer.name" :bgImage="singer.avatar" :songs="songs"/>
  </transition>
</template>

<script>
import { getSingerDetail } from "@/api/singer";
import { mapGetters } from "vuex";
import { ERR_OK } from "@/api/config";
import { createSong } from "@/common/js/song";
import MusicList from "@/components/music-list";

export default {
  created() {
    this._getSingerDetail();
  },
  data() {
    return {
      songs: []
    };
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list);
        }
      });
    },
    _normalizeSongs(list) {
      const ret = [];
      list.forEach((item, index) => {
        const { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  computed: {
    ...mapGetters(["singer"])
  },
  components: {
    MusicList
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable';

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
