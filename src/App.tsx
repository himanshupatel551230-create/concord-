import React, { useState } from 'react';
import { GovernanceProvider } from './context/GovernanceContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { GovernanceReceiptModal } from './components/common/GovernanceReceiptModal';

// Views
import { CommandCenter } from './views/CommandCenter';
import { WorkflowStudio } from './views/WorkflowStudio';
import { ReviewQueue } from './views/ReviewQueue';
import { TrustGraphView } from './views/TrustGraphView';
import { PolicyStudio } from './views/PolicyStudio';
import { WhatIfSimulator } from './views/WhatIfSimulator';
import { KnowledgeVault } from './views/KnowledgeVault';
import { IncidentReplayView } from './views/IncidentReplayView';
import { AgentDirectory } from './views/AgentDirectory';

export const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('command-center');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'command-center':
        return <CommandCenter onNavigate={setCurrentView} />;
      case 'workflow-studio':
        return <WorkflowStudio onNavigate={setCurrentView} />;
      case 'review-queue':
        return <ReviewQueue onNavigate={setCurrentView} />;
      case 'trust-graph':
        return <TrustGraphView onNavigate={setCurrentView} />;
      case 'policy-studio':
        return <PolicyStudio />;
      case 'what-if':
        return <WhatIfSimulator />;
      case 'knowledge-vault':
        return <KnowledgeVault />;
      case 'incident-replay':
        return <IncidentReplayView />;
      case 'agent-directory':
        return <AgentDirectory />;
      default:
        return <CommandCenter onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-ink-950 text-ink-100 font-sans">
      {/* Left Navigation Rail */}
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header onNavigate={setCurrentView} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-ink-950 control-grid-bg">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Governance Receipt Slide-over Modal */}
      <GovernanceReceiptModal />
    </div>
  );
};

export default function App() {
  return (
    <GovernanceProvider>
      <AppContent />
    </GovernanceProvider>
  );
}
