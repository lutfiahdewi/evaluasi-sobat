<script setup lang="ts">
/***
 *  Only one slot can be customized=> message slot, without name in slot.
 */

import { vOnClickOutside } from "@vueuse/components";
</script>

<template>
  <!-- <button id="show-modal" @click="showModal = true" class="border rounded-xl bg-sky-300 hover:bg-sky-400 px-4 py-3">Show Modal</button> -->

  <Teleport to="body">
    <!-- Modal component-->
    <Transition name="modal">
      <div class="modal-mask">
        <div class="modal-container bg-slate-100 shadow-lg rounded-lg py-6 w-96" v-on-click-outside="() => $emit('close')">
          <!-- Icon section -->
          <IconSuccessGif />
          <!-- Message section -->
          <div class="flex justify-center">
            <slot>
              <h6 class="bg-green-500 rounded-lg px-4 py-2 text-white font-semibold shadow">Berhasil!</h6>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 90;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(126, 126, 126, 0.7);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  margin: auto;
  transition: all 0.3s ease;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
