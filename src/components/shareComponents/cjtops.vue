<template>
    <div>
        <el-button 
            circle 
            size="small" 
            type="primary" 
            :icon="this.$store.state.lefuMenuIcon" 
            class="setmenu"
            @click="setMenu"
        ></el-button>

        <el-button 
            circle 
            size="small"
            class="setmenu"
            icon="el-icon-menu"
            @click="setMenu"
        ></el-button>

        <el-button 
            circle
            size="small"
            class="setmenu"
            icon="el-icon-setting"
            @click="setMenu"
        ></el-button>

        <el-button
            circle
            size="small"
            icon="el-icon-message"
            class="rigthMenu"
        >
        </el-button>

        <el-button
            circle
            size="small"
            icon="el-icon-news"
            class="rigthMenu"
        >
        </el-button>
        
        <el-button
            circle
            size="small"
            icon="el-icon-tickets"
            class="rigthMenu"
        >
        </el-button>

        <el-button
            circle
            size="small"
            icon="el-icon-sort"
            class="rigthMenu"
        >
        </el-button>

    </div>
</template>

<script>
export default {
    data() {
        return {
            msg: 'this is top views'
        }
    },
    methods: {
        setMenu() {
            // 设置左侧
            this.$store.commit('SET_LEFT_MENU')
        }
    },
}
</script>

<style lang="scss" scoped>
.setmenu{
    float: left;
    margin: 0 1rem;
}
.rigthMenu{
    float: right;
    margin: 0 1rem;
}
</style>

