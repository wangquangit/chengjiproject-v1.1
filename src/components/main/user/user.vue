<template>
    <avue-crud
        :data="data"
        :option="option"
        :table-loading="loading"
        :page="page"
        @size-change="sizeChange"
        @current-change="currentChange" 
        @refresh-change="refresh"
        @selection-change="selectionChange"
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
                @submitSearch="submitSearch"
                @showInfo="showInfo"
                @restore="restore"
            ></cj-main-top-button>
        </template>
    </avue-crud>
</template>

<script>
import config from '../../config.js'
import cjMainTopButton from '../../shareComponents/cjmenubutton.vue'
import request from '../../user_authority.js'
export default {
    data() {
        return {
            userInfo: {
                forms: [
                    // {label: 'id', prop: 'id', value: ''},
                    {label: '用户名', prop: 'loginname', value: ''},
                    {label: '手机号', prop: 'phone', value: ''},
                    {label: '密码', prop: 'password', value: ''},
                ],
                selectionArr: [], // 选中列表项
                formTitle: {
                    idFiled: 'id',
                    titleFiled: 'loginname' // 修改弹出层的title
                },
                addPermitSubmit: true,
                editPermitSubmit: true,
                searchWindowForm: [
                    {label: '用户名', prop: 'loginname', value: ''},
                    {label: '手机号', prop: 'phone', value: ''},
                ]
            },
            buttonList: [],
            data: [],
            option: {
                align: 'center',
                menuAlign: 'center',
                selection: true,
                addBtn: false,
                delBtn: false,
                menu: false,
                stripe: true,
                column: [
                    {label: '用户名', prop: 'loginname',sortable:true,},
                    {label: '手机号', prop: 'phone',sortable:true,},
                    {label: 'ID', prop: 'id'},
                    {label: '最后修改时间', prop: 'modifytime',sortable:true,},
                ]
            },
            loading: false,
            page: {
                // 分页数据
                currentPage: 1, // 当前页码
                total: 0, // 数据总数
                pageSizes: [10, 20, 30, 40, 50],
                pageSize: 10
            },
            sort: {
                orderByField: 'modifytime',
                isAsc: false
            },
            where: [{}]
        }
    },
    methods: {
        getInfo() {
            let params = {
                page: this.page.currentPage,
                limit: this.page.pageSize,
                orderByField: this.sort.orderByField,
                isAsc: this.sort.isAsc,
                where: this.where,
            }
            this.loading = true
            request.requestParams(
                [
                    '/user/search',
                    'post',
                    params,
                    (res) => {
                        this.getButton()
                        if(this.buttonList) {
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
                        } else {
                            this.getInfo()
                        }
                    },
                ]
            )
        },
        getButton() {
            this.buttonList = this.$store.state.mainButtonInfo['user']
        },
        sizeChange(value) {
            // 修改页面数据大小
            this.page.pageSize = value
            this.getInfo()
        },
        currentChange(value) {
            this.page.currentPage = value
            this.getInfo()
        },
        refresh() {
            // 数据刷新
            this.getInfo()
        },
        addSubmit(forms) {
            var params = config.formJson(forms);
            request.requestParams(
                [
                    '/user/addInfo',
                    'post',
                    params,
                    (res) => {
                        if(res.data.code == 11) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            })
                        }
                        this.getInfo()
                        this.emptyForms()
                    },
                    false
                ]
            )
        },
        emptyForms() {
            // 清空表单value值
            for(var item of this.userInfo.selectionArr){
                item.value = ''
            }
        },
        editInfo() {
            // 更新当前forms表单
            if(this.userInfo.selectionArr.length > 0){
                for (var i = 0; i < this.userInfo.forms.length; i++) {
                    this.userInfo.forms[i].value = this.userInfo.selectionArr[0][this.userInfo.forms[i].prop];
                }
            } else {
                this.$message({message:'请选择需要修改的项'})
            }
        },
        editSubmit(value) {
            // 修改提交
            var params = config.formJson(value);
            params.id = this.userInfo.selectionArr[0].id;
            request.requestParams(
                [
                    '/user/editInfo',
                    'put',
                    params,
                    (res) => {
                        this.$message({message: res.data.msg, type: 'success'})
                        this.getInfo()
                        this.emptyForms()
                    },
                    false
                ]
            )
        },
        deleteForm(value) {
            request.requestParams(
                [
                    '/user/del/'+value,
                    'delete',
                    {},
                    (res) => {
                        this.getInfo()
                        this.$message(
                            {
                                message: res.data.msg,
                                type: 'success'
                            }
                        )
                    },
                    false
                ]
            )
        },
        submitSearch(value) {
            // 搜索表单提交
            let searchForm = [
                {
                    name: 'truename|loginname',
                    op: 'like',
                    value: value[0].value
                },
                {
                    name: 'phone',
                    op: 'eq',
                    value: value[1].value
                }
            ]
            this.page.currentPage = 1
            this.where = searchForm
            this.getInfo()
        },
        showInfo() {
            let arr = this.userInfo.selectionArr
            if(arr.length > 0){
                this.userInfo.forms = [
                    {label: '公司ID', prop: 'companyid', value: arr[0].companyid},
                    {label: '创建时间', prop: 'createtime', value: arr[0].createtime},
                    {label: '部门ID', prop: 'departmentid', value: arr[0].departmentid},
                    {label: '登陆名', prop: 'loginname', value: arr[0].loginname},
                    {label: '最后修改时间', prop: 'modifytime', value: arr[0].modifytime},
                    {label: '密码', prop: 'password', value: arr[0].password},
                    {label: '电话', prop: 'phone', value: arr[0].phone},
                    {label: '用户类型', prop: 'usertype', value: arr[0].usertype},
                ]
            } else {
                this.$message({message: '请选择一个'})
            }
        },
        selectionChange(value) {
            // 多选列表
            this.userInfo.selectionArr = value
        },
        restore() {
            // 还原状态
            this.userInfo.forms = [
                {label: 'id', prop: 'id', value: ''},
                {label: '用户名', prop: 'loginname', value: ''},
                {label: '手机号', prop: 'phone', value: ''},
                {label: '密码', prop: 'password', value: ''},
            ]
            
        },
        sortChange(value) {
            this.sort.orderByField = value.prop
            value.order == 'ascending' ?
                this.sort.isAsc = true :
                this.sort.isAsc = false
            this.getInfo()
        },
    },
    created() {
        this.getInfo()
    },
    components: {
        cjMainTopButton
    },
}
</script>

<style scoped>
</style>