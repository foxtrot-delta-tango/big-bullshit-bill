<template>
  <div class="container">
    <div class="header">
      <h1 @click="navigateToToc" :title="showingTableOfContents ? 'Big Bullshit Bill' : 'Back to Table of Contents'">Big
        🐘💩 Bill</h1>

      <div v-show="showingBillView || showingTableOfContents" class="selectors">
        <BaseSelector v-if="TITLE_FILES.length > 0" label="Title" :options="TITLES" :value="selectedTitle"
          @update="navigateToTitle" />

        <template v-if="showingBillView">
          <BaseSelector label="Subtitle" :options="subtitles" :value="selectedSubtitle"
            :disabled="!selectedTitle || !subtitles.length" @update="navigateToSubtitle" />

          <template v-if="parts.length > 0">
            <BaseSelector label="Part" :options="parts" :value="selectedPart" @update="selectPart"
              :disabled="!selectedSubtitle" />

            <BaseSelector label="Subpart" :options="subparts" :value="selectedSubpart" @update="selectSubpart"
              :disabled="!subparts.length || !selectedPart" />
          </template>
        </template>
      </div>
    </div>

    <RouterView />

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
import BaseSelector from './components/BaseSelector.vue';
import { useBill } from './composables/bill';
import { useRouter, useRoute } from 'vue-router';
import { computed, nextTick, onMounted, watch } from 'vue';

const router = useRouter();
const route = useRoute();

const {
  TITLE_FILES,
  TITLES,
  subtitles,
  parts,
  subparts,
  selectedTitle,
  selectedSubtitle,
  selectedPart,
  selectedSubpart,
  selectTitle,
  selectSubtitle,
  selectPart,
  selectSubpart,
} = useBill();

const showingTableOfContents = computed(() => route.path === '/');
const showingBillView = computed(() => route.name === 'bill');

const navigateToTitle = (title: string) => {
  router.push({ path: `/${title}` });
};

const navigateToSubtitle = (subtitle: string) => {
  router.push({ path: `/${selectedTitle.value}/${subtitle}` });
};

const navigateToToc = () => {
  router.push({ path: '/' });
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

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  max-width: min(1200px, 80%);
  margin: 0 auto;
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-sm) var(--spacing-lg);
  text-align: left;
  overflow: hidden;

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: var(--spacing-xs);
    width: 100%;

    h1 {
      font-variant: small-caps;
      font-size: 3.2em;
      margin: 0;
      cursor: pointer;
      transition: color 0.1s ease-in-out;

      &:hover {
        color: var(--color-primary);
      }

      @media (max-width: 600px) {
        font-size: 2.4em;
      }
    }

    .selectors {
      display: flex;
      gap: 0 var(--spacing-md);
      justify-content: center;
      flex-wrap: wrap;
    }
  }

  @media (max-width: 768px) {
    padding: var(--spacing-sm);
    max-width: 90%;
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
</style>
