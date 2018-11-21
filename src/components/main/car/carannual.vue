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
                                    @checkItem="checkItem"
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
                        { label: 'id', prop: 'id',sortable: true}, 
                        { label: '年检日期', prop: 'annual_date',sortable: true}, 
                        { label: '车牌号', prop: 'car_no',sortable: true}, 
                        { label: '车型ID', prop: 'car_type_id',sortable: true}, 
                        { label: '车管所名称', prop: 'DMV_name',sortable: true}, 
                        { label: '检查单位', prop: 'check_the_unit',sortable: true}, 
                        { label: '检查内容', prop: 'check_centext',sortable: true}, 
                        { label: '检测价格', prop: 'check_fee',sortable: true}, 
                        { label: '车船税', prop: 'vehicle_and_vessel',sortable: true}, 
                        { label: '其他费用', prop: 'other_fee',sortable: true}, 
                        { label: '年检起始日期', prop: 'annual_start_date',sortable: true}, 
                        { label: '年检结束日期', prop: 'annual_end_date',sortable: true}, 
                        { label: '经办人', prop: 'agent',sortable: true}, 
                        { label: '创建人', prop: 'created_by',sortable: true}, 
                        { label: '创建时间', prop: 'created_time',sortable: true}, 
                        { label: '修改人', prop: 'updated_by',sortable: true}, 
                        { label: '修改时间', prop: 'updated_time',sortable: true}, 
                        { label: '是否删除', prop: 'del_flag',sortable: true},
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
                        { label: 'id', prop: 'id', value: ''}, 
                        { label: '年检日期', prop: 'annual_date', value: ''}, 
                        { label: '车牌号', prop: 'car_no', value: ''}, 
                        { label: '车型ID', prop: 'car_type_id', value: ''}, 
                        { label: '车管所名称', prop: 'DMV_name', value: ''}, 
                        { label: '检查单位', prop: 'check_the_unit', value: ''}, 
                        { label: '检查内容', prop: 'check_centext', value: ''}, 
                        { label: '检测价格', prop: 'check_fee', value: ''}, 
                        { label: '车船税', prop: 'vehicle_and_vessel', value: ''}, 
                        { label: '其他费用', prop: 'other_fee', value: ''}, 
                        { label: '年检起始日期', prop: 'annual_start_date', value: ''}, 
                        { label: '年检结束日期', prop: 'annual_end_date', value: ''}, 
                        { label: '经办人', prop: 'agent', value: ''}, 
                        { label: '创建人', prop: 'created_by', value: ''}, 
                        { label: '创建时间', prop: 'created_time', value: ''}, 
                        { label: '修改人', prop: 'updated_by', value: ''}, 
                        { label: '修改时间', prop: 'updated_time', value: ''}, 
                        { label: '是否删除', prop: 'del_flag', value: ''},
                    ],
                    searchWindowForm: [
                        { label: '车牌号', prop: 'car_no', value: '' },
                        { label: '车载设备ID', prop: 'mobile_unit_id', value: '' },
                    ],
                    selectionArr: [],
                    formTitle: {
                        idFiled: 'id',
                        titleFiled: 'titlename'
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
            check(item) {
                // 检测重复
                if (item.value != '') {
                    let params
                    if (item.prop == "car_no") {
                        // 教研车牌号
                        params = { carNo: item.value }
                    } else if (item.prop == "mobile_unit_id") {
                        // 校验车载设备ID
                        params = { mobileUnitId: item.value }
                    }
                    request.requestParams(
                        [
                            '/carannual/isExistence',
                            'post',
                            params,
                            (res) => {
                                if (res.data.code == -11) {
                                    for (var i of this.userInfo.forms) {
                                        if (i.prop == item.prop) {
                                            i.prompt = i.label + '存在重复'
                                            this.userInfo.addPermitSubmit = false
                                        } else {
                                            i.prompt = ''
                                        }
                                    }
                                } else {
                                    for (var i of this.userInfo.forms) {
                                        i.prompt = ''
                                    }
                                }
                            },
                            false
                        ]
                    )
                } else {
                    for (var i of this.userInfo.forms) {
                        if (i.prop == item.prop) {
                            i.prompt = i.label + '不允许为空!!'
                            this.userInfo.addPermitSubmit = false
                        }
                    }
                }
                this.userInfo.addPermitSubmit = config.setButton(this.userInfo.forms) // 设置允许提交
            },
            addSubmit(forms, area, typeId) {
                let params = config.formJson(forms)
                let p = this.userInfo.forms
                for (var i of forms) {
                    if (i.selectDate) {
                        if (i.value == '') {
                            params.annual_end_date = null
                        } else {
                            params.annual_end_date = config.setDate(forms[7].value)
                        }
                    }
                }
                params.area_id = area.id
                params.car_type_id = typeId
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
                var areaid
                var cartypeid
                if (carType) {
                    cartypeid = carType
                } else {
                    cartypeid = this.userInfo.selectionArr[0].car_type_id
                }
                if (area.id) {
                    // 判断是否修改了区域
                    areaid = area.id
                } else {
                    areaid = this.userInfo.selectionArr[0].area_id
                }
                var params = config.formJson(forms)
                params.area_id = areaid
                params.car_type_id = cartypeid
                params.id = this.userInfo.selectionArr[0].id
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
            checkItem(item) {
                // 检测重复
                this.userInfo.editPermitSubmit = true
                if (item.value != '') {
                    let params
                    if (item.prop == "car_no") {
                        params = { carNo: item.value }
                    } else if (item.prop == "mobile_unit_id") {
                        params = { mobileUnitId: item.value }
                    }
                    request.requestParams(
                        [
                            '/carannual/isExistence',
                            'post',
                            params,
                            (res) => {
                                if (res.data.code == -11) {
                                    for (var i of this.userInfo.forms) {
                                        if (i.prop == item.prop) {
                                            i.prompt = item.label + '存在重复'
                                        } else {
                                            i.prompt = ''
                                        }
                                    }
                                } else {
                                    for (var i of this.userInfo.forms) {
                                        if (i.prop == item.prop) {
                                            i.prompt = ''
                                        }
                                    }
                                }
                            },
                            false
                        ]
                    )
                    this.userInfo.editPermitSubmit = config.setButton(this.userInfo.forms)
                }
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
                window.open('http://192.168.64.2/cj_project_file/carannualModelFile.xls')
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

