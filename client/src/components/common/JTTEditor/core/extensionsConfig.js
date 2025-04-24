import * as AllExtensions from './extensions';
import StarterKit from '@tiptap/starter-kit';
import { jttVideoConfig } from '../extensions/JttVideo';
import { ReactNodeViewRenderer } from '@tiptap/react'


import { common, createLowlight } from 'lowlight'
// import matlab from 'highlight.js/lib/languages/matlab'
// import scala from 'highlight.js/lib/languages/scala'
import CodeBlockComponent from '../ui/CodeBlockComponent';

const lowlight = createLowlight(common)
console.log(lowlight);

// lowlightConfig.register('matlab', matlab)
// lowlightConfig.register('scala', scala)

const baseExtensions = [
  StarterKit.configure({
    history: true,
    codeBlock: false,
    heading: {
      levels: [1, 2, 3, 4],
    },
  }),
];

const articleStrategy = [
  ...baseExtensions,
  AllExtensions.Image.configure({
    inline: false, // Allow images to be block elements
  }),
  AllExtensions.Link.configure({
    openOnClick: false,
    autolink: true,
  }),
  AllExtensions.Placeholder.configure({
    placeholder: '请输入文章内容...',
    showOnlyWhenEditable: true,      // 仅在可编辑时显示（可选）
  }),
  AllExtensions.Underline,
  AllExtensions.Highlight.configure({
    multicolor: true
  }),
  AllExtensions.TaskList,
  AllExtensions.TaskItem.configure({
    nested: true,
  }),
  AllExtensions.Superscript,
  AllExtensions.Subscript,
  AllExtensions.CodeBlockLowlight
    .extend({
      addNodeView() {
        return ReactNodeViewRenderer(CodeBlockComponent)
      },
    })
    .configure({ lowlight }),
  AllExtensions.Table.configure({
    resizable: true,
  }),
  AllExtensions.TableCell,
  AllExtensions.TableHeader,
  AllExtensions.TableRow,
  AllExtensions.TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
    defaultAlignment: 'left',
  }),
  AllExtensions.ImageUpload,
  AllExtensions.JttLink,
  AllExtensions.JttVideo.configure(jttVideoConfig),
];

const commentStrategy = [
  ...baseExtensions,
  AllExtensions.Bold,
  AllExtensions.Italic,
  AllExtensions.Link.configure({
    openOnClick: false,
    autolink: true,
  }),
];

/* mapping */

const strategies = {
  article: articleStrategy,
  comment: commentStrategy,
  default: baseExtensions,
};

export function getExtensions(preset = 'default') {
  console.log(`Loading extensions for preset: ${preset}`);
  const selectedStrategy = strategies[preset] || strategies.default;
  if (!strategies[preset]) {
    console.warn(`JTTEditor: Preset "${preset}" not found. Using default extensions.`);
  }
  // Filter out null/undefined in case baseExtensions has conditional entries
  return selectedStrategy.filter(ext => ext != null);
}