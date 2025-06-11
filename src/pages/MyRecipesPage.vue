<template>
    <div class="min-h-screen bg-[#f8fcfa] font-family-plus-noto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-[#0c1c17]">My Recipes</h1>
          <p class="mt-2 text-gray-600">All the recipes you've created</p>
        </div>
  
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#46a080] border-t-transparent"></div>
          <p class="mt-4 text-gray-600">Loading your recipes...</p>
        </div>
  
        <!-- Empty State -->
        <div v-else-if="recipes.length === 0" class="text-center py-12">
          <div class="text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">No recipes yet</h3>
            <p class="mt-1 text-gray-500">Start creating your own recipes to see them here.</p>
            <div class="mt-6">
              <button 
                @click="openCreateRecipeModal" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#46a080] hover:bg-[#35806a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#46a080]"
              >
                Create Recipe
              </button>
            </div>
          </div>
        </div>
  
        <!-- Recipes List -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecipePreview
            v-for="recipe in recipes"
            :key="recipe.id"
            :recipe="recipe"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
    name: 'MyRecipesPage',
    components: {
      RecipePreview
    },
    setup() {
      const recipes = ref([]);
      const isLoading = ref(true);
  
      const loadRecipes = async () => {
        try {
          isLoading.value = true;
          // We'll need to add this method to the store
          await store.fetchMyRecipes();
          recipes.value = store.recipes;
        } catch (error) {
          console.error('Error loading recipes:', error);
        } finally {
          isLoading.value = false;
        }
      };
  
      const openCreateRecipeModal = () => {
        // Emit event to parent to open create recipe modal
        window.dispatchEvent(new CustomEvent('openCreateRecipeModal'));
      };
  
      onMounted(() => {
        loadRecipes();
      });
  
      return {
        recipes,
        isLoading,
        openCreateRecipeModal
      };
    }
  };
  </script>
  
  <style scoped>
  .font-family-plus-noto {
    font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;
  }
  </style>