import Navbar from "../shared/Navbar";
import SmartEditor from "./SmartEditor";
import Footer from "../shared/Footer";
import { useAutosave } from "@/hooks/useAutosave";
import Sidebar from "../shared/Sidebar";
import { useMemo, useState } from "react";
import { nanoid } from "nanoid";

const EditorLayout = () => {
  type Note = {
    id: string;
    title: string;
    content?: string;
    section?: "favorites" | "private" | "shared" | "pages" | string;
  };

  const [notes, setNotes] = useState<Note[]>(() => [
    { id: nanoid(), title: "Quick Notes", content: "", section: "favorites" },
    { id: nanoid(), title: "Meeting Notes", content: "", section: "favorites" },
    { id: nanoid(), title: "Inbox", content: "", section: "private" },
    { id: nanoid(), title: "Documents", content: "", section: "private" },
    { id: nanoid(), title: "Team Workspace", content: "", section: "shared" },
    { id: nanoid(), title: "All Pages", content: "", section: "pages" },
  ]);

  const [currentNoteId, setCurrentNoteId] = useState<string>(notes[0]?.id ?? "");
  const [categories, setCategories] = useState<string[]>([]);
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
