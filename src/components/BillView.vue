<template>
  <h2 class="title">
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import tocData from '../data/toc.json';

const router = useRouter();

const {
  subtitleData,
  selectedTitle,
  selectedSubtitle,
  selectedPart,
  selectedSubpart,
} = useBill();

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