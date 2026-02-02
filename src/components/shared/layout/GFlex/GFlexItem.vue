<template>
  <div :class="flexItemClasses" :style="flexItemStyles">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'GFlexItem',

  props: {
    // Flex grow factor
    grow: {
      type: [Number, String],
      default: null
    },

    // Flex shrink factor
    shrink: {
      type: [Number, String],
      default: null
    },

    // Flex basis
    basis: {
      type: [String, Number],
      default: null
    },

    // Shorthand flex property (e.g., "1", "0 1 auto")
    flex: {
      type: [String, Number],
      default: null
    },

    // Align self (overrides parent's align-items)
    alignSelf: {
      type: String,
      default: null,
      validator: (value) => [
        'auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'
      ].includes(value)
    },

    // Order
    order: {
      type: Number,
      default: null
    },

    // Width
    width: {
      type: String,
      default: null
    },

    // Height
    height: {
      type: String,
      default: null
    },

    // Min width
    minWidth: {
      type: String,
      default: null
    },

    // Min height
    minHeight: {
      type: String,
      default: null
    },

    // Max width
    maxWidth: {
      type: String,
      default: null
    },

    // Max height
    maxHeight: {
      type: String,
      default: null
    },

    // Padding
    padding: {
      type: [String, Number],
      default: null
    },

    // Margin
    margin: {
      type: [String, Number],
      default: null
    },

    // Custom class
    customClass: {
      type: String,
      default: ''
    }
  },

  computed: {
    flexItemClasses() {
      return [
        'g-flex-item',
        this.customClass
      ].filter(Boolean).join(' ');
    },

    flexItemStyles() {
      const styles = {};

      // Handle flex properties
      if (this.flex !== null) {
        styles.flex = this.flex;
      } else {
        if (this.grow !== null) {
          styles.flexGrow = this.grow;
        }
        if (this.shrink !== null) {
          styles.flexShrink = this.shrink;
        }
        if (this.basis !== null) {
          styles.flexBasis = this.parseSize(this.basis);
        }
      }

      if (this.alignSelf) {
        styles.alignSelf = this.alignSelf;
      }

      if (this.order !== null) {
        styles.order = this.order;
      }

      // Handle dimensions
      if (this.width) {
        styles.width = this.parseSize(this.width);
      }
      if (this.height) {
        styles.height = this.parseSize(this.height);
      }
      if (this.minWidth) {
        styles.minWidth = this.parseSize(this.minWidth);
      }
      if (this.minHeight) {
        styles.minHeight = this.parseSize(this.minHeight);
      }
      if (this.maxWidth) {
        styles.maxWidth = this.parseSize(this.maxWidth);
      }
      if (this.maxHeight) {
        styles.maxHeight = this.parseSize(this.maxHeight);
      }

      // Handle spacing
      if (this.padding !== null) {
        styles.padding = this.parseSize(this.padding);
      }
      if (this.margin !== null) {
        styles.margin = this.parseSize(this.margin);
      }

      return styles;
    }
  },

  methods: {
    parseSize(value) {
      if (typeof value === 'number') {
        return `${value}rem`;
      }
      return value;
    }
  }
};
</script>

<style scoped>
.g-flex-item {
  box-sizing: border-box;
}
</style>
