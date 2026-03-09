import React, { useState, useMemo, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ChevronDown, ChevronLeft, ChevronRight, Plus, Lock, 
  MoreHorizontal, Circle, X, Settings2, SlidersHorizontal, 
  Diamond, Menu, UserRound, Calendar, User as UserIcon,
  Clock, RotateCcw, CheckCircle2, ArrowUpRight, Type, Hash, 
  Calculator, Timer, ChevronUp, BookOpen, Search, Filter, ArrowUpDown, LayoutGrid, Sliders,
  CheckCircle, PlusSquare, CalendarRange, Activity, FileText, LayoutList, Columns3, Star,
  PanelRightClose, Zap, Layout, Tag, Hourglass, MinusCircle, Pencil, Users, ClipboardList,
  RefreshCcw
} from 'lucide-react';
import { Task, TaskSection, Teammate, ColumnDef, Project } from '../types';
import { MOCK_DATA } from '../constants';
import AddFieldLibraryModal from './AddFieldLibraryModal';
import TaskDetailDrawer from './TaskDetailDrawer';
import { useUser } from '../contexts/UserContext';

type ViewType = 'List' | 'Board' | 'Calendar' | 'Dashboard' | 'Files';

interface ProjectTab {
  id: string;
  type: ViewType;
  label: string;
  isRenamable?: boolean;
}

// --- Shared Utility & Types ---

const CELL_BORDER = "border-r border-[#333538]";

const generateId = () => `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const useAnchorPosition = (anchorElement: HTMLElement | null, offset: { x: number; y: number } = { x: 0, y: 0 }) => {
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0, width: 0, bottom: 0 });

  const updatePosition = useCallback(() => {
    if (anchorElement) {
      const rect = anchorElement.getBoundingClientRect();
      setPosition({
        top: rect.bottom + offset.y,
        left: rect.left + offset.x,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
      });
    }
  }, [anchorElement, offset.x, offset.y]);

  useLayoutEffect(() => {
    if (!anchorElement) return;

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorElement, updatePosition]);

  return position;
};

// --- Collaborator UI Components ---

const CollaboratorPill: React.FC<{ teammate: Teammate; onRemove: () => void }> = ({ teammate, onRemove }) => (
  <div className="flex items-center bg-zinc-700/80 rounded-sm overflow-hidden h-6 mr-1.5 my-0.5">
    <div className={`${teammate.color} text-black text-[10px] font-bold px-1.5 h-full flex items-center`}>
      {teammate.initials}
    </div>
    <span className="text-white text-[11px] px-2 font-medium whitespace-nowrap">{teammate.name}</span>
    <button 
      onClick={(e) => { e.stopPropagation(); onRemove(); }}
      className="pr-1.5 text-zinc-400 hover:text-white transition-colors"
    >
      <X size={12} />
    </button>
  </div>
);

const CollaboratorSearchDropdown: React.FC<{ 
  onClose: () => void; 
  anchorRef: React.RefObject<HTMLDivElement | null>; 
  onSelect: (teammate: Teammate) => void;
  teammates: Teammate[];
  searchQuery: string;
}> = ({ onClose, anchorRef, onSelect, teammates, searchQuery }) => {
  const position = useAnchorPosition(anchorRef.current, { x: 0, y: 4 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && 
          anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, anchorRef]);

  const filteredTeammates = useMemo(() => {
    if (!searchQuery) return teammates;
    const query = searchQuery.toLowerCase();
    return teammates.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.email.toLowerCase().includes(query)
    );
  }, [teammates, searchQuery]);

  return createPortal(
    <div 
      ref={menuRef}
      style={{ top: position.top, left: position.left, width: Math.max(position.width, 320) }}
      role="menu"
      className="fixed z-[10000] bg-[#2a2b2d] border border-[#3c4043] rounded-lg shadow-[0_12px_48px_rgba(0,0,0,0.8)] py-1 animate-in fade-in zoom-in-95 duration-100 flex flex-col pointer-events-auto overflow-hidden"
    >
      {filteredTeammates.length > 0 ? (
        filteredTeammates.map((teammate) => (
          <button
            key={teammate.id}
            onMouseDown={(e) => e.preventDefault()} // Prevents focus loss from input
            onClick={() => onSelect(teammate)}
            className="flex items-center px-4 py-2 hover:bg-[#333538] transition-colors w-full text-left group"
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white mr-3 shadow-inner ${teammate.color}`}
            >
              {teammate.initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-white leading-tight">{teammate.name}</span>
              <span className="text-[12px] text-[#a2a0a2] truncate">{teammate.email}</span>
            </div>
          </button>
        ))
      ) : (
        <div className="px-4 py-3 text-[13px] text-[#a2a0a2] italic">
          No matches found. Press Enter to invite "{searchQuery}"
        </div>
      )}
    </div>,
    document.body
  );
};

