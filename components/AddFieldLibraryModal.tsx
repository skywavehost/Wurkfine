
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen, Filter, Search, Percent, Clock } from 'lucide-react';

interface AddFieldLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFieldLibraryModal: React.FC<AddFieldLibraryModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'library'>('library');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container - Tightened dimensions and padding */}
      <div 
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[540px] bg-[#1e1f21] border border-[#333538] rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.85)] ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden h-[520px]"
      >
        {/* Header - Reduced padding and spacing */}
        <div className="px-6 pt-5 pb-1 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-white tracking-tight leading-none">Add field</h2>
          <div className="flex items-center space-x-2.5">
            <button className="p-1 text-[#a2a0a2] hover:text-white transition-colors">
              <BookOpen size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-1 text-[#a2a0a2] hover:text-white hover:bg-[#333538] rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs - Smaller font and tighter vertical footprint */}
        <div className="px-6 flex items-center space-x-6 border-b border-[#333538]/50 flex-shrink-0">
          <button 
            onClick={() => setActiveTab('create')}
            className={`pb-2.5 text-[13px] font-semibold transition-all relative ${
              activeTab === 'create' ? 'text-white' : 'text-[#a2a0a2] hover:text-white'
            }`}
          >
            Create new
          </button>
          <button 
            onClick={() => setActiveTab('library')}
            className={`pb-2.5 text-[13px] font-semibold transition-all relative ${
              activeTab === 'library' ? 'text-white' : 'text-[#a2a0a2] hover:text-white'
            }`}
          >
            Choose from library
            {activeTab === 'library' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full" />
            )}
          </button>
        </div>

        {/* Content Area - Compact padding */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Search & Filter - Reduced heights and tighter grouping */}
          <div className="flex items-center space-x-2.5 mb-6">
            <div className="flex-1 relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a2a0a2] group-focus-within:text-white transition-colors" />
              <input 
                type="text" 
                placeholder="Find a field in My workspace"
                className="w-full bg-[#2a2b2d] border border-[#333538] rounded-md h-8 pl-9 pr-3 text-[13px] text-white outline-none focus:border-[#4573d2] focus:ring-1 focus:ring-[#4573d2] transition-all placeholder-[#52555a]"
                autoFocus
              />
            </div>
            <button className="flex items-center space-x-2 px-2.5 h-8 bg-[#2a2b2d] border border-[#333538] rounded-md hover:bg-[#333538] transition-colors text-[12px] font-medium text-white group">
              <Filter size={13} className="text-[#a2a0a2] group-hover:text-white" />
              <span>Filter</span>
            </button>
          </div>

          {/* List Headers - Smaller and lighter */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#333538]/50 mb-1">
            <span className="text-[10px] font-bold text-[#a2a0a2] uppercase tracking-wider">Recent fields in your org</span>
            <span className="text-[10px] font-bold text-[#a2a0a2] uppercase tracking-wider pr-8">Type</span>
          </div>

          {/* Field Items - Reduced vertical gap */}
          <div className="flex-1 overflow-y-auto custom-scrollbar -mx-1 px-1 pt-0.5 space-y-0.5">
            <LibraryItem 
              title="Percent allocation"
              description="Wurkfine-created. Percent allocation is a percentage of a person's time that will be spent on the work."
              icon={<Percent size={16} />}
            />
            <LibraryItem 
              title="Estimated time"
              description="Use this field to measure your team’s workload based on how long they think their tasks require."
              icon={<Clock size={16} />}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const LibraryItem: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="flex items-center justify-between py-2.5 px-3 hover:bg-[#2e2e30]/50 rounded-md cursor-pointer group transition-all duration-150 border border-transparent hover:border-[#333538]/50">
    <div className="flex flex-col space-y-0.5 flex-1 pr-8">
      <div className="flex items-center space-x-1.5">
        <h3 className="text-[13px] font-bold text-white tracking-tight leading-none">{title}</h3>
        <AsanaLogo />
      </div>
      <p className="text-[12px] text-[#a2a0a2] leading-tight pr-4 opacity-90">{description}</p>
    </div>
    <div className="flex items-center">
      <div className="text-[#a2a0a2] w-8 flex justify-center flex-shrink-0 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="w-2" />
    </div>
  </div>
);

const AsanaLogo = () => (
  <div className="flex flex-col items-center justify-center w-3 h-3 ml-0.5 opacity-90">
    <div className="w-1.5 h-1.5 rounded-full bg-[#f06a6a] mb-[1px]" />
    <div className="flex gap-[1px]">
      <div className="w-1.5 h-1.5 rounded-full bg-[#f06a6a]" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#f06a6a]" />
    </div>
  </div>
);

export default AddFieldLibraryModal;
