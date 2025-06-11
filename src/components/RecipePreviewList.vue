<template>
  <div class="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
    <RecipePreview 
      v-for="recipe in recipes" 
      :key="recipe.id" 
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
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
}
</style>
