<script setup lang="ts">
/**
 * attr ref on component
 * Ref declaration using TS:
 * const alert = ref<InstanceType<typeof AlertError> | null>(null);
 */

const show = ref(false);
async function autoClose(sec?: number) {
  const done = await useWaitS(sec ?? 15);
  if (done) {
    show.value = false;
  }
}
function toggle(sec?: number) {
  if (show.value) return;
  show.value = true;
  autoClose(sec);
}
defineExpose({
  toggle,
});
</script>
<template>
  <Teleport to="body">
    <div class="alert-container fixed top-24 right-16">
      <transition appear name="slide-fade">
        <div v-if="show" class="float-right">
          <div class="bg-red-50 border-s-4 border-red-500 p-4 rounded-e-lg" role="alert">
            <button class="p-3 absolute top-0 right-0" @click="show = false"><IconClose class="h-5 w-5 text-slate-600" /></button>
            <div class="flex me-6">
              <div class="flex-shrink-0">
                <!-- Icon -->
                <span class="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 ">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </span>
                <!-- End Icon -->
              </div>
              <div class="ms-3 self-center">
                <slot name="content">
                  <h6 class="text-gray-800 font-semibold">Error!</h6>
                  <p class="text-sm text-gray-700">Your transaction didn't succeed!</p>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </Teleport>
</template>
<style scoped>
.alert-container {
  z-index: 81;
}
.slide-fade-enter-from {
  transform: translate(100px);
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.5s ease 0.5s;
}
.slide-fade-enter-to {
  transform: translate(0px);
  opacity: 1;
}

.slide-fade-leave-active {
  transition: all 1s ease 0.5s;
}
.slide-fade-leave-to {
  transform: translate(100px);
  opacity: 0;
}
</style>
