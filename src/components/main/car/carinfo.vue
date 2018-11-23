<template>
    <div>
        <avue-crud 
            :data="data" 
            :option="option"
            :table-loading="loading"
            :page="page"
            @refresh-change="getInfo"
            @selection-change="selectionChange"
            @size-change="sizeChange"
            @sort-change="sortChange"
            @current-change="currentChange"
            @row-click="getSelectItemInfo"
        >
            <template slot-scope="scope" slot="menuLeft">
                <cj-main-top-button
                    :buttonList="buttonList"
                    :data="userInfo"
                    @addSubmit="addSubmit"
                    @check="check"
                    @editSubmit="editSubmit"
                    @deleteForm="deleteForm"
                    @showInfo="showInfo"
                    @submitImportFile="submitImportFile"
                    @submitSearch="submitSearch"
                    @export="exports"
                    @downloadModelFile="downloadModelFile"
                ></cj-main-top-button>
            </template>
        </avue-crud>

        <avue-crud
            :data="itemData"
            :option="itemOption"
        >
            <template slot-scope="scope" slot="menuLeft">
                <el-button 
                    icon="el-icon-plus" 
                    type="success" 
                    size="small"
                    @click="addSectionInfo"
                >
                    添加作业区段
                </el-button>
            </template>

            <template slot-scope="scope" slot="menu">
                <el-button
                    icon="el-icon-delete"
                    size="small"
                    type="danger"
                    @click="delItemArea(scope.row)"
                >
                    删除
                </el-button>
            </template>
        </avue-crud>

        <el-dialog :title="'给'+selectItem.car_no+'添加作业区段'" :visible.sync="addSectionWindow">
            <el-select @change="handleSelectArea" v-model="selectAreaValue" placeholder="请选择">
                <el-option
                    v-for="(item, index) in selectAreaInfo"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>

            <div slot="footer" class="dialog-footer">
                <el-button @click="addSectionWindow = false">取消</el-button>
                <el-button type="primary" @click="submitSelectArea">确定</el-button>
            </div>
        </el-dialog>
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
            setModifyWorkArea: false,
            data: [],
            itemData: [],
            itemOption: {
                align:'center',
                menuAlign:'center',
                addBtn: false,
                refreshBtn: false,
                columnBtn: false,
                page: false,
                editBtn: false,
                delBtn: false,
                column: [
                    {label: '区段名称', prop: 'segment_name'},
                    {label: '区段编码', prop: 'segment_code'}
                ]
            },
            selectInfo: [
                {label: '区段名称', prop: 'segment_name', value: ''}
            ],
            selectAreaInfo: [/* 获取下拉区域选择 */],
            selectItem: {}, // 区段选择行操作赋值
            selectAreaValue: '',
            addSectionWindow: false,
            option: {
                highlightCurrentRow:true,
                page: true,
                align:'center',
                menuAlign:'center',
                delBtn: false,
                editBtn: false,
                addBtn: false,
                menu: false,
                selection: true,
                menuWidth: 150,
                column:[
                    {label: '车牌号',prop: 'car_no', sortable:true},
                    {label: '车载设备ID',prop: 'mobile_unit_id', sortable:true},
                    {label: '区域',prop: 'area_name_text', sortable:true},
                    {label: '车辆类型',prop: 'car_type_name', sortable:true},
                    {label: '车辆颜色',prop: 'car_color', sortable:true},
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
                orderByField: 'car_no',
                isAsc: false,
                where: [{}]
            },
            userInfo: {
                forms: [
                    {label: '车牌号', prop: 'car_no', value: '', prompt: '', censor: true},
                    {label: '车载设备ID', prop: 'mobile_unit_id', value: '', prompt: '', censor: true},
                    {label: '车辆类型', prop: 'car_type_id', value: '',select: true, selectArr: [/* 下拉车型列表 */]},
                    {label: '车辆颜色', prop: 'car_color', value: ''},
                    {label: '车辆排量', prop: 'car_displacement', value: ''},
                    {label: '车辆编号', prop: 'car_id', value: ''},
                    {label: '已行驶里程', prop: 'already_km', value: ''},
                    {label: '年检到期日期', prop: 'annual_end_date', value: '', selectDate: true},
                    {label: '区域', prop: 'area_id', value: '', selectArea: true, props: 'area_name_text'},
                ],
                searchWindowForm: [
                    {label: '车牌号', prop: 'car_no', value: ''},
                    {label: '车载设备ID', prop: 'mobile_unit_id', value: ''},
                ],
                selectionArr: [],
                formTitle: {
                    idFiled: 'id',
                    titleFiled: 'car_no'
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
            if(typeof this.buttonList == 'object') {
                let params = config.setParams(this.params, this.page)
                request.requestParams(
                    [
                        '/carinfo/search',
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
            this.buttonList = this.$store.state.mainButtonInfo['carinfo']
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
        getCarTypeCommon() {
            // 获取下拉车型
            request.requestParams(
                [
                    '/common/getCarTypeCommon',
                    'post',
                    {},
                    (res) => {
                        for(var i of this.userInfo.forms) {
                            if(i.select) {
                                i.selectArr = res.data
                            }
                        }
                    }
                ]
            )
        },
        getSelectAreaInfo() {
            // 获取区段信息
            request.requestParams(
                [
                    '/common/getAssignments',
                    'post',
                    {},
                    (res) => {
                        this.selectAreaInfo = res.data
                    }
                ]
            )
        },
        check(item) {
            // 检测重复
            config.setPrompt(this.userInfo.forms) // 检测前先设置为空
            var params
            if (item.value != '') {
                if(item.prop == 'car_no') {
                    params = {carNo: item.value}
                } else if (item.prop == 'mobile_unit_id') {
                    params = {mobileUnitId: item.value}
                }
                request.requestParams(
                    [
                        '/carinfo/isExistence',
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
            let params = config.formJson(forms)
            let p = this.userInfo.forms
            for(var i of forms) {
                if(i.selectDate) {
                    if(i.value == '') {
                        params.annual_end_date = null
                    } else {
                        params.annual_end_date = config.setDate(forms[7].value)
                    }
                }
            }
            params.area_id = area.id
            params.car_type_id = typeId
            request.requestParams(
                [
                    '/carinfo/addInfo',
                    'post',
                    params,
                    (res) => {
                        res.data.code == 11 ?
                            this.$message({message: res.data.msg, type: 'success'}) : 
                            this.$message({message: res.data.msg})
                        this.getInfo()
                        this.userInfo.addPermitSubmit = false
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
            if(carType) {
                cartypeid = carType
            } else {
                cartypeid = this.userInfo.selectionArr[0].car_type_id
            }
            if(area.id) {
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
                    '/carinfo/editInfo',
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
        },
        deleteForm(value) {
            // 删除
            request.requestParams(
                [
                    '/carinfo/del/' + value,
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
            // 查看
            if(this.userInfo.selectionArr.length) {
                for(var i of this.userInfo.forms) {
                    i.value = this.userInfo.selectionArr[0][i.prop]
                }
            } else {
                this.$message({message: '请选择一个'})
            }
        },
        submitImportFile(files) {
            request.requestParams(
                [
                    '/carinfo/import',
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
                    '/carinfo/export',
                    'post',
                    params,
                    (res) => {
                        let url = window.URL.createObjectURL(res.data)
                        let link = document.createElement('a')
                        link.style.display = 'none'
                        link.href = url
                        link.setAttribute('download', 'carInfoExcel.xls')
                        document.body.appendChild(link)
                        link.click()
                    },
                    true,
                    'blob'
                ]
            )
        },
        downloadModelFile() {
            // 下载
            window.open('http://192.168.64.2/cj_project_file/车辆信息模版.xls')
        },
        getSelectItemInfo(item) {
            // 获取区段信息
            if(item) {
                this.selectItem = item
            }
            request.requestParams(
                [
                    '/carassignmentsrelation/getVCarAssignments',
                    'post',
                    {
                        carInfoId: this.selectItem.id
                    },
                    (res) => {
                        res.data.code == 11 ?
                            this.$message({message: '共有'+res.data.data.length+'条数据', type: 'success'}) :
                            this.$message({message: res.data.msg})
                        this.itemData = res.data.data
                    },
                    false
                ]
            )
        },
        addSectionInfo() {
            // 添加区段信息
            if(this.selectItem.id) {
                this.addSectionWindow = true
            }
        },
        handleSelectArea(value) {
            // 区段下拉选择
            this.selectAreaValue = value
        },
        submitSelectArea() {
            // 提交区域选择
            let params = {assignments_id: this.selectAreaValue, car_info_id: this.selectItem.id}
            request.requestParams(
                [
                    '/carassignmentsrelation/addInfo',
                    'post',
                    params,
                    (res) => {
                        res.data.code == 11 ?
                            this.$message({message: res.data.msg, type: 'success'}) :
                            this.$message({message: res.data.msg})
                        this.getSelectItemInfo()
                        this.addSectionWindow = false
                    },
                    false
                ]
            )
        },
        delItemArea(value) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                request.requestParams(
                    [
                        '/carassignmentsrelation/del/' + value.id,
                        'delete',
                        {},
                        (res) => {
                            res.data.code == 11 ?
                                this.$message({message: res.data.msg, type: 'success'}) :
                                this.$message({message: res.data.msg})
                            this.getSelectItemInfo()
                        },
                        false
                    ]
                )
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    },
    created() {
        this.getInfo()
        this.getAreaCommon()
        this.getCarTypeCommon()
        this.getSelectAreaInfo()
    },
    components: {
        cjMainTopButton,
    }
}
</script>

<style lang="scss" scoped>

</style>
