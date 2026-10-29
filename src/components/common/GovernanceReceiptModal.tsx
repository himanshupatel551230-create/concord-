import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import {
  FileText,
  Shield,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Database,
  Lock,
  ExternalLink,
  Copy,
  Check,
  X,
  Cpu
} from 'lucide-react';
import { PolicyOutcome, EventSeverity } from '../../types';

export const GovernanceReceiptModal: React.FC = () => {
  const { selectedReceipt, closeReceipt } = useGovernance();
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!selectedReceipt) return null;

  const rec = selectedReceipt;

  const getOutcomeBadge = (outcome: PolicyOutcome) => {
    switch (outcome) {
      case 'ALLOWED':
        return {
          label: 'Allowed & Verified',
          icon: ShieldCheck,
          classes: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
        };
      case 'BLOCKED':
        return {
          label: 'Action Blocked',
          icon: XCircle,
          classes: 'bg-red-950/80 text-red-300 border-red-500/40'
        };
      case 'ESCALATED':
        return {
          label: 'Escalated to Human Review',
          icon: AlertTriangle,
          classes: 'bg-amber-950/80 text-amber-300 border-amber-500/40'
        };
      case 'DEDUPLICATED':
        return {
          label: 'Deduplicated & Cached',
          icon: RotateCcw,
          classes: 'bg-teal-950/80 text-teal-300 border-teal-500/40'
        };
    }
  };

  const getSeverityBadge = (severity: EventSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-900/40 text-red-300 border-red-700/50';
      case 'HIGH':
        return 'bg-amber-900/40 text-amber-300 border-amber-700/50';
      case 'MEDIUM':
        return 'bg-blue-900/40 text-blue-300 border-blue-700/50';
      default:
        return 'bg-ink-800 text-ink-300 border-ink-700';
    }
  };

  const badge = getOutcomeBadge(rec.outcome);
  const OutcomeIcon = badge.icon;

  const copyReceiptHash = () => {
    navigator.clipboard.writeText(rec.technicalDetails.hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-ink-900 border border-ink-750 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-ink-800 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-ink-800 border border-ink-700 flex items-center justify-center text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-ink-400">{rec.receiptId}</span>
                <span className="text-ink-600">•</span>
                <span className="text-xs font-mono text-ink-400">
                  {new Date(rec.timestamp).toLocaleTimeString()} UTC
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${getSeverityBadge(rec.severity)}`}>
                  {rec.severity}
                </span>
              </div>
              <h2 className="text-lg font-bold text-ink-100 mt-1">Concord Governance Receipt</h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${badge.classes}`}>
              <OutcomeIcon className="w-3.5 h-3.5" />
              <span>{badge.label}</span>
            </div>
            <button
              onClick={closeReceipt}
              className="p-1 rounded-lg text-ink-400 hover:text-ink-200 hover:bg-ink-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Plain Language Summary Card */}
        <div className="p-4 rounded-xl bg-ink-950/80 border border-ink-800 mb-5">
          <span className="text-[10px] font-mono tracking-wider text-teal-400 uppercase block mb-1">
            Executive Governance Summary
          </span>
          <p className="text-sm text-ink-200 leading-relaxed font-normal">
            {rec.plainLanguageSummary}
          </p>
        </div>

        {/* 2-Column Core Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-xs">
          {/* Agent Identity & Attempted Action */}
          <div className="p-4 rounded-xl bg-ink-850/60 border border-ink-800">
            <span className="text-[10px] font-mono uppercase text-ink-400 block mb-2 font-semibold">
              Agent Identity & Scope
            </span>
            <div className="space-y-1.5">
              <div>
                <span className="text-ink-400 text-[11px]">Executing Agent:</span>
                <p className="font-semibold text-ink-100">{rec.agentName}</p>
                <p className="text-[11px] text-ink-400">{rec.agentRole} ({rec.department})</p>
              </div>
              <div className="pt-2 border-t border-ink-800">
                <span className="text-ink-400 text-[11px]">Action Attempted:</span>
                <p className="font-mono text-ink-200 text-[11px] bg-ink-900 p-1.5 rounded mt-1 break-all">
                  {rec.actionAttempted}
                </p>
              </div>
            </div>
          </div>

          {/* Policy & Rule Triggered */}
          <div className="p-4 rounded-xl bg-ink-850/60 border border-ink-800">
            <span className="text-[10px] font-mono uppercase text-ink-400 block mb-2 font-semibold">
              Policy Verification
            </span>
            <div className="space-y-1.5">
              <div>
                <span className="text-ink-400 text-[11px]">Policy Evaluated:</span>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="px-1.5 py-0.5 rounded bg-ink-800 border border-ink-700 font-mono text-[10px] text-teal-300">
                    {rec.policyCode}
                  </span>
                  <span className="font-medium text-ink-100 text-[11px]">{rec.policyTitle}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-ink-800">
                <span className="text-ink-400 text-[11px]">Next Automated Action Taken:</span>
                <p className="text-ink-300 text-[11px] mt-1 leading-snug">
                  {rec.nextActionTaken}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence & Approved Knowledge Used */}
        <div className="p-4 rounded-xl bg-ink-850/60 border border-ink-800 mb-5 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-ink-400 font-semibold flex items-center">
              <Database className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
              Evidence & Approved Knowledge Citations
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
              rec.evidenceUsed.isApproved
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                : 'bg-red-950/60 text-red-300 border border-red-800/40'
            }`}>
              {rec.evidenceUsed.sourceType.replace(/_/g, ' ')}
            </span>
          </div>

          {rec.evidenceUsed.docId ? (
            <div className="p-3 rounded-lg bg-ink-950/70 border border-ink-800">
              <div className="flex items-center space-x-2 text-[11px] font-medium text-ink-100">
                <span className="text-teal-400 font-mono">{rec.evidenceUsed.docId}</span>
                <span>•</span>
                <span>{rec.evidenceUsed.docTitle}</span>
              </div>
              {rec.evidenceUsed.snippet && (
                <div className="mt-2 text-ink-300 text-[11px] font-mono bg-ink-900 p-2 rounded border border-ink-800/70 italic">
                  "{rec.evidenceUsed.snippet}"
                </div>
              )}
            </div>
          ) : (
            <p className="text-ink-400 text-[11px] italic">No approved Knowledge Vault source cited for this action.</p>
          )}
        </div>

        {/* Data Access Boundary Differential */}
        <div className="p-4 rounded-xl bg-ink-850/60 border border-ink-800 mb-5 text-xs">
          <span className="text-[10px] font-mono uppercase text-ink-400 block mb-2 font-semibold flex items-center">
            <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            Data Access Perimeter & Boundary Filtering
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-ink-950/80 border border-ink-800">
              <span className="text-ink-400 block mb-1 font-semibold">Data Requested:</span>
              <ul className="space-y-1 text-ink-300 list-disc list-inside">
                {rec.dataBoundaryDiff.requested.map((item, idx) => (
                  <li key={idx} className="truncate">{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
              <span className="text-emerald-400 block mb-1 font-semibold">Data Permitted:</span>
              <ul className="space-y-1 text-emerald-200 list-disc list-inside">
                {rec.dataBoundaryDiff.allowed.map((item, idx) => (
                  <li key={idx} className="truncate">{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/40">
              <span className="text-red-400 block mb-1 font-semibold">Redacted / Blocked:</span>
              <ul className="space-y-1 text-red-200 list-disc list-inside">
                {rec.dataBoundaryDiff.redactedOrBlocked.length > 0 ? (
                  rec.dataBoundaryDiff.redactedOrBlocked.map((item, idx) => (
                    <li key={idx} className="truncate">{item}</li>
                  ))
                ) : (
                  <span className="text-ink-500 italic">None blocked</span>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Human Review Decision Section if recorded */}
        {rec.humanDecision?.required && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 mb-5 text-xs">
            <span className="text-[10px] font-mono uppercase text-amber-400 block mb-2 font-semibold">
              Human Reviewer Oversight
            </span>
            <div className="flex items-center space-x-3 text-ink-200">
              <div className="p-2 rounded bg-amber-900/40 text-amber-300">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-ink-100">
                  {rec.humanDecision.decision
                    ? `Human Decision: ${rec.humanDecision.decision}`
                    : 'Awaiting Human Review in Concord Review Queue'}
                </p>
                {rec.humanDecision.decidedBy && (
                  <p className="text-[11px] text-ink-400">
                    Decided by {rec.humanDecision.decidedBy} at {new Date(rec.humanDecision.decidedAt!).toLocaleTimeString()}
                  </p>
                )}
                {rec.humanDecision.overrideReason && (
                  <p className="text-[11px] text-amber-300 mt-1">
                    Override Justification: "{rec.humanDecision.overrideReason}"
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Expandable Technical Details Accordion */}
        <div className="border border-ink-800 rounded-xl overflow-hidden mb-2">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full px-4 py-3 bg-ink-950 flex items-center justify-between text-xs font-semibold text-ink-300 hover:text-ink-100 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>Technical Verification & Cryptographic Ledger Details</span>
            </span>
            {showTechnicalDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {showTechnicalDetails && (
            <div className="p-4 bg-ink-950/90 border-t border-ink-800 text-xs space-y-3 font-mono">
              <div className="flex items-center justify-between bg-ink-900 p-2 rounded">
                <span className="text-ink-400 text-[11px]">Audit Hash:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-teal-400 text-[11px]">{rec.technicalDetails.hash}</span>
                  <button
                    onClick={copyReceiptHash}
                    className="text-ink-400 hover:text-ink-200 transition-colors"
                    title="Copy hash"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-ink-900 p-2 rounded">
                  <span className="text-ink-400 block mb-0.5">Evaluation Latency:</span>
                  <span className="text-ink-200">{rec.technicalDetails.evaluationLatencyMs} ms</span>
                </div>
                <div className="bg-ink-900 p-2 rounded">
                  <span className="text-ink-400 block mb-0.5">Sandbox Containment:</span>
                  <span className={rec.technicalDetails.sandboxIsolationActive ? 'text-red-400' : 'text-emerald-400'}>
                    {rec.technicalDetails.sandboxIsolationActive ? 'ISOLATED (UNTRUSTED)' : 'PASSIVE MONITOR'}
                  </span>
                </div>
              </div>

              {rec.technicalDetails.tokenUsage.savedByDeduplication && (
                <div className="bg-teal-950/40 border border-teal-800/40 p-2.5 rounded text-teal-300 text-[11px]">
                  <strong>Deduplication Efficiency:</strong> Saved {rec.technicalDetails.tokenUsage.savedByDeduplication.toLocaleString()} redundant tokens by reusing approved internal cache.
                </div>
              )}

              {rec.technicalDetails.boundaryViolation && (
                <div className="bg-red-950/40 border border-red-800/40 p-2.5 rounded text-red-300 text-[11px]">
                  <strong>Boundary Violation Trace:</strong> {rec.technicalDetails.boundaryViolation}
                </div>
              )}

              <div>
                <span className="text-ink-400 block mb-1 text-[11px]">Policy Engine Trace:</span>
                <div className="bg-ink-900 p-2.5 rounded text-ink-300 text-[10px] space-y-1">
                  {rec.technicalDetails.ruleEvaluationTrace.map((rule, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <span className="text-teal-500">›</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3">
          <button
            onClick={closeReceipt}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-ink-800 hover:bg-ink-750 text-ink-200 transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default GovernanceReceiptModal;
