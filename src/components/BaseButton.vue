<script lang="ts" setup>
import { ref } from "vue";

const { variant = "primary" } = defineProps<{
  variant: "primary"
}>()

const classObject = ref({
  primary: variant === "primary"
})

</script>

<template>
  <button :class="classObject" class="rounded py-1 px-2">
    <slot></slot>
  </button>
</template>

<style scoped>
.primary {
  background-color: var(--color-primary);
  color: var(--color-primary-text);

  &:hover {
    opacity: 0.9;
  }

  &:active {
    background-color: var(--color-primary-darker);
  }

  &:disabled {
    opacity: 0.7;
  }
}
</style>
