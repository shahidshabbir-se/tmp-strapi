export interface SeedAuthor {
  name: string;
  slug: string;
  title: string;
  bio: string;
  email: string;
}

export interface SeedArticle {
  Title: string;
  Slug: string;
  Description: string;
  Published: string;
  authorSlug: string;
  topicSlugs: string[];
  body: string;
  quote: string;
}

export const sampleAuthors: SeedAuthor[] = [
  {
    name: 'Dr. Amina Rahman',
    slug: 'amina-rahman',
    title: 'Senior Fellow, Institutional Ethics',
    bio: 'Amina studies how boards and mission-driven organizations translate moral commitments into durable governance practice.',
    email: 'amina.rahman@example.org',
  },
  {
    name: 'Dr. Leila Mansour',
    slug: 'leila-mansour',
    title: 'Research Fellow, Belonging and Evaluation',
    bio: 'Leila works with community organizations to design evaluation that is useful to the people being measured.',
    email: 'leila.mansour@example.org',
  },
  {
    name: 'Imam Yusuf Haddad',
    slug: 'yusuf-haddad',
    title: 'Fellow, Governance and Public Life',
    bio: 'Yusuf advises faith-based institutions on trustee development, conflict resolution, and long-horizon stewardship.',
    email: 'yusuf.haddad@example.org',
  },
  {
    name: 'Sarah Chen',
    slug: 'sarah-chen',
    title: 'Community Engagement Lead',
    bio: 'Sarah facilitates listening sessions and cross-sector partnerships grounded in shared accountability.',
    email: 'sarah.chen@example.org',
  },
  {
    name: 'Marcus Bell',
    slug: 'marcus-bell',
    title: 'Fellow, Coalitions and Civic Dialogue',
    bio: 'Marcus convenes multi-faith and cross-sector groups working on common public challenges.',
    email: 'marcus.bell@example.org',
  },
  {
    name: 'Dr. Maqsood Ahmed',
    slug: 'maqsood-ahmed',
    title: 'Senior Advisor, Institutional History',
    bio: 'Maqsood writes on the development of American Muslim institutions and their contribution to public life.',
    email: 'maqsood.ahmed@example.org',
  },
];

type ArticleTuple = [
  Title: string,
  Slug: string,
  Description: string,
  Published: string,
  authorSlug: string,
  topicSlugs: string[],
  body: string,
  quote: string,
];

