<template>
  <Scroll
    class="listview"
    :data="data"
    ref="listview"
    @scroll="onWrapScroll"
    :probeType="3"
    :listenScroll="true"
  >
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="group">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
            v-for="(singer,index) in group.list"
            :key="index"
            class="list-group-item"
            @click="selectSinger(singer)"
          >
            <img v-lazy="singer.avatar" alt class="avatar">
            <span class="name" v-html="singer.name"/>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="index"
          class="item"
          :class="{current: index === currentIndex}"
          :data-index="index"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="scrollY <= 0" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="data.length === 0">
      <Loading/>
    </div>
  </Scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from "@/base/scroll";
import Loading from "@/base/loading";
import { getData } from "@/common/js/dom";

const ANCHOR_HEIGHT = 18;
const HOT_NAME = "热门";
const TITLE_HEIGHT = 30;

export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  created() {
    this.touch = {};
    this.listHeight = [];
  },
  computed: {
    shortcutList() {
      return this.data.map(item => {
        return item.title.slice(0, 1);
      });
    },
    fixedTitle() {
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex]["title"]
        : HOT_NAME;
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      const index = getData(e.target, "index");
      const firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = index;
      this._scrollTo(index);
    },
    onShortcutTouchMove(e) {
      const firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      const delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT);
      const anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    onWrapScroll(pos) {
      this.scrollY = pos.y;
    },
    selectSinger(singer) {
      this.$emit("selectSinger", singer);
    },
    _scrollTo(index) {
      if (index === null) {
        return;
      }
      this.$refs["listview"].scrollToElement(this.$refs["group"][index]);
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs["group"];
      let height = 0;
      this.listHeight.push(height);
      list.forEach((item, index) => {
        height += item.clientHeight;
        this.listHeight.push(height);
      });
    }
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this._calculateHeight();
      });
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      if (-newY < 0) {
        this.currentIndex = 0;
        return;
      } else if (
        -newY + this.$refs["listview"].$el.clientHeight >=
        listHeight[listHeight.length - 1]
      ) {
        this.currentIndex = listHeight.length - 2;
        return;
      }
      for (let i = 0; i < listHeight.length; i++) {
        const heightTop = listHeight[i];
        const heightDown = listHeight[i + 1];
        if (-newY >= heightTop && -newY < heightDown) {
          this.currentIndex = i;
          this.diff = heightDown + newY;
          return;
        }
      }
    },
    diff(newVal) {
      const fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs["fixed"].style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
