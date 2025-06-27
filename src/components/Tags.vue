<template>
    <div class="tags" :class='color'>
        <span v-for="tag in tags" :key="tag" class="tag"
            :class='{ "active": selectedTags.includes(tag), "clickable": clickable }'
            @click.stop='clickable ? toggleTag(tag) : undefined'>
            {{ tag }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useMenu } from '../composables/menu';

const { selectedTags, toggleTag } = useMenu();

const props = withDefaults(defineProps<{
    tags: string[];
    color?: 'default' | 'light';
    maxShown?: number;
    sort?: boolean;
    clickable?: boolean;
}>(), {
    color: 'default',
    activeTags: () => [],
    sort: true,
    clickable: true,
});

const { sort } = toRefs(props);

const tags = computed(() => {
    const tags = [...props.tags];
    if (sort.value && selectedTags.value.length) {
        tags.sort((a, b) => {
            const aActive = selectedTags.value.includes(a);
            const bActive = selectedTags.value.includes(b);
            return (bActive ? 1 : 0) - (aActive ? 1 : 0);
        });
    }

    return props.maxShown ? tags.slice(0, props.maxShown) : tags;
});
</script>

<style lang='scss' scoped>
.tags {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
    text-transform: uppercase;
    color: var(--color-text);
    font-size: 12px;

    >* {
        font-size: 0.8rem;
        padding: 0.2em 0.5em;
        background-color: var(--color-section-bg);
        border-radius: 0.5em;
        transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;
        user-select: none;
        cursor: default;

        &.clickable {
            cursor: pointer;

            &:hover {
                color: var(--color-text);
                filter: drop-shadow(0 0 0.1em var(--color-text));
            }
        }

        &.active {
            filter: drop-shadow(0 0 0.1em var(--color-primary));
            animation: flash 0.3s ease-in-out;
            color: var(--color-primary);
        }
    }

    &.light {
        color: var(--color-text-light);

        >.active {
            color: var(--color-primary);
        }
    }
}

@keyframes flash {
    0% {
        filter: drop-shadow(0 0 0.5em var(--color-primary));
    }

    100% {
        filter: drop-shadow(0 0 0.2em var(--color-primary));
    }
}
</style>