<template>
    <label class="toggle" :aria-label='`Toggle ${label}`' :aria-checked='value' aria-roledescription='toggle switch'>
        <input type="checkbox" v-model='value' @change="emit('change', !value)" />
        <span class="slider"></span>
        <span class="label">{{ label }}</span>
    </label>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    value: boolean;
    label: string;
}>();

const emit = defineEmits<{
    (e: 'change', value: boolean): void;
}>();

const value = ref(props.value);
</script>

<style lang="scss" scoped>
.toggle {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 16px;
    text-transform: uppercase;

    input {
        display: none;
    }

    .slider {
        width: 30px;
        height: 16px;
        background-color: var(--color-bg-secondary);
        border-radius: 8px;
        position: relative;
        transition: background-color 0.2s ease-in-out;

        &::before {
            content: '';
            position: absolute;
            top: 0px;
            left: 0px;
            width: 14px;
            height: 14px;
            background-color: var(--color-text-light);
            border-radius: 50%;
            border: 1px solid var(--color-text);
            transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
        }
    }

    input:checked+.slider {
        &::before {
            transform: translateX(14px);
            background-color: var(--color-primary);
        }
    }

    .label {
        margin-left: 10px;
        color: var(--color-text-light);
        font-size: smaller;
    }
}
</style>