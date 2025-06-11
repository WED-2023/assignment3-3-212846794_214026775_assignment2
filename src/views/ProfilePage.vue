<template>
  <div class="profile-container">
    <!-- Sidebar Navigation -->
    <div class="sidebar">
      <div class="user-info">
        <h2>{{ user.username }}</h2>
        <p>{{ user.firstName }} {{ user.lastName }}</p>
        <p>{{ user.email }}</p>
      </div>
      <nav class="nav-menu">
        <button 
          v-for="item in menuItems" 
          :key="item.id"
          :class="['nav-item', { active: activeSection === item.id }]"
          @click="activeSection = item.id"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- My Favorites Section -->
      <section id="favorites" class="mb-10">
        <h2 class="text-3xl font-bold text-[#0c1c17] mb-6">My Favorites</h2>
        <div v-if="favoriteRecipes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecipePreview 
            v-for="recipe in favoriteRecipes"
            :key="recipe.id || recipe.recipe_id"
            :recipe="recipe"
          />
        </div>
        <p v-else class="text-gray-600">You haven't added any favorite recipes yet.</p>
      </section>

      <!-- Last Watched Section -->
      <div v-if="activeSection === 'watched'" class="content-section">
        <h2>Recently Watched Recipes</h2>
        <div v-if="lastWatchedRecipes.length === 0" class="no-recipes">
          <p>You haven't watched any recipes yet.</p>
        </div>
        <div v-else class="recipes-grid">
          <div v-for="recipe in lastWatchedRecipes" :key="recipe.recipe_id" class="recipe-card">
            <img :src="recipe.image" :alt="recipe.title" class="recipe-image">
            <div class="recipe-info">
              <h3>{{ recipe.title }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- My Recipes Section -->
      <div v-if="activeSection === 'my-recipes'" class="content-section">
        <h2>My Recipes</h2>
        <div v-if="myRecipes.length === 0" class="no-recipes">
          <p>You haven't created any recipes yet.</p>
        </div>
        <div v-else class="recipes-grid">
          <div v-for="recipe in myRecipes" :key="recipe.recipe_id" class="recipe-card">
            <img :src="recipe.image" :alt="recipe.title" class="recipe-image">
            <div class="recipe-info">
              <h3>{{ recipe.title }}</h3>
              <div class="recipe-actions">
                <button @click="editRecipe(recipe.recipe_id)" class="edit-btn">Edit</button>
                <button @click="deleteRecipe(recipe.recipe_id)" class="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Family Recipes Section -->
      <div v-if="activeSection === 'family-recipes'" class="content-section">
        <h2>My Family Recipes</h2>
        <div v-if="familyRecipes.length === 0" class="no-recipes">
          <p>You haven't added any family recipes yet.</p>
        </div>
        <div v-else class="recipes-grid">
          <div v-for="recipe in familyRecipes" :key="recipe.recipe_id" class="recipe-card">
            <img :src="recipe.image" :alt="recipe.title" class="recipe-image">
            <div class="recipe-info">
              <h3>{{ recipe.title }}</h3>
              <p>When to prepare: {{ recipe.when_to_prepare }}</p>
              <div class="recipe-actions">
                <button @click="editFamilyRecipe(recipe.recipe_id)" class="edit-btn">Edit</button>
                <button @click="deleteFamilyRecipe(recipe.recipe_id)" class="delete-btn">Delete</button>
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
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { api } from '../services/api';
import RecipePreview from "@/components/RecipePreview.vue";

export default {
  name: 'ProfilePage',
  components: {
    RecipePreview
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = ref({});
    const favoriteRecipes = ref([]);
    const lastWatchedRecipes = ref([]);
    const myRecipes = ref([]);
    const familyRecipes = ref([]);
    const activeSection = ref('favorites');

    const menuItems = [
      { id: 'favorites', label: 'My Favorites' },
      { id: 'watched', label: 'Recently Watched' },
      { id: 'my-recipes', label: 'My Recipes' },
      { id: 'family-recipes', label: 'Family Recipes' }
    ];

    const fetchUserProfile = async () => {
      try {
        const response = await api.users.getProfile();
        user.value = response.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchFavoriteRecipes = async () => {
      try {
        const response = await api.users.getFavorites();
        favoriteRecipes.value = response.data;
      } catch (error) {
        console.error('Error fetching favorite recipes:', error);
      }
    };

    const fetchLastWatchedRecipes = async () => {
      try {
        const response = await api.users.getLastWatchedRecipes();
        lastWatchedRecipes.value = response.data;
      } catch (error) {
        console.error('Error fetching last watched recipes:', error);
      }
    };

    const removeFromFavorites = async (recipeId) => {
      try {
        await api.users.removeFavorite(recipeId);
        await fetchFavoriteRecipes();
      } catch (error) {
        console.error('Error removing from favorites:', error);
      }
    };

    onMounted(async () => {
      await fetchUserProfile();
      await fetchFavoriteRecipes();
      await fetchLastWatchedRecipes();
    });

    return {
      user,
      favoriteRecipes,
      lastWatchedRecipes,
      myRecipes,
      familyRecipes,
      activeSection,
      menuItems,
      removeFromFavorites
    };
  }
};
</script>

<style scoped>
.profile-container {
  display: flex;
  min-height: calc(100vh - 60px);
  background-color: #f5f5f5;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.user-info {
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info h2 {
  margin: 0 0 10px 0;
  font-size: 1.5em;
}

.user-info p {
  margin: 5px 0;
  color: #ecf0f1;
}

.nav-menu {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  padding: 12px 15px;
  background: none;
  border: none;
  color: #ecf0f1;
  text-align: left;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background-color: #3498db;
}

.main-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.content-section {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.recipe-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.recipe-card:hover {
  transform: translateY(-5px);
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recipe-info {
  padding: 15px;
}

.recipe-info h3 {
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.recipe-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.edit-btn, .delete-btn, .remove-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.remove-btn {
  background-color: #95a5a6;
  color: white;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.remove-btn:hover {
  background-color: #7f8c8d;
}

.no-recipes {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}
</style> 