<template>
  <div class="bg-white rounded-lg shadow hover:shadow-lg transition p-4 w-full max-w-md relative">
    <div class="relative cursor-pointer group" @click="goToRecipe">
      <img
      :src="recipe.image || '/deafult_recipe_image.png'"
        alt="Recipe Image"
        class="rounded-lg w-full h-48 object-cover group-hover:opacity-80 transition"
      />
      <span
        class="absolute bottom-2 left-2 bg-black text-white text-xs px-2 py-1 rounded opacity-75 group-hover:opacity-100"
      >
        Click to view
      </span>
    </div>

    <h3 class="text-xl font-semibold mt-3">{{ recipe.title }}</h3>

    <div class="text-gray-600 text-sm mt-1">
      <p>⏱️ {{ recipe.readyInMinutes }} minutes</p>
      <p v-if="recipe.preparationMinutes || recipe.cookingMinutes">
        Preparation: {{ recipe.preparationMinutes || 0 }} min, Cooking: {{ recipe.cookingMinutes || 0 }} min
      </p>
      <p>🍽️ {{ recipe.servings || 0 }} servings</p>
      <p>❤️ {{ recipe.popularity || 0 }} likes</p>
    </div>

    <div class="text-gray-700 text-sm mt-2 line-clamp-3">
      {{ recipe.summary ? stripHtml(recipe.summary) : 'No summary available.' }}
    </div>

    <div class="flex flex-wrap items-center gap-2 mt-2 text-xs">
      <span v-if="recipe.isVegan" class="bg-green-100 text-green-800 px-2 py-1 rounded">Vegan</span>
      <span v-if="recipe.isVegetarian" class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Vegetarian</span>
      <span v-if="recipe.isGlutenFree" class="bg-purple-100 text-purple-800 px-2 py-1 rounded">Gluten-Free</span>
      <span v-if="isWatched" class="bg-blue-100 text-blue-800 px-2 py-1 rounded">Watched</span>
    </div>

    <button
      @click.stop="toggleFavorite"
      :class="[
        isFavorite
          ? 'bg-gray-500 hover:bg-gray-600'
          : 'bg-red-500 hover:bg-red-600',
        'mt-3 text-sm text-white px-3 py-1 rounded transition'
      ]"
    >
      {{ isFavorite ? '❤️ Remove from Favorites' : '❤️ Add to Favorites' }}
    </button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import store from '@/store';
import { computed } from 'vue';

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

    return { isFavorite, isWatched, addToFavorites, goToRecipe, toggleFavorite, stripHtml, removeFromFavorites };
  }
};
</script>

<style scoped>
.group:hover img {
  cursor: pointer;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
