import { computed, readonly, ref } from 'vue';

export type BillSectionData = {
  titleNumber: string;
  subtitle: string;
  part?: string;
  subpart?: string;
  sectionNumber: string;
  sectionTitle: string;
  sectionText: string;
  summary: string;
  impact: string | string[];
  additionalReferences?: string[];
  tags?: string[];
  checkedByHumansDate?: string;
}

export type TitleToc = {
  number: string;
  name: string;
  subtitles: SubtitleToc[];
  sections: SectionToc[];
}

export type SubtitleToc = {
  letter: string;
  name: string;
  parts: PartToc[];
}

export type PartToc = {
  number: string;
  title: string;
  subparts: SubpartToc[];
}

export type SubpartToc = {
  letter: string;
  title: string;
}

export type SectionToc = {
  number: string;
  title: string;
  subtitle?: string;
  part?: string;
  subpart?: string;
}

const tocData = ref<{ titles: TitleToc[] }>({ titles: [] });
const billData = ref<{ title: string, subtitle: string, sections: BillSectionData[] }[]>([]);

const selectedTitle = ref<string | null>(null);
const selectedSubtitle = ref<string | null>(null);
const selectedPart = ref<string | null>(null);
const selectedSubpart = ref<string | null>(null);

const tableOfContents = computed(() =>
  tocData.value.titles.map(t => ({
    number: t.number,
    name: t.name,
    subtitles: t.subtitles.map(s => ({
      letter: s.letter,
      name: s.name,
      parts: s.parts.map(p => ({
        number: p.number,
        title: p.title,
        subparts: p.subparts.map(sp => ({
          letter: sp.letter,
          title: sp.title,
        })),
      })),
    })),
    sections: t.sections,
  }))
);

const titles = computed(() =>
  billData.value.reduce((acc, curr) => {
    if (!acc.includes(curr.title)) {
      acc.push(curr.title);
    }
    return acc;
  }, [] as string[])
);

const allTags = computed(() =>
  billData.value.reduce((tags, currentTitle) => {
    const { sections } = currentTitle;
    if (sections.length) {
      sections.forEach(section => {
        if (section.tags?.length) {
          section.tags.forEach(tag => {
            if (!tags.includes(tag)) {
              tags.push(tag);
            }
          });
        }
      });
    }
    return tags;
  }, [] as string[]).sort((a, b) => a.localeCompare(b))
);

const titleData = computed(() =>
  billData.value
    .filter(f => f.title === selectedTitle.value)
    .reduce((acc, curr) => {
      acc.push(...curr.sections);
      return acc;
    }, [] as BillSectionData[])
);

const subtitles = computed(() => {
  const subtitles: string[] = [];

  if (selectedTitle.value) {
    billData.value
      .filter(f => f.title === selectedTitle.value && f.subtitle)
      .forEach(f => subtitles.push(f.subtitle));
  }

  return subtitles;
});

const subtitleData = computed(() =>
  billData.value
    .filter(f =>
      (!selectedTitle.value || f.title === selectedTitle.value)
      && (!selectedSubtitle.value || !f.subtitle || f.subtitle === selectedSubtitle.value)
    )
    .reduce((acc, curr) => {
      acc.push(...curr.sections);
      return acc;
    }, [] as BillSectionData[])
);

const parts = computed(() => {
  const parts: string[] = [];

  if (selectedSubtitle.value) {
    subtitleData.value?.forEach(d => {
      if (d.part && !parts.includes(d.part))
        parts.push(d.part);
    });
  }

  return parts;
});

const partData = computed(() => subtitleData.value.filter(s => !selectedPart.value || s.part === selectedPart.value));

const subparts = computed(() => {
  const subparts: string[] = [];

  if (selectedPart.value) {
    partData.value?.forEach(p => {
      if (p.part === selectedPart.value && p.subpart && !subparts.includes(p.subpart))
        subparts.push(p.subpart);
    });
  }

  return subparts;
});

const subpartData = computed(() => partData.value.filter(s => !selectedSubpart.value || s.subpart === selectedSubpart.value));

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
};

const DATA_ROOT = '/data';

const loadBillData = async () => {
  const titleFileMap = [
    { title: 'I', subtitle: 'A' },
    { title: 'I', subtitle: 'B' },
    { title: 'II', subtitle: '' },
    { title: 'III', subtitle: 'A' },
    { title: 'III', subtitle: 'B' },
    { title: 'III', subtitle: 'C' },
    { title: 'III', subtitle: 'D' },
    { title: 'III', subtitle: 'E' },
    { title: 'III', subtitle: 'F' },
    { title: 'III', subtitle: 'G' },
    { title: 'IV', subtitle: 'A' },
    { title: 'IV', subtitle: 'B' },
    { title: 'IV', subtitle: 'C' },
    { title: 'IV', subtitle: 'D' },
    { title: 'V', subtitle: '' },
    { title: 'VI', subtitle: '' },
    { title: 'VII', subtitle: 'A' },
    { title: 'VII', subtitle: 'B' },
    { title: 'VII', subtitle: 'C' },
    { title: 'VIII', subtitle: 'A' },
    { title: 'VIII', subtitle: 'B' },
    { title: 'VIII', subtitle: 'C' },
    { title: 'IX', subtitle: '' },
    { title: 'X', subtitle: '' },
    { title: 'XI', subtitle: 'A' },
    { title: 'XI', subtitle: 'B' },
    { title: 'XI', subtitle: 'C' },
    { title: 'XI', subtitle: 'D' },
  ];

  const tasks = titleFileMap.map(async (fileInfo) => {
    let filename = `${DATA_ROOT}/title-${fileInfo.title}/title-${fileInfo.title}`;
    if (fileInfo.subtitle) filename += `-subtitle-${fileInfo.subtitle}`;
    filename += '.json';

    const sections = await fetchJson(filename);
    return {
      title: fileInfo.title,
      subtitle: fileInfo.subtitle,
      sections
    };
  });

  tocData.value = await fetchJson(DATA_ROOT + '/toc.json');
  billData.value = (await Promise.all(tasks)).sort((first, second) => first.title.localeCompare(second.title));
};

const selectTitle = (title: string | null) => {
  selectedTitle.value = title;
  selectedSubtitle.value = '';
  selectedPart.value = '';
  selectedSubpart.value = '';
};

const selectSubtitle = (subtitle: string | null) => {
  selectedSubtitle.value = subtitle;
  selectedPart.value = '';
  selectedSubpart.value = '';
};

const selectPart = (part: string | null) => {
  selectedPart.value = part;
  selectedSubpart.value = '';
};

const selectSubpart = (subpart: string | null) => {
  selectedSubpart.value = subpart;
};

const getSection = (sectionNumber: string) => {
  return billData.value.flatMap(t => t.sections).find(t => t.sectionNumber === sectionNumber);
};

export function useBill() {
  return {
    tocData,
    billData,
    tableOfContents,
    titles,
    allTags,
    selectedTitle,
    selectedSubtitle,
    selectedPart,
    selectedSubpart,
    titleData,
    subtitles,
    subtitleData,
    parts,
    partData,
    subparts,
    subpartData,
    loadBillData,
    selectTitle,
    selectSubtitle,
    selectPart,
    selectSubpart,
    getSection,
  };
}
