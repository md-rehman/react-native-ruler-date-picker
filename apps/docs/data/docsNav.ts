export interface DocPageLink {
  id: string;
  title: string;
  href: string;
  badge?: string;
  desc?: string;
}

export interface DocNavSection {
  id: string;
  title: string;
  items: DocPageLink[];
}

export const DOCS_NAV_SECTIONS: DocNavSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    items: [
      {
        id: 'getting-started',
        title: 'Getting Started',
        href: '/docs/getting-started',
        badge: '#setup',
        desc: 'Installation, peer dependencies & quick start',
      },
      {
        id: 'primitives',
        title: 'Primitives (Ticks & LensTicks)',
        href: '/docs/introduction/primitives',
        badge: '#core',
        desc: 'Graduation marks, virtual windowing & rule resolver',
      },
      {
        id: 'haptics',
        title: 'Haptics Feedback',
        href: '/docs/introduction/haptics',
        badge: '#tactile',
        desc: 'Dual-speed tactile engine & Expo Haptics setup',
      },
      {
        id: 'theming',
        title: 'Theming & Appearance',
        href: '/docs/introduction/theming',
        badge: '#theming',
        desc: 'Color tokens, dark mode & useResolvedTheme',
      },
    ],
  },
  {
    id: 'ruler-date-picker',
    title: 'RulerDatePicker',
    items: [
      {
        id: 'rdp-basic',
        title: 'Basic Usage',
        href: '/docs/ruler-date-picker/basic',
        badge: '#component',
        desc: 'Controlled dates, presets & boundaries',
      },
      {
        id: 'rdp-anatomy',
        title: 'Compound Anatomy',
        href: '/docs/ruler-date-picker/anatomy',
        badge: '#compound',
        desc: 'Ruler.Root, Track, Indicator, Header & Reset',
      },
      {
        id: 'rdp-lens',
        title: 'Lens Distortion Effect',
        href: '/docs/ruler-date-picker/lens-effect',
        badge: '⚡ Fisheye',
        desc: 'Non-linear magnification & optical distortion',
      },
      {
        id: 'rdp-api',
        title: 'API Reference',
        href: '/docs/ruler-date-picker/api',
        badge: '#api',
        desc: 'Complete props table, types & defaults',
      },
    ],
  },
  {
    id: 'ruler-date-range-picker',
    title: 'RulerDateRangePicker',
    items: [
      {
        id: 'rdrp-basic',
        title: 'Basic Usage',
        href: '/docs/ruler-date-range-picker/basic',
        badge: '#range',
        desc: 'Dual handles, span limits & change payloads',
      },
      {
        id: 'rdrp-anatomy',
        title: 'Compound Anatomy',
        href: '/docs/ruler-date-range-picker/anatomy',
        badge: '#compound',
        desc: 'RulerRange.Root, Track, Indicator & Highlight',
      },
      {
        id: 'rdrp-api',
        title: 'API Reference',
        href: '/docs/ruler-date-range-picker/api',
        badge: '#api',
        desc: 'Range props table, DateRange type & configs',
      },
    ],
  },
  {
    id: 'hooks',
    title: 'Hooks & Architecture',
    items: [
      {
        id: 'use-ruler-date-picker',
        title: 'useRulerDatePicker',
        href: '/docs/hooks/use-ruler-date-picker',
        badge: '#headless',
        desc: 'Headless single-date physics, decay & windowing',
      },
      {
        id: 'use-ruler-date-range-picker',
        title: 'useRulerDateRangePicker',
        href: '/docs/hooks/use-ruler-date-range-picker',
        badge: '#headless',
        desc: 'Headless range physics, collision & handles',
      },
      {
        id: 'contexts',
        title: 'Compound Contexts',
        href: '/docs/hooks/contexts',
        badge: '#context',
        desc: 'useRulerContext & useRulerRangeContext',
      },
      {
        id: 'utility-hooks',
        title: 'Utility Hooks & Helpers',
        href: '/docs/hooks/utility-hooks',
        badge: '#utils',
        desc: 'useHaptics, useResolvedTheme & date helpers',
      },
    ],
  },
];

// Flat list for Prev/Next page navigation calculation
export const ALL_DOC_PAGES: DocPageLink[] = DOCS_NAV_SECTIONS.flatMap(
  (section) => section.items
);

export function getAdjacentPages(currentHref: string): {
  prev: DocPageLink | null;
  next: DocPageLink | null;
} {
  const index = ALL_DOC_PAGES.findIndex((page) => page.href === currentHref);
  if (index === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: index > 0 ? ALL_DOC_PAGES[index - 1] : null,
    next: index < ALL_DOC_PAGES.length - 1 ? ALL_DOC_PAGES[index + 1] : null,
  };
}
