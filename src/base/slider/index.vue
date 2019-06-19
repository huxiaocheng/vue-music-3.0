<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="slider-group">
      <slot/>
    </div>
    <div class="dots"></div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._setSliderWidth();
      this._initSlider();
    });
  },
  methods: {
    _setSliderWidth() {
      this.children = this.$refs["slider-group"].children;
      const sliderWidth = this.$refs["slider"].clientWidth;
      let width = 0;
      for (let i = 0, len = this.children.length; i < len; i++) {
        const child = this.children[i];
        child.classList.add("slider-item");
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      if (this.loop) {
        width += sliderWidth * 2;
      }
      this.$refs["slider-group"].style.width = width + "px";
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs["slider"], {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    transform: translateZ(1px);
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
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
}
</style>
