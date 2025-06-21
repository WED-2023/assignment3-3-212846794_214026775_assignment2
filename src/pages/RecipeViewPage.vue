<template>
  <div class="min-h-screen bg-[#f8fcfa] font-family-plus-noto">
    <div class="max-w-5xl mx-auto p-6">
      <div v-if="recipe" class="bg-white rounded shadow-md p-6">
        <!-- Preview Info -->
        <div class="mb-6">
          <img :src="recipe.image" alt="Recipe Image" class="w-full h-64 object-cover rounded mb-4" />
          <h1 class="text-3xl font-bold mb-2">{{ recipe.title }}</h1>
          <div class="text-gray-600 mb-2">⏱️ {{ recipe.readyInMinutes }} minutes | ❤️ {{ recipe.popularity }} likes</div>
          <div class="flex flex-wrap gap-2 text-sm">
            <span v-if="recipe.isVegan" class="bg-green-100 text-green-700 px-2 py-1 rounded">Vegan</span>
            <span v-if="recipe.isVegetarian" class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Vegetarian</span>
            <span v-if="recipe.isGlutenFree" class="bg-purple-100 text-purple-700 px-2 py-1 rounded">Gluten-Free</span>
          </div>
        </div>

        <!-- Ingredients -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-2">Ingredients</h2>
          <ul class="list-disc list-inside text-gray-800">
            <li v-for="(item, index) in recipe.ingredients" :key="index">{{ item }}</li>
          </ul>
        </div>

        <!-- Instructions -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-2">Instructions</h2>
          <p class="text-gray-800 whitespace-pre-line">{{ recipe.instructions }}</p>
        </div>

        <!-- Servings -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-2">Servings</h2>
          <p class="text-gray-800">{{ recipe.servings }}</p>
        </div>

        <!-- Bonus: Start Preparation -->
        <div class="mt-8">
          <router-link
            :to="`/prepare/${recipe.id}`"
            class="inline-block bg-[#46a080] text-white font-semibold py-2 px-4 rounded hover:bg-[#35806a] transition"
          >
            Start Preparing This Recipe
          </router-link>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 text-lg">Loading recipe...</div>
    </div>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'RecipePage',
  components: {
    // AppHeader,
  },
  data() {
    return {
      recipe: null
    };
  },
  async created() {
    const recipeId = this.$route.params.id;
    try {
      this.recipe = await store.fetchRecipeById(recipeId);
    } catch (err) {
      console.error('Failed to load recipe:', err);
    }
  }
};
</script>

<style scoped>
.font-family-plus-noto {
  font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;
}
</style>