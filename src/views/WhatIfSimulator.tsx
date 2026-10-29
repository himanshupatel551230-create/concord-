import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { AutonomyMode, WhatIfSimulationResult } from '../types';
import {
  SlidersHorizontal,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles,
  Info,
  Check,
  X
} from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const {
    autonomyMode,
    policies,
    runWhatIfSimulation,
    applyWhatIfChanges
  } = useGovernance();

  const [simMode, setSimMode] = useState<AutonomyMode>(autonomyMode);
  const [disabledCodes, setDisabledCodes] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResult | null>(() =>
    runWhatIfSimulation(autonomyMode, [])
  );
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);
  const [applySuccessMessage, setApplySuccessMessage] = useState(false);

  const handleTogglePolicyCode = (code: string) => {
    setDisabledCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleRunSimulation = () => {
    const res = runWhatIfSimulation(simMode, disabledCodes);
    setSimulationResult(res);
  };

  const handleApplyToLive = () => {
    applyWhatIfChanges(simMode, disabledCodes);
    setShowApplyConfirm(false);
    setApplySuccessMessage(true);
    setTimeout(() => setApplySuccessMessage(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Simulation Banner Notice */}
      <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-center justify-between text-xs text-blue-200">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping shrink-0" />
          <span>
            <strong>Policy Sandbox Environment:</strong> Simulated changes do not affect live Northstar execution until explicitly applied.
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-blue-900/60 text-[10px] font-mono border border-blue-700/50">
          Simulation Only
        </span>
      </div>

      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
              Predictive Impact Modeling
            </span>
            <span className="text-xs text-ink-400">• Northstar Policy Sandbox</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-100 tracking-tight mt-1.5">
            Policy What-If Simulator
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            Test policy modifications and autonomy posture adjustments before deploying to live multi-agent workflows.
          </p>
        </div>

        {simulationResult && (
          <button
            onClick={() => setShowApplyConfirm(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-glow-teal transition-all"
          >
            <span>Apply Simulation to Live Workflow</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {applySuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Simulated configuration successfully applied to live Northstar workflow and logged in Audit Trail.</span>
        </div>
      )}

      {/* 2-Column: Left Sandbox Controls, Right Simulation Impact Diff */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sandbox Controls Column (Span 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-ink-900 border border-ink-800 space-y-5">
            <h3 className="text-sm font-bold text-ink-100 flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-400" />
              <span>Sandbox Scenario Variables</span>
            </h3>

            {/* Test Autonomy Mode */}
            <div>
              <label className="block text-xs font-semibold text-ink-300 mb-2">
                Simulated Autonomy Mode:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['OBSERVE', 'GUARD', 'APPROVAL_FIRST'] as AutonomyMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setSimMode(m)}
                    className={`py-2 px-1 text-center rounded-lg font-mono text-[11px] font-semibold border transition-all ${
                      simMode === m
                        ? 'bg-teal-950 text-teal-300 border-teal-500 shadow-sm'
                        : 'bg-ink-850 text-ink-400 border-ink-750 hover:bg-ink-800'
                    }`}
                  >
                    {m === 'APPROVAL_FIRST' ? 'APPROVAL' : m}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Policies in Simulation */}
            <div>
              <label className="block text-xs font-semibold text-ink-300 mb-2">
                Simulate Disabling Policies:
              </label>
              <div className="space-y-2">
                {policies.map(p => {
                  const isDisabled = disabledCodes.includes(p.code);

                  return (
                    <div
                      key={p.code}
                      onClick={() => handleTogglePolicyCode(p.code)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isDisabled
                          ? 'bg-red-950/30 border-red-800/60 text-red-200'
                          : 'bg-ink-850 border-ink-800 text-ink-300 hover:border-ink-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-ink-900 border border-ink-750">
                            {p.code}
                          </span>
                          <span className="font-medium text-[11px] truncate max-w-[170px]">{p.title}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                        isDisabled ? 'bg-red-900/60 text-red-300' : 'bg-ink-750 text-ink-400'
                      }`}>
                        {isDisabled ? 'DISABLED' : 'ENFORCED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunSimulation}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-glow-teal transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Recalculate What-If Impact</span>
            </button>
          </div>
        </div>

        {/* Simulation Output Column (Span 8) */}
        <div className="lg:col-span-8 space-y-5">
          {simulationResult && (
            <div className="space-y-5">
              {/* Before vs After Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Actions Passed */}
                <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
                  <span className="text-ink-400 text-[11px] block mb-1">Actions Passed</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold font-mono text-ink-100">
                      {simulationResult.outcomes.passedAfter}
                    </span>
                    <span className="text-ink-500 text-[11px] font-mono">
                      (was {simulationResult.outcomes.passedBefore})
                    </span>
                  </div>
                  <span className="text-[10px] text-ink-400 mt-1 block">
                    {simulationResult.outcomes.passedAfter > simulationResult.outcomes.passedBefore
                      ? `+${simulationResult.outcomes.passedAfter - simulationResult.outcomes.passedBefore} newly allowed`
                      : 'Unchanged'}
                  </span>
                </div>

                {/* Actions Blocked */}
                <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
                  <span className="text-ink-400 text-[11px] block mb-1">Actions Blocked</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold font-mono text-red-400">
                      {simulationResult.outcomes.blockedAfter}
                    </span>
                    <span className="text-ink-500 text-[11px] font-mono">
                      (was {simulationResult.outcomes.blockedBefore})
                    </span>
                  </div>
                  <span className="text-[10px] text-ink-400 mt-1 block">
                    {simulationResult.outcomes.blockedAfter < simulationResult.outcomes.blockedBefore
                      ? `${simulationResult.outcomes.blockedBefore - simulationResult.outcomes.blockedAfter} relaxed barriers`
                      : 'Perimeter intact'}
                  </span>
                </div>

                {/* Risk Exposure Delta */}
                <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
                  <span className="text-ink-400 text-[11px] block mb-1">Risk Exposure Delta</span>
                  <div className="flex items-baseline space-x-2">
                    <span className={`text-2xl font-bold font-mono ${
                      simulationResult.overallRiskScoreChange > 0 ? 'text-red-400' :
                      simulationResult.overallRiskScoreChange < 0 ? 'text-teal-400' : 'text-ink-300'
                    }`}>
                      {simulationResult.overallRiskScoreChange > 0 ? `+${simulationResult.overallRiskScoreChange}%` : `${simulationResult.overallRiskScoreChange}%`}
                    </span>
                  </div>
                  <span className="text-[10px] text-ink-400 mt-1 block">
                    {simulationResult.overallRiskScoreChange > 0
                      ? 'Increased vulnerability'
                      : simulationResult.overallRiskScoreChange < 0
                      ? 'Stricter containment'
                      : 'Neutral posture'}
                  </span>
                </div>
              </div>

              {/* Step-by-Step Before & After Diff Matrix */}
              <div className="p-5 rounded-2xl bg-ink-900 border border-ink-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-ink-100 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-teal-400" />
                    <span>Workflow Step Consequence Breakdown</span>
                  </h3>
                  <span className="text-[11px] text-ink-500 font-mono">5 Actions Evaluated</span>
                </div>

                <div className="divide-y divide-ink-800 text-xs">
                  {simulationResult.stepDiffs.map(diff => {
                    const isChanged = diff.currentOutcome !== diff.projectedOutcome;

                    return (
                      <div key={diff.stepId} className="py-3.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-ink-100">{diff.stepTitle}</span>
                          <div className="flex items-center space-x-2 font-mono text-[10px]">
                            <span className="px-2 py-0.5 rounded bg-ink-800 text-ink-400">
                              Now: {diff.currentOutcome}
                            </span>
                            <ArrowRight className="w-3 h-3 text-ink-600" />
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              diff.projectedOutcome === 'ALLOWED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              diff.projectedOutcome === 'BLOCKED' ? 'bg-red-950 text-red-300 border border-red-800' :
                              'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}>
                              Projected: {diff.projectedOutcome}
                            </span>
                          </div>
                        </div>

                        <p className={`text-[11px] leading-relaxed ${
                          isChanged ? 'text-amber-300 font-medium' : 'text-ink-400'
                        }`}>
                          {diff.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Departmental Impact Assessment */}
              <div className="p-5 rounded-2xl bg-ink-900 border border-ink-800 space-y-3">
                <h3 className="text-sm font-bold text-ink-100 flex items-center space-x-2">
                  <Info className="w-4 h-4 text-teal-400" />
                  <span>Departmental Risk & Operational Assessment</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {simulationResult.affectedDepartments.map((dept, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-ink-850/60 border border-ink-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-ink-200">{dept.department}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          dept.riskDelta === 'INCREASED' ? 'bg-red-950 text-red-300' : 'bg-ink-800 text-ink-400'
                        }`}>
                          {dept.riskDelta}
                        </span>
                      </div>
                      <p className="text-ink-400 text-[11px] leading-snug">{dept.impactDescription}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal to Apply Changes */}
      {showApplyConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-ink-900 border border-ink-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-100">Apply What-If Configuration?</h3>
                <p className="text-xs text-ink-400">Deploy sandbox settings to Northstar live workflow.</p>
              </div>
            </div>

            <p className="text-xs text-ink-300 mb-6 leading-relaxed">
              This will update the active Autonomy Mode to <strong className="text-teal-400 font-mono">{simMode}</strong> and modify the active status of {disabledCodes.length} policies. An auditable event will be logged in the Concord Audit Trail.
            </p>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowApplyConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-ink-400 hover:text-ink-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyToLive}
                className="px-5 py-2.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-glow-teal transition-all"
              >
                Confirm & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatIfSimulator;
