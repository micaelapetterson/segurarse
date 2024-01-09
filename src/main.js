import Vue from 'vue'
//import Toasted from 'vue-toasted';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = false

//Vue.use(Toasted);

// Configuración de Vue Toastification
const toastOptions = {
  position: 'bottom-right',
  timeout: 3000,
  closeOnClick: true,
};

Vue.use(Toast, toastOptions);


new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
