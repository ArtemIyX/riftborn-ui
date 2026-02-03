<template>
  <span v-if="displayText">{{ displayText }}</span>
  <g-spinner class="loading-spinner" v-else/>
</template>

<style scoped>
.loading-spinner {
  height: 1rem;
}
</style>

<script setup>
import { ref, onMounted, useSlots } from 'vue';

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

const fetchLocalization = async (key) => {
  // Simulate server fetch with 25ms delay and no response
  return new Promise((resolve) => {
    setTimeout(() => {
      // Fake server response - returns null (no response)
      // In real implementation, this would be:
      // const response = await fetch(`/api/localization?key=${key}`);
      // const data = await response.json();
      // resolve(data.text);

      resolve(null); // Server did not respond with data
    }, 1);
  });
};

onMounted(async () => {
  // Store default text from slot content
  defaultText.value = slots.default?.()?.[0]?.children || '';

  // Start with empty display (hidden)
  displayText.value = '';

  // Fetch localized text from server
  try {
    const localizedText = await fetchLocalization(props.locKey);

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
