import { computed, ref } from 'vue';

import tocData from '../data/toc.json';
import titleISubtitleA from '../data/title-I/title-I-subtitle-A.json';
import titleISubtitleB from '../data/title-I/title-I-subtitle-B.json';
import titleII from '../data/title-II/title-II.json';
import titleIIISubtitleA from '../data/title-III/title-III-subtitle-A.json';
import titleIIISubtitleB from '../data/title-III/title-III-subtitle-B.json';
import titleIIISubtitleC from '../data/title-III/title-III-subtitle-C.json';
import titleIIISubtitleD from '../data/title-III/title-III-subtitle-D.json';
import titleIIISubtitleE from '../data/title-III/title-III-subtitle-E.json';
import titleIIISubtitleF from '../data/title-III/title-III-subtitle-F.json';
import titleIIISubtitleG from '../data/title-III/title-III-subtitle-G.json';
import titleIVSubtitleA from '../data/title-IV/title-IV-subtitle-A.json';
import titleIVSubtitleB from '../data/title-IV/title-IV-subtitle-B.json';
import titleIVSubtitleC from '../data/title-IV/title-IV-subtitle-C.json';
import titleIVSubtitleD from '../data/title-IV/title-IV-subtitle-D.json';
import titleV from '../data/title-V/title-V.json';
import titleVI from '../data/title-VI/title-VI.json';
import titleVIISubtitleA from '../data/title-VII/title-VII-subtitle-A.json';
import titleVIISubtitleB from '../data/title-VII/title-VII-subtitle-B.json';
import titleVIISubtitleC from '../data/title-VII/title-VII-subtitle-C.json';
import titleVIIISubtitleA from '../data/title-VIII/title-VIII-subtitle-A.json';
import titleVIIISubtitleB from '../data/title-VIII/title-VIII-subtitle-B.json';
import titleVIIISubtitleC from '../data/title-VIII/title-VIII-subtitle-C.json';
import titleIX from '../data/title-IX/title-IX.json';
import titleX from '../data/title-X/title-X.json';
import titleXISubtitleA from '../data/title-XI/title-XI-subtitle-A.json';
import titleXISubtitleB from '../data/title-XI/title-XI-subtitle-B.json';
import titleXISubtitleC from '../data/title-XI/title-XI-subtitle-C.json';
import titleXISubtitleD from '../data/title-XI/title-XI-subtitle-D.json';

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
  additionalReferences?: string[];  // make not nullable after fixing the data files
  tags?: string[];  // make not nullable after fixing the data files
  checkedByHumansDate?: string;
}

export type TitleToc = {
  number: string;
  name: string;
  subtitles: Array<SubtitleToc>
  sections: SectionToc[];
}

type SubtitleToc = {
  letter: string;
  name: string;
  parts: Array<PartToc>;
}

type PartToc = {
  number: string;
  title: string;
  subparts: Array<SubpartToc>;
}

type SubpartToc = {
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

const TABLE_OF_CONTENTS: TitleToc[] =
  tocData.titles.map(t => ({
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
  }));

const TITLE_FILES: { title: string, subtitle: string, sections: BillSectionData[] }[] = [
  { title: 'I', subtitle: 'A', sections: titleISubtitleA },
  { title: 'I', subtitle: 'B', sections: titleISubtitleB },
  { title: 'II', subtitle: '', sections: titleII },
  { title: 'III', subtitle: 'A', sections: titleIIISubtitleA },
  { title: 'III', subtitle: 'B', sections: titleIIISubtitleB },
  { title: 'III', subtitle: 'C', sections: titleIIISubtitleC },
  { title: 'III', subtitle: 'D', sections: titleIIISubtitleD },
  { title: 'III', subtitle: 'E', sections: titleIIISubtitleE },
  { title: 'III', subtitle: 'F', sections: titleIIISubtitleF },
  { title: 'III', subtitle: 'G', sections: titleIIISubtitleG },
  { title: 'IV', subtitle: 'A', sections: titleIVSubtitleA },
  { title: 'IV', subtitle: 'B', sections: titleIVSubtitleB },
  { title: 'IV', subtitle: 'C', sections: titleIVSubtitleC },
  { title: 'IV', subtitle: 'D', sections: titleIVSubtitleD },
  { title: 'V', subtitle: '', sections: titleV },
  { title: 'VI', subtitle: '', sections: titleVI },
  { title: 'VII', subtitle: 'A', sections: titleVIISubtitleA },
  { title: 'VII', subtitle: 'B', sections: titleVIISubtitleB },
  { title: 'VII', subtitle: 'C', sections: titleVIISubtitleC },
  { title: 'VIII', subtitle: 'A', sections: titleVIIISubtitleA },
  { title: 'VIII', subtitle: 'B', sections: titleVIIISubtitleB },
  { title: 'VIII', subtitle: 'C', sections: titleVIIISubtitleC },
  { title: 'IX', subtitle: '', sections: titleIX },
  { title: 'X', subtitle: '', sections: titleX },
  { title: 'XI', subtitle: 'A', sections: titleXISubtitleA },
  { title: 'XI', subtitle: 'B', sections: titleXISubtitleB },
  { title: 'XI', subtitle: 'C', sections: titleXISubtitleC },
  { title: 'XI', subtitle: 'D', sections: titleXISubtitleD },
];

const TITLES = TITLE_FILES.reduce((acc, curr) => {
  if (!acc.includes(curr.title)) {
    acc.push(curr.title);
  }
  return acc;
}, [] as string[]);

const ALL_TAGS = TITLE_FILES.reduce((tags, currentTitle) => {
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
}, [] as string[]).sort((a, b) => a.localeCompare(b));

const selectedTitle = ref('');
const selectedSubtitle = ref('');
const selectedPart = ref('');
const selectedSubpart = ref('');

const titleData = computed(() =>
  TITLE_FILES
    .filter(f => f.title === selectedTitle.value)
    .reduce((acc, curr) => {
      acc.push(...curr.sections);
      return acc;
    }, [] as BillSectionData[])
);

const subtitles = computed(() => {
  const subtitles: string[] = [];

  if (selectedTitle.value) {
    TITLE_FILES
      .filter(f => f.title === selectedTitle.value && f.subtitle)
      .forEach(f => subtitles.push(f.subtitle));

    return subtitles;
  }

  return [];
});

const subtitleData = computed(() =>
  TITLE_FILES
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

const selectTitle = (title: string) => {
  selectedTitle.value = title;
  selectedSubtitle.value = '';
  selectedPart.value = '';
  selectedSubpart.value = '';
};

const selectSubtitle = (subtitle: string) => {
  selectedSubtitle.value = subtitle;
  selectedPart.value = '';
  selectedSubpart.value = '';
};

const selectPart = (part: string) => {
  selectedPart.value = part;
  selectedSubpart.value = '';
};

const selectSubpart = (subpart: string) => {
  selectedSubpart.value = subpart;
};

const getSection = (sectionNumber: string) => {
  return TITLE_FILES.flatMap(t => t.sections).find(t => t.sectionNumber === sectionNumber);
};

export function useBill() {
  return {
    TABLE_OF_CONTENTS,
    TITLE_FILES,
    TITLES,
    ALL_TAGS,
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
    selectTitle,
    selectSubtitle,
    selectPart,
    selectSubpart,
    getSection,
  };
} 