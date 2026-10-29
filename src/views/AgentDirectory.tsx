import React from 'react';
import { useGovernance } from '../context/GovernanceContext';
import {
  Users,
  Shield,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  AlertTriangle,
  Info,
  Wrench,
  Database
} from 'lucide-react';

export const AgentDirectory: React.FC = () => {
  const { agents, toggleAgentStatus, autonomyMode } = useGovernance();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
              Agent Fleet Roster
            </span>
            <span className="text-xs text-ink-400">• Northstar Autonomous Agents</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-100 tracking-tight mt-1.5">
            Agent Directory
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            Supervise autonomous agent roles, tool authorizations, plain-language boundaries, and operational status.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-ink-900 border border-ink-800 px-3.5 py-2 rounded-xl text-xs font-mono">
          <span className="text-ink-400">Organization Posture:</span>
          <span className="text-teal-400 font-bold">{autonomyMode}</span>
        </div>
      </div>

      {/* Agents Roster Grid */}
      <div className="space-y-4">
        {agents.map(agent => (
          <div
            key={agent.id}
            className={`p-6 rounded-2xl border transition-all ${
              agent.status === 'ACTIVE'
                ? 'bg-ink-900 border-ink-800 hover:border-ink-700 shadow-md'
                : 'bg-ink-950/80 border-red-900/40 opacity-75'
            }`}
          >
            {/* Top Bar: Avatar, Role, Status, Suspend Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-800/80 pb-4 mb-4">
              <div className="flex items-center space-x-3.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-ink-950 shadow-md"
                  style={{ backgroundColor: agent.avatarColor }}
                >
                  {agent.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-ink-100">{agent.name}</h3>
                    <span className="text-xs text-ink-500 font-mono">({agent.id})</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      agent.status === 'ACTIVE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink-400 mt-0.5">{agent.role} • <strong className="text-ink-300">{agent.department}</strong></p>
                </div>
              </div>

              {/* Action: Suspend / Reactivate */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-mono uppercase text-ink-500 block">Recent Handoffs</span>
                  <span className="font-mono text-xs font-bold text-teal-400">{agent.recentHandoffsCount} exchanges</span>
                </div>

                <button
                  onClick={() => toggleAgentStatus(agent.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    agent.status === 'ACTIVE'
                      ? 'bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/60'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-teal'
                  }`}
                >
                  {agent.status === 'ACTIVE' ? 'Suspend Agent' : 'Reactivate Agent'}
                </button>
              </div>
            </div>

            {/* Plain Language Permission Boundaries */}
            <div className="p-4 rounded-xl bg-ink-850/60 border border-ink-800 mb-4 text-xs">
              <span className="text-[10px] font-mono uppercase text-teal-400 block mb-2 font-semibold flex items-center">
                <Info className="w-3.5 h-3.5 mr-1" />
                Plain Language Safety & Policy Boundaries
              </span>
              <ul className="space-y-1.5 text-ink-200 text-xs">
                {agent.plainLanguageBoundaries.map((b, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-teal-400 mt-0.5">›</span>
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3-Column Tools, Permitted Scope, Restricted Scope */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Authorized Tools */}
              <div className="p-3.5 rounded-xl bg-ink-950/70 border border-ink-800">
                <span className="text-[10px] font-mono uppercase text-ink-400 block mb-2 font-semibold flex items-center">
                  <Wrench className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                  Authorized Tools
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {agent.allowedTools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-ink-900 border border-ink-750 text-ink-300 font-mono text-[10px]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Permitted Data Scope */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-2 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  Permitted Data Scope
                </span>
                <ul className="space-y-1 text-emerald-200 text-[11px]">
                  {agent.allowedDataScope.map((scope, idx) => (
                    <li key={idx} className="truncate">› {scope}</li>
                  ))}
                </ul>
              </div>

              {/* Restricted Data Scope */}
              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40">
                <span className="text-[10px] font-mono uppercase text-red-400 block mb-2 font-semibold flex items-center">
                  <XCircle className="w-3.5 h-3.5 mr-1 text-red-400" />
                  Restricted Data Scope (Hard Block)
                </span>
                <ul className="space-y-1 text-red-200 text-[11px]">
                  {agent.restrictedDataScope.map((scope, idx) => (
                    <li key={idx} className="truncate">› {scope}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentDirectory;
