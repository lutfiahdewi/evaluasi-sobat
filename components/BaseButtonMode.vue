<template>
  <button :title="title" class="body2 font-medium disabled:opacity-50" :class="defineClass(mode, shape, notActive) + $props.class" :disabled="notActive">
    <slot />
  </button>
</template>

<script setup lang="ts">
type Mode = "normal" | "outlined" | "gray";
type Shape = "square" | "pill";
defineProps<{
  mode: Mode; //default = normal
  shape: Shape; //default = square
  notActive?: boolean;
  title?: string;
}>();

function defineClass(mode: Mode, shape: Shape, notActive?: boolean) {
  let classCombine = "";
  switch (mode.toLowerCase()) {
    case "gray":
      classCombine += "bg-slate-200 text-slate-600 font-semibold hover:bg-slate-100 ";
      break;
    case "outlined":
      classCombine += "text-slate-600 font-semibold border border-slate-600 bg-white hover:bg-slate-100 ";
      break;
    default:
      classCombine += "bg-slate-600 text-white hover:bg-slate-700 ";
      break;
  }
  if (shape.toLowerCase() === "pill") {
    classCombine += " px-4 py-2 rounded-full ";
  } else {
    classCombine += " px-3 py-2 rounded-md ";
  }
  if (notActive) {
    classCombine += " disabled:opacity-50 disabled:pointer-events-none ";
  }
  return classCombine;
}
</script>
