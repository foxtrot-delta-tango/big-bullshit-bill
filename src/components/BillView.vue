<template>
  <h2 class="title">
    <span>{{ titleData.number }}</span>
    <span>{{ titleData.name }}</span>
  </h2>
  <div v-if="jsonData" class="content">
    <template v-if="!titleData.subtitles.length">
      <BillSection v-for="(section, index) in sections" :key="index" :section="section" />
    </template>
    <template v-else>
      <div v-for="subtitle in titleData.subtitles.filter(s => !selectedSubtitle || s.letter === selectedSubtitle)" :key="subtitle.letter" class="subtitle">
        <h3>
          Subtitle {{ subtitle.letter }} &mdash; {{ subtitle.name }}
        </h3>
        <div class="content">
          <template v-if="!subtitle.parts.length">
            <BillSection v-for="(section, index) in sections.filter(s => s.subtitle === subtitle.letter)" :key="index" :section="section" />
          </template>
          <template v-else>
            <div v-for="part in subtitle.parts.filter(p => !selectedPart || p.number === selectedPart)" :key="part.number" class="part">
              <template v-if="!part.subparts.length">
                  <div class="headers">
                    <strong>
                      Part {{ part.number }}
                    </strong>
                    <span class='highlight'>
                      {{ part.title }}
                    </span>
                  </div>
                <div class="content">
                  <BillSection v-for="(section, index) in sections.filter(s => s.part === part.number)" :key="index" :section="section" />
                </div>
              </template>
              <template v-else>
                <div v-for="subpart in part.subparts.filter(s => !selectedSubpart || s.letter === selectedSubpart.toLowerCase())" :key="subpart.letter" class="subpart">
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
                  <div class="content">
                    <BillSection v-for="(section, index) in sections.filter(s => s.subpart?.toLowerCase() === subpart.letter)" :key="index" :section="section" />
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import BillSection from './BillSection.vue';
import { useBill, type TitleToc } from '../composables/bill';
import { computed } from 'vue';
import tocData from '../assets/data/toc.json';

const {
  jsonData,
  selectedTitle,
  selectedSubtitle,
  selectedPart,
  selectedSubpart
} = useBill();

const sections = computed(() => jsonData.value?.data
  .filter(d => {
    if (selectedPart.value && selectedSubpart.value) {
      return d.part === selectedPart.value && d.subpart === selectedSubpart.value
    } else if (selectedPart.value) {
      return d.part === selectedPart.value;
    }

    return true;
  })
);

const titleData = computed(() => {
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
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xs);

  @media (max-width: 768px) {
    gap: var(--spacing-sm);
  }
}

.title {
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-xs);
  max-width: 80%;
  margin: 0 auto;

  span:first-child {
    font-size: 2rem;
  }

  span:last-child {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 4px;
    margin-bottom: 4px;
  }
}

.subtitle {
  h3 {
    text-align: center;
    font-size: 1.25rem;
    text-transform: uppercase;
  }

  .part {
    h4 {
      padding: var(--spacing-xs);
    }
    
    .headers {
      display: flex !important;
      flex: 1;
      align-items: center;
      padding: var(--spacing-xs);
      gap: var(--spacing-xs);
      margin: var(--spacing-sm) 0;

      .highlight {
        color: var(--color-primary);
        font-weight: bold;
        text-transform: uppercase;
      }
    }
  }
}

h2, h3, h4, h5 {
  margin: 0;
}
</style>