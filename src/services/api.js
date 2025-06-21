import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Interceptors
api.interceptors.request.use(
  config => {
    console.log('API Request:', config);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    if (error.response?.status === 401 && error.response?.data?.redirectToLogin) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const auth = {
  login: credentials =>
    api.post('/auth/login', {
      username: credentials.username,
      password: credentials.password
    }),

  register: userData => {
    console.log('API register called with:', userData);
    return api.post('/auth/register', {
      username: userData.username,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      firstname: userData.firstname,
      lastname: userData.lastname,
      country: userData.country,
      email: userData.email
    });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      console.warn('Logout API failed; fallback to cleanup');
    } finally {
      localStorage.clear();
      delete api.defaults.headers.common['Authorization'];
    }
  }
};

// Recipes
export const recipes = {
  getAll: () => api.get('/recipes'),
  getById: id => api.get(`/recipes/${id}`),
  create: data => api.post('/recipes', data),
  update: (id, data) => api.put(`/recipes/${id}`, data),
  delete: id => api.delete(`/recipes/${id}`),
  search: options => {
    console.log('API: Search options received:', options);
    const params = new URLSearchParams();
    
    // Always include the query parameter if it exists
    if (options.query) {
      params.append('query', options.query.trim());
    }
    
    // Add other parameters only if they have values
    if (options.limit) params.append('limit', options.limit);
    if (options.cuisine) params.append('cuisine', options.cuisine);
    if (options.diet) params.append('diet', options.diet);
    if (options.intolerance) params.append('intolerance', options.intolerance);
    if (options.sort) params.append('sort', options.sort);
    if (options.sortDirection) params.append('sortDirection', options.sortDirection);
    
    const url = `/recipes/search?${params.toString()}`;
    console.log('API: Search URL:', url);
    return api.get(url);
  },
  getTrending: () => api.get('/recipes/trending'),
  getPopular: () => api.get('/recipes/popular'),
  getMyRecipes: () => api.get('/recipes/my-recipes'),
};

// Users
export const users = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: data => api.put('/users/profile', data),

  // Favorites endpoints
  getFavorites: () => api.get('/users/profile/favorites'),
  addFavorite: recipeId => api.post('/users/profile/favorites', { recipeId }),
  removeFavorite: recipeId => api.delete('/users/profile/favorites', { data: { recipeId } }),

  getLastWatchedRecipes: () => api.get('/users/lastWatchedRecipes'),
  markAsWatched: recipeId =>
    api.post('/users/lastWatchedRecipes', { recipeId }),

  getFamilyRecipes: (username) => api.get(`/users/${username}/family-recipes`),
  addFamilyRecipe: (username, recipeData) => api.post(`/users/${username}/family-recipes`, recipeData),

  prepareRecipe: recipeId =>
    api.post(`/users/prepare-recipe/${recipeId}`),
  getRecipePreparation: recipeId =>
    api.get(`/users/prepare-recipe/${recipeId}`),
  updateRecipeProgress: (recipeId, stepNumber) =>
    api.put(`/users/prepare-recipe/${recipeId}/progress`, { step_number: stepNumber }),
  scaleRecipeServings: (recipeId, servings) =>
    api.put(`/users/prepare-recipe/${recipeId}/servings`, { servings }),
  clearRecipeProgress: () =>
    api.delete('/users/prepare-recipe/progress')
};

export default api;
