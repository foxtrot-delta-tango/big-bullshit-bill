<template>
  <div class="table-of-contents">
    <h2>Table of Contents</h2>
    <div class="toc-intro">
      <p>
        Explore the titles below to get started. You can click on any section header to jump directly into it.
      </p>
      <p>
        To read the full source text of H.R.1, the so-called 'Big Beautiful Bill', visit <a
          href="https://www.congress.gov/bill/119th-congress/house-bill/1" target="_blank"
          rel="noopener noreferrer">Congress.gov</a>.
      </p>
    </div>
    <div class="toc-content">
      <ExpandableSection v-for="title in tocData.titles" :key="title.number"
        :title="`Title ${title.number} - ${title.name}`" class="title">
        <template #title>
          <div class="title-header">
            <span class="title-text">
              <span class="title-number">
                TITLE {{ title.number }}
              </span>
              <span class="title-name">
                <span>COMMITTEE ON </span>
                <span class='title-subject'>{{ title.name }}&nbsp;</span>
              </span>
            </span>
            <span class="sections-list">
              {{ getSectionListText(title) }}
            </span>
            <Tags :tags="getTags(title).map(t => t.tag)" :max-shown='5' color='light' :active-tags='selectedTags' />
          </div>
        </template>

        <template v-if="title.subtitles.length > 0">
          <ExpandableSection v-for="subtitle in title.subtitles" :key="subtitle.letter"
            :title="`Subtitle ${subtitle.letter} - ${subtitle.name}`" class="subtitle">
            <template #title>
              <div class="subtitle-header">
                <span class="subtitle-text">
                  <span>Subtitle <span class="subtitle-letter">{{ subtitle.letter }}&nbsp;</span></span>
                  <span class="subtitle-name">{{ subtitle.name }}</span>
                </span>
                <span class="sections-list">
                  {{ getSectionListText(title, subtitle.letter) }}
                </span>
                <Tags :tags="getTags(title, subtitle.letter).map(t => t.tag)" :max-shown='5' color='light'
                  :active-tags='selectedTags' />
              </div>
            </template>

            <template v-if="subtitle.parts && subtitle.parts.length > 0">
              <ExpandableSection v-for="part in subtitle.parts" :key="part.number"
                :title="`Part ${part.number}${part.title ? ` - ${part.title}` : ''}`" class="part">
                <template #title>
                  <div class="part-header">
                    <span class="part-text">
                      Part <span class="part-number">{{ part.number }}</span> <span class="part-title">{{ part.title
                        }}</span>
                    </span>
                    <div class="sections-list">
                      {{ getSectionListText(title, subtitle.letter, part.number) }}
                    </div>
                    <Tags :tags="getTags(title, subtitle.letter, part.number).map(t => t.tag)" :max-shown='5'
                      color='light' :active-tags='selectedTags' />
                  </div>
                </template>

                <template v-if="part.subparts && part.subparts.length > 0">
                  <ExpandableSection v-for="subpart in part.subparts" :key="subpart.letter"
                    :title="`Subpart ${subpart.letter} - ${subpart.title}`" class="subpart">
                    <template #title>
                      <div class="subpart-header">
                        <span class="subpart-text">
                          <span>
                            Subpart <span class="subpart-letter">{{ subpart.letter }}</span>
                          </span>
                          <span class="subpart-title">{{ subpart.title }}</span>
                        </span>
                        <div class="sections-list">
                          {{ getSectionListText(title, subtitle.letter, part.number, subpart.letter) }}
                        </div>
                        <Tags :tags="getTags(title, subtitle.letter, part.number, subpart.letter).map(t => t.tag)"
                          :max-shown='5' color='light' :active-tags='selectedTags' />
                      </div>
                    </template>

                    <template v-for="section in getSections(title, subtitle.letter, part.number, subpart.letter)">
                      <div class="section" @click="navigateToSection(section.number)">
                        <!-- {{ getSection(section.number)?.checkedByHumansDate ? '✔' : '❔' }} -->
                        <span>Sec. {{ section.number }}.</span> <span>{{ section.title }}</span>
                      </div>
                    </template>
                  </ExpandableSection>
                </template>

                <template v-else>
                  <template v-for="section in getSections(title, subtitle.letter, part.number)">
                    <div class="section" @click="navigateToSection(section.number)">
                      <!-- {{ getSection(section.number)?.checkedByHumansDate ? '✔' : '❔' }} -->
                      <span>Sec. {{ section.number }}.</span> <span>{{ section.title }}</span>
                    </div>
                  </template>
                </template>
              </ExpandableSection>
            </template>

            <template v-else>
              <template v-for="section in getSections(title, subtitle.letter)" :key="section.number">
                <div class="section" @click="navigateToSection(section.number)">
                  <!-- {{ getSection(section.number)?.checkedByHumansDate ? '✔' : '❔' }} -->
                  <span>Sec. {{ section.number }}.</span> <span>{{ section.title }}</span>
                </div>
              </template>
            </template>
          </ExpandableSection>
        </template>
        <template v-else>
          <template v-for="section in title.sections" :key="section.number">
            <div class="section" @click="navigateToSection(section.number)">
              <!-- {{ getSection(section.number)?.checkedByHumansDate ? '✔' : '❔' }} -->
              <span>Sec. {{ section.number }}.</span> <span>{{ section.title }}</span>
            </div>
          </template>
        </template>
      </ExpandableSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, type Router } from 'vue-router';
