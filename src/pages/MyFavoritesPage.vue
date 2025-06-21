<template>
  <div class="min-h-screen bg-[#f8fcfa] font-family-plus-noto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#0c1c17]">My Favorite Recipes</h1>
        <p class="mt-2 text-gray-600">All the recipes you've marked as favorites</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#46a080] border-t-transparent"></div>
        <p class="mt-4 text-gray-600">Loading your favorite recipes...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="favorites.length === 0" class="text-center py-12">
        <div class="text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No favorites yet</h3>
          <p class="mt-1 text-gray-500">Start adding recipes to your favorites to see them here.</p>
          <div class="mt-6">
            <router-link to="/search" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#46a080] hover:bg-[#35806a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#46a080]">
              Browse Recipes
            </router-link>
          </div>
        </div>
      </div>

      <!-- Favorites List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        <RecipePreview
          v-for="recipe in favorites"
          :key="recipe.id || recipe.recipe_id"
          :recipe="recipe"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import RecipePreview from '@/components/RecipePreview.vue';
import store from '@/store';

export default {
  name: 'MyFavoritesPage',
  components: {
    RecipePreview
  },
  setup() {
    const favorites = ref([]);
    const isLoading = ref(true);

    const loadFavorites = async () => {
      try {
        isLoading.value = true;
        const response = await store.fetchFavorites();
        favorites.value = response;
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      loadFavorites();
    });

    return {
      favorites,
      isLoading
    };
  }
};
</script>

<style scoped>
.font-family-plus-noto {
  font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;
}
</style> 