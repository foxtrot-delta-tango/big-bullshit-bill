<template>
  <div class="container">
    <div class="header">      
      <h1 @click="navigateToToc" :title="showingTableOfContents ? 'Big Bullshit Bill' : 'Back to Table of Contents'">Big 🐘💩 Bill</h1>
  
      <div class="selectors">
        <BaseSelector
          v-if="TITLE_FILES.length > 0"
          label="Title"
          :options="TITLES"
          :value="selectedTitle"
          @update="navigateToTitle"
        />
        
        <BaseSelector
          label="Subtitle"
          :options="showingTableOfContents ? [] : subtitles"
          :value="selectedSubtitle"
          :disabled="!selectedTitle || !subtitles.length"
          @update="navigateToSubtitle"
        />
          <BaseSelector
            label="Part"
            :options="showingTableOfContents ? [] : parts"
            :value="selectedPart"
            @update="selectPart"
            :disabled="!parts.length || !selectedSubtitle"
          />
          <BaseSelector
            label="Subpart"
            :options="showingTableOfContents ? [] : subparts"
            :value="selectedSubpart"
            @update="selectSubpart"
            :disabled="!subparts.length || !selectedPart"
          />
      </div>
    </div>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import BaseSelector from './components/BaseSelector.vue';
import { useBill } from './composables/bill';
import { useRouter, useRoute} from 'vue-router';
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

const showingTableOfContents = computed(() => route.path === '/toc');

const navigateToTitle = (title: string) => {
  router.push({ path: `/${title}` });
};

const navigateToSubtitle = (subtitle: string) => {
  router.push({ name: 'bill', params: { title: selectedTitle.value, subtitle } });
};

const navigateToToc = () => {
  router.push({ path: '/toc' });
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
        selectSubtitle('');
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
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);
  text-align: left;

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: var(--spacing-sm);
    width: 100%;

    h1 {
      font-size: 3.2em;
      margin: 0;
      cursor: pointer;
      transition: color 0.1s ease-in-out;

      &:hover {
        color: var(--color-primary);
      }
    }

    .selectors {
      display: flex;
      flex-direction: row;
      gap: var(--spacing-sm);
      justify-content: center;
    }
  }  
}
</style>
