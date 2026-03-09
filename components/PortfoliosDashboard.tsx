
import React from 'react';
import { Plus, ChevronDown, LayoutGrid, Folder } from 'lucide-react';

const PortfoliosDashboard: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden h-full">
      {/* Portfolios Header Area */}
      <div className="px-8 pt-6 pb-2">
        <h1 className="text-[28px] font-bold text-white mb-6">Portfolios</h1>
        
        {/* Tabs Row */}
        <div className="flex items-center space-x-8 mb-4 border-b border-zinc-900">
          <button className="pb-3 text-[14px] font-bold text-white relative">
            Recent and starred
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white rounded-t-full" />
          </button>
          <button className="pb-3 text-[14px] font-medium text-zinc-400 hover:text-white transition-colors">
            Browse all
          </button>
        </div>

        {/* Action Row */}
        <div className="flex items-center py-4 border-b border-zinc-900/50">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-[13px] font-bold flex items-center shadow-md transition-colors active:scale-[0.98]">
            <Plus size={18} className="mr-2" strokeWidth={3} />
            Create
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-[1200px]">
          {/* Collapsible Group Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-8">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <ChevronDown size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
              <h2 className="text-[14px] font-bold text-white tracking-tight uppercase tracking-widest">Recent portfolios</h2>
            </div>
            <button className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">
              <LayoutGrid size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Portfolios Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            {/* Card 1: New portfolio Action Card */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-full aspect-[1.3/1] bg-transparent border-2 border-dashed border-zinc-700 rounded-2xl flex items-center justify-center group-hover:border-zinc-500 group-hover:bg-zinc-900/50 transition-all duration-200">
                <Plus size={32} className="text-zinc-600 group-hover:text-zinc-400" strokeWidth={1} />
              </div>
              <span className="mt-4 text-[13px] text-white font-bold text-center tracking-tight">New portfolio</span>
            </div>

            {/* Card 2: My first portfolio */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-full aspect-[1.3/1] bg-transparent rounded-2xl flex items-center justify-center group-hover:brightness-110 transition-all duration-200">
                <div className="relative w-24 h-20">
                  {/* Custom solid folder shape mimicking the graphic */}
                  <div className="absolute inset-0 bg-zinc-300 rounded-lg shadow-sm">
                    {/* Folder tab */}
                    <div className="absolute -top-3 left-0 w-10 h-6 bg-zinc-300 rounded-t-md" />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-col items-center space-y-0.5">
                <span className="text-[13px] text-white font-bold text-center tracking-tight group-hover:underline">My first portfolio</span>
                <span className="text-[12px] text-zinc-500 font-medium text-center">1 project</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfoliosDashboard;
