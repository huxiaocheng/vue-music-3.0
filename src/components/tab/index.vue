<template>
  <div class="tab">
    <router-link v-for="item in tabs" :key="item.text" tag="div" class="tab-item" :to="item.path">
      <span class="tab-link">{{item.text}}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  created() {
    this.tabs = [
      {
        text: "推荐",
        path: "/recommend"
      },
      {
        text: "歌手",
        path: "/singer"
      },
      {
        text: "排行",
        path: "/rank"
      },
      {
        text: "搜索",
        path: "/search"
      }
    ];
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable';

.tab {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-link {
      padding-bottom: 5px;
      color: $color-text-l;
    }

    &.router-link-active {
      .tab-link {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>
