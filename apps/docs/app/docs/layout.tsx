import type { Metadata } from 'next';
import DocsLayoutClient from './DocsLayoutClient';

export const metadata: Metadata = {
  title: 'Documentation | react-native-ruler-date-picker',
  description: 'Comprehensive guides, compound anatomy, API reference and headless hooks for react-native-ruler-date-picker.',
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
