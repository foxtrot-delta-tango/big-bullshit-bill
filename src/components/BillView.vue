<template>
  <!-- for easy scrolling reasons, title and subtitle are up here -->
  <h2 v-if="selectedTitle" class="title-header">
    <span>{{ selectedTitleData?.number }}</span>
    <span>{{ selectedTitleData?.name }}</span>
  </h2>
  <h3 v-if='selectedSubtitle' class='subtitle' :class='`title-${selectedTitleData?.number.toLowerCase()}`'>
    <span class='collapsing-text'>
      <span>
        Subtitle
      </span>
      <span>
        {{ selectedSubtitleData?.letter }}
      </span>
    </span>
    <span>
      {{ selectedSubtitleData?.name }}
    </span>
  </h3>
  <div class="viewer" :class="[stickyHeaderClass, selectedTitle ? `title-${selectedTitle.toLowerCase()}` : '']">
    <section v-for="title in visibleToc.filter(t => !selectedTitle || t.number === selectedTitle)" class='title'>
      <h2 v-if='!selectedTitle' class="title-header" :class='`title-${title.number.toLowerCase()}`'>
        <span>{{ title.number }}</span>
        <span>{{ title.name }}</span>
      </h2>
      <BillSections v-if='!title.subtitles.length' :sections />
      <template v-else>
        <section v-for="subtitle in title.subtitles.filter(s => !selectedSubtitle || s.letter === selectedSubtitle)"
          class='subtitle'>
          <h3 v-if='!selectedSubtitle' :class='`title-${title.number.toLowerCase()}`'>
            <span class='collapsing-text'>
              <span>
                Subtitle
              </span>
              <span>
                {{ subtitle.letter }}
              </span>
            </span>
            <span>
              {{ subtitle.name }}
            </span>
          </h3>
          <BillSections v-if='!subtitle.parts.length'
            :sections='sections.filter(s => s.subtitle === subtitle.letter)' />
          <template v-else>
            <section v-for="part in subtitle.parts.filter(p => !selectedPart || p.number === selectedPart)"
              :key="part.number" class='part'>
              <template v-if="!part.subparts.length">
                <header :class='`title-${title.number.toLowerCase()}`'>
                  <strong class='collapsing-text'>
                    <span>
                      Part
                    </span>
                    <span>
                      {{ part.number }}
                    </span>
                  </strong>
                  <span class='highlight'>
                    {{ part.title }}
                  </span>
                </header>
                <BillSections :sections='sections.filter(s => s.part === part.number)' />
              </template>
              <template v-else>
                <div
                  v-for="subpart in part.subparts.filter(s => !selectedSubpart || s.letter === selectedSubpart.toLowerCase())"
                  :key="subpart.letter" class='subpart'>
                  <header :class='`title-${title.number.toLowerCase()}`'>
                    <div>
                      <strong class='collapsing-text'>
                        <span>
                          Part
                        </span>
                        <span>
                          {{ part.number }}{{ subpart.letter }}
                        </span>
                      </strong>
                      <span class='highlight'>
                        {{ part.title }}
                      </span>
                    </div>
                    <span>
                      {{ subpart.title }}
                    </span>
                  </header>
                  <BillSections :sections='sections.filter(s => s.subpart?.toLowerCase() === subpart.letter)' />
                </div>
              </template>
            </section>
          </template>
        </section>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import BillSections from './BillSections.vue';
import { useBill, type TitleToc } from '../composables/bill';
import { useMenu } from '../composables/menu';
import { computed } from 'vue';

const {
  subtitleData,
  selectedTitle,
  selectedSubtitle,
  selectedPart,
  selectedSubpart,
} = useBill();

const {
  visibleToc,
  selectedTags,
} = useMenu();

const sections = computed(() => subtitleData.value
  .filter(d => {
    if (selectedPart.value && d.part !== selectedPart.value)
      return false;

    if (selectedSubpart.value && d.subpart?.toLowerCase() !== selectedSubpart.value.toLowerCase())
      return false;

    if (selectedTags.value.length && !d.tags?.some(tag => selectedTags.value.includes(tag)))
      return false;

    return true;
  })
);

const selectedTitleData = computed(() => {
  if (!selectedTitle.value) return null;
  return visibleToc.value.find(t => t.number === selectedTitle.value) as TitleToc;
});

const selectedSubtitleData = computed(() => {
  if (!selectedSubtitle.value) return null;
  return selectedTitleData.value?.subtitles.find(s => s.letter === selectedSubtitle.value);
});

const selectedPartData = computed(() => {
  if (!selectedSubtitleData.value) return null;
  return selectedSubtitleData.value.parts.find(p => p.number === selectedPart.value);
});

