/* eslint-disable no-console */

export default{
    // serverurl: 'http://192.168.0.154:8888', 
    serverurl: 'http://192.168.0.198:8888', 
    // serverurl: 'http://119.23.8.181:8888', // 云服务器

    formFunc: function (forms,key) {
        for (var i = 0; i < forms.length; i++) {
            if (forms[i].prop == key) {
                return forms[i].value;
            }
        }
    },

    formJson: function (forms) {
        var obj = {};
        for (var i = 0; i < forms.length; i++) {
            obj[forms[i].prop] = forms[i].value;
        }
        return obj
    },

    setParams: function (params, page) {
        return {
            page: page.currentPage,
            limit: page.pageSize,
            orderByField: params.orderByField,
            isAsc: params.isAsc,
            where: params.where
        }
    },
    setDate: function (date) {
        if(date == '') {
            return null
        } else {
            var o = {
                "Y" : date.getFullYear(),              // 年
                "M" : date.getMonth(),                 //月份   
                "D" : date.getDate(),                    //日   
                "H" : date.getHours(),                   //小时   
                "m" : date.getMinutes(),                 //分   
                "S" : date.getSeconds(),                 //秒   
            }
            return o['Y'] + '/' + o['M'] + '/' + o['D'] + ' ' + o['H'] + ':' + o['m'] + ':' + o['S']
        }
    },
    setButton: function(forms) {
        for(var i of forms) {
            if(i.censor) {
                if (i.prompt != '') {
                    return false
                }
            }
        }
        return true
    },
    handleSearch: function(forms, str) {
        for(var i of forms) {
            if(i.prop == str) {
                return i.value
            }
        }
    },
    setPrompt: function(forms) {
        for(var i of forms) {
            if(i.censor) {
                i.prompt = ''
            }
        }
    },
}