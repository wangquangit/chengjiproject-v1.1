<template>
    <div>
        <el-button
            v-for="(item, index) of buttonList"
            v-if="item.buttonname != '搜索'"
            :key="index"
            size="small"
            :type="item.color"
            :icon="item.icon"
            @click="executeFunction(item.functionname)"
        >
            {{item.buttonname}}
        </el-button>

        <el-dialog :title="titleName+info.title" :visible.sync="addAreaWindow">
            <el-form>
                <el-form-item
                    v-for="(item, index) of info.forms"
                    :key="index"
                    :label="item.name" 
                    :label-width="formLabelWidth"
                >
                    <el-input @focus="focus(item)" v-model="item.value"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeWindow">取消</el-button>
                <el-button type="primary" @click="Submit">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="'选择区域 '+filterText" :visible.sync="selectArea">
            <el-tree
                :data="info.getAreaCommon" 
                :props="defaultProps"
                @node-click="handleNodeClick"
            ></el-tree>

            <div slot="footer" class="dialog-footer">
                <el-button @click="closeArea">取消</el-button>
                <el-button type="primary" @click="clickArea">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            msg: 'this is area views',
            addAreaWindow: false,
            delAreaWindow: false,
            selectArea: false,
            formLabelWidth: '140px',
            active: '',
            titleName: '',
            filterText: '',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            area: {}
        }
    },
    methods: {
        executeFunction(functionname) {
            // 执行对应方法
            this[functionname]()
        },
        handleNodeClick(value) {
            // 选择区域后复制
            this.area = value
            this.filterText = value.name
        },
        focus(item) {
            if(item.select) {
                this.selectArea = true
            }
        },
        clickArea() {
            for(var i of this.info.forms) {
                if(i.select){
                    i.value = this.area.name
                }
            }
            this.selectArea = false
        },
        addInfo() {
            this.active = 'add'
            this.titleName = '添加'
            this.clearForms() // 添加时清空所有的表单value
            this.addAreaWindow = true
        },
        editInfo() {
            this.active = 'edit'
            this.titleName = '修改'
            this.$emit('get', this.message)
            this.addAreaWindow = true
        },
        del() {
            this.$confirm('确定要删除  ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('delSubmit', this.message)
            }).catch(() => {

            });
        },
        closeWindow() {
            // 关闭所有弹窗
            this.addAreaWindow = false
            this.delAreaWindow = false
            // this.clearForms() // ????
        },
        closeArea() {
            // 取消区域选择清空area表单, 清空forms.value
            this.area = {}
            this.selectArea = false
            for(var i of this.info.forms){
                if(i.select) {
                    i.value = ''
                }
            }
        },
        clearForms() {
            // 清空所有value
            for(var i of this.info.forms) {
                i.value = ''
            }
        },
        Submit() {
            if(this.active == 'add') {
                this.$emit('addSubmit', this.info, this.message, this.area)
                this.closeWindow()
            } else {
                this.$emit('editSubmit', this.info, this.message, this.area)
                this.addAreaWindow = false
                // this.closeWindow() // ??? 用此方法提交的表单value都为空,没理由啊?????
            }
        }
    },
    props: {
        buttonList: Array,
        info: Object,
        message: Object
    }
}
</script>

<style scoped>

</style>

