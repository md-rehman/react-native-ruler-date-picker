"use client";

import React, { useState, useRef } from 'react';
import styles from './FloatingModal.module.css';
import { PropDefinition } from '../../../data/propDefinitions';
import PropControl from '../PropControl/PropControl';

interface FloatingModalProps {
  title: string;
  propsList: PropDefinition[];
  pickerProps: Record<string, any>;
  updateProp: (name: string, value: any) => void;
  defaultPosition?: { x: number, y: number };
}

type DockState = 'none' | 'left' | 'right';

export default function FloatingModal({ title, propsList, pickerProps, updateProp, defaultPosition = { x: 100, y: 100 } }: FloatingModalProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [docked, setDocked] = useState<DockState>('none');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag on left click
    if (e.button !== 0 || docked !== 'none') return;
    
    // Ignore clicks on buttons inside the header
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
    
    setPosition({
      x: dragRef.current.initialX + dx,
      y: dragRef.current.initialY + dy
    });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    dragRef.current = null;

    // Check for snapping to edges
    const rect = modalRef.current?.getBoundingClientRect();
    if (rect) {
      const snapThreshold = 80;
      if (rect.left < snapThreshold) {
        setDocked('left');
      } else if (window.innerWidth - rect.right < snapThreshold) {
        setDocked('right');
      }
    }
  };

  const undock = () => {
    if (docked === 'left') {
      setPosition((prev) => ({ ...prev, x: 20 }));
    } else if (docked === 'right') {
      const width = modalRef.current?.offsetWidth || 300;
      setPosition((prev) => ({ ...prev, x: window.innerWidth - width - 20 }));
    }
    setDocked('none');
  };

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
          <div className={styles.propsList}>
            {propsList.map(prop => (
              <PropControl
                key={prop.name}
                definition={prop}
                value={pickerProps[prop.name]}
                onChange={(val) => updateProp(prop.name, val)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
