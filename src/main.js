import { createApp, nextTick } from 'vue';
import App from './App.vue';
import vue3GoogleLogin from 'vue3-google-login';
import store from './store';
import router from './router';
import './build.css';

const app = createApp(App).directive('focus', {
  mounted(el) {
    nextTick(() => {
      el.focus()
    })
  }
});

app
  .use(router)
  .use(store)
  .use(vue3GoogleLogin, {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
  })
  .mount('#app');
