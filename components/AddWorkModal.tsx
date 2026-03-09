
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { Project } from '../types';

interface AddWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWork: () => void;
  availableProjects: Project[];
}

const AddWorkModal: React.FC<AddWorkModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddWork, 
  availableProjects 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter projects based on the search query against the real project state
  const filteredProjects = useMemo(() => {
    return availableProjects.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableProjects, searchQuery]);

  const handleSelectProject = (project: Project) => {
    setSelectedProjectId(project.id);
    setSearchQuery(project.name);
    // BUG FIX: Decouple from name field. Removing auto-populate per requirements.
    // The "Name" field must now only accept manual keyboard input.
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWork();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px] animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[520px] bg-[#1e1f21] border border-[#333538] rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-visible"
      >
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-[14px] font-bold text-white tracking-tight">
              Work in Wurkfine <span className="text-red-500">*</span>
            </h2>
            <p className="text-[13px] text-[#a2a0a2] leading-relaxed pr-8">
              Members of this team will not be automatically granted access to work linked in this space. 
              <span className="text-[#4573d2] hover:underline cursor-pointer ml-1">Learn more about curated work</span>
            </p>
          </div>

          {/* Searchable Combobox Field - Dynamic Sync with Sidebar */}
          <div className="relative" ref={dropdownRef}>
            <div className="relative group">
              <input 
                ref={inputRef}
                type="text"
                placeholder="Search for a project..."
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                  if (selectedProjectId) setSelectedProjectId(null);
                }}
                className={`w-full bg-[#252628] border rounded-lg px-4 py-2.5 text-[14px] text-white outline-none transition-all placeholder-[#52555a] ${isDropdownOpen ? 'border-[#4573d2] ring-1 ring-[#4573d2]' : 'border-[#333538]'}`}
                autoFocus
              />
            </div>

            {/* Project Dropdown List */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#1e1f21] border border-[#3a3b3c] rounded-lg shadow-2xl z-[150] max-h-[220px] overflow-y-auto dropdown-scrollbar p-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <div 
                      key={project.id}
                      onClick={() => handleSelectProject(project)}
                      className="px-3 py-2 rounded-md text-[14px] text-white hover:bg-[#2e2e30] cursor-pointer flex items-center space-x-3 transition-colors group"
                    >
                      {/* Standard Project Color Square matching Sidebar */}
                      <div className="w-4 h-4 rounded-sm shadow-sm flex-shrink-0" style={{ backgroundColor: project.color }} />
                      <span className="flex-1 font-medium truncate">{project.name}</span>
                      {selectedProjectId === project.id && <Check size={14} className="text-[#4573d2]" />}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-[13px] text-[#a2a0a2] italic">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Name Field - Independent manual input */}
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-white">Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#252628] border border-[#333538] rounded-lg px-4 py-2.5 text-[14px] text-white focus:border-[#4573d2] focus:ring-1 focus:ring-[#4573d2] outline-none transition-all placeholder-[#52555a]"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-white">Description</label>
            <input 
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#252628] border border-[#333538] rounded-lg px-4 py-2.5 text-[14px] text-white focus:border-[#4573d2] focus:ring-1 focus:ring-[#4573d2] outline-none transition-all placeholder-[#52555a]"
            />
          </div>

          {/* Action Footer Button */}
          <div className="pt-2">
            <button 
              onClick={handleSubmit}
              className="bg-[#4573d2] hover:bg-[#5a87e5] text-white px-5 py-2 rounded-lg text-[13px] font-semibold transition-all shadow-md active:scale-[0.98]"
            >
              Add work
            </button>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#a2a0a2] hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default AddWorkModal;
