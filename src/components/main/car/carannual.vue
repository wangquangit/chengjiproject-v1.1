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
                                    @editSubmit="editSubmit"
                                    @deleteForm="deleteForm"
                                    @showInfo="showInfo"
                                    @submitImportFile="submitImportFile"
                                    @submitSearch="submitSearch"
                                    @export="exports"
                                    @downloadModelFile="downloadModelFile"></cj-main-top-button>
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
                        { label: '车牌号', prop: 'car_no',sortable: true}, 
                        { label: '年检日期', prop: 'annual_date',sortable: true}, 
                        { label: '车管所名称', prop: 'DMV_name',sortable: true}, 
                        // { label: '检查单位', prop: 'check_the_unit',sortable: true}, 
                        // { label: '检查内容', prop: 'check_centext',sortable: true}, 
                        // { label: '检测价格', prop: 'check_fee',sortable: true}, 
                        // { label: '车船税', prop: 'vehicle_and_vessel',sortable: true}, 
                        { label: '其他费用', prop: 'other_fee',sortable: true}, 
                        { label: '年检起始日期', prop: 'annual_start_date',sortable: true}, 
                        { label: '年检结束日期', prop: 'annual_end_date',sortable: true}, 
                        { label: '经办人', prop: 'agent',sortable: true}, 
                        { label: '修改时间', prop: 'updated_time',sortable: true}, 
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
                        { label: '车牌号', prop: 'car_no', value: '', selectCarNo: true, selectArr: []}, 
                        { label: '年检日期', prop: 'annual_date', value: '', selectDate: true}, 
                        { label: '车管所名称', prop: 'DMV_name', value: ''}, 
                        { label: '检查单位', prop: 'check_the_unit', value: ''}, 
                        { label: '检查内容', prop: 'check_centext', value: ''}, 
                        { label: '检测价格', prop: 'check_fee', value: ''}, 
                        { label: '车船税', prop: 'vehicle_and_vessel', value: ''}, 
                        { label: '其他费用', prop: 'other_fee', value: ''}, 
                        { label: '年检起始日期', prop: 'annual_start_date', value: '', selectDate: true}, 
                        { label: '年检结束日期', prop: 'annual_end_date', value: '', selectDate: true}, 
                        { label: '经办人', prop: 'agent', value: ''}, 
                    ],
                    searchWindowForm: [
                        { label: '车牌号', prop: 'car_no', value: '' },
                    ],
                    selectionArr: [],
                    formTitle: {
                        idFiled: 'id',
                        titleFiled: 'car_no'
                    },
                    addPermitSubmit: true, // 添加时允许直接提交
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
                            '/carannual/search',
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
            getCarInfo() {
                // 获取下拉车型
                request.requestParams(
                    [
                        '/common/getCarInfoCommon',
                        'post',
                        {},
                        (res) => {
                            for(var i of this.userInfo.forms) {
                                if(i.selectCarNo) {
                                    i.selectArr = res.data
                                }
                            }
                        },
                        false
                    ]
                )
            },
            getButton() {
                // 获取按钮
                this.buttonList = this.$store.state.mainButtonInfo['carannual']
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
            addSubmit(forms, area, typeId) {
                let params = config.formJson(forms)
                let p = this.userInfo.forms
                for (var i in forms) {
                    if (forms[i].selectDate) {
                        if (forms[i].value == '') {
                            params[forms[i].prop] = null
                        } else {
                            params[forms[i].prop] = config.setDate(forms[i].value)
                        }
                    }
                }
                params.car_no = typeId
                console.log("params:", params)
                request.requestParams(
                    [
                        '/carannual/addInfo',
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
            editSubmit(forms, area, carType) {
                // 修改
                var params = config.formJson(forms)
                params.id = this.userInfo.selectionArr[0].id
                for(var i in forms) {
                    if(forms[i].selectDate) {
                        if(typeof forms[i].value == 'object') {
                            params[forms[i].prop] = config.setDate(forms[i].value)
                        }
                    }
                }
                if(carType) {
                    params.car_no = carType
                } else {
                    params.car_no = this.userInfo.selectionArr[0].car_no
                }
                console.log("params:", params)
                request.requestParams(
                    [
                        '/carannual/editInfo',
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
                request.requestParams(
                    [
                        '/carannual/del/' + value,
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
                        '/carannual/import',
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
                this.params.where = [
                    {
                        name: 'car_no',
                        op: 'like',
                        value: config.handleSearch(forms, 'car_no')
                    },
                    {
                        name: 'mobile_unit_id',
                        op: 'eq',
                        value: config.handleSearch(forms, 'mobile_unit_id')
                    }
                ]
                this.getInfo()
            },
            exports() {
                let params = config.setParams(this.params, this.page)
                request.requestParams(
                    [
                        '/carannual/export',
                        'post',
                        params,
                        (res) => {
                            let url = window.URL.createObjectURL(res.data)
                            let link = document.createElement('a')
                            link.style.display = 'none'
                            link.href = url
                            link.setAttribute('download', 'carannualExcel.xls')
                            document.body.appendChild(link)
                            link.click()
                        },
                        true,
                        'blob'
                    ]
                )
            },
            downloadModelFile() {
                window.open('http://192.168.64.2/cj_project_file/车俩年检记录模板.xls')
            }
        },
        created() {
            this.getInfo()
            this.getCarInfo()
        },
        components: {
            cjMainTopButton
        }
    }
</script>
<style lang="scss" scoped>

</style>

