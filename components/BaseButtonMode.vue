<template>
  <button :class="defineClass(mode, shape)+$props.class" class="body2 font-medium" >
    <slot />
  </button>
</template>

<script setup lang="ts">
type Mode = "normal" | "outlined" | "gray";
type Shape = "square" | "pill";
defineProps<{
  mode: Mode; //default = normal
  shape: Shape; //default = square
}>();

function defineClass(mode: Mode, shape: Shape) {
  let classCombine = "";
  switch (mode.toLowerCase()) {
    case "gray":
      classCombine += "bg-slate-200 text-slate-600 hover:bg-slate-300 ";
      break;
    case "outlined":
      classCombine += "text-slate-600 border border-slate-600 bg-white hover:bg-slate-100 ";
      break;
    default:
      classCombine += "bg-slate-600 text-white hover:bg-slate-700 ";
      break;
  }
  if (shape.toLowerCase() === "pill") {
    classCombine += "px-4 py-2 rounded-full ";
  } else {
    classCombine += "px-3 py-2 rounded-md ";
  }
  return classCombine;
}
</script>
