// ─── Chat Sessions (sidebar history) ────────────────────────────
export const chatSessions = [
  { id: 'cs1', title: 'Refund Policy Workflow',       date: 'Today',     active: true  },
  { id: 'cs2', title: 'Employee Onboarding Steps',    date: 'Today',     active: false },
  { id: 'cs3', title: 'Data Retention SOP',           date: 'Yesterday', active: false },
  { id: 'cs4', title: 'IT Security Incident Response',date: 'Yesterday', active: false },
  { id: 'cs5', title: 'Vendor Approval Process',      date: 'Apr 5',     active: false },
  { id: 'cs6', title: 'Remote Work Guidelines',       date: 'Apr 4',     active: false },
  { id: 'cs7', title: 'GDPR Compliance Checklist',    date: 'Apr 3',     active: false },
  { id: 'cs8', title: 'Expense Approval Steps',       date: 'Apr 2',     active: false },
];

// legacy alias
export const chatHistory = chatSessions;

// ─── Source Documents ────────────────────────────────────────────
export const mockSources = [
  {
    id: 's1',
    fileName: 'RefundPolicy.pdf',
    page: 12,
    snippet: 'Refunds must be processed within 7 business days of the customer\'s request. The refund amount should match the original transaction value minus any applicable service fees as outlined in Section 4.2.',
    uploadDate: '2024-03-15',
    relevance: 0.97,
  },
  {
    id: 's2',
    fileName: 'CustomerServiceSOP.pdf',
    page: 34,
    snippet: 'Customer escalation procedures require that all Tier 2 issues are reviewed by a supervisor within 24 hours. Documentation must be submitted via the CRM system with all relevant case notes.',
    uploadDate: '2024-02-28',
    relevance: 0.88,
  },
  {
    id: 's3',
    fileName: 'FinanceOperations_2024.pdf',
    page: 7,
    snippet: 'Finance department processes all refund requests received from the customer service team. Batch processing occurs every Tuesday and Thursday. Emergency refunds may be processed on a case-by-case basis.',
    uploadDate: '2024-01-10',
    relevance: 0.82,
  },
  {
    id: 's4',
    fileName: 'HRHandbook_v3.pdf',
    page: 45,
    snippet: 'New employees must complete the onboarding checklist within their first 14 days. This includes IT setup, compliance training, and a 1:1 with their direct manager. All items must be signed off in the HR portal.',
    uploadDate: '2024-04-01',
    relevance: 0.94,
  },
  {
    id: 's5',
    fileName: 'ITSecurityPolicy.pdf',
    page: 8,
    snippet: 'Any suspected security incident must be reported to the IT Security team within 1 hour of discovery. Do not attempt to investigate or remediate independently. Use the internal portal at security.acme.internal to file an incident report.',
    uploadDate: '2024-04-05',
    relevance: 0.96,
  },
  {
    id: 's6',
    fileName: 'LeaveManagement_SOP.pdf',
    page: 22,
    snippet: 'Employees are entitled to 20 days of annual paid leave per calendar year. Leave requests must be submitted at least 5 business days in advance via the HR portal. Carry-over is limited to 5 days per year with manager approval.',
    uploadDate: '2024-03-01',
    relevance: 0.91,
  },
  {
    id: 's7',
    fileName: 'ExpensePolicy_2024.pdf',
    page: 3,
    snippet: 'All employee expenses above $50 require a receipt. Expenses above $500 require pre-approval from the department head before incurring the cost. Reimbursements are processed in the next available payroll cycle.',
    uploadDate: '2024-02-14',
    relevance: 0.89,
  },
  {
    id: 's8',
    fileName: 'VendorManagement_SOP.pdf',
    page: 11,
    snippet: 'New vendors must complete the vendor registration form and pass a compliance screening. The Procurement team will review submissions within 5 business days. Legal sign-off is required for any contract exceeding $10,000.',
    uploadDate: '2024-03-22',
    relevance: 0.85,
  },
];

// ─── Initial demo messages ────────────────────────────────────────
export const initialMessages = [
  {
    id: 'm1',
    role: 'user',
    content: 'How do I process a customer refund?',
    timestamp: '10:32 AM',
  },
  {
    id: 'm2',
    role: 'assistant',
    content: `To process a customer refund, follow these steps:\n\n**1. Verify Refund Eligibility**\nCheck the customer's request falls within the 30-day return window and the item meets refund criteria per policy.\n\n**2. Initiate Refund in CRM**\nNavigate to the customer's order, select "Initiate Refund," enter the amount, and include detailed notes on the reason.\n\n**3. Finance Team Approval**\nRefunds above $500 require Finance team approval. Submit a request ticket with supporting documentation.\n\n**4. Processing Timeline**\nStandard refunds are processed within **7 business days**. Expedited refunds (ER requests) may be processed within 48 hours with supervisor sign-off.\n\n**5. Customer Notification**\nSend a confirmation email using the approved template from the Knowledge Base. Ensure the customer has their reference number for tracking.`,
    timestamp: '10:32 AM',
    sources: [mockSources[0], mockSources[1], mockSources[2]],
    citations: [
      { label: 'RefundPolicy.pdf • Page 12',          sourceId: 's1' },
      { label: 'CustomerServiceSOP.pdf • Page 34',    sourceId: 's2' },
      { label: 'FinanceOperations_2024.pdf • Page 7', sourceId: 's3' },
    ],
  },
];

