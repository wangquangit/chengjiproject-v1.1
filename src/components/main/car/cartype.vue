<template>
    <div>
        <avue-crud 
            :data="data" 
            :option="option"
            :table-loading="loading"
            :page="page"
            @selection-change="selectionChange"
            @size-change="sizeChange"
            @current-change="currentChange"
            @refresh-change="getInfo"
            @sort-change="sortChange"
        >
            <template slot-scope="scope" slot="menuLeft">
                <cj-main-top-button
                    :buttonList="buttonList"
                    :data="userInfo"
                    @addSubmit="addSubmit"
                    @editSubmit="editSubmit"
                    @deleteForm="deleteForm"
                    @showInfo="showInfo"
                    @submitSearch="submitSearch"
                    @export="exports"
                    @submitImportFile="submitImportFile"
                    @check="check"
                    @closePermit="closePermit"
                    @downloadModelFile="downloadModelFile"
                ></cj-main-top-button>
            </template>
        </avue-crud>
    </div>
</template>

<script>
import request from '../../user_authority.js'
import cjMainTopButton from '../../shareComponents/cjmenubutton.vue'
import config from '../../config.js'
export default {
    data() {
        return {
            loading: false,
            data: [],
            option: {
                align:'center',
                menuAlign:'center',
                menu: false,
                addBtn: false,
                selection: true,
                column: [
                    {label: '车型名称', prop: 'car_name', sortable:true},
                    {label: '车型编号', prop: 'car_type_id', sortable:true},
                    {label: '备注', prop: 'message', sortable:true},
                    {label: '非工作时限速', prop: 'unwork_speed_limit', sortable:true},
                    {label: '工作时限速', prop: 'work_speed_limit', sortable:true},
                    {label: '最后修改时间', prop: 'updated_time', sortable:true},
                ]
            },
            buttonList: [],
            userInfo: {
                forms: [
                    {label: '车型名称', prop: 'car_name', value: '', censor: true, prompt: ''},
                    {label: '车型编号', prop: 'car_type_id', value: '', censor: true, prompt: ''},
                    {label: '备注', prop: 'message', value: ''},
                    {label: '非工作时限速', prop: 'unwork_speed_limit', value: ''},
                    {label: '工作时限速', prop: 'work_speed_limit', value: ''},
                ],
                selectionArr: [],
                formTitle: {
                    idFiled: 'id',
                    titleFiled: 'car_name'
                },
                addPermitSubmit: false, // 添加时允许直接提交
                editPermitSubmit: true, // 修改时允许直接提交
                searchWindowForm: [
                    {label: '车型名称', prop: 'car_name', value: ''},
                    {label: '车型编号', prop: 'car_type_id', value: ''},
                ]
            },
            page: {
                // 分页数据
                currentPage: 1, // 当前页码
                total: 0, // 数据总数
                pageSizes: [10, 20, 30, 40, 50],
                pageSize: 10
            },
            params: {
                // 搜索条件和排序
                orderByField: 'car_type_id',
                isAsc: false,
                where: [{}]
            },
        }
    },
    methods: {
        sizeChange(value) {
            // 每页大小
            this.page.pageSize = value
            this.getInfo()
        },
        currentChange(value) {
            this.page.currentPage = value
            this.getInfo()
        },
        sortChange(value) {
            this.params.orderByField = value.prop
            this.params.isAsc = value.order == 'ascending' ?
                true : false
            this.getInfo()
        },
        getInfo() {
            this.loading = true
            this.getButton()
            let params = config.setParams(this.params, this.page)
            if(this.buttonList) {
                request.requestParams(
                    [
                        '/cartype/search',
                        'post',
                        params,
                        (res) => {
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
                            this.loading = false
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
            this.buttonList = this.$store.state.mainButtonInfo['cartype']
        },
        addSubmit(value) {
            let params = config.formJson(value)
            request.requestParams(
                [
                    '/cartype/addInfo',
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
                        this.userInfo.addPermitSubmit = false
                        this.getInfo()
                    },
                    false
                ]
            )
        },
        selectionChange(value) {
            this.userInfo.selectionArr = value
        },
        editSubmit(forms) {
            let params = config.formJson(forms)
            params.id = this.userInfo.selectionArr[0].id
            request.requestParams(
                [
                    '/cartype/editInfo',
                    'put',
                    params,
                    (res) => {
                        res.data.code == 11 ?
                            this.$message({message: res.data.msg, type: 'success'}) :
                            this.$message({message: res.data.msg}) 
                        this.getInfo()
                    },
                    false
                ]
            )
            this.userInfo.editPermitSubmit = true  // 添加时允许直接提交
        },
        deleteForm(value) {
            request.requestParams(
                [
                    '/cartype/del/'+value,
                    'delete',
                    {},
                    (res) => {
                        res.data.code == 11 ?
                            this.$message({message: res.data.msg, type: 'success'}) :
                            this.$message({message: res.data.msg})
                        this.getInfo()
                    },
                    false
                ]
            )
        },
        showInfo() {
            let arr = this.userInfo.selectionArr
            if(arr.length > 0) {
                for(var i of this.userInfo.forms) {
                    i.value = arr[0][i.prop]
                }
            }
        },
        submitSearch(value) {
            // 搜索
            this.loading = true
            this.params.where = [
                {
                    name: 'car_name',
                    op: 'like',
                    value: value[0].value
                },
                {
                    name: 'car_type_id',
                    op: 'eq',
                    value: value[1].value
                }
            ]
            this.getInfo()
        },
        exports() {
            // 导出
            let params = config.setParams(this.params, this.page)
            request.requestParams(
                [
                    '/cartype/export',
                    'post',
                    params,
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
        submitImportFile(files) {
            request.requestParams(
                [
                    '/cartype/import',
                    'post',
                    files,
                    (res) => {
                        res.data.code == 11 ?
                            this.$message({message: res.data.msg, type: 'success'}) :
                            this.$message({message: res.data.msg})
                        this.getInfo()
                    },
                    true
                ]
            )
        },
        check(item) {
            // 检测重复
            config.setPrompt(this.userInfo.forms) // 检测前先设置为空
            if (item.value != '') {
                let params = {segmentName: item.value}
                request.requestParams(
                    [
                        '/carassignmentssection/isExistence',
                        'post',
                        params,
                        (res) => {
                            if (res.data.code == -11) {
                                for (var i of this.userInfo.forms) {
                                    if (i.prop == item.prop) {
                                        i.prompt = i.label + '存在重复'
                                    }
                                }
                            } else {
                                for (var i of this.userInfo.forms) {
                                    if(i.prop == item.prop) {
                                        i.prompt = ''
                                    }
                                }
                            }
                            this.userInfo.addPermitSubmit = config.setButton(this.userInfo.forms) // 设置按钮状态
                            this.userInfo.editPermitSubmit = config.setButton(this.userInfo.forms) // 设置按钮状态
                        },
                        false
                    ]
                )
            } else {
                for (var i of this.userInfo.forms) {
                    if (i.prop == item.prop) {
                        i.prompt = i.label + '不允许为空!!'
                    }
                }
            }
            this.userInfo.addPermitSubmit = config.setButton(this.userInfo.forms) // 设置按钮状态
            this.userInfo.editPermitSubmit = config.setButton(this.userInfo.forms)
        },
        closePermit() {
            for(var i of this.userInfo.forms) {
                i.prompt = ''
            }
        },
        downloadModelFile() {
            window.open('http://192.168.64.2/cj_project_file/车辆类型模版.xls')
        }
    },
    created() {
        this.getInfo()
    },
    components: {
        cjMainTopButton,
    },
}
</script>

<style scoped>

</style>

