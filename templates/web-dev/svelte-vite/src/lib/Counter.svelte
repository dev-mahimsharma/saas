<script>
  let count = 0;
</script>

<button type="button" on:click={() => (count += 1)}>
  count: {count}
</button>

<style>
  button {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid #cbd5e1;
    background: #fff;
    cursor: pointer;
    font-size: 1rem;
  }
  button:hover {
    background: #f1f5f9;
  }
</style>
