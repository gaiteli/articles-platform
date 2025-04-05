import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';
import styles from './index.module.scss';

// Default extensions - can be customized via props later
const defaultExtensions = [
  StarterKit.configure({
    // Configure StarterKit extensions if needed
    // e.g., heading: { levels: [1, 2, 3] }
    //       codeBlock: { HTMLAttributes: { class: 'my-code-block' } }
  }),
  // Add other extensions here, like Placeholder, Link, Image, etc.
  // Example: Placeholder.configure({ placeholder: 'Write something...' })
];

const TiptapContent = ({
  value, // Controlled component value (HTML string)
  onChange, // Function to call when content changes
  placeholder, // Optional placeholder text
  extensions = defaultExtensions, // Allow overriding extensions
  ...rest // Pass other props like disabled, etc.
}) => {
  const editor = useEditor({
    extensions: extensions,
    content: value || '', // Initial content
    // Trigger the Form Item's onChange
    onUpdate: ({ editor }) => {
      // Output HTML. Use editor.getJSON() if you prefer JSON format
      const html = editor.getHTML();
      // Check if onChange exists and content is different
      // Avoid triggering onChange if content is the same or if it's just a placeholder update
      if (onChange && html !== value) {
         // Handle empty content: TipTap might return '<p></p>' for empty
         if (html === '<p></p>') {
            onChange(''); // Propagate empty string if editor is visually empty
         } else {
            onChange(html);
         }
      }
    },
    // Add editor props here if needed (e.g., attributes for styling)
    editorProps: {
        attributes: {
          // Add a class for easier styling
          class: 'tiptapEditorContent',
        },
      },
  }, [value]); // Re-initialize if the external value changes significantly (might need careful handling)


  // Update editor content if the external value changes
  // This is important for form resets or external updates
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
        // Use setContent to update the editor's content without losing cursor position if possible
        // Use 'false' to avoid triggering the onUpdate callback again
        editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);


  return (
    <div className="tiptapEditorWrapper" {...rest}>
      {/* Pass the editor instance to the MenuBar */}
      <MenuBar editor={editor} />
      {/* This is where the actual editor content is rendered */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapContent;