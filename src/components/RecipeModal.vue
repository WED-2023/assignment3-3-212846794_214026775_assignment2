<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center z-10">
        <h3 class="text-2xl font-bold text-[#111815]">Create New Recipe</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-3xl leading-none">
          &times;
        </button>
      </div>

      <!-- Modal Body (Recipe Form) -->
      <div class="p-6">
        <form @submit.prevent="createRecipe">
          <div class="form-group mb-4">
            <label for="title" class="block text-[#111815] text-base font-medium leading-normal pb-2">Recipe Name</label>
            <input
              type="text"
              id="title"
              v-model="recipe.title"
              placeholder="Enter recipe name"
              class="form-input w-full rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] h-14 placeholder:text-[#63887b] p-4 text-base font-normal leading-normal"
              required
            />
          </div>

          <div class="form-group mb-4">
            <label for="description" class="block text-[#111815] text-base font-medium leading-normal pb-2">Description</label>
            <textarea
              id="description"
              v-model="recipe.description"
              placeholder="Enter recipe description"
              class="form-input w-full rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] min-h-36 placeholder:text-[#63887b] p-4 text-base font-normal leading-normal"
            ></textarea>
          </div>

          <div class="form-group mb-4">
            <label for="image-upload" class="block text-[#111815] text-base font-medium leading-normal pb-2">Recipe Image</label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              @change="handleImageUpload"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e6f4ef] file:text-[#46a080] hover:file:bg-[#d5ebe2]"
            />
            <div v-if="imagePreview" class="mt-4">
              <img :src="imagePreview" alt="Recipe preview" class="max-w-[300px] rounded-lg border border-gray-300" />
              <button
                type="button"
                @click="removeImage"
                class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove Image
              </button>
            </div>
          </div>

          <div class="form-group mb-4">
            <label for="preparationMinutes" class="block text-[#111815] text-base font-medium leading-normal pb-2">Preparation Time (minutes)</label>
            <input
              type="number"
              id="preparationMinutes"
              v-model.number="recipe.preparationMinutes"
              min="0"
              class="form-input w-full rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] h-14 placeholder:text-[#63887b] p-4 text-base font-normal leading-normal"
              required
            />
          </div>

          <div class="form-group mb-4">
            <label for="cookingMinutes" class="block text-[#111815] text-base font-medium leading-normal pb-2">Cooking Time (minutes)</label>
            <input
              type="number"
              id="cookingMinutes"
              v-model.number="recipe.cookingMinutes"
              min="0"
              class="form-input w-full rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] h-14 placeholder:text-[#63887b] p-4 text-base font-normal leading-normal"
              required
            />
          </div>

          <div class="form-group mb-4">
            <label for="readyInMinutes" class="block text-[#111815] text-base font-medium leading-normal pb-2">Total Time (minutes)</label>
            <input
              type="number"
              id="readyInMinutes"
              v-model.number="recipe.readyInMinutes"
              class="form-input w-full rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] h-14 placeholder:text-[#63887b] p-4 text-base font-normal leading-normal"
              disabled
            />
          </div>

          <div class="form-group mb-4">
            <label for="servings" class="block text-[#111815] text-base font-medium leading-normal pb-2">Servings</label>
            <input
              type="number"
              id="servings"
              v-model.number="recipe.servings"
              min="1"
              class="form-input w-full rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] h-14 placeholder:text-[#63887b] p-4 text-base font-normal leading-normal"
              required
            />
          </div>

          <h4 class="text-lg font-semibold text-[#111815] mt-6 mb-3">Dietary Information</h4>
          <div class="form-group mb-4 flex items-center gap-4">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="recipe.vegetarian" class="form-checkbox h-4 w-4 text-[#46a080] rounded">
              <span class="text-[#111815] text-base font-normal leading-normal">Vegetarian</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="recipe.vegan" class="form-checkbox h-4 w-4 text-[#46a080] rounded">
              <span class="text-[#111815] text-base font-normal leading-normal">Vegan</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="recipe.glutenFree" class="form-checkbox h-4 w-4 text-[#46a080] rounded">
              <span class="text-[#111815] text-base font-normal leading-normal">Gluten Free</span>
            </label>
          </div>

          <div class="form-group mb-4">
            <label for="ingredients" class="block text-[#111815] text-base font-medium leading-normal pb-2">Ingredients (one per line or comma-separated)</label>
            <textarea
              id="ingredients"
              v-model="recipe.extendedIngredients"
              placeholder="e.g., 1 cup flour\n2 eggs\n3/4 cup sugar"
              class="form-input w-full rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] min-h-36 placeholder:text-[#63887b] p-4 text-base font-normal leading-normal"
              required
            ></textarea>
          </div>

          <div class="form-group mb-4">
            <label for="instructions" class="block text-[#111815] text-base font-medium leading-normal pb-2">Instructions</label>
            <textarea
              id="instructions"
              v-model="recipe.instructions"
              placeholder="Step-by-step instructions for the recipe."
              class="form-input w-full rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] min-h-36 placeholder:text-[#63887b] p-4 text-base font-normal leading-normal"
              required
            ></textarea>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#46a080] hover:bg-[#35806a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#46a080]"
            >
              Save Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, watch, ref, getCurrentInstance } from 'vue';

