<script lang="ts" setup>
import { computed } from "vue"

interface BaseButtonProps {
  variant?: "primary" | "primary-light" | "primary-link"
  defaultClass?: string
}

const {
  variant = "primary",
  defaultClass = "rounded py-1 px-2 font-weight-medium"
} = defineProps<BaseButtonProps>()

const classObject = computed(() => ([defaultClass, {
  primary: variant === "primary",
  "primary-light": variant === "primary-light",
  "primary-link": variant === "primary-link"
}]))

</script>

<template>
  <button :class="classObject">
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

.primary-light {
  background-color: var(--color-primary-lighter);
  color: var(--color-primary-darker);

  &:hover {
    background-color: var(--color-primary);
    color: var(--color-primary-text);
  }

  &:active {
    background-color: var(--color-primary-darker);
  }

  &:disabled {
    background-color: transparent;
    color: var(--color-text-light);
  }
}

.primary-link {
  color: var(--color-primary-darker);

  &:hover {
    color: var(--color-primary-darker);
  }

  &:active {
    text-decoration: underline;
    color: var(--color-primary-darker);
  }

  &:disabled {
    color: var(--color-text-light);
  }
}
</style>
