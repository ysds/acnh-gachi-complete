<template>
  <component
    :is="tag"
    :type="tag === 'button' ? 'button' : undefined"
    :href="href"
    class="btn"
    :class="{
      active: active,
      'btn-primary': primary,
      'btn-secondary': secondary,
      'btn-cta': cta,
      'btn-block': block,
      'btn-sm': sm,
      'btn-xs': xs,
      'btn-form': form,
      'btn-nav': nav,
      'btn-pill': pill,
      'btn-dropdown': dropdown
    }"
    @click="onClick"
    @touchstart="onTouchStart"
    @mousedown="onTouchStart"
  >
    <slot></slot>
    <template v-if="dropdown">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="9"
        height="9"
        fill="currentColor"
        class="bi bi-caret-down-fill"
        viewBox="0 0 16 16"
      >
        <path
          d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
        />
      </svg>
    </template>
  </component>
</template>

<script>
export default {
  name: "Button",
  props: {
    primary: Boolean,
    secondary: Boolean,
    cta: Boolean,
    block: Boolean,
    active: Boolean,
    sm: Boolean,
    xs: Boolean,
    form: Boolean,
    nav: Boolean,
    pill: Boolean,
    dropdown: Boolean,
    href: String
  },
  computed: {
    tag() {
      return this.href ? "a" : "button";
    }
  },
  methods: {
    onClick: function() {
      this.$emit("click");
    },
    onTouchStart: function(event) {
      const button = event.currentTarget;
      button.classList.add("pressed");
      setTimeout(function() {
        button.classList.remove("pressed");
      }, 300);
    }
  }
};
</script>

<style lang="scss" scoped>
.btn {
  --color: #444;
  --bg-color: transparent;
  --hover-bg-color: #e3e3e3;
  --height: 44px;
  display: inline-block;
  flex-shrink: 0;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  height: var(--height);
  min-width: var(--height);
  text-align: center;
  text-decoration: none;
  line-height: var(--height);
  background-color: var(--bg-color);
  border: 0;
  border-radius: 8px;
  color: var(--color);
  font-weight: 700;
  transition: background-color 0.3s;
  user-select: none;
  white-space: nowrap;

  &.pressed,
  &.active {
    background-color: var(--hover-bg-color);
  }

  &:hover,
  &:active {
    color: var(--color);
    text-decoration: none;
  }

  &:focus {
    outline: 0;
  }

  &:focus-visible {
    background-color: var(--hover-bg-color);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.4;
  }

  > svg {
    margin-top: -4px;
    pointer-events: none;
  }
}

.btn-primary {
  --color: #007bff;
  --hover-bg-color: #bddcfd;
  font-weight: 700;
}

.btn-secondary {
  --color: #007bff;
  --hover-bg-color: #bddcfd;
  font-weight: 400;
}

.btn-cta {
  --color: #007bff;
  --bg-color: #ebf3fc;
  --hover-bg-color: #bddcfd;
  --height: 50px;
  width: 100%;
  max-width: 400px;
  margin-top: 1rem;
  padding: 0 1rem;
  border-radius: 1rem;
}

.btn-block {
  --bg-color: #f3f3f3;
  --height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin-top: 1rem;
  padding: 0 1rem;
  border-radius: 1rem;
}

.btn-sm {
  --height: 34px;
  --bg-color: #f6f6f6;
  font-size: 13px;
  margin-right: 2px;
  margin-left: 2px;
}

.btn-xs {
  --height: 26px;
  --bg-color: #f6f6f6;
  font-size: 13px;
  margin-right: 2px;
  margin-left: 2px;
  padding-right: 0.4rem;
  padding-left: 0.4rem;
}

.btn-form {
  --color: #007bff;
  --height: 38px;
  font-size: 14px;
  border: 1px solid #ccc;
  min-width: 90px;
}

.btn-nav {
  padding-right: 0;
  padding-left: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  font-size: 13px;
  font-weight: 400;

  &.pressed {
    background-color: transparent;
  }

  &.active {
    font-weight: 700;
    border-bottom: 4px solid #42b983;
    background-color: transparent;
  }
}

.btn-pill {
  --height: 36px;
  border: 1px solid #ccc;
  border-radius: 999px;
  font-size: 13px;
  width: 90px;

  &.active {
    font-weight: 700;
    background-color: #42b983;
    border-color: transparent;
    color: #fff;
  }
}

.bi-chevron-down {
  margin-left: -1px;
}
</style>
