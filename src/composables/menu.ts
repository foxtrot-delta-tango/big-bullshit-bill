import { readonly, ref, watch } from 'vue';

const SHOW_SELECTORS_SETTING_KEY = 'show-selectors';

const selectorsVisible = ref((localStorage.getItem(SHOW_SELECTORS_SETTING_KEY) ?? 'true') === 'true');
const navigationPopupVisible = ref(false);

const toggleSelectors = () => {
    selectorsVisible.value = !selectorsVisible.value;
};

const toggleNavigationPopup = () => {
    navigationPopupVisible.value = !navigationPopupVisible.value;
};

watch(selectorsVisible, (newValue) => {
    localStorage.setItem(SHOW_SELECTORS_SETTING_KEY, newValue.toString());
});

export function useMenu() {
    return {
        selectorsVisible: readonly(selectorsVisible),
        navigationPopupVisible: readonly(navigationPopupVisible),
        toggleSelectors,
        toggleNavigationPopup
    };
}