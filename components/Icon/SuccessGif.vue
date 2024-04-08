<template>
  <div class="wrapper">
    <svg class="checkmark success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle class="checkmark_circle_success" cx="26" cy="26" r="25" fill="none" />
      <path class="checkmark_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" stroke-linecap="round" />
    </svg>
  </div>
</template>

<style scoped>
body {
  display: flex;
}
.wrapper {
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
}
.checkmark_circle_success {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 5px;
  stroke-miterlimit: 10;
  stroke: #00c851;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}
.checkmark_circle_error {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 5px;
  stroke-miterlimit: 10;
  stroke: #f44;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}
.checkmark {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: block;
  stroke-width: 5px;
  stroke: white;
  stroke-miterlimit: 10;
  margin: 10% auto;
}
.checkmark.success {
  box-shadow: inset 0px 0px 0px #00c851;
  animation: fillsuccess 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
}
.checkmark.error {
  box-shadow: inset 0px 0px 0px #f44;
  animation: fillerror 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
}
.checkmark_check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.9s forwards;
}
.progress {
  transform: rotate(-90deg);
  stroke: black;
}
.progress circle {
  stroke-dasharray: 130;
  stroke-dashoffset: 130;
  animation: dash 1.5s infinite;
}
@keyframes dash {
  50% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -130;
  }
}
.progress {
  position: absolute;
  top: 5%;
  left: 5%;
}
.progress.progress--thin {
  left: auto;
  right: 5%;
}
@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes scale {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}
@keyframes fillsuccess {
  100% {
    box-shadow: inset 0px 0px 0px 75px #00c851;
  }
}
@keyframes fillerror {
  100% {
    box-shadow: inset 0px 0px 0px 75px #f44;
  }
}
</style>
