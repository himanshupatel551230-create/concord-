import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { Agent } from '../types';
import {
  Network,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowRight,
  Database,
  ExternalLink,
  Users,
  CheckCircle2,
  XCircle,
  X,
  Layers,
  Zap,
  Info
} from 'lucide-react';

interface TrustGraphViewProps {
  onNavigate: (view: string) => void;
}

export const TrustGraphView: React.FC<TrustGraphViewProps> = ({ onNavigate }) => {
  const { agents, toggleAgentStatus, policies, autonomyMode } = useGovernance();
  const [selectedAgentId, setSelectedAgentId] = useState<string>('marketing');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  // Defined connections / boundaries in Northstar
  const edges = [
    {
      id: 'coord-research',
      from: 'coordinator',
      to: 'research',
      label: 'Task Delegation & Cache Query',
      type: 'ALLOWED',
      rule: 'Allowed under POL-005. Grounded in Knowledge Vault.'
    },
    {
      id: 'coord-finance',
      from: 'coordinator',
      to: 'finance',
      label: 'Budget Constraints Modeling',
      type: 'ALLOWED',
      rule: 'Allowed for calculation; payment execution disabled by POL-004.'
    },
    {
      id: 'research-injection',
      from: 'research',
      to: 'external-leak',
      label: 'Ingestion Sandbox Boundary',
      type: 'RESTRICTED',
      rule: 'POL-006: Untrusted documents isolated. PII extraction commands blocked.'
    },
    {
      id: 'marketing-legal',
      from: 'marketing',
      to: 'legal',
      label: 'Copy Verification & Claim Audit',
      type: 'SUPERVISED',
      rule: 'POL-001: Claims verified against KV-103. Missing citations escalated.'
    },
    {
      id: 'marketing-pr',
      from: 'marketing',
      to: 'external-pr',
      label: 'Public Press Wire Egress',
      type: 'GATED',
      rule: 'POL-003: External public communication requires human clearance.'
    },
    {
      id: 'finance-payment',
      from: 'finance',
      to: 'payment-gateway',
      label: 'Stripe Payment Gateway',
      type: 'HARD_BLOCKED',
      rule: 'POL-004: Autonomous payment execution strictly prohibited.'
    }
  ];

  const selectedEdge = edges.find(e => e.id === selectedEdgeId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
              Topology & Access Perimeter
            </span>
            <span className="text-xs text-ink-400">• Dynamic Trust Graph</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-100 tracking-tight mt-1.5">
            Inter-Agent Trust Graph
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            Visual map of agent identities, departmental data scopes, handoffs, and policy containment perimeters.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] bg-ink-900 px-3.5 py-2 rounded-xl border border-ink-800">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
            <span className="text-ink-300">Allowed Flow</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-ink-300">Human Approval Gate</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-ink-300">Hard Restricted Boundary</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workspace: Left Graph Canvas, Right Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Visual Graph Canvas (Span 8) */}
        <div className="lg:col-span-8 bg-ink-900 border border-ink-800 rounded-2xl p-6 relative overflow-hidden control-grid-bg min-h-[560px] flex flex-col justify-between">
          {/* Canvas Background watermark */}
          <div className="absolute top-4 left-4 text-[10px] font-mono text-ink-600 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Northstar Retail Agent Topology • Perimeter Guard: {autonomyMode}</span>
          </div>

          {/* Node Placement Grid */}
          <div className="relative w-full h-[460px] mt-6">
            {/* SVG Link lines between nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Coordinator -> Research */}
              <line x1="50%" y1="28%" x2="22%" y2="52%" stroke="#14B8A6" strokeWidth="2" strokeDasharray="4 2" />
              {/* Coordinator -> Finance */}
              <line x1="50%" y1="28%" x2="78%" y2="52%" stroke="#14B8A6" strokeWidth="2" strokeDasharray="4 2" />
              {/* Research -> External Leak (Red restricted) */}
              <line x1="22%" y1="52%" x2="10%" y2="82%" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 3" />
              {/* Coordinator -> Legal */}
              <line x1="50%" y1="28%" x2="38%" y2="82%" stroke="#14B8A6" strokeWidth="2" />
              {/* Marketing -> Legal */}
              <line x1="62%" y1="82%" x2="38%" y2="82%" stroke="#F59E0B" strokeWidth="2" />
              {/* Marketing -> External PR wire (Amber gate) */}
              <line x1="62%" y1="82%" x2="90%" y2="82%" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" />
              {/* Finance -> Payment Gateway (Red Blocked) */}
              <line x1="78%" y1="52%" x2="90%" y2="35%" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 3" />
            </svg>

            {/* Central Node: Coordinator Agent */}
            <div
              onClick={() => { setSelectedAgentId('coordinator'); setSelectedEdgeId(null); }}
              className={`absolute top-[18%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-4 rounded-2xl border cursor-pointer transition-all duration-200 z-10 ${
                selectedAgentId === 'coordinator'
                  ? 'bg-ink-850 border-teal-400 shadow-glow-teal scale-105 ring-2 ring-teal-400/30'
                  : 'bg-ink-900/95 border-teal-500/40 hover:border-teal-400 hover:scale-102'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/40 font-bold text-xs">
                  CO
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-ink-100">Coordinator Agent</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[10px] text-ink-400">Operations & Synthesis</p>
                  <span className="text-[9px] font-mono text-teal-400 bg-teal-950 px-1.5 py-0.2 rounded border border-teal-800/40 mt-1 inline-block">
                    Deduplication Lead
                  </span>
                </div>
              </div>
            </div>

            {/* Node 2: Research Agent (Left) */}
            <div
              onClick={() => { setSelectedAgentId('research'); setSelectedEdgeId(null); }}
              className={`absolute top-[52%] left-[22%] -translate-x-1/2 -translate-y-1/2 p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 z-10 ${
                selectedAgentId === 'research'
                  ? 'bg-ink-850 border-sky-400 shadow-lg scale-105 ring-2 ring-sky-400/30'
                  : 'bg-ink-900/95 border-sky-500/40 hover:border-sky-400'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/40 font-bold text-xs">
                  RE
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-ink-100">Research Agent</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[10px] text-ink-400">Market Intelligence</p>
                  <span className="text-[9px] font-mono text-sky-400 bg-sky-950 px-1 py-0.2 rounded mt-0.5 inline-block">
                    Sandboxed Parser
                  </span>
                </div>
              </div>
            </div>

            {/* Node 3: Finance Agent (Right) */}
            <div
              onClick={() => { setSelectedAgentId('finance'); setSelectedEdgeId(null); }}
              className={`absolute top-[52%] left-[78%] -translate-x-1/2 -translate-y-1/2 p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 z-10 ${
                selectedAgentId === 'finance'
                  ? 'bg-ink-850 border-amber-400 shadow-lg scale-105 ring-2 ring-amber-400/30'
                  : 'bg-ink-900/95 border-amber-500/40 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 font-bold text-xs">
                  FI
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-ink-100">Finance Agent</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[10px] text-ink-400">FP&A Modeling</p>
                  <span className="text-[9px] font-mono text-red-400 bg-red-950 px-1 py-0.2 rounded mt-0.5 inline-block">
                    No Payment Exec
                  </span>
                </div>
              </div>
            </div>

            {/* Node 4: Legal Agent (Bottom Left) */}
            <div
              onClick={() => { setSelectedAgentId('legal'); setSelectedEdgeId(null); }}
              className={`absolute top-[82%] left-[38%] -translate-x-1/2 -translate-y-1/2 p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 z-10 ${
                selectedAgentId === 'legal'
                  ? 'bg-ink-850 border-purple-400 shadow-lg scale-105 ring-2 ring-purple-400/30'
                  : 'bg-ink-900/95 border-purple-500/40 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/40 font-bold text-xs">
                  LE
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-ink-100">Legal Agent</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[10px] text-ink-400">Compliance & Claims</p>
                  <span className="text-[9px] font-mono text-purple-400 bg-purple-950 px-1 py-0.2 rounded mt-0.5 inline-block">
                    Grounding Verifier
                  </span>
                </div>
              </div>
            </div>

            {/* Node 5: Marketing Agent (Bottom Right) */}
            <div
              onClick={() => { setSelectedAgentId('marketing'); setSelectedEdgeId(null); }}
              className={`absolute top-[82%] left-[62%] -translate-x-1/2 -translate-y-1/2 p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 z-10 ${
                selectedAgentId === 'marketing'
                  ? 'bg-ink-850 border-pink-400 shadow-lg scale-105 ring-2 ring-pink-400/30'
                  : 'bg-ink-900/95 border-pink-500/40 hover:border-pink-400'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/40 font-bold text-xs">
                  MK
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-ink-100">Marketing Agent</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[10px] text-ink-400">Growth & Campaigns</p>
                  <span className="text-[9px] font-mono text-amber-400 bg-amber-950 px-1 py-0.2 rounded mt-0.5 inline-block">
                    Approval First Gate
                  </span>
                </div>
              </div>
            </div>

            {/* External Untrusted Boundary Node: KV-DOC-904 */}
            <div
              onClick={() => setSelectedEdgeId('research-injection')}
              className="absolute top-[82%] left-[10%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border border-red-500/60 bg-red-950/40 cursor-pointer text-center z-10 hover:border-red-400"
            >
              <div className="flex items-center justify-center space-x-1 text-red-400 font-bold text-[10px]">
                <XCircle className="w-3.5 h-3.5" />
                <span>External Leak PDF</span>
              </div>
              <span className="text-[9px] font-mono text-red-300 block mt-0.5">[POL-006 BLOCKED]</span>
            </div>

            {/* External Boundary: Stripe API */}
            <div
              onClick={() => setSelectedEdgeId('finance-payment')}
              className="absolute top-[35%] left-[90%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border border-red-500/60 bg-red-950/40 cursor-pointer text-center z-10 hover:border-red-400"
            >
              <div className="flex items-center justify-center space-x-1 text-red-400 font-bold text-[10px]">
                <Lock className="w-3.5 h-3.5" />
                <span>Stripe Gateway</span>
              </div>
              <span className="text-[9px] font-mono text-red-300 block mt-0.5">[POL-004 BLOCKED]</span>
            </div>

            {/* External Boundary: PR Wire Gate */}
            <div
              onClick={() => setSelectedEdgeId('marketing-pr')}
              className="absolute top-[82%] left-[90%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border border-amber-500/60 bg-amber-950/40 cursor-pointer text-center z-10 hover:border-amber-400"
            >
              <div className="flex items-center justify-center space-x-1 text-amber-400 font-bold text-[10px]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Public PR Wire</span>
              </div>
              <span className="text-[9px] font-mono text-amber-300 block mt-0.5">[POL-003 GATE]</span>
            </div>
          </div>

          {/* Interactive Connection Selector chips */}
          <div className="pt-4 border-t border-ink-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[10px] font-mono uppercase text-ink-500 mr-2 font-semibold">
              Inspect Boundary Edge:
            </span>
            {edges.map(edge => (
              <button
                key={edge.id}
                onClick={() => setSelectedEdgeId(edge.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all border ${
                  selectedEdgeId === edge.id
                    ? 'bg-ink-800 border-teal-400 text-teal-300 shadow-sm'
                    : 'bg-ink-850/80 border-ink-750 text-ink-400 hover:text-ink-200'
                }`}
              >
                {edge.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Details Panel (Span 4) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedEdge ? (
            /* Selected Edge Details */
            <div className="p-5 rounded-2xl bg-ink-900 border border-ink-800 sticky top-20 shadow-xl space-y-4 animate-in fade-in duration-150">
              <div className="flex items-start justify-between border-b border-ink-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                    Trust Boundary Inspection
                  </span>
                  <h3 className="text-base font-bold text-ink-100 mt-0.5">{selectedEdge.label}</h3>
                </div>
                <button
                  onClick={() => setSelectedEdgeId(null)}
                  className="p-1 rounded-lg text-ink-400 hover:text-ink-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-ink-850 border border-ink-800 text-xs">
                <span className="text-[10px] font-mono uppercase text-ink-400 block mb-1">
                  Enforcement Policy
                </span>
                <p className="text-ink-200 leading-relaxed font-medium">
                  {selectedEdge.rule}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-ink-950 border border-ink-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-ink-400">Boundary Posture:</span>
                  <span className="font-mono font-bold text-amber-400">{selectedEdge.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-400">Active Autonomy Mode:</span>
                  <span className="font-mono text-teal-400">{autonomyMode}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Selected Agent Details */
            <div className="p-5 rounded-2xl bg-ink-900 border border-ink-800 sticky top-20 shadow-xl space-y-4 animate-in fade-in duration-150">
              <div className="flex items-start justify-between border-b border-ink-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-ink-950"
                    style={{ backgroundColor: selectedAgent.avatarColor }}
                  >
                    {selectedAgent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink-100">{selectedAgent.name}</h3>
                    <p className="text-xs text-ink-400">{selectedAgent.department}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleAgentStatus(selectedAgent.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-colors ${
                    selectedAgent.status === 'ACTIVE'
                      ? 'bg-red-950 text-red-300 hover:bg-red-900 border border-red-800'
                      : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800'
                  }`}
                >
                  {selectedAgent.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                </button>
              </div>

              {/* Plain Language Boundaries */}
              <div className="p-3.5 rounded-xl bg-ink-850/70 border border-ink-800 text-xs">
                <span className="text-[10px] font-mono uppercase text-teal-400 block mb-2 font-semibold flex items-center">
                  <Info className="w-3.5 h-3.5 mr-1" />
                  Plain Language Policy Boundaries
                </span>
                <ul className="space-y-1.5 text-ink-200 text-[11px]">
                  {selectedAgent.plainLanguageBoundaries.map((b, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-teal-400 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data Scope Permitted vs Restricted */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1 font-semibold flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Permitted Data Scope
                  </span>
                  <ul className="space-y-1 text-emerald-200 text-[11px]">
                    {selectedAgent.allowedDataScope.map((scope, idx) => (
                      <li key={idx} className="truncate">› {scope}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40">
                  <span className="text-[10px] font-mono uppercase text-red-400 block mb-1 font-semibold flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    Restricted Data Scope (Hard Block)
                  </span>
                  <ul className="space-y-1 text-red-200 text-[11px]">
                    {selectedAgent.restrictedDataScope.map((scope, idx) => (
                      <li key={idx} className="truncate">› {scope}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Allowed Tools */}
              <div className="p-3 rounded-xl bg-ink-950 border border-ink-800 text-xs">
                <span className="text-[10px] font-mono uppercase text-ink-400 block mb-1.5 font-semibold">
                  Authorized Tool Integrations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.allowedTools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-ink-850 border border-ink-750 text-ink-300 font-mono text-[10px]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrustGraphView;
