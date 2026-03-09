import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, ThumbsUp, Paperclip, Share2, Link as LinkIcon, 
  Maximize2, MoreHorizontal, ChevronRight, Info, X, 
  Calendar, ChevronDown, Plus, Bell, MessageSquare, UserPlus,
  GitBranch, Settings2, Circle
} from 'lucide-react';
import { Task, Project } from '../types';

interface TaskDetailDrawerProps {
  task: Task | null;
  projects: Project[];
  onClose: () => void;
  onUpdate: (updates: Partial<Task>) => void;
}

const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({ task, projects, onClose, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (task) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [task]);

  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!task) return null;

  return (
    <>
      {/* Backdrop for mobile or focus */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[100] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer Container */}
      <div 
        className={`fixed top-0 right-0 h-full bg-[#1e1f21] border-l border-[#333538] z-[101] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full sm:w-[500px] md:w-[600px] lg:w-[45%]`}
      >
        {/* Header Toolbar */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-[#333538] flex-shrink-0">
          <button className="flex items-center space-x-2 px-3 py-1.5 border border-[#454545] rounded hover:bg-[#333538] transition-colors text-[13px] font-medium text-white group">
            <Check size={16} className="text-[#a2a0a2] group-hover:text-white" />
            <span>Mark complete</span>
          </button>

          <div className="flex items-center space-x-1">
            <ToolbarIconButton icon={<ThumbsUp size={18} />} />
            <ToolbarIconButton icon={<Paperclip size={18} />} />
            <ToolbarIconButton icon={<GitBranch size={18} />} />
            <ToolbarIconButton icon={<LinkIcon size={18} />} />
            <ToolbarIconButton icon={<Maximize2 size={18} />} />
            <ToolbarIconButton icon={<MoreHorizontal size={18} />} />
            <div className="w-[1px] h-6 bg-[#333538] mx-1" />
            <button 
              onClick={onClose}
              className="p-1.5 text-[#a2a0a2] hover:text-white hover:bg-[#333538] rounded transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-[800px] mx-auto space-y-8">
            
            {/* Visibility Notice */}
            <div className="flex items-center space-x-2 text-[#a2a0a2] text-[12px] opacity-80">
              <Info size={14} className="flex-shrink-0" />
              <span>This task is visible to everyone in My workspace.</span>
            </div>

            {/* Task Title */}
            <div className="group relative">
              <input 
                type="text"
                value={task.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="w-full bg-transparent text-[32px] font-bold text-white border-none outline-none focus:ring-0 placeholder-[#333538] leading-tight"
                placeholder="Task title"
              />
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-[120px_1fr] gap-y-5 text-[14px]">
              
              {/* Assignee */}
              <div className="text-[#a2a0a2] font-medium pt-1">Assignee</div>
              <div className="flex items-center space-x-3 group">
                <div className="flex items-center bg-[#1e1f21] hover:bg-[#2e2e30] border border-transparent hover:border-[#454545] rounded-full pl-0.5 pr-2 py-0.5 transition-all cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-[10px] font-bold text-white mr-2">TT</div>
                  <span className="text-white mr-2">Tunde Tunde</span>
                  <X size={14} className="text-[#a2a0a2] hover:text-white" />
                </div>
                <div className="flex items-center space-x-1 text-[#a2a0a2] hover:text-white cursor-pointer transition-colors">
                  <span className="text-[13px]">Recently assigned</span>
                  <ChevronDown size={14} />
                </div>
              </div>

              {/* Due date */}
              <div className="text-[#a2a0a2] font-medium pt-1">Due date</div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-[#1e1f21] hover:bg-[#2e2e30] border border-transparent hover:border-[#454545] rounded-lg px-2 py-1 transition-all cursor-pointer group">
                  <Calendar size={16} className="text-[#45d2b6] mr-2" />
                  <span className="text-[#45d2b6] font-medium mr-2">{task.dueDate || 'No date'}</span>
                  <X size={14} className="text-[#a2a0a2] hover:text-white opacity-0 group-hover:opacity-100" />
                </div>
              </div>

              {/* Projects */}
              <div className="text-[#a2a0a2] font-medium pt-1">Projects</div>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-[#2e2e30] hover:bg-[#333538] rounded-full pl-2 pr-2 py-0.5 cursor-pointer transition-colors group">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f472b6] mr-2 shadow-sm" />
                    <span className="text-white text-[13px] mr-2">sky</span>
                    <div className="flex items-center space-x-1 border-l border-[#454545] pl-2 mr-2 text-[#a2a0a2] hover:text-white">
                      <span className="text-[12px]">Untitled section</span>
                      <ChevronDown size={14} />
                    </div>
                    <X size={14} className="text-[#a2a0a2] hover:text-white opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
                <button className="text-[#4573d2] hover:underline text-[13px] w-fit text-left">Add to projects</button>
              </div>

              {/* Dependencies */}
              <div className="text-[#a2a0a2] font-medium pt-1">Dependencies</div>
              <div>
                <button className="text-[#4573d2] hover:underline text-[13px]">Add dependencies</button>
              </div>

              {/* Divider for custom fields section */}
              <div className="col-span-2 pt-4">
                 <div className="h-[1px] bg-[#333538] w-full" />
              </div>

              {/* Custom Fields Section */}
              <div className="col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#a2a0a2] text-[11px] font-bold uppercase tracking-wider">My tasks fields</span>
                  <button className="p-1 hover:bg-[#333538] rounded transition-colors text-[#a2a0a2] hover:text-white"><Settings2 size={14} /></button>
                </div>

                <div className="grid grid-cols-[1fr_1fr] border border-[#333538] rounded-lg overflow-hidden">
                   <div className="border-r border-[#333538]">
                      <div className="flex items-center justify-between p-3 hover:bg-[#2e2e30]/40 transition-colors cursor-pointer group">
                        <div className="flex items-center space-x-2 text-[#a2a0a2]">
                          <Circle size={14} />
                          <span>Priority</span>
                        </div>
                        <span className="text-[#333538]">---</span>
                      </div>
                      <div className="h-[1px] bg-[#333538]" />
                      <div className="flex items-center justify-between p-3 hover:bg-[#2e2e30]/40 transition-colors cursor-pointer group">
                        <div className="flex items-center space-x-2 text-[#a2a0a2]">
                          <Circle size={14} />
                          <span>Stage</span>
                        </div>
                        <div className="px-2 py-0.5 bg-[#fb923c]/20 text-[#fb923c] rounded text-[12px] font-medium border border-[#fb923c]/30">Planning</div>
                      </div>
                   </div>
                   <div className="bg-[#1e1f21]/20">
                      <div className="h-full w-full flex items-center justify-center text-[#333538] text-[12px] italic">No value set</div>
                   </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="col-span-2 space-y-3 pt-4">
                <div className="flex items-center justify-between">
                   <label className="text-white font-bold text-[14px]">Description</label>
                </div>
                <textarea 
                  className="w-full bg-transparent border-none outline-none text-white text-[14px] placeholder-[#a2a0a2] resize-none focus:ring-0 min-h-[100px] leading-relaxed"
                  placeholder="What is this task about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Comment Footer */}
        <div className="border-t border-[#333538] bg-[#1e1f21] flex flex-col flex-shrink-0">
          <div className="p-4 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-1 shadow-sm">TT</div>
            <div className="flex-1 min-h-[100px] bg-[#1e1f21] border border-[#333538] rounded-xl p-3 focus-within:border-[#4573d2] focus-within:ring-1 focus-within:ring-[#4573d2] transition-all group">
              <textarea 
                className="w-full bg-transparent border-none outline-none text-white text-[13px] placeholder-[#a2a0a2] resize-none h-full"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="px-4 py-3 border-t border-[#333538]/50 flex items-center justify-between text-[#a2a0a2]">
            <div className="flex items-center space-x-3">
              <span className="text-[12px] font-medium uppercase tracking-tight">Collaborators</span>
              <div className="flex items-center -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-pink-600 border border-[#1e1f21] flex items-center justify-center text-[8px] font-bold text-white shadow-sm">TT</div>
                {task.collaborators.slice(0, 2).map((c, i) => (
                  <div 
                    key={c.id} 
                    className="w-6 h-6 rounded-full border border-[#1e1f21] flex items-center justify-center text-[8px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.initials}
                  </div>
                ))}
                <button className="w-6 h-6 rounded-full border border-dashed border-[#454545] hover:border-white transition-all flex items-center justify-center bg-[#2a2b2d] text-[#a2a0a2] hover:text-white">
                  <Plus size={12} />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1.5 hover:text-white transition-colors group">
                <Bell size={14} />
                <span className="text-[12px] font-medium">Leave task</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ToolbarIconButton: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <button className="p-1.5 text-[#a2a0a2] hover:text-white hover:bg-[#333538] rounded transition-colors">
    {icon}
  </button>
);

export default TaskDetailDrawer;