<template>
  <div
    v-if="notification"
    class="fixed left-1/2 transform -translate-x-1/2 flex items-center justify-center z-50 mt-12 top-8 w-full"
  >
    <div class="bg-white p-4 rounded shadow-md">
      <p>{{ notification }}</p>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['notification']),
    isMobile() {
      return window.innerWidth < 768;
    }
  }
}
</script>
<style></style>