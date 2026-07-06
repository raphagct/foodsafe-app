import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import {
  arrowBackOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  ribbonOutline,
  timeOutline,
} from "ionicons/icons";
import { useMemo, useState } from "react";
import { gradeQuiz } from "../../services/educationService";
import type { EducationQuiz, QuizGradeResult } from "../../types/education";

type QuizEngineLabels = {
  questions: string;
  passScore: string;
  submitQuiz: string;
  retakeQuiz: string;
  score: string;
  passed: string;
  tryAgain: string;
};

type QuizEngineProps = {
  quiz: EducationQuiz;
  labels: QuizEngineLabels;
  onBack: () => void;
  onScore: (quizId: string, score: number) => void;
};

function getOptionLetter(option: string) {
  return option.split(".")[0].trim();
}

function QuizEngine({ quiz, labels, onBack, onScore }: QuizEngineProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizGradeResult | null>(null);

  const answeredCount = Object.keys(answers).length;
  const resultByQuestion = useMemo(() => {
    return new Map(result?.results.map((item) => [item.questionId, item]) ?? []);
  }, [result]);

  function submitQuiz() {
    const nextResult = gradeQuiz(quiz, answers);
    setResult(nextResult);
    onScore(quiz.id, nextResult.score);
  }

  function retakeQuiz() {
    setAnswers({});
    setResult(null);
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <div className="flex items-center gap-1 px-2 py-2">
            <IonButton fill="clear" onClick={onBack} aria-label="Back" className="[--border-radius:6px]">
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
            <span className="line-clamp-1 text-sm font-bold text-gray-500">{quiz.title}</span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="[--background:var(--color-surface)]">
        <section className="mx-auto flex max-w-[920px] flex-col gap-4 px-[18px] py-5">
          <div className="rounded-xl bg-white px-5 py-4 shadow-sm">
            <h2 className="text-[24px] font-black leading-tight text-gray-950">{quiz.title}</h2>
            <div className="mt-3 flex flex-wrap gap-3 text-[12px] font-bold text-gray-500">
              <span className="inline-flex items-center gap-1">
                <IonIcon icon={timeOutline} /> {Math.round(quiz.time_limit_seconds / 60)} min
              </span>
              <span className="inline-flex items-center gap-1">
                <IonIcon icon={ribbonOutline} /> {quiz.difficulty}
              </span>
              <span>{quiz.question_count} {labels.questions}</span>
              <span>{quiz.pass_score}% {labels.passScore}</span>
            </div>
          </div>

          {quiz.questions.map((question, questionIndex) => {
            const questionResult = resultByQuestion.get(question.id);
            return (
              <div key={question.id} className="rounded-xl bg-white px-4 py-4 shadow-sm">
                <h3 className="text-[16px] font-extrabold leading-snug text-gray-950">
                  {questionIndex + 1}. {question.question}
                </h3>
                <div className="mt-3 grid gap-2">
                  {question.options.map((option) => {
                    const letter = getOptionLetter(option);
                    const selected = answers[question.id] === letter;
                    const correct = Boolean(result && letter === question.correct_answer);
                    const wrong = Boolean(result && selected && letter !== question.correct_answer);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          if (!result) {
                            setAnswers({ ...answers, [question.id]: letter });
                          }
                        }}
                        className={`grid grid-cols-[20px_1fr] items-start gap-3 rounded-[6px] border px-3 py-2.5 text-left text-[14px] font-semibold leading-5 transition-colors ${
                          correct
                            ? "border-[var(--color-primary)] bg-[#e8f6ee] text-gray-950"
                            : wrong
                              ? "border-red-500 bg-red-50 text-gray-950"
                              : selected
                                ? "border-blue-500 bg-blue-50 text-gray-950"
                                : "border-gray-100 bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span
                          className={`mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            correct
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                              : wrong
                                ? "border-red-500 bg-red-500"
                                : selected
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300 bg-white"
                          }`}
                        >
                          {(selected || correct || wrong) && (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </span>
                        <span className="min-w-0 leading-5">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {questionResult ? (
                  <div className="mt-3 flex items-start gap-2 rounded-[6px] bg-gray-50 px-3 py-3">
                    <IonIcon
                      icon={questionResult.isCorrect ? checkmarkCircleOutline : closeCircleOutline}
                      className={questionResult.isCorrect ? "mt-0.5 text-xl text-[var(--color-primary)]" : "mt-0.5 text-xl text-red-600"}
                    />
                    <p className="text-[14px] font-medium leading-relaxed text-gray-700">{questionResult.explanation}</p>
                  </div>
                ) : null}
              </div>
            );
          })}

          {result ? (
            <div
              className={`rounded-xl border bg-white px-5 py-4 shadow-sm ${
                result.passed ? "border-[var(--color-primary)]" : "border-amber-500"
              }`}
            >
              <strong className="block text-[18px] font-black text-gray-950">
                {labels.score}: {result.score}% · {result.correct}/{result.total}
              </strong>
              <span className="mt-1 block text-sm font-bold text-gray-500">
                {result.passed ? labels.passed : labels.tryAgain} · Grade {result.grade}
              </span>
            </div>
          ) : null}

          <div className="pb-6">
            {result ? (
              <IonButton onClick={retakeQuiz} className="h-12 font-bold [--border-radius:6px]">
                {labels.retakeQuiz}
              </IonButton>
            ) : (
              <IonButton
                onClick={submitQuiz}
                disabled={answeredCount < quiz.questions.length}
                className="h-12 font-bold [--border-radius:6px]"
              >
                {labels.submitQuiz}
              </IonButton>
            )}
          </div>
        </section>
      </IonContent>
    </IonPage>
  );
}

export default QuizEngine;
