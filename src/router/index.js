import { createRouter, createWebHistory } from 'vue-router'
import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Main
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../pages/AboutPage.vue')
  },
  {
    path: '/explore',
    name: 'Explore',
    component: () => import('../pages/ExplorePage.vue')
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('../pages/CreatePage.vue')
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/RegisterPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/SearchPage.vue"),
  },
  {
    path: "/recipes/:id",
    name: "RecipePage",
    component: () => import("../pages/RecipePage.vue"),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../pages/MyFavoritesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-recipes',
    name: 'MyRecipes',
    component: () => import('../pages/MyRecipesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/family-recipes',
    name: 'FamilyRecipes',
    component: () => import('../pages/FamilyRecipesPage.vue'),
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
