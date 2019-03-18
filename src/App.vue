<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <syncMainApp/>
  </div>
</template>

<script>
import syncMainApp from "./components/syncMainApp.vue";

export default {
  name: "app",
  components: {
    syncMainApp
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
