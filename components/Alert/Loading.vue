<script setup lang="ts">
/**
 * attr ref on component
 * Ref declaration using TS:
 * const alert = ref<InstanceType<typeof AlertLoading> | null>(null);
 */

const show = ref(false);
async function autoClose(sec?: number) {
  const done = await useWaitS(sec ?? 15);
  if (done) {
    show.value = false;
  }
}
function call(sec?: number) {
  if (show.value) return;
  show.value = true;
  if (sec) autoClose(sec);
}
function close() {
  show.value = false;
}
defineExpose({
  call,
  close,
});
</script>
<template>
  <Teleport to="body">
    <div class="alert-container fixed top-24 right-16">
      <transition appear name="slide-fade">
        <div v-if="show" class="float-right">
          <div class="bg-stone-50 border-s-4 border-stone-500 p-4 rounded-e-lg" role="alert">
            <button class="p-3 absolute top-0 right-0" @click="show = false"><IconClose class="h-5 w-5 text-slate-600" /></button>
            <div class="flex me-6">
              <div class="flex-shrink-0">
                <!-- Icon -->
                <IconLoading class="h-9 w-9 my-2 text-stone-700" />
                <!-- End Icon -->
              </div>
              <div class="ms-3 self-center">
                <slot name="content">
                  <h6 class="text-gray-800 font-medium">Loading</h6>
                  <p class="text-sm text-gray-700">Your request is in progress...</p>
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
