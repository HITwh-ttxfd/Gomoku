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
        <div class="statusBoard">
          <el-card shadow="always" id="card1">
            <div
              :class="{'statusColor':true,'queuing':status===-1,'disconnected':status===0,'myTurn':status===1,'rivalsTurn':status===2,'victory':status===3&&this.role === 'p1'||status===4&&this.role === 'p2','defeat':status===4&&this.role === 'p1'||status===3&&this.role === 'p2','draw':status===5}"></div>
            <div class="statusContext">{{computedStatus}}</div>
          </el-card>
        </div>
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
  let socket;
  export default {
    name: "warhall",
    data() {
      return {
        board: {},
        positions: [],
        status: 0,
        role: ''
      }
    },
    methods: {
      connect() {
        try {
          socket = new WebSocket('ws://localhost:8000');
          socket.onmessage = data => {
            console.log(data.data)
            let message = JSON.parse(data.data);
            if (message.status) this.status = message.status;
            if (message.role) this.role = message.role;
            if (message.data) {
              console.log('next');
              this.nextMove(message.data.next.x, message.data.next.y, message.data.player);
            }
          }
        } catch (e) {
          this.$message.error('连接服务器失败');
        }
      },
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
          if (this.status !== 1)
            return;
          let position = this.getEventPosition(event);
          if (position.y < 5 || position.x < 5 || position.x > 595 | position.y > 595) return;
          let formattedX = 20 + Math.floor((position.x - 20) / 40) * 40;
          let formattedY = 20 + Math.floor((position.y - 20) / 40) * 40;
          if ((position.x - formattedX > 15 && position.x - formattedX < 25) || (position.y - formattedY > 15 && position.y - formattedY < 25)) return;
          position.x = ((position.x - formattedX < 15 ? formattedX : formattedX + 40) - 20) / 40;
          position.y = ((position.y - formattedY < 15 ? formattedY : formattedY + 40) - 20) / 40;
          socket.send(JSON.stringify({
            type: 'nextMove',
            player: this.role,
            next: {
              x: position.x,
              y: position.y
            }
          }));
        })
      },
      nextMove(x, y, role) {
        let board = this.board;
        board.beginPath();
        board.arc(20 + x * 40, 20 + y * 40, 15, 0, 2 * Math.PI, true);
        board.closePath();
        let gradient = board.createRadialGradient(20 + x * 40 + 2, 20 + y * 40 - 2, 15, 15 + 20 + x * 40 + 2, 20 + y * 40 - 2, 0);
        if (role === 'p2') {
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
      },
      heartbeat() {
        socket.send('');
      }
    },
    computed: {
      computedStatus() {
        switch (this.status) {
          case -1:
            return '正在匹配'
          case 0:
            return '对方未连接';
          case 1:
            return '你的回合';
          case 2:
            return '对方的回合';
          case 3:
            return this.role === 'p1' ? '您胜利了' : '您被击败了';
          case 4:
            return this.role === 'p2' ? '您胜利了' : '您被击败了';
          case 5:
            return '势均力敌';
        }
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
      this.connect();
      setInterval(() => {
        this.heartbeat()
      }, 100000);
    },
    beforeDestroy() {
      socket.close();
    }
  }
</script>

<style>
  #card1 .el-card__body {
    padding: 0;
    height: 100%;
  }
</style>

<style lang="scss" scoped>
  $border: rgb(180, 168, 168) 1px solid;
  $boardLine: rgb(50, 49, 49) 2px solid;
  .wrapper {
    height: 100%;
    overflow: hidden;

    .header {
      position: relative;
      background: linear-gradient(#f0f0f0, rgba(198, 177, 151, 1.000));
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

        .el-button {
          background: rgba(208, 205, 205, 0.3);
          border: none;
          box-shadow: 2px 2px 2px 2px #c6b298;

          &:hover {
            background: #409EFF;
            color: #ffffff;
          }
        }
      }
    }

    .body {
      position: relative;
      display: flex;
      height: 100%;

      .game {
        flex: 4;
        height: 100%;
        background: {
          image: linear-gradient(0deg, #cbc1b4, rgba(198, 177, 151, 1.000));
          size: cover;
        };
        /*display: flex;*/

        .statusBoard {
          left: 27%;
          position: absolute;

          .el-card {
            margin-top: 10px;
            width: 200px;
            height: 50px;
            background: rgba(201, 184, 164, 1.000);
            border: none;
            position: relative;

            .statusColor {
              margin: {
                top: 15px;
                left: 20px;
              };
              width: 20px;
              height: 20px;
              display: inline-block;
              background: white;
              border-radius: 10px;
            }

            .queuing {
              background: #ce4f0b;
            }

            .disconnected {
              background: #de8b10;
            }

            .myTurn {
              background: #007aff;
            }

            .rivalsTurn {
              background: #0447ea;
            }

            .victory {
              background: #67C23A;
            }

            .defeat {
              background: #F56C6C;
            }

            .draw {
              background: #3defd3;
            }

            .statusContext {
              display: inline;
              position: absolute;
              top: 15px;
              padding: 0 20px;
              height: 100%;
            }
          }
        }

        #canvas {
          margin: 80px 200px;
          position: absolute;
          background: url("../../assets/img/timg.jpg") no-repeat center;
          background-size: cover;
          border-radius: 5px;
          box-shadow: 10px 2px 10px 10px rgb(222, 179, 137), -10px -2px 10px 10px rgb(222, 179, 137);
        }
      }

      .chatting {
        flex: 1.5;
        background: {
          image: linear-gradient(0deg, #cbc1b4, rgba(198, 177, 151, 1.000));
        };
        height: 100%;
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
