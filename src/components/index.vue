<template>
    <el-container class="boos" :style="'height:'+winHeight">
        <el-scrollbar style="height:100%">
        <!-- <el-aside class="menu" :width="this.$store.state.leftMenuWidth+'px'" :style="'height:'+winHeight"> -->
            <el-menu
                class="el-menu-vertical-demo"
                :collapse="this.$store.state.isCollapse"
                v-loading="loading"
            >
                            <!-- :style="'width:'+this.$store.state.leftMenuWidth+'px'" -->
                <h3 :class="this.$store.state.logoStyle">
                    <router-link to="/">
                        <h4>
                            versions -1
                        </h4>
                    </router-link>
                </h3>
                <el-submenu 
                    :index="String(menuindex)"
                    v-for="(menu, menuindex) in userMenuInfo"
                    :key="menuindex"
                >
                    <template slot="title">
                        <i :class="'iconfont '+menu.iconCls"></i>
                        <span>{{menu.name}}</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item
                            v-for="(item, itemindex) in menu.children"
                            :key="itemindex"
                            :index="String(menuindex+'-'+itemindex)"
                            @click="gotourl(item.listButton,item.url)"
                        >
                            {{item.name}}
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-scrollbar>
        <!-- </el-aside> -->

        <el-container class="rightMain">
            <el-header style="height: 80px">
                <el-row>
                    <el-col :span="24">
                        <div class="tops">
                            <cj-tops 
                            ></cj-tops>
                        </div>
                    </el-col>
                </el-row>
                <div class="tagsMain">
                    <div class="tagsLeft">
                        <cj-tags></cj-tags>
                    </div>
                    <div class="tagsRigth">
                        <el-dropdown>
                        <el-button type="primary" size="mini" style="margin-top:3px">
                            更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>关闭全部</el-dropdown-item>
                            <el-dropdown-item>关闭其他</el-dropdown-item>
                        </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </el-header>

            <el-scrollbar style="height:100%">
            <!-- <el-main class="main"> -->
                <div class="main">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </div>
            </el-scrollbar>
            <!-- </el-main> -->

        </el-container>

    </el-container>
</template>

<script>
import { mapState } from 'vuex';
import config from './config.js'
import request from './user_authority.js'
import cjTags from './shareComponents/cjtags.vue'
import cjTops from './shareComponents/cjtops.vue'
export default{
    data() {
        return {
            msg: 'this is index views',
            winHeight: window.innerHeight+'px', // 获取窗口高度
            manubuttonicon: 'el-icon-d-arrow-left',
            loading: true, // 左侧菜单栏加载状态
            setLefuButton: 'el-icon-d-arrow-left',
            logos: 'logo'
        }
    },
    methods: {
        gotourl(listButtons,url) {
            this.$router.push(url)
        },
        getUserMenuInfo() {
            // 获取菜单
            request.requestParams(
                [
                    '/login/getUserPermission',
                    'post',
                    {},
                    (response) => {
                        if(response.data.code == -66){
                            this.$message({
                                message: res.data.msg
                            })
                            return
                        }
                        this.$store.state.userMenuInfo = response.data
                        this.setMainButtons(response.data) // 获取按钮后添加到全局 // ???
                        this.loading = false // 加载状态消失
                    },
                    false
                ]
            )
        },
        setMainButtons(response) {
            // 将按钮对象组织后添加到全局
            for(var index in response){
                for(var item in response[index].children) {
                    this.$store.state.mainButtonInfo[response[index].children[item].url]
                        = response[index].children[item].listButton
                }
            }
        },
    },
    computed: {
        ...mapState(['manuwidth','mainwidth','userMenuInfo'])
    },
    created() {
        this.getUserMenuInfo()
    },
    components: {
        cjTags,
        cjTops
    }
}
</script>

<style scoped>
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
.bg-purple-dark {
    background: #99a9bf;
    overflow: hidden;
  }
.logo{
      margin: 1rem;
      /* position: absolute; */
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 250px;
    min-height: 700px;
}
.el-scrollbar__wrap {
    height:100%;
    overflow-x: hidden;
}

.menu > .el-menu-vertical-demo{
    /* background: rgb(32, 34, 42); */
}
.tags{
    padding: 1rem;
}
.main{
    margin: 2rem;
    overflow: hidden;
}
.tagsRigth{
    float: right;
}
.tagsLeft{
    float: left;
}
.tagsMain{
    margin-top: 10px;
}
.tops{
    margin-top: 5px;
}
</style>
