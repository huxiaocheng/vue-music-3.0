<template>
  <div class="singer">
    <listview :data="singers"/>
  </div>
</template>

<script>
import Listview from "@/base/listview";
import { getSingerList } from "@/api/singer";
import { ERR_OK } from "@/api/config";
import Singer from "@/common/js/singer";

const HOT_TITLE = "热门";
const HOT_SINGER_LEN = 10;

export default {
  created() {
    this._getSingerList();
  },
  data() {
    return {
      singers: []
    };
  },
  methods: {
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
    }
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
