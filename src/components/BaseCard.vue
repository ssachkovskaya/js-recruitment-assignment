<template>
  <div class="card pa-3 rounded">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--color-background-soft);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
</style>
