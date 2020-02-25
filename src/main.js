import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import VueBootstrapToasts from "vue-bootstrap-toasts";
import VueConfetti from 'vue-confetti'
 
Vue.use(VueConfetti)
Vue.use(VueBootstrapToasts);
Vue.use(VueAxios, axios)

import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
