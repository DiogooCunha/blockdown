import { Textarea } from "../ui/textarea";

interface SmartEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const SmartEditor = ({ value, onChange }: SmartEditorProps) => {
  console.log(value);
  return (
    <div className='w-full flex flex-col bg-background'>
      {/* Editor Area */}
      <main className='flex-1 w-full flex justify-center'>
        <div className='w-full max-w-3xl px-6 py-12'>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
