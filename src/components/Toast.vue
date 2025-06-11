<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        <div class="toast-content">
          <h4 class="toast-title">{{ toast.title }}</h4>
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button class="toast-close" @click="removeToast(toast.id)">×</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useToast } from '@/composables/useToast';

export default defineComponent({
  name: 'ToastNotification',
  setup() {
    const { toasts, removeToast } = useToast();
    return {
      toasts,
      removeToast
    };
  }
});
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  min-width: 300px;
  padding: 1rem;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.toast.success {
  border-left: 4px solid #46a080;
}

.toast.error {
  border-left: 4px solid #ef4444;
}

.toast.info {
  border-left: 4px solid #3b82f6;
}

.toast.warning {
  border-left: 4px solid #f59e0b;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1f2937;
}

.toast-message {
  color: #4b5563;
  font-size: 0.875rem;
}

.toast-close {
  color: #9ca3af;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0.25rem;
  cursor: pointer;
  transition: color 0.2s;
}

.toast-close:hover {
  color: #4b5563;
}

/* Transition animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 