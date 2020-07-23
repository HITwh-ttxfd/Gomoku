<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>我的好友</el-breadcrumb-item>
    </el-breadcrumb>
    <!--好友卡片-->
    <el-row>
      <el-col :span="8" v-for="(o, index) in friendList.length" :key="o">
        <el-card :body-style="{ padding: '4px' }" shadow="hover">
          <!--头像&id&等级-->
          <el-row>
            <el-col :span="6">
              <img :src="friendList[index].fields.avatarPath"
                   class="fri-image">
            </el-col>
            <el-col :span="3">
              <span style="position: absolute; top: 40px; font-size: 23px; font-weight: bold; margin-left: 10px">
                {{friendList[index].fields.fri}}</span>
            </el-col>
            <el-col :span="3">
              <span style="position: absolute; top: 60px; left: 220px; font-size: 15px; font-weight: bold"></span>
            </el-col>
          </el-row>
          <div style="padding: 10px;">
            <div class="bottom clearfix">
              <time class="time">成为好友时间:{{friendList[index].pk}}</time>
              <el-button type="success" class="button" @click="checkContent(index)" plain>
                查看详细资料
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="详细资料"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="infoDiv">
        <div>
          <el-form size="mini">
            <el-form-item>
              <el-image
                style="width: 130px; height: 130px"
                :src="this.friendList[this.indexNum].fields.avatarPath"></el-image>
            </el-form-item>
            <el-form-item>
              <span style="margin-left: 57px">{{this.friendList[this.indexNum].fields.fri}}</span>
            </el-form-item>
            <el-form-item>
              <span style="margin-right: 15px">性别：{{this.friendList[this.indexNum].fields.sex}}</span>
              <span>年龄：{{this.friendList[this.indexNum].fields.age}}</span>
            </el-form-item>
            <el-form-item>
              <span>等级：{{this.friendList[this.indexNum].fields.level}}</span>
            </el-form-item>
            <el-form-item>
              <span>邮箱：{{this.friendList[this.indexNum].fields.email}}</span>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">确认</el-button>
              <el-button type="danger" @click="confirmDialogVisible = true" plain>删除好友</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="confirmDialogVisible"
      width="30%">
      <span>确定要删除好友吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="confirmDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="delFri">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.getFriList()
      // console.log(this.friendList)
    },
    data() {
      return {
        currentDate: new Date(),
        friendList: [],
        indexNum: 0,
        dialogVisible: false,
        confirmDialogVisible: false
      }
    },
    methods: {
      getFriList() {
        // 获取好友列表
        this.$http.get('getFriList?id=' + window.sessionStorage.getItem('id')).then(res => {
          this.friendList = res.data.friendList
        }).catch(error => {
          console.log(error)
        })
      },
      test() {
        console.log(this.friendList)
      },
      checkContent(index) {
        this.dialogVisible = true
        this.indexNum = index
      },
      delFri() {
        this.confirmDialogVisible = false
        this.$http.get('delFri?id=' + window.sessionStorage.getItem('id')
          + '&fri=' + this.friendList[this.indexNum].fields.fri).then(res => {
          console.log(res)
          this.dialogVisible = false
          window.location.reload()
          // this.getFriList()
        })
      }
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
    padding: 0;
    float: right;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .fri-image {
    padding-left: 8px;
    padding-top: 8px;
    height: 80px;
    width: 80px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    /*display: block;*/
  }

  .button {
    padding: 5px;
    float: right;
  }

  .infoDiv {
    display: flex;
    justify-content: center;
  }
</style>
