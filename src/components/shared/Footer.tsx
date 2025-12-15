interface FooterProps {
  isSaving: boolean;
}

const Footer = ({ isSaving }: FooterProps) => {
  return (
    <footer className='w-full border-t border-border/50 bg-card/30'>
      <div className='max-w-3xl mx-auto px-6 py-3 flex items-center justify-center'>
        <p className='text-xs text-muted-foreground'>
          Focus mode • Auto-save enabled • {isSaving ? "Saving..." : "Saved"}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
