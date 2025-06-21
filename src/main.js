import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';

import store from './store';
import './assets/main.css';
import { createToast } from './components/Toast';

// Configure axios
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

const app = createApp(App);

app.use(router);
app.use(VueAxios, axios);

// Make store and toast available globally
app.config.globalProperties.store = store;
app.config.globalProperties.toast = createToast;

// Check authentication status before mounting the app
store.checkAuth().then(() => {
  app.mount('#app');
}).catch(error => {
  console.error('Error checking authentication:', error);
  app.mount('#app');
});

// Add Google Fonts
const link = document.createElement('link');
link.rel = 'preconnect';
link.href = 'https://fonts.gstatic.com/';
link.crossOrigin = '';
document.head.appendChild(link);

const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;700;800';
document.head.appendChild(fontLink);
