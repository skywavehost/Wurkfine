
import React, { useState } from 'react';
import { Plus, ChevronDown, LayoutGrid, Info } from 'lucide-react';
import NewPortfolioModal from './NewPortfolioModal';
import { Portfolio } from '../types';

interface PortfoliosViewProps {
  portfolios: Portfolio[];
  onPortfolioCreated: (name: string) => void;
}

const PortfoliosView: React.FC<PortfoliosViewProps> = ({ portfolios, onPortfolioCreated }) => {
  const [activeTab, setActiveTab] = useState<'Recent' | 'All'>('Recent');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-[#1e1f21] h-full relative animate-in fade-in duration-500 overflow-hidden">
      {/* Header Section */}
      <div className="px-8 pt-8 pb-4 flex items-center justify-between flex-shrink-0">
        <h1 className="text-[28px] font-bold text-white tracking-tight">Portfolios</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="px-8 flex items-center space-x-8 border-b border-[#333538] flex-shrink-0">
        <button 
          onClick={() => setActiveTab('Recent')}
          className={`pb-3 text-[14px] font-semibold transition-all relative ${
            activeTab === 'Recent' ? 'text-white' : 'text-[#a2a0a2] hover:text-white'
          }`}
        >
          Recent and starred
          {activeTab === 'Recent' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('All')}
          className={`pb-3 text-[14px] font-semibold transition-all relative ${
            activeTab === 'All' ? 'text-white' : 'text-[#a2a0a2] hover:text-white'
          }`}
        >
          Browse all
          {activeTab === 'All' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full" />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar pb-24">
        <div className="max-w-[1400px]">
          {/* Recent Portfolios Sub-header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#333538] mb-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDown 
                size={16} 
                className={`text-[#a2a0a2] group-hover:text-white transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`} 
              />
              <h2 className="text-[14px] font-bold text-white tracking-tight">Recent portfolios</h2>
            </div>
            <button className="p-1.5 text-[#a2a0a2] hover:text-white hover:bg-[#333538] rounded transition-colors">
              <LayoutGrid size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Portfolios Grid */}
          {isExpanded && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-10">
              {/* New Portfolio Action Card */}
              <div className="flex flex-col items-center group">
                <div 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full aspect-[1.3/1] bg-transparent border-2 border-dashed border-[#454545] rounded-2xl flex items-center justify-center cursor-pointer hover:border-white/40 hover:bg-[#2e2e30] transition-all duration-200 active:scale-[0.98]"
                >
                  <Plus size={36} className="text-[#a2a0a2] group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <span className="mt-4 text-[13px] text-white font-bold text-center tracking-tight">New portfolio</span>
              </div>

              {/* Dynamic Portfolio Items */}
              {portfolios.map((portfolio, idx) => (
                <PortfolioCard 
                  key={portfolio.id} 
                  portfolio={portfolio} 
                  // Assigning colors based on index to match the "sam" vs "CHRIS" theme from screenshot
                  color={idx % 2 === 0 ? '#f9a8d4' : '#f06a6a'} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Info Icon */}
      <div className="absolute bottom-10 left-10">
        <div className="w-10 h-10 rounded-full border border-[#333538] bg-[#2a2b2d] flex items-center justify-center text-[#9f7aea] cursor-pointer hover:bg-[#333538] transition-all shadow-lg group">
          <Info size={20} className="group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {isModalOpen && (
        <NewPortfolioModal 
          onClose={() => setIsModalOpen(false)} 
          onComplete={(name) => {
            onPortfolioCreated(name);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// --- Sub-components ---

const PortfolioCard: React.FC<{ portfolio: Portfolio; color: string }> = ({ portfolio, color }) => (
  <div className="flex flex-col items-center group cursor-pointer transition-transform duration-200 active:scale-[0.98]">
    <div className="w-full aspect-[1.3/1] rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:brightness-110">
      <PortfolioFolderIcon color={color} />
    </div>
    <div className="mt-4 flex flex-col items-center space-y-0.5">
      <span className="text-[13px] text-white font-bold text-center tracking-tight group-hover:underline">
        {portfolio.name.toLowerCase()}
      </span>
      <span className="text-[12px] text-[#a2a0a2] font-medium text-center opacity-80">
        1 project
      </span>
    </div>
  </div>
);

const PortfolioFolderIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg 
    width="100%" 
    height="100%" 
    viewBox="0 0 120 96" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-md"
  >
    <path 
      d="M12 0C5.37258 0 0 5.37258 0 12V84C0 90.6274 5.37258 96 12 96H108C114.627 96 120 90.6274 120 84V28C120 21.3726 114.627 16 108 16H66L54 0H12Z" 
      fill={color}
    />
    <path 
      d="M12 16H108C114.627 16 120 21.3726 120 28V84C120 90.6274 114.627 96 108 96H12C5.37258 96 0 90.6274 0 84V28C0 21.3726 5.37258 16 12 16Z" 
      fill="black" 
      fillOpacity="0.05"
    />
  </svg>
);

export default PortfoliosView;
