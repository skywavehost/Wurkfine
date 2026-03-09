
import React, { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ClipboardList, LayoutTemplate } from 'lucide-react';

interface CreateWorkDropdownProps {
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onSelect: (type: 'project' | 'template') => void;
}

const CreateWorkDropdown: React.FC<CreateWorkDropdownProps> = ({ onClose, anchorRef, onSelect }) => {
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [anchorRef]);

  useLayoutEffect(() => {
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(e.target as Node) && 
        anchorRef.current && 
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose, anchorRef]);

  const menuItems = [
    { 
      id: 'project', 
      label: 'New team project', 
      icon: ClipboardList,
      onClick: () => onSelect('project')
    },
    { 
      id: 'template', 
      label: 'New team template', 
      icon: LayoutTemplate,
      onClick: () => onSelect('template')
    },
  ];

  return createPortal(
    <div 
      ref={menuRef}
      style={{ 
        top: `${position.top}px`, 
        right: `${position.right}px` 
      }}
      className="fixed z-[10000] w-[220px] bg-[#1e1f21] border border-[#3a3b3c] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-1.5 animate-in fade-in zoom-in-95 duration-100 pointer-events-auto"
    >
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className="w-full flex items-center px-3 py-2 hover:bg-[#2e2e30] transition-colors text-left group outline-none focus:bg-[#2e2e30]"
        >
          <div className="mr-3 text-[#a2a0a2] group-hover:text-white transition-colors">
            <item.icon size={18} strokeWidth={1.5} />
          </div>
          <span className="text-[13px] font-medium text-white tracking-tight">
            {item.label}
          </span>
        </button>
      ))}
    </div>,
    document.body
  );
};

export default CreateWorkDropdown;
