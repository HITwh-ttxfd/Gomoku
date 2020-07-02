<template>
  <el-container class="home-container">
    <!--头部区域-->
    <div class="shadow">
      <el-button style="position: absolute; right: 3%; top: 17%"
                 type="info" @click="logout" plain>退出</el-button>
    </div>
    <el-header>
      <div class="title-header">
        <img src="@/assets/img/gomoku.png" alt=""/>
        <span class="span-header">Gomoku</span>
        <!--菜单区域-->
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#ffffff"
          text-color="#666666"
          active-text-color="#409EFF"
          :router="true">
          <!--index与路由设置中组件名对应即可实现页内路由跳转-->
          <el-menu-item index="waithall">对战大厅</el-menu-item>
          <el-submenu index="user">
            <template slot="title">个人中心</template>
            <el-menu-item index="userinfo">我的信息</el-menu-item>
            <el-menu-item index="history">历史对局</el-menu-item>
            <!--            <el-menu-item index="message">消息中心</el-menu-item>-->
          </el-submenu>
          <el-submenu index="friman">
            <template slot="title">好友管理</template>
            <el-menu-item index="myfri">我的好友</el-menu-item>
            <el-menu-item index="addfri">添加好友</el-menu-item>
            <el-menu-item index="reqfri">好友请求</el-menu-item>
          </el-submenu>
          <el-menu-item index="welcome"><a href="http://sports.sina.com.cn/chess/xiangqi/" target="_blank">新闻门户</a>
          </el-menu-item>
        </el-menu>
      </div>

    </el-header>
    <!--主体区域-->
    <el-main>
      <!--路由占位符-->
      <router-view/>
    </el-main>
    <!--    -->
  </el-container>
</template>

<script>
  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: Array(20).fill(item),
        activeIndex: '1'
      }
    },
    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      handleSelect() {

      }
    }
  };
</script>

<style>
  .home-container {
    height: 100%;
    width: 100%;
  }

  .shadow {
    width: 100%;
    height: 9.57%;
    box-shadow: 0px 7px 7px -7px #5E5E5E;
    position: absolute;
  }

  .el-header {
    /*181,210,150  222,166,73*/
    background-color: #ffffff;
    color: #666666;
    font-size: 30px;
    display: flex;
    justify-content: space-between;
    /*左边贴边*/
    padding-left: 0;
    /*按钮居中*/
    align-items: center;
  }

  .title-header {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .span-header {
    margin-left: 10px;
  }

  .el-menu-demo {
    margin-left: 40px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    /*text-align: center;
    line-height: 160px;*/
  }

  /*body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }*/
</style>
