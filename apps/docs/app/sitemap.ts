import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://md-rehman.dev/react-native-ruler-date-picker';
  const lastModified = new Date();

  const routes: Array<{
    path: string;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
  }> = [
    { path: '', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/playground', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/docs/getting-started', changeFrequency: 'weekly', priority: 0.95 },
    { path: '/docs/ruler-date-picker/basic', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/docs/ruler-date-picker/anatomy', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/docs/ruler-date-picker/lens-effect', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/docs/ruler-date-picker/api', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/docs/ruler-date-range-picker/basic', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/docs/ruler-date-range-picker/anatomy', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/docs/ruler-date-range-picker/api', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/docs/introduction/primitives', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/docs/introduction/haptics', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/docs/introduction/theming', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/docs/hooks/use-ruler-date-picker', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/docs/hooks/use-ruler-date-range-picker', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/docs/hooks/contexts', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/docs/hooks/utility-hooks', changeFrequency: 'monthly', priority: 0.75 },
  ];

  return routes.map((item) => ({
    url: `${baseUrl}${item.path}`,
    lastModified,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));
}

