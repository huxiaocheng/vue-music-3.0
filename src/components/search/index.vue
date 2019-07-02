<template>
  <div class="search">
    <div class="search-box-wrapper">
      <SearchBox v-model="query" ref="searchBox" />
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcut-wrapper">
      <Scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                v-for="item in hotKey"
                :key="item.n"
                class="item"
                @click="addQuery(item.k)"
              >{{item.k}}</li>
            </ul>
          </div>
          <div class="search-history" v-show="history.length > 0">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click.stop="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <SearchList
              :searches="history"
              @deleteOneQuery="delSearch"
              @selectOneHistory="addQuery"
            />
          </div>
        </div>
      </Scroll>
    </div>
    <div class="search-result" v-show="query" ref="search-result">
      <Suggest ref="suggest" :query="query" @scrollStart="scrollStart" @select="saveSearchItem" />
    </div>
    <Confirm ref="confirm" @confirm="clearSearch" />
    <router-view />
  </div>
</template>

<script>
import SearchBox from "@/base/search-box";
import Suggest from "@/components/suggest";
import { getHotKey } from "@/api/search";
import { ERR_OK } from "@/api/config";
import { mapActions, mapGetters } from "vuex";
import SearchList from "@/base/search-list";
import Confirm from "@/base/confirm";
import Scroll from "@/base/scroll";
import { playlistMixin, searchMixin } from "@/common/js/mixin";

export default {
  mixins: [playlistMixin, searchMixin],
  data() {
    return {
      hotKey: []
    };
  },
  created() {
    this._getHotKey();
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.history);
    }
  },
  methods: {
    handlePlayList(list) {
      const bottom = list.length > 0 ? "60px" : "";
      this.$refs["shortcut-wrapper"].style["bottom"] = bottom;
      this.$refs["search-result"].style["bottom"] = bottom;
      this.$refs["shortcut"].refresh();
      this.$refs["suggest"].refresh();
    },
    showConfirm() {
      this.$refs["confirm"].show();
    },
    addQuery(query) {
      this.query = query;
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    ...mapActions(["saveSearch", "delSearch", "clearSearch"])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        this.$nextTick(() => {
          this.$refs["shortcut"].refresh();
        });
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable';
@import '~@/common/stylus/mixin';

.search {
  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
