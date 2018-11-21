<template>
    <div v-loading="loading" class="main">
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="24">
                <div class="grid-content bg-purple">
                    <cj-right-button
                        :buttonList="topButton"
                        :info="info"
                        @addSubmit="addSubmit"
                    >
                    </cj-right-button>
                </div>
            </el-col>
        </el-row>

        <avue-tree-table :option="option">
            <el-table-column label="操作" width="275px">
                <template slot-scope="scope">
                    <cj-right-button
                        :buttonList="buttonList"
                        :info="info"
                        :message="scope.row"
                        @addSubmit="addSubmit"
                        @get="get"
                        @editSubmit="editSubmit"
                        @delSubmit="delSubmit"
                    >
                    </cj-right-button>
                </template>
            </el-table-column>
        </avue-tree-table>
    </div>
</template>

<script>
import config from '../../config.js'
// import cjTableTreeButton from '../../shareComponents/cjtabletablebutton.vue'
import cjRightButton from '../../shareComponents/cjrightbutton.vue'
import request from '../../user_authority.js'
export default {
    data () {
        return {
            option: {
                // 基本配置和信息
                expandAll: true,
                columns: [
                    {
                        text: '部门',
                        value: 'department_name',
                        width: 300
                    },
                    {
                        text: '部门编号',
                        value: 'department_code'
                    },
                    {
                        text: '区域',
                        value: 'area_name_text',
                    },
                    {
                        text: '最后更新时间',
                        value: 'updated_time',
                        width: 155
                    },
                ],
                data: [],
            },
            info: {
                // 传给子组件的表单
                forms: [
                    {name:'选择区域', label: 'area_id',value: '', select: true},
                    {name:'部门名称', label: 'department_name',value: ''},
                    {name:'部门编号', label: 'department_code',value: ''},
                ],
                getAreaCommon: [], // 区域详情
                title: '部门'
            },
            buttonList: [],
            topButton: [],
            loading: false
        }
    },
    methods: {
        getInfo() {
            // 请求部门表单接口
            this.loading = true
            this.getButton()
            if(this.buttonList) {
                this.setTopButton()
                request.requestParams(
                    [
                        '/sysdepartment/getDepartment',
                        'post',
                        {},
                        (res) => {
                            this.option.data = res.data
                            this.loading = false
                        },
                    ]
                )
            } else {
                setTimeout(
                    () => {
                        this.getInfo()
                    },
                    3000
                )
            }
        },
        getArea() {
            // 请求公共接口
            request.requestParams(
                [
                    '/common/getAreaCommon',
                    'post',
                    {},
                    (res) => {
                        this.info.getAreaCommon = res.data
                    }
                ]
            )
        },
        setTopButton() {
            // 设置顶部按钮
            for(var i of this.buttonList) {
                if(i.buttonname == '添加' && this.topButton.length <= 0) {
                    this.topButton.push(i)
                }
            }
        },
        getButton() {
            // 获取按钮
            this.buttonList = this.$store.state.mainButtonInfo['department']
        },
        addSubmit(forms, message, area) {
            var params
            if(message) {
                params = {
                    area_id: area.id, // 区域ID
                    created_by: 'admin', // 创建人
                    department_code: forms.forms[2].value, // 部门编号
                    department_leavel: message.department_leavel, // 部门等级
                    department_name: forms.forms[1].value, // 部门名称
                    parent_id: message.id, // 父级id
                    updated_by: 'admin', // 修改人
                }
            } else {
                params = {
                    area_id: area.id, // 区域ID
                    created_by: 'admin', // 创建人
                    department_code: forms.forms[2].value, // 部门编号
                    department_name: forms.forms[1].value, // 部门名称
                    updated_by: 'admin', // 修改人
                }
            }
            request.requestParams(
                [
                    '/sysdepartment/addInfo',
                    'post',
                    params,
                    (res) => {
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        })
                        this.getInfo()
                    },
                    false
                ]
            )
        },
        get(message) {
            this.info.forms[0].value = message.area_name_text
            this.info.forms[1].value = message.department_name
            this.info.forms[2].value = message.department_code
        },
        editSubmit(info, message, area) {
            // 修改
            if (area.id) {
                var area_id = area.id
            } else {
                var area_id = message.area_id
            }
            var id = message.id
            var department_name = info.forms[1].value
            var department_code = info.forms[2].value
            request.requestParams(
                [
                    '/sysdepartment/editInfo',
                    'put',
                    {
                        id: id,
                        area_id: area_id,
                        department_name: department_name,
                        department_code: department_code,
                    },
                    (res) => {
                        this.getInfo()
                    },
                    false
                ]
            )
        },
        delSubmit(message) {
            request.requestParams(
                [
                    '/sysdepartment/del/'+message.id,
                    'delete',
                    {},
                    (res) => {
                        if(res.data.code == 11){
                            this.getInfo()
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'info'
                            })
                        }
                    }
                ]
            )
        }
    },
    created() {
        this.getInfo()
        this.getArea()
    },
    components: {
        cjRightButton
    },
}
</script>

<style scoped>
.grid-content {
    border-radius: 4px;
    min-height: 36px;
    float: left;
    margin: 1rem 0;
}
.main{
    padding: .5rem;
}
</style>