import tocData from '../data/toc.json';
import ExpandableSection from './ExpandableSection.vue';
import { useBill, type TitleToc } from '../composables/bill';
import Tags from './Tags.vue';

const router: Router = useRouter();
const { ALL_TAGS, getSection, getTags } = useBill();

const selectedTags = ref<string[]>([]);

const getSections = (title: TitleToc, subtitle?: string, part?: string, subpart?: string) => {
  return title.sections.filter(s => {
    if (subtitle && s.subtitle !== subtitle) return false;
    if (part && s.part !== part) return false;
    if (subpart && s.subpart?.toLowerCase() !== subpart) return false;
    return true;
  });
};

const getSectionListText = (title: TitleToc, subtitle?: string, part?: string, subpart?: string) => {
  const sections = getSections(title, subtitle, part, subpart);

  if (sections.length === 0) return '';
  if (sections.length === 1) return `Sec. ${sections[0].number}`;

  return `Sec. ${sections[0].number} - ${sections[sections.length - 1].number}`;
};

const navigateToSection = (sectionNumber: string) => {
  const section = getSection(sectionNumber);
  if (!section) return;

  const { titleNumber: title, subtitle } = section;

  router.push({
    name: 'bill',
    params: { title, subtitle },
    query: { section: sectionNumber }
  });
};
</script>

