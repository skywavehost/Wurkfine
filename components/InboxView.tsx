import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Filter, ArrowUpDown, LayoutList, MoreHorizontal, MessageSquare, Bell, X
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { createPortal } from 'react-dom';

interface InboxTab {
  id: string;
  name: string;
}

const InboxView: React.FC = () => {
  const { notifications } = useUser();
  const [tabs, setTabs] = useState<InboxTab[]>([
    { id: 'activity', name: 'Activity' },
    { id: 'bookmarks', name: 'Bookmarks' },
    { id: 'archive', name: 'Archive' },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('activity');
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [dropdownTabId, setDropdownTabId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const plusBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (editingTabId && inputRef.current) {
      inputRef.current.focus();
      // Emulate standard text selection highlight shown in screenshot
      inputRef.current.select();
    }
  }, [editingTabId]);

  const handleAddTab = () => {
    const newId = `custom-${Date.now()}`;
    const newTab = { id: newId, name: 'New tab' };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setEditingTabId(newId);
    setEditValue('New tab');
  };

  const handleRename = (id: string, newName: string) => {
    setTabs(tabs.map(t => t.id === id ? { ...t, name: newName || 'Untitled' } : t));
    setEditingTabId(null);
  };

  const handleRemoveTab = (id: string) => {
    if (['activity', 'bookmarks', 'archive'].includes(id)) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) setActiveTabId('activity');
    setDropdownTabId(null);
  };

  const handleDuplicateTab = (id: string) => {
    const tabToCopy = tabs.find(t => t.id === id);
    if (!tabToCopy) return;
    const newId = `custom-${Date.now()}`;
    const newTab = { id: newId, name: `${tabToCopy.name} (copy)` };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setDropdownTabId(null);
  };

  const openDropdown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    // Position dropdown exactly below the tab text
    setDropdownPos({ top: rect.bottom + 8, left: rect.left });
    setDropdownTabId(id);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden animate-in fade-in duration-500" onClick={() => setDropdownTabId(null)}>
      {/* Inbox Header Area */}
      <div className="px-6 pt-5 pb-0 flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Inbox</h1>
          <button className="px-3 py-1.5 text-[12px] font-medium border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors text-white">
            Manage notifications
          </button>
        </div>

        {/* Tabs Row */}
        <div className="flex items-center space-x-5 border-b border-zinc-800 relative">
          {tabs.map((tab) => (
            <div key={tab.id} className="relative group/tab flex items-center h-[40px]">
              {editingTabId === tab.id ? (
                <div className="pb-3 px-1">
                  {/* Inline Edit UI: White rounded outline, zinc-800 bg */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleRename(tab.id, editValue)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename(tab.id, editValue)}
                    className="bg-zinc-800 text-white text-[13px] font-medium px-2 py-1 rounded-md ring-2 ring-white outline-none w-[110px] shadow-lg selection:bg-blue-600"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full" />
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    if (activeTabId === tab.id && !['activity', 'bookmarks', 'archive'].includes(tab.id)) {
                      openDropdown(e, tab.id);
                    } else {
                      setActiveTabId(tab.id);
                    }
                  }}
                  onContextMenu={(e) => {
                    if (!['activity', 'bookmarks', 'archive'].includes(tab.id)) {
                      openDropdown(e, tab.id);
                    }
                  }}
                  className={`pb-3 px-1 text-[14px] font-medium transition-all relative whitespace-nowrap h-full flex items-center ${
                    activeTabId === tab.id ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="mb-[-12px]">{tab.name}</span>
                  {activeTabId === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full" />
                  )}
                </button>
              )}
            </div>
          ))}
          
          {/* Add Tab Button with Tooltip */}
          <div className="relative h-[40px] flex items-center">
            <button 
              ref={plusBtnRef}
              onClick={handleAddTab}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-zinc-400 hover:text-white transition-colors p-1.5 hover:bg-zinc-800 rounded-md mb-2"
            >
              <Plus size={18} />
            </button>
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2.5 py-1.5 bg-zinc-800 text-white text-[12px] font-medium rounded shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap pointer-events-none z-50 animate-in fade-in zoom-in-95">
                Add tab
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[5px] border-t-zinc-800" />
              </div>
            )}
          </div>
        </div>

        {/* Toolbar Row */}
        <div className="py-3 flex items-center justify-between border-b border-zinc-800 text-zinc-400">
          <div className="flex items-center space-x-6">
            {activeTabId === 'activity' && (
              <>
                <div className="flex items-center space-x-1.5 hover:text-white cursor-pointer group transition-colors">
                  <Filter size={14} />
                  <span className="text-[12px] font-medium">Filter</span>
                </div>
                <div className="flex items-center space-x-1.5 hover:text-white cursor-pointer group transition-colors">
                  <ArrowUpDown size={14} />
                  <span className="text-[12px] font-medium">Sort: Newest</span>
                </div>
              </>
            )}
            <div className="flex items-center space-x-1.5 hover:text-white cursor-pointer group transition-colors">
              <LayoutList size={14} />
              <span className="text-[12px] font-medium">Density: Detailed</span>
            </div>
          </div>
          <button className="p-1 hover:text-white transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Rendering */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {activeTabId === 'activity' ? (
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-center py-5">
              <span className="text-[13px] font-medium text-zinc-400">Today</span>
            </div>

            <div className="flex flex-col border-t border-zinc-800">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex px-12 py-6 border-b border-zinc-800/50 group hover:bg-zinc-900/40 transition-colors">
                  <div className="mr-4 mt-0.5">
                    <MessageSquare size={18} className="text-zinc-500" />
                  </div>
                  <div className="flex-1 flex flex-col space-y-1">
                    <span className="text-[15px] font-bold text-white leading-snug">{notif.title}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-sky-400 flex items-center justify-center overflow-hidden shadow-sm">
                        <img src={notif.senderAvatar} alt={notif.sender} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[13px] font-bold text-white">{notif.sender}</span>
                      <span className="text-zinc-500 text-[12px] font-medium">· {notif.timestamp}</span>
                    </div>
                    <p className="text-[14px] text-zinc-300 leading-relaxed pt-0.5">{notif.content}</p>
                  </div>
                  {notif.isUnread && (
                    <div className="ml-4 mt-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="px-12 py-4">
               <button className="text-blue-500 text-[13px] font-medium hover:underline">Archive all notifications</button>
            </div>
          </div>
        ) : activeTabId === 'bookmarks' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="relative mb-8 transform -rotate-12">
              <div className="relative p-6 bg-white rounded-full shadow-2xl">
                 <Bell size={64} className="text-rose-50 font-bold" fill="#fff1f2" />
                 <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 border-2 border-white rounded-full shadow-md" />
              </div>
            </div>
            <h3 className="text-[20px] font-bold text-white mb-2 tracking-tight">Bookmark important notifications</h3>
            <p className="text-[14px] text-zinc-400 mb-6 font-medium">Bookmark a notification to see it here.</p>
            <button className="px-5 py-1.5 bg-[#4573d2] hover:bg-[#5a87e5] text-white rounded-lg text-[13px] font-bold transition-all shadow-lg">Try it</button>
          </div>
        ) : activeTabId === 'archive' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
            <h3 className="text-[20px] font-bold text-white mb-2 tracking-tight">You haven't archived any notifications yet.</h3>
            <p className="text-[14px] text-zinc-400 mb-6 font-medium">Click the archive icon in the top right of a notification to archive it.</p>
            <button onClick={() => setActiveTabId('activity')} className="px-6 py-2 bg-[#4573d2] hover:bg-[#5a87e5] text-white rounded-lg text-[14px] font-bold transition-all">Back to Activity</button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-zinc-500 italic border-t border-zinc-800">
            <div className="text-center">
               <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                 <MessageSquare size={24} className="text-zinc-700" />
               </div>
               <p className="text-[15px] font-medium">This tab is currently empty.</p>
               <p className="text-[13px] opacity-60">Custom work views will appear here as activity occurs.</p>
            </div>
          </div>
        )}
      </div>

      {/* Tab Context Dropdown Menu - Stylized to match 'chris' screenshot */}
      {dropdownTabId && createPortal(
        <div 
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
          className="fixed z-[1000] w-[210px] bg-[#2a2b2d] border border-[#3c4043] rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.85)] py-2 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => { setEditingTabId(dropdownTabId); setEditValue(tabs.find(t => t.id === dropdownTabId)?.name || ''); setDropdownTabId(null); }}
            className="w-full text-left px-4 py-2.5 text-[14px] text-white hover:bg-[#333538] transition-colors flex items-center font-medium"
          >
            Rename
          </button>
          <button 
            className="w-full text-left px-4 py-2.5 text-[14px] text-white hover:bg-[#333538] transition-colors flex items-center font-medium"
          >
            Set as default
          </button>
          <button 
            onClick={() => handleDuplicateTab(dropdownTabId)}
            className="w-full text-left px-4 py-2.5 text-[14px] text-white hover:bg-[#333538] transition-colors flex items-center font-medium"
          >
            Make a copy
          </button>
          <div className="h-[1px] bg-zinc-800 my-1.5 mx-3" />
          <button 
            onClick={() => handleRemoveTab(dropdownTabId)}
            className="w-full text-left px-4 py-2.5 text-[14px] text-red-500 hover:text-red-400 hover:bg-[#333538] transition-colors flex items-center font-medium"
          >
            Remove
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};

export default InboxView;