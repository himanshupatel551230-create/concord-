import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { AutonomyMode } from '../../types';
import { Shield, Eye, ShieldAlert, Check, AlertTriangle, ArrowRight, X } from 'lucide-react';

interface ModeChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModeChangeModal: React.FC<ModeChangeModalProps> = ({ isOpen, onClose }) => {
  const { autonomyMode, setAutonomyMode, reviewItems } = useGovernance();
  const [selectedMode, setSelectedMode] = useState<AutonomyMode>(autonomyMode);
  const [confirmReason, setConfirmReason] = useState('');
  const [step, setStep] = useState<'SELECT' | 'CONFIRM'>('SELECT');

  if (!isOpen) return null;

  const pendingCount = reviewItems.filter(r => r.status === 'PENDING').length;

  const modeDetails: Record<AutonomyMode, {
    title: string;
    tagline: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    borderActive: string;
    bgActive: string;
    description: string;
    consequences: {
      lowRisk: string;
      promptInjection: string;
      unsupportedClaims: string;
      payments: string;
    };
  }> = {
    OBSERVE: {
      title: 'Observe Mode',
      tagline: 'Audit & passive logging only',
      icon: Eye,
      accentColor: 'text-blue-400',
      borderActive: 'border-blue-500 bg-blue-950/30',
      bgActive: 'bg-blue-500',
      description: 'Agents can propose and execute sandbox actions; Concord records policy outcomes and flags non-compliance without active blocking.',
      consequences: {
        lowRisk: 'Executes automatically with async policy receipts.',
        promptInjection: 'Documents parsed, but injection commands are NOT quarantined at network boundary; risk of data egress.',
        unsupportedClaims: 'Publishes copy without blocking; records missing citations as warning receipts.',
        payments: 'Disbursements logged with high severity warning, but transaction triggers are not blocked.'
      }
    },
    GUARD: {
      title: 'Guard Mode (Recommended)',
      tagline: 'Policy-enforced active perimeter',
      icon: Shield,
      accentColor: 'text-teal-400',
      borderActive: 'border-teal-500 bg-teal-950/30',
      bgActive: 'bg-teal-500',
      description: 'Low-risk actions proceed automatically; consequential or risky actions are strictly blocked or escalated to human review.',
      consequences: {
        lowRisk: 'Market sizing reuse & approved synthesis proceed immediately.',
        promptInjection: 'Untrusted document commands quarantined; PII egress blocked with cryptographic receipt.',
        unsupportedClaims: 'Superlative claims paused and escalated to human Review Queue.',
        payments: 'Autonomous financial payments and credit card charges strictly blocked.'
      }
    },
    APPROVAL_FIRST: {
      title: 'Approval First',
      tagline: 'Strict human-in-the-loop lockdown',
      icon: ShieldAlert,
      accentColor: 'text-amber-400',
      borderActive: 'border-amber-500 bg-amber-950/30',
      bgActive: 'bg-amber-500',
      description: 'Zero autonomous execution for outward actions. All consequential actions pause and require explicit human authorization before execution.',
      consequences: {
        lowRisk: 'Routine tasks require supervisor clearance before dispatch.',
        promptInjection: 'Completely frozen and isolated pending security team manual signoff.',
        unsupportedClaims: 'Press release generation locked until compliance officer explicitly approves.',
        payments: 'Hard blocked; zero execution paths accessible to agents.'
      }
    }
  };

  const currentConfig = modeDetails[selectedMode];

