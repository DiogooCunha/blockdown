import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Settings, FileText } from "lucide-react";

type SectionKey = "favorites" | "private" | "shared" | "pages";

type Note = {
  id: string;
  title: string;
  content?: string;
  section?: SectionKey;
};

interface SidebarProps {
  notes: Note[];
  currentNoteId: string;
  onSelectNote: (id: string) => void;
  onAddNote: (section?: SectionKey) => void;
}

const SidebarSection = ({
  section,
  notes,
  expanded,
  toggleSection,
  currentNoteId,
  onSelectNote,
  onAddNote,
}: {
  section: SectionKey;
  notes: Note[];
  expanded: boolean;
  toggleSection: () => void;
  currentNoteId: string;
  onSelectNote: (id: string) => void;
  onAddNote: (section?: SectionKey) => void;
}) => {
  const sectionNotes = useMemo(
    () => notes.filter((n) => (n.section ?? "pages") === section),
    [notes, section]
  );

  return (
    <div className="mb-4">
      <button
        onClick={toggleSection}
        className="flex items-center gap-1 w-full px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded group"
      >
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <span className="flex-1 text-left">
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </span>
        <Plus
          className="w-3 h-3 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onAddNote(section);
          }}
        />
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
              >
                <FileText className="w-4 h-4 text-gray-500" />
                <span className={`flex-1 ${selected ? "text-gray-900" : "text-gray-700"}`}>
                  {note.title}
                </span>
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
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    favorites: true,
    private: true,
    shared: false,
    pages: true,
  });

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded" />
            <span className="font-semibold text-sm">My Workspace</span>
          </div>
          <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
        <button
          className="w-full mt-2 flex items-center gap-2 px-2 py-1.5 text-sm rounded border border-gray-200 hover:bg-gray-50"
          onClick={() => onAddNote()}
        >
          <Plus className="w-4 h-4 text-gray-600" />
          <span className="text-gray-700">New Note</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {(["favorites", "private", "shared", "pages"] as SectionKey[]).map((section) => (
          <SidebarSection
            key={section}
            section={section}
            notes={notes}
            expanded={expandedSections[section]}
            toggleSection={() => toggleSection(section)}
            currentNoteId={currentNoteId}
            onSelectNote={onSelectNote}
            onAddNote={onAddNote}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
