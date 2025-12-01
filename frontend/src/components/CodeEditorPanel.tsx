import React, { useRef, useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useDispatch, useSelector } from 'react-redux';
import { setCode, setLanguage, clearSuggestions } from '../store/editorSlice';
import type { RootState, AppDispatch } from '../store';
import { getMonacoLanguage, getFileExtension } from '../utils/languageMapping';
import { AutocompleteSuggestions } from './AutocompleteSuggestions';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAutocomplete } from '../hooks/useAutocomplete';

export const CodeEditorPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { code, roomId, language, suggestions } = useSelector((state: RootState) => state.editor);
  
  const [cursorPosition, setCursorPosition] = useState(0);
  const editorRef = useRef<any>(null);
  const isRemoteChangeRef = useRef(false);

  const { sendCodeUpdate } = useWebSocket(roomId, isRemoteChangeRef);
  const { triggerAutocomplete, cleanup } = useAutocomplete(language);

  React.useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true
    });

    editor.onDidChangeCursorPosition((e: any) => {
      const position = editor.getModel()?.getOffsetAt(e.position);
      if (position !== undefined) {
        setCursorPosition(position);
      }
    });
  };

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value === undefined) return;
    
    if (isRemoteChangeRef.current) {
      isRemoteChangeRef.current = false;
      return;
    }
    
    dispatch(setCode(value));
    sendCodeUpdate(value);
    triggerAutocomplete(value, cursorPosition);
  }, [dispatch, sendCodeUpdate, triggerAutocomplete, cursorPosition]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage(e.target.value));
  };

  const applySuggestion = useCallback((suggestion: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const position = editor.getPosition();
      
      const range = {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      };
      
      editor.executeEdits('', [{
        range: range,
        text: suggestion
      }]);
      
      editor.focus();
    }
    
    dispatch(clearSuggestions());
  }, [dispatch]);

  if (!roomId) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl">
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-purple-500/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-4 text-sm text-gray-400">
            main.{getFileExtension(language)}
          </span>
        </div>
        
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-gray-700 text-sm px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
        </select>
      </div>
      
      <div className="relative">
        <Editor
          height="600px"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            padding: { top: 16, bottom: 16 }
          }}
        />
        
        <AutocompleteSuggestions
          suggestions={suggestions}
          onApplySuggestion={applySuggestion}
        />
      </div>
    </div>
  );
};