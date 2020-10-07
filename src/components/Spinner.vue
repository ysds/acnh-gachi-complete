<template functional>
  <div class="dot-flashing"></div>
</template>
<style lang="scss" scoped>
$dot-width: 10px !default;
$dot-height: 10px !default;
$dot-radius: $dot-width/2 !default;

$dot-color: #48c271 !default;
$dot-bg-color: $dot-color !default;
$dot-before-color: $dot-color !default;
$dot-after-color: $dot-color !default;

$dot-spacing: $dot-width + $dot-width/2 !default;

@mixin dot(
  $width: $dot-width,
  $height: $dot-height,
  $radius: $dot-radius,
  $bg-color: $dot-bg-color,
  $color: $dot-color
) {
  width: $width;
  height: $height;
  border-radius: $radius;
  background-color: $bg-color;
  color: $color;
}

.dot-flashing {
  position: relative;

  @include dot;

  animation: dot-flashing 1s infinite linear alternate;
  animation-delay: 0.5s;

  &::before,
  &::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
  }

  &::before {
    left: -$dot-spacing;

    @include dot($bg-color: $dot-before-color);

    animation: dot-flashing 1s infinite alternate;
    animation-delay: 0s;
  }

  &::after {
    left: $dot-spacing;

    @include dot($bg-color: $dot-after-color);

    animation: dot-flashing 1s infinite alternate;
    animation-delay: 1s;
  }
}

@keyframes dot-flashing {
  0% {
    background-color: $dot-color;
  }

  50%,
  100% {
    background-color: lighten($dot-color, 20%);
  }
}
</style>
