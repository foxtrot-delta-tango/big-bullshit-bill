<template>
  <div class="table-of-contents">
    <h2>Table of Contents</h2>
    <div class="toc-intro">
      <p>
        Explore the titles below to get started, or navigate directly to a specific section of the bill using the dropdowns above.  You can click on any section header to jump directly into it.
      </p>
      <p>
        To read the full source text of H.R.1, the so-called 'Big Beautiful Bill', visit <a href="https://www.congress.gov/bill/119th-congress/house-bill/1" target="_blank" rel="noopener noreferrer">Congress.gov</a>.
      </p>
    </div>
    <div class="toc-content">
      <ExpandableSection 
        v-for="title in tocData.titles" 
        :key="title.number"
        :title="`Title ${title.number} - ${title.name}`"
        class="title"
      >
        <template #title>
          <div class="title-header">
            <span class="title-number">TITLE {{ title.number }}</span>
            <span class="title-name">COMMITTEE ON <span class='title-subject'>{{ title.name }}&nbsp;</span></span>
          </div>
        </template>

        <template v-if="title.subtitles.length > 0">
          <ExpandableSection
            v-for="subtitle in title.subtitles"
            :key="subtitle.letter"
            :title="`Subtitle ${subtitle.letter} - ${subtitle.name}`"
            class="subtitle"
          >
            <template #title>
              <div class="subtitle-header">
                <span>Subtitle <span class="subtitle-letter">{{ subtitle.letter }}</span></span>
                <span class="subtitle-name">&nbsp;{{ subtitle.name }}&nbsp;&nbsp;</span>
              </div>
            </template>

            <div v-for="section in getSectionsForTitleSubtitle(title, subtitle.letter)" 
                :key="section.number" 
                class="section">
              <div class="section-header" @click="navigateToSection(section.number)">
                Sec. {{ section.number }}. {{ section.title }}
              </div>
            </div>

            <template v-if="subtitle.parts && subtitle.parts.length > 0">
              <ExpandableSection
                v-for="part in subtitle.parts"
                :key="part.number"
                :title="`Part ${part.number}${part.title ? ` - ${part.title}` : ''}`"
                class="part"
              >
                <template #title>
                  <div v-if="part.title" class="part-header">
                    Part {{ part.number }}--{{ part.title }}
                  </div>
                  <div v-else class="part-header">
                    Part {{ part.number }}
                  </div>
                </template>

                <div v-for="section in getSectionsForTitleSubtitlePart(title, subtitle.letter, part.number)" 
                    :key="section.number" 
                    class="section">
                  <div class="section-header" @click="navigateToSection(section.number)">
                    Sec. {{ section.number }}. {{ section.title }}
                  </div>
                </div>

                <template v-if="part.subparts && part.subparts.length > 0">
                  <ExpandableSection
                    v-for="subpart in part.subparts"
                    :key="subpart.letter"
                    :title="`Subpart ${subpart.letter} - ${subpart.title}`"
                    class="subpart"
                  >
                    <template #title>
                      <div class="subpart-header">
                        Subpart {{ subpart.letter }}--{{ subpart.title }}
                      </div>
                    </template>

                    <div v-for="section in getSectionsForTitleSubtitlePartSubpart(title, subtitle.letter, part.number, subpart.letter)" 
                        :key="section.number" 
                        class="section">
                      <div class="section-header" @click="navigateToSection(section.number)">
                        Sec. {{ section.number }}. {{ section.title }}
                      </div>
                    </div>
                  </ExpandableSection>
                </template>
              </ExpandableSection>
            </template>
          </ExpandableSection>
        </template>
        <template v-else>
          <div v-for="section in getSectionsForTitle(title)" :key="section.number" class="section">
            <div class="section-header" @click="navigateToSection(section.number)">
              Sec. {{ section.number }}. {{ section.title }}
            </div>
          </div>
        </template>
      </ExpandableSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, type Router } from 'vue-router';
import tocData from '../assets/data/toc.json';
import ExpandableSection from './ExpandableSection.vue';
import { useBill } from '../composables/bill';

const router: Router = useRouter();
const { TITLE_FILES } = useBill();

type Section = {
  number: string;
  title: string;
  subtitle?: string;
  part?: string;
  subpart?: string;
}

