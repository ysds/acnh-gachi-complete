<template>
  <Button @click="$emit('click')">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 50 50"
    >
      <path
        fill="#231F20"
        d="M9.016 40.837a1.001 1.001 0 001.415-.001l14.292-14.309 14.292 14.309a1 1 0 001.416-1.413L26.153 25.129 40.43 10.836a1 1 0 10-1.415-1.413L24.722 23.732 10.43 9.423a1 1 0 10-1.415 1.413l14.276 14.293L9.015 39.423a1 1 0 00.001 1.414z"
      />
    </svg>
  </Button>
</template>
<script>
import Button from "./Button";

export default {
  name: "CloseButton",
  components: {
    Button
  }
};
</script>
<style lang="scss" scoped>
svg {
  margin-top: -4px;
}
</style>
