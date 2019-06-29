<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" ref='input' @input="handleInput" :value="query" :placeholder="placeholder">
    <i @click="clearInput" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: this.value
    };
  },
  methods: {
    blur() {
      this.$refs['input'].blur();
    },
    clearInput() {
      this.query = "";
      this.$emit("input", "");
    },
    handleInput(e) {
      const value = e.target.value;
      this.query = value;
      this.$emit("input", value);
    }
  },
  watch: {
    value(val) {
      this.query = val;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable';

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 6px;

  .icon-search {
    font-size: 24px;
    color: $color-background;
  }

  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 30px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;

    &::placeholder {
      color: $color-text-d;
    }
  }

  .icon-dismiss {
    font-size: 16px;
    color: $color-background;
  }
}
</style>