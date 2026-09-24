import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Bold, Italic, Heading2, Heading3, List, Link as LinkIcon, Quote } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  rows?: number;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  label,
  rows = 10,
  placeholder = 'Write content in Markdown...'
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertSnippet = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('md-textarea') as HTMLTextAreaElement | null;
    if (!textarea) {
      onChange(value + prefix + suffix);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || 'text';
    const nextVal = value.substring(0, start) + prefix + selected + suffix + value.substring(end);
    onChange(nextVal);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <label className="block text-sm font-medium text-[#211C0D]">{label}</label>}
        <div className="flex rounded-md bg-[#FAF7F0] p-1 border border-[#E4DCC8]">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === 'write' ? 'bg-[#FFFFFF] text-[#211C0D] shadow-xs' : 'text-[#6B6350]'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === 'preview' ? 'bg-[#FFFFFF] text-[#211C0D] shadow-xs' : 'text-[#6B6350]'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {activeTab === 'write' ? (
        <div className="border border-[#E4DCC8] rounded-lg overflow-hidden bg-[#FFFFFF] focus-within:ring-2 focus-within:ring-[#2C5745]/30">
          <div className="flex items-center gap-1 p-1.5 border-b border-[#E4DCC8] bg-[#FAF7F0]/60">
            <button
              type="button"
              onClick={() => insertSnippet('**', '**')}
              className="p-1.5 text-[#6B6350] hover:text-[#211C0D] hover:bg-[#E4DCC8]/40 rounded"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('*', '*')}
              className="p-1.5 text-[#6B6350] hover:text-[#211C0D] hover:bg-[#E4DCC8]/40 rounded"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('## ')}
              className="p-1.5 text-[#6B6350] hover:text-[#211C0D] hover:bg-[#E4DCC8]/40 rounded"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('### ')}
              className="p-1.5 text-[#6B6350] hover:text-[#211C0D] hover:bg-[#E4DCC8]/40 rounded"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('- ')}
              className="p-1.5 text-[#6B6350] hover:text-[#211C0D] hover:bg-[#E4DCC8]/40 rounded"
              title="Bulleted List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('> ')}
              className="p-1.5 text-[#6B6350] hover:text-[#211C0D] hover:bg-[#E4DCC8]/40 rounded"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('[', '](https://)')}
              className="p-1.5 text-[#6B6350] hover:text-[#211C0D] hover:bg-[#E4DCC8]/40 rounded"
              title="Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>
          <textarea
            id="md-textarea"
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 font-mono text-sm text-[#211C0D] focus:outline-none resize-y"
          />
        </div>
      ) : (
        <div className="border border-[#E4DCC8] rounded-lg p-4 bg-[#FFFFFF] min-h-[200px] prose prose-stone max-w-none text-[#3D3319]">
          {value.trim() ? (
            <div className="markdown-body">
              <Markdown>{value}</Markdown>
            </div>
          ) : (
            <p className="text-sm italic text-[#9C8B5E]">No content to preview.</p>
          )}
        </div>
      )}
    </div>
  );
};
