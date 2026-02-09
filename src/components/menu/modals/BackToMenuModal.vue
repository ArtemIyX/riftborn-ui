<template>
  <GModal
    :model-value="modelValue"
    title="CONFIRM EXIT"
    variant="default"

    :persistent="true"
    :close-button="false"
  >
    <template #title>
      <GHeading>
        <GLocText code="#ExitToMenuConfirm" :table="ST_MENU">Are you sure?</GLocText>
      </GHeading>
    </template>
    <!-- Content slot -->
    <template #default>
      <GText size="large">
        <GLocText code="#ExitToMenuInfo" :table="ST_MENU">Are you sure you want to leave the server and go to the main menu?
        </GLocText>
      </GText>
    </template>

    <!-- Actions slot with Yes/No buttons -->
    <template #actions>
      <GButton @click="handleQuitYes" variant="warning">
        <GText>
          <GLocText code="#Yes" :table="ST_MENU">Yes</GLocText>
        </GText>
      </GButton>
      <GButton @click="handleQuitNo">
        <GText>
          <GLocText code="#No" :table="ST_MENU">No</GLocText>
        </GText>
      </GButton>
    </template>
  </GModal>
</template>

<script setup>

import {ST_MENU} from "@/assets/js/localizationConstants.js";


defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'yes', 'no']);
const handleQuitYes = () => {
  emit('yes');
  emit('update:modelValue', false);
};

const handleQuitNo = () => {
  emit('yes');
  emit('update:modelValue', false);
};


</script>
<style scoped>

</style>
