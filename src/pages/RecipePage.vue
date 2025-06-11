<template>
  <div class="min-h-screen bg-[#f8fcfa] font-family-plus-noto">
    <div class="max-w-5xl mx-auto p-6">
      <div v-if="recipe" class="bg-white rounded-lg shadow-md p-6">
        <!-- Preview Card -->
        <div class="relative group cursor-pointer mb-6" @click="goToRecipe" @keydown.enter="goToRecipe" role="button" tabindex="0">
          <img :src="recipe.image || '/deafult_recipe_image.png'" alt="Recipe Image" class="w-full h-64 object-cover rounded group-hover:opacity-90 transition" />
          <span class="absolute bottom-2 left-2 bg-black text-white text-xs px-2 py-1 rounded opacity-75 group-hover:opacity-100">
            Click to view
          </span>
        </div>

        <!-- Title & Meta -->
        <h1 class="text-3xl font-bold mb-2">{{ recipe.title }}</h1>
        <div class="text-sm text-gray-600 flex items-center gap-4 mb-3">
          <span>⏱️ {{ recipe.readyInMinutes }} minutes</span>
          <span>❤️ {{ recipe.popularity || 0 }} likes</span>
        </div>

        <!-- Tags and Indicators -->
        <div class="flex flex-wrap gap-2 text-xs mb-2">
          <span v-if="recipe.isVegan" class="bg-green-100 text-green-700 px-2 py-1 rounded">Vegan</span>
          <span v-if="recipe.isVegetarian" class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Vegetarian</span>
          <span v-if="recipe.isGlutenFree" class="bg-purple-100 text-purple-700 px-2 py-1 rounded">Gluten-Free</span>
          <span v-if="isWatched" class="bg-blue-100 text-blue-700 px-2 py-1 rounded">Watched</span>
        </div>
        <!-- Favorite Button -->
        <div class="mb-4">
          <button
            @click.stop="toggleFavorite"
            :class="[
              isFavorite 
                ? 'bg-gray-500 hover:bg-gray-600' 
                : 'bg-red-500 hover:bg-red-600',
              'text-white px-4 py-2 rounded text-sm'
            ]"
          >
            {{ isFavorite ? '❤️ Remove from Favorites' : '❤️ Add to Favorites' }}
          </button>
        </div>

        <!-- Ingredients -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-2">Ingredients</h2>
          <ul class="list-disc list-inside text-gray-800">
            <li v-for="(item, index) in parsedIngredients" :key="index" class="mb-1">
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Instructions -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-2">Instructions</h2>
          <p class = "text-gray-800 whitespace-pre-line">{{ recipe.instructions }}</p>
        </div>

        <!-- Servings -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-2">Servings</h2>
          <p class="text-gray-800">{{ recipe.servings }}</p>
        </div>

        <!-- Preparation Link -->
        <div class="mt-8">
          <router-link
            :to="`/prepare/${recipe.id || recipe.recipe_id}`"
            class="inline-block bg-[#46a080] text-white font-semibold py-2 px-4 rounded hover:bg-[#35806a] transition"
          >
            Start Preparing This Recipe
          </router-link>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 text-lg py-10">Loading recipe...</div>
    </div>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'RecipePage',
  components: {
  },
  data() {
    return {
      recipe: null
    };
  },
  computed: {
    parsedIngredients() {
      if (!this.recipe || !this.recipe.extendedIngredients) return [];
      if (Array.isArray(this.recipe.extendedIngredients)) {
        return this.recipe.extendedIngredients.map(ing => {
          if (typeof ing === 'string') return ing;
          return ing.original || JSON.stringify(ing);
        });
      }
      try {
        const parsed = JSON.parse(this.recipe.extendedIngredients);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return this.recipe.extendedIngredients.split(',').map(item => item.trim());
      }
      return [];
    },
    isFavorite() {
      return store.favorites.some(fav => fav.id === this.recipe.id || fav.recipe_id === this.recipe.recipe_id);
    },
    isWatched() {
      return store.lastWatchedRecipes.some(r => r.id === this.recipe.id || r.recipe_id === this.recipe.recipe_id);
    }
  },
  methods: {
    goToRecipe() {
      const id = this.recipe.id || this.recipe.recipe_id;
      if (id) this.$router.push(`/recipes/${id}`);
    },
    async addToFavorites() {
      try {
        await store.addFavorite(this.recipe.id || this.recipe.recipe_id);
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    },
    async removeFromFavorites() {
      try {
        await store.removeFavorite(this.recipe.id || this.recipe.recipe_id);
      } catch (error) {
        console.error('Error removing from favorites:', error);
      }
    },
    async toggleFavorite() {
      if (this.isFavorite) {
        await this.removeFromFavorites();
      } else {
        await this.addToFavorites();
      }
    }
  },
  async created() {
    const recipeId = this.$route.params.id;
    try {
      this.recipe = await store.fetchRecipeById(recipeId);
      if (store.isAuthenticated) {
        await store.markAsWatched(this.recipe.id || this.recipe.recipe_id);
      }
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