type Title = {
  number: string;
  name: string;
  subtitles: Array<{
    letter: string;
    name: string;
    parts: Array<{
      number: string;
      title: string;
      subparts: Array<{
        letter: string;
        title: string;
      }>;
    }>;
  }>;
  sections: Section[];
}

const getSectionsForTitle = (title: Title) => {
  return title.sections.filter(section => !section.subtitle);
}

const getSectionsForTitleSubtitle = (title: Title, subtitleLetter: string) => {
  return title.sections.filter(section => 
    section.subtitle === subtitleLetter && !section.part
  );
}

const getSectionsForTitleSubtitlePart = (title: Title, subtitleLetter: string, partNumber: string) => {
  return title.sections.filter(section => 
    section.subtitle === subtitleLetter && 
    section.part === partNumber && 
    !section.subpart
  );
}

const getSectionsForTitleSubtitlePartSubpart = (
  title: Title, 
  subtitleLetter: string, 
  partNumber: string, 
  subpartLetter: string
) => {
  return title.sections.filter(section => 
    section.subtitle === subtitleLetter && 
    section.part === partNumber && 
    section.subpart === subpartLetter
  );
}

const navigateToSection = (sectionNumber: string) => {
  const section = TITLE_FILES.flatMap(t => t.data).find(t => t.sectionNumber === sectionNumber);
  if (!section) return;

  const { titleNumber: title, subtitle } = section;

  router.push({
    name: 'bill',
    params: { title, subtitle },
    query: { section: sectionNumber }
  });
}
</script>

<style lang="scss" scoped>
.table-of-contents {
  padding: var(--spacing-md);
  background: var(--color-section-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);

  .toc-intro {
    text-align: center;
    color: var(--color-text-light);
    margin: 0 10em;

    @media (max-width: 1200px) {
      margin: 0 1em;
    }
  }

  h2 {    
    color: var(--color-text);
    margin: 0;
    text-align: center;
    text-transform: uppercase;
    font-size: 2em;
  }

  > p {
    color: var(--color-text-secondary);
    text-align: center;
  }

  .toc-content {
    .title {
      margin-bottom: var(--spacing-md);

      .title-header {
        display: flex;
        font-size: 1.3em;
        transition: font-size 0.1s ease-in-out, color 0.1s ease-in-out;

        .title-number {
          font-weight: bold;
          margin-right: var(--spacing-xs);
        }
        
        .title-name {
          font-size: 0.8em;
          font-weight: normal;
          color: var(--color-text);

          .title-subject {
            font-weight: bold;
            transition: font-size 0.05s ease-in-out, color 0.1s ease-in-out;
          }
        }

        @media (max-width: 768px) {
          flex-direction: column;
        }
      }

      &:hover .title-header {
        color: var(--color-primary);
            
        .title-subject {
          color: var(--color-primary);
          font-size: 1.2em;
          text-decoration: underline dashed;
          text-decoration-thickness: 1px;;
          text-underline-offset: 6px;
          text-decoration-color: var(--color-text);
        }
      }
    }

    .subtitle {
      margin-left: var(--spacing-md);
      margin-bottom: var(--spacing-sm);

      .subtitle-header {
        font-weight: bold;
        color: var(--color-text-light);
        display: flex;

        .subtitle-letter {
          font-weight: bold;
          margin-right: calc(var(--spacing-xs) * 0.5);
          color: var(--color-text);
        }

        .subtitle-name {
          font-size: 1.2em;
          color: var(--color-text);
        }

        @media (max-width: 768px) {
          flex-direction: column;
        }
      }

      &:hover {
        .subtitle-name {
          color: var(--color-primary);
          font-weight: bold;
          text-decoration: underline dashed;
          text-decoration-thickness: 1px;;
          text-underline-offset: 6px;
          text-decoration-color: var(--color-text);
        }
      }
    }

    .part {
      margin-left: var(--spacing-md);
      margin-bottom: var(--spacing-xs);

      .part-header {
        font-weight: 600;
        color: var(--color-text);
      }
    }

    .subpart {
      margin-left: var(--spacing-md);
      margin-bottom: var(--spacing-xs);

      .subpart-header {
        font-weight: 500;
        color: var(--color-text);
      }
    }

    .section {
      .section-header {
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: 0.67rem;
        color: var(--color-text);
        cursor: pointer;

        &:hover {
          color: var(--color-primary);
          background-color: var(--color-bg-secondary);
        }
      }
    }
  }
}
</style> 