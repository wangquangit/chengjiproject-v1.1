<template>
    <div v-loading="loading" class="main">
        <el-row type="flex" justify="space-between">
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
                    <!-- 右侧按钮 -->
                    <cj-right-button
                        :buttonList="buttonList"
                        :info="info"
                        :message="scope.row"
                        @addSubmit="addSubmit"
                        @delSubmit="delSubmit"
                        @get="get"
                        @editSubmit="editSubmit"
                    ></cj-right-button>
                    <!-- addSubmit: 提交添加表单 -->
                </template>
            </el-table-column>
        </avue-tree-table>
    </div>
</template>

<script>
import request from '../../user_authority.js'
import cjRightButton from '../../shareComponents/cjrightbutton.vue'
import config from '../../config.js'
export default {
    data() {
        return {
            msg: 'this is sysarea views',
            loading: false,
            option: {
                // 基本配置和信息
                expandAll: true,
                columns: [
                    {
                        text: '区域名称',
                        value: 'area_name',
                        width: 300
                    },
                    {
                        text: '区域编号',
                        value: 'area_code'
                    },
                    {
                        text: '创建人',
                        value: 'updated_by',
                    },
                    {
                        text: '最后更新时间',
                        value: 'updated_time',
                        width: 155
                    },
                ],
                data: [],
            },
            buttonList: [],
            topButton: [],
            info: {
                forms: [
                    {label: 'area_name', name: '区域名称', value: ''},
                    {label: 'area_code', name: '区域编号', value: ''},
                    // {label: 'area_leavel', name: '区域等级', value: ''},
                ],
                getAreaCommon: [],
                title: '区域'
            },
            zoomButtonname: '收起',
            zoomButtonicon: 'el-icon-caret-top',
            zoomButton: true
        }
    },
    methods:{
        getInfo() {
            // 获取表单信息
            this.loading = true
            this.getButton()
            if(this.buttonList) {
                this.setTopButton()
                request.requestParams(
                    [
                        '/sysarea/getArea',
                        'post',
                        {},
                        (res) => {
                            console.log(res)
                            this.option.data = res.data
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
        getArea() {
            // 获取区域信息
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
        getButton() {
            // 将按钮添加到全局
            this.buttonList = this.$store.state.mainButtonInfo['sysarea']
        },
        setTopButton() {
            // 设置顶部按钮
            for(var i of this.buttonList) {
                if(i.buttonname == '添加' && this.topButton.length <= 0) {
                    this.topButton.push(i)
                }
            }
        },
        addSubmit(info, message) {
            var params
            if(message) {
                params = {
                    area_name: info.forms[0].value,
                    area_code: info.forms[1].value,
                    area_leavel: message.area_leavel,
                    parent_id: message.id
                }
            } else {
                params = {
                    area_name: info.forms[0].value,
                    area_code: info.forms[1].value,
                }
            }
            request.requestParams(
                [
                    '/sysarea/addInfo',
                    'post',
                    params,
                    (res) => {
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        })
                        this.getInfo() // 刷新
                    },
                    false
                ]
            )
        },
        get(message) {
            // 根据id获取信息
            request.requestParams(
                [
                    '/sysarea/getInfo/'+message.id,
                    'get',
                    {},
                    (res) => {
                        this.info.forms[0].value = res.data.data.area_name
                        this.info.forms[1].value = res.data.data.area_code
                    }
                ]
            )
        },
        editSubmit(info, message) {
            request.requestParams(
                [
                    '/sysarea/editInfo',
                    'put',
                    {
                        id: message.id,
                        parent_id: message.parent_id,
                        area_name: info.forms[0].value,
                        area_code: info.forms[1].value,
                    },
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
        delSubmit(message) {
            request.requestParams(
                [
                    '/sysarea/del/'+message.id,
                    'delete',
                    {},
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
                    }
                ]
            )
        },
    },
    created() {
        this.getInfo()
        this.getArea()
    },
    components: {
        cjRightButton
    }
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
.two-button{
    margin-left: 1rem;
}
</style>
