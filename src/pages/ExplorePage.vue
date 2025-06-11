<template>
  <div class="min-h-screen bg-[#f8fcfa] font-family-plus-noto">
    <!-- Header -->
    

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search & Filters -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-[#0c1c17] mb-4">Search Recipes</h2>
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          <!-- Search Input -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Enter recipe name..."
            class="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#46a080]"
          />

          <!-- Filters -->
          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="filters.vegetarian" class="form-checkbox h-5 w-5 text-[#46a080]" />
              <span class="ml-2 text-[#0c1c17]">Vegetarian</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="filters.vegan" class="form-checkbox h-5 w-5 text-[#46a080]" />
              <span class="ml-2 text-[#0c1c17]">Vegan</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="filters.glutenFree" class="form-checkbox h-5 w-5 text-[#46a080]" />
              <span class="ml-2 text-[#0c1c17]">Gluten-Free</span>
            </label>
          </div>

          <!-- Search Button -->
          <button
            @click="onSearch"
            :disabled="isSearching"
            class="px-6 py-2 bg-[#46a080] text-white font-medium rounded hover:bg-[#3e8c72] disabled:opacity-50 transition-colors"
          >
            {{ isSearching ? 'Searching...' : 'Search' }}
          </button>
        </div>
      </section>

      <!-- Results -->
      <section>
        <h2 class="text-2xl font-semibold text-[#0c1c17] mb-4">Results</h2>

        <div v-if="isSearching" class="text-center text-lg text-gray-600">Searching recipes…</div>

        <div v-else-if="results.length === 0" class="text-center text-lg text-gray-600">
          No recipes found.
        </div>

        <div v-else>
          <RecipePreviewList :recipes="results" />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// import AppHeader from "@/components/AppHeader.vue"; // No longer needed
import RecipePreviewList from "@/components/RecipePreviewList.vue";
import axios from "axios";

export default {
  name: "ExplorePage",
  components: {
    // AppHeader,
    RecipePreviewList,
  },
  data() {
    return {
      searchQuery: "",
      filters: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
      },
      isSearching: false,
      results: [],
    };
  },
  methods: {
    async onSearch() {
      this.isSearching = true;
      this.results = [];

      const { vegetarian, vegan, glutenFree } = this.filters;

      try {
        const params = {
          query: this.searchQuery.trim(),
          number: 5,
          addRecipeInformation: true,
        };

        const diets = [];
        if (vegetarian) diets.push("vegetarian");
        if (vegan) diets.push("vegan");
        if (glutenFree) diets.push("gluten free");
        if (diets.length) {
          params.diet = diets.join(",");
        }

        const response = await axios.get("http://localhost:3000/api/recipes/search", { params });

        this.results = response.data.map((raw) => ({
          id: raw.id,
          title: raw.title,
          image: raw.image || "",
          readyInMinutes: raw.readyInMinutes || 0,
          vegetarian: !!raw.vegetarian,
          vegan: !!raw.vegan,
          glutenFree: !!raw.glutenFree,
          servings: raw.servings || 1,
          instructions: raw.instructions || "",
          ingredients:
            (raw.extendedIngredients || []).map((ing) =>
              ing.original ? ing.original : ing.name
            ) || [],
          popularity: raw.popularity || 0,
          source: raw.source || "spoonacular",
        }));
      } catch (error) {
        console.error("Error fetching recipes:", error);
        this.results = [];
      } finally {
        this.isSearching = false;
      }
    },
  },
  mounted() {
    this.onSearch(); // Load default recipes on mount
  },
};
</script>

<style scoped>
.font-family-plus-noto {
  font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;
}
</style>