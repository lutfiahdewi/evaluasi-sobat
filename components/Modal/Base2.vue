<script setup lang="ts">
/***
 * Basically the same as base but doesnt expose anything
 * and inside component can't open/close modal for simplicity
 * 
 * Use this component to make basic modal or other modal.
 * You can define your own width and max-height modal using props.
 * Slot for each section also available to customized.
 */
defineProps<{
  width?: string;
  maxHeight?: string;
}>();
const emit = defineEmits<{
  (e: 'close'): void
}>()
import { vOnClickOutside } from "@vueuse/components";
</script>

<template>
  <Teleport to="body">
    <!-- Modal component-->
    <Transition name="modal">
      <div class="modal-mask">
        <div :class="'modal-container bg-slate-300 border rounded-lg ' + ($props.width || 'w-[600px]')" v-on-click-outside="() => $emit('close')">
          <!-- Header section -->
          <div class="modal-header border-b px-5 py-3">
            <div class="flex justify-between">
              <slot name="header">
                <h6 class="font-bold text-gray-800">Default Header</h6>
              </slot>
              <IconClose class="w-6 h-6 pointer-events-auto" @click="$emit('close')" />
            </div>
          </div>
          <!-- Body section -->
          <div :class="'modal-body px-5 py-6 overflow-y-auto ' + ($props.maxHeight || 'max-h-64')">
            <slot name="body">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </slot>
          </div>
          <!-- Footer section -->
          <div class="modal-footer px-5 py-3 border-t">
            <slot name="footer">
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
  z-index: 81;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
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
