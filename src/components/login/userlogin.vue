<template>
    <el-form
        label-width='0px'
        status-icon
        ref="loginForm"
    >
        <el-form-item prop="loginname">
            <el-input
                prefix-icon="el-icon-news" 
                size="large"
                auto-complete="off"
                placeholder="请输入用户名"
                autofocus='true'
                v-model="loginname"
            >
                <i slot="prefix"
                class="icon-yonghu"></i>
            </el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input 
                :type="pwdType" 
                prefix-icon="el-icon-info" 
                size="large" 
                auto-complete="off" 
                placeholder="请输入密码"
                v-model="password"
            >
                <i class="el-icon-view el-input__icon see" @click="seePassword" slot="suffix"></i>
                <i slot="prefix" class="icon-mima"></i>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-row >
                    <el-input 
                        prefix-icon="el-icon-more-outline" 
                        size="large"
                        auto-complete="off"
                        placeholder="请输入验证码"
                    >
                        <i slot="prefix"
                        class="icon-yanzhengma"></i>
                    <i slot="suffix" class="login-code">
                        <span class="login-code-img">
                            <img src="" alt="">
                        </span>
                    </i>
                    </el-input>
            </el-row>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="small" @click="goindex" class="login-submit">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import config from '../config.js'
    import request from '../user_authority.js'
    export default{
        name: 'cjUserLogin',
        data() {
            return {
                loginname: 'admin',
                password: '123456',
                code: '1234',
                pwdType: 'password'
            }
        },
        methods: {
            goindex(){
                this.$emit('loadingGo',true)
                request.requestParams(
                    [
                        '/login',
                        'post',
                        {
                            code: this.code,
                            loginname: this.loginname,
                            password: this.password
                        },
                        (res) => {
                            if(res.data.code > 1){
                                var token = res.data.data.token
                                sessionStorage.setItem('token', token)
                                sessionStorage.setItem('loginname', this.loginname)
                                sessionStorage.setItem('password', this.password)
                                this.$router.push('/')
                            } else {
                                this.$emit('loadingGo',false)
                                this.$message(
                                    {
                                        message: '账号或密码错误',
                                        type: 'warning'
                                    }
                                )
                            }
                        }
                    ]
                )
            },
            seePassword() {
                // 设置密码可见
                this.pwdType = this.pwdType == 'password' ? '' : 'password'
            }
        },
    }
</script>

<style scoped>
.login-code-img{
    height: 32px;
}
.see{
    cursor: pointer
}
</style>