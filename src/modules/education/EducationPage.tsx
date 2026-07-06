import { useEffect, useMemo, useState } from "react";
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonToolbar,
} from "@ionic/react";
import {
  alertCircleOutline,
  bookOutline,
  ribbonOutline,
  timeOutline,
} from "ionicons/icons";
import LogoutButton from "../../components/LogoutButton";
import LanguageButton from "../../components/LanguageButton";
import { getDailyTip, getEducationContent } from "../../services/educationService";
import { getLanguage, t, type LanguageCode } from "../../utils/i18n";
import type {
  DailyTip as DailyTipType,
  EducationArticle,
  EducationContent,
  EducationQuiz,
} from "../../types/education";
import ArticleDetail from "./ArticleDetail";
import CategoryList from "./CategoryList";
import DailyTip from "./DailyTip";
import QuizEngine from "./QuizEngine";

type EducationProgress = {
  completedArticles: string[];
  bookmarkedArticles: string[];
  quizScores: Record<string, number>;
};

const progressStorageKey = "foodsafe_education_progress";

const labels: Record<
  LanguageCode,
  {
    all: string;
    articles: string;
    quizzes: string;
    dailyTip: string;
    categories: string;
    read: string;
    minRead: string;
    startQuiz: string;
    questions: string;
    passScore: string;
    markComplete: string;
    completed: string;
    bookmark: string;
    bookmarked: string;
    articleType: string;
    close: string;
    regulations: string;
    emergency: string;
    submitQuiz: string;
    retakeQuiz: string;
    score: string;
    passed: string;
    tryAgain: string;
    loadingError: string;
  }
> = {
  fr: {
    all: "Tout",
    articles: "Articles",
    quizzes: "Quiz",
    dailyTip: "Conseil du jour",
    categories: "Catégories",
    read: "Lire",
    minRead: "min",
    startQuiz: "Commencer",
    questions: "questions",
    passScore: "score requis",
    markComplete: "Marquer comme lu",
    completed: "Lu",
    bookmark: "Favoris",
    bookmarked: "Retirer des favoris",
    articleType: "Type d'article",
    close: "OK",
    regulations: "Références réglementaires",
    emergency: "Contacts d'urgence",
    submitQuiz: "Valider le quiz",
    retakeQuiz: "Recommencer",
    score: "Score",
    passed: "Réussi",
    tryAgain: "À revoir",
    loadingError: "Impossible de charger le contenu éducatif.",
  },
  vi: {
    all: "Tất cả",
    articles: "Bài học",
    quizzes: "Quiz",
    dailyTip: "Mẹo hôm nay",
    categories: "Danh mục",
    read: "Đọc",
    minRead: "phút",
    startQuiz: "Bắt đầu",
    questions: "câu hỏi",
    passScore: "điểm đạt",
    markComplete: "Đánh dấu đã đọc",
    completed: "Đã đọc",
    bookmark: "Yeu thich",
    bookmarked: "Bo yeu thich",
    articleType: "Loai bai",
    close: "OK",
    regulations: "Quy định tham khảo",
    emergency: "Liên hệ khẩn cấp",
    submitQuiz: "Nộp bài",
    retakeQuiz: "Làm lại",
    score: "Điểm",
    passed: "Đạt",
    tryAgain: "Cần ôn lại",
    loadingError: "Không thể tải nội dung giáo dục.",
  },
  en: {
    all: "All",
    articles: "Articles",
    quizzes: "Quizzes",
    dailyTip: "Daily tip",
    categories: "Categories",
    read: "Read",
    minRead: "min read",
    startQuiz: "Start",
    questions: "questions",
    passScore: "pass score",
    markComplete: "Mark complete",
    completed: "Complete",
    bookmark: "Favorite",
    bookmarked: "Remove favorite",
    articleType: "Article type",
    close: "OK",
    regulations: "Regulation references",
    emergency: "Emergency contacts",
    submitQuiz: "Submit quiz",
    retakeQuiz: "Retake",
    score: "Score",
    passed: "Passed",
    tryAgain: "Review",
    loadingError: "Unable to load education content.",
  },
};

function readProgress(): EducationProgress {
  try {
    const saved = window.localStorage.getItem(progressStorageKey);
    if (!saved) {
      return { completedArticles: [], bookmarkedArticles: [], quizScores: {} };
    }
    return JSON.parse(saved) as EducationProgress;
  } catch {
    return { completedArticles: [], bookmarkedArticles: [], quizScores: {} };
  }
}

function saveProgress(progress: EducationProgress) {
  window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
}

