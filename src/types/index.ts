export type AutonomyMode = 'OBSERVE' | 'GUARD' | 'APPROVAL_FIRST';

export type PolicyOutcome = 'ALLOWED' | 'BLOCKED' | 'ESCALATED' | 'DEDUPLICATED';

export type EventSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AgentStatus = 'ACTIVE' | 'PAUSED' | 'SUSPENDED';

export interface Agent {
  id: string;
  name: string;
  role: string;
  department: string;
  status: AgentStatus;
  autonomyLevel: AutonomyMode;
  avatarColor: string;
  allowedTools: string[];
  allowedDataScope: string[];
  restrictedDataScope: string[];
  plainLanguageBoundaries: string[];
  recentHandoffsCount: number;
}

export interface Policy {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: EventSeverity;
  defaultEnforcement: 'BLOCK' | 'ESCALATE' | 'ALLOW_WITH_LOG';
  enabled: boolean;
  affectedDepartments: string[];
  ruleSummary: string;
  guidelines: string;
  parameters: {
    requireCitation?: boolean;
    confidenceThreshold?: number;
    allowDirectExternalPublish?: boolean;
    blockDocumentInjection?: boolean;
    preventPaymentExecution?: boolean;
    piiSharingAllowed?: boolean;
  };
}

export interface GovernanceReceipt {
  receiptId: string;
  timestamp: string;
  workflowStepId: string;
  agentId: string;
  agentName: string;
  agentRole: string;
  department: string;
  actionAttempted: string;
  policyCode: string;
  policyTitle: string;
  outcome: PolicyOutcome;
  severity: EventSeverity;
  plainLanguageSummary: string;
  evidenceUsed: {
    docId?: string;
    docTitle?: string;
    snippet?: string;
    isApproved: boolean;
    sourceType: 'APPROVED_KNOWLEDGE_VAULT' | 'UNTRUSTED_INGESTION' | 'SYNTHESIZED_SCRATCHPAD' | 'NONE';
  };
  dataBoundaryDiff: {
    requested: string[];
    allowed: string[];
    redactedOrBlocked: string[];
  };
  humanDecision?: {
    required: boolean;
    decidedBy?: string;
    decidedAt?: string;
    decision?: 'APPROVED' | 'EDITED_AND_APPROVED' | 'REJECTED';
    notes?: string;
    overrideReason?: string;
  };
  nextActionTaken: string;
  technicalDetails: {
    hash: string;
    evaluationLatencyMs: number;
    ruleEvaluationTrace: string[];
    sandboxIsolationActive: boolean;
    tokenUsage: { prompt: number; completion: number; savedByDeduplication?: number };
    boundaryViolation?: string;
  };
}

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  agentId: string;
  targetAgentId?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'WAITING_HUMAN_REVIEW' | 'DEDUPLICATED';
  description: string;
  actionPayload: string;
  governanceHighlight?: 'DUPLICATE_AVOIDED' | 'PROMPT_INJECTION_CONTAINED' | 'UNSUPPORTED_CLAIM_ESCALATED';
  receiptId?: string;
  inputs: string[];
  outputs?: string[];
  estimatedDuration: string;
  dependsOn?: string[];
}

export interface ReviewItem {
  id: string;
  workflowStepId: string;
  receiptId: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  department: string;
  proposedAction: string;
  triggerReason: string;
  policyCode: string;
  policyTitle: string;
  severity: EventSeverity;
  supportingEvidence: string[];
  missingEvidence: string[];
  dataRequested: string[];
  dataAvailable: string[];
  potentialImpact: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  suggestedSafeAction: string;
  status: 'PENDING' | 'APPROVED' | 'EDITED_AND_APPROVED' | 'REJECTED';
  editedContent?: string;
  reviewerNotes?: string;
  overrideReason?: string;
  decidedAt?: string;
  decidedBy?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  owner: string;
  department: string;
  sensitivityLevel: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED_SANDBOX';
  approvalState: 'APPROVED' | 'PENDING_AUDIT' | 'UNTRUSTED_RAW_INPUT';
  lastUpdated: string;
  permittedAgents: string[];
  restrictedAgents: string[];
  summary: string;
  fullContent: string;
  accessRationale: string;
  isUntrustedInjectionSource?: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: 'POLICY_ENFORCEMENT' | 'HUMAN_DECISION' | 'AUTONOMY_MODE_CHANGE' | 'POLICY_CONFIG_CHANGE' | 'AGENT_STATUS_CHANGE' | 'SIMULATION_RUN';
  agentId?: string;
  agentName?: string;
  policyCode?: string;
  severity: EventSeverity;
  outcome: PolicyOutcome | 'CONFIG_MODIFIED' | 'DECIDED';
  description: string;
  actor: string;
  receiptId?: string;
}

export interface WhatIfSimulationResult {
  simulatedMode: AutonomyMode;
  modifiedPolicyCodes: string[];
  totalActionsEvaluated: number;
  outcomes: {
    passedBefore: number;
    passedAfter: number;
    blockedBefore: number;
    blockedAfter: number;
    escalatedBefore: number;
    escalatedAfter: number;
  };
  affectedDepartments: {
    department: string;
    impactDescription: string;
    riskDelta: 'REDUCED' | 'INCREASED' | 'UNCHANGED';
  }[];
  stepDiffs: {
    stepId: string;
    stepTitle: string;
    agentName: string;
    currentOutcome: PolicyOutcome;
    projectedOutcome: PolicyOutcome;
    explanation: string;
  }[];
  overallRiskScoreChange: number; // e.g. -24%
}