// ─── Mock AI responses (contextual by keyword) ───────────────────
const responses = [
  {
    keywords: ['refund', 'return', 'reimburse'],
    text: `Based on our Refund Policy SOP, here is the complete workflow:\n\n**Eligibility Check**\nAll refund requests must be initiated within 30 calendar days of the original purchase. Items must be unused and in original packaging unless the defect is acknowledged by quality.\n\n**Steps to Process**\n1. Log into the CRM and locate the customer order\n2. Select "Initiate Refund" and complete the refund form\n3. For amounts over $500, escalate to Finance via the internal portal\n4. Processing takes **7 business days** (or 48 hours for emergency refunds with supervisor approval)\n\n**Customer Communication**\nAlways send the confirmation email using the approved template and include the tracking reference number.`,
    sources: [mockSources[0], mockSources[1], mockSources[2]],
    citations: [
      { label: 'RefundPolicy.pdf • Page 12',          sourceId: 's1' },
      { label: 'CustomerServiceSOP.pdf • Page 34',    sourceId: 's2' },
      { label: 'FinanceOperations_2024.pdf • Page 7', sourceId: 's3' },
    ],
  },
  {
    keywords: ['onboard', 'new hire', 'new employee', 'joining'],
    text: `Here is the Employee Onboarding process as documented in the HR Handbook:\n\n**Week 1: Setup & Orientation**\n- Complete IT equipment request through the IT portal\n- Attend mandatory orientation session (HR schedules this automatically)\n- Get access cards from Facilities — bring your offer letter ID\n\n**Within 14 Days: Compliance & Training**\n- Complete all mandatory compliance trainings in the Learning portal\n- Sign off on the Code of Conduct and Data Privacy policy\n- Schedule a 1:1 meeting with your direct manager\n\n**HR Portal Checklist**\nAll onboarding items must be marked complete in the HR portal. Incomplete items after 14 days trigger an alert to your department head.`,
    sources: [mockSources[3]],
    citations: [
      { label: 'HRHandbook_v3.pdf • Page 45', sourceId: 's4' },
    ],
  },
  {
    keywords: ['security', 'incident', 'breach', 'hack', 'threat'],
    text: `According to the IT Security Incident Response SOP:\n\n**Immediate Actions (First 60 minutes)**\n- Do NOT attempt to investigate or fix the issue independently\n- Report to IT Security within **1 hour** of discovery\n- File an incident at: security.acme.internal\n\n**Information to Include in Your Report**\n- What you observed and when\n- Which systems or data may be affected\n- Any actions you've already taken\n\n**After Reporting**\nThe IT Security team will classify the incident (P1–P4) and initiate the response protocol. You may be asked to preserve logs or avoid using the affected system. All communications regarding the incident must go through the incident ticket — do not use email or Slack for sensitive details.`,
    sources: [mockSources[4]],
    citations: [
      { label: 'ITSecurityPolicy.pdf • Page 8', sourceId: 's5' },
    ],
  },
  {
    keywords: ['leave', 'vacation', 'annual', 'holiday', 'absence', 'pto'],
    text: `Here's the Leave Policy as outlined in our Leave Management SOP:\n\n**Entitlement**\n- Full-time employees: **20 days** paid annual leave per calendar year\n- Carry-over: Maximum 5 days, requires manager approval\n- Unused leave above the carry-over limit is forfeited at year-end\n\n**How to Request Leave**\n1. Submit your request in the HR portal at least **5 business days in advance**\n2. Your manager will approve or decline within 2 business days\n3. You'll receive an email confirmation once approved\n\n**Special Leave Types**\n- Sick leave: 10 days/year (medical certificate required after 3 consecutive days)\n- Maternity/Paternity: As per statutory requirements plus company top-up (see Section 5)\n- Bereavement: 3 days immediate family, 1 day extended family`,
    sources: [mockSources[5]],
    citations: [
      { label: 'LeaveManagement_SOP.pdf • Page 22', sourceId: 's6' },
    ],
  },
  {
    keywords: ['expense', 'reimbursement', 'claim', 'receipt', 'travel'],
    text: `Per the Expense Policy 2024, here's how to submit and approve expenses:\n\n**Expense Thresholds**\n| Amount | Requirement |\n|--------|-------------|\n| Under $50 | Self-approved, no receipt needed |\n| $50–$499 | Receipt required |\n| $500+ | Pre-approval from department head required BEFORE spending |\n\n**Submission Process**\n1. Log into the Expense portal and click "New Claim"\n2. Upload receipts (PDF or image)\n3. Select the appropriate cost centre and project code\n4. Submit — your manager receives an automatic review request\n\n**Reimbursement Timing**\nApproved expenses are reimbursed in the next available payroll cycle (typically within 2 weeks). International expenses are converted at the bank rate on the date of transaction.`,
    sources: [mockSources[6]],
    citations: [
      { label: 'ExpensePolicy_2024.pdf • Page 3', sourceId: 's7' },
    ],
  },
  {
    keywords: ['vendor', 'supplier', 'procurement', 'contract'],
    text: `The Vendor Onboarding process is governed by the Vendor Management SOP:\n\n**Pre-qualification**\n- Complete the Vendor Registration Form (available on the Procurement intranet page)\n- Provide: company registration, insurance certificate, and banking details\n- Vendors must pass a compliance screening (background & sanctions check)\n\n**Review & Approval**\n- Procurement reviews all submissions within **5 business days**\n- Legal sign-off required for contracts exceeding **$10,000**\n- For strategic vendors (contracts >$50k), approval from the CFO is required\n\n**After Approval**\n- Procurement will send an approved Vendor ID\n- All subsequent purchase orders must reference this Vendor ID\n- Annual vendor performance reviews are conducted by the category manager`,
    sources: [mockSources[7]],
    citations: [
      { label: 'VendorManagement_SOP.pdf • Page 11', sourceId: 's8' },
    ],
  },
];

