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
  bookmarkOutline,
  bookmark as bookmarkFilled,
  ribbonOutline,
  timeOutline,
  openOutline,
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
  EducationProgress,
} from "../../types/education";
import ArticleDetail from "./ArticleDetail";
import DailyTip from "./DailyTip";
import QuizEngine from "./QuizEngine";
import { useAuth } from "../../contexts/AuthContext";
import { fetchUserProgress, markContentComplete, toggleBookmarkContent } from "../../services/educationProgressService";




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
    progressTitle: string;
    markComplete: string;
    completed: string;
    bookmark: string;
    bookmarked: string;
    favorites: string;
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
    doneLabel: string;
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
    progressTitle: "Votre progression",
    markComplete: "Marquer comme lu",
    completed: "Lu",
    bookmark: "Favoris",
    bookmarked: "Retirer des favoris",
    favorites: "Favoris",
    articleType: "Catégorie",
    close: "OK",
    regulations: "Références réglementaires",
    emergency: "Contacts d'urgence",
    submitQuiz: "Valider le quiz",
    retakeQuiz: "Recommencer",
    score: "Score",
    passed: "Réussi",
    tryAgain: "À revoir",
    loadingError: "Impossible de charger le contenu éducatif.",
    doneLabel: "Fait :",
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
    progressTitle: "Tiến độ của bạn",
    markComplete: "Đánh dấu đã đọc",
    completed: "Đã đọc",
    bookmark: "Yeu thich",
    bookmarked: "Bo yeu thich",
    favorites: "Yêu thích",
    articleType: "Danh mục",
    close: "OK",
    regulations: "Quy định tham khảo",
    emergency: "Liên hệ khẩn cấp",
    submitQuiz: "Nộp bài",
    retakeQuiz: "Làm lại",
    score: "Điểm",
    passed: "Đạt",
    tryAgain: "Cần ôn lại",
    loadingError: "Không thể tải nội dung giáo dục.",
    doneLabel: "Đã xong :",
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
    progressTitle: "Your progress",
    markComplete: "Mark complete",
    completed: "Complete",
    bookmark: "Favorite",
    bookmarked: "Remove favorite",
    favorites: "Favorites",
    articleType: "Category",
    close: "OK",
    regulations: "Regulation references",
    emergency: "Emergency contacts",
    submitQuiz: "Submit quiz",
    retakeQuiz: "Retake",
    score: "Score",
    passed: "Passed",
    tryAgain: "Review",
    loadingError: "Unable to load education content.",
    doneLabel: "Done:",
  },
};


