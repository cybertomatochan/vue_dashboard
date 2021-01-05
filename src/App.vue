<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld'
import login from "./components/pages/login";
export default {
  name: "App",
  components: {
    login,
  },
};
</script>

<style lang="scss">
@import "./assets/all";
</style>
