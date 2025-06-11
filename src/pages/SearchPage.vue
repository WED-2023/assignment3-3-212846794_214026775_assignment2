<template>
  <div class="relative flex size-full min-h-screen flex-col bg-[#f8fcfa] group/design-root overflow-x-hidden" style='font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;'>
    <div class="layout-container flex h-full grow flex-col">
      <AppHeader />
      <div class="px-40 flex flex-1 justify-center py-5">
        <div class="layout-content-container flex flex-col max-w-[1200px] flex-1">
          <!-- Search Input Section -->
          <div class="flex flex-wrap items-end gap-4 px-4 py-3">
            <label class="flex flex-col min-w-40 flex-1">
              <p class="text-[#111815] text-base font-medium leading-normal pb-2">Search Query</p>
              <input
                v-model="searchQuery"
                @keyup.enter="search"
                placeholder="Search for recipes or ingredients"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] focus:border-none h-14 placeholder:text-[#63887b] p-4 text-base font-normal leading-normal"
              />
            </label>
            <button
              @click="search"
              class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#19e59e] text-[#111815] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span class="truncate">Search</span>
            </button>
            </div>

          <!-- Filter and Sort Options -->
          <div class="flex flex-wrap items-end gap-4 px-4 py-3">
            <label class="flex flex-col min-w-32 flex-1">
              <p class="text-[#111815] text-base font-medium leading-normal pb-2">Results Limit</p>
              <select v-model.number="limit" class="form-select rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] h-10 px-4 text-base font-normal leading-normal">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>

            <label class="flex flex-col min-w-32 flex-1">
              <p class="text-[#111815] text-base font-medium leading-normal pb-2">Cuisine</p>
              <select v-model="selectedCuisine" class="form-select rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] h-10 px-4 text-base font-normal leading-normal">
                <option value="">Any</option>
                <option v-for="cuisine in cuisineOptions" :key="cuisine" :value="cuisine">{{ cuisine }}</option>
              </select>
            </label>

            <label class="flex flex-col min-w-32 flex-1">
              <p class="text-[#111815] text-base font-medium leading-normal pb-2">Diet</p>
              <select v-model="selectedDiet" class="form-select rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] h-10 px-4 text-base font-normal leading-normal">
                <option value="">Any</option>
                <option v-for="diet in dietOptions" :key="diet" :value="diet">{{ diet }}</option>
              </select>
            </label>

            <label class="flex flex-col min-w-32 flex-1">
              <p class="text-[#111815] text-base font-medium leading-normal pb-2">Intolerance</p>
              <select v-model="selectedIntolerance" class="form-select rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] h-10 px-4 text-base font-normal leading-normal">
                <option value="">Any</option>
                <option v-for="intolerance in intoleranceOptions" :key="intolerance" :value="intolerance">{{ intolerance }}</option>
              </select>
            </label>

            <label class="flex flex-col min-w-32 flex-1">
              <p class="text-[#111815] text-base font-medium leading-normal pb-2">Sort By</p>
              <select v-model="sortBy" class="form-select rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] h-10 px-4 text-base font-normal leading-normal">
                <option value="">None</option>
                <option value="readyInMinutes">Preparation Time</option>
                <option value="popularity">Popularity</option>
              </select>
            </label>

            <label v-if="sortBy" class="flex flex-col min-w-32 flex-1">
              <p class="text-[#111815] text-base font-medium leading-normal pb-2">Sort Direction</p>
              <select v-model="sortDirection" class="form-select rounded-xl text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] h-10 px-4 text-base font-normal leading-normal">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
          </label>
            </div>

          <!-- Search Results (if any) -->
          <div v-if="store.searchResults && store.searchResults.length > 0">
            <h2 class="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Search Results</h2>
            <RecipePreviewList :recipes="store.searchResults" />
          </div>
          <div v-else-if="hasSearched && !isLoading" class="text-center text-gray-500 text-lg py-10">
            <p>No recipes found matching your criteria. Try adjusting your search or filters.</p>
          </div>

          <!-- Trending Recipes -->
          <h2 class="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Trending Recipes</h2>
          <div class="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div class="flex items-stretch p-4 gap-3">
              <RecipePreview v-for="recipe in store.trendingRecipes.slice(0,3)" :key="recipe.id" :recipe="recipe" />
            </div>
          </div>

        </div>
      </div>
    </div>
    </div>
  </template>

<script>
import { getCurrentInstance, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RecipePreviewList from '../components/RecipePreviewList.vue';
import RecipePreview from '../components/RecipePreview.vue';

export default {
  name: 'SearchPage',
  components: {
    RecipePreviewList,
    RecipePreview
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const route = useRoute();
    const router = useRouter();

    const searchQuery = ref(route.query.q || '');
    const limit = ref(localStorage.getItem('searchLimit') ? Number(localStorage.getItem('searchLimit')) : 5);
    const selectedCuisine = ref(localStorage.getItem('searchCuisine') || '');
    const selectedDiet = ref(localStorage.getItem('searchDiet') || '');
    const selectedIntolerance = ref(localStorage.getItem('searchIntolerance') || '');
    const sortBy = ref(localStorage.getItem('searchSortBy') || '');
    const sortDirection = ref(localStorage.getItem('searchSortDirection') || 'asc');

    const cuisineOptions = [
      'African', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 'European',
      'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean',
      'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish',
      'Thai', 'Vietnamese'
    ];
    const dietOptions = [
      'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian', 'Ovo-Vegetarian', 'Vegan',
      'Pescetarian', 'Paleo', 'Primal', 'Whole30'
    ];
    const intoleranceOptions = [
      'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 'Shellfish', 'Soy',
      'Sulfite', 'Tree Nut', 'Wheat'
    ];

    const categories = ref([
      { name: 'Breakfast', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLkzArtRV4tT2q59M4x3ZIK_0grebpPLq-1QnswZmqxi9MNYrYfFZYp4uYYLH60x3s0OLy3-WL-PYJVUcXECmToyl5YkWtjLG_ucTeKJbsw5w1dMwa2bOXBnqPOio-quyO8PkjW0VDCpwR4xDyuFtOWcnC9cbZVxezk6ZfwjlelobaN3W-V4-hpZfYFHNNqlPD71R5SW31hE8dM9j7wHAqZ6BG0Gr2KTBDx5ksEwBQda3NI696InrQLHu8K0ZAVsSad2_ZTWfNGqgJ' },
      { name: 'Lunch', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg2MNsowDfCixATejYP7nSdKc4IlG9eOFh1DvfsrBnj_e8CYzET1QXWvQUndcIAn7cTI4KzMxl4II3EAcJzYh5bLrKUQYjmUeR3N9w6rsM7tDZEwOUUP_bHtOyphBSOUnicki5ebYmATsyQUBm8EKqK42KN6buSTKRpaxpSoobHbTUpMr7fO-P7HQE1j4IFgQmZ_uwC_0woVnti2UnpywIoIXV6nzk2MLYIeWNPs25kwiVnPzSnh3GVjmPjUZIrN4IAVjt3AOMBw6d' },
      { name: 'Dinner', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI1GdKw486uuC6PuENL2zYZXGuDydHJyQHQJn-fqOLCvSuaK3Z1Bz9JM4yOM1RD4drlITS5OyvTdAOaByd1dDfVO4pu4PrCdHMAlF2nVl3L4jm1z9Fwxqh9a8bJSJbXJ2SOnryjqldmw099i-HnW7iGyMBSGA8EOITUV0lG6wcIlIwLUvF0ha1m_OaXlxmIUgPynELsrAoqireRDg-_QU4f_lq8hnDxwuHJuA2U_Mu0yj_MS410r-xYlTY06FYgih-zLrsaVylquW_' },
      { name: 'Desserts', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr3qjXxR5rdtD2r6FlDL6lIuBGmv12BMwrY3RP4suN4KzqF1tvHEZwdBvI9p4XAp2tE4-f9s6_CxjvXUiG5iqvjZEhjzfzIDmzEjTQ68ZcPySjns5uqFxJoutba_242Zdhk_-LzTI8R8GmdRTu-DoEKqfewnfioeGsoH0tTwtnsLDaD4LTWi9U5uS8g3nds9BxlqichvT2itcJCy-MRUFmNoFsiukowLxYajwbT253KH3Oj6gsL2H2cV1NsWYHT8nWx84BIGy9MlVo' },
      { name: 'Snacks', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2wXa7erMhZNrhoaJeJgkUKiCjm9e3fBPfX1lmLi7_xH2LTkSkK0LeQjpHt3B06oJx6F5Y5Wx303mYsMq-Gc_xHf3IgcMESp0fHISX06toNonFvlW16CP6LU4lBu1RE5IsqM8iDMKDrDbU2sKswW0y1MWpTk9idXfnsf9Kln5CtLk9rVwCFF4Qt-k1bl-R1qhQOMjYzBUfLrag5f8J7wNcur-Ffcd1yhTqnrfGmGTUl97gzzHNV2kakcxpDYe9vm2qzgIgqdbjFhKX' },
      { name: 'Drinks', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqopCftcXqMIbiBRxiaht-71SxibXgy-eAom-XNZ3sEnAr8VQR4SldnrXUXpVdBfnAq4zM1my5Yl8IGnmXR71Ah0L4iHTYZqS_ujd_7lptMKfGxKERSTKafJ9k8SEUNynpIqrdUPoXqhECGUIYd2XU84iUgZQ4_3jxw_gx5D38srTZ2f6YS-OsyXMeOiyegX9hHDFz-6qMxbSCHXlkbm158XvyI2IZPhtopIYhoUk-YJqgYn_WrSbR8iEBXQ3mmpFqwZh9cvvbwqo7' }
    ]);

    const isLoading = ref(false);
    const hasSearched = ref(false);

    const search = async () => {
      if (!searchQuery.value.trim()) {
        store.searchResults = [];
        hasSearched.value = true;
        return;
      }
      isLoading.value = true;
      hasSearched.value = true;
      
      // Save search parameters to localStorage
      localStorage.setItem('searchQuery', searchQuery.value);
      localStorage.setItem('searchLimit', limit.value.toString());
      localStorage.setItem('searchCuisine', selectedCuisine.value);
      localStorage.setItem('searchDiet', selectedDiet.value);
      localStorage.setItem('searchIntolerance', selectedIntolerance.value);
      localStorage.setItem('searchSortBy', sortBy.value);
      localStorage.setItem('searchSortDirection', sortDirection.value);

      try {
        await store.searchRecipes({
          query: searchQuery.value,
          limit: limit.value,
          cuisine: selectedCuisine.value,
          diet: selectedDiet.value,
          intolerance: selectedIntolerance.value,
          sort: sortBy.value,
          sortDirection: sortDirection.value
        });
        console.log('SearchPage: store.searchResults after search:', store.searchResults);
      } catch (error) {
        toast('Error', 'Failed to search recipes', 'error');
      } finally {
        isLoading.value = false;
      }
    };

    const filterByCategory = async (category) => {
      searchQuery.value = category;
      // Clear other filters when using category buttons for a fresh search
      selectedCuisine.value = '';
      selectedDiet.value = '';
      selectedIntolerance.value = '';
      sortBy.value = '';
      sortDirection.value = 'asc';
      router.push({ name: 'search', query: { q: category } });
    };

    // Watch for changes in the route query and update searchQuery
    watch(() => route.query.q, async (newQ) => {
      searchQuery.value = newQ || '';
      if (searchQuery.value) {
        // Load last search parameters only if a query is present from URL
        limit.value = localStorage.getItem('searchLimit') ? Number(localStorage.getItem('searchLimit')) : 5;
        selectedCuisine.value = localStorage.getItem('searchCuisine') || '';
        selectedDiet.value = localStorage.getItem('searchDiet') || '';
        selectedIntolerance.value = localStorage.getItem('searchIntolerance') || '';
        sortBy.value = localStorage.getItem('searchSortBy') || '';
        sortDirection.value = localStorage.getItem('searchSortDirection') || 'asc';
        await search();
      } else {
        // If no query in URL, reset search results and filters
        store.searchResults = [];
        hasSearched.value = false;
        limit.value = 5;
        selectedCuisine.value = '';
        selectedDiet.value = '';
        selectedIntolerance.value = '';
        sortBy.value = '';
        sortDirection.value = 'asc';
      }
    }, { immediate: true });

    // On mount, if there is a query, perform the search
    onMounted(async () => {
      // Load last search parameters from localStorage if no query in URL
      if (!route.query.q && localStorage.getItem('searchQuery')) {
        searchQuery.value = localStorage.getItem('searchQuery') || '';
        limit.value = localStorage.getItem('searchLimit') ? Number(localStorage.getItem('searchLimit')) : 5;
        selectedCuisine.value = localStorage.getItem('searchCuisine') || '';
        selectedDiet.value = localStorage.getItem('searchDiet') || '';
        selectedIntolerance.value = localStorage.getItem('searchIntolerance') || '';
        sortBy.value = localStorage.getItem('searchSortBy') || '';
        sortDirection.value = localStorage.getItem('searchSortDirection') || 'asc';
      if (searchQuery.value) {
        await search();
        }
      }

      // Also fetch trending recipes
      try {
        await store.fetchTrendingRecipes();
      } catch (error) {
        toast('Error', 'Failed to load trending recipes', 'error');
      }
    });

    return {
      store,
      searchQuery,
      limit,
      selectedCuisine,
      selectedDiet,
      selectedIntolerance,
      sortBy,
      sortDirection,
      cuisineOptions,
      dietOptions,
      intoleranceOptions,
      categories,
      isLoading,
      hasSearched,
      search,
      filterByCategory
    };
  }
};
</script>
  