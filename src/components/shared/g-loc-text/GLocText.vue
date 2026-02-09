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
import {useLocalizationStore} from "@/stores/useLocalizationStore.js";

const locStore = useLocalizationStore();

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


const getDefaultText = () => {
  return slots.default?.()?.[0]?.children || '';
};

const fetchLocalizedText = async () => {
  const defaultText = getDefaultText();

  try {
    //console.log(`GLocText request: ${props.code} (${props.table})`);

    // Store automatically handles caching and fallback
    displayText.value = await locStore.getText(props.code, props.table, defaultText);

  } catch (error) {
    console.error(`GLocText error (${props.code}, ${props.table}):`, error);
    displayText.value = defaultText;
  }
};

onMounted(async () => {
  await fetchLocalizedText();
});
</script>
