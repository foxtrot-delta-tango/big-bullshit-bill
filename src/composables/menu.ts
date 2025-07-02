import { computed, readonly, ref, watch } from 'vue';
import { useBill, type TitleToc } from './bill';
import tocData from '../data/toc.json';

const { TITLE_FILES, getSection } = useBill();

const SELECTED_FILTER_KEY = 'selectedFilters';

const savedFiltering = JSON.parse(localStorage.getItem(SELECTED_FILTER_KEY) || '{}');
const selectedTags = ref<string[]>(savedFiltering.tags ?? []);
const matchAllTags = ref(savedFiltering.matchAllTags ?? false);

const showingFilterMenu = ref(false);

const selectedFilters = computed(() => {
    return {
        tags: selectedTags.value,
        matchAllTags: matchAllTags.value
    };
});

const visibleToc = computed(() => {
    if (!selectedTags.value.length) return tocData.titles;

    const titles: TitleToc[] = [];
    tocData.titles.forEach(title => {
        if (!hasSelectedTags(matchAllTags.value, title)) return;

        const sections = title.sections.filter(s => {
            const section = getSection(s.number);
            if (!section?.tags?.length) return false;
            return hasSelectedTags(false, title, section.subtitle, section.part, section.subpart);
        });

        if (!sections.length) return;

        const subtitles = title.subtitles.filter(subtitle => sections.some(s => s.subtitle === subtitle.letter));
        if (subtitles.length) {
            subtitles.forEach(subtitle => {
                const parts = subtitle.parts?.filter(part => sections.some(s => s.part === part.number));
                if (!parts?.length) return;

                subtitle.parts = parts;
                parts.forEach(part => {
                    const subparts = part.subparts?.filter(subpart => sections.some(s => s.subpart?.toLowerCase() === subpart.letter.toLowerCase()));
                    if (!subparts?.length) return;

                    part.subparts = subparts;
                });
            });
        }

        titles.push({
            ...title,
            subtitles,
            sections
        });
    });

    return titles;
});

const toggleFilterMenu = (toSetting?: boolean) => {
    showingFilterMenu.value = toSetting ?? !showingFilterMenu.value;
};

const setTags = (tags: string[]) => {
    selectedTags.value = tags;
};

const getTags = (title: TitleToc, subtitle?: string, part?: string, subpart?: string) => {
    const tags: { tag: string, count: number }[] = [];

    const sections = TITLE_FILES.filter(t => title && t.title === title.number)
        .flatMap(t => t.sections)
        .filter(s => {
            if (subtitle && s.subtitle !== subtitle) return false;
            if (part && s.part !== part) return false;
            if (subpart && s.subpart?.toLowerCase() !== subpart) return false;
            return true;
        });

    sections.forEach(section => {
        if (section.tags) {
            section.tags.forEach(tag => {
                const existingTag = tags.find(t => t.tag === tag)
                if (existingTag) {
                    existingTag.count++;
                } else {
                    tags.push({ tag, count: 1 });
                }
            });
        }
    });

    tags.sort((a, b) => b.count - a.count);
    return tags;
};

const hasSelectedTags = (matchAllTags: boolean, title: TitleToc, subtitle?: string, part?: string, subpart?: string) => {
    const tags = getTags(title, subtitle, part, subpart);

    if (matchAllTags) {
        return selectedTags.value.every(tag => tags.some(t => t.tag.toLowerCase() === tag.toLowerCase()));
    } else {
        return selectedTags.value.some(tag => tags.some(t => t.tag.toLowerCase() === tag.toLowerCase()));
    }
};

const toggleTag = (tag: string) => {
    const index = selectedTags.value.indexOf(tag);
    const tags = [...selectedTags.value];
    if (index > -1) {
        tags.splice(index, 1);
    } else {
        tags.push(tag);
    }

    setTags(tags);
};

const toggleMatchAllTags = (trueOrFalse?: boolean) => {
    matchAllTags.value = trueOrFalse ?? !matchAllTags.value;
};

watch(selectedFilters, () => {
    localStorage.setItem(SELECTED_FILTER_KEY, JSON.stringify(selectedFilters.value));
}, { deep: true });

export function useMenu() {
    return {
        showingFilterMenu: readonly(showingFilterMenu),
        selectedTags: readonly(selectedTags),
        matchAllTags: readonly(matchAllTags),
        visibleToc,
        toggleFilterMenu,
        setTags,
        getTags,
        toggleTag,
        toggleMatchAllTags,
        hasSelectedTags,
    }
}