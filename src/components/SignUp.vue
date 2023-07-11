<template>
  <div class="flex flex-col w-full h-full items-center justify-center space-y-8 mt-6 overflow-auto mb-48">
    <h2 class="text-4xl text-blue-500 m-0 mb-2vw lg:mb-4">Sign Up</h2>
    <div class="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
      <GoogleLogin
        class="g_id_signin md:absolute md:right-1/4 xl:right-1/3 md:translate-x-20 mb-5vw"
        :callback="handleCredentialResponse"
        prompt
      />
      <div class="relative w-28 h-28 md:w-24 md:h-24">
        <img :src="image" alt="User Avatar" class="w-full h-full rounded-full border-2 border-gray-300 shadow object-cover object-center" />
        <input type="file" accept="image/*" ref="fileInput" @change="handleFileUpload" class="hidden" />
        <button @click="uploadAvatar" class="px-2 py-1 text-white bg-blue-500 rounded-full hover:bg-blue-700 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-opacity-75">Edit</button>
      </div>
    </div>
    <form @submit.prevent="$event => signup()" class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 max-w-lg w-full mx-auto px-4 md:px-0">
      <small class="text-gray-500 md:col-span-2 font-bold text-center md:text-left mt-4 md:mt-0">* Required only.</small>
      <input type="text" v-model="firstName" placeholder="First Name" class="w-full max-w-300 mx-auto px-3 py-2 rounded border border-gray-300 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md" />
      <input type="text" v-model="lastName" placeholder="Last Name" class="w-full max-w-300 mx-auto px-3 py-2 rounded border border-gray-300 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md" />
      <input type="text" v-model="username" :placeholder="$route.path === 'login' ? 'Username (Optional)' : 'Username'" class="w-full max-w-300 mx-auto px-3 py-2 rounded border border-gray-300 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md" />
      <input type="email" v-model="email" placeholder="Email *" class="w-full max-w-300 mx-auto px-3 py-2 rounded border border-gray-300 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md" required />
      
      <div class="relative w-full max-w-300 mx-auto password-container">
        <input :type="passwordVisible ? 'text' : 'password'" v-model="password" placeholder="Password *" @input="checkPasswordStrength" class="w-full px-3 py-2 rounded border border-gray-300 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 shadow-mdn" required />
        <i v-if="password" @click="passwordVisible = !passwordVisible" :class="`fas fa-eye${passwordVisible ? '-slash' : ''} absolute right-3 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer`"></i>
      </div>

      <div class="relative w-full max-w-300 mx-auto password-container">
        <input :type="confirmPasswordVisible ? 'text' : 'password'" v-model="confirmPassword" placeholder="Confirm Password *" class="w-full px-3 py-2 rounded border border-gray-300 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 shadow-md" required />
        <i v-if="password" @click="confirmPasswordVisible = !confirmPasswordVisible" :class="`fas fa-eye${confirmPasswordVisible ? '-slash' : ''} absolute right-3 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer`"></i>
      </div>

      <div class="password-strength mt-4 md:mt-0 relative w-full max-w-400 md:max-w-1200 mx-auto h-2 bg-gray-300 rounded md:col-span-2">
        <div :style="{ width: password && passwordStrength + '%', backgroundColor: passwordColor }" class="absolute left-0 h-full rounded"></div>
      </div>
      <small class="text-gray-500 md:col-span-2 font-bold text-center md:text-left">Password must contain capital letters, numbers, and symbols.</small>
      <div class="md:col-span-2 flex justify-center">
        <button type="submit" class="px-8 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-8 md:-4">Create Account</button>
      </div>
    </form>
  </div>
</template>

<script>
import sha256 from 'js-sha256';
import _ from 'lodash';

export default {
  mounted() {
    window.handleCredentialResponse = this.handleCredentialResponse;
  },
  beforeDestroy() {
    delete window.handleCredentialResponse;
  },
  data() {
    return {
      image: 'https://loremflickr.com/150/150',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      passwordStrength: 0,
      passwordColor: 'red',
      passwordVisible: false,
      confirmPasswordVisible: false,
      GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      passwordFeedback: {
        weak: [
          "Even a goldfish could guess this!",
          "Yawn! Got a stronger one?",
          "Seriously? A baby can crack this!",
          "Too weak! Give it some spinach!",
          "Don't make hackers' job too easy!",
          "Your password needs a cup of strong coffee!",
        ],
        medium: [
          "Getting stronger, needs more muscle!",
          "Heavier than a feather, aim for a boulder!",
          "Good start, now let's make it roar!",
          "I've seen ants lift heavier passwords!",
          "Had one coffee? It needs a double!",
        ],
        almost: [
          "Almost bulletproof, add a bit more armor!",
          "This password's in the gym, just one more rep!",
          "Looking good, but could use a cherry on top!",
          "Strong, but let's make it uncrackable!",
          "Close to a masterpiece, just needs the final touch!",
        ]
      }
      
    };
  },
  methods: {
    uploadAvatar() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async signup() {
      if (this.password !== this.confirmPassword) {
        return alert("Passwords do not match!");
      }

      const body = _.omitBy({
        first_name: this.firstName,
        last_name: this.lastName,
        username: this.username.toLowerCase(),
        email: this.email, 
        password: sha256(this.password),
      }, _.isEmpty);
      const isPasswordStrong = Math.ceil(this.passwordStrength) === 100;

      if (!isPasswordStrong) {
        const passwordStrength = (this.passwordStrength < 33.3)
        ? 'weak'
        : (this.passwordStrength < 66.6) ? 'medium' : 'almost'
          
        return this.$store.dispatch('alert',
          _.sample(this.passwordFeedback[passwordStrength]));
      }

      try {
        const auth = await this.$store.dispatch('signup', body);

        localStorage.setItem('promptwiz', JSON.stringify(auth));
        this.$router.push('/');
      } catch (error) {
        this.$store.dispatch('alert', 'An error occurred creating your account.');
      }
    },
    checkPasswordStrength() {
      const conditions = [
        { regex: /[A-Z]/, strength: 33.3 },
        { regex: /\d/, strength: 33.3 },
        { regex: /[!@#$%^&*()]/, strength: 33.3 },
      ];

      this.passwordStrength = conditions.reduce((total, { regex, strength }) => {
        return total + (this.password.match(regex) ? strength : 0);
      }, 0);

      this.passwordColor = this.passwordStrength < 33.3 ? 'red' : this.passwordStrength < 66.6 ? 'orange' : 'green';
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
  },
};
</script>

<style scoped>
input:focus {
  outline: none;
  border-color: blue;
}
.password-container i {
  color: rgb(186, 186, 186);
}

[role="button"] {
  height: 50px;
}
</style>
