<template>
  <Teleport to="body">
    <div
      class="g-toast-container"
      :class="[`g-toast-container--${position}`]"
      :style="{ zIndex: zIndex }"
    >
      <TransitionGroup
        name="g-toast-list"

        class="g-toast-container__list"

      >
        <GToast
          v-for="toast in visibleToasts"
          :key="toast.id"
          :id="toast.id"
          :title="toast.title"
          :message="toast.message"
          :variant="toast.variant"
          :duration="toast.duration"
          :closable="toast.closable"
          :show-progress="toast.showProgress"
          :action="toast.action"
          @close="onToastClose"
          @action="onToastAction"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import GToast from './GToast.vue'
import { toasts, useToast } from './../useToast.js'

defineOptions({
  name: 'GToastContainer'
})

const props = defineProps({
  position: {
    type: String,
    default: 'top-right',
    validator: (value) => [
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right'
    ].includes(value)
  },
  maxToasts: {
    type: Number,
    default: 5
  },
/*  gapRem: {
    type: Number,
    default: 1
  },*/
  zIndex: {
    type: Number,
    default: 9000
  }
})

const { dismiss } = useToast()

// Computed
const visibleToasts = computed(() => {
  const list = [...toasts.value]

  // Reverse for bottom positions so newest appears at bottom
  if (props.position.startsWith('bottom')) {
    list.reverse()
  }

  // Limit visible toasts
  return list.slice(0, props.maxToasts)
})

// Methods
const onToastClose = (id) => {
  dismiss(id)
}

const onToastAction = (id) => {
  // Action was clicked, optionally dismiss
  // dismiss(id)
}
</script>

<style src="./GToastContainer.css" scoped/>
