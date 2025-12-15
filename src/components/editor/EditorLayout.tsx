import Navbar from "../shared/Navbar";
import SmartEditor from "./SmartEditor";
import Footer from "../shared/Footer";
import { useAutosave } from "@/hooks/useAutosave";
import Sidebar from "../shared/Sidebar";
import { useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";

const EditorLayout = () => {
  type Note = {
    id: string;
    title: string;
    content?: string;
    section?: "pages" | string;
  };

  const NOTES_KEY = "markdown-editor:notes";
  const CATEGORIES_KEY = "markdown-editor:categories";
  const CURRENT_NOTE_KEY = "markdown-editor:current-note-id";

  const defaultNotes: Note[] = [{ id: nanoid(), title: "Untitled", content: "", section: "pages" }];
  const removedFixed = new Set(["favorites", "private", "shared"]);

  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      if (raw) {
        const loaded = JSON.parse(raw) as Note[];
        return loaded.map((n: Note) =>
          n.section && removedFixed.has(n.section) ? { ...n, section: "pages" } : n
        );
      }
    } catch {}
    return defaultNotes;
  });
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(CATEGORIES_KEY);
      if (raw) return JSON.parse(raw) as string[];
    } catch {}
    return [];
  });
  const [currentNoteId, setCurrentNoteId] = useState<string>(() => {
    try {
      const raw = localStorage.getItem(CURRENT_NOTE_KEY);
      if (raw) return raw;
    } catch {}
    return notes[0]?.id ?? "";
  });
  const currentNote = useMemo(
    () => notes.find((n) => n.id === currentNoteId),
    [notes, currentNoteId]
  );

  const { value, setValue, isSaving } = useAutosave({
    noteID: currentNoteId,
    key: "smart-editor:content",
    delay: 3000,
    content: currentNote?.content ?? "",
  });

  const handleChange = (next: string) => {
    setValue(next);
    setNotes((prev) =>
      prev.map((n) => (n.id === currentNoteId ? { ...n, content: next } : n))
    );
  };

  const handleSelectNote = (id: string) => {
    setCurrentNoteId(id);
  };

  const handleAddNote = (section?: Note["section"]) => {
    const newNote: Note = {
      id: nanoid(),
      title: "Untitled",
      content: "",
      section: section ?? "pages",
    };
    setNotes((prev) => [newNote, ...prev]);
    setCurrentNoteId(newNote.id);
  };
  const handleAddCategory = () => {
    const name = window.prompt("Category name")?.trim();
    if (!name) return;
    setCategories((prev) => (prev.includes(name) ? prev : [name, ...prev]));
  };
  const handleDeleteCategory = (name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
    setNotes((prev) =>
      prev.map((n) => (n.section === name ? { ...n, section: "pages" } : n))
    );
  };
  const handleMoveNote = (id: string, section: Note["section"]) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, section } : n)));
  };
  const handleDeleteNote = (id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      try {
        localStorage.removeItem(`${id}:smart-editor:content`);
      } catch {}
      if (next.length === 0) {
        const newNote: Note = { id: nanoid(), title: "Untitled", content: "", section: "pages" };
        setCurrentNoteId(newNote.id);
        return [newNote];
      }
      if (currentNoteId === id) {
        setCurrentNoteId(next[0].id);
      }
      return next;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch {}
  }, [notes]);
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch {}
  }, [categories]);
  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_NOTE_KEY, currentNoteId);
    } catch {}
  }, [currentNoteId]);

  return (
    <div className='h-screen flex flex-col bg-background mr-20'>
      <Navbar
        value={value}
        title={currentNote?.title ?? ""}
        onTitleChange={(t) =>
          setNotes((prev) => prev.map((n) => (n.id === currentNoteId ? { ...n, title: t } : n)))
        }
      />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar
          notes={notes}
          currentNoteId={currentNoteId}
          onSelectNote={handleSelectNote}
          onAddNote={handleAddNote}
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onMoveNote={handleMoveNote}
          onDeleteNote={handleDeleteNote}
        />
        <main className='flex-1 overflow-hidden'>
          <SmartEditor value={value} onChange={handleChange} />
        </main>
      </div>
      <Footer isSaving={isSaving} />
    </div>
  );
};

export default EditorLayout;
