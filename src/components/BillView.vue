<template>
  <h2 class="title">
    <span>{{ title.number }}</span>
    <span>{{ title.name }}</span>
  </h2>
  <h3 class='subtitle' v-if='title.subtitles.length'>
    <span class='collapsing-header-text' v-if='selectedSubtitle'>
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
  <div class="viewer">
    <BillSections v-if='!title.subtitles.length' :sections />
    <template v-else>
      <template v-for="subtitle in title.subtitles.filter(s => !selectedSubtitle || s.letter === selectedSubtitle)">
        <BillSections v-if='!subtitle.parts.length' :sections='sections.filter(s => s.subtitle === subtitle.letter)' />
        <template v-else>
          <template v-for="part in subtitle.parts.filter(p => !selectedPart || p.number === selectedPart)"
            :key="part.number">
            <div v-if="!part.subparts.length" class='part'>
              <div class="headers">
                <strong class='collapsing-header-text'>
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
              </div>
              <BillSections :sections='sections.filter(s => s.part === part.number)' />
            </div>
            <template v-else>
              <div
                v-for="subpart in part.subparts.filter(s => !selectedSubpart || s.letter === selectedSubpart.toLowerCase())"
                :key="subpart.letter" class='subpart'>
                <div class="headers">
                  <div>
                    <strong class='collapsing-header-text'>
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
                </div>
                <BillSections :sections='sections.filter(s => s.subpart?.toLowerCase() === subpart.letter)' />
              </div>
            </template>
          </template>
        </template>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import BillSections from './BillSections.vue';
import { useBill, type TitleToc } from '../composables/bill';
import { useMenu } from '../composables/menu';
import { computed } from 'vue';
import tocData from '../data/toc.json';

const {
  subtitleData,
  selectedTitle,
  selectedSubtitle,
  selectedPart,
  selectedSubpart,
} = useBill();

const {
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

const selectedSubtitleData = computed(() => {
  if (!selectedSubtitle.value) return null;
  return title.value.subtitles.find(s => s.letter === selectedSubtitle.value);
});

// I don't think we are going to use this, but just in case...it's here
// const currentTags = computed(() => {
//   let data = [] as BillSectionData[];

//   if (selectedSubpart.value) {
//     data = subpartData.value;
//   } else if (selectedPart.value) {
//     data = partData.value;
//   } else if (selectedSubtitle.value) {
//     data = subtitleData.value;
//   } else {
//     data = titleData.value;
//   }

//   const tags: string[] = [];
//   data.forEach(section => {
//     if (section.tags) {
//       section.tags.forEach(tag => {
//         if (!tags.includes(tag)) {
//           tags.push(tag);
//         }
//       });
//     }
//   });

//   return tags;
// });
</script>

<style lang="scss" scoped>
.viewer {
  display: flex;
  flex-direction: column;
  flex: auto;
  overflow-y: auto;
  position: relative;
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

h3.subtitle {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  text-transform: uppercase;
  font-weight: bold;
  gap: var(--spacing-xs);
  background-color: var(--color-bg);

  .collapsing-header-text {
    max-width: 200px;
    align-items: center;

    span:last-child {
      font-size: 1.1em;
    }
  }

  >span:last-child {
    color: var(--color-primary);
  }
}

.part,
.subpart {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: auto;

  .headers {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    background-color: var(--color-bg);

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
  }
}

.subpart {
  .headers {
    .collapsing-header-text {
      max-width: 100px;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0 0.5em;

      .collapsing-header-text {
        font-size: 1.5rem;
      }
    }
  }
}

.collapsing-header-text {
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


h2,
h3,
h4,
h5 {
  margin: 0;
}
</style>