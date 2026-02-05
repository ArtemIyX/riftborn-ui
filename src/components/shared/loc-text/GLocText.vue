<template>
  <span v-if="displayText">{{ displayText }}</span>
  <g-spinner variant="bars" class="loading-spinner" v-else/>
</template>

<style scoped>
.loading-spinner {
  height: 1rem;
}
</style>

<script setup>
import {ref, onMounted, useSlots} from 'vue';
import {getLocText} from "@/assets/js/localization.js";

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  table: {
    type: String,
    required: true
  }
});

const slots = useSlots();

const displayText = ref('');
const defaultText = ref('');

const getDefaultText = () => {
  return slots.default?.()?.[0]?.children || '';
};

const fetchLocalizedText = async () => {
  const defaultText = getDefaultText();

  try {
    console.log(`GLocText request: ${props.code} (${props.table})`);

    const result = await getLocText(props.code, props.table, defaultText);

    // Use localized text if found, otherwise use default
    displayText.value = result.success ? result.result : defaultText;

    if (!result.success) {
      //console.log(`Using default text for ${props.code}`);
    }
  } catch (error) {
    console.error(`GLocText error (${props.code}, ${props.table}):`, error);
    displayText.value = defaultText;
  }
};

onMounted(async () => {
  await fetchLocalizedText();
});
</script>
