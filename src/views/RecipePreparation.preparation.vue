<li v-for="(ingredient, index) in ingredients" :key="index" 
    class="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded">
  <div class="flex-shrink-0">
    <input 
      type="checkbox" 
      :checked="currentIngredientStep > index"
      @change="updateIngredientStep(index)"
      :disabled="currentIngredientStep > index"
      class="w-5 h-5 rounded border-gray-300 focus:ring-green-500 text-green-600"
    >
  </div>
  <div class="flex items-center space-x-2">
    <span class="font-medium">{{ ingredient.name }}</span>
  </div>
</li> 