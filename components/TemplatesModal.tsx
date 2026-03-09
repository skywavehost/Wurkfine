
import React from 'react';
import { 
  X, ChevronDown, ThumbsUp, ArrowRight, ClipboardList, Columns3, 
  Calendar as CalendarIcon, ListTodo, Users, Rocket, Zap, Monitor, LayoutGrid
} from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pills = ["For you", "My organization", "Marketing", "Operations & PMO", "Productivity", "More"];

  return (
    <div className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col animate-in fade-in duration-300">
      {/* Modal Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-8 py-4 border-b border-zinc-800">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {pills.map((pill, idx) => (
            <button
              key={pill}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap border ${
                idx === 0 
                  ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' 
                  : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <span>{pill}</span>
                {pill === "More" && <ChevronDown size={14} />}
              </div>
            </button>
          ))}
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content Scroll Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-zinc-950">
        <div className="max-w-[1200px] mx-auto space-y-16">
          
          {/* Section 1: Workflows built for all teams */}
          <section className="space-y-8">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">Workflows built for all teams</h2>
                <p className="text-zinc-400 text-[14px]">Help your teams track, plan, and deliver impactful work in Asana</p>
              </div>
              <button className="flex items-center space-x-1.5 text-zinc-400 hover:text-white text-[13px] font-medium group transition-all">
                <span>View more</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TemplateHeroCard 
                title="Project timeline"
                description="Map out dependencies, milestones, and deadlines to keep your projects on track."
                type="timeline"
              />
              <TemplateHeroCard 
                title="Request tracking"
                description="Capture, prioritize, and monitor requests until completion."
                type="list"
              />
              <TemplateHeroCard 
                title="New hire checklist"
                description="Outline onboarding steps, assign tasks with due dates, and track milestones to ..."
                type="calendar"
              />
            </div>
          </section>

          {/* Section 2: Start working in seconds */}
          <section className="space-y-8 pb-20">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">Start working in seconds</h2>
              <p className="text-zinc-400 text-[14px]">Power your everyday processes with Asana's most popular workflows</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StandardTemplateCard 
                title="Content calendar"
                description="Plan content, organize assets, and view schedules by channel to keep your ..."
                tag="Great for marketing"
                type="calendar-small"
              />
              <StandardTemplateCard 
                title="Goals setting operations"
                description="Manage the process of setting objectives across teams to enable alignment and ..."
                tag="Great for ops & PMO"
                type="list-small"
              />
              <StandardTemplateCard 
                title="Bug tracking"
                description="File, assign, and prioritize bugs in one place to fix issues faster."
                tag="Great for IT"
                type="board-small"
              />
              <StandardTemplateCard 
                title="Cross-functional project plan"
                description="Create tasks, add due dates, and organize work by stage to align teams across you..."
                tag="Great for all teams"
                type="list-small-alt"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- Thumbnail UI Builders ---

const TimelineThumbnail = () => (
  <div className="w-full h-full p-4 relative overflow-hidden bg-zinc-900/50 rounded-t-2xl">
    <div className="flex flex-col space-y-4 pt-4">
      <div className="flex space-x-2">
        <div className="h-1.5 w-12 bg-zinc-700 rounded-full" />
        <div className="h-1.5 w-8 bg-zinc-800 rounded-full" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-full border-r border-zinc-800 border-dashed" />)}
      </div>
      {/* Floating Timeline Bars */}
      <div className="absolute top-16 left-8 h-4 w-16 bg-yellow-500 rounded-full shadow-lg" />
      <div className="absolute top-24 left-16 h-4 w-16 bg-green-500 rounded-full shadow-lg" />
      <div className="absolute top-36 left-28 h-4 w-24 bg-blue-500 rounded-full shadow-lg" />
      <div className="absolute top-44 left-36 h-4 w-12 bg-purple-500 rounded-full shadow-lg" />
      
      {/* Dependency Lines (simplified) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <path d="M 24 16 L 36 24" stroke="white" strokeWidth="1" fill="none" />
        <path d="M 32 24 L 60 36" stroke="white" strokeWidth="1" fill="none" />
      </svg>
    </div>
  </div>
);

const ListThumbnail = () => (
  <div className="w-full h-full p-4 bg-[#0d1117] rounded-t-2xl">
    <div className="flex flex-col space-y-2 pt-4">
      <div className="flex items-center space-x-3 pb-2 border-b border-zinc-800">
        <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white"><LayoutGrid size={12}/></div>
        <div className="h-1.5 w-24 bg-zinc-700 rounded-full" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 py-1.5">
          <div className="w-3.5 h-3.5 rounded-full border border-zinc-700" />
          <div className="h-1.5 w-20 bg-zinc-800 rounded-full" />
          <div className="flex-1" />
          <div className="w-5 h-5 rounded-full bg-zinc-800" />
          <div className={`h-3 w-8 rounded-sm ${i === 0 ? 'bg-red-500' : i === 1 ? 'bg-green-500' : 'bg-yellow-500'}`} />
        </div>
      ))}
    </div>
  </div>
);

const CalendarThumbnail = () => (
  <div className="w-full h-full p-4 bg-[#0d1117] rounded-t-2xl">
    <div className="grid grid-cols-7 gap-1 pt-4 h-full">
      {[...Array(28)].map((_, i) => (
        <div key={i} className="aspect-square bg-zinc-900/30 rounded-sm relative">
           {i === 10 && <div className="absolute top-2 left-0 right-[-40px] h-2 bg-blue-500 rounded-full z-10" />}
           {i === 12 && <div className="absolute top-5 left-0 right-[-60px] h-2 bg-pink-500 rounded-full z-10" />}
           {i === 18 && <div className="absolute top-2 left-0 right-[-30px] h-2 bg-yellow-500 rounded-full z-10" />}
        </div>
      ))}
    </div>
  </div>
);

// --- Card Components ---

const TemplateHeroCard: React.FC<{ title: string; description: string; type: 'timeline' | 'list' | 'calendar' }> = ({ title, description, type }) => (
  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden group hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer">
    <div className="h-56 w-full bg-[#1a1b1c] relative">
      {type === 'timeline' && <TimelineThumbnail />}
      {type === 'list' && <ListThumbnail />}
      {type === 'calendar' && <CalendarThumbnail />}
      <div className="absolute bottom-4 right-4 text-red-500 opacity-60 group-hover:opacity-100 transition-opacity">
        <AsanaLogoMini />
      </div>
    </div>
    <div className="p-6 space-y-3">
      <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
      <p className="text-[13px] text-zinc-400 leading-relaxed line-clamp-2">{description}</p>
    </div>
  </div>
);

const StandardTemplateCard: React.FC<{ title: string; description: string; tag: string; type: string }> = ({ title, description, tag, type }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden group hover:border-zinc-700 transition-all cursor-pointer">
    <div className="h-44 w-full bg-[#1a1b1c] relative flex items-center justify-center p-4">
      {/* Minimal graphics for small cards */}
      <div className="w-full h-full bg-zinc-900/30 rounded-lg flex flex-col p-4 overflow-hidden">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-4 h-4 rounded bg-purple-500" />
          <div className="h-1 w-16 bg-zinc-800 rounded-full" />
        </div>
        <div className="space-y-2">
           <div className="h-1 w-full bg-zinc-800/40 rounded-full" />
           <div className="h-1 w-[80%] bg-zinc-800/40 rounded-full" />
           <div className="h-1 w-[90%] bg-zinc-800/40 rounded-full" />
        </div>
      </div>
      <div className="absolute bottom-3 right-3 opacity-60">
        <AsanaLogoMini />
      </div>
    </div>
    <div className="p-5 flex-1 flex flex-col space-y-3">
      <h3 className="text-[15px] font-bold text-white tracking-tight leading-tight">{title}</h3>
      <p className="text-[12px] text-zinc-400 leading-relaxed line-clamp-3">{description}</p>
      <div className="flex-1" />
      <div className="flex items-center space-x-2 pt-2">
        <div className="bg-zinc-800/80 px-2.5 py-1 rounded flex items-center space-x-1.5 text-zinc-400 group-hover:text-white transition-colors">
          <ThumbsUp size={12} />
          <span className="text-[11px] font-medium whitespace-nowrap">{tag}</span>
        </div>
      </div>
    </div>
  </div>
);

const AsanaLogoMini = () => (
  <div className="flex flex-col items-center">
    <div className="w-1.5 h-1.5 bg-current rounded-full mb-0.5" />
    <div className="flex space-x-0.5">
      <div className="w-1.5 h-1.5 bg-current rounded-full" />
      <div className="w-1.5 h-1.5 bg-current rounded-full" />
    </div>
  </div>
);

export default TemplatesModal;
