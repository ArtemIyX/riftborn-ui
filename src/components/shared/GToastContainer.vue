<template>
  <Teleport to="body">
    <div
      class="g-toast-container"
      :class="[`g-toast-container--${position}`]"
      :style="{ zIndex: zIndex }"
    >
      <TransitionGroup
        name="g-toast-list"
        tag="div"
        class="g-toast-container__list"
        :style="{ gap: `${gap}px` }"
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
import { toasts, useToast } from './useToast.js'

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
  gap: {
    type: Number,
    default: 12
  },
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

<style scoped>
/* ============================================
   G-TOAST-CONTAINER
   Space Horror UI Component
   ============================================ */

.g-toast-container {
  position: fixed;
  padding: 20px;
  pointer-events: none;
}

.g-toast-container__list {
  display: flex;
  flex-direction: column;
}

.g-toast-container__list > * {
  pointer-events: auto;
}

/* --------------------------------------------
   POSITIONS
   -------------------------------------------- */

/* Top positions */
.g-toast-container--top-left {
  top: 0;
  left: 0;
}

.g-toast-container--top-center {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.g-toast-container--top-right {
  top: 0;
  right: 0;
}

/* Bottom positions */
.g-toast-container--bottom-left {
  bottom: 0;
  left: 0;
}

.g-toast-container--bottom-center {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.g-toast-container--bottom-right {
  bottom: 0;
  right: 0;
}

/* Flex direction for bottom positions */
.g-toast-container--bottom-left .g-toast-container__list,
.g-toast-container--bottom-center .g-toast-container__list,
.g-toast-container--bottom-right .g-toast-container__list {
  flex-direction: column-reverse;
}

/* --------------------------------------------
   LIST TRANSITIONS
   -------------------------------------------- */

.g-toast-list-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.g-toast-list-leave-active {
  transition: all 0.2s ease-in;
  position: absolute;
}

.g-toast-list-move {
  transition: transform 0.3s ease;
}

/* Enter from right for right-aligned positions */
.g-toast-container--top-right .g-toast-list-enter-from,
.g-toast-container--bottom-right .g-toast-list-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.g-toast-container--top-right .g-toast-list-leave-to,
.g-toast-container--bottom-right .g-toast-list-leave-to {
  opacity: 0;
  transform: translateX(50%);
}

/* Enter from left for left-aligned positions */
.g-toast-container--top-left .g-toast-list-enter-from,
.g-toast-container--bottom-left .g-toast-list-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.g-toast-container--top-left .g-toast-list-leave-to,
.g-toast-container--bottom-left .g-toast-list-leave-to {
  opacity: 0;
  transform: translateX(-50%);
}

/* Enter from top/bottom for center positions */
.g-toast-container--top-center .g-toast-list-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.g-toast-container--top-center .g-toast-list-leave-to {
  opacity: 0;
  transform: translateY(-50%);
}

.g-toast-container--bottom-center .g-toast-list-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.g-toast-container--bottom-center .g-toast-list-leave-to {
  opacity: 0;
  transform: translateY(50%);
}

/* --------------------------------------------
   RESPONSIVE
   -------------------------------------------- */

@media (max-width: 400px) {
  .g-toast-container {
    padding: 12px;
    left: 0;
    right: 0;
  }

  .g-toast-container--top-center,
  .g-toast-container--bottom-center {
    transform: none;
  }

  .g-toast-container__list {
    align-items: stretch;
  }

  .g-toast-container :deep(.g-toast) {
    width: 100%;
  }
}
</style>
