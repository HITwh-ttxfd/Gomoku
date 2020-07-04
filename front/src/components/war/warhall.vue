<template>
  <div class="wrapper">
    <div class="header">
      <div class="left">
        <img src="@/assets/img/gomoku.png" alt=""/>
        <div class="title">Gomoku</div>
      </div>
      <div class="right">
        <el-button @click="$router.push({path: '/waithall'})" plain>返回大厅</el-button>
      </div>
    </div>
    <div class="body">
      <div class="game">
        <canvas id="canvas" height="600" width="600"></canvas>
      </div>
      <div class="chatting">
        <div class="receive"></div>
        <div class="send"></div>
      </div>
    </div>
  </div>
</template>


<script>
  export default {
    name: "warhall",
    data() {
      return {
        square: [],
        board: {}
      }
    },
    methods: {
      loadCanvas() {
        let canvas = document.getElementById('canvas');
        this.board = canvas.getContext('2d');
        let board = this.board;
        board.strokeRect(20, 20, 560, 560);
        for (let i = 0; i < 15; ++i) {
          board.moveTo(20 + i * 40, 20);
          board.lineTo(20 + i * 40, 580);
          board.stroke();
        }
        for (let j = 0; j < 15; ++j) {
          board.moveTo(20, 20 + j * 40);
          board.lineTo(580, 20 + j * 40);
          board.stroke();
        }
        board.beginPath();
        board.arc(300, 300, 5, 0, 2*Math.PI);
        board.fill();
        board.beginPath();
        board.arc(460, 460, 5, 0, 2*Math.PI);
        board.fill();
        board.beginPath();
        board.arc(460, 140, 5, 0, 2*Math.PI);
        board.fill();
        board.beginPath();
        board.arc(140, 140, 5, 0, 2*Math.PI);
        board.fill();
        board.beginPath();
        board.arc(140, 460, 5, 0, 2*Math.PI);
        board.fill();
      }
    },
    mounted() {
      this.loadCanvas();
    }
  }
</script>

<style lang="scss" scoped>
  $border: rgba(213, 213, 213, 1.000) 1px solid;
  $boardLine: rgb(50, 49, 49) 2px solid;
  .wrapper {
    height: 100%;

    .header {
      position: relative;
      background: rgba(247, 247, 247, 1.000);
      height: 70px;
      border-bottom: $border;
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

    .body {
      position: relative;
      display: flex;
      height: 91.4%;

      .game {
        flex: 4;
        height: 100%;
        background: {
          /*image: url("../../assets/img/1.jpg");*/
          size: cover;
        };
        /*display: flex;*/

        #canvas {
          margin: 75px 200px;
          background: url("../../assets/img/timg.jpg") no-repeat center;
          background-size: cover;
          border-radius: 5px;
          box-shadow: 2px 2px 3px 5px rgba(227, 173, 120, 1.000);
        }
      }

      .chatting {
        flex: 1.5;
        flex-direction: column;
        display: flex;
        border: {
          left: $border;
        };

        .receive {
          flex: 5;
        }

        .send {
          flex: 1;
          border-top: $border;
        }
      }
    }
  }
</style>
