// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VeeValidate from 'vee-validate';

window.$ = window.jQuery = require('jquery');
require('bootstrap-sass');

window.Vue = require('vue');

Vue.use(VeeValidate);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
