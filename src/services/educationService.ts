import type {
  EducationArticle,
  EducationCategory,
  EducationContent,
  EducationQuiz,
  QuizGradeResult,
} from "../types/education";
import type { LanguageCode } from "../utils/i18n";

const cachedContent: Partial<Record<LanguageCode, EducationContent>> = {};

function getContentFile(language: LanguageCode) {
  const suffix = language.toUpperCase();
  return `/data/education_content_${suffix}.json`;
}

async function getContent(language: LanguageCode = "en"): Promise<EducationContent> {
  if (cachedContent[language]) {
    return cachedContent[language];
  }

  const response = await fetch(getContentFile(language));
  if (!response.ok) {
    throw new Error("Education content could not be loaded.");
  }

  cachedContent[language] = (await response.json()) as EducationContent;
  return cachedContent[language];
}

export async function getEducationContent(language: LanguageCode = "en") {
  return getContent(language);
}

export async function getCategories(language: LanguageCode = "en"): Promise<EducationCategory[]> {
  return (await getContent(language)).categories;
}

export async function getArticlesByCategory(
  categoryId: string,
  language: LanguageCode = "en",
): Promise<EducationArticle[]> {
  const content = await getContent(language);
  return content.articles.filter((article) => article.category_id === categoryId);
}

export async function getArticleById(
  id: string,
  language: LanguageCode = "en",
): Promise<EducationArticle | null> {
  const content = await getContent(language);
  return content.articles.find((article) => article.id === id) ?? null;
}

export async function getAllQuizzes(language: LanguageCode = "en"): Promise<EducationQuiz[]> {
  return (await getContent(language)).quizzes;
}

export async function getQuiz(
  quizId: string,
  language: LanguageCode = "en",
): Promise<EducationQuiz | null> {
  const content = await getContent(language);
  return content.quizzes.find((quiz) => quiz.id === quizId) ?? null;
}

export async function getDailyTip(language: LanguageCode = "en", date = new Date()) {
  const content = await getContent(language);
  const daySeed = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  return content.daily_tips[daySeed % content.daily_tips.length];
}

export function gradeQuiz(
  quiz: EducationQuiz,
  answers: Record<string, string>,
): QuizGradeResult {
  let correct = 0;

  const results = quiz.questions.map((question) => {
    const userAnswer = answers[question.id];
    const isCorrect = userAnswer === question.correct_answer;
    if (isCorrect) {
      correct += 1;
    }

    return {
      questionId: question.id,
      question: question.question,
      userAnswer,
      correctAnswer: question.correct_answer,
      isCorrect,
      explanation: question.explanation,
    };
  });

  const score = Math.round((correct / quiz.questions.length) * 100);

  return {
    score,
    correct,
    total: quiz.questions.length,
    passed: score >= quiz.pass_score,
    grade: score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F",
    results,
  };
}
