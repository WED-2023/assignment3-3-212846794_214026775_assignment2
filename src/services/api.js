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
  search: ({ query, limit, cuisine, diet, intolerance, sort, sortDirection }) => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (limit) params.append('limit', limit);
    if (cuisine) params.append('cuisine', cuisine);
    if (diet) params.append('diet', diet);
    if (intolerance) params.append('intolerance', intolerance);
    if (sort) params.append('sort', sort);
    if (sortDirection) params.append('sortDirection', sortDirection);
    return api.get(`/recipes/search?${params.toString()}`);
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
