<template>
  <div>
    <el-container class="home-container">
      <!--导航栏-->
      <el-header>
        <div class="title-header">
          <img src="@/assets/img/gomoku.png" alt=""/>
          <span class="span-header">Gomoku</span>
        </div>
        <div class="shadow">
          <el-button style="position: absolute; right: 3%; top: 17%"
                     type="info" @click="dialogVisible = true" plain>返回大厅</el-button>
        </div>
      </el-header>
      <!--玩家区域-->
      <div class="playerBox">
        <!--黑方区域-->
        <el-card style="margin-bottom: 118px">
          <el-row>
            <el-col :span="6">
              <img
                :src="(this.warInfo.flag === '就绪' || this.warInfo.flag === '黑方就绪')
                ? this.warInfo.avatarBlack : 'http://39.98.48.34:2233/userImg/soldier.png'"
                class="image">
            </el-col>
            <el-col :span="3">
              <span style="position: absolute; top: 40px; font-size: 22px; margin-left: 30px">
                黑方：{{(this.warInfo.flag === '就绪' || this.warInfo.flag === '黑方就绪')
                ? this.warInfo.black : '等待玩家进入'}}</span>
            </el-col>
            <el-col :span="3">
              <span style="position: absolute; top: 60px; left: 220px; font-size: 15px; font-weight: bold"></span>
            </el-col>
          </el-row>
          <div style="padding: 10px;">
            <div class="bottom clearfix">
              <time class="time">等级：{{(this.warInfo.flag === '就绪' || this.warInfo.flag === '黑方就绪')
                ? this.warInfo.blackLevel : ''}}
              </time>
              <!-- <el-button type="success" class="button" style="margin-left: 40px;" plain>

               </el-button>-->
            </div>
          </div>
        </el-card>
        <!--红方区域-->
        <el-card>
          <el-row>
            <el-col :span="6">
              <img
                :src="(this.warInfo.flag === '就绪' || this.warInfo.flag === '红方就绪')
                ? this.warInfo.avatarRed : 'http://39.98.48.34:2233/userImg/soldier.png'"
                class="image">
            </el-col>
            <el-col :span="3">
              <span style="position: absolute; top: 40px; font-size: 22px; margin-left: 30px">
                红方：{{(this.warInfo.flag === '就绪' || this.warInfo.flag === '红方就绪')
                ? this.warInfo.red : '等待玩家进入'}}</span>
            </el-col>
            <el-col :span="3">
              <span style="position: absolute; top: 60px; left: 220px; font-size: 15px; font-weight: bold"></span>
            </el-col>
          </el-row>
          <div style="padding: 10px;">
            <div class="bottom clearfix">
              <time class="time">等级：{{(this.warInfo.flag === '就绪' || this.warInfo.flag === '红方就绪')
                ? this.warInfo.redLevel : ''}}
              </time>
              <!-- <el-button type="success" class="button" style="margin-left: 40px;" plain>

               </el-button>-->
            </div>
          </div>
        </el-card>
      </div>
      <!--棋盘底色-->
      <div class="black-box"></div>
      <div class="pubBox">
        <span style="font-size: 26.5px">提示：</span>
      </div>
      <!--游戏主体-->
      <div id="content"/>
      <!--聊天区-->
      <div class="talkBox">
        <!-- 显示区域 -->
        <div class="talk_show" id="words">
          <!-- 根据vue对象中的数组，遍历出对应的标签。 -->
          <!--(this.warInfo.flag === '就绪' || this.warInfo.flag === '红方就绪')
                ? this.warInfo.avatarRed : 'http://39.98.48.34:2233/userImg/soldier.png'-->
          <div v-for="i in arr" :class="i.person==='A'?'atalk':'btalk'">
            <img :src="(warInfo.flag === '就绪' || warInfo.flag === '红方就绪')
                ? warInfo.avatarRed : 'http://39.98.48.34:2233/userImg/soldier.png'"
                 style="width: 40px; height: 40px; border-radius: 50%; display: inline-grid"
                 v-show="i.flag">
            <span>{{ i.words }}</span>
            <img :src="(warInfo.flag === '就绪' || warInfo.flag === '黑方就绪')
                ? warInfo.avatarBlack : 'http://39.98.48.34:2233/userImg/soldier.png'"
                 style="width: 40px; height: 40px; border-radius: 50%;"
                 v-show="!(i.flag)">
          </div>
        </div>
        <!-- 发送内容区域 -->
        <div class="talk_input">
          <!-- 请输入内容 -->
          <el-input
            placeholder="请输入内容"
            v-model="str2"
            style="width: 300px; margin-left: 3px"
            clearable>
          </el-input>
          <!--          <input type="text" class="talk_word" id="talkwords" v-model='str2'>-->
          <!-- 按钮 -->
          <el-button type="primary" id="talksub" plain @click="add_data">发送</el-button>
          <!--          <input type="button" value="发送" class="talk_sub" id="talksub" @click="add_data()">-->
        </div>
      </div>
      <!--重新开始按钮 建议删去-->
      <!--<el-button type="danger" class="restartButton" @click="newGameStart" plain>重新开始游戏</el-button>-->

    </el-container>
    <!--中途退出提醒-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确认中途退出游戏？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="goBack">确 定</el-button>
  </span>
    </el-dialog>
    <!--游戏结束提醒-->
    <el-dialog
      class="dialog1"
      title="提示"
      :visible.sync="exitVisible"
      width="30%">
      <span>游戏结束 退出游戏？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="exitVisible = false">取 消</el-button>
    <el-button type="primary" @click="goBack">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  export default {
    name: "warhall",
    mounted() {
      this.initial()
      this.updateWar()
      this.receiveMove()
      // console.log(this.qzArray)
    },
    data() {
      return {
        username: '',
        qzName: ["車", "馬", "相", "仕", "将", "仕", "相", "馬", "車", "炮", "炮", "兵", "兵", "兵", "兵", "兵"],
        qzRedArray: new Array(),
        qzBlackArray: new Array(),
        qzArray: new Array(),
        gameType: 0,
        body_w: null,
        b: null,
        np: null,
        nbut: null,
        c: null,
        mouseClickCount: 0,
        qzRunTime: 0,
        cxt: null,
        dialogVisible: false,
        exitVisible: false,
        teamType: 'red',
        warInfo: [],
        arr: [
          {person: 'A', words: '你好~', flag: true},
          {person: 'B', words: 'hi~', flag: false},
        ],
        str2: '',
        ready: false
      }
    },
    methods: {
      initial() {
        // 变量初始化，参数初始化，棋子事件绑定
        this.c = document.createElement('canvas')
        this.b = document.getElementById('content')
        this.np = document.createElement('div')
        this.nbut = document.createElement('div')
        this.body_w = 432
        console.log(document.body.clientWidth + "|" + this.body_w);
        let self = this
        this.b.style.textAlign = 'center';
        this.cxt = this.c.getContext('2d')
        // 样式设置
        this.np.style.width = '50%';
        this.np.style.position = 'absolute'
        this.np.style.left = '62%'
        this.np.style.top = '14%'
        this.np.innerHTML = 'Good luck';
        this.np.id = 'mark';
        this.np.style.fontFamily = '微软雅黑';
        this.np.style.fontSize = this.body_w / 16 + 'px';
        this.b.appendChild(this.nbut);
        this.b.appendChild(this.np);

        var w = this.body_w / 9 * 8, h = w / 8 * 9;
        var wh = w / 2;
        var hh = h / 2;
        var cell = w / 8;
        var cellh = cell / 2;
        this.c.width = w + cell;
        this.c.height = h + cell;
        this.c.id = "can";
        this.c.style.position = 'absolute'
        this.c.style.top = '17%'
        this.c.style.left = '33%'
        this.b.appendChild(this.c);
        // 创建context对象
        this.cxt.strokeStyle = "#ff0000";
        this.cxt.font = cell * 0.65 + "px 微软雅黑";  // 棋子字体大小
        //坐标原点为中心，右下为正，左上为负
        this.cxt.translate(wh + cellh, hh + cellh);
////////////////////////////////////////////////////

        // 画布鼠标点击事件
        this.c.onclick = function (event) {
          self.mouseClickCount += 1;
          console.log("鼠标点击了 " + self.mouseClickCount + " 次_____________________________________________________");
          var e = event || window.event;

          var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
          var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
          var x = e.pageX || e.clientX + scrollX;
          var y = e.pageY || e.clientY + scrollY;
          // console.log(this.c)
          x = x - self.c.offsetLeft - cellh - wh;
          y = y - self.c.offsetTop - cellh - hh;
          x = Math.abs(x % cell) > cellh ? (x > 0 ? x - x % cell + cell : x - x % cell - cell) : x - x % cell;
          y = y > 0 ? y - y % cell + cellh : y - y % cell - cellh;
          if (self.gameType == 1) {
            self.clickHere(x, y);
          } else if (self.gameType === 2) {
            self.np.innerHTML = '玩家中途离场 游戏结束'
          } else {
            self.np.innerHTML = "胜负已分莫强求";
          }
          console.log('鼠标点击的坐标x:' + x + ' y:' + y);
        };
        this.newGameStart();
      },                                       // 变量初始化，参数初始化，棋子事件绑定
      updateWar() {
        // 更新战局详细信息
        this.username = window.sessionStorage.getItem('id')
        var aimID = window.sessionStorage.getItem('aimID')
        this.$http.get('updatewar?id=' + this.username + '&aim=' + aimID).then(res => {
          console.log(res)
          this.warInfo = res.data.warInfo
          if (this.username === this.warInfo.red) {
            this.teamType = 'red'
          } else {
            this.teamType = 'black'
          }
          //游戏状态更新
          if (this.warInfo.flag === '红方就绪') {
            this.np.innerHTML = '请等待黑方进入'
          } else if (this.warInfo.flag === '黑方就绪') {
            this.np.innerHTML = '请等待红方进入'
          } else if (this.warInfo.flag === '红方离场') {
            this.np.innerHTML = '红方玩家离开，游戏结束'
            this.gameType = 2
          } else if (this.warInfo.flag === '黑方离场') {
            this.np.innerHTML = '黑方玩家离开，游戏结束'
            this.gameType = 2
          } else {
            this.np.innerHTML = '红方先走'
            this.ready = true
          }
          // console.log(this.teamType)
        })
      },                                     // 更新战局信息
      clickHere(x, y) {
        // 点击触发事件
        // qzHere是点击的地方， qzChoose是已经选择的棋子
        if (this.warInfo.flag !== '就绪') {
          this.np.innerHTML = '玩家未准备就绪 请稍等'
          this.updateWar()
          return
        }
        var qzHere = this.checkXYisEmpty(x, y); //空是true，有则返回棋子obj
        var qzChoose = null;
        // 找到选择的棋子
        for (var i in this.qzArray) {
          if (this.qzArray[i].isChoose == true) {
            qzChoose = this.qzArray[i];
          }
        }
        console.log(typeof qzHere);
        if (qzHere === true) {//点击的地方是空的
          if (qzChoose === null) {//没有选中的棋子
            console.log("点击的地方是空的,没有选中的棋子");
          } else {//选中的棋子为qzChoose，qzChoose!=NULL 点击的是空白处
            if (qzChoose.go(x, y) === true) {///////////////////////// 完成- 走！////////////////////////////////
              this.qzRunTime += 1;
              console.log('选中的棋子移动到空的地方 qzRunTime:' + this.qzRunTime)
              if (this.gameType == 1) {
                this.np.innerHTML = "棋局第" + this.qzRunTime + "步";
              }
              this.isJiangJun(qzChoose);
              qzChoose.isChoose = false;
            }
          }
        } else {//qzHere!=true 点击的地方是棋子
          if (qzChoose === null) {//没有选中的棋子
            if (this.qzRunTime % 2 == 0 && qzHere.side == '红方' && this.teamType == 'red') {
              console.log("红：之前没有选中棋子，所以选中点击的棋子,下choose");
              qzHere.choose();
            } else if (this.qzRunTime % 2 == 1 && qzHere.side == '黑方' && this.teamType == 'black') {
              console.log("黑：之前没有选中棋子，所以选中点击的棋子,下choose");
              qzHere.choose();
            } else {//红方点黑棋/黑方点红棋
              if (this.qzRunTime % 2 == 0) {
                console.log("warn：到红方了");
                this.np.innerHTML = "红方回合 等待对方下棋";
              } else {
                console.log("warn：到黑方了");
                this.np.innerHTML = "黑方回合 等待对方下棋";
              }
            }

          } else {//选中的棋子为qzChoose,点击的是友方棋子
            if (qzChoose.side == qzHere.side) {
              console.log("点击的棋子和之前选中的棋子同一边，所以，选中此棋子");
              qzChoose.noChoose();
              console.log("typeof qzHere:" + typeof qzHere + ',下choose');
              qzHere.choose();

            } else {//选中的棋子为qzChoose，点击的是敌方棋子
              console.log("点击的棋子和之前选中的棋子敌对，所以，尝试 吃子");
              if (qzChoose.go(x, y) === true) {///////////////////////// 完成- 走！////////////////////////////////
                this.qzRunTime += 1;
                // this.sendMove(qzChoose.x, qzChoose.y, x, y, this.teamType)
                if (this.gameType == 1) {
                  this.np.innerHTML = "棋局第" + this.qzRunTime + "步";
                }
                this.isJiangJun(qzChoose);
                qzChoose.isChoose = false;
              }
            }
          }
        }
        //更新棋盘
        this.rePut();
      },                                 // 点击触发事件，游戏操作的入口
      isJiangJun() {
        // 将军判断 判断是否有棋子到达将/帅的路径为true
        var html = '';
        for (var i in this.qzBlackArray) {
          var o = this.qzBlackArray[i], a = o.x, b = o.y;
          if (o.go(this.qzRedArray[4].x, this.qzRedArray[4].y, true) === true) {
            html += '黑方';
            o.x = a;
            o.y = b;
            this.rePut();
            break;
          }
        }
        for (var i in this.qzRedArray) {
          var o = this.qzRedArray[i], a = o.x, b = o.y;
          if (o.go(this.qzBlackArray[4].x, this.qzBlackArray[4].y, true) === true) {
            html += '红方';
            o.x = a;
            o.y = b;
            this.rePut();
            break;
          }
        }
        if (html !== '') {
          this.np.innerHTML = html + ' ：将军 ！';
        }
      },                                    // 将军判断 判断是否有棋子到达将/帅的路径为true
      rePut() {
        // 棋盘刷新函数
        console.log('repout()');
        this.createQiPan();
        for (var index in this.qzArray) {
          var a = this.qzArray[index];
          if (a.isDead) {
            continue;
          }
          a = this.createQZ(a.x, a.y, a.name, a.side, a.isChoose);
          this.putQiZi(a);
        }
      },                                         // 画布重绘
      gameOver(side) {
        this.gameType = 0;
        this.np.innerHTML = side + '输了 ！';
        var win = ''
        if (side === '红方') {
          win = this.warInfo.black
        } else {
          win = this.warInfo.red
        }
        this.$http.get('updateCareer?id=' + this.username + '&win=' + win).then(res => {
          console.log(res)
        })
        this.$http.get('updatePass?red=' + this.warInfo.red + '&black=' + this.warInfo.black
          + '&win=' + win + '&run=' + this.qzRunTime).then(res => {
          // console.log(res)
        })
        this.exitVisible = true
      },                                  // 游戏结束
      createQZ(x, y, name, side, ischoose, isDead) {
        // 单个棋子属性创建
        var qz = new Object();
        qz.side = side;
        qz.x = x;
        qz.y = y;
        qz.name = name;
        qz.isChoose = ischoose ? ischoose : false;
        qz.isDead = isDead ? isDead : false;

        var w = this.body_w / 9 * 8, h = w / 8 * 9;
        var wh = w / 2;
        var hh = h / 2;
        var cell = w / 8;
        var cellh = cell / 2;
        let self = this

        // 棋子die的函数
        qz.goDead = function () {
          qz.isDead = true;
          if (qz.name == '将') {
            self.gameOver(qz.side);
          }
          // console.log('createQZ:' + qz.name + ' dead')
        };

        // 棋子移动函数 a,b为目的XY坐标 c为是否结束
        qz.go = function (a, b, c) {
          // 将军判断
          var tryJiangJun = c ? c : false;
          // 路径可行判断
          var theWayCanGo = self.way(qz, a, b, tryJiangJun);
          // 目标地点为空判断
          var is_empty = self.checkXYisEmpty(a, b);
          // console.log("createQZ_theWayCanGo:" + theWayCanGo);

          // 棋子移动
          if (theWayCanGo === true) {
            if (is_empty == true) {//目标地点为空且可走
              // self.qzRunTime += 1
              // console.log('---------------------'+self.qzRunTime)
              self.sendMove(qz.x, qz.y, a, b, parseInt(self.qzRunTime) + 1)
              // self.qzRunTime -= 1
              qz.x = a;
              qz.y = b;
              // console.log("createQZ_function_把" + qz.side + "的【" + qz.name + "】移到坐标（" + qz.x + "," + qz.y + "】）");
              self.rePut();
              return true;
            } else if (is_empty.side === qz.side) {//目标地点有棋子且为同阵营
              // console.log('createQZ_function_go_不能这么走！');
              if (!tryJiangJun) self.np.innerHTML = "同阵营 !";
              return false;
            } else {//目标地点有棋子为敌对阵营
              if (qz.name == '炮') {//使用的棋子为炮
                // console.log('createQZ_function_go_不能这么吃，要隔一个子！');
                if (!tryJiangJun) self.np.innerHTML = "隔空打炮 !";
                return false;
              } else {//使用的棋子不为炮
                if (!tryJiangJun) is_empty.goDead();
                // self.qzRunTime += 1
                self.sendMove(qz.x, qz.y, a, b, parseInt(self.qzRunTime) + 1)
                // self.qzRunTime -= 1
                qz.x = a;
                qz.y = b;
                // console.log("createQZ_function_go_把" + qz.side + "的【" + qz.name + "】移到坐标（" + qz.x + "," + qz.y + "】）");
                self.rePut();
                return true;
              }
            }
          } else if (theWayCanGo === 1 && qz.name == '炮') {
            if (is_empty !== true && is_empty.side !== qz.side) {//目的地不为空且为敌对阵营
              if (!tryJiangJun) is_empty.goDead();
              // self.qzRunTime += 1
              self.sendMove(qz.x, qz.y, a, b, parseInt(self.qzRunTime) + 1)
              // self.qzRunTime -= 1
              qz.x = a;
              qz.y = b;
              // console.log("createQZ_function_PaoGo_" + is_empty.name + " Dead;把" + qz.side + "的【" + qz.name + "】移到坐标（" + qz.x + "," + qz.y + "】）");
              self.rePut();
              return true;
            } else {
              if (!tryJiangJun) self.np.innerHTML = "禁止打空炮 ！";
            }
          } else {
            // console.log('warn:go else ????????');
            if (!tryJiangJun) self.np.innerHTML = "你走远了 ！";
            return false;
          }
        };

        // 棋子被选中
        qz.choose = function () {
          self.cxt.beginPath();
          self.cxt.lineWidth = cell / 20;
          self.cxt.strokeStyle = "#ffff00";
          self.cxt.arc(qz.x, qz.y, cell / 2.2, 0, Math.PI * 2, true);
          self.cxt.stroke();
          self.cxt.closePath();
          self.cxt.lineWidth = 1;
          qz.isChoose = true;
          console.log('createQZ_fun_choose_' + qz.side + " 的 【" + qz.name + "】被选中，坐标是：（" + qz.x + "," + qz.y + "）");
        };

        // 棋子取消选择
        qz.noChoose = function () {
          qz.isChoose = false;
          console.log('createQZ_fun_noChoose_' + qz.side + " 的 【" + qz.name + "】被取消选中，原坐标是：（" + qz.x + "," + qz.y + "）");
        };
        //   console.log(qz.side+" 已创建："+qz.name+"，坐标是：（"+qz.x+","+qz.y+"）");
        return qz;
      },    // 棋子对象创建
      way(obj, a, b, c) {
        // 路径可行性判断
        var tryJiangJun = c ? c : false;
        var x = obj.x,
          y = obj.y,
          k = obj.name,
          wayResult,
          countQiziOnRoad = 0;

        var w = this.body_w / 9 * 8, h = w / 8 * 9;
        var wh = w / 2;
        var hh = h / 2;
        var cell = w / 8;
        var cellh = cell / 2;

        if (x == a && y == b) {
          return false
        }//在原来的位置，没有移动
        // console.log("【" + k + "】(" + x + "," + y + ") 在走");
        switch (k) {
          case "車":
            if (x == a) {//同行，检查y-b有没有其它棋子
              // console.log("沿y轴:现在y=" + y + "； 目标y=b(" + b);
              if (Math.abs(y - b) == cell) {
                return true
              }
              if (b < y) {//b<y往上走,x不变,y减小
                // console.log("b<y往上走,x不变,y减小");
                for (var f = y - cell; f > b; f -= cell) {
                  // console.log("沿y轴:现在y=" + f + "； 目标y=b(" + b);
                  if (this.checkXYisEmpty(a, f) !== true) {//路径坐标上有其它棋子
                    wayResult = false; //不能走
                    // console.log("不能走");
                    if (!tryJiangJun) this.np.innerHTML = "车步错误";
                    break;
                  } else {
                    wayResult = true;  //能走
                    // console.log("能走");
                  }
                }
              } else {//b>y往下走,x不变,y增大
                // console.log("b>y往下走,x不变,y增大");
                for (var f = y + cell; f < b; f += cell) {
                  // console.log("沿y轴:现在y=" + f + "； 目标y=b(" + b);
                  if (this.checkXYisEmpty(a, f) !== true) {//路径坐标上有其它棋子
                    wayResult = false; //不能走
                    // console.log("不能走");
                    if (!tryJiangJun) this.np.innerHTML = "车步错误";
                    break;
                  } else {
                    wayResult = true;  //能走
                    // console.log("能走");
                  }
                }
              }
            } else if (y == b) {//同列，检查x-a有没有其它棋子
              // console.log("沿x轴:现在x=" + x + "； 目标x=a(" + a);
              if (Math.abs(x - a) == cell) {
                return true
              }
              if (a < x) {//a<x往左走,y不变,x减小
                // console.log("a<x往左走,y不变,x减小");
                for (var f = x - cell; f > a; f -= cell) {
                  // console.log("沿x轴:现在x=" + f + "； 目标x=a(" + a);
                  if (this.checkXYisEmpty(f, b) !== true) {//路径坐标上有其它棋子
                    wayResult = false; //不能走
                    // console.log("不能走");
                    if (!tryJiangJun) this.np.innerHTML = "车步错误";
                    break;
                  } else {
                    wayResult = true;  //能走
                    // console.log("能走");
                  }
                }
              } else {//a>x往右走,y不变,x增大
                // console.log("a>x往右走,y不变,x增大");
                for (var f = x + cell; f < a; f += cell) {
                  // console.log("沿y轴:现在x=" + f + "； 目标x=a(" + a);
                  if (this.checkXYisEmpty(f, b) !== true) {//路径坐标上有其它棋子
                    wayResult = false; //不能走
                    // console.log("不能走");
                    if (!tryJiangJun) this.np.innerHTML = "车步错误";
                    break;
                  } else {
                    wayResult = true;  //能走
                    // console.log("能走");
                  }
                }
              }
            } else {
              wayResult = false; //不能走
              //  console.log("？？不能走");
              if (!tryJiangJun) this.np.innerHTML = "车步错误 ！";
            }
            break;
          case "馬"://xy---ab
            if (Math.abs(x - a) == 2 * cell && Math.abs(y - b) == cell) {
              if (x < a && this.checkXYisEmpty(x + cell, y) === true) {
                wayResult = true;  //能走
              } else if (x > a && this.checkXYisEmpty(x - cell, y) === true) {
                wayResult = true;  //能走
              } else {
                wayResult = false; //不能走
                if (!tryJiangJun) this.np.innerHTML = "马步错误";
              }
            } else if (Math.abs(x - a) == cell && Math.abs(y - b) == 2 * cell) {
              if (y < b && this.checkXYisEmpty(x, y + cell) === true) {
                wayResult = true;  //能走
              } else if (y > b && this.checkXYisEmpty(x, y - cell) === true) {
                wayResult = true;  //能走
              } else {
                wayResult = false; //不能走
                if (!tryJiangJun) this.np.innerHTML = "马步错误";
              }
            }
            break;
          case "相":

            if ((obj.side == "红方" && b < 0) || (obj.side == "黑方" && b > 0)) {
              wayResult = false; //不能走
              // console.log('提示：相不能过河');
              if (!tryJiangJun) this.np.innerHTML = "相不能过河";
              return wayResult;
            }
            console.log('相脚：' + (x + a) / 2 + "," + (y + b) / 2);
            if ((Math.abs(x - a) == 2 * cell) && (Math.abs(y - b) == 2 * cell) && (this.checkXYisEmpty((x + a) / 2, (y + b) / 2) === true)) {
              wayResult = true;  //能走
            } else {
              wayResult = false; //不能走
              if (!tryJiangJun) this.np.innerHTML = "相步错误";
            }
            break;
          case "仕":
            if (Math.abs(x - a) == cell && Math.abs(y - b) == cell && Math.abs(a) <= cell && Math.abs(b) >= 2.5 * cell) {
              wayResult = true;  //能走
            } else {
              wayResult = false; //不能走
              if (!tryJiangJun) this.np.innerHTML = "仕步错误";
            }
            break;
          case "将":
            if (a == x) {
              if (Math.abs(y - b) == cell && Math.abs(a) <= cell && Math.abs(b) >= 2.5 * cell) {
                wayResult = true;  //能走
              } else {
                wayResult = false; //不能走
                if (!tryJiangJun) this.np.innerHTML = "将步错误";
              }
            } else if (b == y) {
              if (Math.abs(a - x) == cell && Math.abs(a) <= cell && Math.abs(b) >= 2.5 * cell) {
                wayResult = true;  //能走
              } else {
                wayResult = false; //不能走
                if (!tryJiangJun) this.np.innerHTML = "将步错误";
              }
            }
            break;
          case "炮":

            if (x == a) {//y-b有没有其它棋子
              // console.log("沿y轴:现在y=" + y + "； 目标y=b(" + b);
              if (Math.abs(y - b) == cell) {
                return true
              }
              if (b < y) {
                // console.log("b<y往上走,x不变,y减小");
                for (var f = y - cell; f > b; f -= cell) {
                  // console.log("沿y轴:现在y=" + f + "； 目标y=b(" + b);
                  if (this.checkXYisEmpty(a, f) !== true) {//路径坐标上有其它棋子
                    wayResult = false; //不能走
                    // console.log("不能走");
                    countQiziOnRoad += 1;
                    if (countQiziOnRoad == 2) {
                      if (!tryJiangJun) this.np.innerHTML = "炮步错误";
                      break;
                    }
                  } else {
                    wayResult = true;  //能走
                    // console.log("能走");
                  }
                }
              } else {
                // console.log("b>y往下走,x不变,y增大");
                for (var f = y + cell; f < b; f += cell) {
                  // console.log("沿y轴:现在y=" + f + "； 目标y=b(" + b);
                  if (this.checkXYisEmpty(a, f) !== true) {//路径坐标上有其它棋子
                    wayResult = false; //不能走
                    // console.log("不能走");
                    countQiziOnRoad += 1;
                    if (countQiziOnRoad == 2) {
                      if (!tryJiangJun) this.np.innerHTML = "炮步错误";
                      break;
                    }
                  } else {
                    wayResult = true;  //能走
                    // console.log("能走");
                  }
                }
              }
            } else if (y == b) {//x-a有没有其它棋子
              // console.log("沿x轴:现在x=" + x + "； 目标x=a(" + a);
              if (Math.abs(x - a) == cell) {
                return true
              }
              if (a < x) {
                // console.log("a<x往左走,y不变,x减小");
                for (var f = x - cell; f > a; f -= cell) {
                  // console.log("沿x轴:现在x=" + f + "； 目标x=a(" + a);
                  if (this.checkXYisEmpty(f, b) !== true) {//路径坐标上有其它棋子
                    wayResult = false; //不能走
                    // console.log("不能走");
                    countQiziOnRoad += 1;
                    if (countQiziOnRoad == 2) {
                      if (!tryJiangJun) this.np.innerHTML = "炮步错误";
                      break;
                    }
                  } else {
                    wayResult = true;  //能走
                    // console.log("能走");
                  }
                }
              } else {
                // console.log("a>x往右走,y不变,x增大");
                for (var f = x + cell; f < a; f += cell) {
                  // console.log("沿y轴:现在x=" + f + "； 目标x=a(" + a);
                  if (this.checkXYisEmpty(f, b) !== true) {//路径坐标上有其它棋子
                    wayResult = false; //不能走
                    // console.log("不能走");
                    countQiziOnRoad += 1;
                    if (countQiziOnRoad == 2) {
                      if (!tryJiangJun) this.np.innerHTML = "炮步错误";
                      break;
                    }
                  } else {
                    wayResult = true;  //能走
                    // console.log("能走");
                  }
                }
              }
            } else {//不同行不同列
              wayResult = false; //不能走
              if (!tryJiangJun) this.np.innerHTML = "炮步错误 ！";
              //  console.log("？？不能走");
            }
            break;
          case "兵":
            if (obj.side == "红方") {
              if (y > 0) {//未过河
                if (x == a && y - b == cell) {
                  wayResult = true;  //能走
                } else {
                  wayResult = false; //不能走
                  // console.log('红方兵未过河，只能向前走一步！');
                  if (!tryJiangJun) this.np.innerHTML = "兵步错误";
                }
              } else {//过河
                if ((Math.abs(x - a) == cell && y == b) || (a == x && y - b == cell)) {
                  wayResult = true;  //能走
                } else {
                  wayResult = false; //不能走
                  // console.log('红方兵未过河，只能向 前、左、右 方向走一步！');
                  if (!tryJiangJun) this.np.innerHTML = "兵步错误";
                }
              }
            } else {
              if (y < 0) {//未过河
                if (x == a && y - b == -cell) {
                  wayResult = true;  //能走
                  // console.log('黑方兵未过河，能走！');
                } else {
                  wayResult = false; //不能走
                  // console.log('黑方兵未过河，只能向前走一步！');
                  if (!tryJiangJun) this.np.innerHTML = "兵步错误";
                }
              } else {//过河
                if ((Math.abs(x - a) == cell && y == b) || (a == x && y - b == -cell)) {
                  wayResult = true;  //能走
                } else {
                  wayResult = false; //不能走
                  // console.log('黑方兵未过河，只能向 前、左、右 方向走一步！');
                  if (!tryJiangJun) this.np.innerHTML = "兵步错误";
                }
              }
            }
            break;
          default:
        }
        if (countQiziOnRoad === 1) {
          return countQiziOnRoad;
        } else {
          // console.log("wayResult:" + wayResult);
          return wayResult;
        }

      },                               // 路径可行性判断
      checkXYisEmpty(x, y) {
        //指定坐标上 是否为空，空则true，有棋子则返回棋子的；
        //  console.log("指定坐标上 是否为空，空则true，有棋子则返回棋子的side");
        var re;
        for (var i in this.qzArray) {
          if (this.qzArray[i].isDead === true) {
            re = true;
            continue
          }
          //  console.log("检测坐标:"+x+","+y+" 上有没有"+qzArray[i].name);
          if (this.qzArray[i].x == x && this.qzArray[i].y == y) {
            re = this.qzArray[i].side + "_" + this.qzArray[i].name + "_" + this.qzArray[i].x + "," + this.qzArray[i].y;
            // console.log(re);
            re = this.qzArray[i];
            break;
          } else {
            re = true;
          }
        }
        // console.log("re:" + re);
        return re;
      },                            // 根据坐标检验是否有棋子
      putQiZi(object) {
        // 绘制棋子
        var w = this.body_w / 9 * 8, h = w / 8 * 9;
        var wh = w / 2;
        var hh = h / 2;
        var cell = w / 8;
        var cellh = cell / 2;
        this.cxt.beginPath();
        this.cxt.arc(object.x, object.y, cell / 2, 0, Math.PI * 2, true);
        this.cxt.fillStyle = "#DEB887";
        this.cxt.fill();
        this.cxt.fillStyle = (object.side == "红方") ? "red" : "black";
        this.cxt.fillText(object.name, object.x - cell * 0.35, object.y + cell * 0.25);
        this.cxt.closePath();
        if (object.isChoose === true) {
          object.choose()
        }
        //     console.log(object.side+""+object.name+"，已到位");
      },                                 // 棋子在画布上绘制
      newGameStart() {
        // 游戏初始化
        var w = this.body_w / 9 * 8, h = w / 8 * 9;
        var wh = w / 2;
        var hh = h / 2;
        var cell = w / 8;
        var cellh = cell / 2;
        this.gameType = 1;
        this.qzRunTime = 0
        // 绘制棋盘
        this.createQiPan()
        // 初始化棋子
        for (var index in this.qzName) {
          //这里可以改变绘图方式
          switch (this.qzName[index]) {
            case '炮':
              var a = (index == 10) ? -1 : 1;
              this.qzRedArray[index] = this.createQZ(-3 * cell * a, 2.5 * cell, this.qzName[index], "红方");
              this.qzBlackArray[index] = this.createQZ(-3 * cell * a, -2.5 * cell, this.qzName[index], "黑方");
              break;
            case '兵':
              this.qzRedArray[index] = this.createQZ(-wh + (index - 11) * 2 * cell, 1.5 * cell, this.qzName[index], "红方");
              this.qzBlackArray[index] = this.createQZ(-wh + (index - 11) * 2 * cell, -1.5 * cell, this.qzName[index], "黑方");
              break;
            default:
              this.qzRedArray[index] = this.createQZ(-wh + index * cell, hh, this.qzName[index], "红方");
              this.qzBlackArray[index] = this.createQZ(-wh + index * cell, -hh, this.qzName[index], "黑方");
          }
          // if (this.teamType === 'red') {
          //   switch (this.qzName[index]) {
          //     case '炮':
          //       var a = (index == 10) ? -1 : 1;
          //       this.qzRedArray[index] = this.createQZ(-3 * cell * a, 2.5 * cell, this.qzName[index], "红方");
          //       this.qzBlackArray[index] = this.createQZ(-3 * cell * a, -2.5 * cell, this.qzName[index], "黑方");
          //       break;
          //     case '兵':
          //       this.qzRedArray[index] = this.createQZ(-wh + (index - 11) * 2 * cell, 1.5 * cell, this.qzName[index], "红方");
          //       this.qzBlackArray[index] = this.createQZ(-wh + (index - 11) * 2 * cell, -1.5 * cell, this.qzName[index], "黑方");
          //       break;
          //     default:
          //       this.qzRedArray[index] = this.createQZ(-wh + index * cell, hh, this.qzName[index], "红方");
          //       this.qzBlackArray[index] = this.createQZ(-wh + index * cell, -hh, this.qzName[index], "黑方");
          //   }
          // } else if (this.teamType === 'black') {
          //   switch (this.qzName[index]) {
          //     case '炮':
          //       var a = (index == 10) ? -1 : 1;
          //       this.qzRedArray[index] = this.createQZ(-3 * cell * a, 2.5 * cell, this.qzName[index], "黑方");
          //       this.qzBlackArray[index] = this.createQZ(-3 * cell * a, -2.5 * cell, this.qzName[index], "红方");
          //       break;
          //     case '兵':
          //       this.qzRedArray[index] = this.createQZ(-wh + (index - 11) * 2 * cell, 1.5 * cell, this.qzName[index], "黑方");
          //       this.qzBlackArray[index] = this.createQZ(-wh + (index - 11) * 2 * cell, -1.5 * cell, this.qzName[index], "红方");
          //       break;
          //     default:
          //       this.qzRedArray[index] = this.createQZ(-wh + index * cell, hh, this.qzName[index], "黑方");
          //       this.qzBlackArray[index] = this.createQZ(-wh + index * cell, -hh, this.qzName[index], "红方");
          //   }
          // }
          this.qzArray = this.qzRedArray.concat(this.qzBlackArray);
          // 绘制棋子
          this.putQiZi(this.qzRedArray[index]);
          this.putQiZi(this.qzBlackArray[index]);
        }
        console.log('------------红方先走！（Red First）-------------');
        this.np.innerHTML = "红方先走";

      },                                  // 重新开始游戏 测试用
      clearCanvas() {
        // 清空画布
        this.cxt.clearRect(-this.c.width / 2, -this.c.height / 2, this.c.width, this.c.height);
      },                                   // 清空画布
      createQiPan() {
        // 绘制棋盘
        this.clearCanvas();
        this.cxt.strokeStyle = "#ff0000";
        this.cxt.lineWidth = 1;
        var w = this.body_w / 9 * 8, h = w / 8 * 9;
        var wh = w / 2;
        var hh = h / 2;
        var cell = w / 8;
        var cellh = cell / 2;
        //横线
        for (var i = 0; i <= 9; i++) {
          this.cxt.moveTo(-wh, -hh + cell * i);
          this.cxt.lineTo(wh, -hh + cell * i);
        }
        //竖线
        for (var i = 0; i <= 8; i++) {
          this.cxt.moveTo(-wh + cell * i, -hh);
          if (i != 0 && i != 8) {//除两端外，中间竖线 分为两段
            this.cxt.lineTo(-wh + cell * i, -cellh);
            this.cxt.moveTo(-wh + cell * i, cellh);
          }
          this.cxt.lineTo(-wh + cell * i, hh);
        }
        //下方‘米’格
        this.cxt.moveTo(-cell, hh);
        this.cxt.lineTo(cell, hh - 2 * cell);
        this.cxt.moveTo(-cell, hh - 2 * cell);
        this.cxt.lineTo(cell, hh);
        //上方‘米’格
        this.cxt.moveTo(-cell, -hh);
        this.cxt.lineTo(cell, -hh + 2 * cell);
        this.cxt.moveTo(-cell, -hh + 2 * cell);
        this.cxt.lineTo(cell, -hh);

        this.cxt.stroke();
        //兵位
        for (var i = 0; i < 5; i++) {
          this.cxt.beginPath();
          this.cxt.arc(-wh + 2 * cell * i, 1.5 * cell, cell / 4, 0, Math.PI * 2, true);
          this.cxt.stroke();
          this.cxt.beginPath();
          this.cxt.arc(wh - 2 * cell * i, -1.5 * cell, cell / 4, 0, Math.PI * 2, true);
          this.cxt.stroke();
        }
        //炮位
        {
          this.cxt.beginPath();
          this.cxt.arc(-3 * cell, 2.5 * cell, cell / 4, 0, Math.PI * 2, true);
          this.cxt.stroke();
          this.cxt.beginPath();
          this.cxt.arc(3 * cell, 2.5 * cell, cell / 4, 0, Math.PI * 2, true);
          this.cxt.stroke();
          this.cxt.beginPath();
          this.cxt.arc(-3 * cell, -2.5 * cell, cell / 4, 0, Math.PI * 2, true);
          this.cxt.stroke();
          this.cxt.beginPath();
          this.cxt.arc(3 * cell, -2.5 * cell, cell / 4, 0, Math.PI * 2, true);
          this.cxt.stroke();
          this.cxt.closePath();
        }
        //楚河 汉界
        this.cxt.fillStyle = '#ff0000';
        this.cxt.beginPath();
        this.cxt.fillText('楚河', -2.5 * cell, 0.6 * cellh);
        this.cxt.fillText('汉界', 1 * cell, 0.6 * cellh);
        this.cxt.closePath();
      },                                   // 绘制空棋盘
      goBack() {
        var aimID = window.sessionStorage.getItem('aimID')
        let self = this
        //后端区分红方/黑方
        this.$http.get('quitwar?id=' + this.username + '&aim=' + aimID).then(res => {
          // console.log(res)
        })
        if (this.username === this.warInfo.red) {//红方离开
          this.$goEasy.publish({
            channel: "chess", //替换为您自己的channel
            message: '3,' + '红方离场' + ',' + self.username //替换为您想要发送的消息内容
          });
        } else {
          this.$goEasy.publish({
            channel: "chess", //替换为您自己的channel
            message: '3,' + '黑方离场' + ',' + self.username //替换为您想要发送的消息内容
          });
        }
        window.sessionStorage.removeItem('aimID')
        this.$router.push('/waitHall')
      },                                        // 中途退出游戏
      sendMove(hx, hy, cx, cy, runtime) {
        // console.log('send!')
        var flag = this.checkXYisEmpty(cx, cy)
        let self = this
        // flag为空表示棋子已经移动，是移动方发出的请求
        if (flag === true) {
          this.$goEasy.publish({
            channel: "chess", //替换为您自己的channel
            message: '1,' + this.username + ',' + hx + ',' + hy + ',' + cx + ',' + cy + ',' + runtime + ',' + self.teamType //替换为您想要发送的消息内容
          });
        }
      },               // 发送移动棋子的信息
      receiveMove() {
        // console.log('receive!')
        let self = this
        this.$goEasy.subscribe({
          channel: "chess",//替换为您自己的channel
          onMessage: function (message) {
            // console.log("Channel:" + message.channel + " content:" + message.content);
            // moveInfo是消息列表，最开始运用于走步，因此叫moveInfo
            var moveInfo = message.content.toString().split(',')
            // console.log(message)
            var type = moveInfo[0]
            // console.log(moveInfo)
            if (type === '1') {//接收到的是移动棋子的消息
              var checkid = moveInfo[1]
              if (self.warInfo.red === checkid || self.warInfo.black === checkid) {
                var chooseX = parseInt(moveInfo[2])
                var chooseY = parseInt(moveInfo[3])
                var hereX = parseInt(moveInfo[4])
                var hereY = parseInt(moveInfo[5])
                var runTime = parseInt(moveInfo[6])
                var team = moveInfo[7]
                //!!!!!!!!!!!!!!!参数类型设置为整形！不能为字符粗
                // console.log(team+','+self.teamType)
                if (team != self.teamType) {
                  console.log('start move!')
                  // var aimQZ = this.checkXYisEmpty(chooseX, chooseY)
                  self.moveAimQZ(hereX, hereY, chooseX, chooseY)
                }
                self.qzRunTime = runTime
                // console.log('收到的回合'+runTime+',本地回合'+self.qzRunTime)
              }
            } else if (type === '2') {//接收到的是对方是否进入的消息
              var checkMes = moveInfo[1]
              var checkid = moveInfo[2]
              console.log(moveInfo)
              // console.log(self.warInfo)
              // console.log(self.teamType)
              // checkid 与 red 类型不同
              if (checkMes === '红方就绪' && self.teamType === 'black' && self.warInfo.red == checkid) {
                // console.log("update info!!!!!!!!!!!!!")
                self.updateWar()
              } else if (checkMes === '黑方就绪' && self.teamType === 'red' && self.warInfo.red == checkid) {
                self.updateWar()
              }
            } else if (type === '3') {//接收到的是离场的消息
              var checkMes = moveInfo[1]
              var checkid = moveInfo[2]
              if (checkMes === '红方离场' && self.warInfo.red === checkid) {
                self.updateWar()
                self.exitVisible = true
              } else if (checkMes === '黑方离场' && self.warInfo.black === checkid) {
                self.updateWar()
                self.exitVisible = true
              }
            } else if (type === '5') {//接收到的是对局内聊天信息
              // 1红2黑3发送方
              if (self.warInfo.red === moveInfo[1] && self.warInfo.black === moveInfo[2]) {
                if (self.username !== moveInfo[3]) {
                  self.$http.get('recMes?red=' + moveInfo[1] +
                    '&black=' + moveInfo[2]).then(res => {
                    // 聊天同步
                    self.arr = res.data.mesData
                  })
                }
              }
            }
          }
        });
      },                                   // 监听服务器消息
      moveAimQZ(hx, hy, cx, cy) {
        var aimQZ = this.checkXYisEmpty(cx, cy)
        var flag = this.checkXYisEmpty(hx, hy)
        let self = this
        console.log(hx + ',' + hy + ',' + cx + ',' + cy)
        console.log('选择的棋子aimQZ：')
        console.log(aimQZ)
        console.log('目的地flag:')
        console.log(flag)
        // aimQZ.go(hx, hy)
        if (flag === true) {
          aimQZ.x = hx
          aimQZ.y = hy
        } else {
          flag.goDead()
          aimQZ.x = hx
          aimQZ.y = hy
        }
        this.rePut()
      },                       // 移动对方移动的棋子
      add_data: function () {
        // bug: 内容不能为空。
        if (this.str2 == '') {
          this.$message.warning('请输入消息内容')
          // alert('请输入内容...')
          return;
        }
        // alert(111)
        // 思路: 页面中遍历一个数组(对象),页面中就会有很多标签。将来添加标签，就是
        // 数组中添加数据。
        //     数组中的数据: 元素:  1.谁说的。   2.说的啥。(描述多条信息，用对象/字典)
        //         数组中放入对象(默认两条数据):    [{}, {}, {person:'A/B', words:'...'}]

        // 点击按钮之后，组成一个元素，放入数组中。
        // alert(this.str1) // 0/1
        // alert(this.str2)
        var p = this.username === this.warInfo.red ? "A" : "B";
        var flag = p === 'A' ? true : false
        var obj = {person: p, words: this.str2, flag: flag}
        this.arr.push(obj)
        // console.log(this.arr)
        let data = this.arr
        this.$http.post('sendMes?red=' + this.warInfo.red + '&black=' + this.warInfo.black
          + '&send=' + this.username, data)
          .then(res => {
            console.log(res)
            // this.arr = res.data.mesData
          })
        // 进行广播
        this.$goEasy.publish({
          channel: 'chess',
          message: '5,' + this.warInfo.red + ',' + this.warInfo.black + ',' + this.username,
        })
        // 添加完内容，清空
        this.str2 = ''
      }                            // 发送聊天信息
    }
  }
