<template>
  <div class="container" @keyup.escape='toggleNavigationPopup'>
    <div class="header">
      <button :class='{ "visible": showingBillView || showingTableOfContents }' @click.stop='toggleNavigationPopup'
        :title='`${showingNav ? "Hide" : "Show"} navigation`'>
        <i>
          📝
        </i>
        <span>
          {{ showingNav ? "Hide" : "Show" }} Navigation
          <!-- future: Show Filters -->
        </span>
        <div class="navigation modal" :class='{ "visible": showingNav }' @click.stop>
          <div class='selectors'>
            Navigation
            <div>
              <div>
                Title
                <span v-if='titleToc'>
                  {{ titleToc?.name }}
                </span>
              </div>
              <BaseSelector v-if="TITLES.length > 0" :options="TITLES" :value="selectedTitle"
                @update="navigateToTitle" />
            </div>

            <div>
              <div>
                Subtitle
                <span v-if='titleToc'>
                  {{ subtitleToc?.name }}
                </span>
              </div>
              <BaseSelector :options="subtitles" :value="selectedSubtitle"
                :disabled="!selectedTitle || !subtitles.length" @update="navigateToSubtitle" />
            </div>

            <div>
              <div>
                Part
                <span v-if='subtitleToc'>
                  {{ partToc?.title }}
                </span>
              </div>
              <BaseSelector :options="parts" :value="selectedPart" @update="selectPart"
                :disabled="!parts.length || !selectedSubtitle" />
            </div>

            <div>
              <div>
                Subpart
                <span v-if='partToc'>
                  {{ subpartToc?.title }}
                </span>
              </div>
              <BaseSelector :options="subparts" :value="selectedSubpart" @update="selectSubpart"
                :disabled="!subparts.length || !selectedPart" />
            </div>
          </div>

          <div class='filter-by-tags'>
            Tags
            <Tags :tags='ALL_TAGS' :active-tags='selectedTags' clickable @tag-clicked='toggleTag' :sort='false' />
          </div>

          <button @click='toggleNavigationPopup' class='close-button' title='Close navigation popup'>
            Done
          </button>
        </div>
      </button>
      <h1 @click="handleTitleClick" :title="getHeaderTitle()" :disabled='showingTableOfContents ? true : undefined'>
        Big 🐘💩 Bill
      </h1>
      <button :class='{ "visible": !showingTableOfContents }' @click.stop='navigateToToc'
        title='Return to Table of Contents'>
        <span>
          Table of Contents
        </span>
        <i>
          🏠
        </i>
      </button>
    </div>

    <div class="contents">
      <RouterView />
    </div>

    <footer>
      <section class='links'>
        <router-link to='/fightback' title="Suggestions on how to make a difference">
          How to Make a Difference
        </router-link>
        <router-link to='/about' title='About the Big Bullshit Bill project'>About B💩B</router-link>
      </section>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useBill } from './composables/bill';
import { useRouter, useRoute } from 'vue-router';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import BaseSelector from './components/BaseSelector.vue';
import Tags from './components/Tags.vue';

const router = useRouter();
const route = useRoute();

const {
  TITLES,
  TABLE_OF_CONTENTS,
  subtitles,
  parts,
  subparts,
  ALL_TAGS,
  selectedTitle,
  selectedSubtitle,
  selectedPart,
  selectedSubpart,
  selectedTags,
  selectTitle,
  selectSubtitle,
  selectPart,
  selectSubpart,
  toggleTag,
} = useBill();

const showingNav = ref(false);
const showingTableOfContents = computed(() => route.path === '/');
const showingBillView = computed(() => route.name === 'bill');

const titleToc = computed(() => TABLE_OF_CONTENTS.find(t => t.number === selectedTitle.value));
const subtitleToc = computed(() => titleToc.value?.subtitles.find(s => s.letter === selectedSubtitle.value));
const partToc = computed(() => subtitleToc.value?.parts.find(p => p.number === selectedPart.value));
const subpartToc = computed(() => partToc.value?.subparts.find(sp => sp.letter === selectedSubpart.value.toLowerCase()));

const getHeaderTitle = () => {
  if (showingTableOfContents.value) return 'Big Bullshit Bill';
  return 'Return to Table of Contents';
};

const handleTitleClick = () => {
  if (showingTableOfContents.value) {
    return;
  } else {
    navigateToToc();
  }
};

const navigateToToc = () => {
  if (showingBillView.value) {
    const verify = confirm('Do you want to go back to the Table of Contents?');
    if (!verify) return;
  }

  router.push({ path: '/' });
};

const navigateToTitle = (title: string) => {
  router.push({ path: `/${title}` });
};

const navigateToSubtitle = (subtitle: string) => {
  router.push({ path: `/${selectedTitle.value}/${subtitle}` });
};

