import { reactive } from 'vue';
import { auth, recipes, users } from '../services/api';

const store = reactive({
  username: localStorage.getItem('username') || '',
  user: null,
  recipes: [],
  trendingRecipes: [],
  popularRecipes: [],
  favorites: [],
  lastWatchedRecipes: [],
  currentRecipe: null,
  searchResults: [],
  server_domain: "http://localhost:3000",
  isAuthenticated: false,
  familyRecipes: [],

  // Auth methods
  async login(credentials) {
    try {
      console.log('Store: Starting login process');
      const response = await auth.login(credentials);
      
      if (!response?.data) {
        console.error('Store: No data in login response');
        throw new Error('Invalid server response');
      }

      // Extract user data from response
      const userData = response.data;
      console.log('Store: Login response data:', userData);

      // Set authentication state
      this.username = userData.username || credentials.username;
      this.isAuthenticated = true;
      
      // Store in localStorage
      localStorage.setItem('username', this.username);
      
      console.log('Store: Login successful, initializing data');
      
      // Initialize data after successful login
      try {
        // Fetch user profile first
        await this.fetchUserProfile();
        console.log('Store: User profile fetched:', this.user);
        
        await this.initializeData();
        console.log('Store: Data initialization completed');
      } catch (error) {
        console.error('Store: Error initializing data:', error);
        // Don't throw here, as login was successful
      }
      
      return true;
    } catch (error) {
      console.error('Store: Login failed:', error);
      this.logout();
      throw error;
    }
  },

  async register(userData) {
    try {
      console.log('Attempting registration with:', userData);
      const response = await auth.register(userData);
      console.log('Registration response:', response);
      
      if (response && response.data) {
        // Check if we have a token in the response
        const token = response.data.token;
        const username = response.data.username;
        
        if (!token || !username) {
          console.warn('Registration successful but no token/username in response:', response.data);
          // If registration was successful but no token, we should still consider it a success
          // and redirect to login
          return { success: true, needsLogin: true };
        }
        
        // If we have a token, proceed with automatic login
        this.username = username;
        this.isAuthenticated = true;
        
        localStorage.setItem('username', this.username);
        
        // Initialize data after successful registration
        try {
          await this.initializeData();
        } catch (error) {
          console.error('Error initializing data:', error);
          // Don't throw here, as registration was successful
        }
        
        return { success: true, needsLogin: false };
      }
      
      // If we get here, registration was successful but response format is unexpected
      console.warn('Unexpected registration response format:', response);
      return { success: true, needsLogin: true };
      
    } catch (error) {
      console.error('Registration error:', error);
      this.logout(); // Clear any partial state
      
      // Provide more specific error messages
      if (error.message === 'Username already exists') {
        throw new Error('This username is already taken. Please choose a different one.');
      } else if (error.message === 'Invalid registration data') {
        throw new Error('Please check your registration information and try again.');
      } else if (error.response) {
        switch (error.response.status) {
          case 409:
            throw new Error('This username is already taken. Please choose a different one.');
          case 400:
            throw new Error('Please check your registration information and try again.');
          default:
            throw new Error(error.response.data?.message || 'Registration failed. Please try again.');
        }
      }
      throw error;
    }
  },

  logout() {
    // Clear all stored data
    this.username = '';
    this.isAuthenticated = false;
    this.recipes = [];
    this.trendingRecipes = [];
    this.popularRecipes = [];
    this.favorites = [];
    this.lastWatchedRecipes = [];
    this.currentRecipe = null;
    this.searchResults = [];
    this.familyRecipes = [];

    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear any cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });

    // Call the API logout
    auth.logout();
  },

  // Initialize data after login/registration
  async initializeData() {
    try {
      if (!this.isAuthenticated || !this.username) {
        throw new Error('User not authenticated');
      }
      console.log('Store: Initializing data...');
      await Promise.all([
        this.fetchTrendingRecipes(),
        this.fetchPopularRecipes(),
        this.fetchFavorites(),
        this.fetchLastWatchedRecipes(),
        this.fetchUserProfile()
      ]);
      console.log('Store: Data initialization complete.');
    } catch (error) {
      console.error('Store: Error initializing data:', error);
      throw error;
    }
  },

  // Recipe methods
  async fetchRecipes() {
    try {
      if (!this.isAuthenticated) {
        console.warn('Fetching recipes without authentication');
      }      
      console.log('Store: Attempting to fetch all recipes');
      const response = await recipes.getAll();
      console.log('Store: All recipes response:', response);
      if (response && response.data && Array.isArray(response.data)) {
        this.recipes = response.data;
        console.log('Store: Successfully fetched all recipes');
        return this.recipes;
      }
      console.error('Store: Invalid response format for all recipes', response);
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Store: Error fetching all recipes:', error);
      throw error;
    }
  },

  async fetchTrendingRecipes() {
    try {
      if (!this.isAuthenticated) {
        throw new Error('User not authenticated');
      }
      console.log('Store: Attempting to fetch trending recipes');
      const response = await recipes.getTrending();
      console.log('Store: Trending recipes response:', response);
      if (response && response.data && Array.isArray(response.data)) {
        this.trendingRecipes = response.data.map(recipe => ({
          ...recipe,
          isVegan: Boolean(recipe.isVegan || recipe.vegan),
          isVegetarian: Boolean(recipe.isVegetarian || recipe.vegetarian),
          isGlutenFree: Boolean(recipe.isGlutenFree || recipe.glutenFree)
        }));
        console.log('Store: Successfully fetched trending recipes');
      } else {
        console.warn('Store: Invalid trending recipes response format:', response);
        this.trendingRecipes = [];
      }
      return this.trendingRecipes;
    } catch (error) {
      console.error('Store: Error fetching trending recipes:', error);
      this.trendingRecipes = [];
      throw error;
    }
  },

  async fetchPopularRecipes() {
    try {
      if (!this.isAuthenticated) {
        throw new Error('User not authenticated');
      }
      console.log('Store: Attempting to fetch popular recipes');
      const response = await recipes.getPopular();
      console.log('Store: Popular recipes response:', response);
      if (response && response.data && Array.isArray(response.data)) {
        this.popularRecipes = response.data.map(recipe => ({
          ...recipe,
          isVegan: Boolean(recipe.isVegan || recipe.vegan),
          isVegetarian: Boolean(recipe.isVegetarian || recipe.vegetarian),
          isGlutenFree: Boolean(recipe.isGlutenFree || recipe.glutenFree)
        }));
        console.log('Store: Successfully fetched popular recipes');
      } else {
        console.warn('Store: Invalid popular recipes response format:', response);
        this.popularRecipes = [];
      }
      return this.popularRecipes;
    } catch (error) {
      console.error('Store: Error fetching popular recipes:', error);
      this.popularRecipes = [];
      throw error;
    }
  },

  async fetchRecipeById(id) {
    try {
      console.log('Fetching recipe by ID:', id);
      const response = await recipes.getById(id);
      console.log('Raw Recipe API response:', response);
      
      // Transform the recipe data to ensure consistent format
      const recipeData = {
        ...response.data, // Access the data property of the response
        isVegan: Boolean(response.data.vegan || response.data.isVegan),
        isVegetarian: Boolean(response.data.vegetarian || response.data.isVegetarian),
        isGlutenFree: Boolean(response.data.glutenFree || response.data.isGlutenFree),
        
        // Ensure extendedIngredients is an array
        extendedIngredients: response.data.extendedIngredients || [],
        
        // Ensure instructions and summary are separate
        instructions: response.data.instructions || '',
        summary: response.data.summary || '',

        // Add preparationMinutes and cookingMinutes for consistency
        preparationMinutes: response.data.preparationMinutes || 0,
        cookingMinutes: response.data.cookingMinutes || 0,

        popularity: response.data.popularity || response.data.spoonacularScore || 0,
        dishTypes: response.data.dishTypes || [],
        healthScore: response.data.healthScore || 0,
        pricePerServing: response.data.pricePerServing || 0,
        sourceName: response.data.sourceName || '',
        sourceUrl: response.data.sourceUrl || '',
        spoonacularSourceUrl: response.data.spoonacularSourceUrl || '',
        analyzedInstructions: response.data.analyzedInstructions || []
      };

      console.log('Transformed recipe data:', recipeData);
      this.currentRecipe = recipeData;
      return recipeData;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw error;
    }
  },

  async fetchMyRecipes() {
    try {
      if (!this.isAuthenticated) {
        throw new Error('User not authenticated');
      }
      console.log('Store: Attempting to fetch user recipes');
      const response = await recipes.getMyRecipes();
      console.log('Store: My Recipes response:', response);
      if (response && response.data && Array.isArray(response.data)) {
        this.recipes = response.data;
        console.log('Store: Successfully fetched user recipes');
      } else {
        console.warn('Store: Invalid user recipes response format:', response);
        this.recipes = [];
      }
      return this.recipes;
    } catch (error) {
      console.error('Store: Error fetching user recipes:', error);
      this.recipes = [];
      throw error;
    }
  },

  async createRecipe(recipeData) {
    try {
      const response = await recipes.create(recipeData);
      this.recipes.push(response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  },

  async updateRecipe(id, recipeData) {
    try {
      const response = await recipes.update(id, recipeData);
      const index = this.recipes.findIndex(recipe => recipe.id === id);
      if (index !== -1) {
        this.recipes[index] = response.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  },

  async deleteRecipe(id) {
    try {
      await recipes.delete(id);
      this.recipes = this.recipes.filter(recipe => recipe.id !== id);
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  },

  async searchRecipes(options) {
    try {
      console.log('Store: Searching recipes with options:', options);
      const response = await recipes.search(options);
      console.log('Store: Search response:', response);
      
      // The backend returns { success: true, data: [...] }
      if (response && response.data && Array.isArray(response.data.data)) {
        this.searchResults = response.data.data.map(recipe => ({
          ...recipe,
          isVegan: Boolean(recipe.isVegan || recipe.vegan),
          isVegetarian: Boolean(recipe.isVegetarian || recipe.vegetarian),
          isGlutenFree: Boolean(recipe.isGlutenFree || recipe.glutenFree)
          // totalResults, offset, number are on the top-level response, not per recipe.
          // If needed in the UI, they should be stored separately, e.g., in a searchMeta object.
        }));
        console.log('Store: Search results updated:', this.searchResults);
        return this.searchResults;
      }
      
      console.warn('Store: Invalid search response format:', response);
      this.searchResults = [];
      return [];
    } catch (error) {
      console.error('Store: Error searching recipes:', error);
      this.searchResults = [];
      throw error;
    }
  },

  // User methods
  async fetchFavorites() {
    try {
      if (!this.isAuthenticated) {
        console.warn('Store: Fetching favorites without authentication');
        this.favorites = [];
        return [];
      }
      console.log('Store: Attempting to fetch favorites...');
      const response = await users.getFavorites();
      console.log('Store: Raw favorites response:', response);
      if (response && response.data) {
        this.favorites = response.data.map(recipe => ({
          ...recipe,
          isVegan: Boolean(recipe.isVegan || recipe.vegan),
          isVegetarian: Boolean(recipe.isVegetarian || recipe.vegetarian),
          isGlutenFree: Boolean(recipe.isGlutenFree || recipe.glutenFree)
        }));
        console.log('Store: Favorites fetched and mapped successfully:', this.favorites);
        return this.favorites;
      }
      throw new Error('Invalid response format for favorites');
    } catch (error) {
      console.error('Store: Error fetching favorites:', error);
      this.favorites = [];
      throw error;
    }
  },

  async addFavorite(recipeId) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('User not authenticated');
      }
      console.log('Store: Adding recipe to favorites:', recipeId);
      await users.addFavorite(recipeId);
      // Refresh favorites list
      await this.fetchFavorites();
      console.log('Store: Recipe added to favorites successfully');
    } catch (error) {
      console.error('Store: Error adding to favorites:', error);
      throw error;
    }
  },

  async removeFavorite(recipeId) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('User not authenticated');
      }
      console.log('Store: Removing recipe from favorites:', recipeId);
      await users.removeFavorite(recipeId);
      // Refresh favorites list
      await this.fetchFavorites();
      console.log('Store: Recipe removed from favorites successfully');
    } catch (error) {
      console.error('Store: Error removing from favorites:', error);
      throw error;
    }
  },

  async fetchLastWatchedRecipes() {
    try {
      if (!this.isAuthenticated) {
        throw new Error('User not authenticated');
      }
      console.log('Store: Attempting to fetch last watched recipes');
      const response = await users.getLastWatchedRecipes(this.user.username); // Assuming username is needed and available
      console.log('Store: Last watched recipes response:', response);
      if (response && response.data && Array.isArray(response.data)) {
        this.lastWatchedRecipes = response.data.map(recipe => ({
          ...recipe,
          isVegan: Boolean(recipe.isVegan || recipe.vegan),
          isVegetarian: Boolean(recipe.isVegetarian || recipe.vegetarian),
          isGlutenFree: Boolean(recipe.isGlutenFree || recipe.glutenFree)
        }));
        console.log('Store: Successfully fetched last watched recipes');
      } else {
        console.warn('Store: Invalid last watched recipes response format:', response);
        this.lastWatchedRecipes = [];
      }
      return this.lastWatchedRecipes;
    } catch (error) {
      console.error('Store: Error fetching last watched recipes:', error);
      this.lastWatchedRecipes = [];
      throw error;
    }
  },

  async markAsWatched(recipeId) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('User not authenticated. Cannot mark recipe as watched.');
      }
      console.log('Store: Marking recipe as watched:', recipeId);
      await users.markAsWatched(recipeId);
      // After marking as watched, it's good practice to refresh the last watched list
      await this.fetchLastWatchedRecipes();
      console.log('Store: Recipe successfully marked as watched and list refreshed.');
    } catch (error) {
      console.error('Store: Error marking recipe as watched:', error);
      throw error;
    }
  },

  async fetchUserProfile() {
    try {
      console.log('Store: Attempting to fetch user profile...');
      const response = await users.getProfile();
      console.log('Store: Fetch user profile response:', response);
      if (response.data) {
        this.user = response.data;
        console.log('Store: User profile fetched and stored.', this.user);
        console.log('Store: Profile picture URL:', this.user.profile_pic);
      } else {
        console.warn('Store: Fetch user profile did not return expected data.', response);
        this.user = null; // Ensure user is null if data is unexpected
      }
    } catch (error) {
      console.error('Store: Error fetching user profile:', error);
      this.user = null; // Ensure user is null on error
    }
  },

  async fetchFamilyRecipes() {
    try {
      if (!this.isAuthenticated || !this.username) {
        throw new Error('User not authenticated');
      }
      console.log('Store: Attempting to fetch family recipes for user:', this.username);
      const response = await users.getFamilyRecipes(this.username);
      console.log('Store: Family Recipes response:', response);
      if (response && response.data && Array.isArray(response.data)) {
        this.familyRecipes = response.data;
        console.log('Store: Successfully fetched family recipes');
      } else {
        console.warn('Store: Invalid family recipes response format:', response);
        this.familyRecipes = [];
      }
      return this.familyRecipes;
    } catch (error) {
      console.error('Store: Error fetching family recipes:', error);
      this.familyRecipes = [];
      throw error;
    }
  }
});

export default store; 