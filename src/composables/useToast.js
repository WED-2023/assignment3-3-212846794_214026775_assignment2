import { ref } from 'vue';

// Create a singleton instance for the toast state
const toasts = ref([]);
let toastId = 0;

// Toast functions
const addToast = (title, message, type = 'info') => {
  const id = ++toastId;
  toasts.value.push({ id, title, message, type });
  setTimeout(() => removeToast(id), 5000); // Auto remove after 5 seconds
};

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
};

export function useToast() {
  return {
    addToast,
    removeToast,
    toasts
  };
} 