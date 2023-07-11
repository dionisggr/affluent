<template>
  <div class="min-h-screen flex flex-col font-sans bg-gray-200 relative">
    <header
      class="py-4 px-8 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md z-20"
    >
      <div class="flex justify-between items-center max-w-1200 mx-auto">
        <a href="/">
          <h1
            class="text-2xl font-bold text-white text-center animate__animated animate__fadeInDown"
          >
            PromptWiz
          </h1>
        </a>
        <div class="lg:hidden">
          <button
            @click="open = !open"
            class="flex items-center px-3 py-2 border rounded text-white border-white hover:text-white hover:border-white"
          >
            <svg
              class="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <nav class="lg:block hidden">
          <ul class="flex space-x-6 lg:space-x-12 lg:mr-4">
            <li v-if="isLoggedIn">
              <router-link to="/" class="text-white">Home</router-link>
            </li>
            <li v-if="isLoggedIn">
              <router-link to="/prompts" class="text-white"
                >My Prompts</router-link
              >
            </li>
            <li v-if="!isLoggedIn">
              <router-link to="/signup" class="text-white">Sign-Up</router-link>
            </li>
            <li v-if="!isLoggedIn">
              <router-link to="/login" class="text-white">Login</router-link>
            </li>
            <li v-if="isLoggedIn">
              <router-link to="/account" class="text-white"
                >Account</router-link
              >
            </li>
            <li v-if="isLoggedIn">
              <a href="#" @click="logout" class="text-white">Logout</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <transition name="slide-down">
      <div
        v-if="open"
        class="fixed inset-0 flex flex-col bg-black bg-opacity-50 backdrop-blur-lg z-50"
        @click.self="open = false"
      >
        <nav
          class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-8 text-center flex justify-center items-center"
          :style="{ paddingTop: '4rem', minHeight: '65vh' }"
        >
          <button
            @click.stop="open = false"
            class="absolute top-4 right-4 bg-white rounded-full p-2 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-6 h-6 text-blue-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <ul class="flex flex-col space-y-6 md:space-y-12 py-10">
            <li v-if="isLoggedIn" class="py-4 md:py-5">
              <router-link
                to="/"
                class="text-white text-xl md:text-2xl font-semibold hover:underline"
                @click.native="open = false"
                >Home</router-link
              >
            </li>
            <li v-if="isLoggedIn" class="py-4 md:py-5">
              <router-link
                to="/prompts"
                class="text-white text-xl md:text-2xl font-semibold hover:underline"
                @click.native="open = false"
                >My Prompts</router-link
              >
            </li>
            <li v-if="!isLoggedIn" class="py-4 md:py-5">
              <router-link
                to="/signup"
                class="text-white text-xl md:text-2xl font-semibold hover:underline"
                @click.native="open = false"
                >Sign-Up</router-link
              >
            </li>
            <li v-if="!isLoggedIn" class="py-4 md:py-5">
              <router-link
                to="/login"
                class="text-white text-xl md:text-2xl font-semibold hover:underline"
                @click.native="
                  isLoggedIn = !isLoggedIn;
                  open = false;
                "
                >Login</router-link
              >
            </li>
            <li v-if="isLoggedIn" class="py-4 md:py-5">
              <router-link
                to="/account"
                class="text-white text-xl md:text-2xl font-semibold hover:underline"
                @click.native="open = false"
                >Account</router-link
              >
            </li>
            <li v-if="isLoggedIn" class="py-4 md:py-5">
              <a
                href="#"
                @click.stop="
                  logout();
                  open = false;
                "
                class="text-white text-xl md:text-2xl font-semibold hover:underline"
                >Logout</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </transition>
    <!-- <div v-if="!hasOpenAIApiKey && $route.path === '/'">
      <div class="absolute inset-0 bg-gray-500 bg-opacity-50 z-10"></div>
      <div
        class="absolute inset-0 flex items-center justify-center z-10 bottom-1/4"
      >
        <div class="bg-white p-4 rounded shadow-md">
          <h4 class="mb-2">Enter your OpenAI API Key first!</h4>
          <input
            type="text"
            v-model="openAIApiKey"
            placeholder="OpenAI API Key"
            class="mb-2 w-full border p-2 rounded"
          />
          <button
            @click="updateApiKey"
            class="w-full py-2 px-4 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div> -->
    <router-view v-if="$route.path !== '/'"></router-view>
    <main
      v-else
      class="flex-grow container mx-auto px-4 pb-6 mt-2vw overflow-scroll"
    >
      <div
        class="max-w-lg mx-auto bg-white p-6 py-8 rounded-lg shadow-md animate__animated animate__fadeInUp"
      >
        <h3
          class="text-center text-lg font-semibold text-gray-700 animate__animated animate__fadeIn mt-4 mb-2"
        >
          Boost your creative genius!
        </h3>
        <div v-if="!$route.query.model" class="dalle-welcome">
          <router-link
            to="?model=dalle"
            class="text-center text-sm font-bold text-blue-600 animate__animated animate__fadeIn mt-4 mb-8 block"
            style="text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2)"
            :style="{ textDecoration: 'underline' }"
          >
            Try the DALL-E version
          </router-link>
        </div>
        <div v-if="$route.query.model === 'dalle'" class="dalle-welcome">
          <h4
            class="text-center text-lg font-bold text-blue-600 animate__animated animate__fadeIn mt-4"
            style="text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2)"
          >
            — DALL-E Version —
          </h4>
          <p class="text-center mb-8">
            <router-link
              to="/"
              class="text-xs leading-5 text-indigo-500 hover:text-yellow-500 underline animate__animated animate__fadeIn transition-colors duration-300"
              :style="{ textDecoration: 'underline'}"
            >
              Switch to ChatGPT
            </router-link>
          </p>
        </div>
        <div class="form-group mb-4 relative">
          <label
            class="block text-gray-700 text-md font-semibold mb-2 animate__animated animate__fadeInLeft"
            for="InputArea"
          >
            Your original prompt here:
          </label>
          <textarea
            id="InputArea"
            v-bind:value="prompt" 
            @input="(e) => prompt = e.target.value"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline h-32 resize-none transition-all ease-in-out duration-500 animate__animated animate__fadeInRight"
            rows="6"
            placeholder="Write your prompt, watch magic happen."
            @keydown="handleKeyDown"
            title="Write your prompt in this area and click 'Enhance' to see the magic!"
          ></textarea>
          <button
            :disabled="!prompt"
            @click="showModal = true"
            class="absolute right-0 bottom-0 mb-3 mr-2 px-2 py-1 text-xs text-white rounded-lg focus:outline-none transition-all ease-in-out duration-500 animate__animated animate__fadeInUp shadow-md"
            :class="{
              'bg-yellow-400 hover:bg-yellow-700': prompt,
              'bg-yellowish-gray opacity-50 cursor-not-allowed': !prompt,
            }"
          >
            Clear
          </button>
        </div>
        <div class="mb-6">
          <div class="flex justify-center md:mb-4">
            <div
              @click="format = 'paragraph'"
              class="inline-flex items-center rounded-md px-3 py-2 m-2 cursor-pointer transition-colors duration-300"
              :class="
                format === 'paragraph'
                  ? 'bg-indigo-500 text-white font-bold'
                  : 'border border-gray-300 text-gray-700'
              "
            >
              <input
                type="radio"
                id="paragraph"
                value="paragraph"
                v-model="format"
                class="hidden"
              />
              <label for="paragraph" class="cursor-pointer">Paragraph</label>
            </div>
            <div
              @click="format = 'structured'"
              class="inline-flex items-center rounded-md px-3 py-2 m-2 cursor-pointer transition-colors duration-300"
              :class="
                format === 'structured'
                  ? 'bg-indigo-500 text-white font-bold'
                  : 'border border-gray-300 text-gray-700'
              "
            >
              <input
                type="radio"
                id="structured"
                value="structured"
                v-model="format"
                class="hidden"
              />
              <label for="structured" class="cursor-pointer">Structured</label>
            </div>
          </div>
        </div>
        <div class="flex justify-center mb-4">
          <button
            :disabled="!prompt"
            @click="enhance"
            class="px-8 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none transition-all ease-in-out duration-500 animate__animated animate__fadeInUp shadow-md"
          >
            Enhance
          </button>
        </div>
      </div>
      <div
        v-if="showModal"
        class="fixed z-10 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-black bg-opacity-20 transition-opacity h-screen"
            aria-hidden="true"
          ></div>
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
          <div
            class="inline-block bg-white rounded-lg text-left px-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-right w-full">
                  <h3
                    class="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    You sure?
                  </h3>
                </div>
              </div>
            </div>
            <div
              class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
            >
              <button
                @click="
                  clearInput();
                  showModal = false;
                "
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              >
                Yes, Clear it
              </button>
              <button
                @click="showModal = false"
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer
      :class="`${
        isFooterFixed ? 'fixed' : 'absolute'
      } fixed bottom-0 left-0 right-0 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center z-20`"
    >
      <p
        class="text-sm sm:text-base md:text-lg lg:text-xl animate__animated animate__fadeInUp w-full"
      >
        © 2023 PromptWiz. All rights reserved.
      </p>
    </footer>
  </div>
  <div
    v-if="showPromptModal"
    class="absolute flex justify-center align-center z-10 inset-0 overflow-y-auto h-[75vh]"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="showPromptModal = false"
      ></div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen text-lg"
        aria-hidden="true"
      >
        &#8203;
      </span>
      <div
        class="inline-block h-fit mt-8 align-bottom bg-white rounded-lg text-left overflow-scroll shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full"
        :style="{
          maxHeight: '75vh',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          marginTop: isMobile ? '10vh' : '0',
        }"
      >
        <div class="bg-white px-4 pt-5 sm:p-6 sm:pb-4 relative">
          <button
            @click="showPromptModal = false"
            class="w-full text-gray-500 text-2xl hover:text-gray-800 border-none outline-none hover:outline-none"
            :style="{ textAlign: 'right', paddingRight: '5px' }"
          >
            &times;
          </button>
          <div class="sm:flex sm:items-end justify-between">
            <h3
              class="text-xl leading-6 font-medium text-gray-800 pb-2"
              id="modal-title"
            >
              Your enhanced prompt:
            </h3>
          </div>
          <div class="mt-2 mb-8">
            <p
              class="text-sm text-gray-500 leading-6"
              v-html="compiledMarkdown"
            ></p>
          </div>
        </div>
        <div
          class="bg-gray-50 px-4 py-3 sm:px-6 flex sm:flex-row-reverse relative"
          :class="{ 'justify-center': isMobile }"
        >
          <button
            @click="showSaveModal = true"
            type="button"
            class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            :class="{ 'py-2 w-full': !isMobile, 'py-1 w-fit mx-2': isMobile }"
          >
            Save
          </button>
          <button
            @click="copyToClipboard"
            type="button"
            class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            :class="{ 'py-2 w-full': !isMobile, 'py-1 w-fit mx-2': isMobile }"
          >
            Copy
          </button>
          <div
            v-if="showSaveModal"
            class="fixed z-10 inset-0 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div
              class="flex justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            >
              <div
                class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
                :style="{ height: '100vh' }"
              ></div>
              <span
                class="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
                >&#8203;</span
              >
              <div
                class="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-top sm:max-w-lg w-full"
                :style="{ marginBottom: '25%' }"
              >
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      class="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Save as
                    </h3>
                    <div class="mt-2">
                      <input
                        v-model="promptTitle"
                        type="text"
                        ref="titleInput"
                        class="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md mt-2"
                        placeholder="Enter new name"
                        required
                        @keyup.enter="savePrompt"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                >
                  <button
                    @click="savePrompt"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    @click="showSaveModal = false"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            v-show="copied"
            class="animate__animated animate__fadeInUp absolute mb-2 right-40 transform -translate-x-1/2 px-3 py-1 mt-1 text-xs text-white bg-green-500 rounded-lg"
          >
            Copied to clipboard!
          </div>
          <div
            v-show="saved"
            class="animate__animated animate__fadeInUp absolute right-1/3 bottom-6 transform -translate-x-1/2 px-3 py-1 text-xs text-white bg-blue-500 rounded-lg"
          >
            Prompt saved!
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="showLoadingModal"
    class="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out"
  >
    <div
      class="p-6 bg-white rounded-lg shadow-xl flex items-center justify-center mb-32"
    >
      <svg
        class="animate-spin h-10 w-10 text-indigo-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8h-2c0-3.314-2.686-6-6-6V0c2.209 0 4 1.791 4 4a4 4 0 01-4 4H4z"
        ></path>
      </svg>
      <div class="ml-3 mt-1 text-sm font-medium text-gray-700">
        Working on it...
      </div>
    </div>
  </div>
  <Notification></Notification>
</template>

<script>
import MarkdownIt from 'markdown-it';
import service from '../service';
import utils from '../utils';
import Notification from './Notification.vue';

export default {
  mounted() {
    this.hasOpenAIApiKey = utils.getFromLocalStorage('hasOpenAIApiKey');
  },
  data() {
    return {
      prompt: '',
      promptTitle: '',
      format: 'paragraph',
      showModal: false,
      showPromptModal: false,
      showLoadingModal: false,
      showSaveModal: false,
      hasOpenAIApiKey: false,
      openAIApiKey: null,
      enhancedPrompt: '',
      isMobile: window.innerWidth < 768,
      copied: false,
      saved: false,
      open: false,
    };
  },
  methods: {
    setup() {
      const isMenuOpen = ref(false);
      const isLargeScreen = ref(window.innerWidth > 1024);

      const checkScreenSize = () => {
        isLargeScreen.value = window.innerWidth > 1024;
      };

      onMounted(() => {
        window.addEventListener('resize', checkScreenSize);
      });

      onBeforeUnmount(() => {
        window.removeEventListener('resize', checkScreenSize);
      });

      return { isMenuOpen, isLargeScreen };
    },
    async enhance() {
      this.toggleLoading();

      try {
        const param = this.$route.query.model || this.format;
        this.enhancedPrompt = await service.post(`/enhance/${param}`, {
          prompt: this.prompt,
        });
        this.showPromptModal = true;

        this.toggleLoading();
      } catch (error) {
        this.toggleLoading();
        console.error(error);
        this.$store.dispatch(
          'alert',
          'Something went wrong. Please try again.'
        );
      }
    },
    clearInput() {
      this.prompt = '';
    },
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.enhancedPrompt);

      this.$store.dispatch('alert', 'Copied to clipboard!');
    },
    async savePrompt() {
      try {
        await service.post('/prompts', {
          title: this.promptTitle,
          prompt: this.enhancedPrompt,
        });

        this.promptTitle = '';
        this.showSaveModal = false;

        this.$store.dispatch('alert', 'Prompt saved!');
      } catch (error) {
        console.error(error);
      }
    },
    toggleLoading() {
      this.showLoadingModal = !this.showLoadingModal;
    },
    async logout() {
      await this.$store.dispatch('logout');
    },
    async updateApiKey() {
      const user = utils.getFromLocalStorage('user');

      if (!user?.id) {
        this.$store.dispatch(
          'alert',
          'Something went wrong. Please try again.'
        );
      }

      try {
        await service.patch(`/users/${user.id}`, {
          data: { openai_api_key: this.openAIApiKey },
        });

        utils.upsertLocalStorage({ hasOpenAIApiKey: true });

        this.hasOpenAIApiKey = true;

        this.$store.dispatch('alert', 'OpenAI API key updated successfully.');
      } catch (error) {
        console.error(error);
        this.$store.dispatch(
          'alert',
          'Something went wrong. Please try again.'
        );
      }
    },
    handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        this.enhance();
      }
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    compiledMarkdown() {
      const md = new MarkdownIt();
      return md.render(this.enhancedPrompt);
    },
    isFooterFixed() {
      return !['/signup', '/account', '/prompts'].includes(this.$route.path);
    },
  },
  watch: {
    showSaveModal(newVal) {
      if (newVal) {
        this.promptTitle = 'New Prompt';
        this.$nextTick(() => {
          this.$refs.titleInput.focus();
        });
      }
    },
  },
  components: {
    Notification,
  },
};
</script>
<style scoped>
::-webkit-scrollbar {
  display: none;
}

code,
.language-markdown {
  max-width: 100%;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}

.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0%);
}
</style>
