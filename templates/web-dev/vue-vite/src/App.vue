<script setup>
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <div class="layout">
    <HelloWorld />
    <p class="hint">
      Edit <code>src/App.vue</code> and add components under
      <code>src/components/</code>.
    </p>
  </div>
</template>

<style scoped>
.layout {
  padding: 2rem;
  max-width: 40rem;
}
.hint {
  margin-top: 1rem;
  color: #64748b;
  line-height: 1.6;
}
code {
  font-family: ui-monospace, monospace;
  background: #e2e8f0;
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
}
</style>
