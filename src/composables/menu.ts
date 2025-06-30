import { computed, readonly, ref, watch } from 'vue';
import { useBill, type TitleToc } from './bill';
import tocData from '../data/toc.json';

const { TITLE_FILES, getSection } = useBill();

const SELECTED_FILTER_KEY = 'selectedFilter';

const savedFiltering = JSON.parse(localStorage.getItem(SELECTED_FILTER_KEY) || '{}');
const selectedTags = ref<string[]>(savedFiltering.tags || []);

const showingFilterMenu = ref(false);

const selectedFilters = computed(() => {
    return {
        tags: selectedTags.value,
    }
});

const visibleToc = computed(() => {
    if (!selectedTags.value.length) return tocData.titles;

    const titles: TitleToc[] = [];
    tocData.titles.forEach(title => {
        const subtitles = title.subtitles.filter(subtitle => hasSelectedTags(title, subtitle.letter));
        if (!subtitles || !subtitles.length) return;

        subtitles.forEach(subtitle => {
            const parts = subtitle.parts?.filter(part => hasSelectedTags(title, subtitle.letter, part.number));
            if (!parts || !parts.length) return;

            subtitle.parts = parts;
            parts.forEach(part => {
                const subparts = part.subparts?.filter(subpart => hasSelectedTags(title, subtitle.letter, part.number, subpart.letter));
                if (!subparts || !subparts.length) return;

                part.subparts = subparts;
            });
        });

        const sections = title.sections.filter(s => {
            const section = getSection(s.number);
            if (!section?.tags?.length) return false;
            return selectedTags.value.some(tag => section.tags?.some(t => t === tag));
        });

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

    const sections = TITLE_FILES.filter(t => t.title === title.number)
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

const hasSelectedTags = (title: TitleToc, subtitle?: string, part?: string, subpart?: string) => {
    const tags = getTags(title, subtitle, part, subpart);
    return selectedTags.value.some(tag => tags.some(t => t.tag.toLowerCase() === tag.toLowerCase()));
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

watch(selectedFilters, () => {
    localStorage.setItem(SELECTED_FILTER_KEY, JSON.stringify(selectedFilters.value));
}, { deep: true });

export function useMenu() {
    return {
        showingFilterMenu: readonly(showingFilterMenu),
        selectedTags: readonly(selectedTags),
        visibleToc,
        toggleFilterMenu,
        setTags,
        getTags,
        toggleTag
    }
}