const CollaboratorsCell: React.FC<{
  collaborators: Teammate[];
  onUpdate: (collaborators: Teammate[]) => void;
  teammates: Teammate[];
  isEditing: boolean;
  onStartEditing: () => void;
  onEndEditing: () => void;
}> = ({ collaborators, onUpdate, teammates, isEditing, onStartEditing, onEndEditing }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
      setSearchQuery('');
    }
  }, [isEditing]);

  const handleRemove = (id: string) => {
    onUpdate(collaborators.filter(c => c.id !== id));
  };

  const handleSelect = (teammate: Teammate) => {
    if (!collaborators.some(c => c.id === teammate.id)) {
      onUpdate([...collaborators, teammate]);
    }
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && searchQuery === '' && collaborators.length > 0) {
      handleRemove(collaborators[collaborators.length - 1].id);
    }
    if (e.key === 'Escape') {
      onEndEditing();
    }
  };

  return (
    <div 
      ref={cellRef}
      onClick={(e) => { e.stopPropagation(); onStartEditing(); }}
      className={`${CELL_BORDER} h-full flex items-center px-3 relative cursor-text transition-all ${
        isEditing ? 'bg-[#1e1f21] ring-1 ring-blue-500 z-50 shadow-[inset_0_0_0_1px_#3b82f6]' : 'hover:bg-[#2e2e30]/40'
      }`}
    >
      <div className="flex flex-wrap items-center flex-1 py-1 overflow-hidden h-full">
        {collaborators.map((c) => (
          <CollaboratorPill key={c.id} teammate={c} onRemove={() => handleRemove(c.id)} />
        ))}
        {isEditing ? (
          <input 
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-white min-w-[120px] placeholder-[#a2a0a2] py-1"
            placeholder={collaborators.length === 0 ? "Add collaborators" : ""}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={(e) => {
              // Only blur if we're not clicking into the dropdown
              if (!e.relatedTarget) onEndEditing();
            }}
          />
        ) : collaborators.length === 0 && (
          <div className="w-6 h-6 rounded-full border border-dashed border-[#a2a0a2] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <UserIcon size={12} className="text-[#a2a0a2]" />
          </div>
        )}
      </div>

      {isEditing && (
        <CollaboratorSearchDropdown 
          anchorRef={cellRef}
          onClose={() => setIsDropdownOpen(false)}
          onSelect={handleSelect}
          teammates={teammates}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};

// --- Task Detail Components ---

const TaskRow: React.FC<{ 
  task: Task, 
  isActive: boolean, 
  onSelect: () => void, 
  onUpdate: (updates: Partial<Task>) => void, 
  teammates: Teammate[], 
  activeColumns: ColumnDef[], 
  gridStyle: React.CSSProperties 
}> = ({ task, isActive, onSelect, onUpdate, teammates, activeColumns, gridStyle }) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<'name' | 'date' | 'collaborators' | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  const isOverdue = task.dueDate.toLowerCase().includes('yesterday') || (task.dueDate.toLowerCase().includes('jan 17'));
  const dateColor = isOverdue ? 'text-[#f06a6a]' : task.dueDate.includes(',') ? 'text-[#45d2b6]' : 'text-white';

  const handleDateSelect = (date: Date | null, time?: string | null) => {
    if (!date) {
      onUpdate({ dueDate: '' });
      return;
    }
    const dateStr = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
    const fullStr = time ? `${dateStr}, ${time}` : dateStr;
    onUpdate({ dueDate: fullStr });
  };

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON') return;
    if (target.closest('[role="dialog"]') || target.closest('[role="menu"]')) return;
    onSelect();
  };

  return (
    <div 
      onClick={handleRowClick} 
      style={gridStyle} 
      className={`min-h-[48px] px-0 border-t border-[#333538] hover:bg-[#2e2e30] cursor-pointer group ${isActive ? 'bg-[#2e2e30]' : ''}`}
    >
      {/* Name Column */}
      <div 
        className={`flex items-center h-full px-12 ${CELL_BORDER} transition-all ${activeCell === 'name' ? 'bg-[#1e1f21] ring-1 ring-blue-500 z-10 shadow-[inset_0_0_0_1px_#3b82f6]' : ''}`}
        onClick={(e) => { e.stopPropagation(); setActiveCell('name'); }}
      >
        <Circle size={14} className="text-gray-500 mr-3 group-hover:text-white" />
        <input 
          type="text" 
          value={task.name} 
          onChange={(e) => onUpdate({ name: e.target.value })} 
          className="bg-transparent border-none outline-none text-white text-[13px] w-full" 
          onBlur={() => setActiveCell(null)}
          onFocus={() => setActiveCell('name')}
        />
      </div>

      {/* Due Date Column */}
      <div className={`${CELL_BORDER} h-full flex items-center px-3 relative transition-all ${activeCell === 'date' ? 'bg-[#1e1f21] ring-1 ring-blue-500 z-10 shadow-[inset_0_0_0_1px_#3b82f6]' : ''}`}>
        {task.dueDate ? (
          <button 
            ref={triggerRef} 
            onClick={(e) => { e.stopPropagation(); setIsDatePickerOpen(!isDatePickerOpen); setActiveCell('date'); }} 
            className={`text-[12px] font-bold truncate w-full text-center uppercase tracking-tight ${dateColor}`}
          >
            {task.dueDate}
          </button>
        ) : (
          <button 
            ref={triggerRef} 
            onClick={(e) => { e.stopPropagation(); setIsDatePickerOpen(true); setActiveCell('date'); }} 
            className="flex items-center justify-center w-full h-full opacity-0 group-hover:opacity-100"
          >
            <div className="flex items-center justify-center w-[26px] h-[26px] rounded-full border border-dashed border-[#3c4043] text-[#52555a] hover:border-[#848688] transition-all">
              <Calendar size={14} strokeWidth={2} />
            </div>
          </button>
        )}
        {isDatePickerOpen && (
          <CalendarPopover 
            selectedDate={task.dueDate ? new Date(task.dueDate.split(',')[0]) : null} 
            initialTime={task.dueDate.includes(',') ? task.dueDate.split(', ')[1] : null}
            onSelect={handleDateSelect} 
            onClose={() => { setIsDatePickerOpen(false); setActiveCell(null); }} 
            anchorElement={triggerRef.current} 
          />
        )}
      </div>

      {/* Collaborators Column */}
      <CollaboratorsCell 
        collaborators={task.collaborators || []} 
        onUpdate={(val) => onUpdate({ collaborators: val })} 
        teammates={teammates}
        isEditing={activeCell === 'collaborators'}
        onStartEditing={() => setActiveCell('collaborators')}
        onEndEditing={() => setActiveCell(null)}
      />

      {/* Dynamic Columns */}
      {activeColumns.map(col => (
        <div key={col.id} className={`${CELL_BORDER} h-full flex items-center px-4`}>
          <span className="text-white/20 text-[13px] italic">---</span>
        </div>
      ))}

      {/* More Column */}
      <div className="h-full flex items-center justify-center text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal size={16} />
      </div>
    </div>
  );
};

// --- Calendar Popover ---

interface CalendarPopoverProps {
  onSelect: (date: Date | null, time?: string | null) => void;
  onClose: () => void;
  anchorElement: HTMLElement | null;
  selectedDate: Date | null;
  initialTime?: string | null;
}

const CalendarPopover: React.FC<CalendarPopoverProps> = ({ onSelect, onClose, anchorElement, selectedDate, initialTime }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate || Date.now()));
  const [isTimeMode, setIsTimeMode] = useState(!!initialTime);
  const [selectedTime, setSelectedTime] = useState<string | null>(initialTime || null);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  
  const popoverRef = useRef<HTMLDivElement>(null);
  const position = useAnchorPosition(anchorElement, { x: -85, y: 8 });

  const timeOptions = useMemo(() => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const period = h >= 12 ? 'pm' : 'am';
        const hour = h % 12 === 0 ? 12 : h % 12;
        const minute = m === 0 ? '00' : '30';
        options.push(`${hour}:${minute}${period}`);
      }
    }
    return options;
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node) && 
          anchorElement && !anchorElement.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, anchorElement]);

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = firstDay; i > 0; i--) days.push({ day: prevLastDate - i + 1, currentMonth: false, date: new Date(year, month - 1, prevLastDate - i + 1) });
    for (let i = 1; i <= lastDate; i++) days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
    return days;
  }, [viewDate]);

  const handleSelectDate = (date: Date) => {
    onSelect(date, isTimeMode ? selectedTime : null);
    if (!isTimeMode) onClose();
  };

  const formattedDate = selectedDate ? selectedDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : '02/23/26';

  return createPortal(
    <div 
      ref={popoverRef}
      style={{ top: position.top, left: position.left }}
      className="fixed z-[9999] w-[300px] bg-[#2a2b2d] border border-[#3c4043] rounded-lg shadow-[0_12px_48px_rgba(0,0,0,0.8)] flex flex-col animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
    >
      {/* Top Section */}
      <div className={`p-4 border-b border-[#3c4043] flex flex-col space-y-3 transition-all duration-200 ${isTimeMode ? 'h-auto' : ''}`}>
        {isTimeMode ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <button className="flex items-center text-[13px] text-zinc-400 hover:text-white transition-colors">
                <Plus size={14} className="mr-2" /> Start date
              </button>
              <button className="flex items-center text-[13px] text-zinc-400 hover:text-white transition-colors">
                <Plus size={14} className="mr-2" /> Start time
              </button>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <div className="bg-transparent border border-zinc-700 rounded p-1.5 text-[13px] text-zinc-200 focus-within:border-blue-500 transition-colors">
                  Due date
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  className={`w-full text-left bg-transparent border rounded p-1.5 text-[13px] transition-colors ${isTimeDropdownOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-700 text-zinc-400'}`}
                >
                  {selectedTime || "Due time"}
                </button>
                {isTimeDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2b2d] border border-zinc-700 rounded shadow-2xl z-[100] max-h-[200px] overflow-y-auto thin-scrollbar animate-in fade-in zoom-in-95 duration-100">
                    {timeOptions.map((time) => (
                      <button 
                        key={time}
                        onClick={() => { setSelectedTime(time); setIsTimeDropdownOpen(false); if (selectedDate) onSelect(selectedDate, time); }}
                        className="w-full text-left px-4 py-2 text-[13px] text-white hover:bg-zinc-800 transition-colors"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-transparent border border-zinc-700 rounded px-3 py-1.5 flex items-center justify-between text-[13px] text-zinc-200">
              <span>{formattedDate}</span>
              <X size={14} className="text-zinc-500 cursor-pointer hover:text-white" onClick={() => onSelect(null, null)} />
            </div>
            <div className="flex-1 bg-transparent border border-zinc-700 rounded px-3 py-1.5 flex items-center justify-between text-[13px] text-zinc-200">
              <span>{formattedDate}</span>
              <X size={14} className="text-zinc-500 cursor-pointer hover:text-white" />
            </div>
          </div>
        )}

        {/* Calendar Nav */}
        <div className="flex items-center justify-between pt-2">
          <button onClick={handlePrevMonth} className="p-1 text-[#a2a0a2] hover:text-white transition-colors"><ChevronLeft size={16} /></button>
          <span className="text-[13px] font-bold text-white tracking-tight">{viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}</span>
          <button onClick={handleNextMonth} className="p-1 text-[#a2a0a2] hover:text-white transition-colors"><ChevronRight size={16} /></button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 pt-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (<div key={d} className="text-center text-[10px] font-bold text-[#a2a0a2] py-2 uppercase">{d}</div>))}
          {calendarData.map((item, i) => {
            const isSelected = selectedDate?.toDateString() === item.date.toDateString();
            const isToday = new Date().toDateString() === item.date.toDateString();
            return (
              <div key={i} className="flex items-center justify-center h-8">
                <button 
                  onClick={() => handleSelectDate(item.date)}
                  className={`w-7 h-7 text-[12px] rounded-full transition-all flex items-center justify-center ${
                    isSelected 
                      ? 'bg-[#4573d2] text-white' 
                      : isToday 
                        ? 'border border-[#4573d2] text-[#4573d2] hover:bg-zinc-800' 
                        : item.currentMonth 
                          ? 'text-white hover:bg-zinc-800' 
                          : 'text-zinc-600'
                  }`}
                >
                  {item.day}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#3c4043] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsTimeMode(!isTimeMode)}
            className={`p-1.5 rounded transition-all ${isTimeMode ? 'bg-blue-600/20 text-blue-500 ring-1 ring-blue-500/30 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            <Clock size={18} />
          </button>
          <button className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">
            <RefreshCcw size={18} />
          </button>
        </div>
        <button onClick={() => { onSelect(null, null); onClose(); }} className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors">Clear</button>
      </div>
    </div>,
    document.body
  );
};

// --- Manage Privacy Modal Component ---

interface ManagePrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManagePrivacyModal: React.FC<ManagePrivacyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        className="relative w-full max-w-[560px] bg-[#1e1f21] border border-[#333538] rounded-xl shadow-[0_24px_48px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#333538]">
          <h2 id="privacy-modal-title" className="text-[18px] font-bold text-white tracking-tight">Manage privacy</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#a2a0a2] hover:text-white hover:bg-[#333538] rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="relative">
            <div className="w-full bg-[#2e2e30] border border-[#454545] rounded-md py-3 px-4 transition-all focus-within:border-[#4573d2] focus-within:ring-1 focus-within:ring-[#4573d2]">
              <input 
                type="text" 
                placeholder="Add teammates by adding their name or email..." 
                className="w-full bg-transparent border-none outline-none text-[14px] text-white placeholder-[#848688] font-normal"
                autoFocus
              />
            </div>
          </div>

          <div className="bg-[#151617] border border-[#333538] rounded-xl p-6 flex items-start space-x-4">
            <div className="mt-0.5 flex-shrink-0 text-[#a2a0a2]">
              <Lock size={18} />
            </div>
            <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="max-w-[320px]">
                <p className="text-[13px] text-[#a2a0a2] leading-relaxed">
                  This view is private to only you. Adding teammates will allow them to view, edit, and organize your work. They will only be able to see tasks they already have access to. <span className="text-[#4573d2] hover:underline cursor-pointer font-medium">Learn more</span>
                </p>
              </div>
              <button className="flex-shrink-0 bg-[#2e2e30] hover:bg-[#333538] text-white px-5 py-2 rounded-lg text-[13px] font-semibold transition-colors border border-[#454545]">
                Invite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- Customize Panel Component ---

interface CustomizePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomizePanel: React.FC<CustomizePanelProps> = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`fixed top-[48px] bottom-0 right-0 w-[360px] bg-[#1e1f21] border-l border-[#333538] z-[60] shadow-2xl transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#333538]">
          <h2 className="text-[16px] font-bold text-white tracking-tight">Customize</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#a2a0a2] hover:text-white hover:bg-[#333538] rounded-md transition-colors"
          >
            <PanelRightClose size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-bold text-white tracking-tight">This project</h3>
              <button className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#2a2b2d] border border-[#333538] rounded-md hover:bg-[#333538] transition-colors text-[13px] font-medium text-white">
                <span>Add</span>
                <ChevronDown size={14} />
              </button>
            </div>
            <p className="text-[13px] text-[#a2a0a2] mb-4 opacity-80">View and edit features on this project</p>
          </section>

          <section>
            <h4 className="text-[11px] font-bold text-[#a2a0a2] uppercase tracking-widest mb-3 opacity-60">AI Studio</h4>
            <div className="bg-[#2a2b2d]/40 border border-[#333538] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#333538] transition-all group active:scale-[0.98]">
              <div className="flex items-center space-x-4">
                <div className="text-[#a2a0a2] group-hover:text-white transition-colors">
                  <Zap size={18} strokeWidth={2.2} />
                </div>
                <span className="text-[14px] font-bold text-white">Rules</span>
              </div>
              <ChevronRight size={16} className="text-[#a2a0a2]" />
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-[11px] font-bold text-[#a2a0a2] uppercase tracking-widest mb-3 opacity-60">Workflow features</h4>
            
            <div className="bg-[#2a2b2d]/40 border border-[#333538] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#333538] transition-all group active:scale-[0.98]">
              <div className="flex items-center space-x-4">
                <div className="text-[#a2a0a2] group-hover:text-white transition-colors">
                  <Circle size={18} strokeWidth={2.2} />
                </div>
                <span className="text-[14px] font-bold text-white">Fields</span>
              </div>
              <ChevronRight size={16} className="text-[#a2a0a2]" />
            </div>

            <div className="bg-[#2a2b2d]/40 border border-[#333538] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#333538] transition-all group active:scale-[0.98]">
              <div className="flex items-center space-x-4">
                <div className="text-[#a2a0a2] group-hover:text-white transition-colors">
                  <Layout size={18} strokeWidth={2.2} />
                </div>
                <span className="text-[14px] font-bold text-white">Apps</span>
              </div>
              <ChevronRight size={16} className="text-[#a2a0a2]" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- Add View Menu Component ---

interface AddViewMenuProps {
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onSelect: (view: ViewType) => void;
}

const AddViewMenu: React.FC<AddViewMenuProps> = ({ onClose, anchorRef, onSelect }) => {
  const buttonPos = useAnchorPosition(anchorRef.current, { x: 0, y: 8 });
  const menuRef = useRef<HTMLDivElement>(null);
  const MENU_WIDTH = 480;

  const style: React.CSSProperties = useMemo(() => {
    const spaceOnRight = window.innerWidth - buttonPos.left;
    const isOverlappingRight = spaceOnRight < MENU_WIDTH;

    return {
      top: buttonPos.top,
      left: isOverlappingRight 
        ? buttonPos.right - MENU_WIDTH 
        : buttonPos.left,
    };
  }, [buttonPos]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && 
          anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, anchorRef]);

  const MenuItem = ({ icon: Icon, title, description, color, badge, onClick }: any) => (
    <div 
      onClick={onClick}
      className="flex items-start p-3 rounded-lg hover:bg-[#333538] cursor-pointer group transition-all duration-150"
    >
      <div className={`mt-0.5 mr-4 flex-shrink-0 ${color}`}>
        <Icon size={20} strokeWidth={2.2} />
      </div>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-white tracking-tight leading-none">{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#7c3aed]/20 text-[#a78bfa] uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
        <span className="text-[12px] text-[#a2a0a2] leading-tight mt-1.5 opacity-90">{description}</span>
      </div>
    </div>
  );

  return createPortal(
    <div 
      ref={menuRef}
      style={style}
      role="menu"
      className="fixed z-[9999] w-[480px] bg-[#2a2b2d] border border-[#333538] rounded-lg shadow-[0_12px_48px_rgba(0,0,0,0.85)] py-5 animate-in fade-in zoom-in-95 duration-100 flex flex-col pointer-events-auto"
    >
      <div className="px-5 mb-2">
        <span className="text-[11px] font-bold text-[#a2a0a2] uppercase tracking-widest opacity-80">Popular</span>
      </div>
      <div className="grid grid-cols-2 gap-x-1 px-2 mb-5">
        <MenuItem 
          icon={LayoutList} 
          title="List" 
          description="Organize tasks in a powerful table" 
          color="text-[#4573d2]"
          onClick={() => onSelect('List')}
        />
        <MenuItem 
          icon={Columns3} 
          title="Board" 
          description="Track work in a Kanban view" 
          color="text-[#4573d2]"
          onClick={() => onSelect('Board')}
        />
        <MenuItem 
          icon={Calendar} 
          title="Calendar" 
          description="Plan weekly or monthly work" 
          color="text-[#4573d2]"
          onClick={() => onSelect('Calendar')}
        />
      </div>

      <div className="px-5 mb-2">
        <span className="text-[11px] font-bold text-[#a2a0a2] uppercase tracking-widest opacity-80">Other</span>
      </div>
      <div className="grid grid-cols-2 gap-x-1 px-2 mb-2">
        <MenuItem 
          icon={Activity} 
          title="Dashboard" 
          description="A real-time dashboard of your work in Asana" 
          color="text-[#4ade80]"
          badge="New"
          onClick={() => onSelect('Dashboard')}
        />
        <MenuItem 
          icon={FileText} 
          title="Note" 
          description="Write meeting notes and more" 
          color="text-[#4ade80]"
          onClick={() => {}}
        />
      </div>

      <div className="px-5 mt-4 pt-4 border-t border-[#333538]">
        <button className="text-[12px] text-[#4573d2] hover:underline font-medium transition-all">Send feedback</button>
      </div>
    </div>,
    document.body
  );
};

// --- Add Task Dropdown ---

interface AddTaskDropdownProps {
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  onSelect: (type: string) => void;
}

const AddTaskDropdown: React.FC<AddTaskDropdownProps> = ({ onClose, anchorRef, onSelect }) => {
  const position = useAnchorPosition(anchorRef.current, { x: 0, y: 4 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && 
          anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, anchorRef]);

  const menuItems = [
    { id: 'task', label: 'Task', icon: Circle, extra: 'Default', selected: true },
    { id: 'approval', label: 'Approval', icon: UserRound },
    { id: 'milestone', label: 'Milestone', icon: Diamond, shortcuts: ['Shift', 'Tab', 'M'] },
    { id: 'section', label: 'Section', icon: Menu, shortcuts: ['Tab', 'N'] },
  ];

  return createPortal(
    <div 
      ref={menuRef}
      style={{ top: position.top, left: position.left }}
      role="menu"
      className="fixed z-[9999] w-[300px] bg-[#2a2b2d] border border-[#3c4043] rounded-lg shadow-[0_12px_48px_rgba(0,0,0,0.8)] py-1 animate-in fade-in zoom-in-95 duration-100 flex flex-col pointer-events-auto"
    >
      {menuItems.map((item) => (
        <button
          key={item.id}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { onSelect(item.id); onClose(); }}
          className={`group flex items-center px-3 py-2.5 mx-1 transition-all rounded-md text-left outline-none hover:bg-[#333538] ${
            item.selected ? 'ring-1 ring-white/20 bg-[#333538]' : ''
          }`}
        >
          <div className="flex items-center flex-1 space-x-3">
            <item.icon size={16} className={`text-[#a2a0a2] group-hover:text-white transition-colors ${item.selected ? 'text-white' : ''}`} />
            <span className={`text-[13px] font-medium ${item.selected ? 'text-white' : 'text-[#f5f5f5]'}`}>{item.label}</span>
          </div>
          {item.extra && <span className="text-[11px] text-[#848688] font-normal">{item.extra}</span>}
          {item.shortcuts && (
            <div className="flex items-center space-x-1 ml-4">
              {item.shortcuts.map((key) => (
                <div key={key} className="bg-[#1e1f21] border border-[#3c4043] px-1 py-0.5 rounded text-[10px] text-[#848688] font-bold uppercase min-w-[18px] text-center">{key}</div>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>,
    document.body
  );
};

// --- Add Field Tooltip ---

interface AddFieldTooltipProps {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  text: string;
}

const AddFieldTooltip: React.FC<AddFieldTooltipProps> = ({ anchorRef, text }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [anchorRef]);

  useLayoutEffect(() => {
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition]);

  return createPortal(
    <div 
      style={{ top: position.top, left: position.left }}
      className="fixed z-[10001] -translate-x-1/2 -translate-y-full animate-in fade-in zoom-in-95 duration-150 pointer-events-none"
    >
      <div className="bg-[#2a2b2d] text-white text-[12px] px-3 py-1.5 rounded-md shadow-2xl whitespace-nowrap border border-white/5 font-medium flex items-center justify-center">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#2a2b2d]" />
      </div>
    </div>,
    document.body
  );
};

// --- Add Field Popover ---

interface AddFieldDropdownProps {
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onSelectField: (field: any) => void;
  onOpenLibrary: () => void;
}

const AddFieldDropdown: React.FC<AddFieldDropdownProps> = ({ onClose, anchorRef, onSelectField, onOpenLibrary }) => {
  const position = useAnchorPosition(anchorRef.current, { x: -200, y: 10 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && 
          anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, anchorRef]);

  const fieldTypes = [
    { id: 'single-select', label: 'Single-select', icon: Circle },
    { id: 'multi-select', label: 'Multi-select', icon: CheckCircle2 },
    { id: 'date', label: 'Date', icon: Calendar },
    { id: 'people', label: 'People', icon: UserIcon },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'number', label: 'Number', icon: Hash },
  ];

  return createPortal(
    <div 
      ref={menuRef}
      style={{ top: position.top, left: position.left }}
      className="fixed z-[9999] w-[240px] bg-[#2a2b2d] border border-[#333538] rounded shadow-[0_10px_40px_rgba(0,0,0,0.85)] py-1 animate-in fade-in zoom-in-95 duration-100 flex flex-col pointer-events-auto"
    >
      <div className="px-3 py-2 border-b border-[#333538]/50 mb-1">
        <span className="text-[10px] font-bold text-[#a2a0a2] uppercase tracking-wider">Field types</span>
      </div>
      {fieldTypes.map((field) => (
        <button
          key={field.id}
          onClick={() => { onSelectField(field); onClose(); }}
          className="w-full flex items-center px-3 py-2 hover:bg-[#333538] transition-colors group text-left outline-none"
        >
          <field.icon size={14} className="text-[#a2a0a2] group-hover:text-white mr-2.5" />
          <span className="text-[12px] text-white font-medium">{field.label}</span>
        </button>
      ))}
      <div className="border-t border-[#333538] mt-1 pt-1">
        <button 
          onClick={() => { onOpenLibrary(); onClose(); }}
          className="w-full flex items-center px-3 py-2 hover:bg-[#333538] transition-colors group text-left outline-none"
        >
          <BookOpen size={14} className="text-[#a2a0a2] group-hover:text-white mr-2.5" />
          <span className="text-[12px] text-white font-medium">Choose from library</span>
        </button>
      </div>
    </div>,
    document.body
  );
};

// --- TaskTable Main Component ---

const TaskTable: React.FC<{ members: Teammate[], projects: Project[] }> = ({ members, projects }) => {
  const { user } = useUser();
  const initialTabs: ProjectTab[] = [
    { id: 'list-default', type: 'List', label: 'List' },
    { id: 'board-default', type: 'Board', label: 'Board' },
    { id: 'calendar-default', type: 'Calendar', label: 'Calendar' },
    { id: 'dashboard-default', type: 'Dashboard', label: 'Dashboard' },
    { id: 'files-default', type: 'Files', label: 'Files' },
  ];

  const [projectTabs, setProjectTabs] = useState<ProjectTab[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string>(initialTabs[0].id);
  const [sections, setSections] = useState<TaskSection[]>(MOCK_DATA);
  const [activeAddSectionId, setActiveAddSectionId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  const [sectionDrafts, setSectionDrafts] = useState<Record<string, { name: string; date: string }>>({});
  const [activeColumns, setActiveColumns] = useState<ColumnDef[]>([]);
  const [isAddViewMenuOpen, setIsAddViewMenuOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isFieldLibraryModalOpen, setIsFieldLibraryModalOpen] = useState(false);
  const addViewBtnRef = useRef<HTMLButtonElement>(null);

  const activeTab = useMemo(() => projectTabs.find(t => t.id === activeTabId) || projectTabs[0], [projectTabs, activeTabId]);

  const toggleSection = (sectionId: string) => setSections(prev => prev.map(s => s.id === sectionId ? { ...s, isExpanded: !s.isExpanded } : s));

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setSections(prev => prev.map(section => ({
      ...section,
      tasks: section.tasks.map(task => {
        if (task.id === taskId) {
          const updated = { ...task, ...updates };
          if (selectedTaskForDetail?.id === taskId) setSelectedTaskForDetail(updated);
          return updated;
        }
        return task;
      })
    })));
  };

  const handleCommit = (sectionId: string, name?: string) => {
    const finalName = name || sectionDrafts[sectionId]?.name;
    if (!finalName || !finalName.trim()) {
      setActiveAddSectionId(null);
      return;
    }
    const newTask: Task = {
      id: generateId(),
      name: finalName,
      dueDate: '',
      collaborators: [],
      projects: [],
      visibility: 'Only me'
    };
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, tasks: [...s.tasks, newTask] } : s));
    setSectionDrafts(prev => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
    setActiveAddSectionId(null);
    setActiveTaskId(newTask.id);
  };

  const updateDraft = (sectionId: string, name: string) => {
    setSectionDrafts(prev => ({ ...prev, [sectionId]: { ...(prev[sectionId] || { name: '', date: '' }), name } }));
  };

  const handleAddField = (field: any) => {
    const newCol: ColumnDef = {
      id: generateId(),
      name: field.label,
      type: field.id,
      width: '150px'
    };
    setActiveColumns([...activeColumns, newCol]);
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `1fr 140px 240px ${activeColumns.length > 0 ? activeColumns.map(c => c.width).join(' ') + ' ' : ''}40px`,
    alignItems: 'stretch'
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1f21] overflow-hidden h-full relative">
      <div className="px-12 pt-6 pb-2 flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center space-x-3">
             <div className={`w-8 h-8 rounded-full ${user.avatarColor} flex items-center justify-center text-xs font-bold text-white`}>{user.initials}</div>
             <h1 className="text-xl font-semibold flex items-center tracking-tight">My tasks <ChevronDown size={18} className="ml-1 text-[#a2a0a2]" /></h1>
           </div>
           <div className="flex items-center space-x-2">
             <button onClick={() => setIsPrivacyModalOpen(true)} className="flex items-center space-x-1.5 px-3 py-1.5 text-[13px] border border-[#333538] rounded hover:bg-[#333538] transition-all text-[#f5f5f5]">
               <Lock size={14} className="text-[#a2a0a2]" />
               <span>Share</span>
             </button>
             <button onClick={() => setIsCustomizeOpen(!isCustomizeOpen)} className={`flex items-center space-x-1.5 px-3 py-1.5 text-[13px] border border-[#333538] rounded transition-all ${isCustomizeOpen ? 'bg-[#333538] text-white border-white' : 'hover:bg-[#333538] text-[#f5f5f5]'}`}>
               <Settings2 size={14} className={isCustomizeOpen ? 'text-white' : 'text-[#a2a0a2]'} />
               <span>Customize</span>
             </button>
           </div>
        </div>
        <div className="flex items-center space-x-2 border-b border-[#333538] h-[40px] overflow-x-auto no-scrollbar">
          {projectTabs.map((tab) => (
            <div key={tab.id} onClick={() => setActiveTabId(tab.id)} className={`group relative flex items-center h-[32px] px-3 cursor-pointer transition-all ${activeTabId === tab.id ? 'text-white' : 'text-[#a2a0a2] hover:text-white'}`}>
              <span className="text-[14px] font-medium whitespace-nowrap">{tab.label}</span>
              {activeTabId === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full translate-y-[4px]" />}
            </div>
          ))}
          <button ref={addViewBtnRef} onClick={() => setIsAddViewMenuOpen(!isAddViewMenuOpen)} className="ml-1.5 p-1 rounded-md text-[#a2a0a2] hover:text-white hover:bg-[#333538]/50"><Plus size={18} /></button>
          {isAddViewMenuOpen && <AddViewMenu anchorRef={addViewBtnRef} onClose={() => setIsAddViewMenuOpen(false)} onSelect={(type) => {}} />}
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden relative">
        <div className={`flex-1 flex flex-col min-h-0 min-w-0 transition-all duration-300 ${isCustomizeOpen ? 'mr-[360px]' : ''}`}>
           <ListView 
             sections={sections}
             toggleSection={toggleSection}
             activeAddSectionId={activeAddSectionId}
             setActiveAddSectionId={setActiveAddSectionId}
             activeTaskId={activeTaskId}
             setActiveTaskId={setActiveTaskId}
             handleUpdateTask={handleUpdateTask}
             handleCommit={handleCommit}
             drafts={sectionDrafts}
             updateDraft={updateDraft}
             teammates={members}
             activeColumns={activeColumns}
             onAddField={handleAddField}
             onOpenLibrary={() => setIsFieldLibraryModalOpen(true)}
             gridStyle={gridStyle}
             onSelectTask={setSelectedTaskForDetail}
           />
        </div>
        <CustomizePanel isOpen={isCustomizeOpen} onClose={() => setIsCustomizeOpen(false)} />
        <ManagePrivacyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
        <AddFieldLibraryModal isOpen={isFieldLibraryModalOpen} onClose={() => setIsFieldLibraryModalOpen(false)} />
        <TaskDetailDrawer task={selectedTaskForDetail} projects={projects} onClose={() => setSelectedTaskForDetail(null)} onUpdate={(updates) => selectedTaskForDetail && handleUpdateTask(selectedTaskForDetail.id, updates)} />
      </div>
    </div>
  );
};

const ListView: React.FC<{ 
  sections: TaskSection[], toggleSection: (id: string) => void, 
  activeAddSectionId: string | null, setActiveAddSectionId: (id: string | null) => void, 
  activeTaskId: string | null, setActiveTaskId: (id: string | null) => void,
  handleUpdateTask: (taskId: string, updates: Partial<Task>) => void,
  handleCommit: (sectionId: string, name?: string) => void,
  drafts: Record<string, { name: string; date: string }>,
  updateDraft: (sectionId: string, name: string) => void,
  teammates: Teammate[],
  activeColumns: ColumnDef[],
  onAddField: (field: any) => void,
  onOpenLibrary: () => void,
  gridStyle: React.CSSProperties,
  onSelectTask: (task: Task) => void
}> = ({ sections, toggleSection, activeAddSectionId, setActiveAddSectionId, activeTaskId, setActiveTaskId, handleUpdateTask, handleCommit, drafts, updateDraft, teammates, activeColumns, onAddField, onOpenLibrary, gridStyle, onSelectTask }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const addFieldBtnRef = useRef<HTMLButtonElement>(null);
  const buttonGroupRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="flex flex-col items-stretch px-12 min-w-max">
        <div className="py-3 flex items-center justify-between border-b border-[#333538] bg-[#1e1f21] z-30">
          <div ref={buttonGroupRef} className="flex items-center h-[28px] relative">
            <button onClick={() => setActiveAddSectionId(sections[0].id)} className="flex items-center gap-1.5 bg-[#4573d2] hover:bg-[#5884e4] text-white px-3 h-full rounded-l-[4px] border-r border-blue-400/30 font-medium text-[13px]"><Plus size={16} strokeWidth={2.5} /><span>Add task</span></button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center justify-center bg-[#4573d2] hover:bg-[#5884e4] text-white w-[28px] h-full rounded-r-[4px]"><ChevronDown size={14} /></button>
            {isMenuOpen && <AddTaskDropdown anchorRef={buttonGroupRef} onClose={() => setIsMenuOpen(false)} onSelect={() => {}} />}
          </div>
          <div className="flex items-center gap-6 text-[#a2a0a2]">
            <div className="flex items-center gap-2 hover:text-white cursor-pointer"><SlidersHorizontal size={14} /><span className="text-[12px]">Options</span></div>
          </div>
        </div>
        
        <div style={gridStyle} className="border-b border-[#333538] bg-[#1e1f21] text-[11px] uppercase text-[#a2a0a2] font-semibold tracking-wider h-10 sticky top-0 z-20">
          <div className={`flex items-center h-full px-6 ${CELL_BORDER}`}>Name</div>
          <div className={`flex items-center h-full px-4 justify-center ${CELL_BORDER}`}>Due date</div>
          <div className={`flex items-center h-full px-4 ${CELL_BORDER}`}>Collaborators</div>
          {activeColumns.map(col => (<div key={col.id} className={`flex items-center h-full px-4 ${CELL_BORDER}`}>{col.name}</div>))}
          <div className="flex items-center justify-center h-full px-4">
            <button ref={addFieldBtnRef} onClick={() => setIsAddFieldOpen(!isAddFieldOpen)} className="w-6 h-6 bg-[#2a2b2d] hover:bg-[#3c4043] rounded flex items-center justify-center"><Plus size={14} className="text-white" /></button>
            {isAddFieldOpen && <AddFieldDropdown anchorRef={addFieldBtnRef} onClose={() => setIsAddFieldOpen(false)} onSelectField={onAddField} onOpenLibrary={onOpenLibrary} />}
          </div>
        </div>

        <div className="pb-32">
          {sections.map(section => (
            <div key={section.id} className="border-b border-[#333538]">
              <div className="flex items-center py-4 px-6 mt-4 cursor-pointer hover:bg-[#2e2e30]" onClick={() => toggleSection(section.id)}>
                {section.isExpanded ? <ChevronDown size={14} className="mr-2 text-[#a2a0a2]" /> : <ChevronRight size={14} className="mr-2 text-[#a2a0a2]" />}
                <span className="font-semibold text-[14px] text-white tracking-tight">{section.title}</span>
              </div>
              {section.isExpanded && (
                <div className="flex flex-col">
                  {section.tasks.map(task => (
                    <TaskRow 
                      key={task.id} 
                      task={task} 
                      isActive={activeTaskId === task.id} 
                      onSelect={() => { setActiveTaskId(task.id); onSelectTask(task); }} 
                      onUpdate={(updates) => handleUpdateTask(task.id, updates)} 
                      teammates={teammates} 
                      activeColumns={activeColumns}
                      gridStyle={gridStyle}
                    />
                  ))}
                  <div style={gridStyle} className="min-h-[48px] px-0 border-t border-[#333538] hover:bg-[#2e2e30] cursor-text" onClick={() => setActiveAddSectionId(section.id)}>
                    <div className={`flex items-center h-full px-12 ${CELL_BORDER}`}>
                      <Circle size={14} className="text-gray-600 mr-3" />
                      {activeAddSectionId === section.id ? (
                        <div className="flex-1 h-8 flex items-center px-2 rounded-[4px] border-2 border-[#4573d2] bg-[#1e1f21]">
                          <input autoFocus type="text" value={drafts[section.id]?.name || ''} onChange={(e) => updateDraft(section.id, e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCommit(section.id)} onBlur={() => handleCommit(section.id)} placeholder="Add task..." className="bg-transparent border-none outline-none text-white w-full h-full text-[13px]" />
                        </div>
                      ) : (
                        <span className="text-[#a2a0a2] text-[13px] italic">Add task...</span>
                      )}
                    </div>
                    <div className={`${CELL_BORDER} h-full`} />
                    <div className={`${CELL_BORDER} h-full`} />
                    {activeColumns.map(col => (<div key={col.id} className={`${CELL_BORDER} h-full`} />))}
                    <div className="h-full" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskTable;
