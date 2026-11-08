"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { OnMount } from '@monaco-editor/react';
import styles from './LiveCodeEditor.module.css';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontSize: '0.85rem' }}>
      Loading Live Code Editor...
    </div>
  ),
});

export interface LiveCodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  error?: { message: string; line?: number; column?: number } | null;
  mode: 'full' | 'jsx';
  onModeChange: (mode: 'full' | 'jsx') => void;
  onReset?: () => void;
  onClose?: () => void;
  title?: string;
  embedded?: boolean;
}

export default function LiveCodeEditor({
  code,
  onChange,
  error,
  mode,
  onModeChange,
  onReset,
  onClose,
  title = 'Live Code Editor',
  embedded = false,
}: LiveCodeEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);

  const configureMonaco = useCallback((monaco: any) => {
    if (!monaco?.languages?.typescript) return;

    // Disable all TypeScript and JavaScript semantic, syntax, and suggestion diagnostics
    // (removes all false-positive red squiggly underlines for missing node_modules like 'react-native' or missing types)
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });

    // Configure compiler options with JSX support
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTextFiles: true,
      allowJs: true,
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
    });

    // Define custom dark theme
    monaco.editor.defineTheme('rulerDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: '38bdf8' },
        { token: 'identifier', foreground: 'f8fafc' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'tag', foreground: '60a5fa' },
        { token: 'attribute.name', foreground: 'a78bfa' },
      ],
      colors: {
        'editor.background': '#0b0f19',
        'editor.foreground': '#f8fafc',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#38bdf8',
        'editor.selectionBackground': '#1e293b',
        'editor.inactiveSelectionBackground': '#1e293b80',
        'editorCursor.foreground': '#38bdf8',
      },
    });
  }, []);

  const handleBeforeMount = useCallback((monaco: any) => {
    configureMonaco(monaco);
  }, [configureMonaco]);

  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    configureMonaco(monaco);
    monaco.editor.setTheme('rulerDark');

    // Clear any existing markers on model
    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelMarkers(model, 'typescript', []);
      monaco.editor.setModelMarkers(model, 'javascript', []);
    }
  }, [configureMonaco]);

  // Sync actual syntax error from our Babel parser to Monaco model markers
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        if (error && error.line) {
          monacoRef.current.editor.setModelMarkers(model, 'syntax', [
            {
              startLineNumber: error.line,
              startColumn: error.column || 1,
              endLineNumber: error.line,
              endColumn: (error.column || 1) + 20,
              message: error.message,
              severity: monacoRef.current.MarkerSeverity.Error,
            },
          ]);
        } else {
          monacoRef.current.editor.setModelMarkers(model, 'syntax', []);
        }
      }
    }
  }, [error]);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  return (
    <div className={`${styles.editorContainer} ${embedded ? styles.embedded : ''}`}>
      {/* Top Header & Actions */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          {!embedded ? (
            <>
              <span className={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </span>
              <h3 className={styles.title}>{title}</h3>
            </>
          ) : null}
          <span className={styles.liveBadge} title="Changes sync live with the preview">
            <span className={styles.liveDot} />
            Live
          </span>
        </div>

        <div className={styles.actions}>
          {/* Mode Switch: Component vs JSX Only */}
          <div className={styles.modeToggle}>
            <button
              type="button"
              className={`${styles.modeBtn} ${mode === 'full' ? styles.modeBtnActive : ''}`}
              onClick={() => onModeChange('full')}
              title="Full Component with imports and state"
            >
              Component
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${mode === 'jsx' ? styles.modeBtnActive : ''}`}
              onClick={() => onModeChange('jsx')}
              title="JSX Only"
            >
              JSX Only
            </button>
          </div>

          {/* Format Document Button */}
          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleFormat}
            title="Format Code"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="21" y1="10" x2="7" y2="10"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="14" x2="3" y2="14"></line>
              <line x1="21" y1="18" x2="7" y2="18"></line>
            </svg>
            <span>Format</span>
          </button>

          {/* Reset to Default Button */}
          {onReset && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={onReset}
              title="Reset Code to Current Preset"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              <span>Reset</span>
            </button>
          )}

          {/* Copy Button */}
          <button
            type="button"
            className={`${styles.actionBtn} ${copied ? styles.actionBtnCopied : ''}`}
            onClick={handleCopy}
            title="Copy Code to Clipboard"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Close Button (if dockable/modal) */}
          {onClose && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={onClose}
              title="Close Live Editor"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className={styles.editorWrapper}>
        <Editor
          height="100%"
          language="typescript"
          path={mode === 'jsx' ? 'snippet.tsx' : 'Component.tsx'}
          theme="rulerDark"
          value={code}
          beforeMount={handleBeforeMount}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Footer Status Bar */}
      <div className={styles.footer}>
        {error ? (
          <div className={styles.statusError}>
            <span className={styles.errorDot} />
            <span>
              Syntax Error{error.line ? ` [line ${error.line}${error.column ? `, col ${error.column}` : ''}]` : ''}: {error.message}
            </span>
          </div>
        ) : (
          <div className={styles.statusNormal}>
            <span className={styles.liveDot} />
            <span>Live sync active • changes update device preview instantly</span>
          </div>
        )}
        <span className={styles.hint}>TypeScript / JSX</span>
      </div>
    </div>
  );
}
