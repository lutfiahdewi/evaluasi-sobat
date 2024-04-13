<script setup lang="ts">
/***
 * Use this component to make basic modal or other modal.
 * You can define your own width and max-height modal using props.
 * Slot for each section also available to customized.
 * REMEMBER: Put ref inside component and make sure that the component is defined before the ref used.
 * For example: make modal component then make the button implement open method from ref.
 * Ref declaration using TS:
 * const modal = ref<InstanceType<typeof ModalBase> | null>(null);
 */
const props = defineProps<{
  show?: boolean;
  color?: string;
  width?: string; //default: 600px
  maxHeight?: string; //default:256px
}>();
defineEmits<{
  (e: "close"): void;
}>();
import { vOnClickOutside } from "@vueuse/components";
const showModal = ref(false);
props.show ? showModal.value = props.show : "";
const open = () => {
  showModal.value = true;
};
const close = () => {
  showModal.value = false;
};
defineExpose({
  open,
  close,
});
</script>

<template>
  <!-- <button id="show-modal" @click="showModal = true" class="border rounded-xl bg-sky-300 hover:bg-sky-400 px-4 py-3">Show Modal</button> -->

  <Teleport to="body">
    <!-- Modal component-->
    <Transition name="modal">
      <div v-if="showModal" class="modal-mask">
        <div :class="'modal-container rounded-lg '+ ($props.width || ' w-[600px] ') + ' border ' + ($props.color || ' bg-slate-300 ')" v-on-click-outside="close">
          <!-- Header section -->
          <div class="modal-header border-b px-5 py-3">
            <div class="flex justify-between">
              <slot name="header">
                <h6 class="font-bold text-gray-800">Default Header</h6>
              </slot>
              <IconClose class="w-6 h-6 pointer-events-auto" @click="close()" />
            </div>
          </div>
          <!-- Body section -->
          <div :class="'modal-body px-5 py-6 overflow-y-auto ' + ($props.maxHeight || 'max-h-64')">
            <slot name="body">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus obcaecati ex numquam incidunt labore iusto nam blanditiis et fuga ducimus natus dolorum porro commodi nostrum impedit nisi a dolores eius sint inventore,
              recusandae, consectetur tenetur? Laudantium nisi dolore a aspernatur tempora. Animi optio numquam cumque iure illum culpa ab mollitia expedita laborum iusto reiciendis omnis, accusamus, natus, quidem eligendi quae fuga ex.
              Modi velit, neque quos ea labore expedita quidem illum quam quo officiis minima excepturi ipsa magni non adipisci ad accusantium ex dolor fugit ipsum laudantium explicabo qui. Quam repudiandae deserunt laudantium architecto
              cumque, numquam enim sed exercitationem doloremque quos harum sit voluptate molestias quaerat temporibus error obcaecati voluptatum debitis accusantium quis iusto. Quos dignissimos, illum beatae ipsum eos aperiam dolor facere
              voluptates alias molestias molestiae perspiciatis libero itaque sapiente minima est, veniam quod dolorum. Ratione magnam excepturi repellendus, quae molestiae magni necessitatibus dolore doloremque. Inventore id quod at dicta
              assumenda praesentium repudiandae iure pariatur necessitatibus minus deserunt natus fugiat sit, provident adipisci ipsam eius commodi? Deleniti tenetur eius saepe laborum libero ducimus alias, iste voluptatum dolorem quod est
              aut assumenda fugiat quisquam, maxime adipisci expedita quaerat. Perspiciatis libero omnis, optio, sint minus soluta dolore eligendi quod est harum debitis voluptates impedit architecto? Et, non libero? Pariatur ipsam, odio
              vel voluptatibus quod fugiat reprehenderit nesciunt cumque animi, sit magni veniam itaque, suscipit consequatur quia sapiente. Dolore voluptatem nemo eveniet odit a aliquam, sed et optio ipsam sapiente quod quas, aut eaque
              excepturi accusantium. Non voluptas velit voluptatibus tempora, perferendis eaque doloribus vero distinctio quidem iusto repellendus dolorum aspernatur praesentium maxime eius, molestias quibusdam necessitatibus sed deleniti
              placeat labore? Ut magni cum aspernatur autem alias corrupti dolor ratione enim incidunt iusto nobis ab eveniet maiores, officiis doloremque iste aperiam laborum tempore nulla repellat vitae explicabo! Iste quisquam enim
              voluptates ad! Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus obcaecati ex numquam incidunt labore iusto nam blanditiis et fuga ducimus natus dolorum porro commodi nostrum impedit nisi a dolores eius sint
              inventore, recusandae, consectetur tenetur? Laudantium nisi dolore a aspernatur tempora. Animi optio numquam cumque iure illum culpa ab mollitia expedita laborum iusto reiciendis omnis, accusamus, natus, quidem eligendi quae
              fuga ex. Modi velit, neque quos ea labore expedita quidem illum quam quo officiis minima excepturi ipsa magni non adipisci ad accusantium ex dolor fugit ipsum laudantium explicabo qui. Quam repudiandae deserunt laudantium
              architecto cumque, numquam enim sed exercitationem doloremque quos harum sit voluptate molestias quaerat temporibus error obcaecati voluptatum debitis accusantium quis iusto. Quos dignissimos, illum beatae ipsum eos
            </slot>
          </div>
          <!-- Footer section -->
          <div class="modal-footer px-5 py-3 border-t">
            <slot name="footer">
              <div class="flex justify-end items-center gap-x-3">
                <BaseButtonMode mode="outlined" shape="square" @click="close()">Close</BaseButtonMode>
                <slot name="footer-button"></slot>
              </div>
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
