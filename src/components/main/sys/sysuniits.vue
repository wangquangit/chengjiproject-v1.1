<template>
    <avue-crud 
        :option="option" 
        :data="data"
        :table-loading="loading"
        :page="page"
        @selection-change="selectionChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @refresh-change="refresh"
        @sort-change="sortChange"
    >
        <template slot-scope="scope" slot="menuLeft">
            <cj-main-top-button
                :buttonList="buttonList"
                :data="userInfo"
                @addSubmit="addSubmit"
                @editInfo="editInfo"
                @editSubmit="editSubmit"
                @deleteForm="deleteForm"
                @export="exports"
                @checkName="checkName"
                @submitSearch="submitSearch"
                @uploadPicture="uploadPicture"
            />
        </template>
        <template slot-scope="scope" slot="units_logo">
                <!-- {{scope.row.units_logo}} -->
            <img class="logoImg" :src="scope.row.units_logo" alt="">
        </template>

    </avue-crud>
</template>

<script>
import request from '../../user_authority.js'
import cjMainTopButton from '../../shareComponents/cjmenubutton.vue'
import config from '../../config.js';
import axios from 'axios';
export default {
    data() {
        return {
            loading: true,
            option:{
                selection: true,
                align:'center',
                menuAlign:'center',
                menu: false,
                addBtn: false,
                stripe: true,
                column:[
                    {label: 'logo', prop: 'units_logo', solt:true},
                    {label: '单位名称', prop: 'units_name', sortable:true,},
                    {label: '单位ID', prop: 'id', sortable:true,},
                    {label: '单位信息', prop: 'units_info', sortable:true,},
                    {label: '更新时间', prop: 'updated_time', sortable:true,},
                ]
            },
            data: [],
            buttonList: [],
            userInfo: {
                forms: [
                    {label: '单位名称', prop: 'units_name', value: '', check: null},
                    // {label: '单位编号', prop: 'units_code', value: ''},
                    {label: '单位描述', prop: 'units_info', value: ''},
                    {label: '考核方式', prop: 'evaluation_mode', value: '', select: true, selectArr: [
                        {name: '按人考核', id: 0},
                        {name: '按单位考核', id: 1},
                    ]},
                    {label: '单位logo', prop: 'units_logo', value: '', file: true},
                ],
                selectionArr: [],
                formTitle: {
                    titleFiled: 'units_name'
                },
                permitSubmit: false, // 允许直接提交
                searchWindowForm: [
                    {label: '单位名称', prop: 'units_name', value: '', check: null},
                    {label: '单位描述', prop: 'units_info', value: ''},
                ],
                addPermitSubmit: true,
                editPermitSubmit: true,
            },
            page: {
                pageSizes: [10, 20, 30, 40],
                total: 10,
                currentPage: 1,
                pageSize: 10,
            },
            sort: {
                orderByField: 'updated_time',
                isAsc: false
            },
            where: [{}],
        }
    },
    methods: {
        getInfo() {
            // 获取数据
            this.loading = true
            this.getButton()
            if(this.buttonList) {
                let params = {
                    page: this.page.currentPage,
                    limit: this.page.pageSize,
                    orderByField: this.sort.orderByField,
                    isAsc: this.sort.isAsc,
                    where: this.where,
                }
                request.requestParams(
                    [
                        '/sysuniits/search',
                        'post',
                        params,
                        (res) => {
                            this.loading = false
                            this.data = res.data.records
                            this.page.total = res.data.total
                            if(res.data.records.length == 0){
                                // 当请求的数据长度为0时,修改请求参数再重新请求
                                if(res.data.current > 1){
                                    this.page.currentPage = res.data.current - 1
                                    this.getInfo()
                                } else {
                                    this.page.currentPage = res.data.current
                                }
                            } else {
                                this.page.currentPage = res.data.current
                            }
                        }
                    ]
                )
            } else {
                setTimeout(
                    () => {
                        this.getInfo()
                    },
                    2000
                )
            }
        },
        getButton() {
            // 获取按钮
            this.buttonList = this.$store.state.mainButtonInfo['sysuniits']
        },
        addSubmit(forms) {
            // 添加,文件上传
            var params = config.formJson(forms)
            console.log('params:', params)
            request.requestParams(
                [
                    '/sysuniits/addInfo',
                    'post',
                    params,
                    (res) => {
                        if(res.data.code == 11) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            })
                            this.getInfo()
                            this.userInfo.permitSubmit = false
                        }
                    },
                    false
                ]
            )
            this.getInfo()
        },
        selectionChange(value) {
            this.userInfo.selectionArr = value
        },
        editInfo() {
            if(this.userInfo.selectionArr.length > 0) {
                this.userInfo.forms[0].value = this.userInfo.selectionArr[0].units_name
                this.userInfo.forms[1].value = this.userInfo.selectionArr[0].units_info
                this.userInfo.forms[2].value = this.userInfo.selectionArr[0].evaluation_mode
                this.userInfo.forms[3].value = this.userInfo.selectionArr[0].file
            }
        },
        checkName(item) {
            // 校验单位名是否重复
            request.requestParams(
                [
                    '/sysuniits/isExistence',
                    'post',
                    {
                        unitsName: item.value
                    },
                    (res) => {
                        this.userInfo.permitSubmit = res.data.data
                        if(!res.data.data) {
                            this.$message({
                                message: '单位名已存在',
                                type: 'error'
                            })
                        }
                    },
                    false
                ]
            )
        },
        editSubmit(value) {
            console.log("value:",value)
            request.requestParams(
                [
                    '/sysuniits/editInfo',
                    'put',
                    {
                        id: this.userInfo.selectionArr[0].id,
                        units_name: value[0].value,
                        units_info: value[1].value,
                        evaluation_mode: value[2].value,
                        units_logo: value[3].value,
                    },
                    (res) => {
                        var msgType
                        if(res.data.code == 11){
                            msgType = 'success'
                        } else {
                            msgType = 'info'
                        }
                        this.$message({
                            message: res.data.msg,
                            type: msgType
                        })
                        this.getInfo()
                    },
                    false
                ]
            )
        },
        deleteForm(value) {
            var str = ''
            for(var i of this.userInfo.selectionArr){
                str += String(i.id)+','
            }
            request.requestParams(
                [
                    '/sysuniits/del/'+str,
                    'delete',
                    {},
                    (res) => {
                        this.getInfo()
                    }
                ]
            )
        },
        exports() {
            request.requestParams(
                [
                    '/sysuniits/export',
                    'post',
                    {},
                    (res) => {
                        let url = window.URL.createObjectURL(res.data)
                        let link = document.createElement('a')
                        link.style.display = 'none'
                        link.href = url
                        link.setAttribute('download', 'excel.xls')
                        document.body.appendChild(link)
                        link.click()
                    },
                    true,
                    'blob'
                ]
            )
        },
        submitSearch(forms) {
            // 修改搜索表单
            let searchForm = [
                {
                    name: 'units_name',
                    op: 'like',
                    value: forms[0].value
                },
                {
                    name: 'units_info',
                    op: 'eq',
                    value: forms[1].value
                },
            ]
            this.page.currentPage = 1
            this.where = searchForm
            this.getInfo()
        },
        sizeChange(value) {
            // 修改分页大小
            this.page.pageSize = value
            this.getInfo()
        },
        currentChange(value) {
            // 修改页码
            this.page.currentPage = value
            this.getInfo()
        },
        refresh() {
            this.getInfo()
        },
        sortChange(value) {
            // 修改排序字段
            this.sort.orderByField = value.prop
            value.order == 'ascending' ?
                this.sort.isAsc = true :
                this.sort.isAsc = false
            this.getInfo()
        },
        uploadPicture(param, config) {
            // 图片上传
            axios.post('http://192.168.0.198:8888/sysuniits/fileUpload', param, config).then((res) => {
                console.log(res)
                for(var i of this.userInfo.forms){
                    if(i.prop == 'units_logo') {
                        // 赋值路径
                        i.value = res.data.data
                    }
                }
            }).catch((err) => {
                console.log(err)
            })
        },
    },
    created() {
        this.getInfo()
    },
    components: {
        cjMainTopButton
    }
}
</script>

<style lang="scss" scoped>
.logoImg{
    width: 30px;
    height: 30px;
}
</style>