function EducationPage() {
  const currentLanguage = getLanguage();
  const copy = labels[currentLanguage];
  const { user } = useAuth();
  const [content, setContent] = useState<EducationContent | null>(null);
  const [dailyTip, setDailyTip] = useState<DailyTipType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"articles" | "quizzes">("articles");
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<EducationQuiz | null>(null);
  const [progress, setProgress] = useState<EducationProgress>({ completedArticles: [], bookmarkedArticles: [], quizScores: {} });
  const [showAllRegulations, setShowAllRegulations] = useState(false);

  useEffect(() => {
    async function loadEducation() {
      try {
        const [educationContent, tip] = await Promise.all([
          getEducationContent(currentLanguage),
          getDailyTip(currentLanguage),
        ]);
        setContent(educationContent);
        setDailyTip(tip);
        
        if (user) {
          const userProgress = await fetchUserProgress(user.id);
          setProgress(userProgress);
        }
      } catch {
        setError(copy.loadingError);
      } finally {
        setLoading(false);
      }
    }

    loadEducation();
  }, [copy.loadingError, currentLanguage, user]);

  const categoriesById = useMemo(() => {
    return new Map((content?.categories ?? []).map((category) => [category.id, category]));
  }, [content]);

  const filteredArticles = useMemo(() => {
    return (content?.articles ?? []).filter((article) => {
      if (activeCategory === "favorites") {
        return progress.bookmarkedArticles.includes(article.id);
      }
      return activeCategory === "all" || article.category_id === activeCategory;
    });
  }, [activeCategory, content, progress.bookmarkedArticles]);

  const filteredQuizzes = useMemo(() => {
    return (content?.quizzes ?? []).filter((quiz) => {
      if (activeCategory === "favorites") {
        return progress.bookmarkedArticles.includes(quiz.id);
      }
      return activeCategory === "all" || quiz.category_id === activeCategory;
    });
  }, [activeCategory, content, progress.bookmarkedArticles]);

  async function markArticleComplete(articleId: string) {
    const isCurrentlyCompleted = progress.completedArticles.includes(articleId);
    const newCompletedState = !isCurrentlyCompleted;
    
    // Optimistic UI update
    setProgress(prev => ({
      ...prev,
      completedArticles: newCompletedState
        ? [...prev.completedArticles, articleId]
        : prev.completedArticles.filter((id) => id !== articleId),
    }));

    if (user) {
      await markContentComplete(user.id, articleId, "article", newCompletedState);
    }
  }

  async function toggleBookmark(contentId: string, contentType: "article" | "quiz") {
    const isCurrentlyBookmarked = progress.bookmarkedArticles.includes(contentId);
    const newBookmarkState = !isCurrentlyBookmarked;

    // Optimistic UI update
    setProgress(prev => ({
      ...prev,
      bookmarkedArticles: newBookmarkState
        ? [...prev.bookmarkedArticles, contentId]
        : prev.bookmarkedArticles.filter((id) => id !== contentId),
    }));

    if (user) {
      await toggleBookmarkContent(user.id, contentId, contentType, newBookmarkState);
    }
  }

  async function saveQuizScore(quizId: string, score: number) {
    const currentBest = progress.quizScores[quizId] ?? 0;
    const newBest = Math.max(currentBest, score);
    
    // Optimistic UI update
    setProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [quizId]: newBest,
      },
    }));

    if (user) {
      await markContentComplete(user.id, quizId, "quiz", true, newBest);
    }
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
            <div className="mb-5 grid auto-rows-fr grid-cols-1 items-stretch gap-4 md:grid-cols-2">
              {user && content && (
                <div className="flex h-full flex-col justify-between rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-600">
                        <IonIcon icon={bookOutline} className="text-[18px]" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-black tracking-tight text-gray-900">{copy.progressTitle}</h3>
                        <p className="mt-0.5 text-[13px] font-medium text-gray-500">
                          {completedCount}/{content.articles.length} articles • {quizCount}/{content.quizzes.length} quiz
                        </p>
                      </div>
                    </div>
                    <span className="text-[16px] font-black tracking-tighter text-gray-900">
                      {Math.round(((completedCount + quizCount) / (content.articles.length + content.quizzes.length)) * 100) || 0}%
                    </span>
                  </div>
                  
                  <div className="mt-4 h-[6px] w-full overflow-hidden rounded-full bg-gray-100">
                    <div 
                      className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-1000 ease-out"
                      style={{ width: `${Math.round(((completedCount + quizCount) / (content.articles.length + content.quizzes.length)) * 100) || 0}%` }}
                    />
                  </div>
                </div>
              )}

              {dailyTip ? <DailyTip tip={dailyTip} title={copy.dailyTip} /> : null}
            </div>

            <div className="my-4 rounded-[6px] bg-white px-4 py-1 shadow-sm">
              <IonSelect
                label={copy.articleType}
                labelPlacement="floating"
                interface="popover"
                value={activeCategory}
                onIonChange={(event) => setActiveCategory(event.detail.value)}
                className="font-bold text-gray-900"
                style={{ '--border-width': '0', '--border-color': 'transparent', '--padding-bottom': '0' } as React.CSSProperties}
              >
                <IonSelectOption value="all">{copy.all}</IonSelectOption>
                <IonSelectOption value="favorites">{copy.favorites}</IonSelectOption>
                {content.categories.map((category) => (
                  <IonSelectOption key={category.id} value={category.id}>
                    {category.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>



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
                  const isBookmarked = progress.bookmarkedArticles.includes(article.id);

                  return (
                    <IonCard key={article.id} className="m-0 rounded-xl border border-gray-100 [--background:white] bg-white shadow-none">
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

                        <h3 className="text-[18px] font-black tracking-tight leading-snug text-black" style={{ marginTop: '20px' }}>{article.title}</h3>
                        <p className="mt-2 line-clamp-3 text-[14px] font-normal leading-relaxed text-gray-500">
                          {article.summary}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-3 text-[12px] font-bold text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <IonIcon icon={timeOutline} /> {article.read_time_min} {copy.minRead}
                          </span>
                          <span className="inline-flex items-center gap-1 capitalize">
                            <IonIcon icon={bookOutline} /> {article.difficulty}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                          <IonButton size="small" onClick={() => setSelectedArticle(article)} className="font-bold [--border-radius:6px]">
                            {copy.read}
                          </IonButton>
                          <IonButton
                            fill="clear"
                            onClick={() => toggleBookmark(article.id, "article")}
                            className="m-0 h-8 w-8 [--border-radius:50%] [--padding-start:0] [--padding-end:0]"
                          >
                            <IonIcon 
                              icon={isBookmarked ? bookmarkFilled : bookmarkOutline} 
                              className={`text-[22px] transition-colors ${isBookmarked ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`} 
                            />
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
                  const isBookmarked = progress.bookmarkedArticles.includes(quiz.id);

                  return (
                    <IonCard key={quiz.id} className="m-0 rounded-xl border border-gray-100 [--background:white] bg-white shadow-none">
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

                        <h3 className="text-[18px] font-black tracking-tight leading-snug text-black" style={{ marginTop: '20px' }}>{quiz.title}</h3>
                        <p className="mt-2 text-[14px] font-normal leading-relaxed text-gray-500">
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

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                          <IonButton size="small" onClick={() => setSelectedQuiz(quiz)} className="font-bold [--border-radius:6px]">
                            {copy.startQuiz}
                          </IonButton>
                          <IonButton
                            fill="clear"
                            onClick={() => toggleBookmark(quiz.id, "quiz")}
                            className="m-0 h-8 w-8 [--border-radius:50%] [--padding-start:0] [--padding-end:0]"
                          >
                            <IonIcon 
                              icon={isBookmarked ? bookmarkFilled : bookmarkOutline} 
                              className={`text-[22px] transition-colors ${isBookmarked ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`} 
                            />
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  );
                })}
              </section>
            )}

            <section className="mt-6 grid grid-cols-1 gap-4 pb-8 md:grid-cols-2">
              <div>
                <h2 className="mb-3 text-[18px] font-extrabold text-black">{copy.regulations}</h2>
                <div className="grid gap-3">
                  {(showAllRegulations ? content.regulations_us : content.regulations_us.slice(0, 4)).map((regulation) => {
                    const hasUrl = Boolean(regulation.url);
                    return (
                      <IonCard 
                        key={regulation.code} 
                        className={`m-0 rounded-xl bg-white ${hasUrl ? 'shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]' : 'shadow-sm opacity-90'}`}
                        button={hasUrl} 
                        href={hasUrl ? regulation.url : undefined} 
                        target={hasUrl ? "_blank" : undefined} 
                        rel={hasUrl ? "noreferrer" : undefined}
                      >
                        <IonCardContent className="p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <strong className="block text-[14px] font-black text-gray-900">{regulation.code}</strong>
                              <span className="mt-1 block text-[13px] font-medium leading-snug text-gray-500">{regulation.title}</span>
                              {(regulation.authority || regulation.year) && (
                                <div className="mt-2 flex gap-2">
                                  {regulation.authority && (
                                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-bold tracking-wide text-gray-600">
                                      {regulation.authority}
                                    </span>
                                  )}
                                  {regulation.year && (
                                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-bold tracking-wide text-gray-600">
                                      {regulation.year}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            {hasUrl && (
                              <IonIcon icon={openOutline} className="mt-0.5 shrink-0 text-[16px] text-gray-400" />
                            )}
                          </div>
                        </IonCardContent>
                      </IonCard>
                    );
                  })}
                  
                  {!showAllRegulations && content.regulations_us.length > 4 && (
                    <IonButton 
                      fill="clear" 
                      onClick={() => setShowAllRegulations(true)} 
                      className="mt-1 font-bold [--border-radius:8px]"
                      style={{ '--background-hover': 'transparent', '--background-activated': 'transparent', '--background-focused': 'transparent', '--ripple-color': 'transparent' } as React.CSSProperties}
                    >
                      Voir les {content.regulations_us.length} réglementations
                    </IonButton>
                  )}
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-[18px] font-extrabold text-black">{copy.emergency}</h2>
                <div className="flex flex-col gap-5">
                  {Object.entries(content.emergency_contacts_us).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-[12px] font-semibold capitalize text-gray-500">
                        {key.replaceAll("_", " ")}
                      </span>
                      <strong className="mt-0.5 break-words text-[14px] font-black text-gray-900">
                        {value}
                      </strong>
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
              onToggleBookmark={(id) => toggleBookmark(id, "article")}
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
