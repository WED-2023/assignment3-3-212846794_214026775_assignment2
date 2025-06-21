<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 p-4">
    <RecipePreview 
      v-for="recipe in recipes" 
      :key="recipe.id || recipe.recipe_id" 
      :recipe="recipe"
      class="recipe-preview"
    />
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview
  },
  props: {
    recipes: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.recipe-preview {
  transition: all 0.3s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
}
</style>
