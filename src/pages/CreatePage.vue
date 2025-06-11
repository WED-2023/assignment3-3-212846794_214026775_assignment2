<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style='font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;'>
    <div class="layout-container flex h-full grow flex-col">
      <AppHeader />
      <div class="px-40 flex flex-1 justify-center py-5">
        <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div class="flex flex-wrap justify-between gap-3 p-4">
            <p class="text-[#111815] tracking-light text-[32px] font-bold leading-tight min-w-72">My Recipes</p>
            <button
              @click="openCreateRecipeModal"
              class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#19e59e] text-[#111815] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span class="truncate">Create New Recipe</span>
            </button>
          </div>
          <!-- Your existing content for My Recipes will go here -->
          <div class="text-center text-gray-500 py-10">
            <p>Your created recipes will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <RecipeModal :is-open="isCreateRecipeModalOpen" @close="closeCreateRecipeModal" @recipeCreated="handleRecipeCreated" />
</template>

<script>
import { ref } from 'vue';
// import AppHeader from '../components/AppHeader.vue'; // No longer needed
import RecipeModal from '../components/RecipeModal.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'CreatePage',
  components: {
    // AppHeader, // No longer needed
    RecipeModal
  },
  setup() {
    const router = useRouter();
    const isCreateRecipeModalOpen = ref(false);

    const openCreateRecipeModal = () => {
      isCreateRecipeModalOpen.value = true;
    };

    const closeCreateRecipeModal = () => {
      isCreateRecipeModalOpen.value = false;
    };

    const handleRecipeCreated = () => {
      // Optionally refresh the list of recipes or redirect
      router.push({ name: 'MyRecipes' }); // Assuming you have a route named 'MyRecipes'
    };

    return {
      isCreateRecipeModalOpen,
      openCreateRecipeModal,
      closeCreateRecipeModal,
      handleRecipeCreated,
    };
  }
};
</script>

<style scoped>
/* No specific styles needed for this page as it uses AppHeader and modal */
</style> 