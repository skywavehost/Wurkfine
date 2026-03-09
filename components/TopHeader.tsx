
import React from 'react';
import { Search, HelpCircle, Sparkles, Menu } from 'lucide-react';

interface TopHeaderProps {
  onToggleSidebar?: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-[48px] bg-[#1e1f21] border-b border-[#2e2e30] flex items-center px-4 justify-between z-50 flex-shrink-0">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleSidebar}
          className="text-white hover:bg-[#2e2e30] p-1.5 rounded cursor-pointer transition-colors flex items-center justify-center outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center cursor-pointer">
          <img 
            src="https://skywavehost.com/wp-content/uploads/2026/01/logo.png" 
            alt="Wurkfine Logo" 
            className="h-[24px] w-auto object-contain antialiased"
          />
        </div>
      </div>

      <div className="flex-1 max-w-xl px-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a2a0a2]" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-[#2e2e30] border-none rounded-full py-1.5 pl-9 pr-4 text-sm focus:ring-1 focus:ring-[#4573d2] outline-none text-white placeholder-[#a2a0a2] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="p-1.5 hover:bg-[#2e2e30] rounded-full text-[#a2a0a2] cursor-pointer transition-colors">
          <HelpCircle size={20} />
        </div>
        <div className="flex items-center bg-[#f06a6a] hover:bg-[#d55a5a] rounded-full px-4 py-1.5 cursor-pointer transition-all shadow-lg active:scale-95">
          <Sparkles size={14} className="text-white mr-2" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">Join for $0</span>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
