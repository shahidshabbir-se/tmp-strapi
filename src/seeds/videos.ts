export interface SeedVideo {
  Title: string;
  slug: string;
  Description: string;
  Published: string;
  externalUrl: string;
  topicSlugs: string[];
}

export interface SeedPlaylist {
  title: string;
  slug: string;
  description: string;
  videoSlugs: string[];
}

type VideoTuple = [
  Title: string,
  slug: string,
  Description: string,
  Published: string,
  externalUrl: string,
  topicSlugs: string[],
];

const VIDEO_ROWS: VideoTuple[] = [
  [
    'Lecture 1: The Moral Foundations of Leadership',
    'lecture-1-moral-foundations-of-leadership',
    'Opening lecture establishing the ethical vocabulary the series builds on: duty, discernment, and accountability in institutional life.',
    '2025-01-14T15:00:00.000Z',
    'https://www.youtube.com/watch?v=zkPUdDDwL8Y',
    ['leadership', 'governance-ethics'],
  ],
  [
    'Lecture 2: Discernment Under Pressure',
    'lecture-2-discernment-under-pressure',
    'How leaders reason when time is short and stakes are high, with case studies drawn from public-sector and nonprofit decision-making.',
    '2025-01-21T15:00:00.000Z',
    'https://www.youtube.com/watch?v=1aA1WGON49E',
    ['leadership', 'research-practice'],
  ],
  [
    'Lecture 3: Accountability Across Institutions',
    'lecture-3-accountability-across-institutions',
    'Tracing accountability from individual conscience to board oversight, including the fiduciary obligations of trustees.',
    '2025-01-28T15:00:00.000Z',
    'https://vimeo.com/76979871',
    ['governance-ethics'],
  ],
  [
    'Lecture 4: Fiduciary Duty and Board Stewardship',
    'lecture-4-fiduciary-duty-and-board-stewardship',
    'A close reading of fiduciary duty in practice: loyalty, care, disclosure, and the discipline of asking hard questions early.',
    '2025-02-04T15:00:00.000Z',
    'https://www.youtube.com/watch?v=aircAruvnKk',
    ['governance-ethics', 'leadership'],
  ],
  [
    'Lecture 5: Leadership Formation in Community',
    'lecture-5-leadership-formation-in-community',
    'How leadership is formed through relationships, shared practice, and the communities that hold leaders accountable.',
    '2025-02-11T15:00:00.000Z',
    'https://www.youtube.com/watch?v=arj7oStGLkU',
    ['leadership', 'community-engagement'],
  ],
  [
    'Convening Panel: Building Coalitions Across Difference',
    'convening-panel-coalitions-across-difference',
    'Recorded roundtable with community partners on sustaining coalitions without erasing the differences that make them valuable.',
    '2025-03-06T17:30:00.000Z',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    ['community-engagement', 'convenings-dialogue'],
  ],
  [
    'Convening Panel: Faith Communities and Public Responsibility',
    'convening-panel-faith-communities-public-responsibility',
    'A multi-faith conversation on civic responsibility, public reason, and the role of religious institutions in plural societies.',
    '2025-03-13T17:30:00.000Z',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    ['faith-public-life', 'community-engagement'],
  ],
  [
    'Convening Panel: Institutional Trust After Failure',
    'convening-panel-institutional-trust-after-failure',
    'Practitioners discuss how institutions rebuild trust after public failures, including apology, repair, and structural change.',
    '2025-03-20T17:30:00.000Z',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    ['institutional-design', 'governance-ethics'],
  ],
  [
    'Convening Panel: Listening as Leadership',
    'convening-panel-listening-as-leadership',
    'Community organizers and board members explore listening as a governance practice rather than a public-relations exercise.',
    '2025-03-27T17:30:00.000Z',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    ['community-engagement', 'leadership'],
  ],
  [
    'Fellow Spotlight: Evaluating Inclusive Leadership',
    'fellow-spotlight-evaluating-inclusive-leadership',
    'A research fellow walks through the survey instruments and benchmarking metrics behind the center’s belonging study.',
    '2025-02-18T16:00:00.000Z',
    'https://www.youtube.com/watch?v=aircAruvnKk',
    ['diversity-equity-inclusion', 'research-practice'],
  ],
  [
    'Fellow Spotlight: Mission Drift in Mission-Driven Organizations',
    'fellow-spotlight-mission-drift',
    'How organizations detect mission drift and reconnect budget, strategy, and governance to their founding purpose.',
    '2025-04-08T16:00:00.000Z',
    'https://www.youtube.com/watch?v=arj7oStGLkU',
    ['institutional-design', 'governance-ethics'],
  ],
  [
    'Fellow Spotlight: Measuring What Communities Value',
    'fellow-spotlight-measuring-what-communities-value',
    'A conversation about evaluation methods that are useful to the people being measured, not only to funders.',
    '2025-04-15T16:00:00.000Z',
    'https://vimeo.com/76979871',
    ['research-practice', 'community-engagement'],
  ],
  [
    'Governance Essentials: Running a Board Meeting That Decides Something',
    'governance-essentials-running-a-board-meeting',
    'A practical session on agendas, consent items, deliberation, minutes, and the difference between discussion and decision.',
    '2025-05-06T15:00:00.000Z',
    'https://www.youtube.com/watch?v=zkPUdDDwL8Y',
    ['governance-ethics', 'leadership'],
  ],
  [
    'Governance Essentials: Conflicts of Interest and Recusal',
    'governance-essentials-conflicts-of-interest',
    'How boards identify conflicts early, document recusals, and protect the integrity of deliberation.',
    '2025-05-13T15:00:00.000Z',
    'https://www.youtube.com/watch?v=1aA1WGON49E',
    ['governance-ethics'],
  ],
  [
    'Governance Essentials: Reading Financial Statements as a Trustee',
    'governance-essentials-reading-financial-statements',
    'A trustee-level introduction to reserves, restricted funds, cash flow, and the questions a board should ask before approving a budget.',
    '2025-05-20T15:00:00.000Z',
    'https://www.youtube.com/watch?v=aircAruvnKk',
    ['governance-ethics', 'institutional-design'],
  ],
  [
    'Governance Essentials: Succession Planning Without Panic',
    'governance-essentials-succession-planning',
    'How boards plan for leadership transitions, build a pipeline, and avoid last-minute appointments that weaken accountability.',
    '2025-05-27T15:00:00.000Z',
    'https://www.youtube.com/watch?v=arj7oStGLkU',
    ['leadership', 'governance-ethics'],
  ],
  [
    'Research in Practice: Designing a Listening Study',
    'research-in-practice-designing-a-listening-study',
    'A step-by-step walkthrough of scope, sampling, consent, facilitation, analysis, and reporting for small community studies.',
    '2025-06-10T15:00:00.000Z',
    'https://vimeo.com/76979871',
    ['research-practice', 'community-engagement'],
  ],
  [
    'Research in Practice: From Findings to Decisions',
    'research-in-practice-from-findings-to-decisions',
    'How to turn research findings into governance decisions without flattening the nuance that made the research useful.',
    '2025-06-17T15:00:00.000Z',
    'https://www.youtube.com/watch?v=zkPUdDDwL8Y',
    ['research-practice', 'institutional-design'],
  ],
  [
    'Research in Practice: Evaluating Belonging Over Time',
    'research-in-practice-evaluating-belonging-over-time',
    'Longitudinal approaches to belonging, including repeated measures, qualitative follow-up, and retention analysis.',
    '2025-06-24T15:00:00.000Z',
    'https://www.youtube.com/watch?v=1aA1WGON49E',
    ['diversity-equity-inclusion', 'research-practice'],
  ],
  [
    'Research in Practice: Writing Public Scholarship That Lasts',
    'research-in-practice-writing-public-scholarship',
    'How researchers write for public audiences without sacrificing accuracy, uncertainty, or the voices of the people they studied.',
    '2025-07-01T15:00:00.000Z',
    'https://www.youtube.com/watch?v=aircAruvnKk',
    ['research-practice', 'leadership'],
  ],
];

