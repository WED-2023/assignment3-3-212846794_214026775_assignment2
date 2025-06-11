<template>
  <div class="flex justify-center items-center min-h-screen bg-[#f9fafb]">
    <div class="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-3xl font-bold text-[#46a080] mb-6 text-center">Welcome Back</h2>
      <form @submit.prevent="submitLogin" class="space-y-6">
        <div>
          <label class="block text-base font-medium text-gray-700 mb-2">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter your username"
            class="w-full px-4 py-3 text-base border border-gray-300 rounded focus:ring-[#46a080] focus:border-[#46a080] focus:outline-none"
            required
          />
        </div>

        <div>
          <label class="block text-base font-medium text-gray-700 mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-3 text-base border border-gray-300 rounded focus:ring-[#46a080] focus:border-[#46a080] focus:outline-none"
            required
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>

        <button
          type="submit"
          class="w-full bg-[#46a080] text-lg font-semibold text-white py-3 rounded-md hover:bg-[#3d8f71] transition"
        >
          Login
        </button>

        <div class="text-base text-center text-gray-500 mt-4">
          Don’t have an account?
          <router-link to="/register" class="text-[#46a080] hover:underline ml-1">Sign up</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  computed: {
    store() {
      return this.$root.$.appContext.config.globalProperties.store;
    }
  },
  methods: {
    async submitLogin() {
      this.error = '';
      try {
        await this.store.login({ username: this.username, password: this.password });
        this.$router.push('/');
      } catch (err) {
        this.error = err?.response?.data?.message || 'Login failed. Please try again.';
      }
    }
  }
};
</script>
