import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { Shield, Bell, Play, RotateCcw, AlertTriangle, CheckCircle2, Eye, ShieldAlert, UserCheck } from 'lucide-react';
import { AutonomyMode } from '../../types';
import ModeChangeModal from './ModeChangeModal';

interface HeaderProps {
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const {
    autonomyMode,
    pendingReviewsCount,
    isSimulating,
    runLaunchSimulation,
    resetDemo
  } = useGovernance();

  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const getModeBadge = (mode: AutonomyMode) => {
    switch (mode) {
      case 'OBSERVE':
        return {
          icon: Eye,
          label: 'Observe Mode',
          classes: 'bg-blue-950/80 text-blue-300 border-blue-500/40 hover:bg-blue-900/60'
        };
      case 'GUARD':
        return {
          icon: Shield,
          label: 'Guard Mode',
          classes: 'bg-teal-950/80 text-teal-300 border-teal-500/40 hover:bg-teal-900/60'
        };
      case 'APPROVAL_FIRST':
        return {
          icon: ShieldAlert,
          label: 'Approval First',
          classes: 'bg-amber-950/80 text-amber-300 border-amber-500/40 hover:bg-amber-900/60'
        };
    }
  };

  const badge = getModeBadge(autonomyMode);
  const ModeIcon = badge.icon;

  return (
    <>
      <header className="h-16 border-b border-ink-800 bg-ink-900/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Left: Organization & Environment Context */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-semibold text-xs tracking-wider">
              NR
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-ink-100 tracking-tight">Northstar Retail</span>
                <span className="text-xs text-ink-400">/</span>
                <span className="text-xs text-ink-300 font-mono">Q4 Omnichannel Launch</span>
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-ink-800 text-teal-400 border border-ink-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mr-1.5 animate-pulse"></span>
                  Demo Environment
                </span>
                <span className="text-[10px] text-ink-500 font-mono">ID: nstar-prod-gov-01</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Operational Controls & Review Queue Status */}
        <div className="flex items-center space-x-3">
          {/* Simulation Controls */}
          <div className="flex items-center space-x-2 bg-ink-850 p-1 rounded-lg border border-ink-750">
            <button
              onClick={runLaunchSimulation}
              disabled={isSimulating}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isSimulating
                  ? 'bg-ink-800 text-ink-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-500 text-white shadow-sm hover:shadow-glow-teal'
              }`}
              title="Step through the Northstar product launch sequence"
            >
              <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-ink-300 hover:text-ink-100 hover:bg-ink-750 transition-colors"
              title="Reset demo data to initial Northstar scenario"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="h-5 w-px bg-ink-800" />

          {/* Autonomy Mode Switcher */}
          <button
            onClick={() => setIsModeModalOpen(true)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${badge.classes}`}
            title="Click to preview and switch organization autonomy mode"
          >
            <ModeIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
            <span className="text-[10px] opacity-75 font-mono px-1 py-0.5 rounded bg-black/20">Change</span>
          </button>

          {/* Pending Human Reviews Badge */}
          <button
            onClick={() => onNavigate('review-queue')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              pendingReviewsCount > 0
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 hover:bg-amber-900/60 shadow-glow-amber'
                : 'bg-ink-850 text-ink-300 border-ink-750 hover:bg-ink-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Review Queue</span>
            {pendingReviewsCount > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-ink-950 font-bold text-[10px] animate-pulse">
                {pendingReviewsCount}
              </span>
            ) : (
              <span className="text-ink-500 text-[10px]">0</span>
            )}
          </button>

          <div className="h-5 w-px bg-ink-800" />

          {/* Reviewer Profile */}
          <div className="flex items-center space-x-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-ink-800 border border-ink-700 flex items-center justify-center text-ink-200">
              <UserCheck className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-medium text-ink-200">Elena Rostova</p>
              <p className="text-[10px] text-ink-400">Chief Compliance Officer</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mode Change Modal */}
      {isModeModalOpen && (
        <ModeChangeModal isOpen={isModeModalOpen} onClose={() => setIsModeModalOpen(false)} />
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-ink-900 border border-ink-700 rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink-100">Reset Demo State?</h3>
                <p className="text-xs text-ink-400">Restore Northstar Retail to pristine initial scenario.</p>
              </div>
            </div>

            <p className="text-xs text-ink-300 mb-6 leading-relaxed">
              This will restore all workflow steps, reset resolved reviews, revert policies to default guard postures, and clear local overrides.
            </p>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-ink-300 hover:text-ink-100 hover:bg-ink-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemo();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
