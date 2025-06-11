<template>
  <div class="min-h-screen bg-[#f8fcfa] font-family-plus-noto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#0c1c17]">My Family Recipes</h1>
        <p class="mt-2 text-gray-600">
          A collection of cherished recipes passed down through generations or prepared for special family occasions.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#46a080] border-t-transparent"></div>
        <p class="mt-4 text-gray-600">Loading family recipes...</p>
      </div>

      <!-- Recipes List -->
      <div v-else-if="familyRecipes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="recipe in familyRecipes" :key="recipe.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <img
            :src="recipe.image || '/deafult_recipe_image.png'"
            alt="Family Recipe Image"
            class="w-full h-56 object-cover"
          />
          <div class="p-5">
            <h2 class="text-2xl font-semibold text-[#0c1c17] mb-2">{{ recipe.title }}</h2>
            <p class="text-gray-700 text-sm mb-3">
              <span class="font-medium">Recipe by:</span> {{ recipe.owner }}
            </p>
            <p class="text-gray-700 text-sm mb-4">
              <span class="font-medium">Occasion:</span> {{ recipe.occasion }}
            </p>

            <div class="mb-4">
              <h3 class="text-lg font-semibold text-[#0c1c17] mb-2">Ingredients</h3>
              <ul class="list-disc list-inside text-gray-800">
                <li v-for="(ingredient, i) in recipe.ingredients" :key="i" class="mb-1">
                  {{ ingredient }}
                </li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-[#0c1c17] mb-2">Instructions</h3>
              <ol class="list-decimal list-inside text-gray-800 space-y-2">
                <li v-for="(step, i) in recipe.instructions" :key="i">
                  {{ step }}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <div class="text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No family recipes added yet</h3>
          <p class="mt-1 text-gray-500">
            Start collecting those precious family recipes to display them here!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import store from '@/store';

export default {
  name: 'FamilyRecipesPage',
  setup() {
    const familyRecipes = ref([]);
    const isLoading = ref(true);

    const loadFamilyRecipes = async () => {
      try {
        isLoading.value = true;
        await store.fetchFamilyRecipes();
        familyRecipes.value = store.familyRecipes;
      } catch (error) {
        console.error('Error loading family recipes:', error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      loadFamilyRecipes();
    });

    return {
      familyRecipes,
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