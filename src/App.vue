<template>
  <div>
    <MHeader />
    <Tab />
    <keep-alive>
      <router-view />
    </keep-alive>
    <Player />
  </div>
</template>

<script>
import MHeader from "@/components/m-header";
import Tab from "@/components/tab";
import Player from "@/components/player";

export default {
  components: {
    MHeader,
    Tab,
    Player
  }
};
</script>

<style lang="stylus"></style>
