<template>
  <div class="container">
    <div class="header">
      <button :class='{ "visible": showingBillView && !selectorsVisible }' @click.stop='toggleNavigationPopup'
        title='Show navigation popup'>
        📝
      </button>
      <h1 @click="handleTitleClick" :title="getHeaderTitle()" :disabled='showingTableOfContents ? true : undefined'>
        Big 🐘💩 Bill
      </h1>
      <button :class='{ "visible": !showingTableOfContents && !selectorsVisible }' @click.stop='navigateToToc'
        title='Return to Table of Contents'>
        🏠
      </button>
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
import { useBill } from './composables/bill';
import { useMenu } from './composables/menu';
import { useRouter, useRoute } from 'vue-router';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const router = useRouter();
const route = useRoute();

const {
  TITLES,
  subtitles,
  parts,
  subparts,
  selectTitle,
  selectSubtitle,
  selectPart,
  selectSubpart,
} = useBill();

const {
  selectorsVisible,
  toggleNavigationPopup
} = useMenu();

const showingTableOfContents = computed(() => route.path === '/');
const showingBillView = computed(() => route.name === 'bill');

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
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xs);
    width: 100%;

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

      @media (max-width: 600px) {
        font-size: 2.4em;
      }
    }

    button {
      opacity: 0;
      pointer-events: none;
      width: 2.4em;
      display: flex;
      justify-content: center;

      &.visible {
        opacity: 1;
        pointer-events: all;
      }
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