const ARTICLE_ROWS: ArticleTuple[] = [
  [
    'Institutions as Moral Actors: A Framework for Stewardship',
    'institutions-as-moral-actors-a-framework-for-stewardship',
    'How boards, staff, and communities can treat institutions as moral actors accountable for dignity, trust, and the common good.',
    '2026-10-14',
    'amina-rahman',
    ['institutional-design', 'governance-ethics'],
    'Treating an institution as a moral actor begins with clarity about purpose, accountability that reaches beyond legal minimums, and stewardship of trust. Governance documents matter, but so do the habits of the people who interpret them.',
    'An institution becomes trustworthy when its structure makes good judgment easier and its culture makes concealment harder.',
  ],
  [
    'Belonging Beyond Metrics: Evaluating Inclusion That Lasts',
    'belonging-beyond-metrics-evaluating-inclusion-that-lasts',
    'Why belonging measures must be paired with qualitative listening, longitudinal evidence, and honest organizational change.',
    '2026-08-22',
    'leila-mansour',
    ['diversity-equity-inclusion', 'research-practice'],
    'Evaluation becomes more useful when repeated measures show whether experience is improving, interviews explain the patterns behind the numbers, and organizational records reveal who carries invisible work. The hardest part is allowing the evidence to change decisions.',
    'If belonging is measured only to be announced, it becomes public relations. If it is measured to be acted upon, it becomes governance.',
  ],
  [
    "The Trustee's Compass: Duty, Loyalty, and the Long View",
    'the-trustees-compass-duty-loyalty-and-the-long-view',
    'A practical reading of fiduciary duty for trustees navigating conflict, succession, and long-horizon decisions.',
    '2026-06-09',
    'yusuf-haddad',
    ['governance-ethics', 'leadership'],
    'Fiduciary duty is not a single rule but a discipline of attention. Trustees must ask who is affected, what the institution exists to protect, and whether a decision can be explained honestly to the people who depend on it.',
    'The long view is not a delay tactic. It is a commitment to leave the institution stronger than you found it.',
  ],
  [
    'Mission Drift and Institutional Clarity',
    'mission-drift-and-institutional-clarity',
    'How mission-driven organizations can detect drift early and reconnect strategy, budget, and governance to their founding purpose.',
    '2026-05-20',
    'amina-rahman',
    ['institutional-design', 'leadership'],
    'Mission drift rarely arrives as a single decision. It accumulates through small trade-offs that are each defensible on their own but together change what the organization rewards, protects, and refuses to do.',
    'Clarity is not a slogan. It is the ability to trace a budget line back to a purpose.',
  ],
  [
    'Building Coalitions Across Difference',
    'building-coalitions-across-difference',
    'Lessons from multi-faith and cross-sector collaborations on sustaining coalitions without erasing difference.',
    '2026-04-28',
    'marcus-bell',
    ['community-engagement', 'convenings-dialogue'],
    'Coalitions last when participants can name their differences without treating them as obstacles to cooperation. That requires agreed purposes, transparent decision rules, and enough relational trust to repair disagreement.',
    'A coalition that asks everyone to sound the same is not diverse. It is merely quiet.',
  ],
  [
    'Listening as Leadership',
    'listening-as-leadership',
    'Why listening is a governance practice, not a public-relations exercise, and how institutions can make it accountable.',
    '2026-04-07',
    'sarah-chen',
    ['community-engagement', 'leadership'],
    'Listening becomes leadership when it changes something: an agenda, a budget, a program, or the way a decision is explained. Without a visible path from what was heard to what was decided, listening becomes performance.',
    'People can tell the difference between being heard and being managed.',
  ],
  [
    'Faith, Pluralism, and the Common Good',
    'faith-pluralism-and-the-common-good',
    'How faith commitments can inform public responsibility without narrowing the pluralism that public institutions must protect.',
    '2026-03-18',
    'yusuf-haddad',
    ['faith-public-life', 'community-engagement'],
    'Faith communities bring moral vocabulary, durable institutions, and deep networks to public life. They also bring disagreements that cannot be dissolved by procedure alone. The task is to build institutions capable of holding those disagreements without abandoning the common good.',
    'Pluralism is not the absence of conviction. It is the discipline of living with conviction alongside others.',
  ],
  [
    'Measuring What Communities Value',
    'measuring-what-communities-value',
    'A practical argument for evaluation that is useful to the people being measured, not only to funders.',
    '2026-03-02',
    'leila-mansour',
    ['research-practice', 'community-engagement'],
    'Evaluation becomes extractive when communities provide data but never see the findings or benefit from the decisions. A better process agrees in advance what will be measured, who will see it, and which decisions it can influence.',
    'Measurement should increase accountability, not just documentation.',
  ],
  [
    'Board Meetings That Decide Something',
    'board-meetings-that-decide-something',
    'How agenda design, consent items, and clear minutes can turn board meetings from reporting rituals into deliberate governance.',
    '2026-02-16',
    'amina-rahman',
    ['governance-ethics', 'leadership'],
    'A board meeting is a decision environment. When most of the agenda is presentation, trustees have little time to deliberate. Separating information, discussion, and decision items makes the meeting easier to follow and easier to hold accountable.',
    'Minutes should record what was decided and why, not only who attended.',
  ],
  [
    'Conflicts of Interest and the Integrity of Deliberation',
    'conflicts-of-interest-and-the-integrity-of-deliberation',
    'Why early disclosure and documented recusal protect both the decision and the trustee who made it.',
    '2026-01-27',
    'yusuf-haddad',
    ['governance-ethics', 'institutional-design'],
    'A conflict of interest is not a moral failure by itself. Concealment is. Boards need a low-stakes way to disclose conflicts early, clear rules for recusal, and minutes that show the process was followed.',
    'The purpose of recusal is not to punish the trustee. It is to protect the decision.',
  ],
  [
    'Succession Planning Without Panic',
    'succession-planning-without-panic',
    'How boards can build a leadership pipeline before a vacancy forces a rushed decision.',
    '2026-01-12',
    'marcus-bell',
    ['leadership', 'governance-ethics'],
    'Succession planning is an ongoing governance responsibility, not a crisis response. Boards should know which capabilities the institution will need next, which people are developing them, and what the transition timeline looks like.',
    'The best time to plan a transition is before anyone is leaving.',
  ],
  [
    'Reading Financial Statements as a Trustee',
    'reading-financial-statements-as-a-trustee',
    'The questions every trustee should ask about reserves, restricted funds, cash flow, and budget assumptions.',
    '2025-12-08',
    'amina-rahman',
    ['governance-ethics', 'institutional-design'],
    'Trustees do not need to become accountants, but they do need to understand what the numbers imply. A healthy reserve is not the same as healthy cash flow, and a balanced budget can still hide structural risk.',
    'A budget is a moral document. It shows what the institution actually values.',
  ],
  [
    'From Findings to Decisions',
    'from-findings-to-decisions',
    'How research findings can inform governance decisions without flattening the nuance that made the research useful.',
    '2025-11-19',
    'leila-mansour',
    ['research-practice', 'institutional-design'],
    'Research is most useful when decision-makers know what it can and cannot support. A finding that is uncertain is still a finding. Treating uncertainty honestly is part of accountability.',
    'The goal is not a clean number. The goal is a better decision.',
  ],
  [
    'Writing Public Scholarship That Lasts',
    'writing-public-scholarship-that-lasts',
    'How researchers can write for public audiences without sacrificing accuracy, uncertainty, or the voices of the people they studied.',
    '2025-11-03',
    'maqsood-ahmed',
    ['research-practice', 'leadership'],
    'Public scholarship requires translation without distortion. The writer must decide which details are essential, which caveats matter, and how to represent people who did not choose to become examples.',
    'Clarity is a form of respect for the reader and the subject.',
  ],
  [
    'Institutional Trust After Failure',
    'institutional-trust-after-failure',
    'What institutions owe the people they have failed, and why repair is more than a communications strategy.',
    '2025-10-21',
    'sarah-chen',
    ['institutional-design', 'community-engagement'],
    'Trust after failure depends on acknowledgment, explanation, and structural change. An apology without a change in incentives teaches people that the institution has learned to apologize rather than learned to act differently.',
    'Repair is not the same as reputation management.',
  ],
  [
    'The Work of Trustee Recruitment',
    'the-work-of-trustee-recruitment',
    'Why board composition is a governance decision, not a search for familiar names.',
    '2025-10-06',
    'yusuf-haddad',
    ['governance-ethics', 'diversity-equity-inclusion'],
    'Trustee recruitment shapes what a board can notice. A board composed entirely of people with the same professional background will have blind spots that no amount of good intention can correct.',
    'Composition is a form of institutional design.',
  ],
  [
    'Planning a Listening Study',
    'planning-a-listening-study',
    'A practical guide to scope, sampling, consent, facilitation, analysis, and reporting for small community studies.',
    '2025-09-22',
    'sarah-chen',
    ['research-practice', 'community-engagement'],
    'A listening study is only as good as its follow-up. Before inviting people to speak, the institution should know who will read the findings, what decisions they can influence, and how participants will hear what happened.',
    'Do not ask people to speak if you are not prepared to act on what you hear.',
  ],
  [
    'Leadership Formation in Community',
    'leadership-formation-in-community',
    'How leadership is formed through relationships, shared practice, and the communities that hold leaders accountable.',
    '2025-09-08',
    'marcus-bell',
    ['leadership', 'community-engagement'],
    'Leadership is often described as an individual attribute, but it is formed in relationships. The habits that make a leader trustworthy are learned in communities that expect explanation, correction, and repair.',
    'No one becomes a good leader alone.',
  ],
];

export const sampleArticles: SeedArticle[] = ARTICLE_ROWS.map(
  ([
    Title,
    Slug,
    Description,
    Published,
    authorSlug,
    topicSlugs,
    body,
    quote,
  ]) => ({
    Title,
    Slug,
    Description,
    Published,
    authorSlug,
    topicSlugs,
    body,
    quote,
  }),
);
