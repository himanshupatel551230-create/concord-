import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { GovernanceReceipt, AuditLogEntry, PolicyOutcome } from '../types';
import {
  History,
  Download,
  Search,
  Filter,
  FileText,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  Database,
  Lock,
  Cpu,
  Clock,
  ExternalLink
} from 'lucide-react';

export const IncidentReplayView: React.FC = () => {
  const {
    receipts,
    auditLogs,
    exportAuditData,
    openReceipt
  } = useGovernance();

  const receiptList = Object.values(receipts);
  const [currentStepIndex, setCurrentStepIndex] = useState(receiptList.length - 1); // Default to latest (rec-005)
  const [searchAudit, setSearchAudit] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const currentReceipt: GovernanceReceipt | undefined = receiptList[currentStepIndex] || receiptList[0];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchAudit.toLowerCase()) ||
      (log.agentName && log.agentName.toLowerCase().includes(searchAudit.toLowerCase())) ||
      (log.policyCode && log.policyCode.toLowerCase().includes(searchAudit.toLowerCase()));

    if (selectedSeverity !== 'ALL') {
      return matchesSearch && log.severity === selectedSeverity;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
              Forensic Replay & Compliance Ledger
            </span>
            <span className="text-xs text-ink-400">• Northstar Audit Trail</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-100 tracking-tight mt-1.5">
            Incident Replay & Governance Ledger
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            Chronologically step through agent decisions, policy evaluations, and boundary containment receipts.
          </p>
        </div>

        {/* Export Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportAuditData('json')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-ink-850 hover:bg-ink-800 text-teal-300 border border-ink-750 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
          <button
            onClick={() => exportAuditData('csv')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-glow-teal transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Signature Timeline Scrubber Section */}
      <div className="p-6 rounded-2xl bg-ink-900 border border-ink-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink-100">Workflow Incident Replay</h3>
              <p className="text-xs text-ink-400">Step chronologically through the launch decision sequence.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-ink-400">
            <span>Event {currentStepIndex + 1} of {receiptList.length}</span>
          </div>
        </div>

        {/* Scrubber Navigation Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-400 mb-1">
            <span>Launch Sequence Timeline</span>
            <span className="font-mono text-teal-400">{currentReceipt?.receiptId}</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {receiptList.map((rec, idx) => {
              const isCurrent = currentStepIndex === idx;

              return (
                <button
                  key={rec.receiptId}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all relative ${
                    isCurrent
                      ? 'bg-ink-850 border-teal-500 shadow-glow-teal ring-1 ring-teal-500/30'
                      : 'bg-ink-950/70 border-ink-800 hover:border-ink-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-teal-400 font-bold">
                      Step {idx + 1}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      rec.outcome === 'ALLOWED' ? 'bg-emerald-400' :
                      rec.outcome === 'BLOCKED' ? 'bg-red-400' :
                      rec.outcome === 'ESCALATED' ? 'bg-amber-400' : 'bg-teal-400'
                    }`} />
                  </div>
                  <p className="text-[11px] font-semibold text-ink-200 truncate">{rec.agentName}</p>
                  <p className="text-[10px] text-ink-400 font-mono mt-0.5">{rec.policyCode}</p>
                </button>
              );
            })}
          </div>

          {/* Scrubber Range Slider */}
          <input
            type="range"
            min={0}
            max={receiptList.length - 1}
            value={currentStepIndex}
            onChange={e => setCurrentStepIndex(parseInt(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer mt-3"
          />
        </div>

        {/* Selected Scrubber Event: Embedded Live Governance Receipt */}
        {currentReceipt && (
          <div className="p-5 rounded-2xl bg-ink-950/90 border border-ink-800 mt-4 space-y-4">
            <div className="flex items-start justify-between border-b border-ink-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-teal-400 font-bold">{currentReceipt.receiptId}</span>
                  <span className="text-ink-600">•</span>
                  <span className="text-xs font-mono text-ink-400">
                    {new Date(currentReceipt.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    currentReceipt.outcome === 'ALLOWED' ? 'bg-emerald-950 text-emerald-300' :
                    currentReceipt.outcome === 'BLOCKED' ? 'bg-red-950 text-red-300' :
                    currentReceipt.outcome === 'ESCALATED' ? 'bg-amber-950 text-amber-300' :
                    'bg-teal-950 text-teal-300'
                  }`}>
                    {currentReceipt.outcome}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink-100 mt-1">
                  [{currentReceipt.policyCode}] {currentReceipt.policyTitle}
                </h4>
              </div>

              <button
                onClick={() => openReceipt(currentReceipt.receiptId)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-950 hover:bg-teal-900 text-teal-300 border border-teal-800 text-xs font-semibold transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full Modal View</span>
              </button>
            </div>

            {/* Plain language summary */}
            <p className="text-xs text-ink-200 leading-relaxed bg-ink-900 p-3 rounded-xl border border-ink-800">
              {currentReceipt.plainLanguageSummary}
            </p>

            {/* 3-Column Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-ink-900 border border-ink-800">
                <span className="text-ink-400 block mb-1 text-[11px]">Action Attempted:</span>
                <span className="font-mono text-ink-200 text-[11px] break-all">{currentReceipt.actionAttempted}</span>
              </div>
              <div className="p-3 rounded-xl bg-ink-900 border border-ink-800">
                <span className="text-ink-400 block mb-1 text-[11px]">Next Automated Action:</span>
                <span className="text-ink-200 text-[11px]">{currentReceipt.nextActionTaken}</span>
              </div>
              <div className="p-3 rounded-xl bg-ink-900 border border-ink-800 font-mono">
                <span className="text-ink-400 block mb-1 text-[11px]">Cryptographic Hash:</span>
                <span className="text-teal-400 text-[11px]">{currentReceipt.technicalDetails.hash}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comprehensive Audit Trail Log Table */}
      <div className="p-6 rounded-2xl bg-ink-900 border border-ink-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-ink-100">Audit Trail Ledger</h3>
            <p className="text-xs text-ink-400">Append-only compliance log of policy enforcements, config updates, and human overrides.</p>
          </div>

          {/* Search & Severity Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-ink-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchAudit}
                onChange={e => setSearchAudit(e.target.value)}
                placeholder="Filter logs..."
                className="w-full bg-ink-950 border border-ink-750 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-ink-100 placeholder-ink-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <select
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value)}
              className="bg-ink-950 border border-ink-750 rounded-lg px-2.5 py-1.5 text-xs text-ink-300 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="LOW">Low</option>
              <option value="INFO">Info</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-ink-800 text-[10px] font-mono uppercase text-ink-400">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Agent</th>
                <th className="py-2.5 px-3">Policy</th>
                <th className="py-2.5 px-3">Outcome</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800/80">
              {filteredLogs.map(entry => (
                <tr key={entry.id} className="hover:bg-ink-850/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-ink-400 whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-ink-300">
                    {entry.eventType}
                  </td>
                  <td className="py-3 px-3 font-semibold text-ink-200 whitespace-nowrap">
                    {entry.agentName || 'System'}
                  </td>
                  <td className="py-3 px-3 font-mono text-teal-300 whitespace-nowrap">
                    {entry.policyCode || '—'}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      entry.outcome === 'ALLOWED' ? 'bg-emerald-950 text-emerald-300' :
                      entry.outcome === 'BLOCKED' ? 'bg-red-950 text-red-300' :
                      entry.outcome === 'ESCALATED' ? 'bg-amber-950 text-amber-300' :
                      entry.outcome === 'DEDUPLICATED' ? 'bg-teal-950 text-teal-300' :
                      'bg-ink-800 text-ink-300'
                    }`}>
                      {entry.outcome}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-ink-300 leading-snug max-w-md">
                    {entry.description}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {entry.receiptId ? (
                      <button
                        onClick={() => openReceipt(entry.receiptId!)}
                        className="text-teal-400 hover:text-teal-300 font-mono text-[11px] underline flex items-center space-x-1"
                      >
                        <span>Receipt</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-ink-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncidentReplayView;
