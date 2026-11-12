export type SeedResourceCategory =
  | 'Governance & Minutes'
  | 'Working Papers'
  | 'Toolkits & Briefs'
  | 'Convenings';

export type SeedResourceAccessLevel = 'public' | 'member' | 'board_only';

export interface SeedResource {
  title: string;
  description: string;
  category: SeedResourceCategory;
  accessLevel: SeedResourceAccessLevel;
  externalUrl: string;
  topicSlugs: string[];
}

const EXTERNAL_URL: Record<SeedResourceCategory, string> = {
  'Governance & Minutes':
    'https://www.legislation.gov.uk/ukpga/2006/46/pdfs/ukpga_20060046_en.pdf',
  'Working Papers':
    'https://www.ohchr.org/sites/default/files/Documents/Publications/GuidingPrinciplesBusinessHR_EN.pdf',
  'Toolkits & Briefs':
    'https://www.gov.uk/government/publications/consultation-principles-guidance',
  Convenings:
    'https://www.ohchr.org/sites/default/files/UDHR/Documents/UDHR_Translations/eng.pdf',
};

type ResourceTuple = [
  title: string,
  description: string,
  category: SeedResourceCategory,
  accessLevel: SeedResourceAccessLevel,
  topicSlugs: string[],
];

const RESOURCE_ROWS: ResourceTuple[] = [
  [
    '2025 Board of Trustees Q1 Meeting Minutes',
    'Confidential minutes, strategic priority resolutions, and committee oversight records from the 2025 Q1 Board of Trustees plenary.',
    'Governance & Minutes',
    'board_only',
    ['governance-ethics'],
  ],
  [
    '2025 Board of Trustees Q2 Meeting Minutes',
    'Confidential minutes covering mid-year strategy, finance, and committee appointments from the Q2 Board of Trustees plenary.',
    'Governance & Minutes',
    'board_only',
    ['governance-ethics', 'institutional-design'],
  ],
  [
    'Executive Session: Board Succession Planning Notes',
    'Board-only notes on leadership succession, trustee recruitment priorities, and the timeline for the next governance transition.',
    'Governance & Minutes',
    'board_only',
    ['governance-ethics', 'leadership'],
  ],
  [
    'Board Conflict-of-Interest Policy',
    'Member-accessible policy covering disclosure expectations, recusal procedures, and annual attestation for trustees and senior staff.',
    'Governance & Minutes',
    'member',
    ['governance-ethics'],
  ],
  [
    'Governance Committee Terms of Reference',
    'Member-accessible terms of reference for the Governance and Nominations Committee, including mandate, composition, and reporting lines.',
    'Governance & Minutes',
    'member',
    ['governance-ethics', 'institutional-design'],
  ],
  [
    'Trustee Code of Conduct',
    'Public statement of trustee responsibilities, ethical commitments, confidentiality expectations, and standards for institutional conduct.',
    'Governance & Minutes',
    'public',
    ['governance-ethics', 'leadership'],
  ],
  [
    'Board Meeting Standards and Quorum Rules',
    'A public overview of meeting notice requirements, quorum rules, minute-taking standards, and trustee participation expectations.',
    'Governance & Minutes',
    'public',
    ['governance-ethics'],
  ],
  [
    'Bylaws Amendment Log 2023–2026',
    'A public record of bylaws amendments, effective dates, and the governance rationale behind each change.',
    'Governance & Minutes',
    'public',
    ['governance-ethics', 'institutional-design'],
  ],
  [
    'DLC Organizational Overview & Public Charter',
    'Public overview of organizational mission, community partnerships, and annual progress metrics across all leadership initiatives.',
    'Working Papers',
    'public',
    ['leadership', 'governance-ethics'],
  ],
  [
    'Ethical Leadership in Institutional Governance (Working Draft)',
    'Working paper examining institutional moral responsibility, stakeholder stewardship, and ethical discernment frameworks.',
    'Working Papers',
    'member',
    ['research-practice', 'leadership'],
  ],
  [
    'Institutions as Moral Actors: A Working Framework',
    'A framework for understanding institutions as moral actors accountable for dignity, trust, and the common good.',
    'Working Papers',
    'public',
    ['institutional-design', 'governance-ethics'],
  ],
  [
    'Measuring Belonging Without Reducing It',
    'Why belonging measures need qualitative listening, longitudinal evidence, and organizational follow-through.',
    'Working Papers',
    'public',
    ['diversity-equity-inclusion', 'research-practice'],
  ],
  [
    'Mission Drift and Institutional Clarity',
    'How mission-driven organizations can detect drift early and reconnect strategy, budget, and governance to their founding purpose.',
    'Working Papers',
    'public',
    ['institutional-design', 'leadership'],
  ],
  [
    "The Trustee's Compass: Duty and the Long View",
    'A practical reading of fiduciary duty for trustees navigating conflict, succession, and long-horizon decisions.',
    'Working Papers',
    'public',
    ['governance-ethics', 'leadership'],
  ],
  [
    'Faith, Pluralism, and the Common Good',
    'A working paper on public reason, pluralism, and the civic contribution of faith communities.',
    'Working Papers',
    'public',
    ['faith-public-life', 'community-engagement'],
  ],
  [
    'Research Agenda 2026–2028',
    'The center’s public research priorities across institutional trust, leadership formation, and community evaluation.',
    'Working Papers',
    'public',
    ['research-practice', 'leadership'],
  ],
  [
    'Building Coalitions Across Difference',
    'Lessons from multi-faith and cross-sector collaborations on sustaining coalitions without erasing difference.',
    'Working Papers',
    'public',
    ['community-engagement', 'convenings-dialogue'],
  ],
  [
    'Framework for Principled Stakeholder Consultation',
    'Practical executive guide and consultation rubric for convening diverse institutional leaders across sectors.',
    'Toolkits & Briefs',
    'member',
    ['community-engagement', 'leadership'],
  ],
  [
    'Board Orientation Handbook (Public Edition)',
    'An introduction to trustee responsibilities, meeting practice, conflict-of-interest expectations, and the questions every new board member should ask.',
    'Toolkits & Briefs',
    'public',
    ['leadership', 'governance-ethics'],
  ],
  [
    'Community Listening Session Design Toolkit',
    'Facilitation plans, invitation guidance, question sets, and follow-up templates for listening sessions that produce accountable next steps.',
    'Toolkits & Briefs',
    'public',
    ['community-engagement', 'research-practice'],
  ],
  [
    'Conflict Resolution for Mission-Driven Boards',
    'A member-accessible toolkit for surfacing disagreement, clarifying roles, and repairing trust when board decisions become contested.',
    'Toolkits & Briefs',
    'member',
    ['governance-ethics', 'convenings-dialogue'],
  ],
  [
    'Inclusive Meeting Facilitation Checklist',
    'A short public checklist for designing meetings where quieter voices can contribute and decisions are documented clearly.',
    'Toolkits & Briefs',
    'public',
    ['diversity-equity-inclusion', 'leadership'],
  ],
  [
    'Ethical Decision-Making Worksheet',
    'A public worksheet for teams weighing competing obligations, affected parties, and the long-term consequences of a decision.',
    'Toolkits & Briefs',
    'public',
    ['governance-ethics', 'research-practice'],
  ],
  [
    'Board Self-Assessment Worksheet',
    'A member-use worksheet for evaluating board composition, meeting effectiveness, committee performance, and the quality of oversight.',
    'Toolkits & Briefs',
    'member',
    ['governance-ethics', 'institutional-design'],
  ],
  [
    'Spring Leadership Convening Agenda & Reading Packet',
    'Official schedule, panel speaker bios, and briefing packet for collaborative partner representatives.',
    'Convenings',
    'member',
    ['convenings-dialogue', 'diversity-equity-inclusion'],
  ],
  [
    'Fall Convening 2025: Public Agenda and Reading Packet',
    'The public agenda, speaker list, and background readings for the fall convening on leadership, institutional trust, and community responsibility.',
    'Convenings',
    'public',
    ['convenings-dialogue', 'leadership'],
  ],
  [
    'Convening Report: Spring Leadership Summit 2026',
    'A public report on the 2026 Spring Leadership Summit, including plenary themes, working-group recommendations, and commitments for the coming year.',
    'Convenings',
    'public',
    ['convenings-dialogue', 'leadership'],
  ],
  [
    'Annual Member Assembly 2026: Registration and Agenda',
    'Public registration details, agenda, and participation guidance for the annual member assembly.',
    'Convenings',
    'public',
    ['convenings-dialogue', 'community-engagement'],
  ],
  [
    'Community Dialogue Series: Session Notes',
    'Public notes from the community dialogue series on trust, belonging, and shared responsibility across institutions.',
    'Convenings',
    'public',
    ['community-engagement', 'convenings-dialogue'],
  ],
  [
    'Faith and Civic Responsibility: A Reading List',
    'A curated reading list on pluralism, public reason, and the civic contribution of faith communities, with discussion questions for study groups.',
    'Convenings',
    'public',
    ['faith-public-life', 'community-engagement'],
  ],
  [
    'Leadership and Institutional Trust: Convening Summary',
    'A public summary of the convening on institutional trust, including the questions participants asked and the commitments they made.',
    'Convenings',
    'public',
    ['leadership', 'institutional-design'],
  ],
  [
    'Audit and Risk Committee Briefing',
    'Board-only briefing on internal controls, audit readiness, and the risk register reviewed by the Audit and Risk Committee.',
    'Convenings',
    'board_only',
    ['governance-ethics', 'research-practice'],
  ],
];

export const sampleResources: SeedResource[] = RESOURCE_ROWS.map(
  ([title, description, category, accessLevel, topicSlugs]) => ({
    title,
    description,
    category,
    accessLevel,
    topicSlugs,
    externalUrl: EXTERNAL_URL[category],
  }),
);
