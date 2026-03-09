import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Info, Check } from 'lucide-react';
import { Project } from '../types';

interface InviteTeammatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  availableProjects: Project[];
}

const InviteTeammatesModal: React.FC<InviteTeammatesModalProps> = ({ 
  isOpen, 
  onClose, 
  onSend, 
  availableProjects 
}) => {
  const [emails, setEmails] = useState('');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Filter projects based on search query and exclude already selected ones
  const filteredProjects = availableProjects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !selectedProjectIds.includes(p.id)
  );

  const toggleProject = (id: string) => {
    setSelectedProjectIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
    setSearchQuery('');
    // Focus back on the search input to allow multi-selection
    inputRef.current?.focus();
  };

  const removeProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedProjectIds(prev => prev.filter(pid => pid !== id));
  };

  const handleSend = () => {
    if (emails.trim().length > 0) {
      onSend();
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container - Removed overflow-hidden to prevent clipping of the absolute dropdown */}
      <div 
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[580px] bg-[#1e1f21] border border-[#333538] rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-visible"
      >
        {/* Close Button Top Right */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#a2a0a2] hover:text-white transition-colors z-[110]"
        >
          <X size={20} />
        </button>

        <div className="p-8 space-y-8">
          {/* Header */}
          <h2 className="text-[20px] font-bold text-white tracking-tight">
            Invite people to My workspace
          </h2>

          {/* Email Input Section */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-white">Email addresses</label>
            <div className="w-full bg-[#1e1f21] border border-[#333538] rounded-lg min-h-[120px] p-4 transition-all focus-within:border-[#4573d2] focus-within:ring-1 focus-within:ring-[#4573d2]">
              <textarea 
                placeholder="name@gmail.com, name@gmail.com, ..."
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none text-[14px] text-white placeholder-[#52555a] resize-none custom-scrollbar"
                autoFocus
              />
            </div>
          </div>

          {/* Dynamic Project Field */}
          <div className="space-y-2 relative" ref={dropdownRef}>
            <div className="flex items-center space-x-1.5">
              <label className="text-[13px] font-bold text-white">Add to projects</label>
              <Info size={14} className="text-[#a2a0a2] cursor-help" />
            </div>

            <div 
              onClick={() => {
                setIsDropdownOpen(true);
                inputRef.current?.focus();
              }}
              className={`w-full bg-[#1e1f21] border border-[#333538] rounded-lg p-2 flex flex-wrap gap-2 items-center transition-all cursor-text min-h-[44px] ${isDropdownOpen ? 'border-white ring-1 ring-white shadow-[0_0_0_1px_white]' : 'hover:border-[#52555a]'}`}
            >
              {selectedProjectIds.map(id => {
                const project = availableProjects.find(p => p.id === id);
                return (
                  <div 
                    key={id}
                    className="flex items-center space-x-2 bg-[#333538] px-2.5 py-1 rounded-full text-[13px] text-white border border-[#454545] transition-colors group/chip"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project?.color || '#f472b6' }} />
                    <span className="font-medium">{project?.name}</span>
                    <button 
                      onClick={(e) => removeProject(e, id)}
                      className="text-[#a2a0a2] hover:text-red-400 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
              <input 
                ref={inputRef}
                type="text"
                placeholder={selectedProjectIds.length === 0 ? "Search for a project..." : ""}
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[14px] text-white min-w-[150px] placeholder-[#52555a]"
              />
            </div>

            {/* Dropdown List - Minimalist Scrollbar Implementation */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2b2d] border border-[#3c4043] rounded-lg shadow-2xl z-[150] max-h-[200px] overflow-y-auto dropdown-scrollbar animate-in fade-in slide-in-from-top-1 duration-150 p-1">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <div 
                      key={project.id}
                      onClick={() => toggleProject(project.id)}
                      className="px-3 py-2 rounded-md text-[14px] text-white hover:bg-[#333538] cursor-pointer flex items-center space-x-3 transition-colors group"
                    >
                      <div className="w-3.5 h-3.5 rounded-sm shadow-sm" style={{ backgroundColor: project.color }} />
                      <span className="flex-1 font-medium">{project.name}</span>
                      {selectedProjectIds.includes(project.id) && <Check size={14} className="text-[#4573d2]" />}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-[13px] text-[#a2a0a2] italic">
                    {searchQuery ? `No projects found for "${searchQuery}"` : "All available projects selected"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Footer - Added extra top margin and ensure it is below dropdown visibility if clipped */}
          <div className="flex justify-end pt-8">
            <button 
              onClick={handleSend}
              disabled={!emails.trim()}
              className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-all active:scale-[0.98] ${
                emails.trim() 
                ? 'bg-[#2a2b2d] border border-[#333538] text-white hover:bg-[#333538]' 
                : 'bg-[#2a2b2d] border border-[#333538] text-[#a2a0a2] opacity-50 cursor-not-allowed'
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default InviteTeammatesModal;