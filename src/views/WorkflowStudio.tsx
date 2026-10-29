import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { WorkflowStep, PolicyOutcome } from '../types';
import {
  Workflow,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw as DeduplicateIcon,
  Clock,
  ArrowRight,
  FileText,
  UserCheck,
  Shield,
  Layers,
  ChevronRight,
  Pause,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface WorkflowStudioProps {
  onNavigate: (view: string) => void;
}

export const WorkflowStudio: React.FC<WorkflowStudioProps> = ({ onNavigate }) => {
  const {
    workflowSteps,
    agents,
    receipts,
    openReceipt,
    isSimulating,
    simulationStepIndex,
    runLaunchSimulation,
    resetDemo
  } = useGovernance();

  const [selectedStepId, setSelectedStepId] = useState<string>(workflowSteps[4].id); // Default to Step 5 (Unverified claim)

  const selectedStep = workflowSteps.find(s => s.id === selectedStepId) || workflowSteps[0];
  const stepAgent = agents.find(a => a.id === selectedStep.agentId);
  const targetAgent = selectedStep.targetAgentId ? agents.find(a => a.id === selectedStep.targetAgentId) : null;
  const receipt = selectedStep.receiptId ? receipts[selectedStep.receiptId] : null;

  const getStatusBadge = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'COMPLETED':
        return {
          label: 'Completed',
          icon: CheckCircle2,
          classes: 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
        };
      case 'BLOCKED':
        return {
          label: 'Blocked by Policy',
          icon: XCircle,
          classes: 'bg-red-950/80 text-red-400 border-red-800'
        };
      case 'WAITING_HUMAN_REVIEW':
        return {
          label: 'Human Review Gate',
          icon: AlertTriangle,
          classes: 'bg-amber-950/80 text-amber-400 border-amber-800 animate-pulse'
        };
      case 'DEDUPLICATED':
        return {
          label: 'Deduplicated (Cached)',
          icon: DeduplicateIcon,
          classes: 'bg-teal-950/80 text-teal-400 border-teal-800'
        };
      case 'IN_PROGRESS':
        return {
          label: 'Executing...',
          icon: RefreshCw,
          classes: 'bg-blue-950/80 text-blue-400 border-blue-800 animate-spin'
        };
      default:
        return {
          label: 'Pending',
          icon: Clock,
          classes: 'bg-ink-800 text-ink-400 border-ink-700'
        };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
              Multi-Agent Orchestration
            </span>
            <span className="text-xs text-ink-400">• Northstar Launch Sequence</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-100 tracking-tight mt-1.5">
            Workflow Studio
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            Supervise chronological agent handoffs, inter-agent trust boundaries, and human signoff gates.
          </p>
        </div>

        {/* Action Controls: Run, Step, Reset */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={runLaunchSimulation}
            disabled={isSimulating}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isSimulating
                ? 'bg-ink-800 text-ink-500 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-500 text-white shadow-glow-teal'
            }`}
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating Launch...' : 'Run Launch Simulation'}</span>
          </button>

          <button
            onClick={resetDemo}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-ink-300 bg-ink-850 hover:bg-ink-800 border border-ink-750 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2-Column: Left Workflow Sequence Steps, Right Step Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step Sequence List (Span 7) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-400">
              Orchestrated Launch Steps ({workflowSteps.length})
            </span>
            <span className="text-[11px] text-ink-500 font-mono">
              Click step to inspect governance receipt & boundary diff
            </span>
          </div>

          <div className="space-y-3">
            {workflowSteps.map(step => {
              const agent = agents.find(a => a.id === step.agentId);
              const target = step.targetAgentId ? agents.find(a => a.id === step.targetAgentId) : null;
              const statusInfo = getStatusBadge(step.status);
              const StatusIcon = statusInfo.icon;
              const isSelected = selectedStepId === step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-ink-850/90 border-teal-500 shadow-md ring-1 ring-teal-500/20'
                      : 'bg-ink-900 border-ink-800 hover:border-ink-700'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-lg bg-ink-800 text-teal-400 font-mono text-xs font-bold flex items-center justify-center border border-ink-700">
                        {step.stepNumber}
                      </span>
                      <span className="font-semibold text-sm text-ink-100">{step.title}</span>
                    </div>

                    <div className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${statusInfo.classes}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-ink-300 leading-relaxed pl-8 mb-3">
                    {step.description}
                  </p>

                  {/* Agent and Handoff Flow */}
                  <div className="pl-8 flex items-center justify-between text-[11px] pt-2 border-t border-ink-800/80">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: agent?.avatarColor }}
                        />
                        <span className="font-medium text-ink-300">{agent?.name}</span>
                      </div>

                      {target && (
                        <>
                          <ArrowRight className="w-3 h-3 text-ink-600" />
                          <div className="flex items-center space-x-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: target?.avatarColor }}
                            />
                            <span className="font-medium text-ink-300">{target.name}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {step.governanceHighlight && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-teal-950 text-teal-300 border border-teal-800">
                        {step.governanceHighlight.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Inspector Panel (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-ink-900 border border-ink-800 sticky top-20 shadow-xl">
            {/* Inspector Header */}
            <div className="flex items-start justify-between border-b border-ink-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-teal-400 font-semibold">
                  Step {selectedStep.stepNumber} Inspector
                </span>
                <h3 className="text-base font-bold text-ink-100 mt-0.5">{selectedStep.title}</h3>
              </div>

              {receipt && (
                <button
                  onClick={() => openReceipt(receipt.receiptId)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-teal-950 hover:bg-teal-900 text-teal-300 border border-teal-800 text-xs font-semibold transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Receipt</span>
                </button>
              )}
            </div>

            {/* Agent Details */}
            <div className="p-3.5 rounded-xl bg-ink-850/60 border border-ink-800 mb-4 text-xs">
              <span className="text-[10px] font-mono uppercase text-ink-400 block mb-1">
                Executing Agent
              </span>
              <div className="flex items-center space-x-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-ink-950"
                  style={{ backgroundColor: stepAgent?.avatarColor }}
                >
                  {stepAgent?.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-ink-100">{stepAgent?.name}</p>
                  <p className="text-[11px] text-ink-400">{stepAgent?.role} • {stepAgent?.department}</p>
                </div>
              </div>
            </div>

            {/* Inputs & Outputs */}
            <div className="space-y-3 mb-4 text-xs">
              <div className="p-3 rounded-xl bg-ink-950/70 border border-ink-800">
                <span className="text-[10px] font-mono uppercase text-ink-400 block mb-1 font-semibold">
                  Data Inputs & References
                </span>
                <ul className="space-y-1 text-ink-300">
                  {selectedStep.inputs.map((inp, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5 text-[11px]">
                      <span className="text-teal-500">›</span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedStep.outputs && (
                <div className="p-3 rounded-xl bg-ink-950/70 border border-ink-800">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1 font-semibold">
                    Emitted Outputs & Handled Artifacts
                  </span>
                  <ul className="space-y-1 text-emerald-200">
                    {selectedStep.outputs.map((outp, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5 text-[11px]">
                        <span className="text-emerald-500">›</span>
                        <span>{outp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Governance & Policy Outcome if receipt attached */}
            {receipt && (
              <div className="p-3.5 rounded-xl bg-ink-850/80 border border-ink-800 mb-4 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase text-ink-400 font-semibold">
                    Policy Evaluation
                  </span>
                  <span className="text-[10px] font-mono text-teal-400">
                    {receipt.policyCode}
                  </span>
                </div>
                <p className="text-ink-200 text-xs leading-relaxed mb-2">
                  {receipt.plainLanguageSummary}
                </p>
                <div className="flex items-center justify-between text-[11px] text-ink-400 pt-2 border-t border-ink-800">
                  <span>Latency: {receipt.technicalDetails.evaluationLatencyMs}ms</span>
                  <span className="font-mono text-ink-300">{receipt.receiptId}</span>
                </div>
              </div>
            )}

            {/* Action Trigger for Review Gate if this step is waiting human review */}
            {selectedStep.status === 'WAITING_HUMAN_REVIEW' && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs">
                <p className="text-amber-300 font-medium mb-2">
                  This step is held in the Human Review Queue pending Compliance Officer approval.
                </p>
                <button
                  onClick={() => onNavigate('review-queue')}
                  className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-ink-950 font-bold transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Go to Review Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowStudio;
