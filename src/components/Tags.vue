<template>
    <div class="tags" :class='color'>
        <span v-for="tag in tags" :key="tag"
            :class='{ "active": props.activeTags?.includes(tag), "clickable": props.clickable }'
            @click.stop='handleClick(tag)'>
            {{ tag }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';

const props = withDefaults(defineProps<{
    tags: string[];
    color?: 'default' | 'light';
    maxShown?: number;
    activeTags?: string[];
    clickable?: boolean;
}>(), {
    color: 'default',
    activeTags: () => [],
});

const emit = defineEmits<{
    (e: 'tag-clicked', tag: string): void;
}>();

const { clickable, activeTags } = toRefs(props);

const tags = computed(() => {
    const tags = [...props.tags];
    if (!clickable.value && activeTags.value.length) {
        tags.sort((a, b) => {
            const aActive = activeTags.value.includes(a);
            const bActive = activeTags.value.includes(b);
            return (bActive ? 1 : 0) - (aActive ? 1 : 0);
        });
    }

    return props.maxShown ? tags.slice(0, props.maxShown) : tags;
});

const handleClick = (tag: string) => {
    if (props.clickable) {
        emit('tag-clicked', tag);
    }
};
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

        &.clickable {
            cursor: pointer;
            user-select: none;
        }

        &.clickable:hover,
        &.active {
            background-color: var(--color-bg);
            filter: drop-shadow(0 0 0.1em var(--color-text));
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