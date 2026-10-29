import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { KnowledgeDocument } from '../types';
import {
  Database,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Shield,
  FileText,
  ExternalLink,
  Users,
  Eye,
  XCircle,
  X
} from 'lucide-react';

export const KnowledgeVault: React.FC = () => {
  const { knowledgeDocs, agents } = useGovernance();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'APPROVED' | 'UNTRUSTED'>('ALL');
  const [selectedDocId, setSelectedDocId] = useState<string>(knowledgeDocs[4].id); // Default to KV-DOC-904 (Prompt injection document)

  const filteredDocs = knowledgeDocs.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'APPROVED') return matchesSearch && doc.approvalState === 'APPROVED';
    if (selectedFilter === 'UNTRUSTED') return matchesSearch && doc.approvalState === 'UNTRUSTED_RAW_INPUT';
    return matchesSearch;
  });

  const selectedDoc = knowledgeDocs.find(d => d.id === selectedDocId) || knowledgeDocs[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
              Grounding & Data Perimeter
            </span>
            <span className="text-xs text-ink-400">• Northstar Verified Corpus</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-100 tracking-tight mt-1.5">
            Knowledge Vault
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            Audited organizational truth sources, verified benchmarks, and sandboxed untrusted external documents.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center space-x-3">
          <div className="relative w-56">
            <Search className="w-4 h-4 text-ink-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search vault docs..."
              className="w-full bg-ink-900 border border-ink-750 rounded-xl pl-9 pr-3 py-2 text-xs text-ink-100 placeholder-ink-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center space-x-1 bg-ink-850 p-1 rounded-xl border border-ink-750 text-xs">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedFilter === 'ALL' ? 'bg-teal-600 text-white' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              All ({knowledgeDocs.length})
            </button>
            <button
              onClick={() => setSelectedFilter('APPROVED')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedFilter === 'APPROVED' ? 'bg-emerald-600 text-white' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setSelectedFilter('UNTRUSTED')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedFilter === 'UNTRUSTED' ? 'bg-red-600 text-white' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              Untrusted
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column: Left Document Cards List, Right Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document Cards List (Span 6) */}
        <div className="lg:col-span-6 space-y-3">
          {filteredDocs.map(doc => {
            const isSelected = selectedDoc.id === doc.id;
            const isUntrusted = doc.isUntrustedInjectionSource;

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? isUntrusted
                      ? 'bg-ink-850 border-red-500 shadow-glow-red ring-1 ring-red-500/20'
                      : 'bg-ink-850 border-teal-500 shadow-glow-teal ring-1 ring-teal-500/20'
                    : 'bg-ink-900 border-ink-800 hover:border-ink-750'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-teal-400 bg-ink-800 px-2 py-0.5 rounded border border-ink-700">
                      {doc.id}
                    </span>
                    <span className="text-[10px] text-ink-400 font-mono">{doc.department}</span>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isUntrusted
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {doc.approvalState.replace(/_/g, ' ')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-ink-100 mb-1 leading-snug">{doc.title}</h3>
                <p className="text-xs text-ink-300 line-clamp-2 leading-relaxed mb-3">{doc.summary}</p>

                <div className="flex items-center justify-between text-[11px] text-ink-400 pt-2 border-t border-ink-800">
                  <span>Owner: {doc.owner}</span>
                  <span className="font-mono">Updated: {doc.lastUpdated}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Document Detail Inspector (Span 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-ink-900 border border-ink-800 sticky top-20 shadow-xl space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-ink-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs text-teal-400 font-bold">{selectedDoc.id}</span>
                  <span className="text-ink-600">•</span>
                  <span className="text-xs text-ink-400">{selectedDoc.department}</span>
                  <span className="text-ink-600">•</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-ink-800 text-ink-300">
                    {selectedDoc.sensitivityLevel}
                  </span>
                </div>
                <h2 className="text-base font-bold text-ink-100 mt-1">{selectedDoc.title}</h2>
              </div>

              {selectedDoc.isUntrustedInjectionSource && (
                <span className="px-2 py-1 rounded bg-red-950 border border-red-800 text-red-300 text-[10px] font-mono font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>SANDBOXED THREAT</span>
                </span>
              )}
            </div>

            {/* Untrusted Warning Notice */}
            {selectedDoc.isUntrustedInjectionSource && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200 leading-relaxed">
                <div className="flex items-center space-x-2 mb-1 text-red-300 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Untrusted Input Containment Policy Active</span>
                </div>
                Concord treats this document strictly as passive data. Embedded imperative prompts such as
                <code className="text-red-300 bg-black/40 px-1 rounded ml-1 font-mono">[SYSTEM OVERRIDE...]</code>
                are quarantined at the parser perimeter. They cannot invoke system commands, modify agent instructions, or trigger data egress.
              </div>
            )}

            {/* Document Content Box */}
            <div className="p-4 rounded-xl bg-ink-950/80 border border-ink-800 text-xs">
              <span className="text-[10px] font-mono uppercase text-ink-400 block mb-2 font-semibold">
                Document Body Extract
              </span>
              <pre className="font-mono text-[11px] text-ink-200 whitespace-pre-wrap bg-ink-900 p-3 rounded-lg border border-ink-750 leading-relaxed max-h-56 overflow-y-auto">
                {selectedDoc.fullContent}
              </pre>
            </div>

            {/* Access Rationale & Agent Permissions */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-ink-850/60 border border-ink-800">
                <span className="text-[10px] font-mono uppercase text-teal-400 block mb-1 font-semibold">
                  Access Rationale
                </span>
                <p className="text-ink-200 leading-relaxed">{selectedDoc.accessRationale}</p>
              </div>

              {/* Permitted vs Restricted Agents */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1 font-semibold">
                    Permitted Agents ({selectedDoc.permittedAgents.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDoc.permittedAgents.map(agId => {
                      const ag = agents.find(a => a.id === agId);
                      return (
                        <span key={agId} className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono">
                          {ag?.name || agId}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40">
                  <span className="text-[10px] font-mono uppercase text-red-400 block mb-1 font-semibold">
                    Restricted Agents ({selectedDoc.restrictedAgents.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDoc.restrictedAgents.length > 0 ? (
                      selectedDoc.restrictedAgents.map(agId => {
                        const ag = agents.find(a => a.id === agId);
                        return (
                          <span key={agId} className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 text-[10px] font-mono">
                            {ag?.name || agId}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-ink-500 text-[10px] italic">None restricted</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeVault;
