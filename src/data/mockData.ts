export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  coverImage: string;
  featured: boolean;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  readTime: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  album: string;
  uploadedAt: string;
}

export const categories = [
  'News', 'Opinion', 'Education', 'Culture', 'Science', 'Technology', 'Politics'
];

export const articles: Article[] = [
  {
    id: '1',
    title: 'The Future of Higher Education in Africa: A New Dawn',
    slug: 'future-higher-education-africa',
    excerpt: 'Exploring the transformative shifts reshaping universities across the continent and their impact on the next generation of leaders.',
    content: `The landscape of higher education across Africa is undergoing a profound transformation. Universities that once operated under rigid, colonial-era frameworks are now embracing innovation, technology, and indigenous knowledge systems to create more relevant and impactful learning experiences.\n\nThis shift is not merely cosmetic. It represents a fundamental rethinking of what education means in the African context — one that prioritizes critical thinking, entrepreneurship, and community engagement alongside traditional academic rigor.\n\nAs we look to the future, several key trends are emerging that will shape the trajectory of higher education on the continent for decades to come.`,
    category: 'Education',
    author: 'Dr. Amara Osei',
    authorRole: 'Senior Editor',
    publishedAt: '2026-02-08',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1200&q=80',
    featured: true,
    status: 'published',
    readTime: '8 min read',
  },
  {
    id: '2',
    title: 'Climate Action and the Role of Academic Research',
    slug: 'climate-action-academic-research',
    excerpt: 'How universities are leading the charge in climate research and what it means for policy-making across developing nations.',
    content: 'Universities have long been at the forefront of scientific discovery. Today, their role in climate research is more critical than ever as nations grapple with the realities of a changing planet.',
    category: 'Science',
    author: 'Prof. Kwame Mensah',
    authorRole: 'Contributing Writer',
    publishedAt: '2026-02-07',
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80',
    featured: true,
    status: 'published',
    readTime: '6 min read',
  },
  {
    id: '3',
    title: 'Digital Transformation in Newsrooms Across the Globe',
    slug: 'digital-transformation-newsrooms',
    excerpt: 'From AI-powered editing tools to data journalism, newsrooms are evolving faster than ever before.',
    content: 'The modern newsroom looks nothing like its predecessor from even a decade ago. Digital tools have fundamentally changed how stories are discovered, reported, and distributed.',
    category: 'Technology',
    author: 'Fatima Bello',
    authorRole: 'Tech Correspondent',
    publishedAt: '2026-02-06',
    coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=1200&q=80',
    featured: false,
    status: 'published',
    readTime: '5 min read',
  },
  {
    id: '4',
    title: 'The Renaissance of African Literature in Modern Publishing',
    slug: 'renaissance-african-literature',
    excerpt: 'A new wave of African authors is reshaping the global literary landscape with powerful, authentic narratives.',
    content: 'African literature is experiencing a renaissance. A new generation of writers is emerging, bringing fresh perspectives and challenging long-held narratives about the continent.',
    category: 'Culture',
    author: 'Chinwe Adaeze',
    authorRole: 'Culture Editor',
    publishedAt: '2026-02-05',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
    featured: true,
    status: 'published',
    readTime: '7 min read',
  },
  {
    id: '5',
    title: 'Youth Engagement in Democratic Processes: A Growing Trend',
    slug: 'youth-engagement-democratic-processes',
    excerpt: 'Young people across the continent are increasingly making their voices heard in governance and civic life.',
    content: 'The political landscape is shifting as young people take a more active role in democratic processes. From voter registration drives to running for office, youth engagement is at an all-time high.',
    category: 'Politics',
    author: 'Samuel Okoro',
    authorRole: 'Political Analyst',
    publishedAt: '2026-02-04',
    coverImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80',
    featured: false,
    status: 'published',
    readTime: '6 min read',
  },
  {
    id: '6',
    title: 'Editorial: The Power of Independent Press in Shaping Society',
    slug: 'power-independent-press',
    excerpt: 'Why independent journalism remains the cornerstone of a healthy democracy and informed citizenry.',
    content: 'In an age of misinformation and media consolidation, independent press organizations play an increasingly vital role in holding power to account and informing the public.',
    category: 'Opinion',
    author: 'Editorial Board',
    authorRole: 'UPEBSA Editorial',
    publishedAt: '2026-02-03',
    coverImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80',
    featured: false,
    status: 'published',
    readTime: '4 min read',
  },
];

export const galleryImages: GalleryImage[] = [
  { id: '1', src: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&q=80', alt: 'Campus life', album: 'Campus', uploadedAt: '2026-02-01' },
  { id: '2', src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=80', alt: 'Student conference', album: 'Events', uploadedAt: '2026-02-01' },
  { id: '3', src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', alt: 'Lecture hall', album: 'Campus', uploadedAt: '2026-01-28' },
  { id: '4', src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80', alt: 'Graduation ceremony', album: 'Events', uploadedAt: '2026-01-25' },
  { id: '5', src: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600&q=80', alt: 'Study group', album: 'Campus', uploadedAt: '2026-01-20' },
  { id: '6', src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80', alt: 'Workshop session', album: 'Events', uploadedAt: '2026-01-18' },
  { id: '7', src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80', alt: 'Library collection', album: 'Campus', uploadedAt: '2026-01-15' },
  { id: '8', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', alt: 'Award ceremony', album: 'Events', uploadedAt: '2026-01-12' },
];

export const adminStats = {
  totalArticles: 156,
  publishedArticles: 132,
  pendingReview: 8,
  totalWriters: 24,
  totalViews: 45230,
  thisMonthViews: 8420,
};

export const writerStats = {
  totalArticles: 18,
  published: 14,
  drafts: 2,
  pending: 1,
  rejected: 1,
  totalViews: 3240,
};
