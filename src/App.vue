<template>
  <div class="container" @keyup.escape='toggleFilterMenu()'>
    <div class="header">
      <button :class='{ "visible": showingBillView || showingTableOfContents }' @click.stop='toggleFilterMenu()'
        :title='`${showingFilterMenu ? "Hide" : "Show"} navigation`'>
        <i>
          📝
        </i>
        <span>
          {{ showingFilterMenu ? "Hide" : "Show" }} Filters
        </span>
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
  <Teleport to="body">
    <NavigationModal />
  </Teleport>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useBill } from './composables/bill';
import { useMenu } from './composables/menu';
import { useRouter, useRoute } from 'vue-router';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import NavigationModal from './components/NavigationModal.vue';

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
  showingFilterMenu,
  toggleFilterMenu
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

    @media (max-width: 960px) {
      max-width: 90%;
    }
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
</style>
