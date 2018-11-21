<template>
<div 
  class="login-container pull-height" 
  @keyup.enter.native="handleLogin"
  v-loading="loading"
  element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0.5)"
>
    <!-- <div class="login-logo animated fadeIn">
        <img src="/svg/logo.svg" alt="">
    </div> -->
    <!-- <div class="login-left animated fadeInLeft">
        <div class="login-info">
            <h2 class="login-info-title">{{msg}}</h2>
            <ul class="login-info-list">
                <li class="login-info-item">
                    <i class="el-icon-check"></i>&nbsp; 1.{{msg}}登陆页面
                </li>
            </ul>
        </div>
    </div> -->
    <div class="login-border">
        <div class="animated zoomIn login-main">
            <h4 class="login-title">Login</h4>
            <cj-user-login
              @loadingGo="setLoading"
              :loading="loading"
            ></cj-user-login>
        </div>
    </div>
</div>
</template>

<script>
    import cjUserLogin from './userlogin.vue'
    export default{
        name: 'cjLogin',
        data() {
            return {
                msg: '城基项目',
                loading: false
            }
        },
        components: {
          cjUserLogin
        },
        methods: {
          setLoading(value) {
            this.loading = value
          }
        }
    }
</script>

<style>
li{
    list-style: none;
}
.login-container {
  height: 706px;;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
}
.login-container::before {
  z-index: -999;
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url('./login.png');
  background-size: cover;
}
.login-left {
  position: relative;
  flex: 1;
}
.login-logo {
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 50px;
  font-size: 24px;
  color: #333;
}
.login-info {
  padding-left: 140px;
}
.login-info-title {
  line-height: 90px;
  color: rgb(52, 58, 64);
}
.login-info-item {
  font-size: 14px;
  line-height: 2.5;
  color: rgb(33, 37, 41);
}
.login-border {
  margin-top: 6rem;
  flex: 1;
  box-sizing: border-box;
}
.login-main {
  margin: 0 auto;
  width: 50%;
  box-sizing: border-box;
}
.login-main > h3 {
  margin-bottom: 20px;
}
.login-main > p {
  color: #76838f;
}
.login-title {
  margin-bottom: 40px;
  font-weight: 500;
  font-size: 22px;
  text-align: center;
  letter-spacing: 4px;
}
.login-menu {
  width: 100%;
  text-align: center;
}
.login-menu a {
    color: rgb(153, 153, 153);
    font-size: 12px;
    margin: 0px 8px;
  }

.login-index {
  margin-top: 40px;
  width: 180px;
  height: 48px;
  text-align: center;
  border-radius: 50px;
  background: transparent;
  color: #333;
  font-size: 16px;
  border: 1px solid rgb(152, 22, 244);
}
.login-submit {
  display: block;
  margin: 40px auto 10px auto;
  width: 200px;
  height: 48px;
  font-size: 14px;
  text-align: center;
  border-radius: 50px;
  border: 0px;
  box-shadow: rgba(152, 22, 244, 0.19) 0px 5px 10px 2px;
}
.login-code {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 0 0 10px;
}
.login-code-img {
  margin-top: 2px;
  width: 100px;
  height: 38px;
  border: 1px solid #f0f0f0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 5px;
  line-height: 38px;
  text-indent: 5px;
  text-align: center;
}
</style>