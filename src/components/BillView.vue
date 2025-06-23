<template>
  <div class="menu" :class="{ 'expanded': selectorsVisible }">
    <div class="selectors">
      <BaseSelector v-if="TITLE_FILES.length > 0" label="Title" :options="TITLES" :value="selectedTitle"
        @update="navigateToTitle" />

      <BaseSelector label="Subtitle" :options="subtitles" :value="selectedSubtitle"
        :disabled="!selectedTitle || !subtitles.length" @update="navigateToSubtitle" />

      <BaseSelector label="Part" :options="parts" :value="selectedPart" @update="selectPart"
        :disabled="!parts.length || !selectedSubtitle" />

      <BaseSelector label="Subpart" :options="subparts" :value="selectedSubpart" @update="selectSubpart"
        :disabled="!subparts.length || !selectedPart" />
    </div>
    <router-link to='/'>Return to Table of Contents</router-link>
  </div>
  <h2 class="title" @click='toggleSelectors' :title="titleHintText">
    <span>{{ title.number }}</span>
    <span>{{ title.name }}</span>
  </h2>
  <div class="viewer">
    <div v-if="!title.subtitles.length" class="sections">
      <BillSection v-for="(section, key) in sections" :key :section />
    </div>
    <template v-else>
      <template v-for="subtitle in title.subtitles.filter(s => !selectedSubtitle || s.letter === selectedSubtitle)">
        <h3>
          Subtitle
          <span>
            {{ subtitle.letter }}
          </span>
          <span>
            {{ subtitle.name }}
          </span>
        </h3>
        <div v-if="!subtitle.parts.length" class="sections">
          <BillSection v-for="(section, key) in sections.filter(s => s.subtitle === subtitle.letter)" :key :section />
        </div>
        <template v-else>
          <template v-for="part in subtitle.parts.filter(p => !selectedPart || p.number === selectedPart)"
            :key="part.number">
            <template v-if="!part.subparts.length">
              <div class="headers">
                <strong>
                  Part {{ part.number }}
                </strong>
                <span class='highlight'>
                  {{ part.title }}
                </span>
              </div>
              <div class="sections">
                <BillSection v-for="(section, key) in sections.filter(s => s.part === part.number)" :key :section />
              </div>
            </template>
            <template v-else>
              <template
                v-for="subpart in part.subparts.filter(s => !selectedSubpart || s.letter === selectedSubpart.toLowerCase())"
                :key="subpart.letter">
                <div class="headers">
                  <strong>
                    Part {{ part.number }}{{ subpart.letter }}
                  </strong>
                  <span class='highlight'>
                    {{ part.title }}
                  </span>
                  <span>
                    {{ subpart.title }}
                  </span>
                </div>
                <div class="sections">
                  <BillSection
                    v-for="(section, key) in sections.filter(s => s.subpart?.toLowerCase() === subpart.letter)" :key
                    :section />
                </div>
              </template>
            </template>
          </template>
        </template>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import BillSection from './BillSection.vue';
import { useBill, type TitleToc } from '../composables/bill';
import { useMenu } from '../composables/menu';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import tocData from '../data/toc.json';
import BaseSelector from './BaseSelector.vue';

const router = useRouter();

const {
  TITLE_FILES,
  subtitleData,
  TITLES,
  subtitles,
  parts,
  subparts,
  selectedTitle,
  selectedSubtitle,
  selectedPart,
  selectedSubpart,
  selectPart,
  selectSubpart,
} = useBill();

const {
  selectorsVisible,
  toggleSelectors,
} = useMenu();

const sections = computed(() => subtitleData.value
  .filter(d => {
    if (selectedPart.value && selectedSubpart.value) {
      return d.part === selectedPart.value && d.subpart === selectedSubpart.value
    } else if (selectedPart.value) {
      return d.part === selectedPart.value;
    }

    return true;
  })
);

const title = computed(() => {
  let result: TitleToc = {
    number: '',
    name: '',
    subtitles: [],
    sections: []
  };

  if (selectedTitle.value) {
    const currentTitle = tocData.titles.find(t => t.number === selectedTitle.value) as TitleToc;
    if (!currentTitle) return result;

    result = currentTitle;
  }

  return result;
});

const titleHintText = computed(() => selectorsVisible.value ? 'Hide navigation' : 'Expand navigation');

const navigateToTitle = (title: string) => {
  router.push({ path: `/${title}` });
};

const navigateToSubtitle = (subtitle: string) => {
  router.push({ path: `/${selectedTitle.value}/${subtitle}` });
};
</script>

<style lang="scss" scoped>
.viewer {
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
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

  .selectors {
    display: flex;
    gap: 0 var(--spacing-md);
    justify-content: center;
    flex-wrap: wrap;

    @media (max-width: 900px) {
      gap: 0 var(--spacing-sm);
      width: 55%;
    }

    @media (max-width: 570px) {
      width: 70%;
    }
  }

  >:last-child {
    color: var(--color-text-light);
    font-style: italic;
    text-decoration: none;
    font-weight: 400;
    transition: color 0.1s ease-in-out;

    &:hover,
    &:focus {
      color: var(--color-primary);
    }
  }

  &.expanded {
    max-height: 500px;
    pointer-events: all;

    >* {
      opacity: 1;
    }
  }
}

.sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  overflow-y: auto;
  padding: 0 var(--spacing-xs);

  @media (max-width: 768px) {
    gap: var(--spacing-xs);
  }
}

.title {
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-xs);
  margin: 0 auto;
  cursor: pointer;

  span:first-of-type {
    font-size: 2rem;
  }

  span:last-of-type {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 4px;
    margin-bottom: 4px;
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

  span:first-child {
    font-size: 1.5rem;
  }

  span:last-child {
    color: var(--color-primary);
  }
}

.headers {
  display: flex;
  flex: 1;
  align-items: baseline;
  justify-content: center;
  text-align: center;
  gap: var(--spacing-xs);

  .highlight {
    color: var(--color-primary);
    font-weight: bold;
    text-transform: uppercase;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    row-gap: 0;

    strong {
      font-size: 1.25rem;
    }
  }
}

h2,
h3,
h4,
h5 {
  margin: 0;
}
</style>