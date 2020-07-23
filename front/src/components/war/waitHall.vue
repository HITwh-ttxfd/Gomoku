<template>
  <div>
    <!--面包屑导航区域-->
    <el-row>
      <el-col :span="3">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>对战大厅</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <!--<el-col :span="6">
        <div class="buttonBox">
          <el-button type="primary" style="padding: 7px" @click="makeWar" plain :disabled="buttonEnable">发起战局
          </el-button>
          <el-button type="danger" style="padding: 7px" @click="cancelWar" plain :disabled="!(buttonEnable)">取消我的对局
          </el-button>
        </div>
      </el-col>-->
    </el-row>
    <el-card>
      <div style="width: 100%; height: 450px">
        <div style="display: flex; justify-content: center">
          <el-image src="http://39.98.48.34:2233/userImg/back4.jpg" style="width: 650px;"></el-image>
        </div>
        <div style="display: flex; justify-content: center; padding-top: 40px">
          <el-button size="large" @click="enter()">开始游戏</el-button>
        </div>
        <div style="display: flex; justify-content: center; padding-top: 40px">
          <span>系统将会为您随机匹配玩家！</span>
        </div>
<!--        <el-image src="http://39.98.48.34:2233/userImg/back5.jpg" style="position: absolute; top: 1%;"></el-image>-->
      </div>
    </el-card>

    <!--    <el-row>
          <el-col :span="8" v-for="(o, index) in warInfo.length" :key="o">
            <el-card :body-style="{ padding: '4px' }" shadow="hover">
              &lt;!&ndash;头像&id&等级&ndash;&gt;
              <el-row>
                <el-col :span="6">
                  <img :src="warInfo[index].fields.path"
                       class="image">
                </el-col>
                <el-col :span="3">
                  <span style="position: absolute; top: 40px; font-size: 22px; font-weight: bold">
                    发起人：{{warInfo[index].pk}}</span>
                </el-col>
                <el-col :span="3">
                  <span style="position: absolute; top: 60px; left: 220px; font-size: 15px; font-weight: bold"></span>
                </el-col>
              </el-row>
              <div style="padding: 10px;">
                <div class="bottom clearfix">
                  <time class="time">等级:{{warInfo[index].fields.level}}</time>
                  <el-button type="success" class="button" @click="enterWar(index)" :disabled="enterButEna(index)" plain>
                    {{enterButTxt(index)}}
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>-->
  </div>

</template>

<script>
  export default {
    name: "waitHall",
    mounted() {
      this.user = window.sessionStorage.getItem('id')
      // this.getWarList()
      // this.receiveInfo()
    },
    data() {
      return {
        user: '',
        buttonEnable: false,
        warInfo: [],
      }
    },
    methods: {
      makeWar() {
        this.$http.get('makewar?id=' + this.user).then(res => {
          this.$message.success('发起战局成功')
          this.buttonEnable = true
          this.getWarList()
          this.$goEasy.publish({
            channel: "chess", //替换为您自己的channel
            message: '4,' + 'makeWar' //替换为您想要发送的消息内容
          });
        })
      },
      cancelWar() {
        this.$http.get('cancelwar?id=' + this.user).then(res => {
          this.$message.success('取消战局成功')
          this.buttonEnable = false
          this.getWarList()
          this.$goEasy.publish({
            channel: "chess", //替换为您自己的channel
            message: '4,' + 'cancelWar' //替换为您想要发送的消息内容
          });
          // console.log(res)
        })
      },
      getWarList() {
        this.$http.get('getwar').then(res => {
          // console.log(res)
          this.warInfo = res.data.warlist
          for (var i in this.warInfo) {
            if (this.warInfo[i].pk === this.user) {
              this.buttonEnable = true
            }
          }
          // console.log(this.enterButEna)
          // console.log(this.warInfo)
        })
      },
      enterWar(index) {
        var aimID = this.warInfo[index].pk
        let self = this
        if (aimID === this.user) {//红方进入
          this.$http.get('enterwar?id=' + this.user + '&owner=' + aimID).then(res => {
            // console.log(res)
            this.$router.push('/warhall')
          })
          this.$goEasy.publish({
            channel: "chess", //替换为您自己的channel
            message: '2,' + '红方就绪' + ',' + self.user //替换为您想要发送的消息内容
          });
        } else {//黑方进入
          window.sessionStorage.setItem('aimID', aimID)
          this.$http.get('enterwar?id=' + this.user + '&owner=' + aimID).then(res => {
            // console.log(res)
            this.$router.push('/warhall')
          })
          // 黑方进入时红方并没有黑方的id，验证只能靠红方id
          this.$goEasy.publish({
            channel: "chess", //替换为您自己的channel
            message: '2,' + '黑方就绪' + ',' + aimID //替换为您想要发送的消息内容
          });
        }
      },
      enter(){
        this.$router.push('/warhall')
      },
      enterButEna(index) {
        // 按钮可用性渲染
        // console.log(this.warInfo[index].fields.flag)
        if (this.warInfo[index].fields.flag === '进行中') {
          // console.log('ttt')
          return true
        } else {
          return false
        }
      },
      enterButTxt(index) {
        //按钮文字渲染
        if (this.warInfo[index].fields.flag === '进行中') {
          // console.log('ttt')
          return '进行中'
        } else {
          return '进入战局'
        }
      },
      receiveInfo() {
        // console.log('receive!')
        let self = this
        this.$goEasy.subscribe({
          channel: "chess",//替换为您自己的channel
          onMessage: function (message) {
            // moveInfo是消息列表，最开始运用于走步，因此叫moveInfo
            var moveInfo = message.content.toString().split(',')
            var type = moveInfo[0]
            // console.log(moveInfo)
            if (type === '3') {//接收到的是离场的消息
              self.getWarList()
            } else if (type === '4') {//对局更改的消息
              self.getWarList()
            }
          }
        });
      },
    }
  }
</script>

<style scoped>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 5px;
    float: right;
  }

  .image {
    padding-left: 8px;
    padding-top: 8px;
    height: 80px;
    width: 80px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    /*display: block;*/
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .buttonBox {
    position: absolute;
    top: -9px;

  }
</style>
