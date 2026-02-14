'use client';

/**
 * Editor Menu Bar Component
 * Toolbar with all formatting options for the rich text editor
 */

import { Editor } from '@tiptap/react';
import { useCallback, useState } from 'react';

interface EditorMenuBarProps {
  editor: Editor;
}

export default function EditorMenuBar({ editor }: EditorMenuBarProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const colors = [
    '#000000', '#374151', '#DC2626', '#EA580C', '#D97706', 
    '#65A30D', '#16A34A', '#0891B2', '#2563EB', '#7C3AED', 
    '#C026D3', '#DB2777'
  ];

  const setLink = useCallback(() => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  }, [editor, linkUrl]);

  const Button = ({ onClick, active, disabled, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? 'bg-gray-300 dark:bg-gray-600' : ''
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 flex flex-wrap gap-1">
      {/* Text Formatting */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-gray-700 pr-2">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <s>S</s>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Inline Code"
        >
          <code className="text-xs">&lt;/&gt;</code>
        </Button>
      </div>

      {/* Headings */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-gray-700 pr-2">
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <Button
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level: level as any }).run()}
            active={editor.isActive('heading', { level })}
            title={`Heading ${level}`}
          >
            <span className="text-xs font-semibold">H{level}</span>
          </Button>
        ))}
      </div>

      {/* Lists */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-gray-700 pr-2">
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <span className="text-lg">•</span>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <span className="text-xs font-semibold">1.</span>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          active={editor.isActive('taskList')}
          title="Checklist"
        >
          <span className="text-lg">☑</span>
        </Button>
      </div>

      {/* Alignment */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-gray-700 pr-2">
        <Button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <span className="text-xs">⬅</span>
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <span className="text-xs">↔</span>
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <span className="text-xs">➡</span>
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          active={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
        >
          <span className="text-xs">⬌</span>
        </Button>
      </div>

      {/* Colors */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-gray-700 pr-2 relative">
        <Button
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Text Color"
        >
          <span className="text-sm">A</span>
        </Button>
        <Button
          onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          title="Highlight"
        >
          <span className="text-sm bg-yellow-300">H</span>
        </Button>
        
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-2 grid grid-cols-6 gap-1 z-10 shadow-lg">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  editor.chain().focus().setColor(color).run();
                  setShowColorPicker(false);
                }}
                className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
        
        {showHighlightPicker && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-2 grid grid-cols-6 gap-1 z-10 shadow-lg">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHighlight({ color }).run();
                  setShowHighlightPicker(false);
                }}
                className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>

      {/* Link */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-gray-700 pr-2 relative">
        <Button
          onClick={() => setShowLinkInput(!showLinkInput)}
          active={editor.isActive('link')}
          title="Insert Link"
        >
          <span className="text-xs">🔗</span>
        </Button>
        {editor.isActive('link') && (
          <Button
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remove Link"
          >
            <span className="text-xs">⛔</span>
          </Button>
        )}
        
        {showLinkInput && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-2 z-10 shadow-lg flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-900"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setLink();
                }
              }}
            />
            <button
              type="button"
              onClick={setLink}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Set
            </button>
          </div>
        )}
      </div>

      {/* Block Elements */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-gray-700 pr-2">
        <Button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <span className="text-xs font-mono">{'{ }'}</span>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <span className="text-sm">"</span>
        </Button>
        <Button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <span className="text-xs">―</span>
        </Button>
      </div>

      {/* Table */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-gray-700 pr-2">
        <Button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Insert Table"
        >
          <span className="text-xs">⊞</span>
        </Button>
        {editor.isActive('table') && (
          <>
            <Button
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="Delete Table"
            >
              <span className="text-xs">⊠</span>
            </Button>
          </>
        )}
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-1">
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <span className="text-sm">↶</span>
        </Button>
        <Button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Shift+Z)"
        >
          <span className="text-sm">↷</span>
        </Button>
      </div>
    </div>
  );
}
