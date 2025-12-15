import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Extension } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";

interface SmartEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const SmartEditor = ({ value, onChange }: SmartEditorProps) => {
  const SlashCommands = Extension.create({
    name: "slash-commands",
    addKeyboardShortcuts() {
      return {
        Enter: ({ editor }) => {
          const state = editor.state;
          const sel = state.selection;
          const $from = sel.$from;
          const parent = $from.parent;
          const text = parent.textBetween(0, parent.content.size, "\n", "\n").trim();
          const match = text.match(/^\/(h1|h2|h3|bold|italic|code|todo)\s*(.*)$/);
          if (!match) return false;
          const cmd = match[1];
          const content = match[2] || "";
          const prefixLen = match[0].length - content.length;
          const fromPos = $from.start();
          editor.chain().focus().deleteRange({ from: fromPos, to: fromPos + prefixLen }).run();
          if (cmd === "h1") {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
            return true;
          }
          if (cmd === "h2") {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
            return true;
          }
          if (cmd === "h3") {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
            return true;
          }
          if (cmd === "bold") {
            editor.chain().focus().toggleBold().run();
            return true;
          }
          if (cmd === "italic") {
            editor.chain().focus().toggleItalic().run();
            return true;
          }
          if (cmd === "code") {
            editor.chain().focus().toggleCodeBlock().run();
            return true;
          }
          if (cmd === "todo") {
            editor.chain().focus().toggleTaskList().run();
            return true;
          }
          return false;
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      TaskList,
      TaskItem,
      SlashCommands,
      Placeholder.configure({
        placeholder: "Write something beautiful",
        showOnlyWhenEditable: true,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div className='w-full flex flex-col bg-background'>
      {/* Editor Area */}
      <main className='flex-1 w-full flex justify-center'>
        <div className='w-full max-w-3xl px-6 py-12'>
          <EditorContent
            editor={editor}
            className='
              min-h-[40vh]
              w-full
              border-none
              bg-transparent
              text-editor-text
              text-lg!
              leading-relaxed
              font-serif
              focus:ring-0
              focus:outline-none
              focus-visible:ring-0
              focus-visible:outline-none
              selection:bg-sky-400/25
              selection:text-foreground
            '
          />
        </div>
      </main>
    </div>
  );
};

export default SmartEditor;
