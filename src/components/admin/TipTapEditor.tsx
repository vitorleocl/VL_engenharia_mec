import React, { useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';

import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Table as TableIcon,
  Plus,
  Trash2,
  Image as ImageIcon,
  Highlighter,
  Palette,
  Undo,
  Redo,
  Split,
  Combine,
  Rows,
  Columns
} from 'lucide-react';

interface TipTapEditorProps {
  contentHtml?: string;
  contentJson?: any;
  onChange?: (html: string, json: any) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const COLOR_OPTIONS = [
  { label: 'Padrão (Escuro)', color: '#0F172A' },
  { label: 'Azul VL Engenharia', color: '#1565D8' },
  { label: 'Azul Marinho Corporativo', color: '#0B1E3D' },
  { label: 'Vermelho Crítico', color: '#DC2626' },
  { label: 'Âmbar Alerta', color: '#D97706' },
  { label: 'Verde Conforme', color: '#16A34A' },
  { label: 'Cinza Técnico', color: '#64748B' },
];

const HIGHLIGHT_OPTIONS = [
  { label: 'Amarelo Alerta', color: '#FEF08A' },
  { label: 'Verde Sucesso', color: '#BBF7D0' },
  { label: 'Vermelho Reprovado', color: '#FECACA' },
  { label: 'Azul Neutro', color: '#BFDBFE' },
  { label: 'Cinza Destaque', color: '#E2E8F0' },
];

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  contentHtml = '',
  contentJson,
  onChange,
  placeholder = 'Digite o parecer ou especificações técnicas aqui...',
  readOnly = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table border-collapse border border-slate-300 w-full my-3',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 p-2 text-xs text-slate-700 align-top',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg border border-slate-200 shadow-xs max-h-[360px] object-contain my-3 mx-auto block',
        },
      }),
    ],
    content: contentJson || contentHtml || '<p></p>',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML(), editor.getJSON());
      }
    },
  });

  // Handle local image upload via file input
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        editor.chain().focus().setImage({ src: base64Url, alt: file.name }).run();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePromptImageUrl = useCallback(() => {
    if (!editor) return;
    const url = prompt('Insira a URL da imagem técnica:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 animate-pulse">
        Carregando editor de texto rico...
      </div>
    );
  }

  return (
    <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
      {/* Hidden file input for direct image upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* WYSIWYG Toolbar */}
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
          
          {/* Text Style Group */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
              title="Negrito (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
              title="Itálico (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive('underline') ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
              title="Sublinhado (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Headings Group */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
              title="Título Principal (H1)"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
              title="Subtítulo Técnico (H2)"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
              title="Item / Seção Menor (H3)"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* Lists Group */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
              title="Lista com Marcadores"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
              title="Lista Numerada"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment Group */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
              title="Alinhar à Esquerda"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
              title="Centralizar"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
              title="Alinhar à Direita"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
              title="Justificar Texto"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* Color & Highlight Pickers */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span title="Cor da Fonte">
              <Palette className="w-3.5 h-3.5 text-slate-500" />
            </span>
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  editor.chain().focus().setColor(val).run();
                } else {
                  editor.chain().focus().unsetColor().run();
                }
              }}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              title="Cor do Texto"
              defaultValue="#0F172A"
            >
              {COLOR_OPTIONS.map((c) => (
                <option key={c.color} value={c.color}>
                  {c.label}
                </option>
              ))}
            </select>

            <span className="text-slate-300 dark:text-slate-600">|</span>

            <span title="Realce / Marca-texto">
              <Highlighter className="w-3.5 h-3.5 text-amber-500" />
            </span>
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'none') {
                  editor.chain().focus().unsetHighlight().run();
                } else {
                  editor.chain().focus().toggleHighlight({ color: val }).run();
                }
              }}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              title="Cor de Fundo / Realce"
              defaultValue="none"
            >
              <option value="none">Sem Realce</option>
              {HIGHLIGHT_OPTIONS.map((h) => (
                <option key={h.color} value={h.color}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>

          {/* Table Operations Group */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-700 font-bold flex items-center gap-1 text-xs"
              title="Inserir Tabela (3x3)"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px]">Tabela</span>
            </button>

            {editor.isActive('table') && (
              <>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-slate-600 font-semibold"
                  title="Adicionar Linha Abaixo"
                >
                  <Rows className="w-3.5 h-3.5 text-emerald-600 inline mr-0.5" />+Linha
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-red-600 font-semibold"
                  title="Remover Linha Atual"
                >
                  -Linha
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-slate-600 font-semibold"
                  title="Adicionar Coluna à Direita"
                >
                  <Columns className="w-3.5 h-3.5 text-emerald-600 inline mr-0.5" />+Coluna
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-red-600 font-semibold"
                  title="Remover Coluna Atual"
                >
                  -Coluna
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().mergeCells().run()}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-blue-600"
                  title="Mesclar Células Selecionadas"
                >
                  <Combine className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().splitCell().run()}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-blue-600"
                  title="Dividir Célula Mesclada"
                >
                  <Split className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  className="p-1 rounded hover:bg-red-50 text-red-600"
                  title="Excluir Tabela Inteira"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Image Upload Group */}
          <div className="flex items-center gap-1 bg-emerald-50/80 dark:bg-emerald-950/30 p-1 rounded-lg border border-emerald-300 dark:border-emerald-800">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 rounded bg-white dark:bg-slate-900 hover:bg-emerald-100 dark:hover:bg-slate-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
              title="Upload de Imagem Local (Do Computador ou Celular)"
            >
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Inserir Imagem</span>
            </button>
            <button
              type="button"
              onClick={handlePromptImageUrl}
              className="px-1.5 py-1 rounded hover:bg-emerald-100 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold cursor-pointer"
              title="Inserir Imagem por Link / URL da Web"
            >
              Via URL
            </button>
          </div>

          {/* History Undo / Redo */}
          <div className="flex items-center gap-0.5 ml-auto">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
              title="Desfazer (Ctrl+Z)"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
              title="Refazer (Ctrl+Y)"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* Editor Content Area */}
      <div className="p-4 sm:p-6 min-h-[220px] max-h-[600px] overflow-y-auto focus:outline-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed prose prose-slate dark:prose-invert max-w-none">
        <EditorContent editor={editor} />
      </div>

      {/* Quick Status Bar */}
      <div className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
        <span>Suporta tabelas técnicas, fotos com legenda, títulos e formatação com salvamento estruturado (JSON).</span>
        <span>{editor.storage?.characterCount ? `${editor.storage.characterCount.words()} palavras` : ''}</span>
      </div>
    </div>
  );
};
