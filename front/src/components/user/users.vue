<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>我的信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 25px; font-weight: bold;">主页</span>
        <el-button style="float: right; padding: 3px 0" @click="changeUserData" type="text">修改信息</el-button>
      </div>
      <!--基本信息-->
      <el-row :gutter="20">
        <!--头像-->
        <el-col :span="4">
          <div>
            <div class="block">
              <el-avatar :size="100" :src="userImg" :key="fit">
              </el-avatar>
            </div>
          </div>
        </el-col>
        <!--用户名&进度条-->
        <el-col :span="10">
          <div>
            <h1>{{username}}</h1>
            <el-row :gutter="20">
              <el-col :span="18">
                <el-progress :percentage="this.percentage" color="#A52A2A" show-text="false"></el-progress>
              </el-col>
              <el-col :span="3"><p style="font-size: 14px; position: absolute; top:-16px;">经验值</p></el-col>
              <el-col :span="3">
                <p style="font-size: 14px; position: absolute; top:-16px; padding-left: 60px;">等级:
                  {{userdata.level}}</p>
              </el-col>
            </el-row>

          </div>
        </el-col>
        <!--荣誉-->
        <el-col :span="10">

        </el-col>
      </el-row>
      <!--折叠菜单-->
      <br/>
      <el-collapse accordion>
        <el-collapse-item name="基本信息">
          <template slot="title">
            <p style="font-size: 15px">基本信息</p>
          </template>
          <el-row>
            <el-col :span="3">
              <h3>用户名: {{username}}</h3>
            </el-col>
            <el-col :span="3">
              <h3>性别: {{userdata.sex}}</h3>
            </el-col>
            <el-col :span="3">
              <h3>生日: {{userdata.birth}}</h3>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <h3>邮箱: {{userdata.email}}</h3>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="游戏生涯">
          <template slot="title">
            <p style="font-size: 15px">游戏生涯</p>
          </template>
          <el-row>
            <el-col :span="3">
              <!--usercareer.allGame  usercareer.winGame  usercareer.lossGame  usercareer.winPer*100-->
              <h3>总场次: {{parseInt(userdata.win)+parseInt(userdata.lose)}}</h3>
            </el-col>
            <el-col :span="3">
              <h3>胜场: {{userdata.win}}</h3>
            </el-col>
            <el-col :span="3">
              <h3>负场: {{userdata.lose}}</h3>
            </el-col>
            <el-col :span="3">
              <h3>胜率: {{userdata.winrate*100}}%</h3>
            </el-col>
          </el-row>
          <el-row>
