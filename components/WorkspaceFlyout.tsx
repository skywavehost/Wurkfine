
import React from 'react';
import { createPortal } from 'react-dom';
import { UserPlus, ClipboardList } from 'lucide-react';
import { Project } from '../types';

interface WorkspaceFlyoutProps {
  position: { top: number; left: number };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onInvite: () => void;
  onCreateProject: () => void;
  projects: Project[];
}

const WorkspaceFlyout: React.FC<WorkspaceFlyoutProps> = ({ 
  position, 
  onMouseEnter, 
  onMouseLeave,
  onInvite,
  onCreateProject,
  projects
}) => {
  return createPortal(
    <div 
      className="fixed z-[10001] w-[260px] bg-[#1e1f21] border border-[#3a3b3c] rounded-lg shadow-[0_12px_48px_rgba(0,0,0,0.85)] py-2 animate-in fade-in zoom-in-95 duration-100 flex flex-col pointer-events-auto"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header */}
      <div className="px-3 py-1 mb-1">
        <span className="text-[10px] font-bold text-[#a2a0a2] uppercase tracking-widest opacity-60">
          My workspace
        </span>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col">
        <button 
          onClick={onInvite}
          className="flex items-center justify-between px-3 py-2 hover:bg-[#2e2e30] transition-colors group text-left outline-none"
        >
          <div className="flex items-center space-x-3">
            <UserPlus size={18} strokeWidth={1.5} className="text-[#a2a0a2] group-hover:text-white" />
            <span className="text-[13px] font-medium text-white tracking-tight">Invite teammates</span>
          </div>
          <div className="flex -space-x-1.5 ml-2">
            <div className="w-5 h-5 rounded-full bg-pink-500 border border-[#1e1f21] flex items-center justify-center text-[8px] font-bold text-white shadow-sm">TT</div>
            <div className="w-5 h-5 rounded-full border border-dashed border-[#454545] bg-[#2a2b2d] flex items-center justify-center text-[#a2a0a2]"><div className="w-2 h-2 rounded-full border border-[#454545]" /></div>
            <div className="w-5 h-5 rounded-full border border-dashed border-[#454545] bg-[#2a2b2d] flex items-center justify-center text-[#a2a0a2]"><div className="w-2 h-2 rounded-full border border-[#454545]" /></div>
            <div className="w-5 h-5 rounded-full border border-dashed border-[#454545] bg-[#2a2b2d] flex items-center justify-center text-[#a2a0a2]"><div className="w-2 h-2 rounded-full border border-[#454545]" /></div>
          </div>
        </button>

        <button 
          onClick={onCreateProject}
          className="flex items-center space-x-3 px-3 py-2 hover:bg-[#2e2e30] transition-colors group text-left outline-none"
        >
          <ClipboardList size={18} strokeWidth={1.5} className="text-[#a2a0a2] group-hover:text-white" />
          <span className="text-[13px] font-medium text-white tracking-tight">Create project</span>
        </button>
      </div>

      {/* Divider */}
      <div className="my-1 border-t border-[#333538]" />

      {/* Dynamic Project List (Synced with Sidebar) */}
      <div className="flex flex-col py-1">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="flex items-center space-x-3 px-3 py-2 hover:bg-[#2e2e30] transition-colors group cursor-pointer"
          >
            <div 
              className="w-4 h-4 rounded-[4px] flex-shrink-0 flex items-center justify-center shadow-sm"
              style={{ backgroundColor: project.color }}
            >
              <div className="w-2 h-2 rounded-full border border-black/10 opacity-30" />
            </div>
            <span className="text-[13px] font-medium text-[#a2a0a2] group-hover:text-white tracking-tight">
              {project.name.toLowerCase()}
            </span>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="px-3 py-2">
            <span className="text-[12px] italic text-[#52555a]">No projects added yet</span>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default WorkspaceFlyout;
