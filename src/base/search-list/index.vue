<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li :key="item" class="search-item" v-for="item in searches" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    selectItem(query) {
      this.$emit("selectOneHistory", query);
    },
    deleteOne(query) {
      this.$emit("deleteOneQuery", query);
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~@/common/stylus/variable';
@import '~@/common/stylus/mixin';

.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;

    &.list-enter-active, &.list-leave-active {
      transition: all 0.1s;
    }

    &.list-enter, &.list-leave-to {
      height: 0;
    }

    .text {
      flex: 1;
      color: $color-text-l;
    }

    .icon {
      extend-click();

      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>
