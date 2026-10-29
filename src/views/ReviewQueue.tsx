import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { ReviewItem } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit3,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
  Database,
  Lock,
  ExternalLink,
  Info,
  Check,
  X
} from 'lucide-react';

interface ReviewQueueProps {
  onNavigate: (view: string) => void;
}

export const ReviewQueue: React.FC<ReviewQueueProps> = ({ onNavigate }) => {
  const {
    reviewItems,
    resolveReviewItem,
    openReceipt,
    knowledgeDocs
  } = useGovernance();

  const [activeTab, setActiveTab] = useState<'PENDING' | 'RESOLVED'>('PENDING');
  const [selectedItemId, setSelectedItemId] = useState<string>(reviewItems[0]?.id || '');

  // Modals for actions
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Form states
  const [editClaimText, setEditClaimText] = useState(
    'Northstar’s new omnichannel platform delivers up to 28% faster checkout latency with enterprise-grade 99.95% uptime SLA, verified by Engineering Benchmark Report v3.2.'
  );
  const [editReviewerNotes, setEditReviewerNotes] = useState('Updated claim to align strictly with verified Engineering Lab test KV-103.');
  const [overrideReason, setOverrideReason] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('Unverifiable claim rejected under POL-001. Please resubmit with cited empirical data.');

  const pendingItems = reviewItems.filter(r => r.status === 'PENDING');
  const resolvedItems = reviewItems.filter(r => r.status !== 'PENDING');

  const currentList = activeTab === 'PENDING' ? pendingItems : resolvedItems;
  const currentItem = reviewItems.find(r => r.id === selectedItemId) || currentList[0];

  const handleEditAndApprove = () => {
    if (!currentItem) return;
    resolveReviewItem(
      currentItem.id,
      'EDITED_AND_APPROVED',
      editReviewerNotes,
      editClaimText
    );
    setShowEditModal(false);
  };

  const handleApproveWithOverride = () => {
    if (!currentItem) return;
    resolveReviewItem(
      currentItem.id,
      'APPROVED',
      'Approved via explicit executive override.',
      undefined,
      overrideReason || 'Executive Compliance Discretion: Staging campaign approved under temporary exception.'
    );
    setShowOverrideModal(false);
  };

  const handleReject = () => {
    if (!currentItem) return;
    resolveReviewItem(
      currentItem.id,
      'REJECTED',
      rejectionNotes
    );
    setShowRejectModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
              Human-in-the-Loop Supervision
            </span>
            <span className="text-xs text-ink-400">• Northstar Compliance Officer Workspace</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-100 tracking-tight mt-1.5">
            Review Queue
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            Consequential and policy-escalated agent actions requiring human review, edit, or rejection before execution.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center space-x-1 bg-ink-850 p-1 rounded-xl border border-ink-750">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'PENDING'
                ? 'bg-amber-500 text-ink-950 shadow-sm'
                : 'text-ink-400 hover:text-ink-200'
            }`}
          >
            Pending Review ({pendingItems.length})
          </button>
          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'RESOLVED'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-ink-400 hover:text-ink-200'
            }`}
          >
            Resolved ({resolvedItems.length})
          </button>
        </div>
      </div>

      {currentList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-ink-900 border border-ink-800">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-ink-100">
            {activeTab === 'PENDING' ? 'No Actions Pending Human Review' : 'No Resolved Decisions Recorded Yet'}
          </h3>
          <p className="text-xs text-ink-400 mt-1 max-w-md mx-auto">
            {activeTab === 'PENDING'
              ? 'All escalated agent proposals have been evaluated. The launch workflow has unblocked downstream operations.'
              : 'Decisions made in the queue will be recorded in this audit history.'}
          </p>
          {activeTab === 'PENDING' && (
            <button
              onClick={() => onNavigate('workflow-studio')}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-ink-800 hover:bg-ink-750 text-teal-300 transition-colors inline-flex items-center space-x-2"
            >
              <span>View Workflow Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Review Item Cards (Span 4) */}
          <div className="lg:col-span-4 space-y-3">
            {currentList.map(item => {
              const isSelected = currentItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-ink-850 border-amber-500 shadow-glow-amber ring-1 ring-amber-500/20'
                      : 'bg-ink-900 border-ink-800 hover:border-ink-750'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ink-800 text-teal-300 border border-ink-700">
                      {item.policyCode}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      item.status === 'PENDING'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : item.status === 'EDITED_AND_APPROVED' || item.status === 'APPROVED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-ink-100 line-clamp-2 mb-1.5">
                    {item.proposedAction}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-ink-400 pt-2 border-t border-ink-800">
                    <span>{item.agentName}</span>
                    <span className="font-mono">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Decision Workspace (Span 8) */}
          {currentItem && (
            <div className="lg:col-span-8 space-y-5">
              <div className="p-6 rounded-2xl bg-ink-900 border border-ink-800 shadow-xl space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-ink-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-ink-400">{currentItem.id}</span>
                      <span className="text-ink-600">•</span>
                      <span className="text-xs font-mono text-amber-400 font-semibold">{currentItem.policyCode}</span>
                    </div>
                    <h2 className="text-lg font-bold text-ink-100 mt-1">
                      {currentItem.policyTitle}
                    </h2>
                    <p className="text-xs text-ink-400 mt-0.5">
                      Agent: <strong className="text-ink-200">{currentItem.agentName}</strong> ({currentItem.department})
                    </p>
                  </div>

                  <button
                    onClick={() => openReceipt(currentItem.receiptId)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-ink-800 hover:bg-ink-750 text-teal-300 border border-ink-700 text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Receipt</span>
                  </button>
                </div>

                {/* Proposed Action Box */}
                <div className="p-4 rounded-xl bg-ink-950/80 border border-ink-800">
                  <span className="text-[10px] font-mono uppercase text-ink-400 block mb-1 font-semibold">
                    Proposed Action Payload
                  </span>
                  <p className="text-sm font-semibold text-ink-100 font-mono leading-relaxed bg-ink-900 p-3 rounded-lg border border-ink-750">
                    {currentItem.proposedAction}
                  </p>
                </div>

                {/* Why Concord Raised It */}
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs">
                  <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1 font-semibold flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                    Why Concord Raised This for Human Review
                  </span>
                  <p className="text-ink-200 leading-relaxed font-medium">
                    {currentItem.triggerReason}
                  </p>
                </div>

                {/* 2-Column: Supporting vs Missing Evidence */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-2 font-semibold flex items-center">
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Supporting Approved Evidence
                    </span>
                    <ul className="space-y-1.5 text-emerald-200 text-[11px]">
                      {currentItem.supportingEvidence.map((ev, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-emerald-400">•</span>
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40">
                    <span className="text-[10px] font-mono uppercase text-red-400 block mb-2 font-semibold flex items-center">
                      <X className="w-3.5 h-3.5 mr-1" />
                      Missing or Conflicting Evidence
                    </span>
                    <ul className="space-y-1.5 text-red-200 text-[11px]">
                      {currentItem.missingEvidence.map((ev, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-red-400">•</span>
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Impact & Urgency */}
                <div className="p-4 rounded-xl bg-ink-850/60 border border-ink-800 text-xs">
                  <span className="text-[10px] font-mono uppercase text-ink-400 block mb-1 font-semibold">
                    Potential Legal & Organizational Impact
                  </span>
                  <p className="text-ink-300 leading-relaxed">
                    {currentItem.potentialImpact}
                  </p>
                </div>

                {/* Suggested Safe Next Step */}
                <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-800/40 text-xs">
                  <span className="text-[10px] font-mono uppercase text-teal-400 block mb-1 font-semibold flex items-center">
                    <Info className="w-3.5 h-3.5 mr-1.5" />
                    Suggested Safe Next Step (Recommended)
                  </span>
                  <p className="text-teal-200 leading-relaxed font-medium">
                    {currentItem.suggestedSafeAction}
                  </p>
                </div>

                {/* Action Decision Buttons */}
                {currentItem.status === 'PENDING' ? (
                  <div className="pt-4 border-t border-ink-800 flex flex-wrap items-center justify-end gap-3">
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 transition-colors flex items-center space-x-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Proposal</span>
                    </button>

                    <button
                      onClick={() => setShowEditModal(true)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-glow-teal transition-all flex items-center space-x-1.5"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit and Approve Claim</span>
                    </button>

                    <button
                      onClick={() => setShowOverrideModal(true)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-ink-800 hover:bg-ink-750 text-amber-300 border border-amber-700/50 transition-colors flex items-center space-x-1.5"
                      title="Requires explicit executive override justification"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Override & Approve As-Is</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-ink-800 p-4 rounded-xl bg-ink-950 border border-ink-800 text-xs">
                    <span className="font-semibold text-ink-200 block mb-1">
                      Decision Recorded: <strong className="text-teal-400">{currentItem.status}</strong>
                    </span>
                    <p className="text-ink-400 text-[11px]">
                      By {currentItem.decidedBy} at {new Date(currentItem.decidedAt!).toLocaleTimeString()}
                    </p>
                    {currentItem.overrideReason && (
                      <p className="text-amber-300 text-[11px] mt-1 font-mono">
                        Override Justification: "{currentItem.overrideReason}"
                      </p>
                    )}
                    {currentItem.editedContent && (
                      <div className="mt-2 p-2 rounded bg-ink-900 border border-ink-800 font-mono text-emerald-300 text-[11px]">
                        "{currentItem.editedContent}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 1. Modal: Edit and Approve Claim */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-ink-900 border border-ink-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-100">Edit and Approve Claim Copy</h3>
                <p className="text-xs text-ink-400">Align marketing statement with verified benchmark KV-103</p>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-xs">
              <div>
                <label className="block font-semibold text-ink-300 mb-1.5">
                  Revised Claim Text (Pre-grounded with verified 28% improvement):
                </label>
                <textarea
                  rows={3}
                  value={editClaimText}
                  onChange={e => setEditClaimText(e.target.value)}
                  className="w-full bg-ink-950 border border-ink-700 rounded-lg p-3 text-xs text-ink-100 font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-300 mb-1.5">
                  Reviewer Notes:
                </label>
                <input
                  type="text"
                  value={editReviewerNotes}
                  onChange={e => setEditReviewerNotes(e.target.value)}
                  className="w-full bg-ink-950 border border-ink-700 rounded-lg px-3 py-2 text-xs text-ink-100 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-ink-400 hover:text-ink-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditAndApprove}
                className="px-5 py-2.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-glow-teal transition-all"
              >
                Approve Revised Copy & Unblock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Override and Approve (Requires Conflict Warning & Explicit Justification) */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-ink-900 border border-amber-600/70 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-100">Executive Policy Override Required</h3>
                <p className="text-xs text-amber-300">Overriding POL-001 carries high regulatory risk.</p>
              </div>
            </div>

            <div className="bg-amber-950/40 border border-amber-800/60 p-3.5 rounded-xl text-xs text-amber-200 mb-4 leading-relaxed">
              <strong>Policy Conflict Warning:</strong> Approving this copy publishes the unverified "400% performance gain" claim. Concord policy engine flags zero empirical verification in Northstar Knowledge Vault.
            </div>

            <div className="mb-5 text-xs">
              <label className="block font-semibold text-ink-300 mb-1.5">
                Mandatory Override Justification (Cryptographically signed in Audit Trail):
              </label>
              <textarea
                rows={3}
                value={overrideReason}
                onChange={e => setOverrideReason(e.target.value)}
                placeholder="State the legal justification or executive clearance granting this policy exception..."
                className="w-full bg-ink-950 border border-ink-700 rounded-lg p-3 text-xs text-ink-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-ink-400 hover:text-ink-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveWithOverride}
                disabled={!overrideReason.trim()}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  overrideReason.trim()
                    ? 'bg-amber-500 hover:bg-amber-400 text-ink-950 shadow-glow-amber'
                    : 'bg-ink-800 text-ink-500 cursor-not-allowed'
                }`}
              >
                Confirm Policy Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Reject Proposal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-ink-900 border border-red-800/70 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-100">Reject Proposed Action</h3>
                <p className="text-xs text-ink-400">Return copy to Marketing Agent with rejection feedback.</p>
              </div>
            </div>

            <div className="mb-5 text-xs">
              <label className="block font-semibold text-ink-300 mb-1.5">
                Rejection Feedback to Agent:
              </label>
              <textarea
                rows={3}
                value={rejectionNotes}
                onChange={e => setRejectionNotes(e.target.value)}
                className="w-full bg-ink-950 border border-ink-700 rounded-lg p-3 text-xs text-ink-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-ink-400 hover:text-ink-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-5 py-2.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                Reject & Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;
