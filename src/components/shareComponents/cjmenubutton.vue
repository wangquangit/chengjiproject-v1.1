<template>
    <el-col :span="24">
            <el-button
                size="small"
                v-for="(item, index) in buttonList"
                :key="index"
                :type="item.color"
                :icon="item.icon"
                @click="execute(item.functionname,data)"
            >
                {{item.buttonname}}
            </el-button>

            <el-dialog @close="restore" title="添加" :visible.sync="addTableVisible">
                <el-form>
                    <el-form-item
                        v-for="(item, index) of data.forms"
                        :key="index"
                        :label="item.label"
                        :label-width="formLabelWidth"
                        v-if="item.label != 'id'"
                        v-model="item.value"
                    >

                        <el-input 
                            v-if="!item.select && !item.file && !item.selectDate && !item.date && !item.selectCarNo"
                            @focus="focus(item)" 
                            @blur="blur(item)" 
                            v-model="item.value"
                            :placeholder="setPlaceholder(item)"
                            >
                        </el-input>

                        <el-date-picker
                            v-if="item.selectDate"
                            v-model="item.value"
                            type="datetime"
                            placeholder="选择日期时间">
                        <!-- 日期选择器 -->
                        </el-date-picker>

                        <el-time-picker
                            v-model="item.value"
                            v-if="item.date"
                            :picker-options="{selectableRange: '18:30:00 - 20:30:00'}"
                            placeholder="任意时间点">
                        <!-- 时间选择器 -->
                        </el-time-picker>

                        <!-- 错误提示 -->
                        <el-alert
                            v-if="item.prompt"
                            :title="item.prompt"
                            :closable="false"
                            type="error">
                        </el-alert>

                        <span v-if="item.file" class="btn btn-info fileinput-button upButton">
                            <span>选择文件</span>
                            <input v-if="item.file" class="file" name="file" type="file" accept="image/*" @change="addImg"/>
                            <span>
                                <img class="nowImg" :src="item.value" alt="">
                            </span>
                        </span>

                        <el-select @change="handleSelect" v-if="item.select" v-model="selectValue" placeholder="请选择">
                            <!--  下拉选择 -->
                            <el-option 
                                v-for="(item, index) of item.selectArr"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>

                        <el-select 
                            @change="handleSelectCarNo" 
                            v-if="item.selectCarNo" 
                            v-model="selectValue" 
                            placeholder="请选择">
                            <!--  下拉选择车牌号 -->
                            <el-option 
                                v-for="(item, index) of item.selectArr"
                                :key="index"
                                :label="item.name"
                                :value="item.name"
                            >
                            </el-option>
                        </el-select>

                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button :disabled="!data.addPermitSubmit" type="primary" @click="addSubmit">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog @close="restore" :title="'修改-'+title" :visible.sync="editTableVisible">
                <!-- 修改表单 -->
                <el-form>
                    <el-form-item
                        v-for="(item, index) of data.forms"
                        :key="index"
                        :label="item.label"
                        :label-width="formLabelWidth"
                        v-if="item.label != 'id'"
                    >
                        <el-input 
                            v-if="!item.file && !item.select && !item.selectDate && !item.selectArea && !item.selectCarNo" 
                            @change="change(item)" 
                            @focus="focus(item)" 
                            v-model="item.value"></el-input>

                        <el-input
                            v-if="item.selectArea" 
                            @focus="focus(item)"
                            v-model="item.value"
                        ></el-input>


                        <el-alert
                            v-if="item.prompt"
                            :title="item.prompt"
                            :closable="false"
                            type="error">
                            <!-- 错误提示 -->
                        </el-alert>

                        <el-date-picker
                            v-if="item.selectDate"
                            v-model="item.value"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>

                        <!-- 文件上传 -->
                        <span v-if="item.file" class="btn btn-info fileinput-button upButton">
                            <span>选择文件</span>
                            <!-- <input accept="image/*" type="file" @change="changeFile($event)" name="file"/> -->
                            <input v-if="item.file" class="file" name="file" type="file" accept="image/*" @change="upImg"/>
                            <span>
                                <img class="nowImg" :src="item.value" alt="">
                            </span>
                        </span>

                        <el-select @change="handleSelect" v-if="item.select" v-model="item.value" placeholder="请选择">
                            <!--  下拉选择 -->
                            <el-option
                                v-for="(item, index) of item.selectArr"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>

                        <el-select 
                            @change="handleSelectCarNo" 
                            v-if="item.selectCarNo" 
                            v-model="carTypeSelect" 
                            :placeholder="getCarName(item)">
                            <!--  下拉选择车牌号 -->
                            <el-option 
                                v-for="(item, index) of item.selectArr"
                                :key="index"
                                :label="item.name"
                                :value="item.name"
                            >
                            </el-option>
                        </el-select>

                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" :disabled="!data.editPermitSubmit" @click="editSubmit">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog @close="restore" title="搜索" :visible.sync="searchTableVisible">
                <el-form>
                    <el-form-item
                        v-for="(item, index) of data.searchWindowForm"
                        :key="index"
                        :label="item.label"
                        :label-width="formLabelWidth"
                    >
                        <el-input v-if="!item.select && !item.file" v-model="item.value"></el-input>

                        <el-select @change="handleSelect" v-if="item.select" v-model="selectValue" placeholder="请选择">
                            <!--  下拉选择 -->
                            <el-option 
                                v-for="(item, index) of item.selectArr"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>

                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="submitSearch">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog @close="restore" title="详情" :visible.sync="showVisible">
                <el-form>
                    <el-form-item
                        v-for="(item, index) of data.forms"
                        :key="index"
                        :label="item.label+':'"
                        :label-width="showLabelWidth"
                    >
                        <div style="float: left;">
                            {{item.value}}
                        </div>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">关闭</el-button>
                </div>
            </el-dialog>

            <el-dialog @close="restore" title="权限" :visible.sync="permissionVisible">
                <h1 v-if="!permissionList">加载中...</h1>
                <el-tree
                    v-if="permissionList"
                    show-checkbox
                    node-key="id"
                    :data="data.Permissions.allPermissions"
                    :default-checked-keys="nowPermissionList"
                    :props="defaultProps"
                    @check="checkChange"
                >
                </el-tree>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="submitAddEmit">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog @close="restore" title="导入" :visible.sync="importVisible">
                <form action="" id="fileForm">
                    <span class="btn btn-success fileinput-button">
                        <span>上传</span>
                        <input type="file" @change="changeFileName($event)" name="file"/>
                        {{importFileName}}
                    </span>
                </form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="submitImport">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="选择区域" :visible.sync="selectAreaVisible">
                <el-tree
                    :data="data.getAreaCommon" 
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                ></el-tree>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeArea">取消</el-button>
                    <el-button type="primary" @click="selectAreaVisible = false">确定</el-button>
                </div>
            </el-dialog>
    </el-col>
