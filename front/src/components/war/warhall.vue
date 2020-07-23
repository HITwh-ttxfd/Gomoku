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
        <div class="board">
          <canvas id="canvas" height="600" width="600"></canvas>
        </div>
      </div>
      <div :class="{'chatting':true,'active':active}">
        <div class="receive" id="messageList">
          <div :class="{'messageWrapper':true,'me':message.player===role,'rival': message.player!==role}"
               v-for="(message,index) in messages"
               :key="index">
            <div :class="{'message':true}">{{message.content}}</div>
          </div>
        </div>
        <div class="send">
          <div class="context" @keydown.enter="sendMessage" @keydown.shift.enter="enter"
               placeholder="按Enter发送，Shift+Enter换行" contenteditable="true" @focus="active=true"
               @blur="active=false"></div>
        </div>
      </div>
      <div class="empty"></div>
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
        role: '',
        text: '',
        active: false,
        messages: [],
      }
    },
    methods: {
      connect() {
        try {
          socket = new WebSocket('ws://localhost:8000');
          // socket = new WebSocket('ws://60.205.252.251:8000');
          socket.onmessage = data => {
            console.log(data.data)
            let message = JSON.parse(data.data);
            if (message.status) this.status = message.status;
            if (message.role) this.role = message.role;
            if (message.data) {
              if (message.data.type === 'message')
                this.messages.push(message.data);
              else
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
      },
      sendMessage($event) {
        setTimeout(() => {
          if (this.entered)
            this.entered = false;
          else {
            $event.target.innerText = $event.target.innerText.slice(0, -2);
            if (this.status < 1) {
              $event.preventDefault();
              this.$message.error('当前对局未开始')
              return;
            }
            if (this.status > 2){
              $event.preventDefault();
              this.$message.error('当前对局已结束')
              return;
            }
            socket.send(JSON.stringify({
              type: 'message',
              player: this.role,
              content: $event.target.innerText
            }))
            $event.target.innerText = '';
            $event.preventDefault();
          }
        }, 60)
      },
      enter() {
        this.innerText += '\n';
        this.entered = true;
      },
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
  $shadow1: -8px -8px 16px -10px rgba(255, 255, 255, 1), 8px 8px 16px -10px rgba(0, 0, 0, .15);
  $shadow2: -2px -2px 8px rgba(255, 255, 255, 1),
  -2px -2px 12px rgba(255, 255, 255, 0.5),
  inset 2px 2px 4px rgba(255, 255, 255, 0.1),
  2px 2px 8px rgba(0, 0, 0, 0.15);
  $shadow3: inset -2px -2px 8px rgba(255, 255, 255, 1),
  inset -2px -2px 12px rgba(255, 255, 255, 0.5),
  inset 2px 2px 4px rgba(255, 255, 255, 0.1),
  inset 2px 2px 8px rgba(0, 0, 0, 0.15);
  $border: rgb(180, 168, 168) 1px solid;
  $boardLine: rgb(50, 49, 49) 2px solid;
  $background: linear-gradient(135deg, rgba(230, 230, 230, 1) 0, rgba(246, 246, 246, 1) 100%);
  .wrapper {
    min-width: 1440px;
    min-height: 768px;
    height: 100%;
    overflow: hidden;
    background: #eee;

    .header {
      position: relative;
      /*background: linear-gradient(#f0f0f0, rgba(198, 177, 151, 1.000));*/
      height: 70px;
      border-radius: 15px;
      box-shadow: $shadow2;

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
          background: #eee;
          border: none;
          box-shadow: $shadow2;

          &:hover {
            background: #eee;
            box-shadow: inset -2px -2px 8px rgba(255, 255, 255, 1),
            inset -2px -2px 12px rgba(255, 255, 255, 0.5),
            inset 2px 2px 4px rgba(255, 255, 255, 0.1),
            inset 2px 2px 8px rgba(0, 0, 0, 0.15);;
          }
        }
      }
    }

    .body {
      position: relative;
      display: flex;
      height: 100%;

      .game {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        flex: 4;
        height: 100%;
        /*background: {*/
        /*  image: linear-gradient(0deg, #cbc1b4, rgba(198, 177, 151, 1.000));*/
        /*  size: cover;*/
        /*};*/
        /*display: flex;*/

        .statusBoard {
          flex: 1;

          .el-card {
            margin-top: 20px;
            border-radius: 10px;
            width: 200px;
            height: 50px;
            background: #eee;
            border: none;
            position: relative;
            box-shadow: $shadow2;

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
              background: #fc1414;
            }

            .draw {
              background: #f67070;
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

        .board {
          flex: 5;
          display: flex;
          margin-top: 5px;
          width: 600px;
          height: 600px;
          padding: 7px;
          border-radius: 20px;
          background: #eee;
          position: absolute;
          box-shadow: $shadow2;

          #canvas {
            position: absolute;
            background: url("../../assets/img/timg.jpg") no-repeat center;
            /*background: #eee;*/
            background-size: cover;
            border-radius: 20px;
          }
        }
      }

      .chatting {
        flex: 2;
        margin-top: -40px;
        align-self: center;
        justify-self: center;
        height: 80%;
        flex-direction: column;
        display: flex;
        border-radius: 20px;
        box-shadow: $shadow1;

        .receive {
          flex: 5;
          position: relative;
          padding: 20px;

          .messageWrapper {
            margin: 5px;
            display: block;
            clear: both;

            .message {
              /*position: absolute;*/
              border-radius: 10px;
              min-width: 1px;
              max-width: 200px;
              overflow: auto;
              white-space: pre-line;
              width: fit-content;
              padding: 10px;
              box-shadow: $shadow2;
            }
          }

          .rival {
            float: left;

            .message {
              background: #f3f3f3;
            }

          }

          .me {
            float: right;

            .message {
              background: #03c343;
              color: #ffffff;
            }
          }
        }

        .send {
          flex: 1;
          border-top: $border;

          .context {
            margin: 10px;
            height: 100%;
            overflow: scroll;
            outline: none;
            color: #4f4f4f;
            /*opacity: 0;*/

            &:empty:before {
              content: attr(placeholder);
              font-size: 13px;
              color: #999999;
            }

            &:focus:before {
              content: none;
            }
          }
        }
      }

      .active {
        box-shadow: $shadow3;
      }

      .empty {
        flex: .5;
      }
    }
  }
</style>
