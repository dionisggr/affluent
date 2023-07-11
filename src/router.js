import { createRouter, createWebHistory } from 'vue-router'
import Main from './components/Main.vue'
import SignUp from './components/SignUp.vue'
import Login from './components/Login.vue'
import Account from './components/Account.vue'
import Prompts from './components/Prompts.vue'
import PasswordReset from './components/Password/Reset.vue'
import MFA from './components/Password/MFA.vue'
import store from './store'
import utils from './utils'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Main },
    { path: '/login', component: Login },
    { path: '/signup', component: SignUp },
    { path: '/account', component: Account },
    { path: '/prompts', component: Prompts },
    { path: '/password/mfa', component: MFA },
    { path: '/password/reset', component: PasswordReset },
    { path: '/users/:user_id/password/reset', component: PasswordReset },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authRoutes = ['/login', '/signup', '/password/reset', '/password/mfa'];
  const isAuthRoute = authRoutes.includes(to.path);
  const isLoggedIn = store.state.isLoggedIn
  const isMFA = utils.getFromLocalStorage('mfa');

  if (to.path === '/' && !isLoggedIn) {
    return next({ path: '/login' });
  } else
  if (to.path === '/password/mfa' && !isMFA) {
    return next({ path: '/login' });
  } else if (isAuthRoute && isLoggedIn) {
    return next({ path: '/' });
  } else if (!isAuthRoute && !isLoggedIn) {
    return store.dispatch('logout');
  }
  
  next();
});

export default router;
