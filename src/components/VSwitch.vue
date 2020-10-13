<template>
  <div class="switch">
    <input
      class="switch"
      type="checkbox"
      :id="id"
      :value="value"
      v-model="proxyChecked"
    />
    <label :for="id">
      <slot></slot>
    </label>
  </div>
</template>
<script>
export default {
  model: {
    prop: "checked",
    event: "change"
  },
  props: {
    checked: {
      type: [Array, Boolean],
      default: false
    },
    value: {
      default: null
    },
    id: {
      type: String,
      default: ""
    }
  },
  computed: {
    proxyChecked: {
      get() {
        return this.checked;
      },
      set(val) {
        this.$emit("change", val);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.switch {
  display: flex;
  padding: 0.5rem 0;
}

input[type="checkbox"],
input[type="radio"] {
  --active: #007bff;
  --active-inner: #fff;
  --focus: 2px rgba(39, 94, 254, 0.3);
  --border: #bbc0d1;
  --border-hover: #007bff;
  --background: #fff;
  -webkit-appearance: none;
  -moz-appearance: none;
  flex-shrink: 0;
  order: 1;
  box-sizing: border-box;
  height: 26px;
  outline: none;
  display: inline-block;
  vertical-align: top;
  position: relative;
  margin: 0;
  cursor: pointer;
  border: 1px solid var(--bc, var(--border));
  background: var(--b, var(--background));
  transition: background 0.3s, border-color 0.3s, box-shadow 0.2s;
  &:after {
    box-sizing: border-box;
    content: "";
    display: block;
    left: 0;
    top: 0;
    position: absolute;
    transition: transform var(--d-t, 0.3s) var(--d-t-e, ease),
      opacity var(--d-o, 0.2s);
  }
  &:checked {
    --b: var(--active);
    --bc: var(--active);
    --d-o: 0.3s;
    --d-t: 0.6s;
    --d-t-e: cubic-bezier(0.2, 0.85, 0.32, 1.2);
  }
  &:hover {
    &:not(:checked) {
      --bc: var(--border-hover);
    }
  }
  &:focus {
    box-shadow: 0 0 0 var(--focus);
  }
  &:not(.switch) {
    width: 26px;
    &:after {
      opacity: var(--o, 0);
    }
    &:checked {
      --o: 1;
    }
  }
}
input[type="checkbox"] {
  &.switch {
    width: 46px;
    border-radius: 99px;
    &:after {
      left: 2px;
      top: 2px;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      background: var(--ab, var(--border));
      transform: translateX(var(--x, 0));
    }
    &:checked {
      --ab: var(--active-inner);
      --x: 20px;

      ~ label {
        font-weight: bold;
        color: #007bff;
      }
    }
  }
}

label {
  flex-grow: 1;
  font-size: 15px;
  line-height: 26px;
  display: inline-block;
  vertical-align: top;
  cursor: pointer;
  margin-left: 4px;
  margin-bottom: 0;
}
</style>
