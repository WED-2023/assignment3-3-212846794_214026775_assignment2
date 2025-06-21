<template>
  <div>
    <button 
      @click="showDialog = true"
      class="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      :disabled="isLoading"
    >
      <i class="fas fa-plus"></i>
      <span>{{ isLoading ? 'Adding...' : 'Add to Meal Plan' }}</span>
    </button>

    <!-- Meal Plan Selection Dialog -->
    <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Add to Meal Plan</h2>
        
        <!-- Create New Meal Plan -->
        <div v-if="showCreateForm" class="mb-4">
          <input
            v-model="newPlanName"
            type="text"
            placeholder="Enter meal plan name"
            class="w-full p-2 border rounded mb-2"
          />
          <button
            @click="createMealPlan"
            class="bg-green-500 text-white px-4 py-2 rounded mr-2"
            :disabled="!newPlanName || isLoading"
          >
            Create Plan
          </button>
          <button
            @click="showCreateForm = false"
            class="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>

        <!-- Select Existing Meal Plan -->
        <div v-else>
          <div v-if="mealPlans.length > 0" class="mb-4">
            <h3 class="font-semibold mb-2">Select a Meal Plan:</h3>
            <div class="space-y-2">
              <div
                v-for="plan in mealPlans"
                :key="plan.plan_id"
                @click="selectMealPlan(plan)"
                class="p-2 border rounded cursor-pointer hover:bg-gray-100"
              >
                {{ plan.name }}
              </div>
            </div>
          </div>
          
          <div class="flex justify-between">
            <button
              @click="showCreateForm = true"
              class="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Create New Plan
            </button>
            <button
              @click="showDialog = false"
              class="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'AddToMealPlan',
  props: {
    recipeId: {
      type: [Number, String],
      required: true
    }
  },
  setup(props) {
    const isLoading = ref(false);
    const error = ref('');
    const showDialog = ref(false);
    const showCreateForm = ref(false);
    const newPlanName = ref('');
    const mealPlans = ref([]);

    const fetchMealPlans = async () => {
      try {
        const response = await axios.get('/api/meal-plan');
        mealPlans.value = response.data;
      } catch (error) {
        console.error('Error fetching meal plans:', error);
        error.value = 'Failed to fetch meal plans. Please try again.';
      }
    };

    const createMealPlan = async () => {
      if (!newPlanName.value) return;
      
      isLoading.value = true;
      error.value = '';
      try {
        const response = await axios.post('/api/meal-plan/create', {
          name: newPlanName.value
        });
        
        // Add recipe to the newly created plan
        await addToMealPlan(response.data.plan_id);
        
        showCreateForm.value = false;
        showDialog.value = false;
        newPlanName.value = '';
        await fetchMealPlans();
      } catch (error) {
        console.error('Error creating meal plan:', error);
        error.value = 'Failed to create meal plan. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    const selectMealPlan = async (plan) => {
      await addToMealPlan(plan.plan_id);
    };

    const addToMealPlan = async (planId) => {
      isLoading.value = true;
      error.value = '';
      try {
        await axios.post('/api/meal-plan/add', {
          recipe_id: props.recipeId,
          plan_id: planId
        });
        showDialog.value = false;
      } catch (error) {
        console.error('Error adding to meal plan:', error);
        error.value = 'Failed to add recipe to meal plan. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchMealPlans();
    });

    return {
      isLoading,
      error,
      showDialog,
      showCreateForm,
      newPlanName,
      mealPlans,
      createMealPlan,
      selectMealPlan
    };
  }
};
</script> 