
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Home, Inbox, CheckCircle2, Folder, Briefcase, Star, Plus, 
  MessageSquare, TrendingUp, Compass, Zap, FileText, 
  BarChart3, UserPlus, BookOpen, Users as UsersIcon,
  ClipboardList, Target, PieChart
} from 'lucide-react';
import { NavTab, WorkspaceView } from '../types';

interface MainSidebarProps {
  activeNav: NavTab;
  currentView: WorkspaceView;
  onViewChange: (view: WorkspaceView) => void;
  onOpenTemplates?: () => void;
}

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  hasPlus?: boolean;
  onPlusClick?: (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, active, onClick, hasPlus, onPlusClick }) => {
  const plusRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      onClick={onClick}
      className={`group relative flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-150 mx-2 mb-0.5 ${
      active 
        ? 'bg-zinc-800 text-white font-medium shadow-sm' 
        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
    }`}>
      <div className="flex items-center space-x-2.5">
        <div className={`transition-colors ${active ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
          {React.cloneElement(icon as React.ReactElement, { size: 18, strokeWidth: active ? 2 : 1.5 })}
        </div>
        <span className="text-[13px]">{label}</span>
      </div>
      {hasPlus && (
        <div 
          ref={plusRef}
          onClick={(e) => {
            e.stopPropagation();
            onPlusClick?.(e, plusRef);
          }}
          className="p-1 rounded hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
        >
          <Plus size={16} className="text-zinc-400 hover:text-white" />
        </div>
      )}
    </div>
  );
};

interface DropdownProps {
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  onNewProject: () => void;
}

const NewProjectDropdown: React.FC<DropdownProps> = ({ onClose, anchorRef, onNewProject }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8,
        left: rect.right + 12,
      });
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [anchorRef, onClose]);

  return createPortal(
    <div 
      ref={menuRef}
      style={{ top: position.top, left: position.left }}
      className="fixed z-[9999] w-[210px] bg-[#2a2b2d] border border-zinc-800 rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.85)] py-2 animate-in fade-in zoom-in-95 duration-100 pointer-events-auto ring-1 ring-white/5"
    >
      <button 
        onClick={() => { onNewProject(); onClose(); }}
        className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-zinc-800 transition-colors group mx-1 rounded-md w-[calc(100%-8px)]"
      >
        <ClipboardList size={18} className="text-zinc-400 group-hover:text-white" />
        <span className="text-[13px] text-white font-medium">New project</span>
      </button>
      <button 
        onClick={() => { onClose(); }}
        className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-zinc-800 transition-colors group mx-1 rounded-md w-[calc(100%-8px)]"
      >
        <Folder size={18} className="text-zinc-400 group-hover:text-white" />
        <span className="text-[13px] text-white font-medium">New portfolio</span>
      </button>
    </div>,
    document.body
  );
};

const MainSidebar: React.FC<MainSidebarProps> = ({ activeNav, currentView, onViewChange, onOpenTemplates }) => {
  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);
  const projectsPlusAnchor = useRef<React.RefObject<HTMLDivElement | null>>({ current: null });

  const handleProjectsPlusClick = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
    projectsPlusAnchor.current = ref;
    setIsProjectsMenuOpen(true);
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'Work':
        return (
          <>
            <nav className="space-y-0.5">
              <SidebarLink 
                icon={<Home />} 
                label="Home" 
                active={currentView === 'Home'}
                onClick={() => onViewChange('Home')} 
              />
              <SidebarLink 
                icon={<Inbox />} 
                label="Inbox" 
                active={currentView === 'Inbox'}
                onClick={() => onViewChange('Inbox')} 
              />
              <div className="my-3 border-t border-zinc-800 mx-4" />
              <SidebarLink 
                icon={<CheckCircle2 />} 
                label="My tasks" 
                active={currentView === 'My Tasks'}
                onClick={() => onViewChange('My Tasks')}
              />
            </nav>

            <div className="mt-8">
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Insights</span>
                <Plus size={14} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
              </div>
              <SidebarLink 
                icon={<PieChart />} 
                label="Reporting" 
                active={currentView === 'Reporting'}
                onClick={() => onViewChange('Reporting')} 
              />
              <SidebarLink 
                icon={<Folder />} 
                label="Portfolios" 
                active={currentView === 'Portfolios'}
                onClick={() => onViewChange('Portfolios')} 
              />
              <SidebarLink 
                icon={<Target />} 
                label="Goals" 
                active={currentView === 'Goals'}
                onClick={() => onViewChange('Goals')} 
              />
            </div>

            <div className="mt-8 relative">
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Projects</span>
                <Plus 
                  size={14} 
                  className="text-zinc-500 hover:text-white cursor-pointer transition-colors"
                  onClick={(e) => handleProjectsPlusClick(e, { current: e.currentTarget as any })}
                />
              </div>
              <SidebarLink 
                icon={<Briefcase />} 
                label="Cross-functional project pl..." 
                active={currentView === 'Projects'}
                onClick={() => onViewChange('Projects')}
              />
              {isProjectsMenuOpen && (
                <NewProjectDropdown 
                  anchorRef={projectsPlusAnchor.current} 
                  onClose={() => setIsProjectsMenuOpen(false)} 
                  onNewProject={onOpenTemplates || (() => {})}
                />
              )}
            </div>
          </>
        );
      case 'Strategy':
        return (
          <div className="px-2">
            <h3 className="px-4 py-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Strategic Planning</h3>
            <nav className="space-y-0.5">
              <SidebarLink icon={<TrendingUp />} label="Goals" onClick={() => {}} />
              <SidebarLink icon={<Compass />} label="Roadmaps" onClick={() => {}} />
              <SidebarLink icon={<Star />} label="Strategic Initiatives" onClick={() => {}} />
            </nav>
          </div>
        );
      case 'Workflow':
        return (
          <div className="px-2">
            <h3 className="px-4 py-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Automations</h3>
            <nav className="space-y-0.5">
              <SidebarLink icon={<Zap />} label="Rules" onClick={() => {}} />
              <SidebarLink icon={<FileText />} label="Forms" onClick={() => {}} />
              <SidebarLink icon={<BarChart3 />} label="Reporting" onClick={() => {}} />
            </nav>
          </div>
        );
      case 'People':
        return (
          <div className="px-2">
            <h3 className="px-4 py-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Collaboration</h3>
            <nav className="space-y-0.5">
              <SidebarLink icon={<UserPlus />} label="Invite People" onClick={() => {}} />
              <SidebarLink icon={<BookOpen />} label="Knowledge Base" onClick={() => {}} />
              <SidebarLink icon={<UsersIcon />} label="Teams" onClick={() => {}} />
            </nav>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-60 bg-zinc-950 flex flex-col h-full flex-shrink-0 relative overflow-hidden border-r border-zinc-800">
      <div className="p-1 flex-1 overflow-y-auto custom-scrollbar">
        <div className="py-2">
          {renderContent()}
        </div>
      </div>
      <div className="p-4 bg-zinc-950 space-y-3 z-10 border-t border-zinc-800/50">
        <button className="w-full bg-[#f06a6a] text-white py-2 rounded-lg text-[13px] font-bold hover:bg-[#d55a5a] transition-colors shadow-sm">
          Add billing info
        </button>
        <button className="w-full flex items-center justify-center space-x-2 text-zinc-400 text-[13px] py-2 hover:bg-zinc-800 hover:text-white rounded-lg border border-zinc-800 transition-colors">
          <MessageSquare size={16} />
          <span className="font-medium">Invite teammates</span>
        </button>
      </div>
    </div>
  );
};

export default MainSidebar;
