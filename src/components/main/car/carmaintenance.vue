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
                        { label: '车牌号', prop: 'car_no',sortable: true}, 
                        { label: '车型', prop: 'car_type_id',sortable: true}, 
                        { label: '保养日期', prop: 'maintenance_date',sortable: true, width: 170}, 
                        // { label: '维修保养公司', prop: 'maintenance_corporation',sortable: true}, 
                        // { label: '维修保养项目', prop: 'maintenance_item',sortable: true}, 
                        { label: '维修保养内容', prop: 'maintenance_content',sortable: true}, 
                        { label: '维修保养费用', prop: 'maintenance_fee',sortable: true}, 
                        { label: '下次保养日期', prop: 'next_maintenance_date',sortable: true, width: 170}, 
                        // { label: '经办人', prop: 'agent',sortable: true}, 
                        // { label: '创建人', prop: 'created_by',sortable: true}, 
                        // { label: '创建时间', prop: 'created_time',sortable: true}, 
                        // { label: '更新人', prop: 'updated_by',sortable: true}, 
                        { label: '修改时间', prop: 'updated_time',sortable: true, width: 170}, 
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
                        { label: '车牌号', prop: 'car_no', value: '', selectCarNo: true, selectArr: [/* 下拉车型列表 */]},
                        // { label: '车型编号', prop: 'car_type_id', value: ''},
                        { label: '维修保养公司', prop: 'maintenance_corporation', value: ''},
                        { label: '维修保养项目', prop: 'maintenance_item', value: ''},
                        { label: '维修保养内容', prop: 'maintenance_content', value: ''},
                        { label: '维修保养费用', prop: 'maintenance_fee', value: ''},
                        { label: '保养日期', prop: 'maintenance_date', value: '', selectDate: true},
                        { label: '下次保养日期', prop: 'next_maintenance_date', value: '', selectDate: true},
                    ],
                    searchWindowForm: [
                        { label: '车牌号', prop: 'car_no', value: '' },
                        { label: '车载设备ID', prop: 'mobile_unit_id', value: '' },
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
                    console.log("params:",params)
                    request.requestParams(
                        [
                            '/carmaintenance/search',
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
                this.buttonList = this.$store.state.mainButtonInfo['carmaintenance']
            },
            getCarInfo() {
                // 获取下拉车型
                request.requestParams(
                    [
                        '/common/getCarInfoCommon',
                        'post',
                        {},
                        (res) => {
                            console.log("CarRes:",res)
                            for(var i of this.userInfo.forms) {
                                if(i.selectCarNo) {
                                    i.selectArr = res.data
                                }
                            }
                        },
                        false
                    ]
                )
                console.log('CaerSelectForms:',this.userInfo.forms)
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
                            '/carmaintenance/isExistence',
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
                params.car_no = typeId
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
                console.log("params:", params)
                request.requestParams(
                    [
                        '/carmaintenance/addInfo',
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
                console.log("carType:", carType)
                console.log("forms:", forms)
                var params = config.formJson(forms)
                params.id = this.userInfo.selectionArr[0].id
                if(carType) {
                    params.car_no = carType
                }
                console.log("params:",params)
                request.requestParams(
                    [
                        '/carmaintenance/editInfo',
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
                            '/carmaintenance/isExistence',
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
                        '/carmaintenance/del/' + value,
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
                        '/carmaintenance/import',
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
                        '/carmaintenance/export',
                        'post',
                        params,
                        (res) => {
                            let url = window.URL.createObjectURL(res.data)
                            let link = document.createElement('a')
                            link.style.display = 'none'
                            link.href = url
                            link.setAttribute('download', 'carmaintenanceExcel.xls')
                            document.body.appendChild(link)
                            link.click()
                        },
                        true,
                        'blob'
                    ]
                )
            },
            downloadModelFile() {
                window.open('http://192.168.64.2/cj_project_file/车辆维修保养记录模板.xls')
            }
        },
        created() {
            this.getInfo()
            this.getCarInfo()
        },
        components: {
            cjMainTopButton,
        }
    }
</script>
<style lang="scss" scoped>

</style>

