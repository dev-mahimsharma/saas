<script setup>
import { useCounter } from "../composables/useCounter.js";

const { n, inc } = useCounter(0);
</script>

<template>
  <header class="head">
    <h1>Hello from Bootnode</h1>
    <button type="button" class="btn" @click="inc">Clicked {{ n }} times</button>
  </header>
</template>

<style scoped>
.head {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
}
h1 {
  margin: 0 0 1rem;
  font-size: 1.75rem;
}
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #fff;
  cursor: pointer;
}
.btn:hover {
  background: #f1f5f9;
}
</style>
