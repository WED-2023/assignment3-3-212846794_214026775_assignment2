<template>
  <header class="bg-white shadow-sm relative z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Left: Logo & Common Tabs -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center mr-6">
            <img :src="logoSrc" alt="RecipeMaster Logo" class="h-8 w-8 mr-2"/>
            <span class="text-2xl font-bold text-[#46a080]">RecipeMaster</span>
          </router-link>
          <div class="hidden sm:flex sm:space-x-8">
            <router-link to="/" class="nav-tab">Home</router-link>
            <router-link to="/search" class="nav-tab">Search</router-link>
            <router-link to="/about" class="nav-tab">About</router-link>
          </div>
        </div>

        <!-- Right: User Options -->
        <div class="flex items-center space-x-4">
          <template v-if="store.isAuthenticated">
            <span class="text-sm font-medium text-gray-700">Hello, {{ store.user?.username }}</span>
            <button @click="openCreateRecipeModal" class="nav-tab">Create Recipe</button>

            <!-- Meal Plan Link with Count -->
            <router-link to="/meal-plan" class="nav-tab relative">
              Meal Plan
            </router-link>

            <div class="relative">
              <button @click="toggleUserMenu" class="text-sm text-gray-700 hover:text-[#46a080]">
                Personal Area
              </button>
              <div v-if="isUserMenuOpen" class="dropdown">
                <router-link @click="closeUserMenu" to="/favorites" class="dropdown-item">My Favorites</router-link>
                <router-link @click="closeUserMenu" to="/my-recipes" class="dropdown-item">My Recipes</router-link>
                <router-link @click="closeUserMenu" to="/family-recipes" class="dropdown-item">Family Recipes</router-link>
              </div>
            </div>

            <button @click="logout" class="text-sm text-red-500 hover:underline">Logout</button>
          </template>

          <template v-else>
            <span class="text-sm font-medium text-gray-700">Hello Guest</span>
            <router-link to="/login" class="nav-tab">Login</router-link>
            <router-link to="/register" class="nav-tab">Register</router-link>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue';
import logo from '@/assets/logo.png'; // Import the logo image

export default {
  name: 'AppHeader',
  setup() {
    const isUserMenuOpen = ref(false);
    const logoSrc = logo; // Assign the imported logo to a reactive variable

    return {
      isUserMenuOpen,
      logoSrc,
    };
  },
  computed: {
    store() {
      return this.$root.$.appContext.config.globalProperties.store;
    }
  },
  methods: {
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen;
    },
    closeUserMenu() {
      this.isUserMenuOpen = false;
    },
    logout() {
      this.store.logout();
      this.isUserMenuOpen = false;
    },
    openCreateRecipeModal() {
      this.$emit('openCreateRecipeModal');
    }
  }
}
</script>

<style scoped>
.nav-tab {
  @apply inline-flex items-center px-2 pt-1 text-sm font-medium text-[#0c1c17] hover:text-[#46a080] transition-colors;
}
.dropdown {
  @apply absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50;
}
.dropdown-item {
  @apply block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100;
}
</style>
