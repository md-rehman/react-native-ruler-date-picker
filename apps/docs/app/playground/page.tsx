import type { Metadata } from 'next';
import AppShell from '../components/AppShell/AppShell';

export const metadata: Metadata = {
  title: 'Playground | react-native-ruler-date-picker',
  description: 'Interactive live playground and device sandbox for react-native-ruler-date-picker',
};

export default function PlaygroundPage() {
  return (
    <main>
      <AppShell />
    </main>
  );
}
