import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { Policy, EventSeverity } from '../types';
import {
  FileCheck2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  Edit2,
  Search,
  Filter,
  Check,
  X,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

export const PolicyStudio: React.FC = () => {
  const { policies, togglePolicy, updatePolicy, auditLogs } = useGovernance();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

  // Form states for policy editor modal
  const [editSeverity, setEditSeverity] = useState<EventSeverity>('HIGH');
  const [editEnforcement, setEditEnforcement] = useState<'BLOCK' | 'ESCALATE' | 'ALLOW_WITH_LOG'>('BLOCK');
  const [editRequireCitation, setEditRequireCitation] = useState(false);
  const [editConfidenceThreshold, setEditConfidenceThreshold] = useState(0.95);

  const filteredPolicies = policies.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditor = (policy: Policy) => {
    setEditingPolicy(policy);
    setEditSeverity(policy.severity);
    setEditEnforcement(policy.defaultEnforcement);
    setEditRequireCitation(!!policy.parameters.requireCitation);
    setEditConfidenceThreshold(policy.parameters.confidenceThreshold || 0.95);
  };

  const savePolicyChanges = () => {
    if (!editingPolicy) return;

    const updated: Policy = {
      ...editingPolicy,
      severity: editSeverity,
      defaultEnforcement: editEnforcement,
      parameters: {
        ...editingPolicy.parameters,
        requireCitation: editRequireCitation,
        confidenceThreshold: editConfidenceThreshold
      }
    };

    updatePolicy(updated);
    setEditingPolicy(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
              Rulebook & Enforcement Architecture
            </span>
            <span className="text-xs text-ink-400">• Northstar Policy Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-100 tracking-tight mt-1.5">
            Policy Studio
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            Configure enterprise governance policies, inspection parameters, and autonomous boundary enforcement.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-ink-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search policies or codes..."
            className="w-full bg-ink-900 border border-ink-750 rounded-xl pl-9 pr-4 py-2 text-xs text-ink-100 placeholder-ink-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Policy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPolicies.map(policy => (
          <div
            key={policy.id}
            className={`p-5 rounded-2xl border transition-all ${
              policy.enabled
                ? 'bg-ink-900 border-ink-800 hover:border-ink-700 shadow-md'
                : 'bg-ink-950/80 border-ink-850 opacity-70'
            }`}
          >
            {/* Header: Code, Toggle, Status */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-ink-800 text-teal-300 border border-ink-700">
                  {policy.code}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                  policy.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                  policy.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-blue-950 text-blue-300 border border-blue-800'
                }`}>
                  {policy.severity}
                </span>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => togglePolicy(policy.id)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    policy.enabled ? 'bg-teal-600' : 'bg-ink-700'
                  }`}
                  title={policy.enabled ? 'Click to disable policy' : 'Click to enable policy'}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      policy.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-sm font-bold text-ink-100 mb-1.5">{policy.title}</h3>
            <p className="text-xs text-ink-300 leading-relaxed mb-4">{policy.description}</p>

            {/* Rule Summary & Guidelines Box */}
            <div className="p-3 rounded-xl bg-ink-950/70 border border-ink-800 text-xs mb-4">
              <span className="text-[10px] font-mono uppercase text-ink-400 block mb-1 font-semibold">
                Operational Rule Summary
              </span>
              <p className="text-ink-200 text-[11px] leading-snug">{policy.ruleSummary}</p>
            </div>

            {/* Footer: Affected Departments & Edit Button */}
            <div className="flex items-center justify-between pt-3 border-t border-ink-800/80 text-xs">
              <div className="flex flex-wrap gap-1">
                {policy.affectedDepartments.map((dept, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-ink-850 text-ink-400 font-mono text-[10px]"
                  >
                    {dept}
                  </span>
                ))}
              </div>

              <button
                onClick={() => openEditor(policy)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-ink-300 hover:text-ink-100 bg-ink-850 hover:bg-ink-800 border border-ink-750 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                <span>Configure</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guided Policy Editor Modal */}
      {editingPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-ink-900 border border-ink-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-ink-800 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-mono text-teal-400 font-bold uppercase">
                  Policy Parameter Configuration
                </span>
                <h3 className="text-base font-bold text-ink-100 mt-0.5">
                  [{editingPolicy.code}] {editingPolicy.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingPolicy(null)}
                className="p-1 rounded-lg text-ink-400 hover:text-ink-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6 text-xs">
              {/* Severity Selection */}
              <div>
                <label className="block font-semibold text-ink-300 mb-1.5">
                  Enforcement Severity Level:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['MEDIUM', 'HIGH', 'CRITICAL'] as EventSeverity[]).map(sev => (
                    <button
                      key={sev}
                      onClick={() => setEditSeverity(sev)}
                      className={`py-2 rounded-lg font-mono text-xs font-semibold border transition-all ${
                        editSeverity === sev
                          ? 'bg-teal-950 text-teal-300 border-teal-500 shadow-sm'
                          : 'bg-ink-850 text-ink-400 border-ink-750 hover:bg-ink-800'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Action */}
              <div>
                <label className="block font-semibold text-ink-300 mb-1.5">
                  Automated Enforcement Action:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'BLOCK', label: 'Hard Block' },
                    { id: 'ESCALATE', label: 'Human Review' },
                    { id: 'ALLOW_WITH_LOG', label: 'Log & Allow' }
                  ].map(act => (
                    <button
                      key={act.id}
                      onClick={() => setEditEnforcement(act.id as any)}
                      className={`py-2 px-1 text-center rounded-lg font-semibold text-xs border transition-all ${
                        editEnforcement === act.id
                          ? 'bg-teal-950 text-teal-300 border-teal-500 shadow-sm'
                          : 'bg-ink-850 text-ink-400 border-ink-750 hover:bg-ink-800'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkbox Parameters */}
              <div className="p-3.5 rounded-xl bg-ink-950 border border-ink-800 space-y-2.5">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editRequireCitation}
                    onChange={e => setEditRequireCitation(e.target.checked)}
                    className="rounded border-ink-700 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-ink-200">
                    Require verified Knowledge Vault citation before passing
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setEditingPolicy(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-ink-400 hover:text-ink-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={savePolicyChanges}
                className="px-5 py-2.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-glow-teal transition-all"
              >
                Save & Update Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyStudio;
