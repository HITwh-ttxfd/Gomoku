<template>
  <div id="app">
    <!--    <img src="./assets/logo.png">-->
    <!--      <div>-->
    <!--    <router-link to="/hello">跳转</router-link>-->
    <!--  </div>-->
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    /*text-align: center;*/
    /*color: #2c3e50;*/
    /*margin-top: 60px;*/
  }
  html, body {
    padding: 0;
    margin: 0;
  }
</style>