<!--            <el-col :span="5">
              <h3>我获得的荣誉</h3>
            </el-col>-->
          </el-row>
        </el-collapse-item>
        <!--<el-collapse-item name="游戏设置">
          <template slot="title">
            <p style="font-size: 15px">游戏设置</p>
          </template>
          <div>亟待开发...</div>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template slot="title">
            <p style="font-size: 15px">....</p>
          </template>
          <div>更多功能亟待开发...</div>
        </el-collapse-item>-->
      </el-collapse>
    </el-card>
    <el-drawer
      title="修改个人信息"
      size="40%"
      :visible.sync="drawer"
      direction="rtl">
      <div class="avatarDiv">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="头像" class="uploadItem"></el-form-item>
          <el-form-item class="avatarItem">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :auto-upload="false"
              :show-file-list="true"
              :on-change="handleChange"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div class="formDiv">
        <el-form ref="form" :model="form" label-width="80px">

          <el-form-item label="用户名">
            <el-input v-model="form.name" prefix-icon="el-icon-user" disabled></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              v-model="form.password"
              placeholder="6~15位字符，不包含特殊字符"
              maxlength="15"
              show-password
              prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="form.sex" label="男">男</el-radio>
            <el-radio v-model="form.sex" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input-number
              v-model="form.age"
              controls-position="right"
              :min="1"
              :max="120"></el-input-number>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker v-model="form.birth" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="form.email"
              placeholder="请输入你的邮箱"
              maxlength="20"
              prefix-icon="el-icon-edit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm" plain>提交<i class="el-icon-upload el-icon--right"></i>
            </el-button>
            <el-button @click="drawer=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  export default {
    name: "users",
    mounted() {
      this.getUserdata()
      this.getUserCareer()
      this.username = window.sessionStorage.getItem('id')
    },
    data() {
      return {
        username: "admin",
        userImg: "http://39.98.48.34:2233/userImg/indexAvatar.png",
        userdata: [],
        usercareer: [],
        drawer: false,
        imageUrl: '',
        fileIndex: '',
        avatarForm: {
          fileName: '',
          path: '',
        },
        form: {
          name: this.username,
          password: '',
          sex: '',
          age: '',
          birth: '',
          email: '',
          imgBase64: 'null',
        },
        percentage: 0
        /*avatarImg: require('@/assets/img/bing.png'),
        toMPicimg: require('@/assets/img/bing .png')*/
      }
    },
    methods: {
      increase() {
        var num = parseInt(this.userdata.win)
        if(this.userdata.level==='0'){
        //  小白 0-4
          num = num / 4 * 100
          this.percentage = num
        }
        if(this.userdata.level==='1'){
        //  入门 4-30
          num = num / 30 * 100
          this.percentage = num
        }
        if(this.userdata.level==='2'){
        //  高手 30-50
          num = num / 50 * 100
          this.percentage = num
        }
        if(this.userdata.level==='2'){
        //  大师 50+
          this.percentage = 100
        }
      },
      getUserdata() {
        var id = window.sessionStorage.getItem('id')
        let self = this
        this.$axios.get('http://o3f3042260.zicp.vip/getUser?id=' + id).then(res => {
          // console.log(res.data)
          self.userdata = res.data
          if(self.userdata.sex === 'boy'){
            self.userdata.sex = '男'
          }
          if(self.userdata.sex === 'girl'){
            self.userdata.sex = '女'
          }
          this.increase()
          //调整等级显示
          if(self.userdata.level === '0'){
            self.userdata.level = '小白'
          }
          if(self.userdata.level === '1'){
            self.userdata.level = '入门'
          }
          if(self.userdata.level === '2'){
            self.userdata.level = '高手'
          }
          if(self.userdata.level === '3'){
            self.userdata.level = '大师'
          }
          //调整胜率位数
          self.userdata.winrate = parseFloat(self.userdata.winrate).toFixed(2)
        })
       /* this.$http.get('getuserdata?id=' + id).then(res => {
          self.userdata = res.data.userdata
          //console.log(this.userdata)
        })*/
        this.$http.get('getAvatar?id=' + id).then(res => {
          this.imageUrl = res.data.path
          // console.log(res)
          if (res.data.error_num === 0) {
            this.userImg = this.imageUrl
          }
          // console.log(this.imageUrl)
        })
      },
      getUserCareer() {
        var id = window.sessionStorage.getItem('id')
        this.$http.get('getusercareer?id=' + id).then(res => {
          this.usercareer = res.data.userdata
          // console.log(res)
        })
      },
      changeUserData() {
        this.drawer = true
        // console.log(this.userdata)
        this.form.name = this.username
        this.form.password = this.userdata.password
        this.form.sex = this.userdata.sex
        this.form.age = this.userdata.age
        this.form.email = this.userdata.email
        this.form.birth = this.userdata.birth
      },
      handleChange(file, fileList) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.fileIndex = file
        this.getBase64(file.raw).then(res => {
          this.form.imgBase64 = res
          console.log(this.form)
        })
      },
      beforeAvatarUpload(file) {
        // 图片文件合法性检验
        const isImage = (file.type).indexOf('image') !== -1
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImage) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isImage && isLt2M;
      },
      getBase64(file) {
        // 把文件转换为base64编码的函数，FileReader类似乎不能直接调用 需要使用Promise封装
        return new Promise(function (resolve, reject) {
          let reader = new FileReader()
          let imgResult = ''
          reader.readAsDataURL(file)
          reader.onload = function () {
            imgResult = reader.result
          }
          reader.onerror = function (error) {
            reject(error)
          }
          reader.onloadend = function () {
            resolve(imgResult)
          }
          return reader.result
        })
      },
      uploadChange() {
        let file = this.imageUrl
        this.getBase64(file.raw).then(res => {

        }).catch(err => {
          console.log(err)
        })
      },
      submitForm() {
        // 提交表单信息
        let data = {
          'name': this.form.name, 'password': this.form.password, 'sex': this.form.sex==='男'?'boy':'girl', 'age': this.form.age,
          'birth': this.form.birth, 'email': this.form.email, 'base': this.form.imgBase64
        }
        this.$http.post('changeUserData', data).then(res => {
          this.drawer = false
          this.getUserdata()
          this.$message.success('修改个人信息成功！')
        })
      },
    }
  }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }

  .block {
    padding-left: 50px;
  }

  .unText {
    position: absolute;
    bottom: 10px;
  }

  .userimg {
    width: 50px;
    height: 50px;
  }

  .formDiv {
    width: 450px;
    height: 800px;
    position: absolute;
    left: 5%;
    top: 30%;
  }

  /*上传头像区*/
  .avatar-uploader {
    /*upload组件*/
    width: 85px;
    height: 85px;
    /*height: 100px;*/
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: absolute;
    /*padding-bottom: 100%;*/
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 85px;
    height: 85px;
    display: block;
  }

  .avatarDiv {
    width: 200px;
    height: 200px;
    position: absolute;
    top: 13%;
    left: 12.5%;
  }

  .uploadItem {
    position: absolute;
    /*left: 20%;*/
    top: 20%;
  }

  .avatarItem {
    position: absolute;
    left: 80%;
  }
</style>
