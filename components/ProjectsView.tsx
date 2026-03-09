
import React from 'react';
import { Plus, Search, ChevronDown } from 'lucide-react';

const ProjectsView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#1e1f21] overflow-hidden">
      {/* Top Header Row: Title & Create Button */}
      <div className="px-8 py-5 flex items-center justify-between flex-shrink-0">
        <h1 className="text-2xl font-bold text-white tracking-tight">Browse projects</h1>
        <button className="bg-[#4573d2] text-white px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center hover:bg-[#5a87e5] transition-colors shadow-sm active:scale-[0.98]">
          <Plus size={18} className="mr-1.5" />
          Create project
        </button>
      </div>

      {/* Search & Filter Row: Subtle horizontal divider line below */}
      <div className="px-8 pb-4 border-b border-[#333538] flex-shrink-0">
        <div className="flex flex-col space-y-4">
          <div className="relative w-full max-w-4xl mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a2a0a2]" />
            <input 
              type="text" 
              placeholder="Find a project" 
              className="w-full bg-[#2a2b2d] border border-[#333538] rounded-full py-2 pl-11 pr-4 text-[14px] focus:ring-1 focus:ring-[#4573d2] outline-none text-white placeholder-[#a2a0a2] transition-all hover:bg-[#333538]"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            <FilterPill label="Owner" />
            <FilterPill label="Members" />
            <FilterPill label="Portfolios" />
            <FilterPill label="Status" />
          </div>
        </div>
      </div>

      {/* Main Content Area: Centered Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in duration-700 slide-in-from-bottom-2 overflow-y-auto">
        <div className="flex flex-col items-center max-w-sm w-full text-center">
          {/* Custom SVG Illustration for Clipboard */}
          <div className="relative w-64 h-56 mb-8 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
              <rect x="40" y="30" width="120" height="140" rx="10" fill="#ffffff" stroke="#fdeaea" strokeWidth="2" />
              {/* Clipboard Clip */}
              <rect x="85" y="20" width="30" height="15" rx="4" fill="#f06a6a" />
              <circle cx="100" cy="22" r="4" fill="#ffffff" />
              
              {/* Lines and circles */}
              <circle cx="65" cy="65" r="7" stroke="#f06a6a" strokeWidth="2" fill="none" />
              <rect x="80" y="62" width="55" height="6" rx="3" fill="#fdeaea" />
              
              <circle cx="65" cy="95" r="7" fill="#f06a6a" />
              <rect x="80" y="92" width="55" height="6" rx="3" fill="#f06a6a" />
              
              <circle cx="65" cy="125" r="7" stroke="#f06a6a" strokeWidth="2" fill="none" />
              <rect x="80" y="122" width="55" height="6" rx="3" fill="#fdeaea" />
              
              {/* Shadow shapes to add depth */}
              <path d="M 160 30 L 160 170 L 140 170 L 140 30 Z" fill="#fdeaea" opacity="0.3" />
            </svg>
          </div>

          <h2 className="text-[22px] font-bold text-white mb-2">Let's get started</h2>
          <p className="text-[#a2a0a2] text-[15px] mb-8 leading-relaxed px-4">
            Organize and plan your work with projects
          </p>

          <button className="px-8 py-2 bg-[#1e1f21] border border-[#454545] rounded-lg text-[14px] font-semibold text-white hover:bg-[#333538] hover:border-white/20 transition-all active:scale-[0.98]">
            Create project
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterPill: React.FC<{ label: string }> = ({ label }) => (
  <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#2a2b2d] border border-[#333538] rounded-lg text-[#a2a0a2] hover:text-white hover:bg-[#333538] transition-all group whitespace-nowrap">
    <span className="text-[13px] font-medium">{label}</span>
    <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
  </button>
);

export default ProjectsView;
