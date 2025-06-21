import { reactive } from 'vue';
import { auth, recipes, users } from '../services/api';
import axios from 'axios';

// Cache configuration
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const SEARCH_DEBOUNCE_DELAY = 500; // 500ms debounce delay

// Cache management functions
const cacheManager = {
  set(key, data) {
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  },

  get(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const cacheItem = JSON.parse(item);
    if (Date.now() - cacheItem.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(key);
      return null;
    }
    return cacheItem.data;
  },

  remove(key) {
    localStorage.removeItem(key);
  }
};

// Debounce function
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

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
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
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
      localStorage.setItem('isAuthenticated', 'true');
      
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
    localStorage.removeItem('username');
    localStorage.removeItem('isAuthenticated');

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

  // Check authentication status on app start
  async checkAuth() {
    if (this.isAuthenticated && this.username) {
      try {
        await this.fetchUserProfile();
        await this.initializeData();
      } catch (error) {
        // Only log out if the backend says the session is invalid (401)
        if (error && error.response && error.response.status === 401) {
          this.logout();
        } else {
          // For other errors, keep the user logged in and log the error
          console.error('Store: Error checking auth status (not 401):', error);
        }
      }
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
      // Check cache first
      const cacheKey = `recipe_${id}`;
      const cachedRecipe = cacheManager.get(cacheKey);
      if (cachedRecipe) {
        console.log('Using cached recipe data for:', id);
        this.currentRecipe = cachedRecipe;
        return cachedRecipe;
      }

      console.log('Fetching recipe by ID:', id);
      const response = await recipes.getById(id);
      console.log('Raw Recipe API response:', response);
      
      // Transform the recipe data
      const recipeData = {
        ...response.data,
        isVegan: Boolean(response.data.vegan || response.data.isVegan),
        isVegetarian: Boolean(response.data.vegetarian || response.data.isVegetarian),
        isGlutenFree: Boolean(response.data.glutenFree || response.data.isGlutenFree),
        extendedIngredients: response.data.extendedIngredients || [],
        instructions: response.data.instructions || '',
        summary: response.data.summary || '',
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

      // Cache the transformed data
      cacheManager.set(cacheKey, recipeData);
      
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

  // Debounced search function
  searchRecipes: debounce(async function(options) {
    try {
      console.log('Store: Searching recipes with options:', options);
      
      // Don't search if query is empty or only whitespace
      if (!options.query?.trim()) {
        console.log('Store: Empty search query, clearing results');
        this.searchResults = [];
        return [];
      }

      // Create a cache key based on search parameters
      const cacheKey = `search_${JSON.stringify(options)}`;
      const cachedResults = cacheManager.get(cacheKey);
      
      if (cachedResults) {
        console.log('Store: Using cached search results');
        this.searchResults = cachedResults;
        return cachedResults;
      }

      // Ensure all search parameters are properly formatted
      const searchOptions = {
        query: options.query.trim(),
        limit: options.limit || 5,
        cuisine: options.cuisine || '',
        diet: options.diet || '',
        intolerance: options.intolerance || '',
        sort: options.sort || '',
        sortDirection: options.sortDirection || 'asc'
      };

      console.log('Store: Sending search request with options:', searchOptions);
      const response = await recipes.search(searchOptions);
      console.log('Store: Search response:', response);
      
      if (response?.data) {
        const transformedResults = Array.isArray(response.data) 
          ? response.data 
          : (response.data.data || []);

        const processedResults = transformedResults.map(recipe => ({
          ...recipe,
          isVegan: Boolean(recipe.isVegan || recipe.vegan),
          isVegetarian: Boolean(recipe.isVegetarian || recipe.vegetarian),
          isGlutenFree: Boolean(recipe.isGlutenFree || recipe.glutenFree)
        }));

        // Cache the transformed results
        cacheManager.set(cacheKey, processedResults);
        
        this.searchResults = processedResults;
        console.log('Store: Processed search results:', processedResults);
        return processedResults;
      }
      
      this.searchResults = [];
      return [];
    } catch (error) {
      console.error('Store: Error searching recipes:', error);
      this.searchResults = [];
      
      // Handle specific API errors
      if (error.response) {
        switch (error.response.status) {
          case 402:
            throw new Error('API quota exceeded. Please try again later or contact support.');
          case 401:
            throw new Error('API authentication failed. Please check your API key.');
          case 429:
            throw new Error('Too many requests. Please try again later.');
          default:
            throw new Error(error.response.data?.message || 'Failed to search recipes. Please try again.');
        }
      }
      
      throw new Error('Failed to search recipes. Please check your connection and try again.');
    }
  }, SEARCH_DEBOUNCE_DELAY),

  // Clear search cache
  clearSearchCache() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('search_')) {
        cacheManager.remove(key);
      }
    });
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
      if (!this.isAuthenticated) {
        throw new Error('User not authenticated');
      }
      console.log('Store: Fetching family recipes...');
      const response = await axios.get(`${this.server_domain}/api/family`);
      this.familyRecipes = response.data;
      console.log('Store: Family recipes fetched successfully:', this.familyRecipes);
      return this.familyRecipes;
    } catch (error) {
      console.error('Store: Error fetching family recipes:', error);
      this.familyRecipes = [];
      throw error;
    }
  },

  async createFamilyRecipe(recipeData) {
    if (!this.isAuthenticated) {
      throw new Error('User must be logged in to create family recipes');
    }
    console.log('Creating family recipe:', recipeData);
    try {
      const response = await axios.post(
        `${this.server_domain}/api/family`,
        {
          title: recipeData.title,
          owner: recipeData.owner,
          occasion: recipeData.occasion,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          image: recipeData.image,
          notes: recipeData.notes,
          base_recipe_id: recipeData.base_recipe_id
        },
        {
          withCredentials: true
        }
      );
      console.log('Family recipe created successfully:', response.data);
      // Add the new recipe to the local state
      this.familyRecipes.push({
        ...recipeData,
        family_recipe_id: Date.now(), // Temporary ID until we get the real one from the backend
        user_id: this.user.user_id
      });
      return response.data;
    } catch (error) {
      console.error('Error creating family recipe:', error);
      throw error;
    }
  },

  // Clear cache for a specific recipe or all recipes
  clearRecipeCache(recipeId = null) {
    if (recipeId) {
      cacheManager.remove(`recipe_${recipeId}`);
    } else {
      // Clear all recipe-related cache
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('recipe_') || key.startsWith('search_')) {
          cacheManager.remove(key);
        }
      });
    }
  }
});

export default store; 