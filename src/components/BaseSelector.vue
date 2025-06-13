<template>
  <div class="base-selector">
    <label :for="label">{{ label }}</label>
    <select 
      :id="label" 
      :value
      @change="handleChange"
      class="select-dropdown"
      :disabled="disabled"
      :placeholder="placeholder"
    >
      <option 
        v-for="option in options" 
        :key="option" 
        :value="option"
      >
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  options: string[];
  value: string;
  disabled?: boolean;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update', value: string): void;
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update', target.value);
}
</script>

<style lang="scss" scoped>
.base-selector {
  margin-top: var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.select-dropdown {
  padding: var(--spacing-xs);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: var(--color-bg);
  min-width: 70px;
  width: fit-content;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

label {
  font-weight: bold;
  white-space: nowrap;
}
</style> 