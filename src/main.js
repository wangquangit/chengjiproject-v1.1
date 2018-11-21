import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import './static/css/animate.css'
// import './static/js/jquery-1.11.3.js'
import './static/iconfont/iconfont.css'

Vue.config.productionTip = false
Vue.use(Avue);
Vue.use(ElementUI);

axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token')
// axios.defaults.headers.common['Content-type'] = 'multipart/form-data'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
