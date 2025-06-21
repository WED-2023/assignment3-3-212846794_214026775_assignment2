<template>
  <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full max-w-md relative group">
    <!-- Recipe Image with Overlay -->
    <div class="relative cursor-pointer" @click="goToRecipe">
      <img
        :src="recipe.image || defaultRecipeImage"
        alt="Recipe Image"
        class="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
        <span class="text-white text-sm font-medium p-4">
          Click to view recipe
      </span>
      </div>
    </div>

    <!-- Recipe Content -->
    <div class="p-5">
      <!-- Title -->
      <h3 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{{ recipe.title }}</h3>

      <!-- Recipe Info -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="flex items-center text-gray-600">
          <i class="far fa-clock mr-2"></i>
          <span>{{ recipe.readyInMinutes }} min</span>
        </div>
        <div class="flex items-center text-gray-600">
          <i class="fas fa-utensils mr-2"></i>
          <span>{{ recipe.servings || 0 }} servings</span>
        </div>
        <div v-if="recipe.preparationMinutes || recipe.cookingMinutes" class="flex items-center text-gray-600 col-span-2">
          <i class="fas fa-tasks mr-2"></i>
          <span>Prep: {{ recipe.preparationMinutes || 0 }} min, Cook: {{ recipe.cookingMinutes || 0 }} min</span>
        </div>
        <div v-if="recipe.popularity" class="flex items-center text-gray-600">
          <i class="fas fa-heart mr-2 text-red-500"></i>
          <span>{{ recipe.popularity }} likes</span>
        </div>
      </div>

      <!-- Family Recipe Info -->
      <div v-if="recipe.owner || recipe.occasion" class="mb-4">
        <div v-if="recipe.owner" class="flex items-center text-[#46a080] mb-2">
          <i class="fas fa-users mr-2"></i>
          <span>{{ recipe.owner }}</span>
        </div>
        <div v-if="recipe.occasion" class="flex items-center text-[#46a080]">
          <i class="fas fa-calendar-alt mr-2"></i>
          <span>{{ recipe.occasion }}</span>
        </div>
    </div>

      <!-- Summary -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
      {{ recipe.summary ? stripHtml(recipe.summary) : 'No summary available.' }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span v-if="recipe.isVegan" class="bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow">Vegan</span>
        <span v-if="recipe.isVegetarian" class="bg-yellow-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow">Vegetarian</span>
        <span v-if="recipe.isGlutenFree" class="bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow">Gluten-Free</span>
        <span v-if="isWatched" class="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow">Watched</span>
    </div>

      <!-- Action Button -->
    <button
      @click.stop="toggleFavorite"
      :class="[
        isFavorite
            ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            : 'bg-red-500 hover:bg-red-600 text-white',
          'w-full py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 font-medium'
      ]"
    >
        <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
        {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
    </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import store from '@/store';
import { computed } from 'vue';
import defaultRecipeImage from '@/assets/deafult_recipe_image.png';

export default {
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();

    const isFavorite = computed(() =>
      store.favorites.some((fav) => fav.id === getRecipeId(props.recipe) || fav.recipe_id === getRecipeId(props.recipe))
    );

    const isWatched = computed(() =>
      store.lastWatchedRecipes.some((watched) => watched.id === getRecipeId(props.recipe) || watched.recipe_id === getRecipeId(props.recipe))
    );

    const getRecipeId = (recipe) => {
      return recipe.id || recipe.recipe_id;
    };

    const addToFavorites = async () => {
      try {
        await store.addFavorite(getRecipeId(props.recipe));
      } catch (error) {
        console.error('Failed to add favorite:', error);
      }
    };

    const removeFromFavorites = async () => {
      try {
        await store.removeFavorite(getRecipeId(props.recipe));
      } catch (error) {
        console.error('Failed to remove favorite:', error);
      }
    };

    const toggleFavorite = async () => {
      if (isFavorite.value) {
        await removeFromFavorites();
      } else {
        await addToFavorites();
      }
    };

    const goToRecipe = () => {
      const recipeId = getRecipeId(props.recipe);
      if (recipeId) {
        router.push(`/recipes/${recipeId}`);
      } else {
        console.warn('Invalid recipe: missing ID', props.recipe);
      }
    };

    const stripHtml = (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    };

    return { isFavorite, isWatched, addToFavorites, goToRecipe, toggleFavorite, stripHtml, removeFromFavorites, defaultRecipeImage };
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group:hover img {
  cursor: pointer;
}
</style>
