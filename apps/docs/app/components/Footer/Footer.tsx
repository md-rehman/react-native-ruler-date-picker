import React from 'react';
import Link from 'next/link';
import Logo from '../Logo/Logo';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.brandCol}>
            <div className={styles.brandName}>
              <Logo size={24} />
              <span>react-native-ruler-date-picker</span>
            </div>
            <p className={styles.brandDesc}>
              A performant, customizable horizontal ruler date picker & scroll wheel for React Native and Expo. Powered by 60 FPS Reanimated 3 physics and dual-speed haptic feedback.
            </p>
          </div>

          <div className={styles.linksCol}>
            <div className={styles.linkGroup}>
              <span className={styles.linkTitle}>Product</span>
              <Link href="/playground" className={styles.link}>Playground</Link>
              <Link href="/docs" className={styles.link}>Documentation</Link>
              <a href="https://github.com/md-rehman/react-native-ruler-date-picker/releases" target="_blank" rel="noopener noreferrer" className={styles.link}>Releases</a>
            </div>

            <div className={styles.linkGroup}>
              <span className={styles.linkTitle}>Ecosystem</span>
              <a href="https://github.com/md-rehman/react-native-ruler-date-picker" target="_blank" rel="noopener noreferrer" className={styles.link}>GitHub</a>
              <a href="https://www.npmjs.com/package/react-native-ruler-date-picker" target="_blank" rel="noopener noreferrer" className={styles.link}>npm Registry</a>
              <a href="https://reactnative.dev" target="_blank" rel="noopener noreferrer" className={styles.link}>React Native</a>
              <a href="https://expo.dev" target="_blank" rel="noopener noreferrer" className={styles.link}>Expo</a>
            </div>

            <div className={styles.linkGroup}>
              <span className={styles.linkTitle}>Community</span>
              <a href="https://github.com/md-rehman/react-native-ruler-date-picker/issues" target="_blank" rel="noopener noreferrer" className={styles.link}>Report Issue</a>
              <a href="https://github.com/md-rehman/react-native-ruler-date-picker/discussions" target="_blank" rel="noopener noreferrer" className={styles.link}>Discussions</a>
              <a href="https://md-rehman.dev" target="_blank" rel="noopener noreferrer" className={styles.link}>Author (md-rehman)</a>
            </div>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.license}>
            MIT Licensed © {new Date().getFullYear()} Rehman. Free and open source.
          </div>
          <div>
            Built with React Native, Reanimated 3 & Next.js
          </div>
        </div>
      </div>
    </footer>
  );
}
