<template>
  <div :class="flexClasses" :style="flexStyles">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'GFlex',

  props: {
    // Flex direction
    direction: {
      type: String,
      default: 'row',
      validator: (value) => ['row', 'row-reverse', 'column', 'column-reverse'].includes(value)
    },

    // Flex wrap
    wrap: {
      type: String,
      default: 'nowrap',
      validator: (value) => ['nowrap', 'wrap', 'wrap-reverse'].includes(value)
    },

    // Justify content (main axis)
    justify: {
      type: String,
      default: 'flex-start',
      validator: (value) => [
        'flex-start', 'flex-end', 'center', 'space-between',
        'space-around', 'space-evenly'
      ].includes(value)
    },

    // Align items (cross axis)
    align: {
      type: String,
      default: 'stretch',
      validator: (value) => [
        'flex-start', 'flex-end', 'center', 'baseline', 'stretch'
      ].includes(value)
    },

    // Align content (multi-line)
    alignContent: {
      type: String,
      default: 'normal',
      validator: (value) => [
        'normal', 'flex-start', 'flex-end', 'center',
        'space-between', 'space-around', 'space-evenly', 'stretch'
      ].includes(value)
    },

    // Gap between items
    gap: {
      type: [String, Number],
      default: null
    },

    // Row gap (overrides gap for rows)
    rowGap: {
      type: [String, Number],
      default: null
    },

    // Column gap (overrides gap for columns)
    columnGap: {
      type: [String, Number],
      default: null
    },

    // Inline flex instead of block flex
    inline: {
      type: Boolean,
      default: false
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

    // Fill available space
    fill: {
      type: Boolean,
      default: false
    },

    // Custom class
    customClass: {
      type: String,
      default: ''
    }
  },

  computed: {
    flexClasses() {
      return [
        'g-flex',
        this.customClass
      ].filter(Boolean).join(' ');
    },

    flexStyles() {
      const styles = {
        display: this.inline ? 'inline-flex' : 'flex',
        flexDirection: this.direction,
        flexWrap: this.wrap,
        justifyContent: this.justify,
        alignItems: this.align,
        alignContent: this.alignContent !== 'normal' ? this.alignContent : null
      };

      // Handle gaps
      if (this.gap !== null) {
        styles.gap = this.parseSize(this.gap);
      }
      if (this.rowGap !== null) {
        styles.rowGap = this.parseSize(this.rowGap);
      }
      if (this.columnGap !== null) {
        styles.columnGap = this.parseSize(this.columnGap);
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

      // Handle fill
      if (this.fill) {
        styles.flex = '1 1 auto';
        styles.width = '100%';
        styles.height = '100%';
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
.g-flex {
  box-sizing: border-box;
}

.g-flex > * {
  box-sizing: border-box;
}
</style>
