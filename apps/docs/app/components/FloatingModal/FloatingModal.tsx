"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './FloatingModal.module.css';

export type DockState = 'none' | 'left' | 'right';

export interface FloatingModalProps {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  maxHeight?: number | string;
  position?: { x: number; y: number };
  onPositionChange?: (pos: { x: number; y: number }, isManual: boolean) => void;
  onDockChange?: (docked: DockState) => void;
  onCollapseChange?: (collapsed: boolean) => void;
  onHeightChange?: (height: number) => void;
  onClose?: () => void;
  defaultPosition?: { x: number; y: number } | (() => { x: number; y: number });
  defaultDocked?: 'none' | 'left' | 'right';
  noPadding?: boolean;
}

export default function FloatingModal({ 
  id, 
  title, 
  icon, 
  badge,
  children, 
  width,
  height,
  maxHeight,
  position: controlledPosition,
  onPositionChange,
  onDockChange,
  onCollapseChange,
  onHeightChange,
  onClose,
  defaultPosition, 
  defaultDocked = 'none',
  noPadding = false,
}: FloatingModalProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [docked, setDocked] = useState<DockState>(defaultDocked);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [snapPreview, setSnapPreview] = useState<'none' | 'left' | 'right'>('none');
  
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const snapThreshold = 80;

  const [mounted, setMounted] = useState(false);
  
  // Initialize state on mount
  useEffect(() => {
    let initialPos = { x: 100, y: 100 };
    if (controlledPosition) {
      initialPos = controlledPosition;
    } else if (typeof defaultPosition === 'function') {
      initialPos = defaultPosition();
    } else if (defaultPosition) {
      initialPos = defaultPosition;
    }

    if (id) {
      const stored = localStorage.getItem(`modal-${id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (!controlledPosition && parsed.isManual && parsed.position) {
            initialPos = parsed.position;
          }
          if (parsed.docked) setDocked(parsed.docked);
          if (parsed.isCollapsed !== undefined) setIsCollapsed(parsed.isCollapsed);
        } catch (e) {}
      }
    }
    
    setPosition(initialPos);
    setMounted(true);
  }, [id]);

  // Synchronize with parent-controlled position when not dragging
  useEffect(() => {
    if (controlledPosition && !isDragging) {
      setPosition(controlledPosition);
    }
  }, [controlledPosition?.x, controlledPosition?.y, isDragging]);

  // Measure rendered DOM height and inform parent
  useEffect(() => {
    if (!modalRef.current || !onHeightChange) return;
    const updateHeight = () => {
      if (modalRef.current) {
        const h = modalRef.current.offsetHeight;
        if (h > 0) onHeightChange(h);
      }
    };
    updateHeight();
    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(modalRef.current);
    return () => observer.disconnect();
  }, [onHeightChange, isCollapsed, docked, mounted]);

  // Reset handler
  useEffect(() => {
    const handleReset = () => {
      if (id) localStorage.removeItem(`modal-${id}`);
      let initialPos = { x: 100, y: 100 };
      if (controlledPosition) initialPos = controlledPosition;
      else if (typeof defaultPosition === 'function') initialPos = defaultPosition();
      else if (defaultPosition) initialPos = defaultPosition;
      setPosition(initialPos);
      setDocked(defaultDocked);
      setIsCollapsed(false);
    };
    window.addEventListener('resetModals', handleReset);
    return () => window.removeEventListener('resetModals', handleReset);
  }, [id, controlledPosition, defaultPosition, defaultDocked]);

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
    let finalPos = position;
    if (dragRef.current) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      finalPos = {
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy,
      };
      setPosition(finalPos);
    }
    dragRef.current = null;

    const newDocked = snapPreview !== 'none' ? snapPreview : 'none';
    if (snapPreview !== 'none') {
      setDocked(snapPreview);
      onDockChange?.(snapPreview);
    }
    setSnapPreview('none');

    // Requirement 4: Save manual position to localStorage
    if (id) {
      localStorage.setItem(`modal-${id}`, JSON.stringify({
        position: finalPos,
        docked: newDocked,
        isCollapsed,
        isManual: true,
      }));
    }
    onPositionChange?.(finalPos, true);
  };

  const undock = () => {
    let newX = position.x;
    if (docked === 'left') {
      newX = 24;
    } else if (docked === 'right') {
      const width = 320;
      newX = window.innerWidth - width - 24;
    }
    const newPos = { ...position, x: newX };
    setPosition(newPos);
    setDocked('none');
    onDockChange?.('none');
    if (id) {
      localStorage.setItem(`modal-${id}`, JSON.stringify({
        position: newPos,
        docked: 'none',
        isCollapsed,
        isManual: true,
      }));
    }
    onPositionChange?.(newPos, true);
  };

  const handleToggleCollapse = () => {
    const nextCollapsed = !isCollapsed;
    setIsCollapsed(nextCollapsed);
    onCollapseChange?.(nextCollapsed);
    if (id) {
      localStorage.setItem(`modal-${id}`, JSON.stringify({
        position,
        docked,
        isCollapsed: nextCollapsed,
        isManual: true,
      }));
    }
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
        <svg className={styles.dockIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {docked === 'left' ? <polyline points="9 18 15 12 9 6"></polyline> : <polyline points="15 18 9 12 15 6"></polyline>}
        </svg>
        <span className={styles.dockTitle}>{title}</span>
      </button>
    );
  }

  return (
    <>
      {snapPreview !== 'none' && (
        <div 
          className={`${styles.snapPreview} ${styles[`snapPreview-${snapPreview}`]}`}
          style={{ '--shine-y': `${position.y + 150}px` } as React.CSSProperties}
        />
      )}
      <div 
        id={id}
        ref={modalRef}
        className={`${styles.modal} glass ${isDragging ? styles.dragging : ''}`}
        style={{ 
          left: position.x, 
          top: position.y, 
          width: width ?? undefined,
          height: isCollapsed ? undefined : (typeof height === 'number' ? `${height}px` : (height ?? undefined)),
          maxHeight: isCollapsed ? undefined : (typeof maxHeight === 'number' ? `${maxHeight}px` : (maxHeight ?? `calc(100vh - ${Math.max(0, position.y)}px - 24px)`)),
        }}
      >
      <div 
        className={`${styles.header} ${isCollapsed ? styles.headerCollapsed : ''}`} 
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className={styles.titleWrapper}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <h3 className={styles.title}>{title}</h3>
          {badge && <span className={styles.badge}>{badge}</span>}
        </div>
        <div className={styles.actions}>
           <button onClick={handleToggleCollapse} className={styles.iconBtn} title={isCollapsed ? "Expand" : "Collapse"}>
             <svg className={`${styles.chevron} ${isCollapsed ? styles.chevronClosed : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
             </svg>
           </button>
           {onClose && (
             <button onClick={onClose} className={styles.iconBtn} title="Close" aria-label="Close">
               <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <line x1="18" y1="6" x2="6" y2="18"></line>
                 <line x1="6" y1="6" x2="18" y2="18"></line>
               </svg>
             </button>
           )}
        </div>
      </div>
      
      {!isCollapsed && (
        <div className={`${styles.content} ${noPadding ? styles.noPadding : ''}`}>
          {children}
        </div>
      )}
    </div>
    </>
  );
}
