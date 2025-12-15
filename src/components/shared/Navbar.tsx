import { countChars, countWords } from "@/lib/textStats";

interface NavbarProps {
  value: string;
  title: string;
  onTitleChange: (title: string) => void;
}

const Navbar = ({ value, title, onTitleChange }: NavbarProps) => {
  return (
    <header className='w-full border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10'>
      <div className='max-w-3xl mx-auto px-6 py-4 flex justify-between'>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder='Untitled'
          className='font-serif text-xl font-medium text-foreground tracking-tight bg-transparent border-none outline-none focus-visible:ring-0 w-1/2'
        />
        <div className='flex items-center gap-4 text-sm text-muted-foreground font-mono'>
          <span>{countWords(value)} words</span>
          <span className='w-px h-4 bg-border' />
          <span>{countChars(value)} chars</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
