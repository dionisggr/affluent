<template>
  <div class="relative flex flex-col w-full h-full items-center justify-center space-y-8 mt-6 overflow-auto md:pb-32 xl:pb-0">
    <h2 class="text-4xl text-blue-500 m-0 md:mb-16">Login</h2>
    <GoogleLogin
      class="g_id_signin md:absolute right-1/4 top-8"
      :callback="handleCredentialResponse"
      prompt
    ></GoogleLogin>
    <form @submit.prevent="login" class="credentials relative grid grid-cols-1 gap-4 max-w-md w-full mx-auto px-6 md:px-0 h-full">
      <div class="flex justify-center">
        <button type="button" @click="loginWithDemo" class="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg">Demo</button>
      </div>
      <input type="text" v-model="emailOrUsername" placeholder="Email or Username" class="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md mt-2" required />

      <div class="relative password-container">
        <input :type="isPasswordVisible ? 'text' : 'password'" v-model="password" placeholder="Password" class="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 shadow-md" required />
        <i v-if="password && emailOrUsername !== demoEmail" @click="isPasswordVisible = !isPasswordVisible" :class="`fas fa-eye${isPasswordVisible ? '-slash' : ''} absolute right-3 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer text-gray-400`"></i>
      </div>
      
      <div class="flex justify-center">
        <button type="submit" class="px-8 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 shadow-lg">Login</button>
      </div>

      <div class="flex flex-col justify-end md:justify-center mt-4 text-sm text-blue-500 cursor-pointer">
        <router-link class="text-center hover:text-yellow-500" to="/password/reset">Forgot your password?</router-link>
        <router-link class="text-center mt-2 hover:text-yellow-500" to="/signup">No account? Signup here!</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import sha256 from 'js-sha256';
import Notification from './Notification.vue';

const {
  VITE_GOOGLE_CLIENT_ID,
  VITE_DEMO_EMAIL,
  VITE_DEMO_PASSWORD
} = import.meta.env;

export default {
  created() {
    window.handleCredentialResponse = this.handleCredentialResponse;
  },
  data() {
    return {
      emailOrUsername: '',
      password: '',
      isPasswordVisible: false,
      showErrorModal: false,
      GOOGLE_CLIENT_ID: VITE_GOOGLE_CLIENT_ID,
      demoEmail: VITE_DEMO_EMAIL,
    };
  },
  components: {
    Notification,
  },
  methods: {
    async login() {
      const body = { password: sha256(this.password) };

      if (this.emailOrUsername.includes('@')) {
        body.email = this.emailOrUsername;
      } else {
        body.username = this.emailOrUsername;
      }

      try {
        await this.$store.dispatch('login', body);
      } catch (err) {
        console.error(err);
        this.$store.dispatch('alert', 'Invalid credentials.');
      }
    },
    async handleCredentialResponse({ credential }) {
      try { 
        await this.$store.dispatch('google', { credential });

        this.$store.dispatch('alert', 'Welcome!');
      } catch (err) {
        console.error(err);
        this.$store.dispatch('alert', 'Invalid credentials.');
      }
    },
    async loginWithDemo() {
      this.emailOrUsername = VITE_DEMO_EMAIL;
      this.password = VITE_DEMO_PASSWORD;

      await this.login();
    },
  },
};
</script>

<style scoped>
input:focus {
  outline: none;
  border-color: blue;
  box-shadow: 0 0 5px rgba(0, 0, 255, .5);
}
.password-container i {
  color: rgb(186, 186, 186);
}

.credentials {
  max-width: 350px;
}
</style>