export default {
  name: 'RecipeModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'recipeCreated'],
  setup(props, { emit }) {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const fileInput = ref(null);
    const imagePreview = ref(null);

    const recipe = reactive({
      title: '',
      description: '',
      preparationMinutes: null,
      cookingMinutes: null,
      readyInMinutes: null,
      servings: null,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      extendedIngredients: '',
      instructions: '',
      image: '',
    });

    // Watch for changes in preparation and cooking time
    watch([() => recipe.preparationMinutes, () => recipe.cookingMinutes], ([prep, cook]) => {
      recipe.readyInMinutes = (prep || 0) + (cook || 0);
    });

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Create a preview
        imagePreview.value = URL.createObjectURL(file);
        
        // Compress and convert image
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to base64 with reduced quality
            recipe.image = canvas.toDataURL('image/jpeg', 0.7);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const removeImage = () => {
      recipe.image = '';
      imagePreview.value = null;
      // Reset file input if using a ref
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    const resetForm = () => {
      recipe.title = '';
      recipe.description = '';
      recipe.preparationMinutes = null;
      recipe.cookingMinutes = null;
      recipe.readyInMinutes = null;
      recipe.servings = null;
      recipe.vegetarian = false;
      recipe.vegan = false;
      recipe.glutenFree = false;
      recipe.extendedIngredients = '';
      recipe.instructions = '';
      recipe.image = '';
      imagePreview.value = null;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    const closeModal = () => {
      resetForm();
      emit('close');
    };

    const createRecipe = async () => {
      // Basic validation
      if (!recipe.title || !recipe.instructions || !recipe.extendedIngredients) {
        toast('Error', 'Please fill in title, ingredients, and instructions.', 'error');
        return;
      }

      try {
        // Format ingredients string to an array of strings
        const ingredientsArray = recipe.extendedIngredients.split(/\r?\n|,/).map(item => item.trim()).filter(item => item.length > 0);

        const recipeData = {
          title: recipe.title,
          preparationMinutes: Number(recipe.preparationMinutes || 0),
          cookingMinutes: Number(recipe.cookingMinutes || 0),
          readyInMinutes: Number(recipe.readyInMinutes || 0),
          vegetarian: recipe.vegetarian,
          vegan: recipe.vegan,
          glutenFree: recipe.glutenFree,
          servings: Number(recipe.servings || 0),
          instructions: recipe.instructions,
          extendedIngredients: ingredientsArray,
          image: recipe.image,
          summary: recipe.description,
        };

        // Call the store action to create the recipe
        await store.createRecipe(recipeData);

        toast('Success', 'Recipe created successfully!', 'success');
        emit('recipeCreated'); // Emit event for parent to handle (e.g., close modal, redirect)
        closeModal(); // Close the modal after successful creation

      } catch (error) {
        console.error('Error creating recipe:', error);
        toast('Error', 'Failed to create recipe.', 'error');
      }
    };

    return {
      recipe,
      fileInput,
      imagePreview,
      handleImageUpload,
      removeImage,
      createRecipe,
      closeModal,
    };
  },
};
</script>

<style scoped>
/* Add any specific styles for this modal here */
.form-input,
.form-select {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm;
}
.form-checkbox {
  @apply focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded;
}
</style> 