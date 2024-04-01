export default function useIndicators() {
  const total = ref(0);

	// Function to get data
  function getTotal() {
    return total.value
  }

  function update(newValue: number) {
    console.log('old value indicators:', total.value)
    total.value = newValue;
    console.log('new value indicators:', total.value)
  }

  return{total, update}
}
