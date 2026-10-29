import React from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import {
  LayoutDashboard,
  Workflow,
  ShieldAlert,
  Network,
  FileCheck2,
  SlidersHorizontal,
  Database,
  History,
  Users,
  Shield,
  Layers,
  Terminal
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { pendingReviewsCount, policies } = useGovernance();

  const navItems = [
    {
      id: 'command-center',
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: null,
      description: 'Operations room & live posture'
    },
    {
      id: 'workflow-studio',
      label: 'Workflow Studio',
      icon: Workflow,
      badge: null,
      description: 'Northstar launch sequence'
    },
    {
      id: 'review-queue',
      label: 'Review Queue',
      icon: ShieldAlert,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : null,
      badgeClass: 'bg-amber-500 text-ink-950 font-bold',
      description: 'Human decision workspace'
    },
    {
      id: 'trust-graph',
      label: 'Trust Graph',
      icon: Network,
      badge: null,
      description: 'Agent boundaries & handoffs'
    },
    {
      id: 'policy-studio',
      label: 'Policy Studio',
      icon: FileCheck2,
      badge: `${policies.filter(p => p.enabled).length} Active`,
      badgeClass: 'bg-ink-800 text-teal-400 font-mono text-[10px]',
      description: 'Guardrails & enforcement rules'
    },
    {
      id: 'what-if',
      label: 'What-If Simulator',
      icon: SlidersHorizontal,
      badge: 'Sandbox',
      badgeClass: 'bg-blue-950/80 text-blue-300 font-mono text-[10px] border border-blue-800/40',
      description: 'Pre-execution policy preview'
    },
    {
      id: 'knowledge-vault',
      label: 'Knowledge Vault',
      icon: Database,
      badge: null,
      description: 'Approved grounding & untrusted inputs'
    },
    {
      id: 'incident-replay',
      label: 'Incident Replay',
      icon: History,
      badge: null,
      description: 'Decision scrubber & audit log'
    },
    {
      id: 'agent-directory',
      label: 'Agent Directory',
      icon: Users,
      badge: '5 Active',
      badgeClass: 'bg-ink-800 text-ink-300 font-mono text-[10px]',
      description: 'Permissions & isolation controls'
    }
  ];

  return (
    <aside className="w-64 border-r border-ink-800 bg-ink-900 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div>
        {/* Brand / Logo Header */}
        <div className="h-16 px-5 flex items-center border-b border-ink-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-glow-teal">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-tight text-ink-100">Concord</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-ink-800 text-teal-300 font-mono border border-ink-700">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-ink-400 font-medium tracking-tight">
                Every agent action, governed.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          <div className="px-3 py-1 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500 font-semibold">
              Control Plane Navigation
            </span>
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-teal-950/70 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'text-ink-400 hover:text-ink-200 hover:bg-ink-850/80 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3 text-left">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-teal-400' : 'text-ink-400 group-hover:text-ink-200'
                    }`}
                  />
                  <div>
                    <span className={`block font-medium ${isActive ? 'text-ink-100' : ''}`}>
                      {item.label}
                    </span>
                  </div>
                </div>

                {item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
                      item.badgeClass || 'bg-ink-800 text-ink-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Plane Telemetry Footer */}
      <div className="p-3 border-t border-ink-800/80 bg-ink-950/40">
        <div className="p-2.5 rounded-xl bg-ink-900 border border-ink-800">
          <div className="flex items-center justify-between text-[11px] text-ink-300">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-ink-200">Policy Engine</span>
            </span>
            <span className="font-mono text-[10px] text-emerald-400">ENFORCING</span>
          </div>
          <div className="mt-2 text-[10px] text-ink-500 font-mono flex items-center justify-between">
            <span>Latency: 12ms</span>
            <span>Uptime: 99.99%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