export const sampleVideos: SeedVideo[] = VIDEO_ROWS.map(
  ([Title, slug, Description, Published, externalUrl, topicSlugs]) => ({
    Title,
    slug,
    Description,
    Published,
    externalUrl,
    topicSlugs,
  }),
);

export const samplePlaylists: SeedPlaylist[] = [
  {
    title: 'Moral Leadership Lecture Series',
    slug: 'moral-leadership-lecture-series',
    description:
      'A five-part lecture series on the ethical foundations of institutional leadership, from first principles through board accountability and formation in community.',
    videoSlugs: [
      'lecture-1-moral-foundations-of-leadership',
      'lecture-2-discernment-under-pressure',
      'lecture-3-accountability-across-institutions',
      'lecture-4-fiduciary-duty-and-board-stewardship',
      'lecture-5-leadership-formation-in-community',
    ],
  },
  {
    title: 'Convenings & Community Dialogue',
    slug: 'convenings-community-dialogue',
    description:
      'Recorded convenings, panels, and partner conversations on coalition-building and inclusive practice.',
    videoSlugs: [
      'convening-panel-coalitions-across-difference',
      'convening-panel-faith-communities-public-responsibility',
      'convening-panel-institutional-trust-after-failure',
      'convening-panel-listening-as-leadership',
    ],
  },
  {
    title: 'Governance Essentials',
    slug: 'governance-essentials',
    description:
      'Practical board sessions on meetings, conflicts of interest, financial oversight, and succession.',
    videoSlugs: [
      'governance-essentials-running-a-board-meeting',
      'governance-essentials-conflicts-of-interest',
      'governance-essentials-reading-financial-statements',
      'governance-essentials-succession-planning',
    ],
  },
  {
    title: 'Research in Practice',
    slug: 'research-in-practice',
    description:
      'Methods-focused conversations on listening studies, evaluation, belonging, and public scholarship.',
    videoSlugs: [
      'research-in-practice-designing-a-listening-study',
      'research-in-practice-from-findings-to-decisions',
      'research-in-practice-evaluating-belonging-over-time',
      'research-in-practice-writing-public-scholarship',
    ],
  },
  {
    title: 'Fellow Spotlights',
    slug: 'fellow-spotlights',
    description:
      'Short conversations with research fellows about the questions driving their work.',
    videoSlugs: [
      'fellow-spotlight-evaluating-inclusive-leadership',
      'fellow-spotlight-mission-drift',
      'fellow-spotlight-measuring-what-communities-value',
    ],
  },
];
