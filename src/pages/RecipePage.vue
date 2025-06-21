<template>
  <div class="min-h-screen bg-gray-100 font-family-plus-noto py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div v-if="recipe" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Recipe Header with Image -->
        <div class="relative h-72 lg:h-96">
            <img 
            :src="recipe.image || defaultRecipeImage" 
              :alt="recipe.title"
              class="w-full h-full object-cover"
            >
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <h1 class="absolute bottom-6 left-6 text-4xl font-extrabold text-white leading-tight drop-shadow-md">
            {{ recipe.title }}
          </h1>
          </div>
        
        <div class="p-6 md:p-8">
          <!-- Recipe Info Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div class="bg-blue-50 p-4 rounded-lg text-center shadow-sm">
              <div class="text-blue-700 font-semibold text-sm">Prep Time</div>
              <div class="font-bold text-xl text-blue-900">{{ recipe.preparationMinutes || 0 }} min</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg text-center shadow-sm">
              <div class="text-green-700 font-semibold text-sm">Cook Time</div>
              <div class="font-bold text-xl text-green-900">{{ recipe.cookingMinutes || 0 }} min</div>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg text-center shadow-sm">
              <div class="text-purple-700 font-semibold text-sm">Total Time</div>
              <div class="font-bold text-xl text-purple-900">{{ recipe.readyInMinutes || 0 }} min</div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg text-center shadow-sm">
              <div class="text-yellow-700 font-semibold text-sm">Servings</div>
              <div class="font-bold text-xl text-yellow-900">{{ recipe.servings || 0 }}</div>
            </div>
            <div v-if="recipe.popularity" class="bg-red-50 p-4 rounded-lg text-center shadow-sm">
              <div class="text-red-700 font-semibold text-sm">Likes</div>
              <div class="font-bold text-xl text-red-900 flex items-center justify-center">
                <i class="fas fa-heart mr-2"></i> {{ recipe.popularity || 0 }}
              </div>
            </div>
          </div>

          <!-- Tags and Indicators -->
          <div class="flex flex-wrap gap-2 mb-6">
            <span v-if="recipe.vegetarian" class="bg-green-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow">Vegetarian</span>
            <span v-if="recipe.vegan" class="bg-green-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow">Vegan</span>
            <span v-if="recipe.glutenFree" class="bg-purple-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow">Gluten Free</span>
          </div>

          <!-- Action Buttons -->
          <div class="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              @click="toggleFavorite"
              :class="[
                isFavorite 
                  ? 'bg-gray-400 hover:bg-gray-500' 
                  : 'bg-red-500 hover:bg-red-600',
                'text-white px-6 py-3 rounded-lg text-base font-semibold transition-colors shadow-md w-full flex items-center justify-center'
              ]"
            >
              <span class="mr-2">{{ isFavorite ? '❤️' : '♡' }}</span> {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
            </button>
            <router-link
              :to="`/recipes/${recipe.recipe_id || recipe.id}/prepare`"
              class="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg w-full flex items-center justify-center text-center"
            >
              Start Preparing This Recipe
            </router-link>
            <AddToMealPlan 
              v-if="store.isAuthenticated"
              :recipe-id="recipe.recipe_id || recipe.id"
              @added-to-meal-plan="handleAddedToMealPlan"
              class="w-full flex items-center justify-center"
            />
        </div>

        <!-- Family Recipe Section -->
          <div v-if="recipe.owner || recipe.occasion" class="bg-orange-50 p-6 rounded-lg mb-8 border-2 border-orange-200 shadow-inner">
            <h3 class="text-2xl font-bold text-orange-700 mb-4 flex items-center">
              <span class="mr-3 text-3xl">👨‍👩‍👧‍👦</span> Family Recipe
          </h3>
            <div class="space-y-3 text-lg">
              <p v-if="recipe.owner">
                <span class="font-semibold text-orange-800">Owner:</span> 
                <span class="text-orange-600">{{ recipe.owner }}</span>
              </p>
              <p v-if="recipe.occasion">
                <span class="font-semibold text-orange-800">Occasion:</span> 
                <span class="text-orange-600">{{ recipe.occasion }}</span>
              </p>
              <p v-if="recipe.notes">
                <span class="font-semibold text-orange-800">Notes:</span> 
                <span class="text-orange-600">{{ recipe.notes }}</span>
              </p>
          </div>
        </div>

        <!-- Ingredients -->
          <div class="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 class="text-2xl font-bold mb-5 border-b-2 pb-3 text-gray-800">Ingredients</h2>
            <ul class="space-y-3">
            <li v-for="(item, index) in parsedIngredients" :key="index" 
                  class="flex items-start text-lg text-gray-700">
                <span class="text-green-500 mr-2 mt-1">&#10003;</span>
                <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <!-- Instructions -->
          <div class="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 class="text-2xl font-bold mb-5 border-b-2 pb-3 text-gray-800">Instructions</h2>
            <ol class="space-y-4 list-decimal list-inside">
              <li v-for="(instruction, index) in formattedInstructions" :key="index" class="text-lg text-gray-700 leading-relaxed">
                {{ instruction }}
              </li>
            </ol>
        </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-600 text-xl py-20 bg-white rounded-lg shadow-lg">
        Loading recipe details...
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store';
import axios from 'axios';
import AddToMealPlan from '@/components/AddToMealPlan.vue';
import defaultRecipeImage from '@/assets/deafult_recipe_image.png';

export default {
  name: 'RecipePage',
  components: {
    AddToMealPlan
  },
  data() {
    return {
      recipe: null,
      defaultRecipeImage: defaultRecipeImage
    };
  },
  computed: {
    store() {
      return store;
    },
    parsedIngredients() {
      if (!this.recipe) return [];
      return this.recipe.ingredients || [];
    },
    formattedInstructions() {
      if (!this.recipe || !this.recipe.instructions) return [];
      // Instructions are already pre-formatted as an array by the backend
      return this.recipe.instructions;
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
    },
    handleAddedToMealPlan() {
      console.log('Recipe added to meal plan');
      // Potentially add a visual feedback here (e.g., toast notification)
    }
  },
  async created() {
    const recipeId = this.$route.params.id;
    try {
      const response = await axios.get(`/api/recipes/${recipeId}`);
      this.recipe = response.data;
      
      // Fallback to store if API fails or returns no data
      if (!this.recipe || Object.keys(this.recipe).length === 0) {
        this.recipe = await store.fetchRecipeById(recipeId);
      }

      if (store.isAuthenticated) {
        await store.markAsWatched(this.recipe.id || this.recipe.recipe_id);
      }
    } catch (err) {
      console.error('Failed to load recipe:', err);
      // Even if API fails, try to load from store as a last resort
      try {
        this.recipe = await store.fetchRecipeById(recipeId);
      } catch (storeError) {
        console.error('Failed to load recipe from store:', storeError);
        // Optionally, redirect to a 404 page or show an error message
      }
    }
  }
};
</script>

<style scoped>
.font-family-plus-noto {
  font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;
}
</style>
