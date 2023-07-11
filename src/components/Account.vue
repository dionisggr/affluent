<template>
  <div
    class="flex flex-col w-full h-full items-center justify-center space-y-8 mt-6 overflow-auto pb-40 md:pb-32 xl:pb-0"
  >
    <div class="flex relative w-full h-8">
      <router-link
        to="/"
        class="top-2 left-1/4 bg-white text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 py-1 px-3 rounded-full text-center transition-all duration-200 ease-in-out"
        :class="{ absolute: !isMobile, 'mx-auto': isMobile }"
      >
        ← Back to Home
      </router-link>
    </div>
    <h2 class="text-4xl font-semibold text-blue-600 m-0 mb-2vw lg:mb-4">
      Account
    </h2>
    <div
      class="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4"
    >
      <div class="relative w-28 h-28 md:w-24 md:h-24">
        <img
          :src="userAvatar"
          alt="User Avatar"
          class="w-full h-full rounded-full border-2 border-gray-300 shadow object-cover object-center"
        />
        <input
          type="file"
          accept="image/*"
          ref="fileInput"
          @change="handleFileUpload"
          class="hidden"
        />
        <button
          @click="uploadAvatar"
          class="px-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-opacity-75"
        >
          Edit
        </button>
      </div>
    </div>
    <form
      @submit.prevent="updateAccount"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 max-w-lg w-full mx-auto px-4 md:px-0"
    >
      <input
        type="text"
        v-model="local.firstName"
        placeholder="First Name"
        class="w-full px-3 py-2 rounded border border-gray-300 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <input
        type="text"
        v-model="local.lastName"
        placeholder="Last Name"
        class="w-full px-3 py-2 rounded border border-gray-300 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <input
        type="text"
        v-model="local.username"
        placeholder="Username"
        class="w-full px-3 py-2 rounded border border-gray-300 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <input
        v-if="!isGoogleAccount"
        type="email"
        v-model="local.email"
        placeholder="Email"
        class="w-full px-3 py-2 rounded border border-gray-300 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        required
      />
      <div
        v-else
        class="w-full px-3 py-2 rounded bg-blue-100 flex items-center justify-center"
      >
        <span class="text-sm text-blue-500">{{ local.email }}</span>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="Google logo"
          class="h-4 ml-2"
        />
      </div>
      <button
        v-if="!isGoogleAccount"
        @click="$router.push(`/users/${local.id}/password/reset`)"
        class="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 w-fit mx-auto md:col-span-2"
      >
        Change Password
      </button>
      <button
        type="submit"
        :disabled="!isModified"
        class="px-16 py-2 text-white bg-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 w-fit mx-auto md:col-span-2"
        :class="{
          'bg-blue-700 hover:bg-blue-800': isModified,
          'opacity-20 cursor-not-allowed': !isModified,
        }"
      >
        Update Account
      </button>
      <button
        type="button"
        @click="showDeleteModal = true"
        class="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600 w-fit mx-auto md:col-span-2"
      >
        Delete Account
      </button>
    </form>
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded p-8">
        <h2 class="text-2xl font-semibold text-red-600 m-0 mb-2">
          Delete Account
        </h2>
        <p>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        <div class="mt-4 flex items-center space-x-4">
          <button
            @click="deleteAccount"
            class="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            Delete
          </button>
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '../utils';
import _ from 'lodash';
import service from '../service';

export default {
  async created() {
    const user = utils.getFromLocalStorage('user');

    this.user = utils.snakeToCamelCase({ username: null, ...user });
    this.local = { ...this.user };
    this.isGoogleAccount = user.is_google;

    window.addEventListener('resize', this.handleResize);
  },
  data() {
    return {
      user: {},
      local: {},
      isGoogleAccount: false,
      isModified: false,
      showDeleteModal: false,
      windowWidth: window.innerWidth,
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
        this.local.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async updateAccount() {
      const differences = _.pickBy(this.local, (value, key) => {
        return !_.isEqual(value, this.user[key])
      });
      
      if (_.isEmpty(differences)) return;

      try {
        await service.patch(`/users/${this.local.id}`,
          utils.camelToSnakeCase(differences)
        );

        this.user = { ...this.local };

        utils.upsertLocalStorage({ user: this.local });
      } catch (error) {
        console.error(error);
        this.$store.dispatch('alert', 'Something went wrong. Please try again.')
      }
    },
    toggleDeleteModal() {
      this.showDeleteModal = !this.showDeleteModal;
    },
    async deleteAccount() {
      try {
        await service.remove(`/users/${this.user.id}`);

        this.toggleDeleteModal();
        await this.$store.dispatch('logout');
      } catch (error) {
        console.error(error);
        this.$store.dispatch('alert', 'Something went wrong. Please try again.')
      }
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
  },
  computed: {
    userAvatar() {
      return this.local.avatar || 'https://via.placeholder.com/150';
    },
    isMobile() {
      return this.windowWidth <= 768;
    },
  },
  watch: {
    local: {
      handler() {
        this.isModified = !_.isEqual(this.local, this.user);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
input:focus {
  outline: none;
  border-color: blue;
}

button {
  transition: background-color 0.3s ease;
}

button:hover {
  box-shadow: 0 0.5em 0.5em -0.4em rgba(0, 0, 0, 0.15);
}
</style>
