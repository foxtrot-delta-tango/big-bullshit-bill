<template>
  <div class="table-of-contents">
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
            <span class="title-name">{{ title.name }}</span>
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
                <span class="subtitle-letter">Subtitle {{ subtitle.letter }}</span>
                <span class="subtitle-name">{{ subtitle.name }}</span>
              </div>
            </template>

            <div v-for="section in getSectionsForTitleSubtitle(title, subtitle.letter)" 
                :key="section.number" 
                class="section">
              <div class="section-header" @click="navigateToSection(title.number, subtitle.letter, section.number)">
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
                  <div class="section-header" @click="navigateToSection(title.number, subtitle.letter, section.number)">
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
                      <div class="section-header" @click="navigateToSection(title.number, subtitle.letter, section.number)">
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
            <div class="section-header" @click="navigateToSection(title.number, '', section.number)">
              Sec. {{ section.number }}. {{ section.title }}
            </div>
          </div>
        </template>
      </ExpandableSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import tocData from '../assets/data/toc.json';
import type { Router } from 'vue-router';
import ExpandableSection from './ExpandableSection.vue';

const router: Router = useRouter();

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

const navigateToSection = (title: string, subtitle: string, section: string) => {
  router.push({
    name: 'bill',
    params: { title, subtitle },
    query: { section }
  });
}
</script>

<style lang="scss" scoped>
.table-of-contents {
  padding: var(--spacing-md);
  background: var(--color-section-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);

  .toc-content {
    .title {
      margin-bottom: var(--spacing-md);

      .title-header {
        font-size: 1.3em;

        .title-number {
          font-weight: bold;
          margin-right: var(--spacing-xs);
        }
        
        .title-name {
          font-size: 0.8em;
          font-weight: normal;
          color: var(--color-text);
        }
      }

      &:hover .title-header {
        color: var(--color-primary);
      }
    }

    .subtitle {
      margin-left: var(--spacing-md);
      margin-bottom: var(--spacing-sm);

      .subtitle-header {
        font-weight: bold;
        color: var(--color-text);

        .subtitle-letter {
          font-size: 1.05em;
          font-weight: bold;
          margin-right: var(--spacing-xs);
        }

        .subtitle-name {
          font-size: 0.95em;
          font-weight: normal;
          color: var(--color-text);
        }
      }

      &:hover .subtitle-letter {
        color: var(--color-primary);
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