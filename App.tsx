
import React, { useState } from 'react';
import SidebarRail from './components/SidebarRail';
import MainSidebar from './components/MainSidebar';
import TopHeader from './components/TopHeader';
import TaskTable from './components/TaskTable';
import ProjectsView from './components/ProjectsView';
import HomeView from './components/HomeView';
import InboxView from './components/InboxView';
import TemplatesModal from './components/TemplatesModal';
import PortfoliosDashboard from './components/PortfoliosDashboard';
import { NavTab, WorkspaceView } from './types';
import { useUser } from './contexts/UserContext';
import { HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState<NavTab>('Work');
  const [currentView, setCurrentView] = useState<WorkspaceView>('Home');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const { teamDirectory } = useUser();

  const handleNavChange = (nav: NavTab) => {
    setActiveNav(nav);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'Home':
        return <HomeView />;
      case 'Inbox':
        return <InboxView />;
      case 'Projects':
        return <ProjectsView />;
      case 'Portfolios':
        return <PortfoliosDashboard />;
      case 'My Tasks':
        return <TaskTable members={teamDirectory} projects={[]} />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 text-white overflow-hidden font-sans antialiased relative">
      <TopHeader onToggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex overflow-hidden p-1 relative">
        {/* Main Sidebar Wrapper with slide animation */}
        <div 
          className={`flex overflow-hidden transition-all duration-300 ease-in-out ${
            isSidebarVisible ? 'w-[305px] opacity-100' : 'w-0 opacity-0 -translate-x-10'
          }`}
        >
          <div className="flex flex-shrink-0 h-full">
            <SidebarRail activeNav={activeNav} onNavChange={handleNavChange} />
            <MainSidebar 
              activeNav={activeNav} 
              currentView={currentView} 
              onViewChange={setCurrentView} 
              onOpenTemplates={() => setIsTemplatesModalOpen(true)}
            />
          </div>
        </div>
        
        {/* Main Content Area */}
        <div 
          className={`
            flex-1 flex border-t border-l border-zinc-800 rounded-tl-2xl overflow-hidden bg-zinc-950 
            transition-all duration-300 ease-in-out
            ${isSidebarVisible ? 'ml-1' : 'ml-0'}
          `}
        >
          <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0 relative">
              {renderMainContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Info Icon (Absolute Bottom Left) */}
      <div className="fixed bottom-4 left-4 z-[200]">
        <button className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-lg group">
          <HelpCircle size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* High-Fidelity Templates Modal */}
      <TemplatesModal 
        isOpen={isTemplatesModalOpen} 
        onClose={() => setIsTemplatesModalOpen(false)} 
      />
    </div>
  );
};

export default App;
