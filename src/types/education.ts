export type EducationCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  article_count: number;
};

export type EducationContentBlock = {
  type: string;
  text?: string;
  title?: string;
  description?: string;
  severity?: string;
  items?: unknown[];
  cards?: unknown[];
  stats?: unknown[];
  rows?: unknown[];
  columns?: string[];
  steps?: string[];
  tips?: string[];
  techniques?: string[];
  methods?: unknown[];
  zones?: unknown[];
};

export type EducationArticle = {
  id: string;
  category_id: string;
  title: string;
  summary: string;
  difficulty: string;
  read_time_min: number;
  content_blocks: EducationContentBlock[];
  related_articles?: string[];
  tags?: string[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
};

export type EducationQuiz = {
  id: string;
  title: string;
  category_id: string;
  difficulty: string;
  question_count: number;
  time_limit_seconds: number;
  pass_score: number;
  questions: QuizQuestion[];
};

export type DailyTip = {
  id: string;
  icon: string;
  text: string;
  category: string;
  fact?: string;
};

export type RegulationRef = {
  code: string;
  title: string;
  authority: string;
  url?: string;
  year?: number;
};

export type EducationContent = {
  categories: EducationCategory[];
  articles: EducationArticle[];
  quizzes: EducationQuiz[];
  daily_tips: DailyTip[];
  regulations_us: RegulationRef[];
  emergency_contacts_us: Record<string, string>;
};

export type QuizGradeResult = {
  score: number;
  correct: number;
  total: number;
  passed: boolean;
  grade: string;
  results: Array<{
    questionId: string;
    question: string;
    userAnswer?: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }>;
};

export type EducationProgress = {
  completedArticles: string[];
  bookmarkedArticles: string[];
  quizScores: Record<string, number>;
};
