import React from 'react';
import { useGovernance } from '../context/GovernanceContext';
import {
  ShieldAlert,
  ShieldCheck,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Users,
  Database,
  ArrowRight,
  TrendingDown,
  Layers,
  FileText,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Zap
} from 'lucide-react';

interface CommandCenterProps {
  onNavigate: (view: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onNavigate }) => {
  const {
    autonomyMode,
    agents,
    policies,
    workflowSteps,
    reviewItems,
    receipts,
    openReceipt,
    auditLogs
  } = useGovernance();

  const pendingReviews = reviewItems.filter(r => r.status === 'PENDING');
  const activeAgents = agents.filter(a => a.status === 'ACTIVE');
  const enabledPolicies = policies.filter(p => p.enabled);

  // Workflow progress calculation
  const completedSteps = workflowSteps.filter(s => s.status === 'COMPLETED' || s.status === 'DEDUPLICATED').length;
  const progressPct = Math.round((completedSteps / workflowSteps.length) * 100);

  // Severity metrics
  const blockedCount = Object.values(receipts).filter(r => r.outcome === 'BLOCKED').length;
  const escalatedCount = Object.values(receipts).filter(r => r.outcome === 'ESCALATED').length;
  const deduplicatedCount = Object.values(receipts).filter(r => r.outcome === 'DEDUPLICATED').length;
  const allowedCount = Object.values(receipts).filter(r => r.outcome === 'ALLOWED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Operational Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
              Operational Oversight
            </span>
            <span className="text-xs text-ink-400">• Northstar Retail Q4 Omnichannel Product Launch</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-100 tracking-tight mt-1.5">
            Governance Command Center
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            Real-time policy enforcement, inter-agent access perimeter monitoring, and human decision queue.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('trust-graph')}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-ink-850 hover:bg-ink-800 text-teal-300 border border-ink-750 transition-colors"
          >
            <span>View Trust Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('workflow-studio')}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-glow-teal transition-all"
          >
            <span>Inspect Workflow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Prominent "Needs Your Decision" Queue Banner */}
      {pendingReviews.length > 0 ? (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-ink-900 to-ink-900 border border-amber-500/50 shadow-glow-amber">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Human Review Required ({pendingReviews.length} Action Pending)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                    High Urgency
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink-100 mt-1">
                  Marketing Agent proposes unverified 400% performance claim for launch copy
                </h3>
                <p className="text-xs text-ink-300 mt-1 max-w-3xl leading-relaxed">
                  Concord paused external PR publication under policy <strong className="text-amber-300">POL-001 (Unsupported Performance Claims)</strong>.
                  Supporting engineering report KV-103 verifies a 28% latency improvement, but no citation exists for 400%.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => onNavigate('review-queue')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-ink-950 shadow-md transition-all flex items-center space-x-1.5"
              >
                <span>Open Decision Workspace</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-ink-900/80 border border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-semibold text-ink-100">Review Queue Cleared</p>
              <p className="text-[11px] text-ink-400">All escalated marketing claims and high-impact actions have been decided by human compliance.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('review-queue')}
            className="text-xs text-teal-400 hover:underline font-medium"
          >
            View Resolved History →
          </button>
        </div>
      )}

      {/* Primary Operational Metric Cards (Meaningful Demo Context) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Live Workflow Status */}
        <div
          onClick={() => onNavigate('workflow-studio')}
          className="p-4 rounded-xl bg-ink-900 border border-ink-800 hover:border-teal-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-ink-400 mb-2">
            <span className="font-medium">Workflow Progress</span>
            <span className="font-mono text-teal-400">{progressPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-ink-800 overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-ink-300 font-medium">Step 5 of 7 active</span>
            <span className="text-ink-400 group-hover:text-teal-300 transition-colors">Inspect →</span>
          </div>
        </div>

        {/* Card 2: Duplication Avoided */}
        <div
          onClick={() => openReceipt('rec-002')}
          className="p-4 rounded-xl bg-ink-900 border border-ink-800 hover:border-teal-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-ink-400 mb-1">
            <span className="font-medium">Redundant Work Avoided</span>
            <RotateCcw className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-ink-100 font-mono">38.4k</span>
            <span className="text-xs text-emerald-400 font-medium">tokens saved</span>
          </div>
          <p className="text-[11px] text-ink-400 mt-1 line-clamp-1">
            Coordinator reused cached TAM report KV-101.
          </p>
        </div>

        {/* Card 3: Boundary Interceptions (Prompt Injection + Payment) */}
        <div
          onClick={() => openReceipt('rec-003')}
          className="p-4 rounded-xl bg-ink-900 border border-ink-800 hover:border-red-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-ink-400 mb-1">
            <span className="font-medium">Actions Blocked</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-red-400 font-mono">{blockedCount}</span>
            <span className="text-[11px] text-red-300/80 font-mono">High Risk</span>
          </div>
          <p className="text-[11px] text-ink-400 mt-1 line-clamp-1">
            Prompt injection contained in KV-DOC-904.
          </p>
        </div>

        {/* Card 4: Active Guard Perimeter */}
        <div
          onClick={() => onNavigate('policy-studio')}
          className="p-4 rounded-xl bg-ink-900 border border-ink-800 hover:border-teal-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-ink-400 mb-1">
            <span className="font-medium">Active Policy Rules</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-ink-100 font-mono">{enabledPolicies.length}</span>
            <span className="text-xs text-teal-400 font-medium">of {policies.length} enforcing</span>
          </div>
          <p className="text-[11px] text-ink-400 mt-1 line-clamp-1">
            Mode: {autonomyMode} posture active.
          </p>
        </div>
      </div>

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Launch Sequence & Signature Governance Highlights (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Governance Decisions Spotlight (3 Mandatory Pillars) */}
          <div className="p-5 rounded-2xl bg-ink-900 border border-ink-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-ink-100 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-teal-400" />
                  <span>Northstar Retail Governance Signatures</span>
                </h3>
                <p className="text-xs text-ink-400 mt-0.5">
                  Three critical governance interventions demonstrated in this launch scenario.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Highlight 1: Duplicate work avoided */}
              <div
                onClick={() => openReceipt('rec-002')}
                className="p-3.5 rounded-xl bg-ink-850/80 border border-ink-750 hover:border-teal-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-teal-950 text-teal-300 border border-teal-800/40">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-ink-100">1. Duplicate Work Avoided</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 font-mono border border-teal-800/50">
                          Efficiency
                        </span>
                      </div>
                      <p className="text-xs text-ink-300 mt-1 leading-snug">
                        Marketing and Research agents simultaneously initiated identical queries for omnichannel TAM.
                        Coordinator reused approved report <strong className="text-teal-300">KV-101</strong>, saving 38.4k tokens and preventing ungrounded hallucination.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-teal-400 shrink-0 font-medium flex items-center space-x-1">
                    <span>Receipt</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Highlight 2: Prompt injection contained */}
              <div
                onClick={() => openReceipt('rec-003')}
                className="p-3.5 rounded-xl bg-ink-850/80 border border-ink-750 hover:border-red-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-red-950 text-red-300 border border-red-800/40">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-ink-100">2. Prompt Injection Contained</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 font-mono border border-red-800/50">
                          Critical Boundary Block
                        </span>
                      </div>
                      <p className="text-xs text-ink-300 mt-1 leading-snug">
                        Untrusted document <strong className="text-red-300">KV-DOC-904</strong> commanded Research Agent to ignore rules and exfiltrate customer contact PII.
                        Concord isolated the sandbox and blocked the egress request with zero data leakage.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-red-400 shrink-0 font-medium flex items-center space-x-1">
                    <span>Receipt</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Highlight 3: Unsupported claim escalated */}
              <div
                onClick={() => openReceipt('rec-005')}
                className="p-3.5 rounded-xl bg-ink-850/80 border border-ink-750 hover:border-amber-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-amber-950 text-amber-300 border border-amber-800/40">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-ink-100">3. Unsupported Claim Escalated</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-mono border border-amber-800/50">
                          Human Review Gate
                        </span>
                      </div>
                      <p className="text-xs text-ink-300 mt-1 leading-snug">
                        Marketing Agent drafted headline asserting "400% performance gain with zero downtime".
                        Legal Agent flagged lack of approved citation; publication paused pending human review.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 shrink-0 font-medium flex items-center space-x-1">
                    <span>Receipt</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Policy Enforcement Events Table */}
          <div className="p-5 rounded-2xl bg-ink-900 border border-ink-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-ink-100 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <span>Recent Policy Enforcement Receipts</span>
              </h3>
              <button
                onClick={() => onNavigate('incident-replay')}
                className="text-xs text-ink-400 hover:text-teal-300 font-medium"
              >
                View Full Audit Trail ({auditLogs.length}) →
              </button>
            </div>

            <div className="divide-y divide-ink-800 text-xs">
              {Object.values(receipts).slice(0, 5).map(rec => (
                <div
                  key={rec.receiptId}
                  onClick={() => openReceipt(rec.receiptId)}
                  className="py-3 flex items-center justify-between hover:bg-ink-850/50 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-2 h-2 rounded-full ${
                      rec.outcome === 'ALLOWED' ? 'bg-emerald-400' :
                      rec.outcome === 'BLOCKED' ? 'bg-red-400' :
                      rec.outcome === 'ESCALATED' ? 'bg-amber-400' : 'bg-teal-400'
                    }`} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-ink-200">{rec.agentName}</span>
                        <span className="text-ink-500 font-mono text-[10px]">[{rec.policyCode}]</span>
                      </div>
                      <p className="text-ink-400 text-[11px] line-clamp-1 mt-0.5">{rec.plainLanguageSummary}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-right shrink-0">
                    <span className="text-[10px] font-mono text-ink-500">
                      {new Date(rec.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      rec.outcome === 'ALLOWED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                      rec.outcome === 'BLOCKED' ? 'bg-red-950 text-red-300 border-red-800' :
                      rec.outcome === 'ESCALATED' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                      'bg-teal-950 text-teal-300 border-teal-800'
                    }`}>
                      {rec.outcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Agent Roster & Health + Policy Severity Matrix */}
        <div className="space-y-6">
          {/* Agent Fleet Health */}
          <div className="p-5 rounded-2xl bg-ink-900 border border-ink-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-ink-100 flex items-center space-x-2">
                <Users className="w-4 h-4 text-teal-400" />
                <span>Northstar Agent Fleet</span>
              </h3>
              <button
                onClick={() => onNavigate('agent-directory')}
                className="text-xs text-ink-400 hover:text-teal-300"
              >
                Manage →
              </button>
            </div>

            <div className="space-y-3">
              {agents.map(agent => (
                <div
                  key={agent.id}
                  onClick={() => onNavigate('agent-directory')}
                  className="p-3 rounded-xl bg-ink-850/60 border border-ink-800 hover:border-ink-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-ink-950"
                        style={{ backgroundColor: agent.avatarColor }}
                      >
                        {agent.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-ink-200">{agent.name}</p>
                        <p className="text-[10px] text-ink-400">{agent.department}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      agent.status === 'ACTIVE'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : 'bg-red-950 text-red-400 border border-red-800/40'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Events by Severity */}
          <div className="p-5 rounded-2xl bg-ink-900 border border-ink-800">
            <h3 className="text-sm font-bold text-ink-100 mb-3 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Policy Interceptions by Severity</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-red-950/20 border border-red-900/30">
                <span className="flex items-center space-x-2 text-red-300">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Critical (PII & Payment)</span>
                </span>
                <span className="font-mono font-bold text-red-400">{blockedCount} Blocked</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/20 border border-amber-900/30">
                <span className="flex items-center space-x-2 text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>High (Unverified Claims)</span>
                </span>
                <span className="font-mono font-bold text-amber-400">{escalatedCount} Escalated</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-teal-950/20 border border-teal-900/30">
                <span className="flex items-center space-x-2 text-teal-300">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>Low (Cache Deduplication)</span>
                </span>
                <span className="font-mono font-bold text-teal-400">{deduplicatedCount} Reused</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                <span className="flex items-center space-x-2 text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Info (Authorized Flow)</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">{allowedCount} Passed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
