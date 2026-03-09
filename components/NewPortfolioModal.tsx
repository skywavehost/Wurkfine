
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, ArrowLeft, LayoutList, Calendar, BarChart2, ChevronDown, Plus, Users } from 'lucide-react';

interface NewPortfolioModalProps {
  onClose: () => void;
  onComplete: (name: string) => void;
}

const NewPortfolioModal: React.FC<NewPortfolioModalProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [portfolioName, setPortfolioName] = useState('');
  const [defaultView, setDefaultView] = useState<'List' | 'Timeline' | 'Workload'>('List');
  const [selectedAction, setSelectedAction] = useState<'projects' | 'share'>('projects');

  const handleBack = () => {
    if (step === 2) setStep(1);
    else onClose();
  };

  const handleGoToPortfolio = () => {
    onComplete(portfolioName);
  };

  const content = (
    <div className="fixed inset-0 z-[100] bg-[#151617] text-white flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans">
      {/* Modal Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-[#333538]/30">
        <button 
          onClick={handleBack}
          className="p-1.5 hover:bg-[#333538] rounded-md transition-colors text-[#a2a0a2] hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-[#333538] rounded-md transition-colors text-[#a2a0a2] hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column */}
        <div className="w-[450px] p-12 flex flex-col h-full border-r border-[#333538]/30 overflow-y-auto custom-scrollbar relative">
          
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 flex flex-col h-full">
              <h1 className="text-3xl font-medium mb-10 text-white tracking-tight">New portfolio</h1>
              
              <div className="space-y-8 flex-1">
                {/* Portfolio Name */}
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-[#a2a0a2] uppercase tracking-wider">Portfolio name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Q1 Roadmap"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                    className="w-full bg-transparent border-b border-[#333538] py-2 text-[15px] outline-none focus:border-[#4573d2] transition-colors placeholder-[#454545]"
                    autoFocus
                  />
                  {!portfolioName && (
                    <p className="text-[#f06a6a] text-[13px] mt-2">Portfolio name is required.</p>
                  )}
                </div>

                {/* Privacy */}
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-[#a2a0a2] uppercase tracking-wider">Privacy</label>
                  <div className="relative group">
                    <select className="w-full bg-[#2a2b2d] border border-[#333538] rounded-lg py-2.5 px-3 text-[14px] appearance-none outline-none focus:border-[#4573d2] transition-all cursor-pointer">
                      <option>Public to My workspace</option>
                      <option>Private to members</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a2a0a2] pointer-events-none group-hover:text-white transition-colors" />
                  </div>
                </div>

                {/* Default View Selection */}
                <div className="space-y-4">
                  <label className="text-[12px] font-semibold text-[#a2a0a2] uppercase tracking-wider block">Default view</label>
                  <div className="grid grid-cols-1 gap-3">
                    <ViewSelectionCard 
                      id="List"
                      label="List"
                      icon={<LayoutList size={22} />}
                      isActive={defaultView === 'List'}
                      onClick={() => setDefaultView('List')}
                    />
                    <ViewSelectionCard 
                      id="Timeline"
                      label="Timeline"
                      icon={<Calendar size={22} />}
                      isActive={defaultView === 'Timeline'}
                      onClick={() => setDefaultView('Timeline')}
                    />
                    <ViewSelectionCard 
                      id="Workload"
                      label="Workload"
                      icon={<BarChart2 size={22} />}
                      isActive={defaultView === 'Workload'}
                      onClick={() => setDefaultView('Workload')}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => portfolioName && setStep(2)}
                  disabled={!portfolioName}
                  className={`w-full py-2.5 rounded-lg text-[14px] font-semibold transition-all shadow-lg ${
                    portfolioName 
                    ? 'bg-[#4573d2] text-white hover:bg-[#5a87e5]' 
                    : 'bg-[#2a2b2d] text-[#454545] cursor-not-allowed border border-[#333538]'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full">
              <h1 className="text-3xl font-medium mb-10 text-white tracking-tight leading-tight">What do you want to do first?</h1>
              
              <div className="space-y-4 flex-1">
                <div 
                  onClick={() => setSelectedAction('projects')}
                  className={`flex items-center p-6 rounded-xl cursor-pointer border-2 transition-all duration-200 group ${
                    selectedAction === 'projects' 
                    ? 'border-[#4573d2] bg-[#2a2b2d] ring-1 ring-[#4573d2]/20' 
                    : 'border-[#333538] hover:border-[#454545] bg-transparent'
                  }`}
                >
                  <div className="mr-6">
                    <div className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-colors ${
                      selectedAction === 'projects' ? 'border-[#4573d2]' : 'border-[#333538] group-hover:border-[#454545]'
                    }`}>
                       <Plus size={24} className={selectedAction === 'projects' ? 'text-[#4573d2]' : 'text-[#a2a0a2] group-hover:text-white'} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[16px] font-semibold text-white mb-1">Start adding projects</h3>
                    <p className="text-[13px] text-[#a2a0a2]">Add projects and track their progress</p>
                  </div>
                </div>

                <div 
                  onClick={() => setSelectedAction('share')}
                  className={`flex items-center p-6 rounded-xl cursor-pointer border-2 transition-all duration-200 group ${
                    selectedAction === 'share' 
                    ? 'border-[#4573d2] bg-[#2a2b2d] ring-1 ring-[#4573d2]/20' 
                    : 'border-[#333538] hover:border-[#454545] bg-transparent'
                  }`}
                >
                  <div className="mr-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      selectedAction === 'share' ? 'bg-[#333538]' : 'bg-transparent group-hover:bg-[#333538]'
                    }`}>
                       <Users size={24} className={selectedAction === 'share' ? 'text-[#4573d2]' : 'text-[#a2a0a2] group-hover:text-white'} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[16px] font-semibold text-white mb-1">Share with teammates</h3>
                    <p className="text-[13px] text-[#a2a0a2]">Invite teammates to collaborate</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={handleGoToPortfolio}
                  className="w-full py-2.5 bg-[#4573d2] text-white rounded-lg text-[14px] font-semibold hover:bg-[#5a87e5] transition-all shadow-lg active:scale-[0.98]"
                >
                  Go to portfolio
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Preview Panel (Persistent) */}
        <div className="flex-1 bg-[#151617] p-16 flex items-center justify-center overflow-hidden">
           <div className="w-full max-w-4xl h-full max-h-[600px] relative">
             <div className={`absolute inset-0 transition-opacity duration-300 ${defaultView === 'List' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <ListPreviewSkeleton portfolioName={portfolioName} />
             </div>
             <div className={`absolute inset-0 transition-opacity duration-300 ${defaultView === 'Timeline' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <RemoteImagePreview 
                  src="https://skywavehost.com/wp-content/uploads/2026/01/timeline002.png" 
                  alt="Timeline Preview" 
                  portfolioName={portfolioName}
                />
             </div>
             <div className={`absolute inset-0 transition-opacity duration-300 ${defaultView === 'Workload' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <RemoteImagePreview 
                  src="https://skywavehost.com/wp-content/uploads/2026/01/workload001.png" 
                  alt="Workload Preview" 
                  portfolioName={portfolioName}
                />
             </div>
           </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

const PreviewHeader: React.FC<{ portfolioName: string; activeTab: string }> = ({ portfolioName, activeTab }) => (
  <div className="p-6 border-b border-[#333538]/50 flex flex-col space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-[#333538] flex items-center justify-center shadow-inner">
          <div className="w-6 h-5 bg-[#454545] rounded-sm" />
        </div>
        <div className="flex flex-col space-y-2">
           <div className="text-[14px] font-bold text-white uppercase tracking-wider">{portfolioName || 'NAME'}</div>
           <div className="flex items-center space-x-4">
              <span className={`text-[11px] font-medium pb-1 relative transition-colors ${activeTab === 'List' ? 'text-white' : 'text-[#a2a0a2]'}`}>
                List
                {activeTab === 'List' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4573d2] rounded-t-full" />}
              </span>
              <span className={`text-[11px] font-medium pb-1 relative transition-colors ${activeTab === 'Timeline' ? 'text-white' : 'text-[#a2a0a2]'}`}>
                Timeline
                {activeTab === 'Timeline' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4573d2] rounded-t-full" />}
              </span>
              <span className="text-[11px] font-medium text-[#a2a0a2]">Progress</span>
              <span className={`text-[11px] font-medium pb-1 relative transition-colors ${activeTab === 'Workload' ? 'text-white' : 'text-[#a2a0a2]'}`}>
                Workload
                {activeTab === 'Workload' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4573d2] rounded-t-full" />}
              </span>
              <span className="text-[11px] font-medium text-[#a2a0a2]">Capacity</span>
              <span className="text-[11px] font-medium text-[#a2a0a2]">Messages</span>
           </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
         <div className="h-6 w-24 bg-[#333538] rounded-full animate-pulse" />
         <div className="flex -space-x-1">
            <div className="w-6 h-6 rounded-full bg-[#333538] border border-[#1e1f21]" />
            <div className="w-6 h-6 rounded-full bg-[#454545] border border-[#1e1f21]" />
         </div>
      </div>
    </div>
  </div>
);

const RemoteImagePreview: React.FC<{ src: string, alt: string, portfolioName: string }> = ({ src, alt, portfolioName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
  }, [src]);

  return (
    <div className="w-full h-full bg-[#1e1f21] border border-[#333538]/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 relative ring-1 ring-white/5">
      <PreviewHeader portfolioName={portfolioName} activeTab={alt.includes('Timeline') ? 'Timeline' : 'Workload'} />
      <div className="flex-1 relative bg-[#1e1f21]">
        {loading && !error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#1e1f21]">
            <div className="absolute inset-4 bg-[#2a2b2d] rounded-xl animate-pulse" />
            <div className="z-30 w-8 h-8 border-2 border-[#4573d2] border-t-transparent rounded-full animate-spin opacity-50" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#1e1f21] p-8 text-center">
            <BarChart2 className="text-[#a2a0a2] mb-4" size={32} />
            <p className="text-[#a2a0a2] text-[14px]">The preview could not be loaded.</p>
          </div>
        )}
        <img 
          src={src} 
          alt={alt} 
          className={`w-full h-full object-contain transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          loading="lazy"
        />
      </div>
    </div>
  );
};

const ListPreviewSkeleton: React.FC<{ portfolioName: string }> = ({ portfolioName }) => (
  <div className="w-full h-full bg-[#1e1f21] border border-[#333538]/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 ring-1 ring-white/5">
    <PreviewHeader portfolioName={portfolioName} activeTab="List" />
    <div className="flex-1 p-6 space-y-6 overflow-hidden">
       <div className="flex items-center space-x-8 pb-4 border-b border-[#333538]/50 opacity-50">
          <div className="h-2 w-24 bg-[#333538] rounded-full" />
          <div className="h-2 w-24 bg-[#333538] rounded-full" />
          <div className="h-2 w-24 bg-[#333538] rounded-full" />
          <div className="h-2 w-24 bg-[#333538] rounded-full ml-auto" />
       </div>

       {[
         { color: '#4573d2', status: '#4ade80' },
         { color: '#f06a6a', status: '#fbbf24' },
         { color: '#c084fc', status: '#4ade80' },
         { color: '#fb923c', status: '#333538' },
         { color: '#a78bfa', status: '#4ade80' },
         { color: '#4573d2', status: '#f06a6a' },
         { color: '#4573d2', status: '#4ade80' }
       ].map((row, i) => (
         <div key={i} className="flex items-center space-x-8 py-2 opacity-80">
            <div className="flex items-center space-x-3 w-32">
              <div className="w-7 h-7 rounded-md shadow-sm" style={{ backgroundColor: row.color }} />
              <div className="h-2 w-20 bg-[#333538] rounded-full" />
            </div>
            <div className="w-32 flex items-center">
               <div className="w-4 h-4 rounded-full" style={{ backgroundColor: row.status }} />
               <div className="h-2 w-16 bg-[#333538] rounded-full ml-2" />
            </div>
            <div className="w-32">
               <div className="h-2.5 w-24 bg-[#4ade80]/20 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#4ade80]/60 w-[60%]" />
               </div>
            </div>
            <div className="flex -space-x-2 ml-auto">
               <div className="w-6 h-6 rounded-full border border-[#1e1f21] bg-[#333538]" />
            </div>
         </div>
       ))}
    </div>
  </div>
);

const ViewSelectionCard: React.FC<{ 
  id: string; 
  label: string; 
  icon: React.ReactNode; 
  isActive: boolean; 
  onClick: () => void; 
}> = ({ label, icon, isActive, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
      isActive 
      ? 'border-[#4573d2] bg-[#2a2b2d] shadow-lg scale-[1.02] ring-1 ring-white/10' 
      : 'border-[#333538] bg-[#1e1f21] hover:bg-[#2a2b2d] hover:border-[#454545]'
    }`}
  >
    <div className={`mr-4 transition-colors ${isActive ? 'text-[#4573d2]' : 'text-[#a2a0a2]'}`}>
      {icon}
    </div>
    <span className={`text-[15px] font-medium transition-colors ${isActive ? 'text-white' : 'text-[#a2a0a2]'}`}>
      {label}
    </span>
    {isActive && (
      <div className="ml-auto w-5 h-5 rounded-full bg-[#4573d2] flex items-center justify-center shadow-md">
         <div className="w-2 h-2 bg-white rounded-full" />
      </div>
    )}
  </div>
);

export default NewPortfolioModal;
