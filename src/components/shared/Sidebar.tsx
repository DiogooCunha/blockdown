import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, FileText, Trash2, Plus, Download } from "lucide-react";
import { Button } from "../ui/button";

type FixedSection = "pages";
type Section = FixedSection | string;

type Note = {
  id: string;
  title: string;
  content?: string;
  section?: Section;
};

interface SidebarProps {
  notes: Note[];
  currentNoteId: string;
  onSelectNote: (id: string) => void;
  onAddNote: (section?: Section) => void;
  categories: string[];
  onAddCategory: () => void;
  onDeleteCategory: (section: string) => void;
  onMoveNote: (id: string, section: Section) => void;
  onDeleteNote: (id: string) => void;
  onDownloadCurrentNote: () => void;
}

const SidebarSection = ({
  section,
  notes,
  expanded,
  toggleSection,
  currentNoteId,
  onSelectNote,
  onAddNote,
  onDeleteCategory,
  onMoveNote,
  onDeleteNote,
}: {
  section: Section;
  notes: Note[];
  expanded: boolean;
  toggleSection: () => void;
  currentNoteId: string;
  onSelectNote: (id: string) => void;
  onAddNote: (section?: Section) => void;
  onDeleteCategory: (section: string) => void;
  onMoveNote: (id: string, section: Section) => void;
  onDeleteNote: (id: string) => void;
}) => {
  const sectionNotes = useMemo(
    () => notes.filter((n) => (n.section ?? "pages") === section),
    [notes, section]
  );
  const [dragOver, setDragOver] = useState(false);
  const isFixed: boolean = section === "pages";

  return (
    <div
      className={`mb-4 rounded ${dragOver ? "bg-gray-50 ring-1 ring-sky-300" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        const id = e.dataTransfer.getData("text/note-id");
        setDragOver(false);
        if (id) onMoveNote(id, section);
      }}
    >
      <button
        onClick={toggleSection}
        className="flex items-center gap-1 w-full px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded group"
        onContextMenu={(e) => {
          e.preventDefault();
          // handled in parent via bubbling
        }}
      >
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <span className="flex-1 text-left">
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </span>
        <div className="flex items-center gap-1">
          <Plus
            className="w-3 h-3 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onAddNote(section);
            }}
          />
          {!isFixed && (
            <Trash2
              className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCategory(section);
              }}
            />
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-1 space-y-0.5">
          {sectionNotes.map((note) => {
            const selected = note.id === currentNoteId;
            return (
              <div
                key={note.id}
                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer group ${
                  selected ? "bg-gray-100" : "hover:bg-gray-100"
                }`}
                onClick={() => onSelectNote(note.id)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/note-id", note.id);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
              >
                <FileText className="w-4 h-4 text-gray-500" />
                <span className={`flex-1 ${selected ? "text-gray-900" : "text-gray-700"}`}>
                  {note.title}
                </span>
                <Trash2
                  className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  currentNoteId,
  onSelectNote,
  onAddNote,
  categories,
  onAddCategory,
  onDeleteCategory,
  onMoveNote,
  onDeleteNote,
  onDownloadCurrentNote,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<Section, boolean>>({
    pages: true,
  });
  const [menu, setMenu] = useState<{ open: boolean; x: number; y: number; target?: Section | null }>({
    open: false,
    x: 0,
    y: 0,
    target: null,
  });

  const toggleSection = (section: Section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div
      className="w-64 bg-white border-r border-gray-200 flex flex-col relative"
      onContextMenu={(e) => {
        e.preventDefault();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setMenu({
          open: true,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          target: null,
        });
      }}
      onClick={() => {
        if (menu.open) setMenu((m) => ({ ...m, open: false }));
      }}
    >

      <div className="flex-1 overflow-y-auto p-2">
        {(["pages"] as FixedSection[]).map((section) => (
          <SidebarSection
            key={section}
            section={section}
            notes={notes}
            expanded={expandedSections[section]}
            toggleSection={() => toggleSection(section)}
            currentNoteId={currentNoteId}
            onSelectNote={onSelectNote}
            onAddNote={onAddNote}
            onDeleteCategory={onDeleteCategory}
            onMoveNote={onMoveNote}
            onDeleteNote={onDeleteNote}
          />
        ))}
        {categories.map((section) => (
          <SidebarSection
            key={section}
            section={section}
            notes={notes}
            expanded={expandedSections[section] ?? true}
            toggleSection={() => toggleSection(section)}
            currentNoteId={currentNoteId}
            onSelectNote={onSelectNote}
            onAddNote={onAddNote}
            onDeleteCategory={onDeleteCategory}
            onMoveNote={onMoveNote}
            onDeleteNote={onDeleteNote}
          />
        ))}
      </div>
      {menu.open && (
        <div
          style={{ left: menu.x, top: menu.y }}
          className="absolute z-50 w-48 bg-white border border-gray-200 rounded shadow-lg"
        >
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
            onClick={() => {
              if (menu.target && menu.target !== "pages") {
                onAddNote(menu.target);
              } else {
                onAddNote("pages");
              }
              setMenu((m) => ({ ...m, open: false }));
            }}
          >
            Add Note
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
            onClick={() => {
              onAddCategory();
              setMenu((m) => ({ ...m, open: false }));
            }}
          >
            Add Category
          </button>
          {menu.target && menu.target !== "pages" && (
            <button
              className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-gray-100"
              onClick={() => {
                onDeleteCategory(menu.target as string);
                setMenu((m) => ({ ...m, open: false }));
              }}
            >
              Delete Category
            </button>
          )}
        </div>
      )}
      <div className="p-2 border-t border-gray-200">
        <Button variant="outline" className="w-full" onClick={onDownloadCurrentNote}>
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