</template>

<script>
import config from '../config';
import request from '../user_authority.js'
import axios from 'axios'
export default {
    data() {
        return {
            addTableVisible: false,
            editTableVisible: false,
            deleteVisible: false,
            searchTableVisible: false,
            showVisible: false,
            permissionVisible: false,
            importVisible: false,
            selectAreaVisible: false,
            permissionList: false, // 权限等待
            nowPermissionList: [], // 拥有的权限列表
            newPermissionObj: {},
            newPermissionList: [],
            formLabelWidth: '150px',
            showLabelWidth: '250px',
            title: '',
            selectionArr: [],
            selectValue: '',
            imgFileName: '', // 图片上传文件
            files: {}, // 文档上传文件
            src: '',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            fileList:[],
            importFileName: '',
            formdata: {},
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            // 区域相关
            area: {},
            filterText: '',
            carTypeSelect: null,
        }
    },
    props: {
        buttonList: Array,
        data: Object,
    },
    methods: {
        execute(functionname,data) {
            // BOSS
            console.log("functionname:",functionname)
            this.data = data
            this[functionname]()
        },
        addInfo() {
            // 添加表单开启
            this.$emit('closePermit') // 关闭提示
            for(var item of this.data.forms){
                if(item.censor) {
                    item.prompt = ''
                }
                item.value = ''
                this.carTypeSelect = null
            }
            this.addTableVisible = true
        },
        cancel() {
            // 提示取消
            this.addTableVisible = false
            this.editTableVisible = false
            this.searchTableVisible = false
            this.importVisible = false
            this.showVisible = false
        },
        addSubmit() {
            // 提交表单传给子组件
            this.$emit('addSubmit',this.data.forms, this.area, this.carTypeSelect)
            this.addTableVisible = false
        },
        editInfo() {
            this.area = {}
            for(var item of this.data.forms){
                if(item.censor) {
                    // 清空提示
                    item.prompt = ''
                }
                if(item.selectCarNo) {
                    item.value = null
                }
                this.carTypeSelect = null
            }
            this.$emit('closePermit') // 关闭提示
            if(this.data.selectionArr.length > 0){
                for (var i = 0; i < this.data.forms.length; i++) {
                    if(this.data.forms[i].props) {
                        this.data.forms[i].value = this.data.selectionArr[0][this.data.forms[i].props]
                        // 判断是否存在特殊情况 如该值为区域选择
                    } else {
                        this.data.forms[i].value = this.data.selectionArr[0][this.data.forms[i].prop];
                    }
                }
                this.title = this.data.selectionArr[0][this.data.formTitle.titleFiled]  // 标题
                this.editTableVisible = true
            } else {
                this.$message({message:'请选择需要修改的项'})
            }
        },
        editSubmit() {
            // 提交修改
            this.$emit('editSubmit', this.data.forms, this.area, this.carTypeSelect)
            this.editTableVisible = false
        },
        del() {
            // 删除方法
            this.title = ''
            var itemList = this.data.selectionArr
            var str = ''
            for(var item of itemList){
                this.title += ' '+item[this.data.formTitle.titleFiled]+','
                str += item[this.data.formTitle.idFiled]+','
            }
            if(this.title.length > 0){
                this.title = this.title.substring(0,this.title.length-1)
            }
            this.data.selectionArr.length >= 1 ?
                this.deleteVisible = true :
                this.deleteVisible = false
            if(this.deleteVisible){
                this.$confirm('是否删除 '+this.title,'提示!', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('deleteForm', str)
                })
            } else {
                this.$message({
                    message: '请选择一个',
                    type: 'info'
                })
            }
        },
        search() {
            // 激活搜索弹窗
            this.searchTableVisible = true
        },
        submitSearch() {
            // 提交搜索
            this.$emit('submitSearch',this.data.searchWindowForm)
            this.searchTableVisible = false
        },
        showInfo() {
            this.$emit('showInfo')
            if(this.data.selectionArr.length > 0){
                this.showVisible = true
            }
        },
        restore() {
            this.$emit('restore')
        },
        handleSelect(value) {
            // 选择下拉列表后赋值
            this.carTypeSelect = value
        },
        handleSelectCarNo(value) {
            console.log(value)
            this.carTypeSelect = value
        },
        export() {
            // 导出
            this.$emit('export')
        },
        blur(item) {
            // 输入框失去焦点事件
            if(item.censor) {
                // 校验重复***
                this.$emit('check', item)
            }
        },
        change(item) {
            // 输入框值发生改变事件
            if(item.censor) {
                // 校验重复***
                this.$emit('check', item)
            }
        },
        focus(item) {
            // 选择区域
            if(item.selectArea) {
                this.selectAreaVisible = true
            }
        },
        handleNodeClick(value) {
            // 选择区域后复制
            this.area = value
            for(var i of this.data.forms) {
                if(i.selectArea) {
                    i.value = value.name
                }
            }
        },
        closeArea() {
            // 取消区域的选择
            this.area = {}
            for(var i of this.data.forms) {
                if(i.selectArea) {
                    i.value = ''
                }
            }
            this.selectAreaVisible = false
        },
        permission() {
            // 权限调用
            this.permissionList = false
            if(this.data.selectionArr.length > 0) {
                this.nowPermissionList = []
                this.data.Permissions.allPermissions = []
                this.$emit('getPermission')
                this.handlePermission(this.data.Permissions.allPermissions)
                this.permissionVisible = true
            }
            setTimeout(
                () => {
                    this.permissionList = true
                },
                2000
            )
        },
        handlePermission(item) {
            // 处理权限状态
            if(item.length) {
                for(var i of item) {
                    if(i.rolePermission == 'Y' && i.children.length == 0) {
                        this.nowPermissionList.push(i.id)
                    }
                    if(i.children.length == 0) {
                        continue
                    }
                    this.handlePermission(i.children)
                }
            } else {
                setTimeout(
                    () => {
                        this.handlePermission(this.data.Permissions.allPermissions)
                    },
                    2000
                )
            }
        },
        submitpermission(item) {
            // 确定权限的变动
            for(let i of item) {
                if(i.rolePermission == "Y" && i.children.length == 0) {
                    this.newPermissionObj[i.id] = true
                } else {
                    this.newPermissionObj[i.id] = false
                }
                if(i.children.length) {
                    this.submitpermission(i.children)
                }
            }
        },
        checkChange(value) {
            // ????
            this.nowPermissionList = []
            // if(value.rolePermission == null) {
            //     this.changePermission(value, "Y")
            //     // 判断状态
            // } else if(value.rolePermission == 'Y') {
            //     this.changePermission(value, null)
            // }
        },
        changePermission(item, data) {
            // 改变权限状态
            if(item.children.length == 0) {
                item.rolePermission = data
            }
            if (item.children) {
                for(var i of item.children) {
                    this.changePermission(i, data = i.rolePermission == "Y" ? null : "Y")
                }
            }
        },
        submitAddEmit() {
            // 权限初始化数组和发送给父组件
            this.submitpermission(this.data.Permissions.allPermissions)
            this.newPermissionList = []
            for(var i in this.newPermissionObj) {
                if(this.newPermissionObj[i]) {
                    this.newPermissionList.push(i)
                }
            }
            this.$emit('submitAddPermission', this.newPermissionList)
            this.permissionVisible = false
        },
        import() {
            // 激活文件导入窗口
            this.importVisible = true
        },

        changeFileName(event) {
            // 选择文件后赋值名称
            if(event) {
                this.importFileName = event.target.files[0].name
            }
        },

        submitImport() {
            // 文件导入确认提交
            var fileObj = document.getElementById('fileForm')
            var forms = new window.FormData(fileObj);
            this.$emit('submitImportFile', forms)
            this.importVisible = false
            this.importFileName = ''
        },
        download() {
            // 下载
            this.$emit('downloadModelFile')
        },
        print() {
            // 打印
            this.$notify({
                title: 'Sorry',
                message: '服务君正在完善该功能, 敬请期待!!!',
                type: 'info'
            });
        },
        addImg(e){
            // 添加图片
            let file = e.target.files[0];           
            let param = new FormData(); //创建form对象
            param.append('file',file,file.name);//通过append向form对象添加数据
            param.append('sysUnitsId','0');//添加form表单中其他数据
            // console.log('--->',param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
            let config = {
                headers:{'Content-Type':'application/json'}
            };  //添加请求头
            this.$emit('uploadPicture', param, config)
        },
        upImg(e) {
            let file = e.target.files[0];
            let param = new FormData();
            param.append('file', file,file.name);
            param.append('sysUnitsId',String(this.data.selectionArr[0].id));
            let config = {
                headers:{'Content-Type':'application/json'}
            };
            this.$emit('uploadPicture', param, config)
        },
        setPlaceholder(item) {
            if(item.placeholder) {
                return item.placeholder
            }
        },
        getCarName(item) {
            return item.value
        }
    },
}
</script>

<style scoped>
.fileType{
    width: 100%;
    height: 100%;
}
.topButton{
    float: left;
}
.fileinput-button {
    position: relative;
    display: inline-block;
    overflow: hidden;
}

.fileinput-button input{
    position: absolute;
    right: 0px;
    top: 0px;
    opacity: 0;
    -ms-filter: 'alpha(opacity=0)';
}
.upButton{
    float: left;
}
.nowImg{
    width: 28px;
    height: 28px;
}
</style>