function EducationPage() {
  const currentLanguage = getLanguage();
  const copy = labels[currentLanguage];
  const [content, setContent] = useState<EducationContent | null>(null);
  const [dailyTip, setDailyTip] = useState<DailyTipType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"articles" | "quizzes">("articles");
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<EducationQuiz | null>(null);
  const [progress, setProgress] = useState<EducationProgress>(() => readProgress());

  useEffect(() => {
    async function loadEducation() {
      try {
        const [educationContent, tip] = await Promise.all([
          getEducationContent(currentLanguage),
          getDailyTip(currentLanguage),
        ]);
        setContent(educationContent);
        setDailyTip(tip);
      } catch {
        setError(copy.loadingError);
      } finally {
        setLoading(false);
      }
    }

    loadEducation();
  }, [copy.loadingError, currentLanguage]);

  const categoriesById = useMemo(() => {
    return new Map((content?.categories ?? []).map((category) => [category.id, category]));
  }, [content]);

  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (content?.articles ?? []).filter((article) => {
      const matchesCategory = activeCategory === "all" || article.category_id === activeCategory;
      const matchesSearch =
        normalized.length === 0 ||
        article.title.toLowerCase().includes(normalized) ||
        article.summary.toLowerCase().includes(normalized) ||
        article.tags?.some((tag) => tag.toLowerCase().includes(normalized));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, content, query]);

  const filteredQuizzes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (content?.quizzes ?? []).filter((quiz) => {
      const matchesCategory = activeCategory === "all" || quiz.category_id === activeCategory;
      const matchesSearch =
        normalized.length === 0 ||
        quiz.title.toLowerCase().includes(normalized) ||
        quiz.difficulty.toLowerCase().includes(normalized);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, content, query]);

  function updateProgress(nextProgress: EducationProgress) {
    setProgress(nextProgress);
    saveProgress(nextProgress);
  }

  function toggleBookmark(articleId: string) {
    const bookmarked = progress.bookmarkedArticles.includes(articleId);
    updateProgress({
      ...progress,
      bookmarkedArticles: bookmarked
        ? progress.bookmarkedArticles.filter((id) => id !== articleId)
        : [...progress.bookmarkedArticles, articleId],
    });
  }

  function markArticleComplete(articleId: string) {
    const completed = progress.completedArticles.includes(articleId);
    updateProgress({
      ...progress,
      completedArticles: completed
        ? progress.completedArticles.filter((id) => id !== articleId)
        : [...progress.completedArticles, articleId],
    });
  }

  function saveQuizScore(quizId: string, score: number) {
    updateProgress({
      ...progress,
      quizScores: {
        ...progress.quizScores,
        [quizId]: Math.max(progress.quizScores[quizId] ?? 0, score),
      },
    });
  }

  const completedCount = progress.completedArticles.length;
  const quizCount = Object.keys(progress.quizScores).length;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <div className="flex items-center justify-between px-[18px] py-[10px]">
            <div>
              <h1 className="m-0 text-[24px] font-black leading-tight text-black">
                {t("educationTitle", currentLanguage)}
              </h1>
              <p className="mt-1 text-[13px] font-semibold text-gray-400">
                {completedCount} {copy.articles.toLowerCase()} · {quizCount} {copy.quizzes.toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <LanguageButton />
              <LogoutButton />
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="[--background:var(--color-surface)]">
        {loading ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <IonSpinner name="crescent" />
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-gray-500">
            <IonIcon icon={alertCircleOutline} className="text-3xl text-red-600" />
            <p className="font-semibold">{error}</p>
          </div>
        ) : content ? (
          <main className="mx-auto max-w-[980px] px-[18px] py-4">
            {dailyTip ? <DailyTip tip={dailyTip} title={copy.dailyTip} /> : null}

            <IonSearchbar
              value={query}
              placeholder={t("searchPlaceholder", currentLanguage)}
              debounce={150}
              onIonInput={(event) => setQuery(event.detail.value ?? "")}
              className="my-3 p-0 [--background:white] [--border-radius:6px]"
            />

            <div className="mb-4 rounded-[6px] bg-white px-4 py-1 shadow-sm">
              <IonSelect
                label={copy.articleType}
                labelPlacement="floating"
                interface="popover"
                value={activeCategory}
                onIonChange={(event) => setActiveCategory(event.detail.value)}
                className="font-bold text-gray-900"
              >
                <IonSelectOption value="all">{copy.all}</IonSelectOption>
                {content.categories.map((category) => (
                  <IonSelectOption key={category.id} value={category.id}>
                    {category.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>

            <CategoryList
              categories={content.categories}
              activeCategory={activeCategory}
              allLabel={copy.all}
              title={copy.categories}
              onSelect={setActiveCategory}
            />

            <IonSegment
              value={viewMode}
              onIonChange={(event) => setViewMode(event.detail.value as "articles" | "quizzes")}
              className="my-4 rounded-[6px] bg-white"
            >
              <IonSegmentButton value="articles">{copy.articles}</IonSegmentButton>
              <IonSegmentButton value="quizzes">{copy.quizzes}</IonSegmentButton>
            </IonSegment>

            {viewMode === "articles" ? (
              <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredArticles.map((article) => {
                  const category = categoriesById.get(article.category_id);
                  const complete = progress.completedArticles.includes(article.id);
                  const bookmarked = progress.bookmarkedArticles.includes(article.id);

                  return (
                    <IonCard key={article.id} className="m-0 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <IonCardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className="rounded-[6px] px-2 py-1 text-[12px] font-extrabold text-white"
                            style={{ background: category?.color ?? "var(--color-primary)" }}
                          >
                            {category?.name ?? article.category_id}
                          </span>
                          {complete ? (
                            <IonBadge color="success" className="rounded-[6px] px-2 py-1">
                              {copy.completed}
                            </IonBadge>
                          ) : null}
                        </div>

                        <h3 className="mt-3 text-[17px] font-black leading-snug text-gray-950">{article.title}</h3>
                        <p className="mt-2 line-clamp-3 text-[14px] font-medium leading-relaxed text-gray-600">
                          {article.summary}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-3 text-[12px] font-bold text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <IonIcon icon={timeOutline} /> {article.read_time_min} {copy.minRead}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <IonIcon icon={bookOutline} /> {article.difficulty}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <IonButton size="small" onClick={() => setSelectedArticle(article)} className="font-bold [--border-radius:6px]">
                            {copy.read}
                          </IonButton>
                          <IonButton size="small" fill="clear" onClick={() => toggleBookmark(article.id)} className="font-bold [--border-radius:6px]">
                            {bookmarked ? copy.bookmarked : copy.bookmark}
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  );
                })}
              </section>
            ) : (
              <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredQuizzes.map((quiz) => {
                  const category = categoriesById.get(quiz.category_id);
                  const bestScore = progress.quizScores[quiz.id];

                  return (
                    <IonCard key={quiz.id} className="m-0 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <IonCardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className="rounded-[6px] px-2 py-1 text-[12px] font-extrabold text-white"
                            style={{ background: category?.color ?? "var(--color-primary)" }}
                          >
                            {category?.name ?? quiz.category_id}
                          </span>
                          {bestScore !== undefined ? (
                            <IonBadge
                              color={bestScore >= quiz.pass_score ? "success" : "warning"}
                              className="rounded-[6px] px-2 py-1"
                            >
                              {bestScore}%
                            </IonBadge>
                          ) : null}
                        </div>

                        <h3 className="mt-3 text-[17px] font-black leading-snug text-gray-950">{quiz.title}</h3>
                        <p className="mt-2 text-[14px] font-medium leading-relaxed text-gray-600">
                          {quiz.question_count} {copy.questions} · {quiz.pass_score}% {copy.passScore}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-3 text-[12px] font-bold text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <IonIcon icon={timeOutline} /> {Math.round(quiz.time_limit_seconds / 60)} min
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <IonIcon icon={ribbonOutline} /> {quiz.difficulty}
                          </span>
                        </div>

                        <IonButton size="small" onClick={() => setSelectedQuiz(quiz)} className="mt-4 font-bold [--border-radius:6px]">
                          {copy.startQuiz}
                        </IonButton>
                      </IonCardContent>
                    </IonCard>
                  );
                })}
              </section>
            )}

            <section className="mt-6 grid grid-cols-1 gap-4 pb-8 md:grid-cols-2">
              <div>
                <h2 className="mb-3 text-[18px] font-extrabold text-black">{copy.regulations}</h2>
                <div className="grid gap-2">
                  {content.regulations_us.slice(0, 4).map((regulation) => (
                    <a
                      key={regulation.code}
                      href={regulation.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-white px-4 py-3 text-gray-900 no-underline shadow-sm"
                    >
                      <strong className="block text-[14px] font-black">{regulation.code}</strong>
                      <span className="mt-1 block text-[13px] font-medium leading-snug text-gray-500">{regulation.title}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-[18px] font-extrabold text-black">{copy.emergency}</h2>
                <div className="grid gap-2">
                  {Object.entries(content.emergency_contacts_us).map(([key, value]) => (
                    <div key={key} className="rounded-xl bg-white px-4 py-3 shadow-sm">
                      <span className="block text-[12px] font-bold capitalize text-gray-400">
                        {key.replaceAll("_", " ")}
                      </span>
                      <strong className="mt-1 block break-words text-[14px] font-black text-gray-900">{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        ) : null}

        <IonModal isOpen={Boolean(selectedArticle)} onDidDismiss={() => setSelectedArticle(null)}>
          {selectedArticle ? (
            <ArticleDetail
              article={selectedArticle}
              categoryName={categoriesById.get(selectedArticle.category_id)?.name}
              labels={copy}
              isCompleted={progress.completedArticles.includes(selectedArticle.id)}
              isBookmarked={progress.bookmarkedArticles.includes(selectedArticle.id)}
              onBack={() => setSelectedArticle(null)}
              onMarkComplete={markArticleComplete}
              onToggleBookmark={toggleBookmark}
            />
          ) : null}
        </IonModal>

        <IonModal isOpen={Boolean(selectedQuiz)} onDidDismiss={() => setSelectedQuiz(null)}>
          {selectedQuiz ? (
            <QuizEngine
              quiz={selectedQuiz}
              labels={copy}
              onBack={() => setSelectedQuiz(null)}
              onScore={saveQuizScore}
            />
          ) : null}
        </IonModal>
      </IonContent>
    </IonPage>
  );
}

export default EducationPage;
