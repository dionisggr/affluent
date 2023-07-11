<template>
  <div class="flex flex-col items-center justify-center max-h-screen px-6 text-center my-auto mt-10 sm:mt-20">
    <h2 class="text-2xl sm:text-4xl font-semibold mb-2 sm:mb-4">Multi-Factor Authentication</h2>
    <p class="mb-5 sm:mb-10">Please enter the 6-digit code that was sent to your email. Note that the code will expire in 5 minutes.</p>
    <div class="flex justify-center space-x-1 sm:space-x-3 mb-5 sm:mb-10">
      <input
        v-for="(digit, index) in mfaCode"
        :key="index"
        class="w-10 sm:w-12 h-10 sm:h-12 text-xl sm:text-2xl text-center rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        type="tel"
        v-model="mfaCode[index]"
        maxlength="1"
        style="text-transform: uppercase;"
        @input="focusNextInput(index)"
        @keydown.backspace="focusPrevInput(index)"
        @paste="handlePaste"
      />
    </div>
    <button class="mt-4 px-4 sm:px-6 py-1 sm:py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600" @click="submitCode">Submit</button>
  </div>
</template>

<script>
import service from '../../service';
import utils from '../../utils';

export default {
  data() {
    return {
      mfaCode: Array(6).fill(''),
    };
  },
  methods: {
    focusPrevInput(index) {
      if (this.mfaCode[index] == '') {
        const prevInput = this.$el.querySelector(`input:nth-child(${index})`);

        if (prevInput) prevInput.focus();
      }
    },
    focusNextInput(index) {
      if (this.mfaCode[index].length >= 1) {
        const nextInput = this.$el.querySelector(`input:nth-child(${index + 2})`);

        if (nextInput) nextInput.focus();
      }
    },
    async submitCode() {
      const code = this.mfaCode.join('');
      const mfaToken = utils.getFromLocalStorage('mfaToken');

      try {
        const auth = await service.post('/passwords/mfa', { code }, mfaToken);

        localStorage.setItem('promptwiz', JSON.stringify(auth));
        this.$router.push(`/account`);
      } catch (error) {
        console.error(error);
        this.$store.dispatch('alert', 'Something went wrong. Please try again.');
      }
    },
    handlePaste(event) {
      event.preventDefault();
      const pastedData = event.clipboardData.getData('text').toUpperCase();  // Ensure it's uppercase
      for (let i = 0; i < this.mfaCode.length; i++) {
        this.mfaCode[i] = pastedData[i] || '';
      }
    },
  },
  mounted() {
    this.$el.querySelector('input').focus();
  },
};
</script>
