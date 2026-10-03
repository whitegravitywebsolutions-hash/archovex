'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RemoveFormatting,
  Eye,
  Undo,
  Redo,
} from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write blog content, detailed description, space planning, specs...',
  minHeight = '250px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showHtml, setShowHtml] = useState(false);
  const [htmlSource, setHtmlSource] = useState(value || '');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // Keep internal content synchronized with external prop if different
  useEffect(() => {
    if (editorRef.current && !showHtml) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setHtmlSource(value || '');
  }, [value, showHtml]);

  const handleExecCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const updatedContent = editorRef.current.innerHTML;
      setHtmlSource(updatedContent);
      onChange(updatedContent);
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setHtmlSource(content);
      onChange(content);
    }
  };

  const handleHtmlSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlSource(val);
    onChange(val);
    if (editorRef.current) {
      editorRef.current.innerHTML = val;
    }
  };

  const addLink = () => {
    const url = prompt('Enter URL link (e.g., https://example.com):');
    if (url) {
      handleExecCommand('createLink', url);
    }
  };

  const handleMediaSelect = (urls: string[]) => {
    if (urls.length === 0) return;
    urls.forEach((url) => {
      handleExecCommand('insertImage', url);
    });
  };

  const insertImageUrlPrompt = () => {
    const url = prompt('Enter Image URL:');
    if (url) {
      handleExecCommand('insertImage', url);
    }
  };

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 text-slate-700">
        {/* Undo / Redo */}
        <div className="flex items-center border-r border-slate-200 pr-1.5 mr-1 space-x-0.5">
          <button
            type="button"
            onClick={() => handleExecCommand('undo')}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleExecCommand('redo')}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Text Formatting */}
        <div className="flex items-center border-r border-slate-200 pr-1.5 mr-1 space-x-0.5">
          <button
            type="button"
            onClick={() => handleExecCommand('bold')}
            className="p-1.5 hover:bg-slate-200 rounded-lg font-bold text-slate-700 transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleExecCommand('italic')}
            className="p-1.5 hover:bg-slate-200 rounded-lg italic text-slate-700 transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleExecCommand('underline')}
            className="p-1.5 hover:bg-slate-200 rounded-lg underline text-slate-700 transition-colors"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleExecCommand('strikeThrough')}
            className="p-1.5 hover:bg-slate-200 rounded-lg line-through text-slate-700 transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center border-r border-slate-200 pr-1.5 mr-1 space-x-0.5">
          <button
            type="button"
            onClick={() => handleExecCommand('formatBlock', '<h2>')}
            className="p-1.5 hover:bg-slate-200 rounded-lg font-extrabold text-slate-700 transition-colors text-xs flex items-center gap-1"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" /> H2
          </button>
          <button
            type="button"
            onClick={() => handleExecCommand('formatBlock', '<h3>')}
            className="p-1.5 hover:bg-slate-200 rounded-lg font-bold text-slate-700 transition-colors text-xs flex items-center gap-1"
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" /> H3
          </button>
          <button
            type="button"
            onClick={() => handleExecCommand('formatBlock', '<p>')}
            className="px-2 py-1 hover:bg-slate-200 rounded-lg text-[11px] font-semibold text-slate-600 transition-colors"
            title="Paragraph"
          >
            Paragraph
          </button>
        </div>

        {/* Lists & Alignment */}
        <div className="flex items-center border-r border-slate-200 pr-1.5 mr-1 space-x-0.5">
          <button
            type="button"
            onClick={() => handleExecCommand('insertUnorderedList')}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleExecCommand('insertOrderedList')}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleExecCommand('formatBlock', '<blockquote>')}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center border-r border-slate-200 pr-1.5 mr-1 space-x-0.5">
          <button
            type="button"
            onClick={() => handleExecCommand('justifyLeft')}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleExecCommand('justifyCenter')}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleExecCommand('justifyRight')}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Media & Links */}
        <div className="flex items-center border-r border-slate-200 pr-1.5 mr-1 space-x-0.5">
          <button
            type="button"
            onClick={addLink}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsMediaModalOpen(true)}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-blue-600 font-semibold transition-colors flex items-center gap-1 text-xs"
            title="Insert Image from Media Library"
          >
            <ImageIcon className="w-4 h-4" /> Image
          </button>
        </div>

        {/* Clear Formatting & HTML Source Toggle */}
        <div className="flex items-center ml-auto gap-1">
          <button
            type="button"
            onClick={() => handleExecCommand('removeFormat')}
            className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors mr-1"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>

          <div className="bg-slate-200 p-0.5 rounded-lg flex items-center gap-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => {
                if (showHtml) {
                  setShowHtml(false);
                  setTimeout(() => {
                    if (editorRef.current) {
                      editorRef.current.innerHTML = htmlSource;
                    }
                  }, 0);
                }
              }}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                !showHtml ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Visual Editor</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!showHtml) {
                  if (editorRef.current) {
                    setHtmlSource(editorRef.current.innerHTML);
                  }
                  setShowHtml(true);
                }
              }}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                showHtml ? 'bg-slate-900 text-emerald-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HTML Source</span>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      {showHtml ? (
        <textarea
          value={htmlSource}
          onChange={handleHtmlSourceChange}
          style={{ minHeight }}
          className="w-full p-4 font-mono text-xs text-emerald-300 bg-slate-950 focus:outline-none resize-y leading-relaxed border-t border-slate-800 selection:bg-blue-600 selection:text-white"
          placeholder="<h1>Write HTML here...</h1>"
          spellCheck={false}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleEditorInput}
          style={{ minHeight }}
          className="p-4 text-xs text-slate-900 focus:outline-none prose max-w-none prose-slate prose-sm leading-relaxed overflow-y-auto"
          data-placeholder={placeholder}
        />
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
        allowMultiple={true}
      />
    </div>
  );
}
