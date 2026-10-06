"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './FloatingModal.module.css';

interface FloatingModalProps {
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number, y: number };
  defaultDocked?: 'none' | 'left' | 'right';
}

type DockState = 'none' | 'left' | 'right';

export default function FloatingModal({ title, children, defaultPosition = { x: 100, y: 100 }, defaultDocked = 'none' }: FloatingModalProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [docked, setDocked] = useState<DockState>(defaultDocked);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [snapPreview, setSnapPreview] = useState<'none' | 'left' | 'right'>('none');
  
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const snapThreshold = 80;

  // Prevent hydration mismatch for defaultDocked state
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || docked !== 'none') return;
    if ((e.target as HTMLElement).closest('button')) return;
    
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragRef.current) return;
    
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    
    const newX = dragRef.current.initialX + dx;
    const newY = dragRef.current.initialY + dy;
    
    setPosition({ x: newX, y: newY });

    const width = modalRef.current?.offsetWidth || 320;
    if (newX < snapThreshold) {
      setSnapPreview('left');
    } else if (window.innerWidth - (newX + width) < snapThreshold) {
      setSnapPreview('right');
    } else {
      setSnapPreview('none');
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    dragRef.current = null;

    if (snapPreview !== 'none') {
      setDocked(snapPreview);
    }
    setSnapPreview('none');
  };

  const undock = () => {
    if (docked === 'left') {
      setPosition((prev) => ({ ...prev, x: 20 }));
    } else if (docked === 'right') {
      // modalRef is not rendered, so offsetWidth is not available. Default to CSS width 320px.
      const width = 320;
      setPosition((prev) => ({ ...prev, x: window.innerWidth - width - 20 }));
    }
    setDocked('none');
  };

  if (!mounted) return null;

  if (docked !== 'none') {
    return (
      <button 
        className={`${styles.dockTab} ${styles[docked]}`} 
        onClick={undock}
        style={{ top: Math.max(80, position.y) }}
        title="Restore Modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {docked === 'left' ? <polyline points="9 18 15 12 9 6"></polyline> : <polyline points="15 18 9 12 15 6"></polyline>}
        </svg>
      </button>
    );
  }

  return (
    <>
      {snapPreview !== 'none' && (
        <div className={`${styles.snapPreview} ${styles[`snapPreview-${snapPreview}`]}`} />
      )}
      <div 
        ref={modalRef}
        className={`${styles.modal} glass ${isDragging ? styles.dragging : ''}`}
        style={{ left: position.x, top: position.y }}
      >
      <div 
        className={styles.header} 
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.actions}>
           <button onClick={() => setIsCollapsed(!isCollapsed)} className={styles.iconBtn}>
             <svg className={`${styles.chevron} ${isCollapsed ? styles.chevronClosed : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
             </svg>
           </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
    </>
  );
}
