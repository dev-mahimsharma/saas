<script>
  import Counter from "./lib/Counter.svelte";
</script>

<main>
  <h1>Hello from Bootnode</h1>
  <p class="sub">Svelte + Vite — edit <code>src/App.svelte</code>.</p>
  <Counter />
</main>

<style>
  main {
    padding: 2rem;
    font-family: system-ui, sans-serif;
    max-width: 40rem;
  }
  h1 {
    margin: 0 0 0.5rem;
  }
  .sub {
    color: #64748b;
    margin-bottom: 1.5rem;
  }
  code {
    background: #e2e8f0;
    padding: 0.1rem 0.35rem;
    border-radius: 0.25rem;
  }
</style>
