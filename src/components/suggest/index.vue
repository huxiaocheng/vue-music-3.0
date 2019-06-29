<template>
  <Scroll
    ref="suggest"
    class="suggest"
    :beforeScroll="true"
    :data="result"
    :pullup="true"
    @scrollToEnd="searchMore"
    @beforeScroll="beforeScroll"
  >
    <ul class="suggest-list">
      <li
        @click="selectItem(item)"
        class="suggest-item"
        v-for="(item, index) in result"
        :key="index"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <Loading v-show="hasMore" title/>
    </ul>
    <div class="no-result-wrapper" v-show="!result.length && !hasMore">
      <NoResult/>
    </div>
  </Scroll>
</template>

<script>
import { search } from "@/api/search";
import { ERR_OK } from "@/api/config";
import { processSongsUrl, isValidMusic, createSong } from "@/common/js/song";
import Scroll from "@/base/scroll";
import Loading from "@/base/loading";
import Singer from "@/common/js/singer";
import { mapMutations, mapActions } from "vuex";
import NoResult from "@/base/no-result";
import { throttle } from "@/common/js/util";

const TYPE_SINGER = "singer";
const perpage = 20;

export default {
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      hasMore: true
    };
  },
  created() {
    this.$watch(
      "query",
      throttle(val => {
        if (!val) {
          return;
        }
        this.searchStart();
      }, 300)
    );
  },
  methods: {
    beforeScroll() {
      this.$emit("scrollStart");
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer(item.singername, item.singermid);
        this.setSinger(singer);
        this.$router.push(`/search/${singer.id}`);
      } else {
        console.log(item);
        this.insertSong(item);
      }
      this.$emit("select", item);
    },
    refresh() {
      this.$refs["suggest"].refresh();
    },
    searchStart() {
      this.hasMore = true;
      this.page = 1;
      this.$refs["suggest"].scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then(result => {
            this.result = result;
          });
          this._checkMore(res.data);
        }
      });
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      search(this.query, this.page++, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then(result => {
            this.result = this.result.concat(result);
          });
          this._checkMore(res.data);
        }
      });
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    _checkMore(data) {
      const { list, curnum, curpage, totalnum } = data.song;
      if (!list.length || curnum + curpage * perpage >= totalnum) {
        this.hasMore = false;
      }
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({
          ...data.zhida,
          ...{ type: TYPE_SINGER }
        });
      }
      return processSongsUrl(this._normalizeSongs(data.song.list)).then(
        songs => {
          ret = ret.concat(songs);
          return ret;
        }
      );
    },
    _normalizeSongs(list) {
      const ret = [];
      list.forEach(musicData => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"])
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable';
@import '~@/common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
