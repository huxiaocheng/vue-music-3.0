<template>
  <div class="singer" ref='singer'>
    <listview ref='listview' :data="singers" @selectSinger="selectSinger"/>
    <router-view/>
  </div>
</template>

<script>
import Listview from "@/base/listview";
import { getSingerList } from "@/api/singer";
import { ERR_OK } from "@/api/config";
import Singer from "@/common/js/singer";
import { mapMutations } from "vuex";
import { playlistMixin } from "@/common/js/mixin";

const HOT_TITLE = "热门";
const HOT_SINGER_LEN = 10;

export default {
  mixins: [playlistMixin],
  created() {
    this._getSingerList();
  },
  data() {
    return {
      singers: []
    };
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs['singer'].style['bottom'] = bottom;
      this.$refs['listview'].refresh()
    },
    selectSinger(singer) {
      this.$router.push(`/singer/${singer.id}`);
      this.setSinger(singer);
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);
        }
      });
    },
    _normalizeSinger(list) {
      const map = {
        hot: {
          title: HOT_TITLE,
          list: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.list.push(new Singer(item.Fsinger_name, item.Fsinger_mid));
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            list: []
          };
        }
        map[key].list.push(new Singer(item.Fsinger_name, item.Fsinger_mid));
      });
      const hot = [];
      const ret = [];
      for (const key in map) {
        const val = map[key];
        if (val.title === HOT_TITLE) {
          hot.push(val);
        } else if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        }
      }
      ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
      return hot.concat(ret);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  },
  components: {
    Listview
  }
};
</script>

<style lang="stylus" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
