<template>
    <div>
        <el-tag class="tagsItem"
            size="medium"
        >
            <span>
                首页
            </span>
        </el-tag>

        <el-tag class="tagsItem"
            size="medium"
            closable
        >
            <span>
                用户管理
            </span>
        </el-tag>

        <el-tag class="tagsItem"
            size="medium"
            closable
        >
            <span>
                角色设置
            </span>
        </el-tag>

        <el-tag class="tagsItem"
            size="medium"
            closable
        >
            <span>
                系统参数
            </span>
        </el-tag>

        <el-tag class="tagsItem"
            size="medium"
            closable
        >
            <span>
                单位设置
            </span>
        </el-tag>

        <el-tag class="tagsItem"
            size="medium"
            closable
        >
            <span>
                部门设置
            </span>
        </el-tag>

    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
    data() {
        return {
            msg: 'this is tags views'
        }
    },
    methods: {
        gotoUrl(url) {
            this.$router.push(url)
        }
    }
}
</script>

<style scoped>
.tags{
    float: left;
    margin-top: 5px;
}
.tagsItem{
    margin-left: 1rem;
}
</style>