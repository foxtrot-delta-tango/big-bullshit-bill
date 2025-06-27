<template>
    <div class="section" @click="navigateToSection(section.number)">
        <!-- {{ getSection(section.number)?.checkedByHumansDate ? '✔' : '❔' }} -->
        <span>Sec. {{ section.number }}.</span> <span>{{ section.title }}</span>
        <Tags v-if="activeTagsForSection?.length" :tags="activeTagsForSection" :clickable="false" />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useBill, type SectionToc } from '../composables/bill';
import { computed } from 'vue';
import { useMenu } from '../composables/menu';
import Tags from './Tags.vue';

const router = useRouter();
const { getSection } = useBill();
const { selectedTags } = useMenu();

const props = defineProps<{
    section: SectionToc;
}>();

const activeTagsForSection = computed(() => getSection(props.section.number)?.tags?.filter(t => selectedTags.value.includes(t)));

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

<style lang='scss' scoped>
.section {
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: 0.67rem;
    color: var(--color-text);
    cursor: pointer;
    transition: background-color 0.1s ease-in-out;
    display: flex;
    align-items: baseline;
    column-gap: var(--spacing-xs);

    >:first-child {
        text-transform: uppercase;
        font-weight: 500;
        color: var(--color-text-light);
        text-wrap: nowrap;
    }

    >span:last-of-type {
        font-variant: small-caps;
        font-size: 1.2em;
        transition: color 0.1s ease-in-out;
    }

    &:hover {
        background-color: var(--color-bg-secondary);

        >:first-child {
            color: var(--color-text);
        }

        span:last-of-type {
            color: var(--color-primary);
        }
    }

    @media (max-width: 768px) {
        padding: var(--spacing-xs);
        flex-direction: column;
    }
}

.tags {
    margin-top: var(--spacing-xs);
    margin-left: auto;
    max-width: 35%;
    justify-content: flex-end;

    >* {
        white-space: nowrap;
    }
}
</style>