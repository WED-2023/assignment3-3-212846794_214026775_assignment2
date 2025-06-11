<template>
  <div class="min-h-screen flex flex-col bg-[#f8fcfa]">
    <!-- 1️⃣ App Header -->
    

    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside class="w-80 bg-white shadow-md">
        <div class="flex flex-col h-full justify-between">
          <!-- User Info & Navigation -->
          <div class="px-6 py-8">
            <!-- Profile Photo & Basic Info -->
            <div class="flex items-center space-x-4 mb-6">
              <div
                class="h-20 w-20 rounded-full bg-gray-200 bg-center bg-cover"
                :style="{
                  backgroundImage: `url('${profileData.profile_pic || '/default-profile-pic.webp'}')`
                }"
              ></div>
              <div>
                <p class="text-xl font-semibold text-[#0c1c17] line-clamp-1">
                  {{ profileData.username || 'Username' }}
                </p>
                <p class="text-sm text-[#46a080] line-clamp-1">
                  {{ profileData.email || 'email@example.com' }}
                </p>
              </div>
            </div>

            <!-- Navigation Links -->
            <nav class="space-y-2">
              <router-link
                to="/profile"
                class="flex items-center px-3 py-2 text-[#0c1c17] rounded-md hover:bg-[#e4f4ef] transition-colors"
                active-class="bg-[#e4f4ef]"
              >
                <svg class="w-5 h-5 mr-3 text-[#46a080]" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4s-4 1.79-4 4 1.79 4 4 4zm0 
                       2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
                <span>Profile</span>
              </router-link>

              <!-- New Link for My Favorites -->
              <a href="#favorites"
                class="flex items-center px-3 py-2 text-[#0c1c17] rounded-md hover:bg-[#e4f4ef] transition-colors">
                <svg class="w-5 h-5 mr-3 text-[#46a080]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.83-1.68C4.52 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-2.52 6.86-8.17 11.17L12 21.35z"/>
                </svg>
                <span>My Favorites</span>
              </a>

              <!-- New Link for Last Watched -->
              <a href="#last-watched"
                class="flex items-center px-3 py-2 text-[#0c1c17] rounded-md hover:bg-[#e4f4ef] transition-colors">
                <svg class="w-5 h-5 mr-3 text-[#46a080]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6 5.6 2.5 5.6 5.6-2.5 5.6-5.6 5.6zm0-9c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
                </svg>
                <span>Last Watched</span>
              </a>

              <router-link
                to="/settings"
                class="flex items-center px-3 py-2 text-[#0c1c17] rounded-md hover:bg-[#e4f4ef] transition-colors"
                active-class="bg-[#e4f4ef]"
              >
                <svg class="w-5 h-5 mr-3 text-[#46a080]" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19.14 12.936a7.997 7.997 0 0 0 .06-1.936 7.997 7.997 0 0 
                       0-.06-1.936l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 
                       0 0 0-.6-.22l-2.39.96a7.995 7.995 0 0 0-1.7-.99l-.36-2.54A.5.5 
                       0 0 0 14 2h-4a.5.5 0 0 0-.49.42l-.36 2.54a7.995 7.995 0 0 
                       0-1.7.99l-2.39-.96a.5.5 0 0 0-.6.22l-1.92 3.32a.5.5 0 
                       0 0 .12.64l2.03 1.58a7.997 7.997 0 0 0 0 3.872l-2.03 1.58a.5.5 0 
                       0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.52.4 1.08.73 
                       1.7.99l.36 2.54A.5.5 0 0 0 10 22h4a.5.5 0 0 0 .49-.42l.36-2.54a7.995 
                       7.995 0 0 0 1.7-.99l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 
                       0 0-.12-.64l-2.03-1.58zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 
                       1 0 7z"
                  />
                </svg>
                <span>Settings</span>
              </router-link>
            </nav>
          </div>

          <!-- Logout Button -->
          <div class="p-6">
            <button
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#e4f4ef] text-[#0c1c17] font-medium rounded hover:bg-[#d4ece4] transition-colors"
            >
              <svg class="w-5 h-5 text-[#46a080]" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-8v2h8v14h-8v2h8c1.1 
                     0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex justify-center py-10">
        <div class="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-3xl font-bold text-[#0c1c17] mb-6">Edit Profile</h2>

          <form @submit.prevent="handleUpdate" class="space-y-6">
            <!-- Profile Picture Preview & URL -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div
                class="h-24 w-24 rounded-full bg-gray-200 bg-center bg-cover"
                :style="{
                  backgroundImage: `url('${profileData.profile_pic || '/default-profile-pic.webp'}')`
                }"
              ></div>
              <div class="flex-1">
                <label class="block text-[#0c1c17] text-sm font-medium mb-1" for="profilePic">
                  Profile Picture URL
                </label>
                <input
                  id="profilePic"
                  type="url"
                  v-model="profileData.profile_pic"
                  class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#46a080]"
                  placeholder="https://example.com/your-photo.jpg"
                />
              </div>
            </div>

            <!-- Two‐Column Grid for Text Fields -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Username (Read‐only) -->
              <div>
                <label class="block text-[#0c1c17] text-sm font-medium mb-1" for="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  v-model="profileData.username"
                  class="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded"
                  readonly
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-[#0c1c17] text-sm font-medium mb-1" for="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  v-model="profileData.email"
                  class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#46a080]"
                  required
                />
              </div>

              <!-- First Name -->
              <div>
                <label class="block text-[#0c1c17] text-sm font-medium mb-1" for="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  v-model="profileData.first_name"
                  class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#46a080]"
                />
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-[#0c1c17] text-sm font-medium mb-1" for="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  v-model="profileData.last_name"
                  class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#46a080]"
                />
              </div>

              <!-- Country -->
              <div>
                <label class="block text-[#0c1c17] text-sm font-medium mb-1" for="country">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  v-model="profileData.country"
                  class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#46a080]"
                />
              </div>

              <!-- Bio (spans both columns on small screens) -->
              <div class="sm:col-span-2">
                <label class="block text-[#0c1c17] text-sm font-medium mb-1" for="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  v-model="profileData.bio"
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#46a080]"
                  placeholder="Tell us a bit about yourself..."
                ></textarea>
              </div>
            </div>

            <!-- Save Changes Button -->
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isUpdating"
                class="px-6 py-2 bg-[#46a080] text-white font-medium rounded hover:bg-[#3e8c72] disabled:opacity-50 transition-colors"
              >
                {{ isUpdating ? "Saving…" : "Save Changes" }}
              </button>
            </div>
          </form>
          
          <hr class="my-8 border-gray-200" />

          <!-- My Favorites Section -->
          <section id="favorites" class="mb-10">
            <h2 class="text-3xl font-bold text-[#0c1c17] mb-6">My Favorites</h2>
            <div v-if="store.favorites.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <RecipePreview 
                v-for="recipe in store.favorites"
                :key="recipe.id"
                :recipe="recipe"
              />
            </div>
            <p v-else class="text-gray-600">You haven't added any favorite recipes yet.</p>
          </section>

          <!-- Last Watched Section -->
          <section id="last-watched">
            <h2 class="text-3xl font-bold text-[#0c1c17] mb-6">Last Watched Recipes</h2>
            <div v-if="store.lastWatchedRecipes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <RecipePreview 
                v-for="recipe in store.lastWatchedRecipes"
                :key="recipe.id"
                :recipe="recipe"
              />
            </div>
            <p v-else class="text-gray-600">You haven't watched any recipes recently.</p>
          </section>

        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { createToast } from "@/components/Toast";
import store from "@/store"; // Import the store
import RecipePreview from "@/components/RecipePreview.vue"; // Import RecipePreview

export default {
  name: "ProfilePage",
  components: {
    RecipePreview, // Register RecipePreview
  },
  setup() {
    const router = useRouter();
    const toast = createToast(); // Initialize toast

    const profileData = ref({
      username: "",
      email: "",
      first_name: "", // Keep as is for now, depends on backend schema
      last_name: "",   // Keep as is for now, depends on backend schema
      country: "",
      profile_pic: "",
      bio: "",
    });
    const isUpdating = ref(false);

    // Fetch profile from backend
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/users/profile");
        const data = response.data;
        profileData.value = {
          ...data,
          first_name: data.first_name || '', // Ensure fields are not undefined
          last_name: data.last_name || '',
          bio: data.bio || '',
        };
        console.log('Profile data fetched:', profileData.value);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast("Error", "Failed to load profile.", "danger");
      }
    };

    // Handle profile update
    const handleUpdate = async () => {
      isUpdating.value = true;
      try {
        await axios.put("/api/users/profile", {
          first_name: profileData.value.first_name,
          last_name: profileData.value.last_name,
          country: profileData.value.country,
          email: profileData.value.email,
          profile_pic: profileData.value.profile_pic,
          bio: profileData.value.bio,
        });
        toast("Success", "Profile updated successfully.", "success");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast("Error", "Failed to update profile.", "danger");
      } finally {
        isUpdating.value = false;
      }
    };

    // Handle logout
    const handleLogout = async () => {
      try {
        await store.logout();
        toast("Success", "Logged out successfully.", "success");
        router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        toast("Error", "Logout failed.", "danger");
      }
    };

    onMounted(async () => {
      await fetchProfile();
      // Fetch favorites and last watched recipes after profile is loaded and user is authenticated
      if (store.isAuthenticated && store.user?.username) {
        console.log('Fetching favorites for ProfilePage...');
        await store.fetchFavorites();
        console.log('Favorites fetched:', store.favorites.length);
        
        console.log('Fetching last watched recipes for ProfilePage...');
        await store.fetchLastWatchedRecipes();
        console.log('Last watched recipes fetched:', store.lastWatchedRecipes.length);
      }
    });

    return {
      profileData,
      isUpdating,
      handleUpdate,
      handleLogout,
      store, // Expose store to the template
    };
  },
};
</script>

<style scoped>
/* Add any specific styles for ProfilePage if needed */
</style>