const stickyHeaderClass = computed(() => {
  let headerNumber = 0;
  if (!selectedTitleData.value) {
    headerNumber = 3;
  } else if (selectedTitleData.value?.subtitles.length && !selectedSubtitle.value) {
    headerNumber++;
    if (selectedTitleData.value.subtitles.some(s => s.parts.length)) {
      headerNumber++;
    }
  } else if (selectedSubtitleData.value?.parts?.length || selectedPartData.value?.subparts?.length) {
    headerNumber++;
  }

  return {
    'one-sticky-header': headerNumber === 1,
    'two-sticky-headers': headerNumber === 2,
    'three-sticky-headers': headerNumber === 3
  };
})
</script>

<style lang="scss" scoped>
h2,
h3,
h4,
h5 {
  margin: 0;
}

.viewer {
  display: flex;
  flex-direction: column;
  flex: auto;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-thumb {
    transition: color 0.25s ease-in-out;
    background: var(--color-secondary, #888);
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-primary, #555);
    cursor: grab;
  }

  &::-webkit-scrollbar-thumb:active {
    cursor: grabbing;
  }
}

.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  max-height: 0;
  transition: max-height 0.25s ease-out;
  pointer-events: none;

  >* {
    opacity: 0;
    transition: opacity 0.25s ease-in-out;
  }
}

h2.title-header {
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-xs);
  margin: 0 auto;
  cursor: pointer;
  position: sticky;
  top: 0;
  background-color: var(--color-bg);
  z-index: 3;
  height: 2em;

  span:first-of-type {
    font-size: 2rem;
  }

  span:last-of-type {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 4px;
    margin-bottom: 4px;
  }

  @media (max-width: 768px) {
    margin-bottom: 0;
    font-size: 1.2rem;
    height: 3em;
  }
}

h3 {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  text-transform: uppercase;
  font-weight: bold;
  gap: var(--spacing-xs);
  background-color: var(--color-bg);
  padding-bottom: 0.5em !important;
  height: 1em;

  &.title-xi {
    height: 1.5em;

    @media (max-width: 768px) {
      height: 2.4em;
    }
  }

  .collapsing-text {
    max-width: 200px;
    align-items: center;

    span:last-child {
      font-size: 1.1em;
    }
  }

  >span:last-child {
    color: var(--color-primary);
  }

  @media (max-width: 768px) {
    font-size: 1.1em;
  }
}

section.subtitle {
  display: flex;
  flex-direction: column;
  position: relative;

  h3 {
    z-index: 2;
    position: sticky;
    padding-bottom: var(--spacing-xs);
    text-align: center;
  }

  &:has(.part) {
    overflow: visible;
  }
}

.part,
.subpart {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: auto;

  header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    background-color: var(--color-bg);
    position: sticky;
    z-index: 1;

    :first-child {
      display: flex;
      align-items: baseline;
      gap: var(--spacing-xs);
      font-size: 1.25rem;
    }

    .highlight {
      color: var(--color-primary);
      font-weight: bold;
      text-transform: uppercase;
    }

    @media (max-width: 768px) {
      text-align: center;
      padding-bottom: var(--spacing-xs);
    }
  }
}

.subpart {
  header {
    :first-child {
      font-size: 1em;
    }

    .collapsing-text {
      max-width: 100px;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0 0.5em;

      .collapsing-text {
        font-size: 1.5rem;
      }
    }
  }
}

.collapsing-text {
  display: flex;
  transition: max-width 0.25s ease-out;
  gap: 0 var(--spacing-xs);

  @media (max-width: 768px) {
    gap: 0;

    span:first-child {
      overflow: hidden;
      max-width: 0;
    }
  }
}

.sections {
  margin-top: 0;
}

.viewer {
  &.one-sticky-header {
    &::-webkit-scrollbar-track {
      margin-top: 3em;

      @media (max-width: 768px) {
        margin-top: 2.5em;
      }
    }

    .subtitle h3 {
      top: 0;
    }

    .part header {
      top: 2em;

      @media (max-width: 768px) {
        &.title-xi {
          top: 2.4em;
        }
      }
    }
  }

  &.two-sticky-headers {
    &::-webkit-scrollbar-track {
      margin-top: 3em;

      @media (max-width: 768px) {
        margin-top: 5em;

        &.title-xi {
          margin-top: 6em;
        }
      }
    }

    .subtitle h3 {
      top: 0;
    }

    .part header,
    .subpart header {
      top: 1.6em;

      &.title-xi {
        top: 2em;
      }

      @media (max-width: 768px) {
        &.title-xi {
          top: 3.2em;
        }
      }
    }
  }
}
</style>