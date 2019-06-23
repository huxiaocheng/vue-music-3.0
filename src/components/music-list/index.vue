<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"/>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" v-show="songs.length > 0" ref="playBtn">
        <div class="play" @click="random">
          <i class="icon-play"/>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"/>
    </div>
    <div class="bg-layer" ref="layer"/>
    <Scroll
      :data="songs"
      :listenScroll="true"
      :probeType="3"
      class="list"
      ref="list"
      @scroll="musicScroll"
    >
      <div class="song-list-wrapper">
        <SongList :songs="songs" @select="selectSong"/>
      </div>
      <div class="loading-container" v-show="songs.length === 0">
        <Loading/>
      </div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from "@/base/scroll";
import SongList from "@/base/song-list";
import { prefixStyle } from "@/common/js/dom";
import Loading from "@/base/loading";
import { mapActions } from "vuex";

const RESERVED_HEIGHT = 40;
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");

export default {
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  mounted() {
    this._setBgHieght();
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`;
    }
  },
  methods: {
    random() {
      this.randomPlay({ 
        list: this.songs 
      });
    },
    selectSong(song, index) {
      this.selectPlay({
        list: this.songs,
        index
      });
    },
    musicScroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.go(-1);
    },
    _setBgHieght() {
      this.bgImageHeight = this.$refs["bgImage"].clientHeight;
      this.$refs["list"].$el.style["top"] = `${this.bgImageHeight}px`;
    },
    ...mapActions(["selectPlay", "randomPlay"])
  },
  watch: {
    scrollY(newY) {
      const minTransitionY = -this.bgImageHeight + RESERVED_HEIGHT;
      const translateY = Math.max(minTransitionY, newY);
      let zIndex = 0;
      let scale = 1;
      let blur = 0;
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`;
      const percent = Math.abs(newY / this.bgImageHeight);
      if (newY > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20 * percent, 20);
      }
      if (newY < minTransitionY) {
        zIndex = 10;
        this.$refs["bgImage"].style["padding-top"] = 0;
        this.$refs["bgImage"].style["height"] = RESERVED_HEIGHT + "px";
        this.$refs["playBtn"].style["display"] = "none";
      } else {
        this.$refs["bgImage"].style["padding-top"] = `70%`;
        this.$refs["bgImage"].style["height"] = 0;
        this.$refs["playBtn"].style["display"] = "block";
      }
      this.$refs["bgImage"].style["z-index"] = zIndex;
      this.$refs["bgImage"].style[transform] = `scale(${scale})`;
      this.$refs["filter"].style[backdrop] = `blur(${blur}px)`;
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable';
@import '~@/common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
