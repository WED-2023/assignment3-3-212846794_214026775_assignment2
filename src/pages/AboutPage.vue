<template>
  <div class="min-h-screen bg-[#f8fcfa] py-12">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-[#0c1c17] mb-4">About Our Project</h1>
        <p class="text-xl text-gray-600">
          A culinary journey through modern web development
        </p>
      </div>

      <!-- Project Overview -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-[#0c1c17] mb-4">Project Overview</h2>
        <p class="text-gray-700 mb-4">
          Welcome to our Recipe Management System, a comprehensive platform that brings together food enthusiasts, 
          home cooks, and professional chefs. Our application combines modern web technologies with a passion for 
          culinary arts to create an engaging and user-friendly experience.
        </p>
        <p class="text-gray-700">
          Built using Vue.js, Node.js, and MySQL, our platform offers features like recipe discovery, 
          personal recipe management, and social interaction through favorites and sharing capabilities.
        </p>
      </div>

      <!-- Development Journey -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-[#0c1c17] mb-4">Precious Development </h2>
        <div class="space-y-6">
          <div class="border-l-4 border-[#46a080] pl-4">
            <h3 class="text-xl font-semibold text-[#0c1c17] mb-2">Assignment 1</h3>
            <p class="text-gray-700 mb-2">
              each one has created a website about someone in the golden age.
            </p>
            <a href="https://github.com/WED-2023/214026775" 
               class="text-[#46a080] hover:text-[#35806a] font-medium">
              View Assignment 1 for fadiz911 →
            </a>
            <p></p>
            <a href="https://github.com/WED-2023/212846794" 
               class="text-[#46a080] hover:text-[#35806a] font-medium">
              View Assignment 1 for Atheel Mzlbat →
            </a>
          </div>

          <div class="border-l-4 border-[#46a080] pl-4">
            <h3 class="text-xl font-semibold text-[#0c1c17] mb-2">Assignment 2</h3>
            <p class="text-gray-700 mb-2">
              In our second phase, we delved into server-side programming with JavaScript, html and css,
              implementing Space shooter game.
            </p>
            <a href="https://github.com/WED-2023/214026775_212846794_assignment2" 
               class="text-[#46a080] hover:text-[#35806a] font-medium">
              View Assignment 2 →
            </a>
          </div>

          
        </div>
      </div>

      <!-- Team Section -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-[#0c1c17] mb-6">Our Team</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="text-center">
            <div class="w-32 h-32 mx-auto mb-4 rounded-full bg-[#46a080] flex items-center justify-center">
              <span class="text-4xl text-white">👨‍💻</span>
            </div>
            <h3 class="text-xl font-semibold text-[#0c1c17] mb-2">Fadi zoabi</h3>
            <p class="text-gray-700">
              ID: 214026775
            </p>
            <p class="text-gray-700">
              Github usereName: fadiz911
            </p>
          </div>
          <div class="text-center">
            <div class="w-32 h-32 mx-auto mb-4 rounded-full bg-[#46a080] flex items-center justify-center">
              <span class="text-4xl text-white">👨‍💻</span>
            </div>
            <h3 class="text-xl font-semibold text-[#0c1c17] mb-2">Atheel Mzlbt</h3>
            <p class="text-gray-700">
              ID: 212846794
            </p>
            <p class="text-gray-700">
              Github usereName: AthelMzlbat
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage'
};
</script>

<style scoped>
/* Add any additional styles here */
</style> 