const setDataFromUrl = () => {
  const title = route.params.title as string;
  const subtitle = route.params.subtitle as string;
  if (title && TITLES.includes(title)) {
    selectTitle(title);

    nextTick(() => {
      if (subtitle && subtitles.value.includes(subtitle)) {
        selectSubtitle(subtitle);
      } else {
        const firstSubtitle = subtitles.value[0];
        selectSubtitle(firstSubtitle || '');
      }
    });
  } else {
    selectTitle('');
  }
};

const toggleNavigationPopup = () => {
  showingNav.value = !showingNav.value;
};

onMounted(() => {
  setDataFromUrl();
});

watch(route, () => {
  setDataFromUrl();
});

watch(subtitles, () => {
  if (subtitles.value.length) {
    selectSubtitle(subtitles.value[0]);
  }
});

watch(parts, () => {
  if (parts.value.length) {
    selectPart(parts.value[0]);
  }
});

watch(subparts, () => {
  if (subparts.value.length) {
    selectSubpart(subparts.value[0]);
  }
});
</script>

<style lang="scss">
#app:has(.modal.visible) {
  position: relative;

  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  text-align: left;
  overflow: hidden;
  height: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--spacing-xs);
    margin-bottom: var(--spacing-xs);
    width: 100%;
    border-bottom: 4px solid var(--color-primary);
    background-color: var(--color-bg);
    border-top: 8px solid var(--color-accent);

    > {
      h1 {
        font-variant: small-caps;
        font-size: 3.2em;
        margin: 0;
        cursor: pointer;
        transition: color 0.1s ease-in-out;

        &:hover,
        &:focus {
          color: var(--color-primary);
        }

        &[disabled] {
          cursor: default;
          color: unset;
        }

        @media (max-width: 960px) {
          font-size: 2.4em;
        }
      }

      button {
        opacity: 0;
        pointer-events: none;
        display: flex;
        justify-content: center;
        gap: var(--spacing-xs);
        margin: 0 var(--spacing-sm);
        border: none;
        background: none;
        outline: none;
        color: var(--color-text-light);
        text-transform: uppercase;
        font-size: 0.9em;
        font-weight: bold;
        min-width: 15%;

        &:first-child {
          margin-right: auto;
        }

        &:last-child {
          margin-left: auto;
        }

        i {
          display: none;
        }

        &.visible {
          opacity: 1;
          pointer-events: all;
        }

        @media (max-width: 960px) {
          margin: 0;
          min-width: 25%;
        }

        @media (max-width: 768px) {
          min-width: 10%;

          >span {
            display: none;
          }

          >i {
            display: flex;
          }
        }

        @media (max-width: 600px) {
          gap: 0;
        }
      }
    }
  }

  .contents {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-width: min(1200px, 80%);
    margin: 0 auto;
    margin-top: 4px;
  }
}

footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0.5em 0;

  .links {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;

    a {
      color: var(--color-text-light);
      text-decoration: none;
      margin-right: var(--spacing-md);

      &:hover {
        color: var(--color-primary);
      }
    }
  }
}

.modal {
  background-color: var(--color-bg);
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: var(--color-primary) 0 0 7px;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
  transition-property: opacity, transform;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  position: absolute;
  top: 3vh !important;
  left: 20vw;
  right: 20vw;
  max-height: calc(97vh - 120px);
  margin: auto;


  &.visible {
    opacity: 1;
    pointer-events: all;
  }

  @media (max-width: 768px) {
    max-width: 72vw !important;
    left: 11vw !important;
    right: 11vw !important;
    transform: none !important;
  }
}

.navigation {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-sm);

  .selectors {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--spacing-xs);
    margin: 0 auto;
    min-width: min(100%, 540px);
    max-width: 100%;

    >* {
      display: flex;
      justify-content: space-between;
      align-items: center;

      >:first-child {
        color: var(--color-text);
        display: flex;
        flex-direction: column;
        align-items: start;
        overflow: hidden;
        text-wrap: nowrap;
        text-overflow: ellipsis;

        span {
          font-weight: bold;
          color: var(--color-primary);
        }
      }
    }

    :deep(.select-dropdown) {
      width: 120px;
      padding: var(--spacing-xs) var(--spacing-sm)
    }
  }

  .filter-by-tags {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs);

    .tags {
      background-color: var(--color-bg-secondary);
      border-radius: var(--border-radius);
      justify-content: space-evenly;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
      margin-top: var(--spacing-xs);
      overflow-y: auto;
      padding: var(--spacing-sm);

      >* {
        flex: auto;
        min-width: 100px;
        max-width: 240px;
      }
    }
  }

  .close-button {
    background-color: var(--color-bg-secondary);
    border: none;
    border-radius: var(--border-radius);
    color: var(--color-text-light);
    font-weight: bold;
    text-transform: uppercase;
    margin: 0 var(--spacing-xs);

    &:hover {
      background-color: var(--color-bg-hover);
    }
  }
}
</style>
