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
        board: {},
        positions: [],
        white: false
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
        board.arc(300, 300, 5, 0, 2 * Math.PI, true);
        board.fill();
        board.beginPath();
        board.arc(460, 460, 5, 0, 2 * Math.PI, true);
        board.fill();
        board.beginPath();
        board.arc(460, 140, 5, 0, 2 * Math.PI, true);
        board.fill();
        board.beginPath();
        board.arc(140, 140, 5, 0, 2 * Math.PI, true);
        board.fill();
        board.beginPath();
        board.arc(140, 460, 5, 0, 2 * Math.PI, true);
        board.fill();
        canvas.addEventListener('click', (event) => {
          let position = this.getEventPosition(event);
          if (position.y < 5 || position.x < 5 || position.x > 595 | position.y > 595) return;
          let formattedX = 20 + Math.floor((position.x - 20) / 40) * 40;
          let formattedY = 20 + Math.floor((position.y - 20) / 40) * 40;
          if ((position.x - formattedX > 15 && position.x - formattedX < 25) || (position.y - formattedY > 15 && position.y - formattedY < 25)) return;
          position.x = position.x - formattedX < 15 ? formattedX : formattedX + 40;
          position.y = position.y - formattedY < 15 ? formattedY : formattedY + 40;
          this.nextMove(position.x, position.y);
        })
      },
      nextMove(x, y) {
        let board = this.board;
        board.beginPath();
        board.arc(x, y, 15, 0, 2 * Math.PI, true);
        board.closePath();
        let gradient = board.createRadialGradient(x + 2, y - 2, 15, 15 + x + 2, y - 2, 0);
        if (!this.white) {
          gradient.addColorStop(0, '#0a0a0a');
          gradient.addColorStop(1, '#636766');
        } else {
          gradient.addColorStop(0, '#d1d1d1');
          gradient.addColorStop(1, '#f9f9f9');
        }
        board.fillStyle = gradient;
        board.fill();
      },
      getEventPosition(ev) {
        let x, y;
        if (ev.layerX || ev.layerX === 0) {
          x = ev.layerX;
          y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX === 0) { // Opera
          x = ev.offsetX;
          y = ev.offsetY;
        }
        return {x: x, y: y};
      }
    },
    created() {
      this.positions = new Array(15);
      for (let i = 0; i < 15; ++i) {
        this.positions[i] = new Array(15).fill(0);
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
          position: absolute;
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
