<template>
  <div class="relative flex min-h-screen flex-col bg-[#f8fcfa] font-family-plus-noto">
    <div class="layout-container flex h-full grow flex-col">
 
      <!-- 2. Hero Section -->
      <div class="relative w-full h-[500px] flex items-center justify-center">
        <div class="absolute inset-0 bg-gradient-to-r from-[#46a080]/90 to-[#0c1c17]/90 z-10"></div>
        <div
          class="absolute inset-0 bg-cover bg-center"
          style="background-image: url('/background_main.avif');"
        ></div>
        <div class="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 class="text-white text-5xl font-bold mb-6 leading-tight">
            Discover Your Next Favorite Recipe
          </h1>
          <p class="text-white/90 text-xl mb-8">
            Explore thousands of recipes, create your own, and share with the community
          </p>
        </div>
      </div>

      <!-- 3. Main Content Split Layout -->
      <section class="flex flex-col md:flex-row gap-8 w-full max-w-[1600px] mx-auto px-8 py-12">
        <!-- Left Column: Explore Random Recipes -->
        <div class="md:w-1/2">
          <h2 class="text-2xl font-bold text-[#0c1c17] mb-4">Explore These Recipes</h2>
          <RecipePreviewList :recipes="randomRecipes" />
          <button
            @click="loadRandomRecipes"
            class="mt-4 px-4 py-2 bg-[#46a080] text-white rounded hover:bg-[#35806a] transition"
          >
            Get New Recipes
          </button>
        </div>

        <!-- Right Column: Last Watched / Login Prompt -->
        <div class="md:w-1/2">
          <h2 class="text-2xl font-bold text-[#0c1c17] mb-4">
            {{ store.isAuthenticated ? 'Last Watched Recipes' : 'Login to Your Account' }}
          </h2>

          <div v-if="store.isAuthenticated">
            <RecipePreviewList :recipes="store.lastWatchedRecipes.slice(0, 3)" />
          </div>

          <div v-else class="space-y-4 bg-white p-6 rounded shadow-md">
            <h3 class="text-lg font-semibold text-[#0c1c17]">Welcome back! Please log in to view your last watched recipes.</h3>
            <form @submit.prevent="submitLogin" class="space-y-4">
              <div>
                <label class="block font-medium mb-1">Username</label>
                <input v-model="loginForm.username" type="text" class="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
              <div>
                <label class="block font-medium mb-1">Password</label>
                <input v-model="loginForm.password" type="password" class="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
              <button type="submit" class="w-full bg-[#46a080] text-white font-semibold py-2 rounded hover:bg-[#35806a]">
                Login
              </button>
            </form>
            <router-link
              to="/register"
              class="block w-full text-center py-2 border border-[#46a080] text-[#46a080] font-semibold rounded hover:bg-[#e6f4f1]"
            >
              Register
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from '@/components/RecipePreviewList.vue';
import store from '@/store';

export default {
  name: 'MainPage',
  components: {
    RecipePreviewList,
  },
  data() {
    return {
      randomRecipes: [],
      loginForm: {
        username: '',
        password: ''
      }
    };
  },
  computed: {
    store() {
      return store;
    }
  },
  methods: {
    async loadRandomRecipes() {
      try {
        const response = await store.fetchRecipes();
        const shuffled = [...response].sort(() => 0.5 - Math.random());
        this.randomRecipes = shuffled.slice(0, 3);
      } catch (error) {
        console.error('Error loading random recipes:', error);
      }
    },
    async submitLogin() {
      try {
        await store.login(this.loginForm);
        await store.fetchLastWatchedRecipes();
      } catch (err) {
        alert(err.message || 'Login failed');
      }
    }
  },
  async created() {
    await this.loadRandomRecipes();
    if (store.isAuthenticated) {
      await store.fetchLastWatchedRecipes();
    }
  }
};
</script>

<style scoped>
.font-family-plus-noto {
  font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;
}
</style>
