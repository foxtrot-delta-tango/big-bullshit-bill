<template>
  <div ref='sectionElement'>
    <ExpandableSection>
      <template #title>
        <div class="section-header" @click.stop>
          <i v-if='section.checkedByHumansDate' class='verified'
            :title='`This section was verified for accuracy by a human reviewer on ${verificationDate}.`'>
            ✔
          </i>
          <i v-else
            title='This section has not yet been reviewed by a human and should be independently verified before being cited as a source anywhere else.  Please see the "About" section at the bottom of the page to contribute as a reviewer.'>
            ?
          </i>
          <span class="title">
            &nbsp;{{ `Sec. ${section.sectionNumber}` }} <span class='section-title'>{{ section.sectionTitle
            }}&nbsp;</span>
          </span>
        </div>
      </template>
      <template #summary>
        <!-- <p class="summary" @click.stop='showFullSummary = !showFullSummary' role='button' -->
        <p class="summary">
          <span class="expanded">
            {{ section.summary }}
          </span>
          <!-- <span role='button' :aria-expanded='showFullSummary'>
            Show {{ showFullSummary ? 'Less' : 'More' }}
          </span> -->
        </p>
        <Tags v-if='section.tags' :tags="section.tags" :active-tags='selectedTags' clickable @tag-clicked='toggleTag'
          :sort='false' />
      </template>
      <div class="section">
        <div class="section-content">
          <h3>Impact&nbsp;</h3>
          <p v-if='section.impact && typeof section.impact === "string"' v-html="markdownImpact" />
          <template v-else>
            <p v-for='paragraph in section.impact'>
              {{ paragraph }}
            </p>
          </template>

          <h3>Section Text&nbsp;</h3>
          <div class="bill-text">
            <pre v-html="section.sectionText" />
          </div>

          <h3>References&nbsp;</h3>
          <div class="references">
            <a v-for="(reference, index) in section.additionalReferences" :key="index" :href="reference"
              target="_blank">
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
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { marked } from 'marked';
import Tags from './Tags.vue';
import { useMenu } from '../composables/menu';

const router = useRouter();
const { selectedTags, toggleTag } = useMenu();

const props = defineProps<{
  section: BillSectionData;
}>();

const sectionElement = ref<HTMLElement | null>(null);

const showFullSummary = ref(true);

const verificationDate = computed(() => props.section.checkedByHumansDate ? new Date(props.section.checkedByHumansDate).toLocaleDateString('en-US') : '');

const markdownImpact = computed(() => {
  const impact = props.section.impact;
  if (typeof impact === 'string') {
    return marked(impact);
  } else if (Array.isArray(impact)) {
    return marked(impact.join('\n\n'));
  }
  return '';
});

watch(sectionElement, () => {
  if (sectionElement.value) {
    const section = router.currentRoute.value.query.section as string | undefined;

    if (section) {
      if (section === props.section.sectionNumber) {
        sectionElement.value?.scrollIntoView({ block: 'start' });
        setTimeout(() => {
          const header = sectionElement.value?.querySelector('button.header') as HTMLElement;
          if (header) header.click();
        }, 150);
      } else {
        router.push({ query: {} });
      }
    }
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.summary {
  font-weight: normal;
  margin-bottom: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  cursor: pointer;

  :first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    max-height: 4em;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    transition: max-height 0.3s ease-in-out;

    &.expanded {
      max-height: 100vh;
      line-clamp: unset;
      -webkit-line-clamp: unset;
    }

    p {
      margin: 0;
      line-height: 1.5;
    }

    strong {
      font-weight: 600;
    }

    em {
      font-style: italic;
    }

    code {
      background-color: var(--color-section-bg);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: monospace;
      font-size: 0.9em;
    }

    ul,
    ol {
      margin: 0.5em 0;
      padding-left: 1.5em;
    }

    li {
      margin: 0.2em 0;
    }
  }

  // :last-child {
  //   color: var(--color-text-light);
  // }

  // &:hover {
  //   :last-child {
  //     color: var(--color-primary);
  //   }
  // }
}

.section-header {
  display: flex;
  pointer-events: none;

  .title {
    font-size: 1.2rem;
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: var(--color-primary);
    text-transform: uppercase;
    max-width: 80%;

    .section-title {
      font-weight: 400;
      white-space: break-spaces;
      color: var(--color-primary);
    }

    @media (max-width: 768px) {
      font-size: 1.1rem;

      .section-title {
        font-weight: unset;
      }
    }
  }

  i {
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 3px solid;
    background-color: var(--color-bg);
    cursor: help;
    pointer-events: all;

    &.verified {
      border-color: var(--color-primary);
    }
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

      &:not(:last-child) {
        margin-bottom: var(--spacing-xs);
      }
    }

    .bill-text {
      overflow-y: auto;
      background-color: var(--color-bg);
      border-radius: var(--border-radius);

      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
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
        width: 78ch;
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