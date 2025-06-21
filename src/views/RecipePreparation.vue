<template>
  <div class="container mx-auto px-4 py-8 bg-gray-100 min-h-screen font-family-plus-noto">
    <div v-if="recipe" class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
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
            <div class="text-yellow-700 font-semibold text-sm">Original Servings</div>
            <div class="font-bold text-xl text-yellow-900">{{ originalServings || 0 }}</div>
          </div>
        </div>

        <!-- Servings Control -->
        <div class="flex flex-wrap items-center space-x-4 mb-8">
          <div class="flex items-center space-x-2">
            <label for="servings" class="text-lg font-medium text-gray-700">Scale Servings To:</label>
            <input 
              type="number" 
              id="servings"
              v-model.number="newServings"
              step="0.25" 
              min="0.25"
              class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
          </div>
          <button 
            @click="updateServings" 
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md text-base font-semibold"
          >
            Apply Scaling
          </button>
          <button 
            @click="doubleServings" 
            class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-md text-base font-semibold"
          >
            Double Current Servings
          </button>
      </div>

      <!-- Ingredients Section -->
        <div class="mb-8 bg-gray-50 rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold mb-5 border-b-2 pb-3 text-gray-800">Ingredients (Scaled to {{ newServings }} Servings)</h2>
        
        <!-- Ingredients Progress -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-lg font-medium">Ingredients Progress</span>
            <span class="text-gray-600">{{ ingredientsProgressPercentage }}% Complete</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div 
              class="bg-green-600 h-4 rounded-full transition-all duration-300"
              :style="{ width: ingredientsProgressPercentage + '%' }"
            ></div>
          </div>
        </div>

          <ul class="space-y-3">
            <li v-for="(ingredient, index) in scaledIngredients" :key="index" 
                class="flex items-start space-x-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
                :class="{ 'bg-green-100': ingredientCheckedStates[index] }">
              <div class="flex-shrink-0 mt-1">
              <input 
                type="checkbox" 
                  v-model="ingredientCheckedStates[index]"
                @change="updateIngredientStep(index)"
                  :disabled="ingredientCheckedStates[index]"
                  class="w-5 h-5 rounded border-gray-300 focus:ring-green-500 text-green-600 cursor-pointer"
              >
            </div>
              <div>
                <span class="font-medium text-gray-800">{{ ingredient }}</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Preparation Steps -->
        <div class="bg-gray-50 rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold mb-5 border-b-2 pb-3 text-gray-800">Preparation Steps</h2>
        
        <!-- Preparation Progress -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-lg font-medium">Preparation Progress</span>
            <span class="text-gray-600">{{ preparationProgressPercentage }}% Complete</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div 
              class="bg-green-600 h-4 rounded-full transition-all duration-300"
              :style="{ width: preparationProgressPercentage + '%' }"
              :class="{ 'opacity-50': ingredientsProgressPercentage < 100 }"
            ></div>
          </div>
          <p v-if="ingredientsProgressPercentage < 100" class="text-sm text-gray-500 mt-1">
            Complete all ingredients first to start preparation
          </p>
        </div>


        <div class="space-y-6">
          <div v-for="(step, index) in steps" :key="index"
                 class="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                 :class="{ 'opacity-50': ingredientsProgressPercentage < 100, 'bg-green-50': preparationCheckedStates[index] }">
              <div class="flex-shrink-0 mt-1">
              <input 
                type="checkbox" 
                  v-model="preparationCheckedStates[index]"
                @change="updatePreparationStep(index)"
                  :disabled="ingredientsProgressPercentage < 100 || preparationCheckedStates[index]"
                  class="w-5 h-5 rounded border-gray-300 focus:ring-green-500 text-green-600 cursor-pointer"
              >
            </div>
            <div>
                <span class="font-medium text-gray-800">Step {{ index + 1 }}:</span>
                <p class="mt-1 text-gray-700">{{ step }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20 bg-white rounded-lg shadow-lg">
      <p class="text-xl text-gray-600">Loading recipe details...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import defaultRecipeImage from '@/assets/deafult_recipe_image.png';

export default {
  name: 'RecipePreparation',
  setup() {
    const route = useRoute()
    const recipe = ref(null)
    const originalServings = ref(1) // To store the original servings from the fetched recipe
    const newServings = ref(1)
    const currentPreparationStep = ref(0)
    const currentIngredientStep = ref(0)
    const planId = route.params.planId || null; // Get plan_id from route params
    const totalIngredients = ref(0); // New ref for total ingredients
    const totalSteps = ref(0); // New ref for total steps

    // New reactive arrays to hold the checked state of each item
    const ingredientCheckedStates = ref([]);
    const preparationCheckedStates = ref([]);

    // Helper function to convert decimal to fraction string
    const toFraction = (value) => {
      if (value === 0) return '0';
      if (value % 1 === 0) return value.toString();

      const tolerance = 1.0E-6; // Smaller for more precision
      let h1 = 1, h2 = 0;
      let k1 = 0, k2 = 1;
      let b = value;
      do {
        let a = Math.floor(b);
        let aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        aux = k1;
        k1 = a * k1 + k2;
        k2 = aux;
        b = 1 / (b - a);
      } while (Math.abs(value - h1 / k1) > value * tolerance && k1 < 1000); // Limit k1 to avoid large denominators
      
      if (h1/k1 === value) {
          if (k1 === 1) return h1.toString(); // e.g., 2/1 -> 2
          return `${h1}/${k1}`;
      } else { // Fallback for imperfect fractions or numbers that are not exact simple fractions
          const decimalParts = value.toString().split('.');
          if (decimalParts.length > 1) {
              // Try to find a common denominator for simple cases like 0.25, 0.75
              const decimal = parseFloat('0.' + decimalParts[1]);
              if (decimal === 0.25) return `${Math.floor(value)} 1/4`.trim();
              if (decimal === 0.5) return `${Math.floor(value)} 1/2`.trim();
              if (decimal === 0.75) return `${Math.floor(value)} 3/4`.trim();
          }
          return value.toFixed(2); // Default to 2 decimal places if no simple fraction
      }
    };

    // Helper function to format amount with fraction if needed
    const formatAmountWithFraction = (amount) => {
        if (amount % 1 === 0) return amount.toString(); // Whole number
        const whole = Math.floor(amount);
        const fraction = toFraction(amount - whole);
        return whole > 0 ? `${whole} ${fraction}` : fraction;
    };

    const ingredientsProgressPercentage = computed(() => {
      if (totalIngredients.value === 0) return 0;
      return Math.round((currentIngredientStep.value / totalIngredients.value) * 100);
    });

    const preparationProgressPercentage = computed(() => {
      if (totalSteps.value === 0) return 0;
      return Math.round((currentPreparationStep.value / totalSteps.value) * 100);
    });

    // Computed property for scaled ingredients
    const scaledIngredients = computed(() => {
      if (!recipe.value || !recipe.value.ingredients) return [] // Use `ingredients` which is already parsed/formatted

      const scaleFactor = newServings.value / originalServings.value;
      if (isNaN(scaleFactor) || !isFinite(scaleFactor) || scaleFactor <= 0) return [];

      // For simplicity, if we have the original parsed string, we won't try to scale it.
      // This assumes `recipe.ingredients` already contains the desired display format.
      // If scaling is needed for custom recipes, their ingredients should be stored with amount/unit structure.
      if (recipe.value.source === 'db' || recipe.value.source === 'custom') {
        // For custom recipes from DB, ingredients might already be simple strings.
        // If they are, we won't try to re-parse and scale complex amounts.
        // We'll just return them as is, or try a basic scaling if they contain simple numbers.
        return recipe.value.ingredients.map(ing => {
          // Basic attempt to scale if the ingredient string starts with a number
          const match = ing.match(/^(\d+(\.\d+)?)\s*(.*)/);
          if (match) {
            const amount = parseFloat(match[1]);
            const rest = match[3];
            if (!isNaN(amount)) {
              const scaledAmount = amount * scaleFactor;
              return `${formatAmountWithFraction(scaledAmount)} ${rest}`.trim();
            }
          }
          return ing; // Return as is if not a simple numeric amount at the start
        });
      }
      
      // Existing Spoonacular logic for detailed ingredient objects
      return recipe.value.extendedIngredients.map(ing => {
        if (!ing.amount || ing.unit === 'portion') { // Handle cases without specific amount or unit
          return ing.original || ing.name;
        }

        const scaledAmount = ing.amount * scaleFactor;
        const formattedAmount = formatAmountWithFraction(scaledAmount);
        
        // Reconstruct the ingredient string
        let formattedIngredient = `${formattedAmount} ${ing.unit} ${ing.nameClean || ing.name}`.trim();
        
        // Remove double spaces that might occur if unit is empty
        formattedIngredient = formattedIngredient.replace(/\s+/g, ' ');
        return formattedIngredient;
      });
    });

    const steps = computed(() => {
      if (!recipe.value || !recipe.value.instructions) return []

      // Ensure instructions are always an array of strings
      let formattedSteps = [];
      if (Array.isArray(recipe.value.instructions)) {
        formattedSteps = recipe.value.instructions.filter(step => typeof step === 'string' && step.trim() !== '');
      } else if (typeof recipe.value.instructions === 'string' && recipe.value.instructions.trim() !== '') {
        formattedSteps = recipe.value.instructions.split(/\.\s*|\n|\r/).map(step => step.trim()).filter(step => step.length > 0);
      }
      return formattedSteps;
    });

    // Function to load recipe and preparation progress
    const loadRecipeForPreparation = async () => {
      const recipeId = route.params.id;
      if (!recipeId) {
        console.error("No recipe ID provided.");
        return;
      }

      try {
        let params = {};
        if (planId) { // Check if planId exists
          params.planId = planId;
        }
        const response = await axios.get(`/api/users/prepare-recipe/${recipeId}`, { params });
        console.log("Fetched preparation data:", response.data);
        if (response.data) {
          recipe.value = response.data.recipe;
          originalServings.value = response.data.recipe.servings || 1;
          newServings.value = originalServings.value; // Initialize newServings with original
          currentIngredientStep.value = response.data.current_ingredient_step || 0;
          currentPreparationStep.value = response.data.current_preperation_step || 0;

          // Initialize ingredient and preparation checked states
          // Ensure recipe.ingredients and recipe.instructions exist and are arrays
          const ingredientsArray = Array.isArray(recipe.value.ingredients) ? recipe.value.ingredients : [];
          const instructionsArray = Array.isArray(recipe.value.instructions) ? recipe.value.instructions : [];

          totalIngredients.value = ingredientsArray.length;
          totalSteps.value = instructionsArray.length;

          ingredientCheckedStates.value = Array(totalIngredients.value).fill(false);
          for (let i = 0; i < currentIngredientStep.value; i++) {
            if (i < totalIngredients.value) {
              ingredientCheckedStates.value[i] = true;
            }
          }

          preparationCheckedStates.value = Array(totalSteps.value).fill(false);
          for (let i = 0; i < currentPreparationStep.value; i++) {
            if (i < totalSteps.value) {
              preparationCheckedStates.value[i] = true;
            }
          }

        } else {
          console.error("No preparation data received.");
        }
      } catch (err) {
        console.error('Failed to load recipe for preparation:', err);
        // Fallback to fetching basic recipe info if preparation data fails
        try {
          const response = await axios.get(`/api/recipes/${recipeId}`);
          recipe.value = response.data;
          originalServings.value = response.data.servings || 1;
          newServings.value = originalServings.value; // Initialize newServings
          
          // For fallback, initialize checklist states to empty/unchecked
          const ingredientsArray = Array.isArray(recipe.value.ingredients) ? recipe.value.ingredients : [];
          const instructionsArray = Array.isArray(recipe.value.instructions) ? recipe.value.instructions : [];

          totalIngredients.value = ingredientsArray.length;
          totalSteps.value = instructionsArray.length;

          ingredientCheckedStates.value = Array(totalIngredients.value).fill(false);
          preparationCheckedStates.value = Array(totalSteps.value).fill(false);

        } catch (basicFetchErr) {
          console.error('Failed to load basic recipe info:', basicFetchErr);
        }
      }
    }

    const updateServings = async () => {
      if (newServings.value <= 0) {
        newServings.value = 0.25; // Minimum 0.25 servings
        return;
      }
      try {
        await axios.put(`/api/users/prepare-recipe/${route.params.id}/servings`, {
          servings: newServings.value,
          plan_id: planId // Pass plan_id
        })
        // No need to update 'servings.value' here if we only use newServings for display and scaling
        // The backend update is what matters
      } catch (error) {
        console.error('Error updating servings:', error)
        // Revert on error only if needed for display consistency
        // newServings.value = servings.value;
      }
    }

    const doubleServings = async () => {
      try {
        const doubledServings = newServings.value * 2; // Double the currently displayed servings
        await axios.put(`/api/users/prepare-recipe/${route.params.id}/servings`, {
          servings: doubledServings,
          plan_id: planId // Pass plan_id
        })
        newServings.value = doubledServings; // Update the input field
      } catch (error) {
        console.error('Error doubling servings:', error)
      }
    }

    const updateIngredientStep = async (index) => {
      // Check if the current action is to check the next item, or uncheck the current one.
      // Disallow skipping steps or unchecking previous steps.
      if (index === currentIngredientStep.value && !ingredientCheckedStates.value[index]) { // Check the next item
        currentIngredientStep.value = index + 1;
      } else if (index === currentIngredientStep.value - 1 && ingredientCheckedStates.value[index]) { // Uncheck the current item
        currentIngredientStep.value = index;
      } else { // Invalid action
        // Revert the v-model change if the action is invalid
        ingredientCheckedStates.value[index] = !ingredientCheckedStates.value[index];
        return; 
      }
      
      ingredientCheckedStates.value[index] = !ingredientCheckedStates.value[index]; // Toggle the checkbox state

      try {
        await axios.put(`/api/users/prepare-recipe/${route.params.id}/ingredient-step`, {
          step: currentIngredientStep.value,
          plan_id: planId // Pass plan_id
        });

        // Update meal plan progress if this is part of a meal plan
        if (planId) {
          const progress = currentIngredientStep.value === totalIngredients.value ? 'Completed' : 'In Progress';
          await axios.put(`/api/meal-plan/progress/${route.params.id}`, {
            progress,
            plan_id: planId
          });
        }
      } catch (error) {
        console.error('Error updating ingredient step:', error);
      }
    };

    const updatePreparationStep = async (index) => {
      if (ingredientsProgressPercentage.value < 100) {
        // Revert the v-model change if ingredients not complete
        preparationCheckedStates.value[index] = !preparationCheckedStates.value[index];
        return;
      }

      // Check if the current action is to check the next item, or uncheck the current one.
      // Disallow skipping steps or unchecking previous steps.
      if (index === currentPreparationStep.value && !preparationCheckedStates.value[index]) { // Check the next item
        currentPreparationStep.value = index + 1;
      } else if (index === currentPreparationStep.value - 1 && preparationCheckedStates.value[index]) { // Uncheck the current item
        currentPreparationStep.value = index;
      } else { // Invalid action
        // Revert the v-model change if the action is invalid
        preparationCheckedStates.value[index] = !preparationCheckedStates.value[index];
        return;
      }

      preparationCheckedStates.value[index] = !preparationCheckedStates.value[index]; // Toggle the checkbox state

      try {
        await axios.put(`/api/users/prepare-recipe/${route.params.id}/preparation-step`, {
          step: currentPreparationStep.value,
          plan_id: planId // Pass plan_id
        });

        // Update meal plan progress if this is part of a meal plan
        if (planId) {
          const progress = currentPreparationStep.value === totalSteps.value ? 'Completed' : 'In Progress';
          await axios.put(`/api/meal-plan/progress/${route.params.id}`, {
            progress,
            plan_id: planId
          });
        }
      } catch (error) {
        console.error('Error updating preparation step:', error);
      }
    };

    onMounted(() => {
      loadRecipeForPreparation();
    });

    // Watch for changes in newServings and update the backend if it's a valid number
    watch(newServings, (newValue) => {
      if (typeof newValue === 'number' && newValue > 0) {
        // You might want a debounce here for performance if user types quickly
        // updateServings(); // Calling updateServings on every change might be too much
      }
    });

    // Watch currentIngredientStep to update preparation progress status
    watch(currentIngredientStep, (newVal) => {
      if (newVal < totalIngredients.value) {
        // If ingredients are not all checked, disable preparation steps
        preparationCheckedStates.value = Array(totalSteps.value).fill(false);
        currentPreparationStep.value = 0;
      }
    });

    return {
      recipe,
      originalServings,
      newServings,
      scaledIngredients,
      steps,
      ingredientCheckedStates,
      preparationCheckedStates,
      ingredientsProgressPercentage,
      preparationProgressPercentage,
      updateServings,
      doubleServings,
      updateIngredientStep,
      updatePreparationStep,
      defaultRecipeImage // Expose the imported image to the template
    }
  }
}
</script>

<style scoped>
.font-family-plus-noto {
  font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;
}
</style> 