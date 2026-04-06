import { ref } from "vue";

export function useCounter(initial = 0) {
  const n = ref(initial);
  const inc = () => {
    n.value += 1;
  };
  return { n, inc };
}
