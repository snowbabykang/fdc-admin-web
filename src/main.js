Vue.config.devtools = process.env.NODE_ENV === 'development'

import App from './App'
import Antd from 'ant-design-vue'
import store from './vuex/store'
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import '../static/js/flexible.js'

import 'ant-design-vue/dist/antd.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/css/common.css'

Vue.use(Antd);

import { Tree } from 'element-ui';
Vue.use(Tree);

// 简单配置
// NProgress.inc(0.2)
// NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })


router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        store.dispatch('removeToken');
    }
    NProgress.start();
    next();
});
router.afterEach(transition => {
  NProgress.done();
});



Vue.prototype.checkPower = function(){
    let btnPermissions = this.$route.meta.powerid;
    return Vue.prototype.$_has(btnPermissions);
}

// 权限检查方法（且把该方法添加到vue原型中）
Vue.prototype.$_has = function(value) {
  let isExist = false
  var buttonpermsStr = store.getters.getPower;
  if (buttonpermsStr === undefined || buttonpermsStr == null) {
    return false
  }
  // 1是可操作  0 为只看
  if (buttonpermsStr[value] == 1) {
    isExist = true
  }
  return isExist
}


// 全局公用方法
import global from './api/common'
Vue.prototype.GLOBAL = global


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

