<template>
    <div class="navigation modal" :class='{ "visible": showingFilterMenu }' @click.stop>
        <div class='selectors'>
            <h3>
                Sections
            </h3>
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
            <h3>
                Tags
            </h3>
            <Tags :tags='ALL_TAGS' :active-tags='selectedTags' clickable @tag-clicked='toggleTag' :sort='false' />
            <button v-if='selectedTags.length' class='text-button clear-all' @click.stop='setTags([])'
                title='Clear all tags'>
                Clear Tags <i>✖</i>
            </button>
        </div>

        <button @click='toggleFilterMenu()' class='close-button' title='Close navigation popup'>
            Done
        </button>
    </div>
</template>

<script setup lang="ts">
import BaseSelector from './BaseSelector.vue';
import Tags from './Tags.vue';
import { useBill } from '../composables/bill';
import { useMenu } from '../composables/menu';
import { computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

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
    selectPart,
    selectSubpart,
} = useBill();

const { showingFilterMenu,
    selectedTags,
    setTags,
    toggleFilterMenu,
    toggleTag,
} = useMenu();

const titleToc = computed(() => TABLE_OF_CONTENTS.find(t => t.number === selectedTitle.value));
const subtitleToc = computed(() => titleToc.value?.subtitles.find(s => s.letter === selectedSubtitle.value));
const partToc = computed(() => subtitleToc.value?.parts.find(p => p.number === selectedPart.value));
const subpartToc = computed(() => partToc.value?.subparts.find(sp => sp.letter === selectedSubpart.value.toLowerCase()));

const navigateToTitle = (title: string) => {
    router.push({ path: `/${title}` });
};

const navigateToSubtitle = (subtitle: string) => {
    router.push({ path: `/${selectedTitle.value}/${subtitle}` });
};

watch(route, (current, prior) => {
    if (current.name !== prior.name)
        toggleFilterMenu(false);
});
</script>

<style lang='scss' scoped>
.navigation {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-sm);

    h3 {
        margin: 0 auto;
        text-transform: uppercase;
    }

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
        position: relative;

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

        .clear-all {
            position: absolute;
            right: 1em;
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