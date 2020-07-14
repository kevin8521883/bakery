// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import VeeValidate from 'vee-validate'
import zhTW from 'vee-validate/dist/locale/zh_TW'
import VueI18n from 'vue-i18n'
import AOS from 'aos'
import 'aos/dist/aos.css'

import App from './App'
import router from './router/index'
import './bus'
import currencyFilter from './filters/currency'
import dateFiliter from './filters/date'

AOS.init({
  once: true,
  duration: 800,
});
Vue.use(VueI18n)
Vue.use(VueAxios, axios)
axios.defaults.withCredentials = true;
Vue.config.productionTip = false
Vue.component('Loading', Loading)
Vue.filter('currency', currencyFilter);
Vue.filter('date', dateFiliter)
/* eslint-disable no-new */
const i18n = new VueI18n({
  locale: 'zhTW'
})
Vue.use(VeeValidate, {
  events: 'input|blur', //這是為了讓使用者離開該欄位時觸發驗證
  i18n,
  dictionary: {
    zhTW
  }
})
new Vue({
  i18n,
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const api = `${process.env.APIPATH}/api/user/check`;
    const vm = this;
    axios.post(api).then((response) => {
      if (response.data.success) {
        next();
      } else {
        next({
          path: '/login',
        })
      }
    })
  } else {
    next();
  }
})