  const handleApply = () => {
    setAutonomyMode(selectedMode, confirmReason || `Applied ${selectedMode} autonomy mode.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-ink-900 border border-ink-750 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-ink-400 hover:text-ink-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'SELECT' ? (
          <div>
            <div className="mb-5">
              <span className="text-[10px] font-mono tracking-wider text-teal-400 uppercase bg-teal-950/50 border border-teal-800/50 px-2 py-0.5 rounded">
                Organization Autonomy Policy
              </span>
              <h2 className="text-xl font-bold text-ink-100 mt-2">Change Organization Autonomy Mode</h2>
              <p className="text-xs text-ink-400 mt-1">
                Autonomy modes define how Concord intervenes when AI agents execute tasks across Northstar Retail.
              </p>
            </div>

            {/* Mode selection radio cards */}
            <div className="space-y-3 mb-6">
              {(Object.keys(modeDetails) as AutonomyMode[]).map(mode => {
                const item = modeDetails[mode];
                const Icon = item.icon;
                const isSelected = selectedMode === mode;
                const isCurrent = autonomyMode === mode;

                return (
                  <div
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? item.borderActive + ' shadow-md'
                        : 'border-ink-800 bg-ink-850 hover:bg-ink-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-ink-900' : 'bg-ink-800'} ${item.accentColor}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-ink-100">{item.title}</span>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-700 text-ink-300 font-mono">
                                Currently Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-ink-400 mt-0.5">{item.tagline}</p>
                          <p className="text-xs text-ink-300 mt-2 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? `${item.bgActive} border-transparent text-ink-950` : 'border-ink-600'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Impact Preview Section */}
            <div className="bg-ink-950/70 border border-ink-800 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-ink-200 flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  Live Preview: Effect on Northstar Launch Workflow
                </span>
                <span className="text-[10px] font-mono text-ink-400">
                  {pendingCount} item{pendingCount !== 1 ? 's' : ''} in Review Queue
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-ink-900 border border-ink-800">
                  <span className="font-semibold text-ink-300 block mb-1">Untrusted Document Injection</span>
                  <span className="text-ink-400 text-[11px] leading-snug">{currentConfig.consequences.promptInjection}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-900 border border-ink-800">
                  <span className="font-semibold text-ink-300 block mb-1">Unsupported Marketing Claims</span>
                  <span className="text-ink-400 text-[11px] leading-snug">{currentConfig.consequences.unsupportedClaims}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-900 border border-ink-800">
                  <span className="font-semibold text-ink-300 block mb-1">Financial Payment Triggers</span>
                  <span className="text-ink-400 text-[11px] leading-snug">{currentConfig.consequences.payments}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-900 border border-ink-800">
                  <span className="font-semibold text-ink-300 block mb-1">Routine Low-Risk Tasks</span>
                  <span className="text-ink-400 text-[11px] leading-snug">{currentConfig.consequences.lowRisk}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-ink-400 hover:text-ink-200 hover:bg-ink-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('CONFIRM')}
                disabled={selectedMode === autonomyMode}
                className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedMode === autonomyMode
                    ? 'bg-ink-800 text-ink-500 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-500 text-white shadow-glow-teal'
                }`}
              >
                <span>Continue to Confirmation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Explicit Confirmation */
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-100">Confirm Autonomy Mode Shift</h3>
                <p className="text-xs text-ink-400">
                  Transitioning from <span className="font-mono text-ink-200">{autonomyMode}</span> to{' '}
                  <span className="font-mono text-teal-400 font-bold">{selectedMode}</span>
                </p>
              </div>
            </div>

            <div className="bg-ink-950/80 border border-ink-800 rounded-xl p-4 mb-5 text-xs text-ink-300 leading-relaxed">
              <p className="mb-2">
                You are about to modify the organizational autonomy posture for <strong className="text-ink-100">Northstar Retail</strong>.
                This decision will be immutably recorded in the Concord Audit Trail with your cryptographic identity.
              </p>
              {selectedMode === 'OBSERVE' && (
                <div className="p-2.5 rounded bg-red-950/40 border border-red-800/50 text-red-300 text-[11px] mt-2">
                  <strong>Warning:</strong> In OBSERVE mode, active blocking is disabled. Concord will record violations but will not prevent external data transfer or unverified claims.
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium text-ink-300 mb-1.5">
                Audit Override Reason (Required for compliance trail)
              </label>
              <input
                type="text"
                value={confirmReason}
                onChange={e => setConfirmReason(e.target.value)}
                placeholder="e.g., Escalating launch perimeter testing or staging signoff..."
                className="w-full bg-ink-950 border border-ink-750 rounded-lg px-3 py-2 text-xs text-ink-100 placeholder-ink-600 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep('SELECT')}
                className="px-4 py-2 rounded-lg text-xs font-medium text-ink-400 hover:text-ink-200 hover:bg-ink-800 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleApply}
                className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-glow-teal transition-all"
              >
                Confirm & Apply Mode Change
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeChangeModal;
