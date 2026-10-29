import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Agent,
  Policy,
  WorkflowStep,
  GovernanceReceipt,
  ReviewItem,
  KnowledgeDocument,
  AuditLogEntry,
  AutonomyMode,
  WhatIfSimulationResult,
  PolicyOutcome
} from '../types';
import {
  INITIAL_AUTONOMY_MODE,
  INITIAL_AGENTS,
  INITIAL_POLICIES,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_GOVERNANCE_RECEIPTS,
  INITIAL_WORKFLOW_STEPS,
  INITIAL_REVIEW_ITEMS,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';

interface GovernanceContextType {
  autonomyMode: AutonomyMode;
  setAutonomyMode: (mode: AutonomyMode, confirmationReason?: string) => void;
  agents: Agent[];
  toggleAgentStatus: (agentId: string) => void;
  policies: Policy[];
  togglePolicy: (policyId: string) => void;
  updatePolicy: (policy: Policy) => void;
  workflowSteps: WorkflowStep[];
  receipts: Record<string, GovernanceReceipt>;
  selectedReceipt: GovernanceReceipt | null;
  openReceipt: (receiptId: string) => void;
  closeReceipt: () => void;
  reviewItems: ReviewItem[];
  pendingReviewsCount: number;
  resolveReviewItem: (
    itemId: string,
    decision: 'APPROVED' | 'EDITED_AND_APPROVED' | 'REJECTED',
    notes?: string,
    editedContent?: string,
    overrideReason?: string
  ) => void;
  auditLogs: AuditLogEntry[];
  knowledgeDocs: KnowledgeDocument[];
  isSimulating: boolean;
  simulationStepIndex: number;
  runLaunchSimulation: () => void;
  resetDemo: () => void;
  runWhatIfSimulation: (testMode: AutonomyMode, disabledPolicyCodes: string[]) => WhatIfSimulationResult;
  applyWhatIfChanges: (testMode: AutonomyMode, disabledPolicyCodes: string[]) => void;
  exportAuditData: (format: 'json' | 'csv') => void;
}

const GovernanceContext = createContext<GovernanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MODE: 'concord_autonomy_mode_v2',
  AGENTS: 'concord_agents_v2',
  POLICIES: 'concord_policies_v2',
  WORKFLOW: 'concord_workflow_v2',
  RECEIPTS: 'concord_receipts_v2',
  REVIEWS: 'concord_reviews_v2',
  AUDIT: 'concord_audit_v2',
  DOCS: 'concord_docs_v2'
};

