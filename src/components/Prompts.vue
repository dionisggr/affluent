<template>
  <div class="container mx-auto px-4 pt-6 pb-40">
    <div
      class="flex items-center justify-between mb-4 relative"
      :class="{ 'flex-col': isMobile }"
    >
      <router-link
        to="/"
        class="top-0 bg-white text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 py-1 px-3 rounded-full text-center transition-all duration-200 ease-in-out"
        :class="{ absolute: !isMobile }"
      >
        ← Back to Home
      </router-link>
      <h2 class="text-2xl font-bold m-auto" :class="{ 'mt-10': isMobile }">
        Saved Prompts
      </h2>
      <div v-if="!isMobile" class="mr-2">
        <button
          class="mr-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 outline-none"
          @click="viewMode = 'list'"
        >
          <i class="fas fa-list"></i>
        </button>
        <span class="border-r border-gray-400 mx-2"></span>
        <button
          class="text-gray-500 hover:text-gray-700 transition-colors duration-200 ml-2 outline-none"
          @click="viewMode = 'grid'"
        >
          <i class="fas fa-th"></i>
        </button>
      </div>
    </div>
    <div v-if="viewMode === 'list' && !isMobile">
      <div class="flex flex-wrap md:flex-nowrap gap-4">
        <div
          class="w-full md:w-1/3 overflow-auto h-fit bg-white shadow-lg rounded-lg"
        >
          <div
            v-for="prompt in prompts"
            :key="prompt.id"
            class="flex p-3 border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition duration-200 ease-in-out group"
            :class="{
              'bg-yellow-400 bg-opacity-20': promptEditingId === prompt.id,
              'bg-blue-100 hover:bg-blue-100': selectedPromptId === prompt.id,
            }"
            @click="selectPrompt(prompt.id)"
            v-on:mouseenter="editTitlePromptId = prompt.id"
            v-on:mouseleave="editTitlePromptId = null"
          >
            <input
              v-if="
                promptEditingId === prompt.id && editPromptLocation === 'list'
              "
              type="text"
              v-model="promptEditingTitle"
              class="border-2 rounded p-1 flex-grow outline-none border-none text-blue-600 text-lg font-semibold"
              v-focus
            />
            <div
              v-if="
                promptEditingId === prompt.id && editPromptLocation === 'list'
              "
              class="inline-flex items-center space-x-3 px-2"
            >
              <button
                @click.stop="saveEditPrompt"
                class="text-green-500 hover:text-green-600 transition-colors duration-200 hover:scale-125"
              >
                <i class="fas fa-check"></i>
              </button>
              <button
                @click.stop="cancelEditPrompt"
                class="text-red-500 hover:text-red-600 transition-colors duration-200 hover:scale-125"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div v-else class="flex justify-between items-center w-full">
              <div class="flex items-center space-x-2">
                <h3 class="text-lg font-semibold my-1 truncate text-blue-600">
                  {{ prompt.title }}
                </h3>
                <span
                  class="text-xs font-medium my-1 text-gray-500 opacity-0 group-hover:opacity-100"
                >
                  {{ prompt.model }}
                </span>
              </div>
              <i
                v-if="editTitlePromptId === prompt.id"
                class="fas fa-pencil-alt text-gray-400 cursor-pointer hover:text-gray-600 mr-3 mt-1"
                @click.stop="
                  setEditPromptId(prompt.id);
                  editPromptLocation = 'list';
                "
              ></i>
            </div>
          </div>
        </div>
        <div v-if="!prompts.length" class="text-center md:mt-12">
          This is where your saved prompts will show. <br /><br />
          If you had any...
        </div>
        <div class="w-full md:w-2/3" v-if="selectedPrompt">
          <div
            class="py-6 px-8 bg-white shadow-lg rounded-lg transition-all duration-500 ease-in-out overflow-scroll max-h-40"
            :style="{ maxHeight: '65vh' }"
          >
            <input
              v-if="
                promptEditingId === selectedPrompt?.id &&
                editPromptLocation === 'main'
              "
              type="text"
              v-model="promptEditingTitle"
              class="text-2xl font-bold mb-2 text-blue-700 outline-none py-2"
              v-focus
            />
            <div
              v-if="
                promptEditingId === selectedPrompt?.id &&
                editPromptLocation === 'main'
              "
              class="inline-flex items-center space-x-3 px-2 top-7 flex-grow"
            >
              <button
                @click.stop="saveEditPrompt"
                class="text-green-500 hover:text-green-600 transition-colors duration-200 hover:scale-125"
              >
                <i class="fas fa-check"></i>
              </button>
              <button
                @click.stop="cancelEditPrompt"
                class="text-red-500 hover:text-red-600 transition-colors duration-200 hover:scale-125"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="flex items-center mb-2 group" v-else>
              <h2
                class="main-prompt-title text-2xl font-bold py-2 text-blue-700 inline-block"
              >
                {{ selectedPrompt?.title }}
              </h2>
              <i
                v-if="promptEditingId !== selectedPrompt?.id"
                class="fas fa-pencil-alt text-gray-400 cursor-pointer hover:text-gray-600 ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                @click.stop="
                  setEditPromptId(selectedPrompt?.id);
                  editPromptLocation = 'main';
                "
              ></i>
            </div>
            <p class="text-gray-700" v-html="compiledMarkdown"></p>
            <div class="mt-4 flex justify-between items-center">
              <div class="mt-4 flex justify-center items-center">
                <button
                  v-if="!isCopied"
                  class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                  @click="copyToClipboard"
                >
                  Copy
                </button>
                <div
                  v-else
                  class="px-3 my-1 border bg-green-600 text-white rounded"
                >
                  Copied to clipboard!
                </div>
              </div>
              <div v-if="deletionCandidate !== selectedPrompt?.id">
                <button
                  @click="deletionCandidate = selectedPrompt?.id"
                  class="text-red-500 hover:text-red-600 transition-colors duration-200 mx-2"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <div v-else class="flex space-x-2">
                <button
                  @click="deletePrompt(selectedPrompt?.id)"
                  class="text-green-500 hover:text-green-600 transition-colors duration-200"
                >
                  <i class="fas fa-check"></i>
                </button>
                <button
                  @click="deletionCandidate = null"
                  class="text-red-500 hover:text-red-600 transition-colors duration-200"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="!prompts.length" class="text-center md:w-2/3 md:mt-16">
        This is where your saved prompts will show. <br /><br />
        If you had any...
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          class="bg-white shadow-lg rounded-lg px-5 py-6 hover:shadow-2xl transform transition-all duration-500 ease-in-out"
          v-for="prompt in prompts"
          :key="prompt.id"
        >
          <div class="flex items-center" v-if="promptEditingId === prompt.id">
            <input
              type="text"
              v-model="promptEditingTitle"
              class="border-2 rounded pb-2 flex-grow outline-none border-none text-blue-600 text-lg font-semibold w-full"
              v-focus
            />
            <div class="inline-flex items-center space-x-6 px-2">
              <button
                @click.stop="saveEditPrompt"
                class="text-green-500 hover:text-green-600 transition-colors duration-200 hover:scale-125"
              >
                <i class="fas fa-check"></i>
              </button>
              <button
                @click.stop="cancelEditPrompt"
                class="text-red-500 hover:text-red-600 transition-colors duration-200 hover:scale-125"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div class="flex items-center group mb-2">
            <div>
              <h3
                class="text-lg font-bold truncate text-blue-700"
                @click.stop="
                  if (isMobile) {
                    setEditPromptId(prompt.id);
                    editPromptLocation = 'list';
                  }
                "
              >
                {{ prompt.title }}
              </h3>
              <span class="text-sm text-gray-500">
                {{ prompt.model }}
              </span>
            </div>
            <i
              class="fas fa-pencil-alt text-gray-400 cursor-pointer opacity-0 hover:text-gray-600 mx-3 group-hover:opacity-100"
              @click.stop="
                setEditPromptId(prompt.id);
                editPromptLocation = 'list';
              "
            ></i>
          </div>

          <p
            class="text-sm text-gray-500 leading-6 line-clamp-3"
            v-html="compileToMarkdown(prompt.prompt)"
          ></p>
          <div class="mt-4 flex justify-between items-center">
            <button
              @click="viewPrompt(prompt)"
              class="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
            >
              View
            </button>
            <span class="mx-2 text-gray-500 text-xs w-full inline-block" :style="{marginLeft: '15px'}">
              {{ prompt.model }}
            </span>
            <div v-if="deletionCandidate !== prompt.id">
              <button
                @click="deletionCandidate = prompt.id"
                class="text-red-500 hover:text-red-600 transition-colors duration-200"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <div v-else class="flex space-x-6">
              <button
                @click="deletePrompt(prompt.id)"
                class="text-green-500 hover:text-green-600 transition-colors duration-200"
              >
                <i class="fas fa-check"></i>
              </button>
              <button
                @click="deletionCandidate = null"
                class="text-red-500 hover:text-red-600 transition-colors duration-200"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 p-4"
    v-if="viewingPrompt"
    @click.self="viewingPrompt = null"
  >
    <div
      class="prompt-modal bg-white rounded-lg w-full max-w-md p-8 overflow-y-auto max-h-4/5 absolute"
      :style="{ maxHeight: '75vh', top: '100px' }"
    >
      <button
        class="absolute top-4 right-4 bg-transparent border-0 text-2xl cursor-pointer text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-2"
        @click.stop="viewingPrompt = null"
      >
        <i class="fas fa-times"></i>
      </button>
      <h2 class="text-2xl font-bold mb- text-blue-700">
        {{ viewingPrompt.title }}
      </h2>
      <p class="text-sm text-gray-500 leading-6" v-html="compiledMarkdown"></p>
      <div class="mt-8 flex justify-center items-center">
        <button
          v-if="!isCopied"
          class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
          @click="copyToClipboard"
        >
          Copy
        </button>
        <div v-else class="px-3 border bg-green-600 text-white rounded">
          Copied to clipboard!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import copy from 'clipboard-copy';
