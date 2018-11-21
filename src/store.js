import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    manuwidth: 6,
    mainwidth: 18,
    jsondata: {},
    menuWidth: 100,
    userMenuInfo: [],
    nowButtons: [],
    selectionArr: [],
    mainButtonInfo: {},
    isCollapse: false,
    leftMenuWidth: 120,
    lefuMenuIcon: 'el-icon-d-arrow-left',
    logoStyle: 'logo'
  },
  mutations: {
    SET_LEFT_MENU: (state) => {
      state.isCollapse = !state.isCollapse
      state.leftMenuWidth = state.isCollapse ? 64 : 120
      state.lefuMenuIcon = !state.isCollapse ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'
    }
  },
  actions: {

  }
})
