
import React from 'react';
import { LayoutGrid, Target, Workflow, Users, PlusCircle } from 'lucide-react';
import { NavTab } from '../types';
import { useUser } from '../contexts/UserContext';

interface SidebarRailProps {
  activeNav: NavTab;
  onNavChange: (nav: NavTab) => void;
}

const SidebarRail: React.FC<SidebarRailProps> = ({ activeNav, onNavChange }) => {
  const { user } = useUser();
  
  const navItems: { id: NavTab; icon: React.ElementType; label: string }[] = [
    { id: 'Work', icon: LayoutGrid, label: 'Work' },
    { id: 'Strategy', icon: Target, label: 'Strategy' },
    { id: 'Workflow', icon: Workflow, label: 'Workflow' },
    { id: 'People', icon: Users, label: 'People' },
  ];

  return (
    <div className="w-[64px] bg-[#1e1f21] flex flex-col items-center py-4 flex-shrink-0 z-50 border-r border-[#333538]">
      <div className="flex flex-col space-y-5 items-center flex-1 w-full">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavChange(id)}
            className={`flex flex-col items-center w-full group transition-colors duration-200 ${
              activeNav === id ? 'text-white' : 'text-[#a2a0a2] hover:text-white'
            }`}
          >
            <div className={`p-2 rounded-lg mb-1 transition-all ${
              activeNav === id ? 'bg-[#2e2e30]' : 'bg-transparent group-hover:bg-[#2e2e30]'
            }`}>
              <Icon size={20} strokeWidth={activeNav === id ? 2.5 : 1.5} />
            </div>
            <span className={`text-[10px] font-medium ${
              activeNav === id ? 'text-white' : 'text-[#a2a0a2] group-hover:text-white'
            }`}>{label}</span>
          </button>
        ))}
      </div>
      
      <div className="flex flex-col items-center space-y-6 mb-2 w-full">
        <button className="text-[#a2a0a2] hover:text-white transition-colors">
          <PlusCircle size={28} strokeWidth={1.2} />
        </button>
        
        <div className={`w-8 h-8 rounded-full ${user.avatarColor} border border-white/10 flex items-center justify-center text-[11px] font-bold text-white cursor-pointer hover:ring-2 hover:ring-[#4573d2] transition-all`}>
          {user.initials}
        </div>
      </div>
    </div>
  );
};

export default SidebarRail;