const fallbackResponse = {
  text: `I've searched our SOP knowledge base for your query. Here's what I found:\n\n**General Guidelines**\nAll company processes are documented in our standard operating procedure library. Employees must follow documented procedures and seek approval from their direct manager before deviating from established workflows.\n\n**Getting More Help**\n- For HR-related queries: contact hr@acmecorp.com\n- For IT issues: submit a ticket at helpdesk.acme.internal\n- For Finance approvals: use the finance portal\n\nTry refining your question with keywords like "refund," "leave," "expense," "onboarding," or "vendor" for a more specific answer.`,
  sources: [mockSources[0], mockSources[3]],
  citations: [
    { label: 'RefundPolicy.pdf • Page 12',  sourceId: 's1' },
    { label: 'HRHandbook_v3.pdf • Page 45', sourceId: 's4' },
  ],
};

export function getAIResponse(query) {
  const q = query.toLowerCase();
  const match = responses.find(r => r.keywords.some(k => q.includes(k)));
  return match || fallbackResponse;
}

// ─── Suggested queries (empty state) ────────────────────────────
export const suggestedQueries = [
  { icon: '💰', title: 'How to process a refund?',          desc: 'Step-by-step refund workflow' },
  { icon: '👤', title: 'Employee onboarding checklist',     desc: 'New hire setup and orientation' },
  { icon: '🔒', title: 'IT security incident response',     desc: 'Report and contain security incidents' },
  { icon: '📋', title: 'Vendor approval process',           desc: 'How to onboard a new vendor' },
  { icon: '🏖️',  title: 'Leave policy rules?',              desc: 'Annual leave, sick leave, PTO' },
  { icon: '🧾', title: 'Expense approval steps',            desc: 'How to submit and get reimbursed' },
];

// ─── Mock documents for Admin panel ─────────────────────────────
export const mockDocuments = [
  { id: 'd1', name: 'RefundPolicy.pdf',          size: '2.4 MB', uploadDate: '2024-03-15', pages: 48,  status: 'ready',      chunks: 142 },
  { id: 'd2', name: 'CustomerServiceSOP.pdf',    size: '5.1 MB', uploadDate: '2024-02-28', pages: 112, status: 'ready',      chunks: 387 },
  { id: 'd3', name: 'FinanceOperations_2024.pdf',size: '3.8 MB', uploadDate: '2024-01-10', pages: 64,  status: 'ready',      chunks: 201 },
  { id: 'd4', name: 'HRHandbook_v3.pdf',         size: '8.2 MB', uploadDate: '2024-04-01', pages: 220, status: 'processing', chunks: 0   },
  { id: 'd5', name: 'ITSecurityPolicy.pdf',      size: '1.9 MB', uploadDate: '2024-04-05', pages: 38,  status: 'processing', chunks: 0   },
  { id: 'd6', name: 'VendorManagement_SOP.pdf',  size: '4.5 MB', uploadDate: '2024-03-22', pages: 89,  status: 'ready',      chunks: 263 },
  { id: 'd7', name: 'LeaveManagement_SOP.pdf',   size: '2.1 MB', uploadDate: '2024-03-01', pages: 56,  status: 'ready',      chunks: 178 },
  { id: 'd8', name: 'ExpensePolicy_2024.pdf',    size: '1.5 MB', uploadDate: '2024-02-14', pages: 32,  status: 'ready',      chunks: 98  },
];

// legacy alias
export const mockAIResponses = responses.map(r => r.text);
