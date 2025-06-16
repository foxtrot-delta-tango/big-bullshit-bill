<template>
  <div class="expandable-section">
    <button class="header" @click="toggle">
      <span class="title">
        <slot name="title">{{ title }}</slot>
      </span>
      <span class="icon" :class="{ 'is-expanded': isExpanded }">▼</span>
    </button>
    <div class="content" :class="{ 'is-expanded': isExpanded }">
      <div class="content-inner">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title?: string;
}>();

const isExpanded = ref(false);

const toggle = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style lang="scss" scoped>
.expandable-section {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  overflow: hidden;

  .header {
    width: 100%;
    padding: var(--spacing-sm);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none;
    cursor: pointer;
    text-align: left;

    .title {
      font-weight: 600;
      color: var(--color-text);
      margin-right: var(--spacing-sm);
    }

    .icon {
      font-size: 0.9rem;
      transition: transform var(--transition-duration) ease, color var(--transition-duration) ease;
      color: var(--color-text-light);
      margin-right: var(--spacing-xs);

      &.is-expanded {
        transform: rotate(180deg);
      }
    }

    &:hover {
      .icon {
        color: var(--color-primary);
      }
    }
  }

  .content {
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--transition-duration) ease-out;

    &.is-expanded {
      max-height: 2000px;
      transition: max-height 0.5s ease-in;
    }

    .content-inner {
      padding: var(--spacing-sm);
      background-color: var(--color-bg);
      color: var(--color-text);
      text-align: left;
    }
  }
}
</style> 