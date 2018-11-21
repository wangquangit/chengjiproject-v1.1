<template>
    <avue-crud 
        :data="data" 
        :option="option"
        :table-loading="loading"
        :page="page"
        @selection-change="selectionChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @refresh-change="getInfo"
    >
        <!-- <template slot-scope="scope" slot="menu">
            右侧按钮
            <cj-main-top-button
                :buttonList="tabelButtonList"
                :data="userInfo"
            ></cj-main-top-button>
        </template> -->

        <template slot-scope="scope" slot="menuLeft">
            <!-- 顶部按钮 -->
            <cj-main-top-button
                :buttonList="buttonList"
                :data="userInfo"
                @addSubmit="addSubmit"
                @editInfo="editInfo"
                @editSubmit="editSubmit"
                @deleteForm="deleteForm"
                @getPermission="getPermission"
                @submitAddPermission="submitAddPermission"
            ></cj-main-top-button>
        </template>

    </avue-crud>
</template>

<script>
import request from '../../user_authority.js'
import cjMainTopButton from '../../shareComponents/cjmenubutton.vue'
import config from '../../config.js'
export default {
    data() {
        return {
            loading: true,
            data: [],
            page: {
                pageSizes: [10, 20, 30, 40],
                total: 0,
                currentPage: 1,
                pageSize: 10,
            },
            params: {
                // 搜索条件和排序
                orderByField: 'projectid',
                isAsc: false,
                where: [{}]
            },
            option:{
                title:'权限管理',
                selection: true,
                page:true,
                align:'center',
                menuAlign:'center',
                addBtn: false,
                delBtn: false,
                editBtn: false,
                menu: false,
                stripe: true,
                menuWidth: '300px',
                column:[
                    {label: '项目id', prop: 'projectid', sortable:true},
                    {label: '角色名称', prop: 'rolename', sortable:true},
                    {label: '角色类型', prop: 'roletypes', sortable:true},
                    {label: '公司id', prop: 'companyid', sortable:true},
                    {label: '修改时间', prop: 'modifytime', sortable:true},
                    {label: '备注', prop: 'remarks', sortable:true},
                ]
            },
            buttonList:[],
            userInfo: {
                forms: [
                    {label: '角色名称', prop: 'rolename', value: ''},
                    {label: '备注', prop: 'remarks', value: ''},
                ],
                searchWindowForm: [],
                formTitle: {
                    titleFiled: 'rolename'
                },
                permitSubmit: true,
                selectionArr: [],
                Permissions: {
                    allPermissions: [],
                    nowPermissions: [],
                }
            }
        }
    },
    methods: {
        getInfo() {
            this.loading = true
            this.getButton()
            if(this.buttonList) {
                request.requestParams(
                    [
                        '/rmsrolesss/search',
                        'post',
                        config.setParams(this.params,this.page),
                        (res) => {
                            this.data = res.data.records
                            this.loading = false
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
                    () => {this.getInfo()},
                    2000
                )
            }
        },
        getButton() {
            this.buttonList = this.$store.state.mainButtonInfo['rmsrole']
        },
        addSubmit(forms) {
            var params = config.formJson(forms)
            request.requestParams(
                [
                    '/rmsrolesss/addInfo',
                    'post',
                    params,
                    (res) => {
                        if(res.data.code == 11) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: res.data.msg
                            })
                        }
                        this.getInfo()
                    },
                    false
                ]
            )
        },
        selectionChange(value) {
            // 多选
            this.userInfo.selectionArr = value
        },
        sizeChange(value) {
            // 设置每页大小
            this.page.pageSize = value
            this.getInfo()
        },
        currentChange(value) {
            // 设置页码
            this.page.currentPage = value
            this.getInfo()
        },
        editInfo() {
            if(this.userInfo.selectionArr.length > 0) {
                this.userInfo.forms[0].value = this.userInfo.selectionArr[0].rolename
                this.userInfo.forms[1].value = this.userInfo.selectionArr[0].remarks
            }
        },
        editSubmit(forms) {
            var params = config.formJson(forms);
            params.id = this.userInfo.selectionArr[0].id
            request.requestParams(
                [
                    '/rmsrolesss/editInfo',
                    'put',
                    params,
                    (res) => {
                        this.getInfo()
                        if(res.data.code == 11) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: res.data.msg
                            })
                        }
                    },
                    false
                ]
            )
        },
        deleteForm(str) {
            var str = ''
            for(var i of this.userInfo.selectionArr) {
                str += String(i.id)+','
            }
            request.requestParams(
                [
                    '/rmsrolesss/del/'+str,
                    'delete',
                    {},
                    (res) => {
                        this.getInfo()
                        if(res.data.code == 11) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: res.data.msg
                            })
                        }
                    }
                ]
            )
        },
        getPermission() {
            // 获取权限
            request.requestParams(
                [
                    '/rmsrolesss/getPermissions',
                    'post',
                    {
                        roleId: this.userInfo.selectionArr[0].id
                    },
                    (res) => {
                        this.userInfo.Permissions.allPermissions = res.data
                    },
                    false
                ]
            )
        },
        submitAddPermission(value) {
            console.log("value:",value)
            let PermissionArrStr = value.join(',')
            request.requestParams(
                [
                    '/rmsrolesss/editPermissions',
                    'put',
                    {
                        idSet: PermissionArrStr,
                        roleId: this.userInfo.selectionArr[0].id
                    },
                    (res) => {
                        res.data.code == 11 ?
                            this.$message({message: res.data.msg, type: 'success'}) :
                            this.$message({message: res.data.msg})
                    },
                    false
                ]
            )
        }
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

</style>
