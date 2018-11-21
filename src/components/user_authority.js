/* eslint-disable no-console */
import config from './config.js'
import axios from 'axios'

var GetTokenCount = 0;//请求次数，成功重置为0

function GetToken(listener, ps) {
    GetTokenCount++;
    if (GetTokenCount == 3) {
        //失败3次后跳转到登陆页
        window.location = '/login'
        return;
    } else {
        axios.post(
            config.serverurl + '/login',
            {
                code: window.sessionStorage.getItem('code'),
                loginname: window.sessionStorage.getItem('loginname'),
                password: window.sessionStorage.getItem('password')
            },
        ).then((res) => {
            if (res.data.code > 0) {
                var token = res.data.data['token'] // 获取token
                sessionStorage.setItem('token', token) // 设置保存到本地token
                axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token')
                GetTokenCount = 0
                if (listener != null && listener != undefined) {
                    listener(ps);
                }
            } else {//失败重试
                setTimeout(
                    () => {
                        GetTokenCount++
                        GetToken(listener, ps)
                    },
                    1000
                )
            }
        }).catch((err) => {
            alert(err)
        })
    }
}
//三个参数：地址、监听函数、请求参数
export default{
    requestParams: function netHelper(args){
        var apiurl = args[0];//cotroller+action
        var methods = args[1]
        var param = args[2];//请求参数
        var listener = args[3];//监听函数
        var or = args[4]; // 判断是否为添加,添加必须为params参数名
        var type = args[5]
        // 请求数据
        var requestParams = or == false ? {
            method: methods,
            url: config.serverurl + apiurl,
            params: param
        } : {
            method: methods,
            url: config.serverurl + apiurl,
            data: param,
            responseType: type
        }
        axios(
            requestParams
        ).then((res) => {
            // eslint-disable-next-line no-console
            console.log('请求的响应:',res)
            if (res.data.code == -13){
                //token超时或无权限
                setTimeout(() => {
                    GetToken(netHelper, args)
                }, 3000);
            } else {
                //返回
                listener(res);
            }
        }).catch((error) => {
            alert('请求错误:',error)
        })
    },
}
