<template>
  <div>
    <button @click="onClick">btn</button>
    <!-- <MHeader />
    <Tab />
    <keep-alive>
      <router-view />
    </keep-alive>
    <Player />-->
  </div>
</template>

<script>
import MHeader from "@/components/m-header";
import Tab from "@/components/tab";
import Player from "@/components/player";

export default {
  methods: {
    onClick() {
      this.$Confirm({
        title: "vue大法好!"
      })
        .then(confirm => {
          console.log(confirm);
        })
        .catch(cancel => {
          console.log(cancel);
        });
    }
  },
  components: {
    MHeader,
    Tab,
    Player
  }
};
</script>

<style lang="stylus"></style>
