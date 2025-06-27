<template>
    <div v-if="sections.length" class="sections">
        <BillSection v-for="(section, key) in sections" :key :section />
    </div>
    <div v-else class="no-sections">
        <p>No sections meet your filtering criteria.</p>
        <p>Remove some tags or go back to the Table of Contents to find sections that match.</p>
        <p>
            <i>🛸</i>
            <i>🌳<span class="cow">🐄</span>🌳</i>
        </p>
    </div>
</template>

<script setup lang="ts">
import type { BillSectionData } from '../composables/bill';
import BillSection from './BillSection.vue';

defineProps<{
    sections: BillSectionData[];
}>();
</script>

<style lang='scss' scoped>
.sections {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
    overflow-y: auto;
    padding: 0 var(--spacing-xs);

    @media (max-width: 768px) {
        padding: 0 0.5em;
        gap: var(--spacing-xs);
    }
}

.no-sections {
    text-align: center;
    padding: var(--spacing-md);
    color: var(--color-text-light);

    p {
        position: relative;
        margin: 0.25em;

        i {
            position: absolute;

            &:first-child {
                font-size: 3em;
                top: 0;
                transform: translateX(-50%);

                &::after {
                    content: '';
                    position: absolute;
                    top: 80%;
                    left: 0;
                    background-color: var(--color-primary);
                    width: 100%;
                    height: 0.9em;
                    z-index: -1;
                    clip-path: polygon(35% 0, 65% 0, 80% 90%, 70% 96%, 60% 98%, 50% 100%, 40% 98%, 30% 96%, 20% 90%);
                }
            }

            &:last-child {
                transform: translateY(4.5em) translateX(-50%);
            }

            span.cow {
                margin: 0 0.2em;
            }
        }
    }
}
</style>