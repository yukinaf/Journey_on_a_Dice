import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import axios from 'axios'

import { initializeApp } from "firebase/app";

Vue.prototype.$axios = axios
Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyBmFi9lRFmXrYcOU4-YTxrTA8fOv07RjLQ",
  authDomain: "hackathon5th-52c4f.firebaseapp.com",
  projectId: "hackathon5th-52c4f",
  storageBucket: "hackathon5th-52c4f.appspot.com",
  messagingSenderId: "330160270252",
  appId: "1:330160270252:web:9f53e5bb9190c8a4806809",
  measurementId: "G-G6KYD2Y8DC"
};

// Initialize Firebase
initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
