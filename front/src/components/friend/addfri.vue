<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>好友管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加好友</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--      <img src="@/assets/img/background.png" alt=""/>-->
      <div class="image__placeholder">
        <div class="block" style="display: flex; justify-content: center">
          <!--          <span class="demonstration">自定义</span>-->
          <el-image :src="imgSrc" style="width: 325px; padding-bottom: 5%">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
        <div style="display: flex; justify-content: center">
          <el-row :gutter="20">
            <el-col style="margin-bottom: 10px; display: flex; justify-content: center">搜索用户</el-col>
            <el-col>
              <el-input
                placeholder="请输入内容"
                v-model="input"
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px;"
                clearable>
              </el-input>
            </el-col>
            <el-col style="margin-bottom: 10px; display: flex; justify-content: center">
              <el-button type="primary" @click="searchUser" plain>搜索</el-button>
              <el-button @click="clearInput" plain>清空</el-button>
            </el-col>
          </el-row>
        </div>
        <el-divider><i class="el-icon-s-custom"></i></el-divider>
      </div>
    </el-card>
    <el-dialog
      title="详细资料"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="infoDiv">
        <div>

        </div>
        <div>
          <el-form size="mini">
            <el-form-item>
              <el-image
                style="width: 130px; height: 130px"
                :src="this.infoForm.avatarUrl"></el-image>
            </el-form-item>
            <el-form-item>
              <span>{{this.infoForm.name}}</span>
            </el-form-item>
            <el-form-item>
              <span style="margin-right: 15px">性别：{{this.infoForm.sex}}</span>
              <span>年龄：{{this.infoForm.age}}</span>
            </el-form-item>
            <el-form-item>
              <span>等级：{{this.infoForm.level}}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sendFriReq">请求添加</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "addfri",
    data() {
      // https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg
      return {
        imgSrc: 'http://39.98.48.34:2233/userImg/back3.jpg',
        input: '',
        dialogVisible: false,
        infoForm: {
          avatarUrl: 'http://39.98.48.34:2233/userImg/Alex.jpg',
          name: 'admin',
          sex: '南',
          age: '19',
          level: '小白'
        }
      }
    },
    methods: {
      clearInput() {
        this.input = ''
      },
      searchUser() {
        this.$http.get('checkid?username=' + this.input).then(res => {
          if (res.data.flag === 'exists') {
            this.$http.get('getuserdata?id=' + this.input).then(res => {
              this.infoForm.name = res.data.userdata.id
              this.infoForm.sex = res.data.userdata.sex
              this.infoForm.age = res.data.userdata.age
              this.infoForm.level = res.data.userdata.level
            })
            this.$http.get('getAvatar?id=' + this.input).then(res => {
              this.infoForm.avatarUrl = res.data.path
            })
            this.dialogVisible = true
          } else {
            this.$alert('该用户不存在！', '提示', {
              confirmButtonText: '确定'
            });
          }
        })
      },
      sendFriReq() {
        this.$http.get('sendReq?send=' + window.sessionStorage.getItem('id') + '&rec=' + this.input)
          .then(res => {
            console.log(res)
            this.$message.success('发送请求成功')
            this.dialogVisible = false
          })
      }
    }
  }
</script>

<style scoped>
  .infoDiv {
    display: flex;
    justify-content: center;
  }
</style>
