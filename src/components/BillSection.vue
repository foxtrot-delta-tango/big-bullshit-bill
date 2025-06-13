<template>
  <div>
    <ExpandableSection>
      <template #title>
        <div class="section-header">
          <span class="title">
            &nbsp;{{ `Sec. ${section.sectionNumber}: ${section.sectionTitle}` }}&nbsp;
          </span>
        </div>
        <p class="summary">{{ section.summary }}</p>
        <div class="section-tags">
          <span v-for="tag in section.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </template>
      <div class="section">        
        <div class="section-content">          
          <h3>Impact&nbsp;</h3>
          <p>{{ section.impact }}</p>
          
          <h3>Section Text&nbsp;</h3>
          <div class="bill-text">
            <pre v-html="section.sectionText" />
          </div>
          
          <h3>References&nbsp;</h3>
          <div class="references">
            <a v-for="(reference, index) in section.additionalReferences" :key="index" :href="reference" target="_blank">
              {{ reference }}
            </a>
          </div>
        </div>
      </div>
    </ExpandableSection>
  </div>
</template>

<script setup lang="ts">
import ExpandableSection from './ExpandableSection.vue';
import type { BillSectionData } from '../composables/bill';

defineProps<{
  section: BillSectionData;
}>();
</script>

<style lang="scss" scoped>
.summary {
  font-weight: normal;
  margin-bottom: var(--spacing-sm);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .title {
    font-size: 1.2rem;
    text-decoration: underline;
    text-underline-offset: 6px;
    text-decoration-color: var(--color-primary);
    text-transform: uppercase;
  }
}

.section-tags {
  display: flex;
  margin-left: auto;
  gap: var(--spacing-xs);
  flex-wrap: wrap;


  > * {
    font-size: 0.8rem;
    padding: calc(0.5 * var(--spacing-xs)) var(--spacing-sm);
    background-color: var(--color-section-bg);
    border-radius: 0.8em;
    text-transform: uppercase;
  }
}

.section {
  background: var(--color-section-bg);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;

  .reference {
    color: var(--color-text-light);
    font-style: italic;
    margin-top: var(--spacing-sm);
  }

  .section-content {
    h3 {
      color: var(--color-text);
      margin: var(--spacing-md) 0 var(--spacing-xs);
      font-size: 1.1rem;
      text-decoration: underline dotted;
      text-underline-offset: 4px;
      text-decoration-color: var(--color-primary);

      &:first-child {
        margin-top: 0;
      }
    }

    p {
      margin: 0;
      line-height: 1.5;
      color: var(--color-text);
    }

    .bill-text {
      width: 100%;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--color-text-light);
        border-radius: 4px;
      }

      pre {
        white-space: pre-wrap;
        margin: 0 auto;
        padding: var(--spacing-sm);
        border-radius: var(--border-radius);
        max-width: 78ch;
        max-height: max(200px, 50vh);
      }
    }

    .references {
      display: flex;
      flex-direction: column;
    }
  }
}
</style> 