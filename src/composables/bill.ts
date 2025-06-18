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
  additionalReferences: string[];
  tags?: string[];  // make not nullable after fixing the data files
  checkedByHumansDate?: string;
}

type SectionToc = {
  number: string;
  title: string;
  subtitle?: string;
  part?: string;
  subpart?: string;
}

export type TitleToc = {
  number: string;
  name: string;
  subtitles: Array<SubtitleToc>
  sections: SectionToc[] | BillSectionData[];
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

const TITLE_FILES: { title: string, subtitle: string, data: BillSectionData[] }[] = [
  { title: 'I', subtitle: 'A', data: titleISubtitleA },
  { title: 'I', subtitle: 'B', data: titleISubtitleB },
  { title: 'II', subtitle: '', data: titleII },
  { title: 'III', subtitle: 'A', data: titleIIISubtitleA },
  { title: 'III', subtitle: 'B', data: titleIIISubtitleB },
  { title: 'III', subtitle: 'C', data: titleIIISubtitleC },
  { title: 'III', subtitle: 'D', data: titleIIISubtitleD },
  { title: 'III', subtitle: 'E', data: titleIIISubtitleE },
  { title: 'III', subtitle: 'F', data: titleIIISubtitleF },
  { title: 'III', subtitle: 'G', data: titleIIISubtitleG },
  { title: 'IV', subtitle: 'A', data: titleIVSubtitleA },
  { title: 'IV', subtitle: 'B', data: titleIVSubtitleB },
  { title: 'IV', subtitle: 'C', data: titleIVSubtitleC },
  { title: 'IV', subtitle: 'D', data: titleIVSubtitleD },
  { title: 'V', subtitle: '', data: titleV },
  { title: 'VI', subtitle: '', data: titleVI },
  { title: 'VII', subtitle: 'A', data: titleVIISubtitleA },
  { title: 'VII', subtitle: 'B', data: titleVIISubtitleB },
  { title: 'VII', subtitle: 'C', data: titleVIISubtitleC },
  { title: 'VIII', subtitle: 'A', data: titleVIIISubtitleA },
  { title: 'VIII', subtitle: 'B', data: titleVIIISubtitleB },
  { title: 'VIII', subtitle: 'C', data: titleVIIISubtitleC },
  { title: 'IX', subtitle: '', data: titleIX },
  { title: 'X', subtitle: '', data: titleX },
  { title: 'XI', subtitle: 'A', data: titleXISubtitleA },
  { title: 'XI', subtitle: 'B', data: titleXISubtitleB },
  { title: 'XI', subtitle: 'C', data: titleXISubtitleC },
  { title: 'XI', subtitle: 'D', data: titleXISubtitleD },
];

const TITLES = TITLE_FILES.reduce((acc, curr) => {
  if (!acc.includes(curr.title)) {
    acc.push(curr.title);
  }
  return acc;
}, [] as string[]);

const selectedTitle = ref('');
const selectedSubtitle = ref('');
const selectedPart = ref('');
const selectedSubpart = ref('');

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

const parts = computed(() => {
  const parts: string[] = [];

  if (selectedSubtitle.value) {
    jsonData.value?.data.forEach(d => {
      if (d.part && !parts.includes(d.part))
        parts.push(d.part);
    });
  }

  return parts;
});

const subparts = computed(() => {
  const subparts: string[] = [];

  if (selectedPart.value) {
    jsonData.value?.data.forEach(d => {
      if (d.part === selectedPart.value && d.subpart && !subparts.includes(d.subpart))
        subparts.push(d.subpart);
    });
  }

  return subparts;
});

const jsonData = computed(() =>
  TITLE_FILES
    .filter(f =>
      (!selectedTitle.value || f.title === selectedTitle.value)
      && (!selectedSubtitle.value || !f.subtitle || f.subtitle === selectedSubtitle.value)
    )
    .reduce((acc, curr) => {
      acc.data.push(...curr.data);
      return acc;
    }, {
      data: [] as BillSectionData[]
    })
);

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

export function useBill() {
  return {
    TABLE_OF_CONTENTS,
    TITLE_FILES,
    TITLES,
    subtitles,
    jsonData,
    parts,
    subparts,
    selectedTitle,
    selectedSubtitle,
    selectedPart,
    selectedSubpart,
    selectTitle,
    selectSubtitle,
    selectPart,
    selectSubpart
  };
} 