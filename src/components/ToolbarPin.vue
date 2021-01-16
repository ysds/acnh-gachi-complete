<template>
  <Button sm @click="onClickPin" v-if="isShowPinButton">
    <template v-if="isPinned">
      <IconPinned />
      解除
    </template>
    <template v-else>
      <IconPin />
      ピン留め
    </template>
  </Button>
</template>

<script>
import Button from "./Button";
import IconPin from "./IconPin";
import IconPinned from "./IconPinned";

export default {
  components: {
    Button,
    IconPin,
    IconPinned
  },
  props: {
    pins: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      isPinned: false
    };
  },
  computed: {
    activeNav() {
      return this.$store.getters.activeNav;
    },
    isShowPinButton() {
      if (this.activeNav) {
        const showNavs = ["special", "season"];
        for (let i = 0; i < showNavs.length; i++) {
          if (this.activeNav.indexOf(showNavs[i]) !== -1) return true;
        }
      }
      return false;
    }
  },
  mounted() {
    this.isPinned = this.pins[this.activeNav];
  },
  watch: {
    activeNav: function() {
      this.isPinned = this.pins[this.activeNav];
    }
  },
  methods: {
    onClickPin() {
      this.isPinned = !this.isPinned;
      this.$emit("changePin", this.activeNav, this.isPinned);
    }
  }
};
</script>
