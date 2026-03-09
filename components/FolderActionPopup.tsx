
import React from 'react';
import { ClipboardList } from 'lucide-react';

interface FolderActionPopupProps {
  label: string;
  position: { top: number; left: number };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const FolderActionPopup: React.FC<FolderActionPopupProps> = ({ label, position, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      className="fixed z-[100] w-[240px] bg-[#2a2b2d] border border-[#333538] rounded-lg shadow-2xl py-3 animate-in fade-in zoom-in-95 duration-100 flex flex-col pointer-events-auto"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Popover Header */}
      <div className="px-4 mb-3">
        <span className="text-[10px] font-bold text-[#a2a0a2] uppercase tracking-widest">
          {label}
        </span>
      </div>

      {/* Action Item: Create Project */}
      <div className="px-2">
        <button className="w-full flex items-center space-x-3 p-2 rounded-lg border border-[#454545] hover:bg-[#333538] hover:border-white/20 transition-all group text-left">
          <div className="flex-shrink-0 text-[#a2a0a2] group-hover:text-white transition-colors">
            <ClipboardList size={18} />
          </div>
          <span className="text-[13px] font-medium text-white">Create project</span>
        </button>
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-[#333538]" />

      {/* Footer Text */}
      <div className="px-4">
        <p className="text-[12px] text-[#a2a0a2] italic opacity-60">
          No projects in portfolio
        </p>
      </div>

      {/* Invisible buffer to bridge the gap if any */}
      <div className="absolute top-0 -left-2 bottom-0 w-2" />
    </div>
  );
};

export default FolderActionPopup;
