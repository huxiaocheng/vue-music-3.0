<template>
  <div class="player" v-show="playlist.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"/>
          </div>
          <h1 class="title" v-html="currentSong.name"/>
          <h1 class="subtitle" v-html="currentSong.singer"/>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middle-l">
            <div class="cd-wrapper" ref="cd-wrapper">
              <div class="cd" ref="imageWrapper">
                <img ref="image" :class="cdRotate" class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="text"
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                  :class="{current: currentLyricLine === index}"
                >{{line.txt}}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentShow === 'cd'}"/>
            <span class="dot" :class="{active: currentShow === 'lyric'}"/>
          </div>
          <div class="progress-wrapper">
            <span class="time tile-l">{{this.format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar :percent="percent" @percentChange="onProgressBarChange"/>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"/>
            </div>
            <div class="icon i-left" :class="disable">
              <i class="icon-prev" @click="prev"/>
            </div>
            <div class="icon i-center" :class="disable">
              <i :class="playIcon" @click="togglePlaying"/>
            </div>
            <div class="icon i-right" :class="disable">
              <i class="icon-next" @click="next"/>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"/>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper">
            <img width="40" height="40" :src="currentSong.image" :class="cdRotate">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"/>
          <p class="desc" v-html="currentSong.singer"/>
        </div>
        <div class="control">
          <ProgressCircle :radius="32" :percent="percent">
            <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"/>
          </ProgressCircle>
        </div>
        <div class="control" @click.stop>
          <i class="icon-playlist"/>
        </div>
      </div>
    </transition>
    <audio
      ref="audio"
      :src="currentSong.url"
      @canplay="ready"
      @ended="playEnd"
      @error="error"
      @timeupdate="updateTime"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "@/common/js/dom";
import ProgressBar from "@/base/progress-bar";
import ProgressCircle from "@/base/progress-circle";
import Scroll from "@/base/scroll";
import { playMode } from "@/common/js/config";
import { shuffle } from "@/common/js/util";
import Lyric from "lyric-parser";

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");

export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLyricLine: 0,
      currentShow: "cd",
      playingLyric: ""
    };
  },
  created() {
    this.touch = {};
  },
  computed: {
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    disable() {
      return this.songReady ? "" : "disable";
    },
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    cdRotate() {
      return this.playing ? "play" : "play pause";
    },
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList"
    ])
  },
  methods: {
    middleTouchStart(e) {
      this.touch.initiated = true;
      this.touch.move = false;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      this.touch.move = true;
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX; // 左滑是负数，右滑是正数
      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.deltaX) {
        return;
      }
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(Math.max(-window.innerWidth, left + deltaX));
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs["lyricList"].$el.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs["lyricList"].$el.style[transitionDuration] = 0;
      this.$refs["middle-l"].style["opaticy"] = 1 - this.touch.percent;
      this.$refs["middle-l"].style[transitionDuration] = 0;
    },
    middleTouchEnd() {
      if (!this.touch.move) {
        return;
      }
      let offsetWidth;
      let opacity;
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          this.currentShow = "lyric";
          opacity = 0;
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      this.touch.initiated = false;
      const time = 300;
      this.$refs["lyricList"].$el.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs["lyricList"].$el.style[transitionDuration] = `${time}ms`;
      this.$refs["middle-l"].style["opacity"] = opacity;
      this.$refs["middle-l"].style[transitionDuration] = `${time}ms`;
    },
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
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent;
      this.$refs["audio"].currentTime = currentTime;
      if (!this.playing) {
        this.togglePlaying();
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    ready() {
      this.songReady = true;
    },
    playEnd() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      this.$refs["audio"].currentTime = 0;
      this.$refs["audio"].play();
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    error() {
      this.songReady = true;
    },
    prev() {
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    next() {
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      const animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs["cd-wrapper"], "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs["cd-wrapper"].style.animation = "";
    },
    leave(el, done) {
      this.$refs["cd-wrapper"].style["transition"] = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs["cd-wrapper"].style[
        transform
      ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      const timer = setTimeout(done, 400);
      this.$refs["cd-wrapper"].addEventListener("transitionend", () => {
        clearTimeout(timer);
        done();
      });
    },
    afterLeave() {
      this.$refs["cd-wrapper"].style.transtion = "";
      this.$refs["cd-wrapper"].style[transform] = "";
    },
    format(time) {
      time = time | 0;
      const min = (time / 60) | 0;
      const second = (time % 60).toString().padStart(2, "0");
      return `${min}:${second}`;
    },
    getLyric() {
      this.currentSong
        .getLyric()
        .then(lyric => {
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
        })
        .catch(() => {
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLyricLine = 0;
        });
    },
    handleLyric({ lineNum, txt }) {
      this.currentLyricLine = lineNum;
      this.playingLyric = txt;
      if (lineNum > 5) {
        const lineElement = this.$refs["lyricLine"][lineNum - 5];
        this.$refs["lyricList"].scrollToElement(lineElement, 1000);
      } else {
        this.$refs["lyricList"].scrollTo(0, 0, 1000);
      }
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST"
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return;
      }
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      setTimeout(() => {
        this.$refs["audio"].play();
        this.getLyric();
      }, 1000);
    },
    playing(newPlaying) {
      const audio = this.$refs["audio"];
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  }
};
</script>

<style scoped lang="stylus">
@import '~@/common/stylus/variable';
@import '~@/common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }

            .play {
              animation: rotate 20s linear infinite;
            }

            .pause {
              animation-play-state: paused;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;

      .imgWrapper {
        height: 100%;
        width: 100%;

        img {
          border-radius: 50%;

          &.play {
            animation: rotate 10s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>