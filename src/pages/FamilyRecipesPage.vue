<template>
  <div class="min-h-screen bg-[#f8fcfa] font-family-plus-noto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-[#0c1c17]">My Family Recipes</h1>
          <p class="mt-2 text-gray-600">
            A collection of cherished recipes passed down through generations or prepared for special family occasions.
          </p>
        </div>
        <button 
          @click="showCreateForm = true"
          class="bg-[#46a080] text-white px-4 py-2 rounded-lg hover:bg-[#3a8a6d] transition-colors"
        >
          Add Family Recipe
        </button>
      </div>

      <!-- Create Recipe Form Modal -->
      <div v-if="showCreateForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 class="text-2xl font-bold mb-4">Add Family Recipe</h2>
          <form @submit.prevent="createFamilyRecipe" class="space-y-4">
            <!-- Recipe Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Select Base Recipe</label>
              <select 
                v-model="selectedRecipeId" 
                required 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#46a080] focus:ring-[#46a080]"
                @change="handleRecipeSelection"
              >
                <option value="">Select a recipe...</option>
                <option v-for="recipe in userRecipes" :key="recipe.id" :value="recipe.id">
                  {{ recipe.title }}
                </option>
              </select>
            </div>

            <!-- Family Recipe Details -->
            <div v-if="selectedRecipe">
              <div>
                <label class="block text-sm font-medium text-gray-700">Recipe Owner</label>
                <input v-model="newRecipe.owner" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#46a080] focus:ring-[#46a080]">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Family Occasion</label>
                <input v-model="newRecipe.occasion" type="text" required placeholder="e.g., Passover Seder, Family Reunion" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#46a080] focus:ring-[#46a080]">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                <textarea v-model="newRecipe.notes" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#46a080] focus:ring-[#46a080]"></textarea>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button 
                type="button" 
                @click="showCreateForm = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="!selectedRecipeId"
                class="px-4 py-2 bg-[#46a080] text-white rounded-md hover:bg-[#3a8a6d] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Family Recipe
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#46a080] border-t-transparent"></div>
        <p class="mt-4 text-gray-600">Loading family recipes...</p>
      </div>

      <!-- Recipes List -->
      <div v-else-if="familyRecipes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        <RecipePreview
          v-for="recipe in familyRecipes"
          :key="recipe.family_recipe_id"
          :recipe="{
            id: recipe.base_recipe_id || recipe.recipe_id,
            title: recipe.title,
            image: recipe.image || defaultRecipeImage,
            owner: recipe.owner,
            occasion: recipe.occasion,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions
          }"
        />
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
import { createToast } from '@/components/Toast';
import RecipePreview from '@/components/RecipePreview.vue';
import defaultRecipeImage from '@/assets/deafult_recipe_image.png';

export default {
  name: 'FamilyRecipesPage',
  components: {
    RecipePreview
  },
  setup() {
    const familyRecipes = ref([]);
    const userRecipes = ref([]);
    const isLoading = ref(true);
    const showCreateForm = ref(false);
    const selectedRecipeId = ref('');
    const selectedRecipe = ref(null);
    const newRecipe = ref({
      owner: '',
      occasion: '',
      notes: ''
    });

    const loadFamilyRecipes = async () => {
      try {
        isLoading.value = true;
        await store.fetchFamilyRecipes();
        familyRecipes.value = store.familyRecipes;
      } catch (error) {
        console.error('Error loading family recipes:', error);
        createToast('Error loading family recipes', 'error');
      } finally {
        isLoading.value = false;
      }
    };

    const loadUserRecipes = async () => {
      try {
        await store.fetchMyRecipes();
        userRecipes.value = store.recipes;
      } catch (error) {
        console.error('Error loading user recipes:', error);
        createToast('Error loading your recipes', 'error');
      }
    };

    const handleRecipeSelection = async () => {
      if (!selectedRecipeId.value) {
        selectedRecipe.value = null;
        return;
      }
      try {
        selectedRecipe.value = await store.fetchRecipeById(selectedRecipeId.value);
      } catch (error) {
        console.error('Error loading selected recipe:', error);
        createToast('Error loading selected recipe', 'error');
      }
    };

    const createFamilyRecipe = async () => {
      if (!selectedRecipe.value) {
        createToast('Please select a recipe first', 'error');
        return;
      }

      try {
        const recipeData = {
          title: selectedRecipe.value.title,
          owner: newRecipe.value.owner,
          occasion: newRecipe.value.occasion,
          ingredients: selectedRecipe.value.extendedIngredients,
          instructions: selectedRecipe.value.instructions,
          image: selectedRecipe.value.image,
          notes: newRecipe.value.notes,
          base_recipe_id: selectedRecipe.value.id
        };
        
        await store.createFamilyRecipe(recipeData);
        createToast('Family recipe added successfully!', 'success');
        showCreateForm.value = false;
        selectedRecipeId.value = '';
        selectedRecipe.value = null;
        newRecipe.value = {
          owner: '',
          occasion: '',
          notes: ''
        };
        await loadFamilyRecipes();
      } catch (error) {
        console.error('Error creating family recipe:', error);
        createToast(error.response?.data?.message || 'Error creating family recipe', 'error');
      }
    };

    onMounted(async () => {
      await Promise.all([
        loadFamilyRecipes(),
        loadUserRecipes()
      ]);
    });

    return {
      familyRecipes,
      userRecipes,
      isLoading,
      showCreateForm,
      selectedRecipeId,
      selectedRecipe,
      newRecipe,
      handleRecipeSelection,
      createFamilyRecipe,
      defaultRecipeImage
    };
  }
};
</script>

<style scoped>
.font-family-plus-noto {
  font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;
}
</style> 