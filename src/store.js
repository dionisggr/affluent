import { createStore } from 'vuex';
import router from './router';
import utils from './utils';
import service from './service';

const store = createStore({
  state() {
    return {
      isLoggedIn: !!utils.getFromLocalStorage('user'),
      notification: null,
    }
  },
  mutations: {
    login(state) {
      state.isLoggedIn = true
    },
    logout(state) {
      state.isLoggedIn = false
    },
    notification(state, message) {
      state.notification = message;
    }
  },
  actions: {
    async login({ commit }, body) {
      const token = import.meta.env.VITE_API_KEY;
      const auth = await service.post('/login', body, token);

      localStorage.setItem('promptwiz', JSON.stringify(auth));
      commit('login');
      router.push('/');
    },
    async google({ commit }, body) {
      const token = import.meta.env.VITE_API_KEY;
      const auth = await service.post('/google', body, token);

      window.localStorage.setItem('promptwiz', JSON.stringify(auth));
      commit('login');
      router.push('/');
    },
    async logout({ commit }) {
      commit('logout');
      router.push('/login');
      
      await service.post('/logout');
      window.localStorage.removeItem('promptwiz');
    },
    alert({ commit }, message) {
      commit('notification', message);

      setTimeout(() => {
        commit('notification', null);
      }, 3000)
    },
  }
})

export default store
