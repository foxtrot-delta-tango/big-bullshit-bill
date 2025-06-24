<template>
  <div class="expandable-section">
    <button class="header" @click="toggle">
      <div class="info">
        <span class="title">
          <slot name="title">{{ title }}</slot>
        </span>
        <!-- <p class="summary" @click.stop='showFullSummary = !showFullSummary' role='button' -->
        <p class="summary">
          <slot name="summary" />
          <!-- <span>
            Show {{ showFullSummary ? 'Less' : 'More' }}
          </span> -->
        </p>
      </div>
      <span class="icon" :class="{ 'is-expanded': isExpanded }">▼</span>
    </button>
    <div class="content" :class="{ 'is-expanded': isExpanded }">
      <div class="content-inner">
        <slot />
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
    cursor: pointer;
    text-align: left;
    outline: none;
    border-color: transparent;

    .info {
      display: flex;
      flex-direction: column;
      margin-right: var(--spacing-sm);

      .title {
        font-weight: 600;
        color: var(--color-text);
      }

      .summary {
        color: var(--color-text-light);
        margin: 0;
        transition: color var(--transition-duration) ease;

        &.expanded {
          color: var(--color-text);
        }
      }
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

    &:hover,
    &:focus {
      background-color: var(--color-bg-hover);

      .icon {
        color: var(--color-primary);
      }
    }
  }

  .content {
    max-height: 0;
    overflow: hidden;
    pointer-events: none;
    transition: max-height var(--transition-duration) ease-out;

    &.is-expanded {
      max-height: 10000px;
      transition: max-height 0.5s ease-in;
      pointer-events: all;
    }

    .content-inner {
      padding: var(--spacing-sm);
      background-color: var(--color-bg);
      color: var(--color-text);
      text-align: left;

      @media (max-width: 768px) {
        padding: var(--spacing-xs);
      }

      @media (max-width: 425px) {
        padding: calc(var(--spacing-xs) / 2);
      }
    }
  }
}
</style>