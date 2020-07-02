<template>
  <div class="wrapper">
    <div class="header">
      <div class="left">
        <img src="@/assets/img/gomoku.png" alt=""/>
        <div class="title">Gomoku</div>
      </div>
      <div class="right">
        <el-button @click="dialogVisible = true" plain>返回大厅</el-button>
      </div>
    </div>
    <div class="body">

    </div>
  </div>
</template>


<script>
  export default {
    name: "warhall",
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    height: 100%;

    .header {
      position: relative;
      background: rgba(247, 247, 247, 1.000);
      height: 70px;
      border-bottom: rgba(213, 213, 213, 1.000) 1px solid;
      box-shadow: 0 3px 3px -3px #5E5E5E;

      .left {
        position: absolute;
        left: 10px;
        height: 100%;

        img {
          margin-top: 10px;
        }

        .title {
          margin-top: -23px;
          color: rgba(117, 104, 103, 1.000);
          font: {
            family: "Roboto", "Lucida Grande", "DejaVu Sans", "Bitstream Vera Sans", Verdana, Arial, sans-serif;
            size: 25px;
          }
          vertical-align: text-top;
          display: inline-block;
        }
      }

      .right {
        position: absolute;
        right: 10px;
        top: 15px;
      }
    }
  }
</style>
