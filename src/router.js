import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'

Vue.use(Router)


const router = new Router({
  linkActiveClass: 'active',
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./components/login/index.vue')
    },
    {
      path: '/',
      name: 'main',
      component: () => import('./components/index.vue'),
      children: [
        {
          path: 'index',
          name: 'index',
          component: () => import('./components/main/index.vue')
        },
        {
          path: 'dictype',
          name: 'dictype',
          component: () => import('./components/main/dictype.vue')
        },
        {
          path: 'manu',
          name: 'manu',
          component: () => import('./components/main/manu.vue')
        },
        {
          path: 'role',
          name: 'role',
          component: () => import('./components/main/role.vue')
        },
        {
          // 用户
          path: 'user',
          name: 'user',
          component: () => import('./components/main/user/user.vue')
        },
        {
          // 部门
          path: 'sysdepartment',
          name: 'sysdepartment',
          component: () => import('./components/main/sys/sysdepartment.vue')
        },
        {
          // 区域
          path: 'sysarea',
          name: 'sysarea',
          component: () => import('./components/main/sys/sysarea.vue')
        },
        {
          // 单位
          path: 'sysuniits',
          name: 'sysuniits',
          component: () => import('./components/main/sys/sysuniits.vue')
        },
        {
          //角色
          path: 'rmsrole',
          name: 'rmsrole',
          component: () => import('./components/main/sys/rmsrole.vue')
        },
        {
          // 车型
          path: 'cartype',
          name: 'cartype',
          component: () => import('./components/main/car/cartype.vue')
        },
        {
          // 车辆列表
          path: 'carinfo',
          name: 'carinfo',
          component: () => import('./components/main/car/carinfo.vue')
        },
        {
          // 车辆年检
          path: 'carannual',
          name: 'carannual',
          component: () => import('./components/main/car/carannual.vue')
        },
        {
          // 设置车辆作业区段
          path: 'carassignmentssection',
          name: 'carassignmentssection',
          component: () => import('./components/main/car/carassignmentssection.vue')
        },
        {
          // 维修保养记录
          path: 'carmaintenance',
          name: 'carmaintenance',
          component: () => import('./components/main/car/carmaintenance.vue')
        },
        {
          // 车辆保险记录
          path: 'carclaimrecord',
          name: 'carclaimrecord',
          component: () => import('./components/main/car/carclaimrecord.vue')
        },
        {
          // 车辆违章记录
          path: 'carvehicleviolation',
          name: 'carvehicleviolation',
          component: () => import('./components/main/car/carvehicleviolation.vue')
        },
        {
          // 路桥费记录
          path: 'carvehicletoll',
          name: 'carvehicletoll',
          component: () => import('./components/main/car/carvehicletoll.vue')
        },
        {
          // 车辆作业异常情况
          path: 'carworkingerror',
          name: 'carworkingerror',
          component: () => import('./components/main/car/carworkingerror.vue')
        }
      ]
    },
    {
      path: '*',
      component: () => import('./components/index.vue')
    }
  ]
})


export default router