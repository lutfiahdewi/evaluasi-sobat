<script setup lang="ts">
const props = defineProps({
  dataMain: Object,
});

// props.data.currentStep--;

const data = ref(props.dataMain);

const nextStep = () => {
  if (data.value?.currentStep < data.value?.steps.length && data.value?.currentStep != undefined) {
    data.value.currentStep++;
  }
  console.log("current step: ", data.value?.currentStep);
  return true;
};

const previousStep = () => {
  if (data.value?.currentStep > 0 && data.value?.currentStep != undefined) {
    data.value.currentStep--;
  }
  console.log("current step: ", data.value?.currentStep);
  return true;
};

defineExpose({
  nextStep,
  previousStep,
  data,
});
</script>

<template>
  <div class="steps-container w-full mb-20 mx-auto">
    <ul class="steps-list flex">
      <li class="step relative flex items-center grow max-w-full h-14" v-for="(step, i) in data?.steps" :key="i">
        <div :class="'step-bubble z-10 rounded-full flex items-center justify-center transition-all ' + (i <= data?.currentStep ? ' h-12 w-12 ' + data?.activeColor : ' h-9 w-9 ' + data?.passiveColor)">
          <IconCheck class="h-6 w-6" v-if="i < data?.currentStep" />
        </div>
        <div class="step-label absolute top-16 me-3 " :class="(i > data?.currentStep ? 'opacity-50 ' : '') + (i == data?.currentStep ? ' font-semibold ' : '') + data?.textColor">{{ step }}</div>
        <div :class="'step-line absolute w-full h-1 top-1/2 left-0 translate-y-1/2 ' + data?.passiveColor">
          <div class="line-fill h-1 transition-all" :class="data?.activeColor + (i < data?.currentStep ? ' w-full' : ' w-0')"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.step:last-child {
  max-width: 56px;
}
.step:last-child .step-line {
  display: none;
}
</style>