</script>

<style scoped>
  .restartButton {
    position: absolute;
    left: 90%;
    top: 12%;
  }

  .home-container {
    height: 100%;
  }

  .shadow {
    width: 100%;
    height: 9.57%;
    box-shadow: 0px 7px 7px -7px #5E5E5E;
    position: absolute;
  }

  /*251,189,85*/
  /*  181,115,51*/
  .black-box {
    width: 440px;
    height: 500px;
    background-color: #dae5e2;
    position: absolute;
    left: 32.7%;
    top: 15%;
  }

  .playerBox {
    width: 400px;
    height: 500px;
    position: absolute;
    left: 1.7%;
    top: 15%;
  }

  .image {
    padding-left: 8px;
    padding-top: 8px;
    border-radius: 3px;
    height: 100px;
    width: 100px;
    display: flex;
    justify-content: center;
    /*display: block;*/
  }

  /*聊天区域*/
  .talkBox {
    position: absolute;
    left: 68%;
    top: 30%;
    width: 400px;
    height: 408px;
    background-color: #999999;
  }

  .pubBox {
    position: absolute;
    left: 72%;
    top: 14.2%;
    width: 100px;
    height: 50px;
    /*background-color: #E9EEF3;*/
  }

  .talk_show {
    /*聊天窗口显示区域*/
    width: 380px;
    height: 300px;
    border: 2px solid #666;
    border-radius: 5px;
    background: #fff;
    margin: 10px auto 0;
    overflow: auto;
  }

  .talk_input {
    width: 380px;
    margin: 10px auto 0;
  }

  .whotalk {
    width: 60px;
    height: 30px;
    float: left;
    outline: none;
  }

  .talk_word {
    width: 250px;
    height: 26px;
    padding: 0px;
    float: left;
    margin-left: 10px;
    outline: none;
    text-indent: 10px;
  }

  .talk_sub {
    width: 56px;
    height: 30px;
    float: left;
    margin-left: 10px;
  }

  .atalk {
    margin: 10px;
  }

  .atalk span {
    display: inline-block;
    background: #eeeeee;
    border-radius: 10px;
    color: #808080;
    padding: 5px 10px;
  }

  .btalk {
    margin: 10px;
    text-align: right;
  }

  .btalk span {
    display: inline-block;
    background: #eeeeee;
    border-radius: 10px;
    color: #808080;
    padding: 5px 10px;
  }
</style>
