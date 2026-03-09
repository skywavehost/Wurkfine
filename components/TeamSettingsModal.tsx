import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, Users, CheckCircle2 } from 'lucide-react';

interface TeamSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTeam: (hasDescription: boolean) => void;
}

const TeamSettingsModal: React.FC<TeamSettingsModalProps> = ({ isOpen, onClose, onUpdateTeam }) => {
  const [teamName, setTeamName] = useState('My workspace');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'request' | 'private' | 'public'>('request');
  const [isEndorsed, setIsEndorsed] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleUpdate = () => {
    onUpdateTeam(description.trim().length > 0);
    onClose();
  };

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
        className="relative w-full max-w-[580px] h-[80vh] bg-[#1e1f21] border border-[#333538] rounded-xl shadow-[0_24px_48px_rgba(0,0,0,0.85)] animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 pt-5 pb-0 flex flex-col flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold text-white tracking-tight">Team settings</h2>
            <button 
              onClick={onClose}
              className="p-1.5 text-[#a2a0a2] hover:text-white hover:bg-[#333538] rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex border-b border-[#333538]">
             <button className="pb-2 px-1 text-[13px] font-semibold text-white relative">
               General
               <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full" />
             </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* Organization Read-only */}
          <div className="space-y-1">
            <label className="text-[12px] font-semibold text-[#a2a0a2] tracking-tight uppercase">Organization</label>
            <p className="text-[14px] font-bold text-white">My workspace</p>
          </div>

          {/* Team Name Input - Locked / Immutable */}
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-[#a2a0a2] tracking-tight uppercase">
              Team name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              value={teamName}
              readOnly
              className="w-full bg-[#151617] border border-[#2e2e30] rounded-md px-4 py-2.5 text-[14px] text-[#52555a] cursor-not-allowed outline-none transition-all"
            />
          </div>

          {/* Description Textarea - Editable */}
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-[#a2a0a2] tracking-tight uppercase">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#252628] border border-[#3a3b3c] rounded-md px-4 py-2.5 text-[14px] text-white focus:border-[#4573d2] focus:ring-1 focus:ring-[#4573d2] outline-none transition-all min-h-[120px] resize-none custom-scrollbar"
            />
          </div>

          {/* Team Status Checkbox */}
          <div className="space-y-3">
            <label className="text-[12px] font-semibold text-[#a2a0a2] tracking-tight uppercase">Team status</label>
            <div className="flex items-start space-x-3 group cursor-pointer" onClick={() => setIsEndorsed(!isEndorsed)}>
               <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isEndorsed ? 'bg-[#4573d2] border-[#4573d2]' : 'bg-[#252628] border-[#3a3b3c] group-hover:border-[#52555a]'}`}>
                  {isEndorsed && <CheckCircle2 size={14} className="text-white" />}
               </div>
               <div className="flex-1 space-y-1">
                 <p className="text-[14px] text-white flex items-center">
                   Endorsed <CheckCircle2 size={14} className="ml-1 text-[#a2a0a2]" />
                 </p>
                 <p className="text-[12px] text-[#a2a0a2] leading-relaxed">
                   Endorsed teams are recommended by admins in your organization. <span className="text-[#4573d2] hover:underline cursor-pointer">Learn more</span>
                 </p>
               </div>
            </div>
          </div>

          {/* Team Privacy Radio Group */}
          <div className="space-y-4">
            <label className="text-[12px] font-semibold text-[#a2a0a2] tracking-tight uppercase">Team privacy</label>
            <div className="space-y-2">
               <PrivacyOption 
                 id="request"
                 icon={<Mail size={18} />}
                 title="Membership by request"
                 description="A member has to request to join this team"
                 isSelected={privacy === 'request'}
                 onClick={() => setPrivacy('request')}
               />
               <PrivacyOption 
                 id="private"
                 icon={<Lock size={18} />}
                 title="Private"
                 description="A member must be invited to join this team"
                 isSelected={privacy === 'private'}
                 onClick={() => setPrivacy('private')}
               />
               <PrivacyOption 
                 id="public"
                 icon={<Users size={18} />}
                 title="Public to organization"
                 description="Any member can join this team"
                 isSelected={privacy === 'public'}
                 onClick={() => setPrivacy('public')}
               />
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-[#333538] flex justify-end bg-[#1e1f21]">
          <button 
            className="bg-[#4573d2] hover:bg-[#5a87e5] text-white px-5 py-2 rounded-lg text-[13px] font-semibold transition-all shadow-md active:scale-[0.98]"
            onClick={handleUpdate}
          >
            Update Team
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

interface PrivacyOptionProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const PrivacyOption: React.FC<PrivacyOptionProps> = ({ icon, title, description, isSelected, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-start space-x-3 p-1 rounded-lg cursor-pointer group transition-all"
  >
    <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-[#4ade80]' : 'border-[#3a3b3c] group-hover:border-[#52555a]'}`}>
      {isSelected && <div className="w-2 h-2 rounded-full bg-[#4ade80]" />}
    </div>
    <div className={`mt-0.5 transition-colors ${isSelected ? 'text-white' : 'text-[#a2a0a2]'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <p className={`text-[14px] font-medium transition-colors ${isSelected ? 'text-white' : 'text-[#a2a0a2]'}`}>
        {title}
      </p>
      <p className="text-[12px] text-[#848688] leading-tight mt-0.5">
        {description}
      </p>
    </div>
  </div>
);

export default TeamSettingsModal;