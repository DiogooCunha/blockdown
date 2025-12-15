import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  Star,
  Calendar,
  Inbox,
  FileText,
  Hash,
  Users,
  MoreHorizontal,
} from "lucide-react";


type SidebarItemType = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color?: string;
  count?: number;
  nested?: { label: string }[];
};

type SectionKey = "favorites" | "private" | "shared" | "pages";

type SidebarItemsType = Record<SectionKey, SidebarItemType[]>;

const sidebarItems: SidebarItemsType = {
  favorites: [
    { icon: Star, label: "Quick Notes", color: "text-yellow-500" },
    { icon: Calendar, label: "Meeting Notes", color: "text-blue-500" },
  ],
  private: [
    { icon: Inbox, label: "Inbox", color: "text-gray-500", count: 3 },
    { icon: FileText, label: "Documents", color: "text-gray-500" },
    {
      icon: Hash,
      label: "Projects",
      color: "text-gray-500",
      nested: [
        { label: "Website Redesign" },
        { label: "Mobile App" },
        { label: "Marketing Campaign" },
      ],
    },
    { icon: Calendar, label: "Calendar", color: "text-gray-500" },
  ],
  shared: [
    { icon: Users, label: "Team Workspace", color: "text-purple-500" },
    { icon: FileText, label: "Shared Docs", color: "text-green-500" },
  ],
  pages: [{ icon: FileText, label: "All Pages", color: "text-gray-500" }],
};

const SidebarItem: React.FC<{
  item: SidebarItemType;
  nestedExpanded: boolean;
  toggleNested: () => void;
}> = ({ item, nestedExpanded, toggleNested }) => {
  return (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-gray-100 group"
        onClick={() => item.nested && toggleNested()}
      >
        {item.nested &&
          (nestedExpanded ? (
            <ChevronDown className="w-3 h-3 text-gray-400" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-400" />
          ))}
        <item.icon className={`w-4 h-4 ${item.color}`} />
        <span className="flex-1 text-gray-700">{item.label}</span>
        {item.count && (
          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
            {item.count}
          </span>
        )}
        <MoreHorizontal className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
      </div>

      {item.nested && nestedExpanded && (
        <div className="ml-6 mt-0.5 space-y-0.5">
          {item.nested.map((nested, nIdx) => (
            <div
              key={nIdx}
              className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-gray-100 group"
            >
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              <span className="flex-1 text-gray-600 text-sm">{nested.label}</span>
              <MoreHorizontal className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarSection: React.FC<{
  section: SectionKey;
  items: SidebarItemType[];
  expanded: boolean;
  toggleSection: () => void;
}> = ({ section, items, expanded, toggleSection }) => {
  const [nestedExpanded, setNestedExpanded] = useState<Record<string, boolean>>({});

  const toggleNested = (label: string) => {
    setNestedExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="mb-4">
      <button
        onClick={toggleSection}
        className="flex items-center gap-1 w-full px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded group"
      >
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <span className="flex-1 text-left">{section.charAt(0).toUpperCase() + section.slice(1)}</span>
        <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100" />
      </button>

      {expanded && (
        <div className="mt-1 space-y-0.5">
          {items.map((item, idx) => (
            <SidebarItem
              key={idx}
              item={item}
              nestedExpanded={!!nestedExpanded[item.label]}
              toggleNested={() => toggleNested(item.label)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
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
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded" />
            <span className="font-semibold text-sm">My Workspace</span>
          </div>
          <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto p-2">
        {(["favorites", "private", "shared", "pages"] as SectionKey[]).map((section) => (
          <SidebarSection
            key={section}
            section={section}
            items={sidebarItems[section]}
            expanded={expandedSections[section]}
            toggleSection={() => toggleSection(section)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
