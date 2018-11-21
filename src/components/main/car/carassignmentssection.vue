<template>
    <div>
        <avue-crud :data="data"
                   :option="option"
                   :table-loading="loading"
                   :page="page"
                   @refresh-change="getInfo"
                   @selection-change="selectionChange"
                   @size-change="sizeChange"
                   @sort-change="sortChange"
                   @current-change="currentChange">
            <template slot-scope="scope" slot="menuLeft">
                <cj-main-top-button :buttonList="buttonList"
                                    :data="userInfo"
                                    @addSubmit="addSubmit"
                                    @check="check"
                                    @editSubmit="editSubmit"
                                    @checkItem="check"
                                    @deleteForm="deleteForm"
                                    @showInfo="showInfo"
                                    @submitImportFile="submitImportFile"
                                    @submitSearch="submitSearch"
                                    @export="exports"
                                    @downloadModelFile="downloadModelFile"
                ></cj-main-top-button>
            </template>
        </avue-crud>
    </div>
</template>
<script>
    import request from '../../user_authority.js'
    import config from '../../config.js'
    import cjMainTopButton from '../../shareComponents/cjmenubutton.vue'
    export default {
        data() {
            return {
                loading: true,
                data: [],
                option: {
                    page: true,
                    align: 'center',
                    menuAlign: 'center',
                    menu: false,
                    addBtn: false,
                    selection: true,
                    column: [
                        // { label: 'id', prop: 'id',sortable: true}, 
                        { label: '区段名称', prop: 'segment_name',sortable: true}, 
                        { label: '区段编码', prop: 'segment_code',sortable: true}, 
                        { label: '区域', prop: 'area_name_text',sortable: true, width: 200}, 
                        // { label: '要求作业速度', prop: 'working_speed',sortable: true}, 
                        // { label: '允许车速偏差', prop: 'speed_offset',sortable: true}, 
                        // { label: '要求作业油耗', prop: 'working_oil_wear',sortable: true}, 
                        // { label: '允许油耗偏差', prop: 'oil_wear_offset',sortable: true}, 
                        // { label: '要求作业时长', prop: 'working_time',sortable: true}, 
                        // { label: '允许时长偏差', prop: 'working_time_offset',sortable: true}, 
                        { label: '要求作业开始时间', prop: 'working_start_time',sortable: true, width: 200}, 
                        { label: '允许时间偏差', prop: 'start_time_offset',sortable: true, width: 180}, 
                        // { label: '创建人', prop: 'created_by',sortable: true}, 
                        // { label: '创建时间', prop: 'created_time',sortable: true}, 
                        { label: '修改人', prop: 'updated_by',sortable: true}, 
                        { label: '修改时间', prop: 'updated_time',sortable: true, width: 200}, 
                    ]
                },
                buttonList: null,
                page: {
                    // 分页数据
                    currentPage: 1, // 当前页码
                    total: 0, // 数据总数
                    pageSizes: [10, 20, 30, 40, 50],
                    pageSize: 10
                },
                params: {
                    // 搜索条件和排序
                    orderByField: 'updated_time',
                    isAsc: false,
                    where: [{}]
                },
                userInfo: {
                    forms: [
                        { label: '区域', prop: 'area_id',value: '', selectArea: true, props: 'area_name_text'}, 
                        { label: '区段编码', prop: 'segment_code',value: ''}, 
                        { label: '区段名称', prop: 'segment_name',value: '', censor: true, prompt: '', placeholder: '此项为必填项'}, 
                        { label: '允许油耗偏差', prop: 'oil_wear_offset',value: ''}, 
                        { label: '允许车速偏差', prop: 'speed_offset',value: ''}, 
                        { label: '允许时间偏差', prop: 'start_time_offset',value: ''},  
                        { label: '允许时长偏差', prop: 'working_time_offset',value: ''}, 
                        { label: '要求作业油耗', prop: 'working_oil_wear',value: ''}, 
                        { label: '要求作业速度', prop: 'working_speed',value: ''}, 
                        { label: '要求作业时长', prop: 'working_time',value: ''}, 
                        { label: '要求作业开始时间', prop: 'working_start_time', value: '', selectDate: true},
                    ],
                    searchWindowForm: [
                        { label: '区段编码', prop: 'segment_code',value: ''}, 
                        { label: '区段名称', prop: 'segment_name',value: ''}, 
                    ],
                    selectionArr: [],
                    formTitle: {
                        idFiled: 'id',
                        titleFiled: 'segment_name' // title
                    },
                    addPermitSubmit: false, // 添加时允许直接提交
                    editPermitSubmit: true, // 修改时允许直接提交
                    getAreaCommon: [], // 区域选择
                },
            }
        },
        methods: {
            getInfo() {
                this.loading = true
                this.getButton()
                if (typeof this.buttonList == 'object') {
                    let params = config.setParams(this.params, this.page)
                    request.requestParams(
                        [
                            '/carassignmentssection/search',
                            'post',
                            params,
                            (res) => {
                                this.loading = false
                                this.data = res.data.records
                                this.page.total = res.data.total
                                if (res.data.records.length == 0) {
                                    // 当请求的数据长度为0时,修改请求参数再重新请求
                                    if (res.data.current > 1) {
                                        this.page.currentPage = res.data.current - 1
                                        this.getInfo()
                                    } else {
                                        this.page.currentPage = res.data.current
                                    }
                                } else {
                                    this.page.currentPage = res.data.current
                                }
                            },
                        ]
                    )
                } else {
                    setTimeout(() => {
                        this.getInfo()
                    }, 2000)
                }
            },
            getAreaCommon() {
                // 请求区域接口
                request.requestParams(
                    [
                        '/common/getAreaCommon',
                        'post',
                        {},
                        (res) => {
                            this.userInfo.getAreaCommon = res.data
                        }
                    ]
                )
            },
            getButton() {
                // 获取按钮
                this.buttonList = this.$store.state.mainButtonInfo['carassignmentssection']
            },
            sortChange(value) {
                // 排序
                this.params.orderByField = value.prop
                this.params.isAsc = value.order == 'ascending' ?
                    true : false
                this.getInfo()
            },
            currentChange(value) {
                // 分页
                this.page.currentPage = value
                this.getInfo()
            },
            sizeChange(value) {
                // 分页大小
                this.page.pageSize = value
                this.getInfo()
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
            addSubmit(forms, area, typeId) {
                // 添加
                let params = config.formJson(forms)
                let p = this.userInfo.forms
                for (var i of forms) {
                    if (i.selectDate) {
                        if (i.value == '') {
                            params.working_start_time = null
                        } else {
                            params.working_start_time = config.setDate(i.value)
                        }
                    }
                }
                params.area_id = area.id
                request.requestParams(
                    [
                        '/carassignmentssection/addInfo',
                        'post',
                        params,
                        (res) => {
                            res.data.code == 11 ?
                                this.$message({ message: res.data.msg, type: 'success' }) :
                                this.$message({ message: res.data.msg })
                            this.getInfo()
                        },
                        false
                    ]
                )
            },
            selectionChange(value) {
                this.userInfo.selectionArr = value
            },
            editSubmit(forms, area) {
                // 修改
                var areaid
                if (area.id) {
                    // 判断是否修改了区域
                    areaid = area.id
                } else {
                    areaid = this.userInfo.selectionArr[0].area_id
                }
                var params = config.formJson(forms)
                for (var i of forms) {
                    // 判断日期是否有修改
                    if (i.selectDate) {
                        console.log(typeof i.value)
                        if (typeof i.value == 'object') {
                            params.working_start_time = config.setDate(i.value)
                        } else {
                            params.working_start_time = i.value
                        }
                    }
                }
                params.area_id = areaid
                params.id = this.userInfo.selectionArr[0].id
                console.log("params:",params)
                request.requestParams(
                    [
                        '/carassignmentssection/editInfo',
                        'put',
                        params,
                        (res) => {
                            res.data.code == 11 ?
                                this.$message({ message: res.data.msg, type: 'success' }) :
                                this.$message({ message: res.data.msg })
                            this.getInfo()
                        },
                        false
                    ]
                )
            },
            deleteForm(value) {
                // 删除
                console.log('删除的value:',value)
                request.requestParams(
                    [
                        '/carassignmentssection/del/' + value,
                        'delete',
                        {},
                        (res) => {
                            res.data.code == 11 ?
                                this.$message({ message: res.data.msg, type: 'success' }) :
                                this.$message({ message: res.data.msg })
                            this.getInfo()
                        },
                        false
                    ]
                )
            },
            showInfo() {
                // 查看
                if (this.userInfo.selectionArr.length) {
                    for (var i of this.userInfo.forms) {
                        i.value = this.userInfo.selectionArr[0][i.prop]
                    }
                } else {
                    this.$message({ message: '请选择一个' })
                }
            },
            submitImportFile(files) {
                request.requestParams(
                    [
                        '/carassignmentssection/import',
                        'post',
                        files,
                        (res) => {
                            res.data.code == 11 ?
                                this.$message({ message: res.data.msg, type: 'success' }) :
                                this.$message({ message: res.data.msg })
                            this.getInfo()
                        },
                        true
                    ]
                )
            },
            submitSearch(forms) {
                // 搜索
                console.log('搜索的forms:',forms)
                this.params.where = [
                    {
                        name: 'segment_code',
                        op: 'like',
                        value: config.handleSearch(forms, 'segment_code')
                    },
                    {
                        name: 'segment_name',
                        op: 'eq',
                        value: config.handleSearch(forms, 'segment_name')
                    }
                ]
                this.getInfo()
            },
            exports() {
                let params = config.setParams(this.params, this.page)
                request.requestParams(
                    [
                        '/carassignmentssection/export',
                        'post',
                        params,
                        (res) => {
                            let url = window.URL.createObjectURL(res.data)
                            let link = document.createElement('a')
                            link.style.display = 'none'
                            link.href = url
                            link.setAttribute('download', 'carassignmentssectionExcel.xls')
                            document.body.appendChild(link)
                            link.click()
                        },
                        true,
                        'blob'
                    ]
                )
            },
            downloadModelFile() {
                window.open('http://192.168.64.2/cj_project_file/carassignmentssectionModelFile.xls')
            }
        },
        created() {
            this.getInfo()
            this.getAreaCommon()
        },
        components: {
            cjMainTopButton
        }
    }
</script>
<style lang="scss" scoped>

</style>

