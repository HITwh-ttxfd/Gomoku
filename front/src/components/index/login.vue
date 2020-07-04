<template>
  <div class="login_container">
    <img src="@/assets/img/gomokuback.jpg" alt="" height=100% width=100%/>
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="@/assets/img/bigf.png" alt="">
      </div>
      <!--表单区域 model绑定表单，rules绑定校验规则-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btn">
          <el-button type="info" plain @click="login">登录</el-button>
          <el-button type="primary" @click="dialogFormVisible = true" plain>注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--弹窗-->
    <el-dialog title="注册" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="logonFormRef" size="small" :rules="registerRules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="name" validate-event="true">
          <el-input
            v-model="form.name"
            placeholder="3~10位字符，作为登录名"
            maxlength="10"
            prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input
            v-model="form.password"
            placeholder="6~15位字符，不包含特殊字符"
            maxlength="15"
            show-password
            prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-radio v-model="form.sex" label="男">男</el-radio>
          <el-radio v-model="form.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input-number
            v-model="form.age"
            controls-position="right"
            :min="1"
            :max="120"></el-input-number>
        </el-form-item>
        <el-form-item label="生日" :label-width="formLabelWidth">
          <el-date-picker v-model="form.birth" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input
            v-model="form.email"
            placeholder="请输入你的邮箱"
            maxlength="20"
            prefix-icon="el-icon-edit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="position: absolute; left: 38%; top:88%">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="logon">注册</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      var validateUser = (rule, value, callback) => {
        // 用户名合法性检验
        // 判断条件为单独的value时才可以触发回调函数
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if (value.length < 3) {
          callback(new Error('用户名长度必须大于3位'))
        } else if (value !== '') {
          this.$http.get('checkid?username=' + value).then(res => {
            // console.log(res.data.flag)
            if (res.data.flag === 'exists') {
              callback(new Error('该用户名已被注册'))
            } else {
              callback();
            }
          })
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value.length < 6) {
          callback(new Error('密码长度必须大于6位'));
        } else {
          callback();
        }
      };
      var validateSex = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择性别'));
        } else {
          callback();
        }
      };
      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱'));
        } else if (value.indexOf('@') === -1) {
          callback(new Error('请输入正确邮箱'));
        } else {
          callback();
        }
      };
      return {
        // 登录表单绑定数据
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入登录密码', trigger: 'blur'}
          ]
        },
        registerRules: {
          name: [{required: true, validator: validateUser, trigger: 'blur'}],
          password: [{required: true, validator: validatePass, trigger: 'blur'}],
          sex: [{required: true, validator: validateSex, trigger: 'blur'}],
          email: [{required: true, validator: validateEmail, trigger: 'blur'}]
        },
        dialogFormVisible: false,
        form: {
          name: '',
          password: '',
          sex: '',
          age: '',
          birth: '',
          email: '',
        },
        formLabelWidth: '120px'
      }
    },
    methods: {
      login() {
        this.$refs.loginFormRef.validate(valid => {
          // console.log(valid)
          if (!valid) return
          this.$http.get('login_check?username=' + this.loginForm.username + '&password=' + this.loginForm.password).then(res => {
            // console.log(res.data)
            var sta = res.data.flag
            if (sta === 'none') {
              this.$message.error("该用户不存在！")
            } else if (sta === 'false') {
              this.$message.error("密码错误！")
            } else if (sta === 'true') {
              this.$message.success("登录成功！")
              window.sessionStorage.setItem("id", this.loginForm.username)
              window.sessionStorage.setItem("token", res.data.token)
              this.$router.push('/home')
              // 跳转
            } else {
              this.$message.info("异常错误")
            }
          })
        })
      },
      logon() {
        // 前端注册方法
        this.$refs.logonFormRef.validate(valid => {
          console.log(valid)
          if (valid) {
            this.dialogFormVisible = false
            let data = {
              'name': this.form.name, 'password': this.form.password, 'sex': this.form.sex, 'age': this.form.age,
              'birth': this.form.birth, 'email': this.form.email
            }
            this.$http.post('logon', data).then(res => {
              console.log(res)
            })
            this.$message.success("注册成功！")
          } else {
            this.$message.error("请检查输入信息！")
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #B3C0D1;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #d67f5c;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #ffffff;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #999999;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #d67f5c;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }

  .btn {
    /*灵活*/
    display: flex;
    /*居中对齐*/
    justify-content: space-around;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    /*边距*/
    padding: 0 20px;
    box-sizing: border-box;
  }

</style>
