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
import { ref, onMounted, useSlots } from 'vue';
import {fetchLocalization} from "@/assets/js/localization.js";

const props = defineProps({
  key: {
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
const fetchedText = ref(null);
const defaultText = ref('');


onMounted(async () => {
  // Store default text from slot content
  defaultText.value = slots.default?.()?.[0]?.children || '';

  // Start with empty display (hidden)
  displayText.value = '';

  // Fetch localized text from server
  try {
    const localizedText = await fetchLocalization(props.key, props.table);

    if (localizedText) {
      fetchedText.value = localizedText;
      displayText.value = localizedText;
    } else {
      // Server returned nothing, use default
      displayText.value = defaultText.value;
    }
  } catch (error) {
    // Error occurred, use default
    console.error('Failed to fetch localization:', error);
    displayText.value = defaultText.value;
  }
});
</script>
