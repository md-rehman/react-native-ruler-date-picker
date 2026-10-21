"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { DeviceType } from '../DeviceSelector/DeviceSelector';
import DeviceMockup from '../DeviceMockup/DeviceMockup';
import styles from './CentralView.module.css';

const ComponentPreview: any = dynamic(
  () => import('../ComponentPreview/ComponentPreview'),
  { ssr: false }
);

interface CentralViewProps {
  activeDevice: DeviceType;
  pickerProps: Record<string, any>;
  updateProp: (name: string, value: any) => void;
}

const MIN_ZOOM = 0.25; // 25%
const MAX_ZOOM = 3.0;  // 300%

export default function CentralView({
  activeDevice,
  pickerProps,
  updateProp,
}: CentralViewProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const zoomRef = useRef<number>(zoom);
  const panRef = useRef<{ x: number; y: number }>(pan);
  const spacePressedRef = useRef<boolean>(false);
  const lastTrackpadTimeRef = useRef<number>(0);

  // Keep refs in sync with state for native wheel event listener
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  useEffect(() => {
    spacePressedRef.current = isSpacePressed;
  }, [isSpacePressed]);

  // Reset view to 100% scale and center
  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Step zoom in/out centered on viewport
  const handleZoomStep = useCallback((factor: number) => {
    setZoom((prevZoom) => {
      const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((prevZoom * factor).toFixed(2))));
      const ratio = nextZoom / prevZoom;
      setPan((p) => ({
        x: Math.round(p.x * ratio),
        y: Math.round(p.y * ratio),
      }));
      return nextZoom;
    });
  }, []);

  // Native wheel event listener to support preventDefault() and Figma gesture handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept if wheel occurred inside any floating modal
      if ((e.target as HTMLElement)?.closest('[data-modal="true"]')) return;

      const targetEl = e.target as HTMLElement | null;
      const isInsideScreen = !!targetEl?.closest(`[class*="screen"]`);

      // If user is inside the interactive screen and not holding Space/Ctrl/Meta,
      // allow native interaction with ruler component
      if (isInsideScreen && !e.ctrlKey && !e.metaKey && !spacePressedRef.current) {
        return;
      }

      // Prevent native browser scroll and back/forward navigation
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const currentZoom = zoomRef.current;
      const currentPan = panRef.current;

      // Trackpad vs Mouse Wheel Heuristic
      const hasDecimals = e.deltaX % 1 !== 0 || e.deltaY % 1 !== 0;
      const hasHorizontal = Math.abs(e.deltaX) > 0;
      const isSmallDelta = Math.abs(e.deltaY) < 40 && Math.abs(e.deltaY) > 0;

      if (hasDecimals || hasHorizontal || isSmallDelta) {
        lastTrackpadTimeRef.current = Date.now();
      }

      const isLikelyTrackpad =
        Date.now() - lastTrackpadTimeRef.current < 400 ||
        hasDecimals ||
        hasHorizontal ||
        isSmallDelta;

      const isPinchOrCtrl = e.ctrlKey || e.metaKey;

      if (isPinchOrCtrl) {
        // Trackpad Pinch-to-zoom OR Cmd/Ctrl + Scroll: Cursor-centric zoom
        const zoomFactor = Math.exp(-e.deltaY * 0.01);
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom * zoomFactor));

        const scaleRatio = newZoom / currentZoom;
        const newPanX = (mouseX - centerX) * (1 - scaleRatio) + currentPan.x * scaleRatio;
        const newPanY = (mouseY - centerY) * (1 - scaleRatio) + currentPan.y * scaleRatio;

        setZoom(newZoom);
        setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
      } else if (!isLikelyTrackpad) {
        // 1. Mouse Scroll Wheel: Cursor-centric zoom
        const zoomFactor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom * zoomFactor));

        const scaleRatio = newZoom / currentZoom;
        const newPanX = (mouseX - centerX) * (1 - scaleRatio) + currentPan.x * scaleRatio;
        const newPanY = (mouseY - centerY) * (1 - scaleRatio) + currentPan.y * scaleRatio;

        setZoom(newZoom);
        setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
      } else {
        // 3. Trackpad 2-finger scroll: Move canvas (pan)
        setPan({
          x: Math.round(currentPan.x - e.deltaX),
          y: Math.round(currentPan.y - e.deltaY),
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Keyboard shortcuts (Space for hand-drag, Cmd/Ctrl + 0 to reset, Cmd/Ctrl + +/- to zoom)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.getAttribute('contenteditable') === 'true';

      if (!isInput) {
        if (e.code === 'Space' && !e.repeat) {
          setIsSpacePressed(true);
          spacePressedRef.current = true;
        }

        if ((e.metaKey || e.ctrlKey) && e.key === '0') {
          e.preventDefault();
          handleResetView();
        }

        if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
          e.preventDefault();
          handleZoomStep(1.2);
        }

        if ((e.metaKey || e.ctrlKey) && e.key === '-') {
          e.preventDefault();
          handleZoomStep(1 / 1.2);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        spacePressedRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleResetView, handleZoomStep]);

  // 2. Click on background and dragging to move canvas
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only primary (0) or middle (1) mouse button
    if (e.button !== 0 && e.button !== 1) return;

    const targetEl = e.target as HTMLElement | null;
    if (targetEl?.closest(`.${styles.hud}`)) return;

    const isInsideScreen = !!targetEl?.closest(`[class*="screen"]`);
    // If inside active screen and space is not held and not middle click, let component handle interaction
    if (isInsideScreen && !spacePressedRef.current && e.button !== 1) {
      return;
    }

    e.preventDefault();
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !dragStartRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: Math.round(dragStartRef.current.panX + dx),
      y: Math.round(dragStartRef.current.panY + dy),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      setIsDragging(false);
      isDraggingRef.current = false;
      dragStartRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Double click background to reset view
  const handleDoubleClick = (e: React.MouseEvent) => {
    const targetEl = e.target as HTMLElement | null;
    if (targetEl?.closest(`[class*="screen"]`) || targetEl?.closest(`.${styles.hud}`)) {
      return;
    }
    handleResetView();
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.central} ${isDragging ? styles.dragging : ''} ${isSpacePressed ? styles.spaceGrab : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Infinite grid background moving with pan and scaling with zoom */}
      <div
        className={styles.gridBackground}
        style={{
          backgroundPosition: `${pan.x}px ${pan.y}px`,
          backgroundSize: `${Math.max(8, 24 * zoom)}px ${Math.max(8, 24 * zoom)}px`,
        }}
      />

      {/* Canvas viewport and scaled device mockup */}
      <div className={styles.canvasViewport}>
        <div
          className={`${styles.canvasTransform} ${isDragging ? styles.dragging : ''}`}
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <DeviceMockup device={activeDevice}>
            <ComponentPreview props={pickerProps} updateProp={updateProp} />
          </DeviceMockup>
        </div>
      </div>

      {/* Figma Canvas Floating HUD */}
      <div className={styles.hud} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.hudButton}
          onClick={() => handleZoomStep(1 / 1.15)}
          title="Zoom out (⌘-)"
          aria-label="Zoom out"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        <button
          className={`${styles.hudButton} ${styles.hudPercent}`}
          onClick={handleResetView}
          title="Click to reset to 100% (⌘0)"
          aria-label="Reset zoom to 100%"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          className={styles.hudButton}
          onClick={() => handleZoomStep(1.15)}
          title="Zoom in (⌘+)"
          aria-label="Zoom in"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        <div className={styles.hudDivider} />

        <button
          className={styles.hudButton}
          onClick={handleResetView}
          title="Reset canvas center & zoom"
          aria-label="Reset canvas"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
