<template>
  <div class="flex flex-col w-full h-full items-center justify-center space-y-6 mt-6 overflow-auto pb-40 max-w-1200 mx-auto px-4 text-center md:text-left md:pb-32 xl:pb-0">
    <div class="flex relative w-full h-16">
      <router-link 
        to="/"
        class="top-2 left-1/4 bg-white text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 py-1 px-3 rounded-full text-center transition-all duration-200 ease-in-out"
        :class="{ 'absolute': !isMobile, 'mx-auto': isMobile }"
      >
        ← Back to Home
      </router-link>
    </div>
    <h2 class="text-4xl font-semibold mb-4">Password Reset</h2>
    <form v-if="user || mfa" @submit.prevent="handleResetUserPassword" class="grid grid-cols-1 gap-4 max-w-lg w-full mx-auto px-4 md:px-0">
      <input type="password" v-model="password" placeholder="New Password" class="form-input" required />
      <input type="password" v-model="confirmPassword" placeholder="Confirm New Password" class="form-input" required />
      <button type="submit" class="form-button mt-4">Reset</button>
    </form>
    <form v-else @submit.prevent="handleMFA" class="w-full max-w-sm mb-10">
      <p class="mb-10">To reset your password, we will send you a 6-digit code to your email. Please enter your email address below.</p>
      <input
        type="email"
        v-model="email"
        placeholder="Email"
        class="w-full px-3 py-2 rounded border border-gray-300 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        required
      />
      <button class="w-full mt-4 px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600" type="submit">Send Code</button>
    </form>
  </div>
</template>

<script>
import service from '../../service';
import utils from '../../utils';
import sha256 from 'js-sha256';

export default {
  created() {
    const {
      token,
      user,
      mfa,
    } = utils.getFromLocalStorage('token', 'user' ,'mfa');
    this.token = token;
    this.user = user;
    this.mfa = mfa;
  },
  data() {
    return {
      user: null,
      token: null,
      mfa: null,
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    async resetPassword({ user_id, mfaToken }) {
      const data = { password: sha256(this.password) };

      try {
        await service.patch(`users/${user_id}`, { data }, mfaToken);
        await this.$store.dispatch('logout');
      } catch (error) {
        console.error(error);
        alert('Something went wrong. Please try again.')
      }
    },
    async handleResetUserPassword() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      const user = utils.getFromLocalStorage('user');

      if (user) {
        await this.resetPassword({ user_id: user.id });

        this.$router.push('/account');

        return;
      } else {
        this.$store.dispatch('alert', 'Something went wrong. Please try again.');
      }
    },
    async handleMFA() {
      if (!this.email) {
        this.$store.dispatch('alert', 'Please enter an email address.');
      }

      try {
        const auth = await service.post('/passwords/reset',
          { email: this.email },
          import.meta.env.VITE_API_KEY
        );

        utils.upsertLocalStorage({ mfaToken: auth.token });

        this.$router.push('/password/mfa')
      } catch (error) {
        console.error(error);
        this.$store.dispatch('alert', 'Something went wrong. Please try again.');
      }
    },
  },
  computed: {
    isMobile() {
      return this.windowWidth <= 768;
    },
  }
};
</script>

<style scoped>
.form-input {
  width: 100%;
  padding: 0.5em;
  border-radius: 0.25em;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.form-input:focus {
  background-color: #fff;
  border-color: #90cdf4;
}

.form-button {
  padding: 0.5em 1em;
  color: #fff;
  background-color: #4299e1;
  border-radius: 0.25em;
  transition: background-color 0.3s ease;
}

.form-button:hover {
  background-color: #2b7a9e;
}

.form-button:active {
  transform: scale(0.98);
}
</style>