import service from '../service';

export default {
  async beforeCreate() {
    try {
      this.prompts = await service.get('/prompts');

      this.selectedPromptId = this.prompts[0]?.id;

      window.addEventListener('resize', this.handleResize);
    } catch (error) {
      console.error(error);
      this.$store.dispatch('alert', 'Something went wrong. Please try again.');
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  data() {
    return {
      prompts: [],
      selectedPromptId: null,
      editPromptLocation: null,
      viewMode: 'list',
      deletionCandidate: null,
      isCopied: false,
      viewingPrompt: null,
      windowWidth: window.innerWidth,
      editTitlePromptId: null,
      promptEditingId: null,
      promptEditingTitle: null,
    };
  },
  methods: {
    selectPrompt(id) {
      this.selectedPromptId = id;
    },
    setEditPromptId(id) {
      this.selectPrompt(id);

      this.promptEditingId = id;
      this.promptEditingTitle = this.selectedPrompt?.title;
    },
    async deletePrompt(id) {
      this.prompts = this.prompts?.filter((prompt) => prompt.id !== id);
      this.deletionCandidate = null;
      this.selectedPromptId = this.prompts[0]?.id;

      try {
        await service.remove(`/prompts/${id}`);

        this.$store.dispatch('alert', 'Prompt deleted.');
      } catch (error) {
        console.error(error);
        this.$store.dispatch(
          'alert',
          'Something went wrong. Please try again.'
        );
      }
    },
    async saveEditPrompt() {
      let newTitle = this.promptEditingTitle.trim();

      this.prompts.forEach((prompt) => {
        if (prompt.id === this.promptEditingId) {
          prompt.title = newTitle;
        }
      });

      if (!newTitle) {
        newTitle = 'Untitled Prompt';
      } else if (!this.selectedPrompt) {
        this.$store.dispatch('alert', 'No prompt selected.');
        return;
      }

      try {
        await service.patch(`/prompts/${this.promptEditingId}`, {
          title: newTitle,
        });

        this.cancelEditPrompt();
        this.$store.dispatch('alert', 'Prompt saved!');
      } catch (error) {
        console.error(error);
        this.$store.dispatch(
          'alert',
          'Something went wrong. Please try again.'
        );
      }
    },
    cancelEditPrompt() {
      this.promptEditingId = null;
      this.promptEditingTitle = null;
    },
    viewPrompt(prompt) {
      this.viewingPrompt = prompt;
    },
    copyToClipboard() {
      copy((this.viewingPrompt || this.selectedPrompt).prompt);
      this.$store.dispatch('alert', 'Copied to clipboard!');
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    compileToMarkdown(prompt) {
      const md = new MarkdownIt();
      return md.render(prompt || '');
    },
  },
  computed: {
    selectedPrompt() {
      return this.prompts?.filter(
        (prompt) => prompt.id === this.selectedPromptId
      )?.[0];
    },
    isMobile() {
      return this.windowWidth <= 768;
    },
    compiledMarkdown() {
      const md = new MarkdownIt();
      return md.render(
        this.selectedPrompt?.prompt || this.viewingPrompt?.prompt || ''
      );
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 960px;
}

.prompt-modal {
  width: 90%;
}

h2 {
  margin-bottom: 2rem;
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.rounded-lg {
  border-radius: 0.5rem;
}
.main-prompt-title {
  margin-bottom: 0;
}
</style>