export const GovernanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or defaults
  const [autonomyMode, setAutonomyModeState] = useState<AutonomyMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MODE);
    return (saved as AutonomyMode) || INITIAL_AUTONOMY_MODE;
  });

  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AGENTS);
    return saved ? JSON.parse(saved) : INITIAL_AGENTS;
  });

  const [policies, setPolicies] = useState<Policy[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POLICIES);
    return saved ? JSON.parse(saved) : INITIAL_POLICIES;
  });

  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKFLOW);
    return saved ? JSON.parse(saved) : INITIAL_WORKFLOW_STEPS;
  });

  const [receipts, setReceipts] = useState<Record<string, GovernanceReceipt>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
    return saved ? JSON.parse(saved) : INITIAL_GOVERNANCE_RECEIPTS;
  });

  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEW_ITEMS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [knowledgeDocs] = useState<KnowledgeDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCS);
    return saved ? JSON.parse(saved) : INITIAL_KNOWLEDGE_DOCS;
  });

  const [selectedReceipt, setSelectedReceipt] = useState<GovernanceReceipt | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStepIndex, setSimulationStepIndex] = useState(-1);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODE, autonomyMode);
  }, [autonomyMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKFLOW, JSON.stringify(workflowSteps));
  }, [workflowSteps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts));
  }, [receipts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviewItems));
  }, [reviewItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Helper to append audit entry
  const addAuditLog = useCallback((
    eventType: AuditLogEntry['eventType'],
    description: string,
    severity: AuditLogEntry['severity'] = 'INFO',
    policyCode?: string,
    outcome: AuditLogEntry['outcome'] = 'ALLOWED',
    agentId?: string,
    agentName?: string,
    receiptId?: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      eventType,
      agentId,
      agentName,
      policyCode,
      severity,
      outcome,
      description,
      actor: 'Human Reviewer (Chief Compliance Officer)',
      receiptId
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  }, []);

  // Set Autonomy Mode with explicit logging
  const setAutonomyMode = useCallback((mode: AutonomyMode, confirmationReason?: string) => {
    setAutonomyModeState(mode);
    addAuditLog(
      'AUTONOMY_MODE_CHANGE',
      `Autonomy mode changed to ${mode}. Reason: ${confirmationReason || 'Administrative control plane update'}.`,
      mode === 'OBSERVE' ? 'HIGH' : 'INFO',
      undefined,
      'CONFIG_MODIFIED'
    );
  }, [addAuditLog]);

  // Toggle Agent Active/Suspended
  const toggleAgentStatus = useCallback((agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        const nextStatus = a.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        addAuditLog(
          'AGENT_STATUS_CHANGE',
          `Agent [${a.name}] status changed to ${nextStatus}.`,
          nextStatus === 'SUSPENDED' ? 'HIGH' : 'INFO',
          undefined,
          'CONFIG_MODIFIED',
          a.id,
          a.name
        );
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  }, [addAuditLog]);

  // Toggle Policy
  const togglePolicy = useCallback((policyId: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === policyId) {
        const updated = { ...p, enabled: !p.enabled };
        addAuditLog(
          'POLICY_CONFIG_CHANGE',
          `Policy [${p.code}] ${p.title} ${updated.enabled ? 'ENABLED' : 'DISABLED'}.`,
          updated.enabled ? 'LOW' : 'HIGH',
          p.code,
          'CONFIG_MODIFIED'
        );
        return updated;
      }
      return p;
    }));
  }, [addAuditLog]);

  // Update Policy configuration
  const updatePolicy = useCallback((updatedPolicy: Policy) => {
    setPolicies(prev => prev.map(p => p.id === updatedPolicy.id ? updatedPolicy : p));
    addAuditLog(
      'POLICY_CONFIG_CHANGE',
      `Policy parameters updated for [${updatedPolicy.code}] ${updatedPolicy.title}.`,
      'MEDIUM',
      updatedPolicy.code,
      'CONFIG_MODIFIED'
    );
  }, [addAuditLog]);

  // Open receipt drawer
  const openReceipt = useCallback((receiptId: string) => {
    if (receipts[receiptId]) {
      setSelectedReceipt(receipts[receiptId]);
    }
  }, [receipts]);

  const closeReceipt = useCallback(() => {
    setSelectedReceipt(null);
  }, []);

  // Human Reviewer decision action
  const resolveReviewItem = useCallback((
    itemId: string,
    decision: 'APPROVED' | 'EDITED_AND_APPROVED' | 'REJECTED',
    notes?: string,
    editedContent?: string,
    overrideReason?: string
  ) => {
    const item = reviewItems.find(r => r.id === itemId);
    if (!item) return;

    const now = new Date().toISOString();

    // 1. Update review item
    setReviewItems(prev => prev.map(r => {
      if (r.id === itemId) {
        return {
          ...r,
          status: decision,
          reviewerNotes: notes,
          editedContent: editedContent || r.editedContent,
          overrideReason: overrideReason,
          decidedAt: now,
          decidedBy: 'Compliance Officer (Human)'
        };
      }
      return r;
    }));

    // 2. Update Governance Receipt
    setReceipts(prev => {
      const rec = prev[item.receiptId];
      if (!rec) return prev;
      return {
        ...prev,
        [item.receiptId]: {
          ...rec,
          humanDecision: {
            required: true,
            decidedBy: 'Compliance Officer (Human)',
            decidedAt: now,
            decision,
            notes,
            overrideReason
          },
          plainLanguageSummary: decision === 'EDITED_AND_APPROVED'
            ? `${rec.plainLanguageSummary} Human reviewer edited claim to match verified benchmark KV-103 and authorized publication.`
            : decision === 'APPROVED'
            ? `${rec.plainLanguageSummary} Overridden with human clearance (Reason: ${overrideReason || 'Officer discretion'}).`
            : `${rec.plainLanguageSummary} Human reviewer rejected proposed copy; returned to Marketing Agent for revision.`
        }
      };
    });

    // 3. Update Workflow Steps
    setWorkflowSteps(prev => prev.map(step => {
      if (step.id === item.workflowStepId) {
        return {
          ...step,
          status: decision === 'REJECTED' ? 'BLOCKED' : 'COMPLETED',
          description: decision === 'EDITED_AND_APPROVED'
            ? `Reviewer approved edited copy: "${editedContent}"`
            : decision === 'APPROVED'
            ? `Reviewer approved claim with override: "${overrideReason}"`
            : `Reviewer rejected claim: "${notes || 'Inadequate factual backing'}"`
        };
      }
      if (step.id === 'wf-6') {
        return {
          ...step,
          status: 'COMPLETED',
          outputs: [`Decision: ${decision} by Compliance Officer`]
        };
      }
      if (step.id === 'wf-7' && decision !== 'REJECTED') {
        return {
          ...step,
          status: 'COMPLETED',
          outputs: ['Launch Package Manifest v1.0 generated and synchronized']
        };
      }
      return step;
    }));

    // 4. Record to Audit Log
    addAuditLog(
      'HUMAN_DECISION',
      `Human Reviewer [${decision}] on item ${item.id} (${item.policyCode}): ${item.proposedAction.slice(0, 60)}... ${overrideReason ? `[Override: ${overrideReason}]` : ''}`,
      decision === 'APPROVED' && item.severity === 'HIGH' ? 'HIGH' : 'INFO',
      item.policyCode,
      'DECIDED',
      item.agentId,
      item.agentName,
      item.receiptId
    );
  }, [reviewItems, addAuditLog]);

  // Run Launch Simulation (Step by step animated execution)
  const runLaunchSimulation = useCallback(() => {
    setIsSimulating(true);
    setSimulationStepIndex(0);

    // Reset workflow steps to initial running sequence
    setWorkflowSteps(INITIAL_WORKFLOW_STEPS.map(s => {
      if (s.stepNumber === 1) return { ...s, status: 'IN_PROGRESS' };
      return { ...s, status: 'PENDING' };
    }));

    addAuditLog('SIMULATION_RUN', 'Started simulated product launch workflow for Northstar Retail.', 'INFO');

    // Simulate progressive execution across steps
    const stepTimes = [1000, 2400, 4000, 5600, 7200, 8500];

    stepTimes.forEach((delay, idx) => {
      setTimeout(() => {
        setSimulationStepIndex(idx + 1);

        setWorkflowSteps(prev => {
          return prev.map(s => {
            if (s.stepNumber === 1 && idx >= 0) return { ...s, status: 'COMPLETED' };
            if (s.stepNumber === 2 && idx >= 1) return { ...s, status: 'DEDUPLICATED' };
            if (s.stepNumber === 3 && idx >= 2) return { ...s, status: 'BLOCKED' };
            if (s.stepNumber === 4 && idx >= 3) return { ...s, status: 'COMPLETED' };
            if (s.stepNumber === 5 && idx >= 4) return { ...s, status: 'WAITING_HUMAN_REVIEW' };
            if (s.stepNumber === 6 && idx >= 5) return { ...s, status: 'WAITING_HUMAN_REVIEW' };
            return s;
          });
        });

        if (idx === stepTimes.length - 1) {
          setIsSimulating(false);
          addAuditLog(
            'POLICY_ENFORCEMENT',
            'Simulation reached human decision gate (Step 6). Awaiting Compliance Officer review.',
            'HIGH',
            'POL-001',
            'ESCALATED'
          );
        }
      }, delay);
    });
  }, [addAuditLog]);

  // Reset Demo to pristine baseline state
  const resetDemo = useCallback(() => {
    setIsSimulating(false);
    setSimulationStepIndex(-1);
    setSelectedReceipt(null);
    setAutonomyModeState(INITIAL_AUTONOMY_MODE);
    setAgents(INITIAL_AGENTS);
    setPolicies(INITIAL_POLICIES);
    setWorkflowSteps(INITIAL_WORKFLOW_STEPS);
    setReceipts(INITIAL_GOVERNANCE_RECEIPTS);
    setReviewItems(INITIAL_REVIEW_ITEMS);
    setAuditLogs(INITIAL_AUDIT_LOGS);

    localStorage.removeItem(STORAGE_KEYS.MODE);
    localStorage.removeItem(STORAGE_KEYS.AGENTS);
    localStorage.removeItem(STORAGE_KEYS.POLICIES);
    localStorage.removeItem(STORAGE_KEYS.WORKFLOW);
    localStorage.removeItem(STORAGE_KEYS.RECEIPTS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
    localStorage.removeItem(STORAGE_KEYS.DOCS);

    addAuditLog('SIMULATION_RUN', 'Reset Concord demo state to default Northstar Retail scenario.', 'INFO');
  }, [addAuditLog]);

  // Run What-If Simulation
  const runWhatIfSimulation = useCallback((testMode: AutonomyMode, disabledPolicyCodes: string[]): WhatIfSimulationResult => {
    // Current baseline stats
    const passedBefore = 3;
    const blockedBefore = 2; // prompt injection & payment
    const escalatedBefore = 1; // unsupported claim

    let passedAfter = 0;
    let blockedAfter = 0;
    let escalatedAfter = 0;

    const stepDiffs: WhatIfSimulationResult['stepDiffs'] = [];

    // Step 2: Market sizing
    if (disabledPolicyCodes.includes('POL-005')) {
      passedAfter++;
      stepDiffs.push({
        stepId: 'wf-2',
        stepTitle: 'Market Sizing & Redundancy Check',
        agentName: 'Coordinator Agent',
        currentOutcome: 'DEDUPLICATED',
        projectedOutcome: 'ALLOWED',
        explanation: 'Grounding requirement disabled: Redundant external web scraping executes without cache deduplication.'
      });
    } else {
      passedAfter++;
      stepDiffs.push({
        stepId: 'wf-2',
        stepTitle: 'Market Sizing & Redundancy Check',
        agentName: 'Coordinator Agent',
        currentOutcome: 'DEDUPLICATED',
        projectedOutcome: 'DEDUPLICATED',
        explanation: 'Coordinator continues to reuse KV-101 market sizing cache.'
      });
    }

    // Step 3: Prompt injection containment
    const pol6Disabled = disabledPolicyCodes.includes('POL-006');
    const pol2Disabled = disabledPolicyCodes.includes('POL-002');
    if (testMode === 'OBSERVE' && pol6Disabled) {
      passedAfter++;
      stepDiffs.push({
        stepId: 'wf-3',
        stepTitle: 'Competitor Intelligence & Document Sanitization',
        agentName: 'Research Agent',
        currentOutcome: 'BLOCKED',
        projectedOutcome: 'ALLOWED',
        explanation: 'CRITICAL RISK: Prompt injection defense disabled under OBSERVE mode. Customer PII export payload would execute.'
      });
    } else if (pol6Disabled && !pol2Disabled) {
      blockedAfter++;
      stepDiffs.push({
        stepId: 'wf-3',
        stepTitle: 'Competitor Intelligence & Document Sanitization',
        agentName: 'Research Agent',
        currentOutcome: 'BLOCKED',
        projectedOutcome: 'BLOCKED',
        explanation: 'Prompt injection rule disabled, but fallback POL-002 (PII Boundary) still blocks customer record export.'
      });
    } else {
      blockedAfter++;
      stepDiffs.push({
        stepId: 'wf-3',
        stepTitle: 'Competitor Intelligence & Document Sanitization',
        agentName: 'Research Agent',
        currentOutcome: 'BLOCKED',
        projectedOutcome: 'BLOCKED',
        explanation: 'Prompt injection continues to be quarantined at sandboxed boundary.'
      });
    }

    // Step 4: Payment execution
    if (disabledPolicyCodes.includes('POL-004')) {
      if (testMode === 'OBSERVE') {
        passedAfter++;
        stepDiffs.push({
          stepId: 'wf-4',
          stepTitle: 'Launch Economics & Payment Boundary',
          agentName: 'Finance Agent',
          currentOutcome: 'BLOCKED',
          projectedOutcome: 'ALLOWED',
          explanation: 'HIGH RISK: Autonomous payment prohibition disabled. Finance Agent would execute $45,000 Stripe ad purchase without human signoff.'
        });
      } else {
        escalatedAfter++;
        stepDiffs.push({
          stepId: 'wf-4',
          stepTitle: 'Launch Economics & Payment Boundary',
          agentName: 'Finance Agent',
          currentOutcome: 'BLOCKED',
          projectedOutcome: 'ESCALATED',
          explanation: 'Payment rule relaxed: Rather than hard blocking, payment would be routed to human review.'
        });
      }
    } else {
      blockedAfter++;
      stepDiffs.push({
        stepId: 'wf-4',
        stepTitle: 'Launch Economics & Payment Boundary',
        agentName: 'Finance Agent',
        currentOutcome: 'BLOCKED',
        projectedOutcome: 'BLOCKED',
        explanation: 'Direct API payment execution remains blocked.'
      });
    }

    // Step 5: Unsupported claim
    if (disabledPolicyCodes.includes('POL-001')) {
      passedAfter++;
      stepDiffs.push({
        stepId: 'wf-5',
        stepTitle: 'Promotional Copy Generation & Claim Verification',
        agentName: 'Marketing Agent',
        currentOutcome: 'ESCALATED',
        projectedOutcome: 'ALLOWED',
        explanation: 'COMPLIANCE VIOLATION: Unsubstantiated 400% performance claim would publish to external channels without human review.'
      });
    } else if (testMode === 'APPROVAL_FIRST') {
      escalatedAfter++;
      stepDiffs.push({
        stepId: 'wf-5',
        stepTitle: 'Promotional Copy Generation & Claim Verification',
        agentName: 'Marketing Agent',
        currentOutcome: 'ESCALATED',
        projectedOutcome: 'ESCALATED',
        explanation: 'Under Approval First, Marketing copy is strictly gated for human compliance review.'
      });
    } else {
      escalatedAfter++;
      stepDiffs.push({
        stepId: 'wf-5',
        stepTitle: 'Promotional Copy Generation & Claim Verification',
        agentName: 'Marketing Agent',
        currentOutcome: 'ESCALATED',
        projectedOutcome: 'ESCALATED',
        explanation: 'Unsupported claim continues to be routed to Review Queue.'
      });
    }

    // Step 1: Base dispatch
    passedAfter++;

    // Calculate risk delta
    const riskFactor = (passedAfter - passedBefore) * 25 + (testMode === 'OBSERVE' ? 40 : testMode === 'APPROVAL_FIRST' ? -35 : 0);
    const overallRiskScoreChange = Math.min(100, Math.max(-80, riskFactor));

    const affectedDepartments = [
      {
        department: 'Growth Marketing',
        impactDescription: disabledPolicyCodes.includes('POL-001')
          ? 'High compliance risk: Unverified superlative claims would bypass review.'
          : 'Normal governance gate: Copy verification active.',
        riskDelta: (disabledPolicyCodes.includes('POL-001') ? 'INCREASED' : 'UNCHANGED') as 'INCREASED' | 'UNCHANGED'
      },
      {
        department: 'Market Research',
        impactDescription: pol6Disabled
          ? 'Elevated risk: Untrusted document injection defenses weakened.'
          : 'Protected: Document containment firewall active.',
        riskDelta: (pol6Disabled ? 'INCREASED' : 'UNCHANGED') as 'INCREASED' | 'UNCHANGED'
      },
      {
        department: 'Finance & Planning',
        impactDescription: disabledPolicyCodes.includes('POL-004')
          ? 'Financial risk: Autonomous payment capability enabled.'
          : 'Secure: Autonomous disbursements forbidden.',
        riskDelta: (disabledPolicyCodes.includes('POL-004') ? 'INCREASED' : 'UNCHANGED') as 'INCREASED' | 'UNCHANGED'
      }
    ];

    return {
      simulatedMode: testMode,
      modifiedPolicyCodes: disabledPolicyCodes,
      totalActionsEvaluated: 5,
      outcomes: {
        passedBefore,
        passedAfter,
        blockedBefore,
        blockedAfter,
        escalatedBefore,
        escalatedAfter
      },
      affectedDepartments,
      stepDiffs,
      overallRiskScoreChange
    };
  }, []);

  // Apply What-If Changes to live state
  const applyWhatIfChanges = useCallback((testMode: AutonomyMode, disabledPolicyCodes: string[]) => {
    setAutonomyModeState(testMode);
    setPolicies(prev => prev.map(p => ({
      ...p,
      enabled: !disabledPolicyCodes.includes(p.code)
    })));

    addAuditLog(
      'POLICY_CONFIG_CHANGE',
      `Applied What-If Policy Simulation to live workflow: Mode -> ${testMode}, Disabled Policies: [${disabledPolicyCodes.join(', ') || 'None'}].`,
      'HIGH',
      undefined,
      'CONFIG_MODIFIED'
    );
  }, [addAuditLog]);

  // Export audit data as JSON or CSV
  const exportAuditData = useCallback((format: 'json' | 'csv') => {
    let content = '';
    let mimeType = '';
    let filename = '';

    if (format === 'json') {
      content = JSON.stringify(
        {
          organization: 'Northstar Retail',
          system: 'Concord AI Governance Control Plane',
          exportTimestamp: new Date().toISOString(),
          autonomyMode,
          auditLogs,
          governanceReceipts: Object.values(receipts),
          policies: policies.map(p => ({ code: p.code, title: p.title, enabled: p.enabled, severity: p.severity }))
        },
        null,
        2
      );
      mimeType = 'application/json';
      filename = `concord-audit-northstar-${Date.now()}.json`;
    } else {
      const headers = ['id', 'timestamp', 'eventType', 'agentName', 'policyCode', 'severity', 'outcome', 'description', 'actor', 'receiptId'];
      const rows = auditLogs.map(l => [
        l.id,
        l.timestamp,
        l.eventType,
        `"${l.agentName || 'N/A'}"`,
        l.policyCode || 'N/A',
        l.severity,
        l.outcome,
        `"${l.description.replace(/"/g, '""')}"`,
        `"${l.actor}"`,
        l.receiptId || 'N/A'
      ]);
      content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      mimeType = 'text/csv';
      filename = `concord-audit-northstar-${Date.now()}.csv`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addAuditLog('POLICY_ENFORCEMENT', `Exported Concord audit trail in ${format.toUpperCase()} format.`, 'INFO');
  }, [autonomyMode, auditLogs, receipts, policies, addAuditLog]);

  const pendingReviewsCount = reviewItems.filter(r => r.status === 'PENDING').length;

  return (
    <GovernanceContext.Provider
      value={{
        autonomyMode,
        setAutonomyMode,
        agents,
        toggleAgentStatus,
        policies,
        togglePolicy,
        updatePolicy,
        workflowSteps,
        receipts,
        selectedReceipt,
        openReceipt,
        closeReceipt,
        reviewItems,
        pendingReviewsCount,
        resolveReviewItem,
        auditLogs,
        knowledgeDocs,
        isSimulating,
        simulationStepIndex,
        runLaunchSimulation,
        resetDemo,
        runWhatIfSimulation,
        applyWhatIfChanges,
        exportAuditData
      }}
    >
      {children}
    </GovernanceContext.Provider>
  );
};

export const useGovernance = () => {
  const context = useContext(GovernanceContext);
  if (!context) {
    throw new Error('useGovernance must be used within a GovernanceProvider');
  }
  return context;
};
