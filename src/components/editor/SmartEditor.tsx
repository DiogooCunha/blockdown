import React, { useRef } from "react";
import { Textarea } from "../ui/textarea";
import { applySlashCommand } from "@/lib/commands";

interface SmartEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const SmartEditor = ({ value, onChange }: SmartEditorProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;

    const el = ref.current;
    if (!el) return;

    const result = applySlashCommand(value, el.selectionStart);
    if (!result) return;

    e.preventDefault();
    onChange(result.value);

    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = result.cursor;
    });
  };

  return (
    <div className='w-full flex flex-col bg-background'>
      {/* Editor Area */}
      <main className='flex-1 w-full flex justify-center'>
        <div className='w-full max-w-3xl px-6 py-12'>
          <Textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder='Start writing something beautiful...'
            className='
              min-h-[40vh]
              w-full
              resize-none
              border-none
              bg-transparent
              text-editor-text
              text-lg!
              leading-relaxed
              font-serif
              placeholder:text-editor-placeholder
              placeholder:italic
              focus-visible:ring-0
              focus-visible:outline-none
              selection:bg-sky-400/25
              selection:text-foreground
            '
          />
        </div>
      </main>

      {/* Footer */}
    </div>
  );
};

export default SmartEditor;
