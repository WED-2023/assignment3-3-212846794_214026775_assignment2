<template>
  <div class="meal-plan-container-wide">
    <h1 class="text-4xl font-bold mb-8 text-center">Meal Plan</h1>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
      {{ error }}
    </div>
    <div v-if="mealPlans.length === 0" class="text-center py-16">
      <p class="text-gray-600 text-xl">Your meal plan is empty. Add recipes from the recipe pages!</p>
    </div>
    <div v-else class="space-y-12">
      <div v-for="plan in mealPlans" :key="plan.plan_id" class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-[#46a080]">{{ plan.name }}</h2>
          <div class="flex space-x-2">
            <button 
              @click="startMealPlanPreparation(plan)" 
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
              :disabled="isLoading || !plan.recipes || plan.recipes.length === 0"
            >
              Start Meal Plan
            </button>
          <button 
            @click="clearMealPlan(plan.plan_id)" 
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Clearing...' : 'Clear All' }}
          </button>
            <button 
              @click="deleteMealPlan(plan.plan_id)" 
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Deleting...' : 'Delete Meal Plan' }}
            </button>
          </div>
        </div>
        <div class="space-y-6">
          <div v-for="(element, index) in plan.recipes" :key="element.recipe_id"
               class="bg-gray-50 rounded-xl shadow p-6 flex items-center transition-transform hover:scale-105"
               :class="{ 'opacity-75': isLoading }">
            <div class="flex flex-col items-center justify-center mr-4 space-y-1">
              <button 
                @click="moveRecipeUp(plan, index)"
                :disabled="index === 0 || isLoading"
                class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-chevron-up text-xl"></i>
              </button>
              <span class="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-base font-semibold">{{ element.recipe_order }}</span>
              <button 
                @click="moveRecipeDown(plan, index)"
                :disabled="index === plan.recipes.length - 1 || isLoading"
                class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-chevron-down text-xl"></i>
              </button>
            </div>
            
            <img v-if="element.image" :src="element.image" :alt="element.title" class="w-32 h-32 object-cover rounded-xl shadow mr-6" />
            <div v-else class="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-xl mr-6 text-gray-400 shadow">
              <i class="fas fa-utensils text-4xl"></i>
            </div>

            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-2xl font-semibold">
                  {{ element.title || 'Untitled Recipe' }}
                </h3>
                <div class="flex items-center space-x-2 ml-4">
                  <button 
                    @click="goToPreparation(element.recipe_id, plan.plan_id)"
                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow flex items-center"
                  >
                    <i class="fas fa-utensils mr-2"></i> Prepare
                  </button>
                  <button 
                    @click="removeRecipe(plan.plan_id, element.recipe_id)"
                    class="text-red-500 hover:text-red-600 ml-2"
                    :disabled="isLoading"
                  >
                    <i class="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>
              <div class="flex flex-wrap items-center mb-2 space-x-4">
                <span v-if="element.readyInMinutes" class="text-sm text-gray-500"><i class="far fa-clock mr-1"></i>{{ element.readyInMinutes }} min</span>
                <span v-if="element.servings" class="text-sm text-gray-500"><i class="fas fa-user-friends mr-1"></i>{{ element.servings }} servings</span>
              </div>
              <div class="flex items-center mb-2">
                <span class="text-sm text-gray-600 mr-2">Progress:</span>
                <div class="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    class="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                    :style="{ width: getProgressWidth(element.progress) }"
                  ></div>
                </div>
                <span class="text-sm text-gray-600 ml-2">{{ element.progress }}</span>
              </div>
              <div v-if="element.progress === 'In Progress'" class="flex items-center mb-2">
                <span class="text-sm text-gray-600 mr-2">Details:</span>
                <div class="flex-1 space-y-1">
                  <div class="flex items-center">
                    <span class="text-xs text-gray-500 w-24">Ingredients:</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-green-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: getIngredientProgress(element) }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-500 ml-2">{{ getIngredientProgress(element) }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-xs text-gray-500 w-24">Preparation:</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: getPreparationProgress(element) }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-500 ml-2">{{ getPreparationProgress(element) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'MealPlan',
  components: {
    // draggable // Remove draggable component
  },
  setup() {
    const mealPlans = ref([]);
    const isLoading = ref(false);
    const error = ref('');
    const router = useRouter();

    const fetchMealPlan = async () => {
      try {
        isLoading.value = true;
        error.value = '';
        const response = await axios.get('/api/meal-plan');
        mealPlans.value = response.data || [];
        // Ensure recipe_order is correctly set for display and reordering
        mealPlans.value.forEach(plan => {
          if (plan.recipes) {
            plan.recipes.sort((a, b) => a.recipe_order - b.recipe_order);
          }
        });
      } catch (error) {
        console.error('Error fetching meal plan:', error);
        error.value = 'Failed to load meal plan. Please try again later.';
      } finally {
        isLoading.value = false;
      }
    };

    const updateOrder = async (plan) => {
      try {
        isLoading.value = true;
        error.value = '';
        const updates = plan.recipes.map((recipe, index) => ({
          plan_id: plan.plan_id,
          recipe_id: recipe.recipe_id,
          new_order: index + 1
        }));
        await Promise.all(
          updates.map(update => 
            axios.put('/api/meal-plan/reorder', update)
          )
        );
      } catch (error) {
        console.error('Error updating order:', error);
        error.value = 'Failed to update recipe order. Please try again.';
        await fetchMealPlan(); // Revert on error
      } finally {
        isLoading.value = false;
      }
    };

    const moveRecipeUp = async (plan, index) => {
      if (index === 0) return; // Cannot move the first item up
      const newRecipes = [...plan.recipes];
      const [movedRecipe] = newRecipes.splice(index, 1);
      newRecipes.splice(index - 1, 0, movedRecipe);
      plan.recipes = newRecipes; // Update reactivity
      await updateOrder(plan);
    };

    const moveRecipeDown = async (plan, index) => {
      if (index === plan.recipes.length - 1) return; // Cannot move the last item down
      const newRecipes = [...plan.recipes];
      const [movedRecipe] = newRecipes.splice(index, 1);
      newRecipes.splice(index + 1, 0, movedRecipe);
      plan.recipes = newRecipes; // Update reactivity
      await updateOrder(plan);
    };

    const removeRecipe = async (planId, recipeId) => {
      try {
        isLoading.value = true;
        error.value = '';
        await axios.delete(`/api/meal-plan/remove/${recipeId}`);
        const plan = mealPlans.value.find(p => p.plan_id === planId);
        if (plan) {
          plan.recipes = plan.recipes.filter(r => r.recipe_id !== recipeId);
          // Re-sort to fix order after removal if needed, or rely on next fetch
          await updateOrder(plan);
        }
      } catch (error) {
        console.error('Error removing recipe:', error);
        error.value = 'Failed to remove recipe. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    const clearMealPlan = async (planId) => {
      try {
        isLoading.value = true;
        error.value = '';
        // The backend /clear endpoint now clears ALL plans, but we only want to clear recipes from this specific plan.
        // We need a specific endpoint to clear a single meal plan, or modify the existing one to accept plan_id.
        // For now, I'll use the existing /clear and then re-fetch, but this is a temporary workaround if the backend isn't specific.
        // Based on the previous backend change, /clear clears ALL recipes from ALL meal plans for the user.
        // If the user truly wants to clear only a single meal plan, a new backend endpoint would be needed.
        await axios.delete(`/api/meal-plan/clear/${planId}`); // Assuming a new backend endpoint /clear/:planId
        const plan = mealPlans.value.find(p => p.plan_id === planId);
        if (plan) {
          plan.recipes = []; // Optimistically update UI
        }
      } catch (error) {
        console.error('Error clearing meal plan:', error);
        error.value = 'Failed to clear meal plan. Please try again.';
        await fetchMealPlan(); // Revert on error or if backend doesn't support specific clear
      } finally {
        isLoading.value = false;
      }
    };

    const deleteMealPlan = async (planId) => {
      if (!confirm('Are you sure you want to delete this meal plan? This action cannot be undone.')) {
        return;
      }
      try {
        isLoading.value = true;
        error.value = '';
        await axios.delete(`/api/meal-plan/${planId}`);
        mealPlans.value = mealPlans.value.filter(p => p.plan_id !== planId);
      } catch (error) {
        console.error('Error deleting meal plan:', error);
        error.value = 'Failed to delete meal plan. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    const getProgressWidth = (progress) => {
      const progressMap = {
        'Not Started': '0%',
        'In Progress': '50%',
        'Completed': '100%'
      };
      return progressMap[progress] || '0%';
    };

    const getIngredientProgress = (recipe) => {
      if (!recipe.current_ingredient_step || !recipe.total_ingredients) return '0%';
      const percentage = Math.round((recipe.current_ingredient_step / recipe.total_ingredients) * 100);
      return `${percentage}%`;
    };

    const getPreparationProgress = (recipe) => {
      if (!recipe.current_preparation_step || !recipe.total_steps) return '0%';
      const percentage = Math.round((recipe.current_preparation_step / recipe.total_steps) * 100);
      return `${percentage}%`;
    };

    const goToPreparation = (recipeId, planId = null) => {
      const params = { id: recipeId };
      if (planId !== null) {
        params.planId = planId;
      }
      router.push({ name: 'RecipePreparation', params: params });
    };

    const startMealPlanPreparation = (plan) => {
      if (plan.recipes && plan.recipes.length > 0) {
        const firstRecipe = plan.recipes.sort((a, b) => a.recipe_order - b.recipe_order)[0];
        goToPreparation(firstRecipe.recipe_id, plan.plan_id);
      } else {
        error.value = 'This meal plan has no recipes to start!';
      }
    };

    onMounted(() => {
      fetchMealPlan();
    });

    return {
      mealPlans,
      isLoading,
      error,
      fetchMealPlan,
      moveRecipeUp,
      moveRecipeDown,
      removeRecipe,
      clearMealPlan,
      deleteMealPlan,
      startMealPlanPreparation,
      goToPreparation,
      getProgressWidth,
      getIngredientProgress,
      getPreparationProgress,
    };
  }
};
</script>

<style scoped>
.meal-plan-container-wide {
  width: 100vw;
  min-height: 100vh;
  background: #f7faf9;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding: 3rem 2vw 4rem 2vw;
}

@media (min-width: 768px) {
  .meal-plan-container-wide {
    padding-left: 5vw;
    padding-right: 5vw;
  }
}

/* Removed .drag-handle styles as it's no longer used for draggable */
</style> 