<style lang="scss" scoped>
.table-of-contents {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md) var(--spacing-xs);
  padding-top: 0;
  background: var(--color-section-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: auto;

  .toc-intro {
    text-align: center;
    margin: 0 8em;
    margin-bottom: 0.5em;
    color: var(--color-text-light);

    >p {
      margin: 0.5em 0;
    }

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
    white-space: nowrap;
    position: sticky;
    top: 0;
    padding-top: var(--spacing-xs);
    padding-bottom: var(--spacing-xs);
    background-color: var(--color-section-bg);

    @media (max-width: 600px) {
      font-size: 1.75em;
      letter-spacing: -1px;
    }
  }

  >p {
    color: var(--color-text-secondary);
    text-align: center;
  }

  .toc-content {
    padding: 0 var(--spacing-sm);

    @media (min-width: 1200px) {
      overflow-y: auto;
    }

    .title {
      margin-bottom: var(--spacing-md);

      .title-header {
        display: flex;
        flex-direction: column;
        font-size: 1.3em;

        .title-text {
          display: flex;
          align-items: baseline;

          .title-number {
            font-weight: bold;
            margin-right: var(--spacing-xs);
            text-wrap: nowrap;
          }

          .title-name {
            font-size: 0.8em;
            font-weight: normal;
            color: var(--color-text);

            .title-subject {
              font-weight: bold;
              transition: font-size 0.05s ease-in-out, color 0.1s ease-in-out;
            }

            @media (max-width: 768px) {
              :first-child {
                display: none;
              }
            }
          }

          @media (max-width: 960px) {}
        }

        .sections-list {
          font-size: medium;
        }

        @media (max-width: 960px) {
          flex-direction: column;
        }
      }

      &:hover {
        .title-header {
          .title-subject {
            color: var(--color-primary);
            font-size: 1.15em;
            text-decoration: underline;
            text-decoration-thickness: 1px;
            text-underline-offset: 4px;
            text-decoration-color: var(--color-text);
          }
        }
      }

      @media (max-width: 960px) {
        margin-bottom: var(--spacing-xs);
      }
    }

    .subtitle {
      margin-left: var(--spacing-md);
      margin-bottom: var(--spacing-sm);

      .subtitle-header {
        color: var(--color-text-light);
        display: flex;
        flex-direction: column;
        text-transform: uppercase;

        .subtitle-letter {
          font-weight: bold;
          font-size: 1.2em;
          margin-left: calc(var(--spacing-xs) * 0.5);
          color: var(--color-text);
        }

        .subtitle-name {
          font-size: 1.2em;
          color: var(--color-text);
          transition: color 0.1s ease-in-out;
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
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
          text-decoration-color: var(--color-text);
        }
      }

      @media (max-width: 960px) {
        margin-left: var(--spacing-xs);
        margin-bottom: var(--spacing-xs);
      }
    }

    .part {
      margin-left: var(--spacing-md);
      margin-bottom: var(--spacing-xs);

      .part-header {
        font-weight: 600;
        color: var(--color-text-light);
        text-transform: uppercase;

        .part-title {
          color: var(--color-text);
          margin-left: 0.15em;
        }

        >* {
          transition: color 0.1s ease-in-out;
        }
      }

      &:hover {
        .part-number {
          color: var(--color-text);
        }

        .part-title {
          color: var(--color-primary);
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: var(--color-text-light);
        }
      }

      @media (max-width: 960px) {
        margin-left: var(--spacing-xs);
        margin-bottom: var(--spacing-xs);
      }
    }

    .subpart {
      margin-left: var(--spacing-md);
      margin-bottom: var(--spacing-xs);

      .subpart-header {
        color: var(--color-text-light);
        text-transform: uppercase;

        .subpart-text {
          :first-child {
            margin-right: 0.2em;
          }

          .subpart-letter {
            text-transform: lowercase;
          }

          .subpart-title {
            color: var(--color-text);
            font-weight: 400;
          }

          >* {
            transition: color 0.1s ease-in-out;
          }
        }

        @media (max-width: 768px) {
          display: flex;
          flex-direction: column;
        }
      }

      &:hover {
        .subpart-header {
          .subpart-letter {
            color: var(--color-text);
          }

          .subpart-title {
            color: var(--color-primary);
            font-weight: 500;
          }
        }
      }

      @media (max-width: 960px) {
        margin-left: var(--spacing-xs);
        margin-bottom: var(--spacing-xs);
      }
    }

    .section {
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: 0.67rem;
      color: var(--color-text);
      cursor: pointer;
      transition: background-color 0.1s ease-in-out;
      display: flex;
      align-items: baseline;
      column-gap: var(--spacing-xs);

      :first-child {
        text-transform: uppercase;
        font-weight: 500;
        color: var(--color-text-light);
        text-wrap: nowrap;
      }

      :last-child {
        font-variant: small-caps;
        font-size: 1.2em;
        transition: color 0.1s ease-in-out;
      }

      &:hover {
        background-color: var(--color-bg-secondary);

        :first-child {
          color: var(--color-text);
        }

        :last-child {
          color: var(--color-primary);
        }
      }

      @media (max-width: 768px) {
        padding: var(--spacing-xs);
        flex-direction: column;
      }
    }

    .sections-list {
      color: var(--color-text-light);
      font-weight: 400;
      font-variant: small-caps;
      font-style: italic;
    }

    .tags {
      margin-top: 0.5em;
    }

    @media (max-width: 960px) {
      flex-direction: column;
    }

    @media (max-width: 425px) {
      padding: 0 var(--spacing-xs);
    }
  }

  @media (max-width: 768px) {
    padding: 0;
  }
}
</style>