<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{title}}</p>
          <div class="operate" @click.stop>
            <div class="operate-btn left" @click="cancel">{{cancelBtnText}}</div>
            <div class="operate-btn" @click="confirm">{{ConfirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showFlag: false,
      title: "确认清空所有历史纪录吗?",
      ConfirmBtnText: "确定",
      cancelBtnText: "取消"
    };
  },
  methods: {
    cancel() {
      this.reject("cancel");
      this.hide();
    },
    hide() {
      this.showFlag = false;
      document.body.removeChild(this.$el);
      this.$destroy();
    },
    show(cb) {
      this.showFlag = true;
      typeof cb === "function" && cb.call(this, this);
      return new Promise((resolve, reject) => {
        this.reject = reject;
        this.resolve = resolve;
      });
    },
    confirm() {
      this.resolve("confirm");
      this.hide();
    }
  }
};
</script>

<style scoped lang="stylus">
.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 998;
  background-color: rgba(0, 0, 0, 0.3);

  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.3s;

    .confirm-content {
      animation: confirm-zoom 0.3s;
    }
  }

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;

    .confirm-content {
      width: 270px;
      border-radius: 13px;
      background: #333;

      .text {
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        font-size: 18px;
        color: rgba(255, 255, 255, 0.5);
      }

      .operate {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: 18px;

        .operate-btn {
          flex: 1;
          line-height: 22px;
          padding: 10px 0;
          border-top: 1px solid rgba(0, 0, 0, 0.3);
          color: rgba(255, 255, 255, 0.3);

          &.left {
            border-right: 1px solid rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }
}

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes confirm-zoom {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>