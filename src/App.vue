<template>
  <div class="relative flex min-h-screen w-full flex-col bg-[#f8fcfa] group/design-root overflow-x-hidden" style='font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;'>
    <div class="layout-container flex h-full grow flex-col">
      <AppHeader @open-create-recipe-modal="openCreateRecipeModal" />
      <router-view></router-view>
    </div>
    <ToastNotification />
  </div>
  <RecipeModal :is-open="isCreateRecipeModalOpen" @close="closeCreateRecipeModal" @recipeCreated="handleRecipeCreated" />
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import ToastNotification from '@/components/Toast.vue';
import RecipeModal from '@/components/RecipeModal.vue';
import AppHeader from '@/components/AppHeader.vue';
import store from '@/store';

export default defineComponent({
  name: 'App',
  components: {
    ToastNotification,
    RecipeModal,
    AppHeader
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const userImage = ref('https://lh3.googleusercontent.com/aida-public/AB6AXuCCqtkpyY4pXglnAj4k8A-h5IhFNOOlOIisMfo2qNV8Ez0O7OfFFRVSwnLInK2HFYHPFjVe_FKuQDlVVxI3JfHqwFuVVv0SP62HikiqHke41ouF6cn21SaP9J-d_FktnuQm5aLvDw0mRHstYnyY7B8ZBVDrvHom75M1Kq3Ppsk1JRPBapio-AzOUHIU4eJrXGfkWURDOp6FlEY-jI2SeBVBGHj_W2twuZVB0hbQTc4znSMGY-9lj9bYy-n8A76JYA0k3RGA1hPABqFX');
    const isCreateRecipeModalOpen = ref(false);

    const onSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({ name: 'search', query: { q: searchQuery.value } });
        searchQuery.value = '';
      }
    };

    const openCreateRecipeModal = () => {
      if (store.isAuthenticated) {
        isCreateRecipeModalOpen.value = true;
      } else {
        router.push({ name: 'Login' });
        store.toast('Error', 'Please log in to create a recipe.', 'error');
      }
    };

    const closeCreateRecipeModal = () => {
      isCreateRecipeModalOpen.value = false;
    };

    const handleRecipeCreated = () => {
      // This is triggered after a recipe is successfully created in the modal
      // No specific action needed here if CreatePage handles its own recipe list refresh.
    };

    return {
      searchQuery,
      onSearch,
      userImage,
      isCreateRecipeModalOpen,
      openCreateRecipeModal,
      closeCreateRecipeModal,
      handleRecipeCreated,
    };
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap');
</style>
